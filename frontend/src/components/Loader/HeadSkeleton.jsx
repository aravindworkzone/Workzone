const HeadSkeleton = () => {
  return (
    <div
      className="
        h-16
        px-4 sm:px-6
        grid grid-cols-3 items-center
        border-b
        bg-white dark:bg-gray-900
        animate-pulse
      "
    >
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>

      <div className="flex flex-col items-center gap-1">
        <div className="h-3 w-28 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>

      <div className="flex justify-end items-center gap-3">
        <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  );
};

export default HeadSkeleton;
