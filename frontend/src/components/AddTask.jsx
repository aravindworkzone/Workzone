import { useRef } from "react";
import {useAddTaskMutation} from '../redux/api.js'
import { addtask } from "../redux/slice/task.js";
import { useDispatch } from "react-redux";
const AddTask = () => {
  const taskInputRef = useRef(null);
  const dispatch = useDispatch();

  const [addTask] = useAddTaskMutation();

  const HandleAddTask = async () => {
    const task = { description: taskInputRef.current.value };
    const result = await addTask(task);
    if(result){
      console.log(result);
      dispatch(addtask(result.data.data));
      taskInputRef.current.value = "";
    }
  }
  return (
    <div className="
      bg-white dark:bg-gray-800
      p-4 rounded-lg shadow
      mb-4
    ">
      <h2 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
        Add Task
      </h2>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          ref={taskInputRef}
          type="text"
          placeholder="Enter task..."
          className="
            flex-1 px-3 py-2 rounded
            border
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-gray-100
            border-gray-300 dark:border-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />
        <button type="submit" className="
          bg-blue-600 hover:bg-blue-700
          text-white
          px-4 py-2 rounded
        " onClick={HandleAddTask}>
          Add
        </button>
      </div>
    </div>
  );
};

export default AddTask;
