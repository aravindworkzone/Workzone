import { BarChart3, CheckCircle, Layers } from "lucide-react";
import { useGetTaskQuery} from "../redux/api/task";
import FooterSkeleton from "./Loader/FooterSkeleton";

const Footer = ({appstatus, OnToggle}) => {
  const { data: today, isLoading } = useGetTaskQuery('Today Task');
  const { data: routine, isLoading: routineLoading } = useGetTaskQuery('Daily Routine');
  const { data: year, isLoading: yearLoading } = useGetTaskQuery('Yearly Goal');

  const base =
    "flex flex-col items-center text-xs transition";
  const active =
    "text-green-400";
  const inactive =
    "text-gray-400 hover:text-white";

  return (
    <>
    {isLoading && routineLoading && yearLoading ? <FooterSkeleton /> : (
      <footer
        className="flex lg:hidden
          fixed bottom-0 left-0 right-0
          h-14
          bg-gray-900 border-t border-gray-800
          items-center justify-around
        "
      >
        {/* History */}
        <button
          onClick={() => OnToggle("history")}
          className={`${base} ${appstatus === "history" ? active : inactive}`}
        >
          <BarChart3 size={18} />
          <span>Insights</span>
        </button>

        {/* Today */}
        <button
          onClick={() => OnToggle("today")}
          className={`${base} ${appstatus === "today" ? active : inactive}`}
        >
          <CheckCircle size={18} />
          <span>Today</span>
        </button>

        {/* Routine */}
        <button
          onClick={() => OnToggle("routine")}
          className={`${base} ${appstatus === "routine" ? active : inactive}`}
        >
          <Layers size={18} />
          <span>Routine</span>
        </button>
      </footer>
    )}
    </>

  );
};

export default Footer;
