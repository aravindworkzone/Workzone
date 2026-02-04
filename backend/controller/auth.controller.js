const brypt = require('bcrypt');
const UserActivation = require('../model/user.model');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const userExists = await UserActivation.exists({
      $or: [{ email }, { username }]
    });
    if (userExists) {
      return res.status(400).send({ message: "User already exists" });
    }

    const hashedPassword = await brypt.hash(password, 10);

    const newUser = new UserActivation({ username, password: hashedPassword, email });
    await newUser.save();
    res.status(201).send({ Username: username });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
}

exports.login = async (req, res) => {

  try {
    const { username, password } = req.body;
    const user = await UserActivation.findOne({ username });
    if (!user) {
      return res.status(400).send({ message: "Invalid credentials" });
    }
    const isMatch = await brypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie("token", token, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 60 * 60 * 1000 });

    res.status(200).send({ message: "User logged in successfully", user: user.username });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
}

exports.logout = async (req, res) => {
  try {
    // const {user} = req.body;
    console.log(req.user.id);
    res.clearCookie("token", { httpOnly: true, sameSite: 'lax', secure: false });
    res.status(200).send({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
}
exports.check = async (req, res) => {
  try {
    const user = await UserActivation.findById(req.user.id);
    res.status(200).send({ user: user.username });
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
}