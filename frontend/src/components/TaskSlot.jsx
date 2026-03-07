import { Pencil,Trash,CheckCircle  } from "lucide-react";
const TodayTasks = ({ id, description, completed, onToggle, onAction, onError, onCurd, onRemove, onEdit, Routine, yearly, mode }) => {
  const handleToggle = (id) => onToggle?.(id);

  let color = completed == 'Completed' ? "from-green-300/40 via-green-200/40 to-green-300/40 border-green-400 dark:from-green-500/40 dark:via-green-600/50 dark:to-green-700/40 dark:border-green-700" : "bg-slate-200/90 border-slate-200 hover:bg-slate-300/50 dark:bg-slate-700/90 dark:border-slate-700 dark:hover:bg-slate-600/30";

  let updateSpan = description;
  switch (onAction) {
    case 'update':
      updateSpan = 'Updating';
      color = 'from-yellow-300/40 via-yellow-200/40 to-yellow-300/40 border-yellow-400 dark:from-yellow-500/40 dark:via-yellow-600/40 darkto-yellow-700/40 dark:border-yellow-700';
      break;

    case 'delete':
      updateSpan = 'Deleting';
      color = 'from-red-300/40 via-red-200/40 to-red-300/40 border-red-400 dark:from-red-500/40 dark:via-red-600/40 dark:to-red-700/40 dark:border-red-700';
      break;

    case 'edit':
      color = 'from-blue-200/40 via-blue-300/40 to-blue-400/40 border-blue-400 dark:from-blue-500/40 dark:via-blue-600/40 dark:to-blue-700/40 dark:border-blue-700';
      break;
  }
  
  if(Routine){
    color = 'bg-slate-300/90 border-slate-300 dark:bg-slate-700/90 dark:border-slate-700';
  }

  if (onError) {
    updateSpan = 'Something went wrong';
  }

return (
<label
  className={`flex items-center gap-3 w-full px-3 py-3 hover:translate-y-[-1px] rounded border cursor-pointer bg-gradient-to-r ${color}`}
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
          bg-blue-700/30
          dark:text-blue-100
          text-white
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
          bg-green-700/35
          dark:text-green-300
          text-white
          border dark:border-green-500/30 border-green-600/70
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
        className={`text-black/50 hover:text-black dark:text-white/70 dark:hover:text-white transition w-4 h-4 ${mode == 'Yearly Goal' ? 'hidden' : ''}`}
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
      className="dark:text-white/70 dark:hover:text-white text-black/50 hover:text-black transition w-4 h-4 shrink-0"
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
