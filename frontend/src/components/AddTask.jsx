import { useRef, useState } from "react";
import { useGetTaskQuery } from "../redux/api/task";

const AddTask = ({ UseCase, HandleAddTask, mode }) => {
  const taskInputRef = useRef(null);
  const [taskType, setTaskType] = useState('');
  const { data: year } = useGetTaskQuery('Yearly Goal');

  const handleSubmit = () => {
    const value = taskInputRef.current?.value.trim();
    if (!value) return;

    HandleAddTask({
      description: value,
      mode: mode,
      link: taskType,
    });

    taskInputRef.current.value = "";
    setTaskType('');
  };

  return (
    <form
      className="
        bg-white dark:bg-gray-800
        p-4 rounded-lg shadow
        mb-4
      "
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <h2 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
        {UseCase}
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
          maxLength={100}
        />

        {mode == "Daily Routine" && (
          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
            className="
              px-3 py-2 rounded
              border bg-white dark:bg-gray-900
              text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-gray-700
              max-w-[200px]
            "
          >
            <option value="" disabled>
              Link Yearly Goal
            </option>

            {year.map(e => (
              <option key={e.id} value={e.id}>
                {e.description}
              </option>
            ))}
          </select>
        )}

        <button
          mode="submit"
          className="
            bg-blue-600 hover:bg-blue-700
            text-white
            px-4 py-2 rounded cursor-pointer
          "
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default AddTask;
