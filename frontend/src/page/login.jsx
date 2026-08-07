import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema } from "../utils/zodValid";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "../assets/todo_logo.png";
import helpIcon from "../assets/help.png";
import { useLoginUserMutation, useRevokeSessionsMutation } from "../redux/api/auth";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Monitor } from "lucide-react";
import Popup from "../components/popup";

const loginModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  // Holds the active devices + short lived token sent back when the session limit is hit.
  const [sessionLimit, setSessionLimit] = useState(null);
  const [revokeError, setRevokeError] = useState("");

  const navigate = useNavigate();

  const [loginUser, {isError, error, isLoading}] = useLoginUserMutation();
  const [revokeSessions, { isLoading: revokeLoading }] = useRevokeSessionsMutation();

  const onSubmit = async (e) => {
    try {
      const result = await loginUser(e).unwrap();
      if(!result) return;
      navigate("/dashboard");
    } catch (err) {
      if (err?.data?.sessionLimit) {
        setRevokeError("");
        setSessionLimit(err.data);
      }
    }
  };

  const handleRevoke = async (selected) => {
    const sessionIds = (selected || []).filter(Boolean);
    if (sessionIds.length === 0) {
      setRevokeError("Select at least one device to log out");
      return;
    }

    try {
      const result = await revokeSessions({
        sessionToken: sessionLimit.sessionToken,
        sessionIds,
      }).unwrap();

      if(!result) return;
      setSessionLimit(null);
      navigate("/dashboard");
    } catch (err) {
      if (err?.data?.sessionLimit) {
        setSessionLimit(err.data);
        setRevokeError(err.data.message);
        return;
      }
      setRevokeError(err?.data?.message || "Could not log out the selected devices");
    }
  };

  const formatLastActive = (value) => {
    const date = new Date(value);
    return isNaN(date) ? "Unknown" : date.toLocaleString();
  };

  if (sessionLimit) {
    return (
      <Popup
        header={"Device limit reached"}
        cleaner={() => { setSessionLimit(null); setRevokeError(""); }}
        update={handleRevoke}
        submit={"Logout"}
        Cancel={"Cancel"}
      >
        <div className="font-sans">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            You are logged in on {sessionLimit.maxSessions} devices. Select the ones to log
            out so you can continue on this device.
          </p>

          <ul className="mt-4 space-y-2 max-h-[240px] overflow-y-auto">
            {sessionLimit.sessions?.map((session) => (
              <li key={session.id}>
                <label className="flex items-start gap-3 cursor-pointer rounded-lg bg-white dark:bg-slate-900 px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-800">
                  <input
                    type="checkbox"
                    name="description"
                    value={session.id}
                    className="mt-1 h-4 w-4 accent-red-600 cursor-pointer"
                  />
                  <span className="flex-1">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Monitor size={14} />
                      {session.device}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      IP {session.ipAddress || "unknown"} · Last active{" "}
                      {formatLastActive(session.lastActive)}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>

          {revokeError && (
            <p className="text-xs text-red-500 mt-3">{revokeError}</p>
          )}

          {revokeLoading && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Logging out the selected devices...
            </p>
          )}
        </div>
      </Popup>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#f8fafc] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] flex flex-col relative transition-colors">
      {/* HEADER */}
      <header className="sm:absolute sm:h-6 h-16 flex items-center justify-between px-[50px] top-[15px] w-full">
        <div className="flex items-center mt-1 justify-center">
          <img src={logo} className="h-10" />
          <h1 className="text-xl dark:text-gray-100 font-bold text-gray-800 flex gap-1">Todo <span className="hidden sm:block">Planner</span></h1>
        </div>

        <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 cursor-pointer relative">
          <img
            src={helpIcon}
            className="h-[13px] absolute left-[-17px] top-[2px] rounded-[50%]"
          />
          Contact Us
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div
          className="
            w-full max-w-md
            bg-white dark:bg-[#020617]
            px-8 py-10
            rounded-2xl
            shadow-sm dark:shadow-black/40
            transition-colors
          "
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 text-center">
            Welcome
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2 mb-10 font-sans">
            let's do tasks effortlessly
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 md:space-y-10 font-sans"
          >
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Username
              </label>
              <input
                autoComplete="off"
                type="text"
                className="
                  w-full bg-transparent
                  border-b border-gray-300 dark:border-gray-700
                  py-2 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:border-blue-600 dark:focus:border-blue-500
                "
                {...register("username")}
              />
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  autoComplete="off"
                  type={showPassword ? "text" : "password"}
                  className="
                    w-full bg-transparent
                    border-b border-gray-300 dark:border-gray-700
                    py-2 text-gray-900 dark:text-gray-100
                    focus:outline-none focus:border-blue-600 dark:focus:border-blue-500
                  "
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 bottom-1 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
              {(errors.password) && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
              {isError && (
                <p className="text-xs text-red-500 mt-1">
                  {error?.data?.message || "Something went wrong. Please try again."}
                </p>
              )}
              {/* <button className="text-blue-600 dark:text-blue-400 text-[11px] cursor-pointer hover:underline">Forget Password?</button> */}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full mt-2
                flex items-center justify-center gap-3
                bg-blue-600 hover:bg-blue-700
                dark:bg-blue-500 dark:hover:bg-blue-600
                text-white py-3 rounded-xl
                font-semibold transition
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {isLoading ? (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 50 50"
                    className="animate-spin"
                  >
                    <circle
                      cx="25"
                      cy="25"
                      r="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="90"
                      strokeDashoffset="60"
                    />
                  </svg>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

          </form>

          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-8">
            Create an account?{" "}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default loginModal;
