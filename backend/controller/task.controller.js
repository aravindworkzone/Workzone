const Task = require("../model/task.model");
const Routine = require("../model/routine.model");
const YearlyGoal = require("../model/yearly.model");
const User = require("../model/user.model");
const manogoose = require('mongoose');
const { AICall } = require('../utils/GoogleGenAi');

// taskController.js
const MODULE_MAP = {
  "Today Task": Task,
  "Daily Routine": Routine,
  "Yearly Goal": YearlyGoal,
};

exports.AddTask = async (req, res) => {
  try {
    const { description, mode, link } = req.body;

    // --- Input validation first, before any DB/AI call ---
    if (!description || typeof description !== "string" || description.trim().length === 0) {
      return res.status(400).json({ message: "Description is required." });
    }
    if (description.length > 100) {
      return res.status(400).json({ message: "Description must be 100 characters or less." });
    }
    if (!mode) {
      return res.status(400).json({ message: "Mode is required." });
    }

    const Module = MODULE_MAP[mode];
    if (!Module) {
      return res.status(400).json({ message: "Invalid mode." });
    }

    // Escape user input before using in regex to prevent ReDoS
    const escapedDesc = description.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const duplicate = await Module.findOne({
      description: { $regex: `^${escapedDesc}$`, $options: "i" },
      user: req.user.id,
      deleted: false,
    });

    if (duplicate) {
      return res.status(400).json({ message: "Task already exists." });
    }

    const baseData = { description: description.trim(), user: req.user.id };

    switch (mode) {
      case "Today Task": {
        await Task.create(baseData);
        return res.status(201).json({ message: "Task added successfully.", data: baseData });
      }

      case "Yearly Goal": {
        const newGoal = await YearlyGoal.create(baseData);

        const aiResult = await AICall("routine", description);
        if (aiResult.error) {
          return res.status(207).json({
            data: { ...baseData, goalId: newGoal._id },
            aiError: "Goal saved, "+aiResult.error.message,
          });
        }

        return res.status(201).json({
          message: "Task added successfully.",
          data: { ...baseData, goalId: newGoal._id },
          aiGenerated: aiResult.data,
        });
      }

      case "Daily Routine": {
        const routineLink = link || null;
        await Routine.create({
          ...baseData,
          link: routineLink,
          yearly: !!routineLink,
        });
        return res.status(201).json({
          message: "Task added successfully.",
          data: baseData,
          link: routineLink,
        });
      }

      default:
        return res.status(400).json({ message: "Invalid mode." });
    }

  } catch (error) {
    console.error("[AddTask Error]", error);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.GetTasks = async (req, res) => {
  try {
    const { type } = req.query;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let Search = {user: req.user.id, deleted: false};
    let Module = Task;
    let Require = "_id description completed routine link";

    switch (type) {
      case 'Today Task':
        Search.createdAt = {$gte: today};
        break;

      case 'Daily Routine':
        Module = Routine;
        Require = "_id description yearly link"
        break;

      case 'Yearly Goal':
        Module = YearlyGoal;
        Require = "_id description completed"
        break;
    
      default:
        res.status(400).json({ message: "Invalid type" });
    }

    let task = await Module.find(Search).select(Require).lean();

    if(type == 'Today Task'){
      const yearGoal = await Routine.find({yearly: true, deleted: false}).select('_id').lean();
      const YearSet = new Set(yearGoal.map(t => t._id.toString()));
      task = task.map(t => ({
        ...t,
        yearly: t.link && YearSet.has(t.link.toString())
      }));
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.GetTaskHistory = async (req, res) => {
  try {
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    startDate.setHours(0, 0, 0, 0);

    const taskHistory = await Task.aggregate([
      {
        $match: {
          user: new manogoose.Types.ObjectId(req.user.id),
          createdAt: { $gte: startDate },
          deleted: false,
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%b %d %Y",
              date: "$createdAt",
              timezone: "Asia/Kolkata"
            }
          },
          date: { $first: "$createdAt" }, 
          day: {
            $first: {
              $arrayElemAt: [
                ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                {
                  $subtract: [
                    { $dayOfWeek: { date: "$createdAt", timezone: "Asia/Kolkata" } },  // fix: timezone-aware
                    1
                  ]
                }
              ]
            }
          },
          totalTasks: { $sum: 1 },
          completedTasks: { $sum: { $cond: [{ $eq: ["$completed", "Completed"] }, 1, 0] } }
        }
      },
      { $sort: { date: -1 } }
    ]);

    const todayDate = new Date();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

    const fmt = (d) => d.toLocaleDateString("en-US", {
      month: "short", day: "2-digit", year: "numeric", timeZone: "Asia/Kolkata"
    }).replace(/,/g, "");

    const todayStr = fmt(todayDate);
    const yesterdayStr = fmt(yesterdayDate);

    const history = taskHistory.map((t, i) => {
      if (i === 0 && t._id === todayStr) return { ...t, day: "Today" };
      if (i === 1 && t._id === yesterdayStr) return { ...t, day: "Yesterday" };
      return t;
    });

    const user = await User.findById(req.user.id, { createdAt: 1 });
    const joinDate = user.createdAt.toDateString().split(" ").slice(1).join(" ");

    res.status(200).json({ joinDate, data: history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.UpdateTask = async (req, res) => {
  try {
    const { id, type } = req.body;
    const Module = {
      "Today Task": Task,
      "Daily Routine": Routine,
      "Yearly Goal": YearlyGoal
    }

    const task = await Module[type].findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.completed = task.completed == 'Pending' ? 'Completed' : 'Pending';
    await task.save();
    res.status(200).json({ message: "Task updated successfully" });
  } catch(error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

exports.DeleteTask = async (req, res) => {
  try{
    const { id, type } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const Module = {
      "Today Task": Task,
      "Daily Routine": Routine,
      "Yearly Goal": YearlyGoal
    }
    const task = await Module[type].findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.deleted = true;
    await task.save();
    if(type == 'Daily Routine'){
      await Task.updateOne({link: id, createdAt: { $gte: today }},{$set: {deleted: true}});
    } else if (type == 'Yearly Goal'){
      const linkedRoutineIds = await Routine.find({link: id}).select('_id');
      await Promise.all(
        linkedRoutineIds.map(({_id}) => {
          return Task.updateMany({link: _id, createdAt: { $gte: today }},{$set: {deleted: true}});
        })
      );
      await Routine.updateMany({link: id},{$set: {deleted: true}});
    }
    res.status(200).json({ message: "Task deleted successfully" });
  }catch(e){
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
}

exports.EditTask = async (req, res) => {
  const { id, description, type } = req.body;
  if (!description || description.length > 100) {
    return res.status(400).json({ message: "Description is required" });
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const Module = {
    "Today Task": Task,
    "Daily Routine": Routine,
    "Yearly Goal": YearlyGoal
  }
  const task = await Module[type].findById(id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  task.description = description;
  await task.save();
  if(type == 'Daily Routine'){
    await Task.updateOne({link: id, createdAt: { $gte: today }},{$set: {description}});
  }
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
        }
      },
      {
        $group:{
          _id: null,
          totalTasks: {$sum: 1},
          completedTasks: {$sum: {$cond: [{$eq: ["$completed", 'Completed']}, 1, 0]}}
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
    res.status(200).send( Math.round(Action[0]?.productivity ?? 0) );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

exports.GoalTask = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTasks = await Task.find(
      {
        user: req.user.id,
        deleted: false,
        createdAt: { $gte: today }
      },
      { link: 1 }
    );

    const routines = await Routine.find(
      {
        user: req.user.id,
        deleted: false,
      }
    );

    const yearly = await YearlyGoal.find(
      {
        user: req.user.id,
        deleted: false,
      }
    ).select('_id');

    const linkedRoutineIds = todayTasks
      .filter(t => t.link)
      .map(t => t.link.toString());

    const missingTasks = routines
      .filter(r => !linkedRoutineIds.includes(r._id.toString()))
      .map(r => ({
        description: r.description,
        user: req.user.id,
        link: r._id,
        completed: 'Pending',
        routine: true
      }));

    if (missingTasks.length > 0) {
      await Task.insertMany(missingTasks);
    }

    res.status(200).json({
      message: 'Goal tasks ensured',
      inserted: missingTasks.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
