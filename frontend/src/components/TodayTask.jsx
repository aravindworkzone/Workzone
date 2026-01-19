const TodayTasks = () => {
  return (
    <div className="
      bg-white dark:bg-gray-800
      p-4 rounded-lg shadow
    ">
      <h2 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
        Today Tasks
      </h2>

      <ul className="space-y-2">
        {["Drink 3L water", "Sleep 8 hours"].map((task, i) => (
          <li
            key={i}
            className="
              flex items-center justify-between
              p-3 rounded border
                bg-green-600/40 border-green-700
            "
          >
            <label className="flex items-center gap-2 w-full justify-between">
              <span className="text-sm sm:text-base">
                {task}
              </span>
              <input type="checkbox" />
            </label>
          </li>
        ))}
        {["Learn Redux Toolkit", "Workout"].map((task, i) => (
          <li
            key={i}
            className="
              flex items-center justify-between
              p-3 rounded border
              bg-amber-700/40 border-amber-700
            "
          >
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span className="text-sm sm:text-base">
                {task}
              </span>
            </label>

            <div className="space-x-2 text-sm">
              <button className="text-blue-600 hover:underline">
                Edit
              </button>
              <button className="text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodayTasks;
