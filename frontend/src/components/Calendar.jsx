import { useGetTaskHistoryQuery } from "../redux/api/task";
import { Calendar as CalendarIcon } from "lucide-react";
const Calendar = () => {
    const { data: taskStatus = [], isLoading } = useGetTaskHistoryQuery();

    const today = new Date();
    const joined = new Date(taskStatus.joinDate);
    
    let month = today.getMonth();
    const year = today.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    month = today.toLocaleString('default', { month: 'long' });
    const ShortMonth = today.toLocaleString('default', { month: 'short' });

    const data = [];

    for (let i = 1; i <= daysInMonth; i++) {
        const day = String(i).padStart(2, '0');

        let bgColor = 'bg-red-200 dark:bg-red-400 dark:text-gray-900';
        const newJoin = i < joined.getDate() && today.getMonth() === joined.getMonth() && today.getFullYear() === joined.getFullYear();

        const match = taskStatus.data?.find(t => {
            const part = t._id.split(' ');
            return part[1] === day && part[0] === ShortMonth;
        })

        if(match) {
            bgColor = 'bg-green-200 dark:bg-green-400';
        } else if (today.getDate() < i || newJoin) {
            bgColor = 'bg-gray-200 dark:bg-gray-900';
        }

        if(today.getDate() === i) {
            bgColor = 'bg-blue-200 dark:bg-blue-400';
        }

        data.push({
            day,
            bgColor
        });
    }
    
    
    return(
        <div className="bg-white dark:bg-gray-800 p-3 border-[#2e3748] rounded-lg shadow cursor-pointer">
            <h3 className="font-semibold flex items-center gap-2 mb-3">
                <CalendarIcon className="text-slate-400" size={18} />
                {month + ' ' + year}
            </h3>
            <div className="mt-2">
                {data.map((d, i) => (
                    <div key={i} className="inline-flex flex-col items-center mb-1 gap-1">
                        <span className={`inline-flex border-[#2e3748] items-center bg-gray-200 dark:bg-gray-900 m-0.5 justify-center w-6 h-6 text-xs rounded-full bg-slate-700 hover:bg-slate-600 `}>{i + 1}</span>
                        <span className={`inline-block w-1 h-1 rounded-full ${d.bgColor}`}></span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Calendar;