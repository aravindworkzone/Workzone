const AddTask = () => {
  return (
    <div className="
      bg-white dark:bg-gray-800
      p-4 rounded-lg shadow
      mb-4
    ">
      <h2 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
        Add Task
      </h2>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Enter task..."
          className="
            flex-1 px-3 py-2 rounded
            border
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-gray-100
            border-gray-300 dark:border-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
        />
        <button className="
          bg-blue-600 hover:bg-blue-700
          text-white
          px-4 py-2 rounded
        ">
          Add
        </button>
      </div>
    </div>
  );
};

export default AddTask;
