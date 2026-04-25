const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const UserActivation = require('../model/user.model.js');
const Session = require('../model/session.model.js');
const { sendEmail } = require('../utils/SendMail.cjs');
const { MAIL_VERIFICATION } = require('../utils/contents.js');

exports.register = async (req, res) => {
  try {
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    const email = req.body.email.trim();

    const emailExists = await UserActivation.findOne({ email });
    if (emailExists && !emailExists.emailVerify && emailExists.emailTokenExpired < Date.now()) {
      await UserActivation.deleteOne({email});
    } else if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const usernameExists = await UserActivation.findOne({ username });
    if (usernameExists && !usernameExists.emailVerify && usernameExists.emailTokenExpired < Date.now()) {
      await UserActivation.deleteOne({username});
    } else if (usernameExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(verifyToken)
      .digest('hex');

    const newUser = new UserActivation({
      username: username,
      password: hashedPassword,
      email,
      emailToken: hashedToken,
      emailTokenExpired: Date.now() + 15 * 60 * 1000, 
    });

    await newUser.save();

    const verifyUrl = `${process.env.CORS_ORIGIN}/verifyemail?token=${verifyToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: MAIL_VERIFICATION(verifyUrl),
    });

    res.status(201).json({ message: "Registration successful. Verify your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  
  try {
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip;

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

    const AccessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const RefreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const refreshToken = crypto.createHash('sha256').update(RefreshToken).digest('hex');

    const SessionCount = await Session.countDocuments({user: user._id, isValid: true});
    if (SessionCount >= 3) {
      return res.status(400).json({ message: "Maximum session limit reached. Please log out from other devices." });
    }

    const DiviceExist = await Session.findOne({user: user._id, ipAddress});
    if (!DiviceExist) {
      await Session.create({user: user._id, refreshToken, ipAddress, userAgent});
    } else {
      await Session.updateOne({user: user._id, ipAddress}, {refreshToken, isValid: true});
    }

    res.cookie("AccessToken", AccessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("RefreshToken", RefreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "User logged in successfully", user: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    const RefreshToken = req.cookies.RefreshToken;
    if (!RefreshToken) {
      return res.status(400).json({ message: "Refresh token not found" });
    }

    const refreshToken = crypto.createHash('sha256').update(RefreshToken).digest('hex');

    const session = await Session.updateOne({user: req.user.id, refreshToken}, {isValid: false});

    if (session.matchedCount === 0) {
      console.log("Session not found");
      return res.status(400).json({ message: "Session not found" });
    }

    res.clearCookie("AccessToken", {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.clearCookie("RefreshToken", {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
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

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.RefreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const user = await Session.findOne({user: decoded.id, refreshToken: hashedToken, isValid: true});

    if (!user) {
      await Session.updateMany({user: decoded.id}, {isValid: false});
      return res.status(401).json({ message: "Token expired" });
    }

    const AccessToken = jwt.sign(
      { id: user.user },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const RefreshToken = jwt.sign(
      { id: user.user },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(AccessToken, "AccessToken");
    console.log(RefreshToken, "RefreshToken");

    res.cookie("AccessToken", AccessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("RefreshToken", RefreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const hashedRefreshToken = crypto.createHash('sha256').update(RefreshToken).digest('hex');

    await Session.updateOne({_id: user._id}, {refreshToken: hashedRefreshToken, isValid: true});

    res.status(200).json({ message: "Token refreshed successfully" , refreshToken: true});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
