exports.register = async (req, res) => {
  res.status(201).send({ message: "User registered successfully" });
}
exports.login = async (req, res) => {
  res.status(200).send({ message: "User logged in successfully" });
}
exports.logout = async (req, res) => {
  res.status(200).send({ message: "User logged out successfully" });
}