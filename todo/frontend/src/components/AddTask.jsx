import { useRef, useState, useEffect } from "react";
import { useGetTaskQuery } from "../redux/api/task";

const AddTask = ({ UseCase, HandleAddTask, mode, isError, error ,isLoading }) => {
  const taskInputRef = useRef(null);
  const [isShaking, setIsShaking] = useState(false);
  const [taskType, setTaskType] = useState('');
  const { data: year } = useGetTaskQuery('Yearly Goal');

  useEffect(() => {
    if (isError) {
      setIsShaking(true);

      const timer = setTimeout(() => {
        setIsShaking(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isError]);

  const handleSubmit = () => {
    const value = taskInputRef.current?.value.trim();
    if (!value) return;

    HandleAddTask({
      description: value,
      mode: mode,
      link: taskType,
    });

    taskInputRef.current.value = "";
    setTaskType('');
  };

  return (
    <form
      className="
        bg-white dark:bg-gray-800
        p-4 rounded-lg shadow
        mb-4
      "
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <h2 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
        {UseCase}
      </h2>

      <div className="flex flex-col sm:flex-row gap-2">
          <input
            ref={taskInputRef}
            type="text"
            placeholder={`Enter ${UseCase.split(' ')[1]}...`}
            className={`
              flex-1 px-3 py-2 rounded-lg
              bg-white dark:bg-gray-900
              text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-gray-700 ${isShaking ? 'animate-shake focus:ring-red-500' : 'focus:ring-blue-500'}
              focus:outline-none focus:ring-2
            `}
            maxLength={100}
          />

        {mode == "Daily Routine" && (
          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
            className="
              px-3 py-2 rounded
              border bg-white dark:bg-gray-900
              text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-gray-700
              max-w-[200px]
            "
          >
            <option value="" disabled>
              Link Yearly Goal
            </option>

            {year.map(e => (
              <option key={e._id} value={e._id}>
                {e.description}
              </option>
            ))}
          </select>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="
            bg-blue-600 hover:bg-blue-700
            text-white
            px-4 py-2 rounded cursor-pointer
            transition-colors
            disabled:opacity-50
            disabled:cursor-not-allowed
            disabled:px-5
            hover:border-blue-500 hover:dark:border-blue-400
            flex items-center justify-center
          "
        >
          {isLoading ? (
            <>
              <svg
                width="18"
                height="18"
                viewBox="0 0 50 50"
                className="animate-spin"
              >
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="90"
                  strokeDashoffset="60"
                />
              </svg>
            </>
          ) : (
            "Add"
          )}
          
        </button>
      </div>
      {
        isShaking && (
          <span className="text-sm text-red-600 dark:text-red-400 ml-2">
            {error?.data?.message}
          </span>
        )
      }
    </form>
  );
};

export default AddTask;
