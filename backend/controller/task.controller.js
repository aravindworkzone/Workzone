const Task = require("../model/task.model");
const User = require("../model/user.model");
const manogoose = require('mongoose');

exports.AddTask = async (req, res) => {
  try {
    
    const { description , type} = req.body;

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const task = await Task.create({
        description,
        user: req.user.id,
        type: type
    });

    res.status(201).json({
      message: "Task added successfully",
      data: {
        id: task._id,
        description: task.description,
        completed: task.completed,
        routine: task.routine,
        type: task.type
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.GetTasks = async (req, res) => {
  try {
    const { type } = req.query;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const task = (await Task.find({ user: req.user.id, createdAt: {$gte: today}, deleted: false, type })).map(({ _id, description, completed, routine, type }) => ({id: _id,description,completed,routine,type}));
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.GetTaskHistory = async (req, res) => {
  try {
    const EndDate = new Date();
    EndDate.setHours(0, 0, 0, 0);
    const startDate = new Date(EndDate);
    startDate.setDate(startDate.getDate() - 30);
    startDate.setHours(0, 0, 0, 0);

    const taskHistory = await Task.aggregate([
      {
        $match:{
          user: new manogoose.Types.ObjectId(req.user.id),
          createdAt: {$gte: startDate, $lte: EndDate},
          deleted: false,
          type: 'Today Task'
        }
      },
      {
        $group:{
          _id: {$dateToString: {format: "%b %d %Y", date: "$createdAt"}},
          totalTasks: {$sum: 1},
          completedTasks: {$sum: {$cond: [{$eq: ["$completed", true]}, 1, 0]}}
        }
      },
      {$sort: {_id: -1}}
    ]);

    const joinDate = (await User.findById(req.user.id, { createdAt: 1 })).createdAt.toDateString().split(' ').slice(1).join(' ');

    res.status(200).json({joinDate, data: taskHistory });
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

exports.Productivity = async (req, res) => {
  try {
    const EndDate = new Date();
    EndDate.setHours(0, 0, 0, 0);
    const startDate = new Date(EndDate);
    startDate.setDate(startDate.getDate() - 7);
    const Action = await Task.aggregate([
      {
        $match:{
          user: new manogoose.Types.ObjectId(req.user.id),
          createdAt: {$gte: startDate, $lte: EndDate},
          deleted: false,
          type: 'Today Task'
        }
      },
      {
        $group:{
          _id: null,
          totalTasks: {$sum: 1},
          completedTasks: {$sum: {$cond: [{$eq: ["$completed", true]}, 1, 0]}}
        }
      },
      {
        $addFields:{
          productivity:{
            $multiply:[
              {$divide: ["$completedTasks", "$totalTasks"]},100
            ]
          }
        }
      }
    ]);
    res.status(200).send( Action[0].productivity );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}