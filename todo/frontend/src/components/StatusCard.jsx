const StatusCard = ({ date, totalTasks, completedTasks }) => {
  const pendingTasks = totalTasks - completedTasks;

  const cardColor =
    pendingTasks > 0
      ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200"
      : "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200";

  return (
    <div className={`rounded-lg hover:translate-y-[-1px] p-3 mb-3 ${cardColor}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold">
          {date}
        </h3>
        <span className="text-xs opacity-80">
          {completedTasks}/{totalTasks}
        </span>
      </div>

      <div className="flex justify-between text-xs">
        <span>Pending</span>
        <span>{pendingTasks}</span>
      </div>

      <div className="flex justify-between text-xs">
        <span>Completed</span>
        <span>{completedTasks}</span>
      </div>
    </div>
  );
};

export default StatusCard;