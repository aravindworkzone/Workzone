import { Target, Repeat, CalendarCheck } from "lucide-react";

const image = {
  'Yearly Goal': <Target className="w-4 h-4 text-rose-500" />,
  'Daily Routine': <Repeat className="w-4 h-4 text-blue-400" />,
  'Today Task': <CalendarCheck className="w-4 h-4 text-emerald-400" />,
}
const ListTask = ({ head, body = [], onEdit }) => {
  let items = body.slice(0, 3);
  if(body.length > 3) {
    const numTask = body.length - 3;
    items.push({_id: '...', description: `+ ${numTask} more task${numTask > 1 ? 's' : ''}`});
  }

  return (
    <div className="border-[#2e3748] bg-white dark:bg-gray-800 rounded-[12px] p-[16px] shadow hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors hover:translate-y-[-1px]" onClick={onEdit}>
      <div className="flex justify-between items-center mb-2 pr-3">
        <h3 className="font-semibold flex items-center gap-2 ml-3">{image[head]}{head}</h3>

        {onEdit && (
          <button
            className="text-sm text-blue-600 hover:underline cursor-pointer block lg:hidden"
          >
            Edit
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <ul className="list-disc ml-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">
          {items.map((item) => (
            <li key={item._id} className="truncate">{item.description}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center">Click To Add Task</p>
      )}
    </div>
  );
};

export default ListTask;
