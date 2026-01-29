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

exports.GetTasks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const task = (await Task.find({ user: req.user.id, createdAt: {$gte: today}, deleted: false })).map(({ _id, description, completed, routine }) => ({id: _id,description,completed,routine}));
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.UpdateTask = async (req, res) => {
  try {
    const { id } = req.body;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.completed = !task.completed;
    await task.save();
    res.status(200).json({ message: "Task updated successfully" });
    console.log(id);
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

exports.DeleteTask = async (req, res) => {
  try{
    const { id } = req.body;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.deleted = true;
    await task.save();
    res.status(200).json({ message: "Task deleted successfully" });
  }catch(e){
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

exports.EditTask = async (req, res) => {
  const { id, description } = req.body;
  const task = await Task.findById(id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  task.description = description;
  await task.save();
  res.status(200).json({ message: "Task updated successfully" });
}
