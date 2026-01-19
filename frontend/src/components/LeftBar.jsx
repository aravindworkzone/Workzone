const LeftSidebar = () => {
  // Replace later with Redux / API
  const totalTasks = 6;
  const completedTasks = 5;
  const pendingTasks = totalTasks - completedTasks;

  const today = new Date().toDateString();
  const startedDate = "01 Jan 2026";

  const cardColor =
    pendingTasks > 0
      ? "bg-red-600"
      : "bg-green-600";

  return (
    <aside className="flex w-full lg:w-64 lg:border-r bg-gray-50 dark:bg-gray-900 flex-col justify-between p-4">
      
      {/* TOP */}
      <div>
        {/* Date */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {today}
          </p>
        </div>

        {/* STATUS CARD */}
        <div className={`rounded-lg p-3 text-white ${cardColor}`}>
          <h3 className="text-sm font-semibold mb-2">
            Task Status
          </h3>

          <div className="flex justify-between text-xs">
            <span>Pending</span>
            <span>{pendingTasks}</span>
          </div>

          <div className="flex justify-between text-xs">
            <span>Completed</span>
            <span>{completedTasks}</span>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t pt-2 text-xs text-gray-500 dark:text-gray-400">
        Started on{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {startedDate}
        </span>
      </div>
    </aside>
  );
};

export default LeftSidebar;
