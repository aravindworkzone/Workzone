import { Clock, CheckCircle, Repeat } from "lucide-react";

const Footer = ({ activeTab, setActiveTab }) => {
  const base =
    "flex flex-col items-center text-xs transition";
  const active =
    "text-green-400";
  const inactive =
    "text-gray-400 hover:text-white";

  return (
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
        onClick={() => setActiveTab("history")}
        className={`${base} ${activeTab === "history" ? active : inactive}`}
      >
        <Clock size={18} />
        <span>Insights</span>
      </button>

      {/* Today */}
      <button
        onClick={() => setActiveTab("today")}
        className={`${base} ${activeTab === "today" ? active : inactive}`}
      >
        <CheckCircle size={18} />
        <span>Today</span>
      </button>

      {/* Routine */}
      <button
        onClick={() => setActiveTab("routine")}
        className={`${base} ${activeTab === "routine" ? active : inactive}`}
      >
        <Repeat size={18} />
        <span>Routine</span>
      </button>
    </footer>
  );
};

export default Footer;
