const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const UserActivation = require('../model/user.model.js');
const { sendEmail } = require('../utils/SendMail.cjs');

exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const emailExists = await UserActivation.findOne({ email });
    if (emailExists && !emailExists.emailVerify && emailExists.emailTokenExpired < Date.now()) {
      await UserActivation.deleteOne({email});
    } else if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const usernameExists = await UserActivation.exists({ username });
    if (usernameExists && !usernameExists.emailVerify && usernameExists.emailTokenExpired < Date.now()) {
      await UserActivation.deleteOne({email});
    } else if (usernameExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(verifyToken)
      .digest('hex');

    const newUser = new UserActivation({
      username: username.trim(),
      password: hashedPassword,
      email,
      emailToken: hashedToken,
      emailTokenExpired: Date.now() + 1 * 60 * 1000, // 1 minute
    });

    await newUser.save();

    const verifyUrl = `${process.env.CORS_ORIGIN}/verifyemail?token=${verifyToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `
        <p>Hello 👋</p>
        <p>To verify your email, click the link below:</p>
        <a href="${verifyUrl}" style="color: #2563eb; font-weight: bold;">
          Click To Verify
        </a>
        <p>If you did not request this, ignore this email.</p>
      `,
    });

    res.status(201).json({ message: "Registration successful. Verify your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await UserActivation.findOne({ username });
    if (user && !user.emailVerify && user.emailTokenExpired < Date.now()) {
      await UserActivation.deleteOne({username});
    } else if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const EmailVerify = await UserActivation.findOne({username,emailVerify: true});
    if (!EmailVerify) {
      return res.status(400).json({
        message: "Kindly check your registered email inbox (including the Spam folder) and verify your email address within 15 minutes of creating your account. Failure to do so will result in the automatic deletion of the account."
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({ message: "User logged in successfully", user: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.check = async (req, res) => {
  try {
    const user = await UserActivation.findById(req.user.id);
    res.status(200).json({ user: user.username });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyemail = async (req, res) => {
  try {
    const {token} = req.query;

    if(!token){
      res.status(400).json({message: "Invalid Token"})
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await UserActivation.findOne({emailToken: hashedToken,emailTokenExpired: {$gte: Date.now()}});

    if (!user) {
      return res.status(400).json({
        message: "Token expired or invalid",
      });
    }

    user.emailVerify = true;
    user.emailToken = undefined;
    user.emailTokenExpired = undefined;

    await user.save();
    
    res.status(200).json({
      message: "Email Verified Successfully",
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({message: "Server Error"})
  }
}
