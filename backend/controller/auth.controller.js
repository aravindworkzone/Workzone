const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const UserActivation = require('../model/user.model.js');
const Session = require('../model/session.model.js');
const { sendEmail } = require('../utils/SendMail.cjs');
const { MAIL_VERIFICATION } = require('../utils/contents.js');

// Read lazily: dotenv is configured after this module is required.
const maxSessions = () => Number(process.env.MAX_SESSIONS) || 3;

const deviceLabel = (userAgent = "") => {
  const browser =
    /Edg\//i.test(userAgent) ? "Edge" :
    /OPR\/|Opera/i.test(userAgent) ? "Opera" :
    /Chrome\//i.test(userAgent) ? "Chrome" :
    /Firefox\//i.test(userAgent) ? "Firefox" :
    /Safari\//i.test(userAgent) ? "Safari" : "Unknown browser";

  const os =
    /Windows/i.test(userAgent) ? "Windows" :
    /Android/i.test(userAgent) ? "Android" :
    /iPhone|iPad|iPod/i.test(userAgent) ? "iOS" :
    /Mac OS X/i.test(userAgent) ? "macOS" :
    /Linux/i.test(userAgent) ? "Linux" : "Unknown device";

  return `${browser} on ${os}`;
};

// Sessions the user has to pick from when the device limit is reached.
const activeSessions = async (userId, exceptId) => {
  const filter = { user: userId, isValid: true };
  if (exceptId) filter._id = { $ne: exceptId };

  const sessions = await Session.find(filter).sort({ updatedAt: -1 });

  return sessions.map((session) => ({
    id: session._id,
    device: deviceLabel(session.userAgent),
    ipAddress: session.ipAddress,
    lastActive: session.updatedAt,
  }));
};

// Short lived token that lets the blocked device free a slot without sending
// the password again. Rejected by the auth middleware, so it is not an access token.
const sessionManageToken = (userId) => jwt.sign(
  { id: userId, purpose: 'session-manage' },
  process.env.JWT_SECRET,
  { expiresIn: '5m' }
);

// Creates (or revives) the session for this device and sets both cookies.
const startSession = async (req, res, userId) => {
  const userAgent = req.headers["user-agent"];
  const ipAddress = req.ip;

  const AccessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const RefreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const refreshToken = crypto.createHash('sha256').update(RefreshToken).digest('hex');

  const DiviceExist = await Session.findOne({ user: userId, ipAddress });
  if (!DiviceExist) {
    await Session.create({ user: userId, refreshToken, ipAddress, userAgent });
  } else {
    await Session.updateOne({ user: userId, ipAddress }, { refreshToken, userAgent, isValid: true });
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
};

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

    // This device keeps its own slot, so only the other devices count towards the limit.
    const DiviceExist = await Session.findOne({user: user._id, ipAddress});
    const SessionCount = await Session.countDocuments({
      user: user._id,
      isValid: true,
      ...(DiviceExist ? { _id: { $ne: DiviceExist._id } } : {}),
    });

    if (SessionCount >= maxSessions()) {
      return res.status(403).json({
        message: "Maximum session limit reached. Log out from one of these devices to continue.",
        sessionLimit: true,
        maxSessions: maxSessions(),
        sessionToken: sessionManageToken(user._id),
        sessions: await activeSessions(user._id, DiviceExist?._id),
      });
    }

    await startSession(req, res, user._id);

    res.status(200).json({ message: "User logged in successfully", user: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Logs the picked devices out on behalf of a device that was blocked by the
// session limit, then signs that device in.
exports.revokeSessions = async (req, res) => {
  try {
    const { sessionToken, sessionIds } = req.body;

    if (!sessionToken || !Array.isArray(sessionIds) || sessionIds.length === 0) {
      return res.status(400).json({ message: "Select a device to log out" });
    }

    let decoded;
    try {
      decoded = jwt.verify(sessionToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Session expired. Please login again." });
    }

    if (decoded.purpose !== 'session-manage') {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await UserActivation.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const validIds = sessionIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length === 0) {
      return res.status(400).json({ message: "Select a device to log out" });
    }

    // Scoped to this user, so a session id from another account cannot be killed.
    await Session.updateMany(
      { _id: { $in: validIds }, user: user._id },
      { isValid: false }
    );

    const ipAddress = req.ip;
    const DiviceExist = await Session.findOne({ user: user._id, ipAddress });
    const SessionCount = await Session.countDocuments({
      user: user._id,
      isValid: true,
      ...(DiviceExist ? { _id: { $ne: DiviceExist._id } } : {}),
    });

    if (SessionCount >= maxSessions()) {
      return res.status(403).json({
        message: "Still at the device limit. Log out from one more device to continue.",
        sessionLimit: true,
        maxSessions: maxSessions(),
        sessionToken: sessionManageToken(user._id),
        sessions: await activeSessions(user._id, DiviceExist?._id),
      });
    }

    await startSession(req, res, user._id);

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
