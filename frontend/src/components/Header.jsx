import { LogOut } from "lucide-react";
import logo from "../assets/main_logo.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCheckUserQuery, useLogoutUserMutation} from "../redux/api/auth";
import { useProductivityQuery} from "../redux/api/task";
import HeadSkeleton from "./Loader/HeadSkeleton";
import LoginSkeleton from "./Loader/loginSkeleton";
import Popup from "./popup";

const Header = () => {
  const navigate = useNavigate();
  const { data: productivity = 0, isLoading: productivityLoading } = useProductivityQuery();

  const [logoutPop, setLogoutPop] = useState(false);
  
  const [logoutUser, { isLoading: logoutLoading }] = useLogoutUserMutation();
  const handleLogout = async () => {
    try {
      const result = await logoutUser().unwrap();
      if(result){
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading, isError } = useCheckUserQuery();
  useEffect(() => {
    if (isError && !isLoading) {
      navigate("/", { replace: true });
    }
  }, [isError, isLoading, navigate]);

  if(logoutPop){
    return <Popup header={"Logout"} cleaner={setLogoutPop} update={handleLogout} submit={"Logout"} Cancel={"Stay In"}>
      <div className="text-center">
        <p className="text-sm text-gray-800 dark:text-gray-200">Are you sure you want to logout?</p>
      </div>
    </Popup>
  }

  if(isLoading || productivityLoading){
    return <HeadSkeleton/>
  }

  if(logoutLoading){
    return <LoginSkeleton/>
  }

  return (
    <>
      <header
        className="
          h-16
          px-4 sm:px-6
          grid grid-cols-3 items-center
          bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800
          text-gray-900 dark:text-gray-100
        "
      >
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

        <div className="flex flex-col gap-2">
            <div className="text-center flex gap-2 items-center justify-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Productivity (last 7 days)
            </p>
            <p
              className={`text-base font-semibold ${
                productivity >= 70
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {productivity}%
            </p>
          </div>
          <div className="hidden sm:block w-full h-2 bg-gray-300 rounded-full dark:bg-gray-600">
            <div
              className={`h-2 rounded-full ${
                productivity >= 70
                  ? "bg-gradient-to-r from-green-400 via-green-300 to-green-500 dark:from-green-600 dark:via-green-500 dark:to-green-700"
                  : "bg-gradient-to-r from-slate-400 to-slate-500 dark:from-slate-500 dark:to-slate-400/70"
              }`}
              style={{ width: `${productivity}%` }}
            />
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-3">
            <LogOut onClick={() => setLogoutPop(true)} className="inline-block h-6 w-6 mr-2 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              <title>Logout</title>
            </LogOut>
            <div className="flex items-center gap-2">
              <p className="hidden sm:block text-sm font-medium">
                Hi, {data?.user}
              </p>
              <div className="w-8 h-8 font-medium rounded-full bg-gradient-to-r   from-blue-500   via-blue-600  to-blue-500 text-white flex items-center justify-center">
                {data?.user?.charAt(0)?.toUpperCase() || "?"}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
