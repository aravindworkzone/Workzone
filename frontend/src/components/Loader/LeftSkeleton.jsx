const LeftSkeleton = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-950 animate-pulse dark:animate-none">

      <div className="flex flex-1 overflow-hidden">
        
        <div className="hidden lg:flex w-64 bg-gray-200 dark:bg-gray-800 border-r p-4 space-y-6 flex-col">
          <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-1/2 dark:animate-pulse" />
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="h-20 bg-gray-300 dark:bg-gray-700 rounded-xl flex flex-col dark:animate-pulse" />
          ))}
        </div>

      </div>

    </div>
  );
};

export default LeftSkeleton;
