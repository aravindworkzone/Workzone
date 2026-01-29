import { LogOut } from "lucide-react";
import logo from "../assets/main_logo.png";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slice/auth";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCheckUserQuery} from "../redux/api";
import { useLogoutUserMutation} from "../redux/api";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const { user } = useSelector((state) => state.auth);
  const { data, isLoading, isError } = useCheckUserQuery();

  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      const result = await logoutUser().unwrap();
      if(result){
        dispatch(logout());
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isLoading && !data?.user) {
      navigate("/login", { replace: true });
    }
  }, [data, isError, isLoading]);

  // 🔹 Replace later with Redux / API
  const last30TotalTasks = 120;
  const last30CompletedTasks = 96;

  const productivity =
    last30TotalTasks === 0
      ? 0
      : Math.round((last30CompletedTasks / last30TotalTasks) * 100);

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
          <LogOut onClick={handleLogout} className="inline-block h-6 w-6 mr-2 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <title>Logout</title>
          </LogOut>
          <div className="flex items-center gap-2">
            <p className="hidden lg:block text-sm font-medium">
              Hi, {data?.user}
            </p>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              {data?.user?.charAt(0)?.toUpperCase() || "?"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
