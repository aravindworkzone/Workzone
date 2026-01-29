const express = require("express");
const router = express.Router();
const taskController = require("../controller/task.controller");
const middleware = require("../middleware/auth.middleware");

router.post('/addtask', middleware.authenticate, taskController.AddTask);
router.get('/gettask', middleware.authenticate, taskController.GetTasks);
router.post('/updatetask', middleware.authenticate, taskController.UpdateTask);
router.post('/deletetask', middleware.authenticate, taskController.DeleteTask);
router.post('/edittask', middleware.authenticate, taskController.EditTask);

module.exports = router;