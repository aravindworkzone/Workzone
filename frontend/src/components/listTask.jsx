const ListTask = ({ head, body = [], onEdit }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2 pr-3">
        <h3 className="font-semibold">{head}</h3>

        {onEdit && (
          <button
            onClick={onEdit}
            className="text-sm text-blue-600 hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {body.length > 0 ? (
        <ul className="list-disc ml-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">
          {body.map((item) => (
            <li key={item.id} className="truncate">{item.description}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400">No tasks added</p>
      )}
    </div>
  );
};

export default ListTask;
