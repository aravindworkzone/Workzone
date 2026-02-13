const LoginSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex flex-col animate-pulse dark:animate-none">
      
      <div className="flex items-center justify-between px-6 py-4 dark:animate-pluse">
        <div className="h-8 w-24 bg-gray-700 rounded-md dark:animate-pluse" />
        <div className="h-4 w-20 bg-gray-700 rounded-md dark:animate-pluse" />
      </div>

      <div className="flex flex-1 items-center justify-center dark:animate-pluse">
        <div className="w-[380px] max-w-[90%] bg-gray-900 rounded-2xl p-6 shadow-lg space-y-5 dark:animate-pluse">

          <div className="h-6 w-32 bg-gray-700 rounded mx-auto dark:animate-pluse" />
          <div className="h-4 w-48 bg-gray-800 rounded mx-auto dark:animate-pluse" />

          <div className="space-y-2 pt-4 dark:animate-pluse">
            <div className="h-3 w-20 bg-gray-700 rounded dark:animate-pluse" />
            <div className="h-10 w-full bg-gray-800 rounded-lg dark:animate-pluse" />
          </div>
          
          <div className="space-y-2 dark:animate-pluse">
            <div className="h-3 w-20 bg-gray-700 rounded dark:animate-pluse" />
            <div className="h-10 w-full bg-gray-800 rounded-lg dark:animate-pluse" />
          </div>

          <div className="h-11 w-full bg-blue-700/40 rounded-xl mt-4 dark:animate-pluse" />

          <div className="h-4 w-40 bg-gray-800 rounded mx-auto mt-2 dark:animate-pluse" />
        </div>
      </div>
    </div>
  );
};

export default LoginSkeleton;
