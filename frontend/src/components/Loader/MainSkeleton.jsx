const MainSkeleton = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-950 animate-pulse flex-1 dark:animate-none">
      <div className="flex flex-1 overflow-hidden">

        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded-xl flex items-center px-4 mb-8 dark:animate-pulse">
            <div className="h-10 bg-gray-300 dark:bg-gray-800 rounded flex-1 mr-3 dark:animate-pulse"></div>
            <div className="h-10 w-20 bg-gray-300 dark:bg-gray-800 rounded dark:animate-pulse"></div>
          </div>


          {[1, 2, 3, 4, 5].map((_, i) => (
            <div
              key={i}
              className="h-14 bg-gray-300 dark:bg-gray-700 rounded-xl dark:animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainSkeleton;
