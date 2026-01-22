import StatusCard from "./StatusCard";

const LeftSidebar = () => {
  // Replace later with Redux / API

const taskStatus = [
  {
    date: "21 Jan",
    totalTasks: 6,
    completedTasks: 5
  },
  {
    date: "20 Jan",
    totalTasks: 6,
    completedTasks: 6
  }
];


  const today = new Date().toDateString();
  const startedDate = "01 Jan 2026";

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

        {taskStatus.map(({ date, totalTasks, completedTasks }) => (
          <StatusCard
            key={date}
            date={date}
            totalTasks={totalTasks}
            completedTasks={completedTasks}
          />
        ))}

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
