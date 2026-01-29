const express = require("express");
const router = express.Router();
const taskController = require("../controller/task.controller");
const middleware = require("../middleware/auth.middleware");

router.post('/addtask', middleware.authenticate, taskController.AddTask);

module.exports = router;