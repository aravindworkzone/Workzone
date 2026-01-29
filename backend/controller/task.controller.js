const Task = require("../model/task.model");

exports.AddTask = async (req, res) => {
  try {
    
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const task = await Task.create({
        description,
        user: req.user.id,
    });

    res.status(201).json({
      message: "Task added successfully",
      data: {
        id: task._id,
        description: task.description,
        completed: task.completed,
        routine: task.routine,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
