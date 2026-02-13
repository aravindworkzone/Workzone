import { Pencil,Trash,CheckCircle  } from "lucide-react";
const TodayTasks = ({ id, description, completed, onToggle, onAction, onError, onCurd, onRemove, onEdit, Routine, yearly }) => {
  const handleToggle = (id) => onToggle?.(id);

  let color = completed == 'Completed' ? "bg-green-600/40 border-green-700" : "bg-amber-600/40 border-amber-700";

  let updateSpan = description;
  switch (onAction) {
    case 'update':
      updateSpan = 'Updating';
      color = 'bg-yellow-600/40 border-yellow-700';
      break;

    case 'delete':
      updateSpan = 'Deleting';
      color = 'bg-red-600/40 border-red-700';
      break;

    case 'edit':
      color = 'bg-blue-600/40 border-blue-700';
      break;
  }
  
  if(Routine){
    color = 'bg-gray-600/40 border-gray-700';
  }

  if (onError) {
    updateSpan = 'Something went wrong';
  }

  return (
<label
  className={`flex items-center gap-3 w-full p-3 hover:translate-y-[-1px] rounded border cursor-pointer ${color}`}
>
  <input
    type="checkbox"
    className="hidden"
    checked={completed == 'Completed'}
    onChange={() => handleToggle(id)}
    disabled={onAction !== ''}
  />

  <div className="flex items-center gap-4 flex-1 min-w-0">
    {onAction === 'edit' ? (
      <input
        type="text"
        className="w-full bg-transparent focus:outline-none text-sm sm:text-base dark:text-[#cbcbcb]"
        defaultValue={updateSpan}
        onBlur={(e) => onEdit?.(id, e.target.value)}
        autoFocus
      />
    ) : (
      <span
        className="truncate text-sm sm:text-base dark:text-[#cbcbcb]"
        title={updateSpan}
      >
        {updateSpan}
      </span>
    )}

    {onCurd && (
      <span
        className="
          shrink-0
          bg-blue-600/30
          text-blue-100
          border border-blue-600/70
          text-[10px]
          px-2 py-[1px]
          rounded-full
          uppercase tracking-wider
          pointer-events-none
        "
      >
        Routine
      </span>
    )}

    {yearly && (
      <span
        className="
          shrink-0
          bg-green-500/15
          text-green-300
          border border-green-500/30
          text-[10px]
          px-2 py-[1px]
          rounded-full
          uppercase tracking-wider
          pointer-events-none
        "
      >
        Goal
      </span>
    )}
  </div>

  {(onAction && onAction !== 'edit') && (
    <span className="inline-flex gap-1 shrink-0">
      <span className="w-1 h-1 rounded-full bg-black dark:bg-white animate-pulse"></span>
      <span className="w-1 h-1 rounded-full bg-black dark:bg-white animate-pulse delay-150"></span>
      <span className="w-1 h-1 rounded-full bg-black dark:bg-white animate-pulse delay-300"></span>
    </span>
  )}

  {(!onCurd && (completed == 'Pending' || completed == false) && !onAction) && (
    <div
      className="flex items-center gap-5 shrink-0"
      onClick={(e) => e.preventDefault()}
    >
      <Pencil
        className="text-black/70 dark:text-white/70 hover:text-white transition w-4 h-4"
        title="Edit"
        onClick={(e) => {
          e.preventDefault();
          onEdit?.(id);
        }}
      />

      <Trash
        className="text-red-600/70 dark:text-red-300 hover:text-red-500 transition w-4 h-4"
        title="Delete"
        onClick={(e) => {
          e.preventDefault();
          onRemove?.(id);
        }}
      />
    </div>
  )}

  {onAction === 'edit' && (
    <CheckCircle
      className="text-white/70 hover:text-white transition w-4 h-4 shrink-0"
      title="Save"
      onClick={(e) => {
        e.preventDefault();
        onEdit?.(id);
      }}
    />
  )}
</label>


  );
};

export default TodayTasks;
