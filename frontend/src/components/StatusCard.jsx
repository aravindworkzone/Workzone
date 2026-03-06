const StatusCard = ({ date, day, totalTasks, completedTasks }) => {
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className={`rounded-lg border-[#2e3748] shadow px-[16px] hover:translate-y-[-1px] p-3 mb-3 bg-gray-50 dark:bg-gray-800 text-gray-300`}>
      <h2 className="text-xs mb-1 text-gray-400 font-semibold">{day}</h2>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold">
          {date}
        </h3>
      </div>

      <div className="flex justify-start gap-5 mt-2 text-xs mb-1">
          <div className="flex gap-1 items-center">
            <span className="inline-block w-[11px] h-[11px] bg-green-400 rounded-full"></span>
            <span>{completedTasks}</span>
            <span>Done</span>
          </div>

          <div className="flex gap-1 items-center">
            <span className="inline-block w-[11px] h-[11px] bg-slate-500 rounded-full"></span>
            <span>{pendingTasks}</span>
            <span>Pending</span>
          </div>
      </div>

      {day === "Today" && <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-[8px] dark:bg-gray-700">
          <div className="bg-green-600 h-[8px] rounded-full" style={{ width: `${(completedTasks / totalTasks) * 100}%` }} />
        </div>
      </div>}
    </div>
  );
};

export default StatusCard;