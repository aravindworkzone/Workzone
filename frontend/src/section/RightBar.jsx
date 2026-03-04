import ListTask from "../components/listTask";
import { useGetTaskQuery } from "../redux/api/task";
import { useDispatch } from "react-redux";
import {setMode} from "../redux/slice/mode";
import {setDeviceType} from "../redux/slice/deviceType";
import RightSkeleton from "../components/Loader/RightSkeleton";

const RightSidebar = () => {
  const dispatch = useDispatch();
  const { data: today, isLoading } = useGetTaskQuery('Today Task');
  const { data: routine, isLoading: routineLoading } = useGetTaskQuery('Daily Routine');
  const { data: year, isLoading: yearLoading } = useGetTaskQuery('Yearly Goal');

  const handleToggleEvent = (value) => {
    dispatch(setMode(value));
    const isMobile = window.matchMedia("(max-width: 1024px)").matches;
    if(isMobile){
      dispatch(setDeviceType("today"));
    }
  };

  const openYearlyGoal = () => handleToggleEvent("Yearly Goal");
  const openDailyRoutine = () => handleToggleEvent("Daily Routine");
  const openTodayTask = () => handleToggleEvent("Today Task");

  return (
    <>
    {isLoading && routineLoading && yearLoading ? <RightSkeleton /> : (
    <aside className="
      w-full lg:w-64
      bg-gray-50 dark:bg-gray-900
      p-4 space-y-4
      text-gray-900 dark:text-gray-100 overflow-y-auto
    ">
      <ListTask head="Yearly Goal" body={year} onEdit={openYearlyGoal}/>

      <ListTask head="Daily Routine" body={routine} onEdit={openDailyRoutine} />

      <ListTask head="Today Task" body={today} onEdit={openTodayTask} />
    </aside>
    )
  }
  </>
  );
};

export default RightSidebar;
