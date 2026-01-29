import { Pencil,Trash,CheckCircle  } from "lucide-react";
const TodayTasks = ({ id, description, completed, onToggle, onAction, onError, onCurd, onRemove, onEdit }) => {
  const handleToggle = (id) => onToggle?.(id);

  let color = completed ? "bg-green-600/40 border-green-700" : "bg-amber-600/40 border-amber-700";

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

  if (onError) {
    updateSpan = 'Something went wrong';
  }

  return (
    <label className={`flex items-center gap-2 w-full p-3 rounded border justify-between ${color}`}>
      {onAction == 'edit' ?
      (<input type="text" className="w-full bg-transparent focus:outline-none text-sm sm:text-base dark:text-[#cbcbcb]" defaultValue={updateSpan} onBlur={(e) => onEdit?.(id, e.target.value)} autoFocus/>):
      (<><span className="text-sm sm:text-base dark:text-[#cbcbcb]"> {updateSpan} </span>
      <input type="checkbox" className="hidden" checked={completed} onChange={() => handleToggle(id)} disabled={onAction != ''} /></>)
      }

      {(onAction && onAction != 'edit') && <span className="inline-flex gap-1 mr-4">
        <span className="w-1 h-1 rounded-full bg-black dark:bg-white animate-pulse"></span>
        <span className="w-1 h-1 rounded-full bg-black dark:bg-white animate-pulse" style={{ animationDelay: "0.15s" }}></span>
        <span className="w-1 h-1 rounded-full bg-black dark:bg-white animate-pulse" style={{ animationDelay: "0.3s" }}></span>
      </span>
      }

      {(onCurd && !completed && !onAction) && <div className="flex items-center gap-5">
        <Pencil
          className="text-white/70 hover:text-white transition w-4 h-4"
          title="Edit"
          onClick={(e) => {
            e.preventDefault();
            onEdit?.(id);
          }}
        ></Pencil>

        <Trash
          className="text-red-300 hover:text-red-500 transition w-4 h-4"
          title="Delete"
          onClick={(e) => {
            e.preventDefault();
            onRemove?.(id);
          }}
        ></Trash>
      </div>
      }

      {onAction == 'edit' &&
        <CheckCircle 
          className="text-white/70 hover:text-white transition w-4 h-4 mr-5"
          title="Edit"
          onClick={(e) => {
            e.preventDefault();
            onEdit?.(id);
          }}
        ></CheckCircle >
      }
    </label>
  );
};

export default TodayTasks;
