import StatusCard from "../components/StatusCard";
import { useGetTaskHistoryQuery } from "../redux/api/task";
import LeftSkeleton from "../components/Loader/LeftSkeleton";

const LeftSidebar = () => {
  const today = new Date().toDateString();

  const { data: taskStatus = [], isLoading } = useGetTaskHistoryQuery();

  return (
    <>
    {
      isLoading ? <LeftSkeleton /> : (<aside className="flex w-full lg:w-64 bg-gray-100 dark:bg-gray-900 flex-col justify-between p-4">
      
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-1">
          History
        </h2>
      </div>

      <div className="overflow-y-auto flex-1 mb-1 mt-1 hide-scrollbar">
        {taskStatus.data?.length > 0 && taskStatus.data?.map((t) => (
          <StatusCard
            key={t._id}
            date={t._id}
            day={t.day}
            totalTasks={t.totalTasks}
            completedTasks={t.completedTasks}
          />
        ))}
      </div>

      <div className="border-t border-gray-400 pt-2 text-xs text-gray-500 dark:text-gray-400">
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
