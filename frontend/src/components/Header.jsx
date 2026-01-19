import { LogOut } from "lucide-react";
import logo from "../assets/main_logo.png";
import API from "../utils/api";

const Header = () => {
  const today = new Date().toDateString();
  const username = "Learner";

  // 🔹 Replace later with Redux / API
  const last30TotalTasks = 120;
  const last30CompletedTasks = 96;

  const productivity =
    last30TotalTasks === 0
      ? 0
      : Math.round((last30CompletedTasks / last30TotalTasks) * 100);

  const logoutHandler = () => {
    API.post("auth/logout")
      .then((res) => {
        console.log("Logout successful:", res.data);
        localStorage.removeItem("isAuth");
        window.location.reload();
      })
      .catch((err) => {
        console.error("Logout failed:", err.response.data);
      });
  }

  return (
    <header
      className="
        h-16
        px-4 sm:px-6
        grid grid-cols-3 items-center
        border-b
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-gray-100
      "
    >
      {/* LEFT – Logo */}
      <div className="flex items-center gap-2">
        <img
          src={logo}
          alt="Todo Logo"
          className="h-5 w-5 object-contain rounded-[3px]"
        />
        <span className="font-semibold text-lg flex gap-1">
          Todo <span className="hidden sm:block">Planner</span>
        </span>
      </div>

      {/* CENTER – Productivity */}
      <div className="text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Productivity (7 days)
        </p>
        <p
          className={`text-lg font-semibold ${
            productivity >= 70
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {productivity}%
        </p>
      </div>

      {/* RIGHT – User & Date */}
      <div className="text-right">
        <div className="flex items-center justify-end gap-3">
          <LogOut onClick={logoutHandler} className="inline-block h-6 w-6 mr-2 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <title>Logout</title>
          </LogOut>
          <div>
            <p className="text-sm font-medium">
              Hi, {username}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {today}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
