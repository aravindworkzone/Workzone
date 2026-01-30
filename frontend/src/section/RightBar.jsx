const RightSidebar = () => {
  return (
    <aside className="
      w-full lg:w-64
      lg:border-l
      bg-gray-50 dark:bg-gray-900
      p-4 space-y-4
      text-gray-900 dark:text-gray-100
    ">
      {/* Yearly Goal */}
      <div className="bg-white dark:bg-gray-800 p-3 rounded shadow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">🎯 Yearly Goal</h3>
          <button className="text-sm text-blue-600">Edit</button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Become a Full-Stack Developer
        </p>
      </div>

      {/* Daily Routine */}
      <div className="bg-white dark:bg-gray-800 p-3 rounded shadow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">📆 Daily Routine</h3>
          <button className="text-sm text-blue-600">Edit</button>
        </div>
        <ul className="list-disc ml-4 text-sm text-gray-600 dark:text-gray-400">
          <li>Wake up at 6 AM</li>
          <li>Code 2 hours</li>
          <li>Workout</li>
        </ul>
      </div>
    </aside>
  );
};

export default RightSidebar;
