const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout",authMiddleware.authenticate, authController.logout);
router.get("/check",authMiddleware.authenticate, authController.check);

module.exports = router;