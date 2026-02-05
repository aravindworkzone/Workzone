const RightSkeleton = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-950 animate-pulse dark:animate-none">

      <div className="flex flex-1 overflow-hidden">

        <div className="hidden lg:flex w-64 bg-gray-200 dark:bg-gray-800 border-l p-4 space-y-6 flex-col">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="h-35 bg-gray-300 dark:bg-gray-700 rounded-xl flex flex-col dark:animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-gray-800 rounded mt-4 mx-3" />
              <div className="h-6 bg-gray-300 dark:bg-gray-800 rounded mt-4 mx-3" />
              <div className="h-6 bg-gray-300 dark:bg-gray-800 rounded my-4 mx-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSkeleton;
