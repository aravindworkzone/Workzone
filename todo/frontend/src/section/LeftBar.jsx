import StatusCard from "../components/StatusCard";
import { useGetTaskHistoryQuery } from "../redux/api/task";
import LeftSkeleton from "../components/Loader/LeftSkeleton";

const LeftSidebar = () => {
  const today = new Date().toDateString();

  const { data: taskStatus = [], isLoading } = useGetTaskHistoryQuery();

  return (
    <>
    {
      isLoading ? <LeftSkeleton /> : (<aside className="flex w-full lg:w-64 lg:border-r bg-gray-50 dark:bg-gray-900 flex-col justify-between p-4">
      
      <div className="mb-3 bg-gray-50 dark:bg-gray-900 py-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {today}
        </p>
      </div>

      <div className="overflow-y-auto flex-1 mb-1">
        {taskStatus.data?.length > 0 && taskStatus.data?.map((t) => (
          <StatusCard
            key={t._id}
            date={t._id}
            totalTasks={t.totalTasks}
            completedTasks={t.completedTasks}
          />
        ))}
      </div>

      <div className="border-t pt-2 text-xs text-gray-500 dark:text-gray-400">
        Started on{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {taskStatus.joinDate}
        </span>
      </div>

    </aside>)
    }
    </>
  );
};

export default LeftSidebar;
