import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema } from "../components/zodValid";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "../assets/todo_logo.png";
import helpIcon from "../assets/help.png";
import {login} from "../redux/slice/auth";
import { useDispatch } from "react-redux";
import { useLoginUserMutation } from "../redux/api";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const loginModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const [apiError, setApiError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginUser] = useLoginUserMutation();

  const onSubmit = async (e) => {
    console.log(e);
    try {
      const result = await loginUser(e).unwrap();
      console.log(result);
      dispatch(login(result));
      navigate("/");
    } catch (error) {
      setApiError(error?.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1120] flex flex-col relative transition-colors">
      {/* HEADER */}
      <header className="sm:absolute sm:h-6 h-16 flex items-center justify-between px-[50px] top-[15px] w-full">
        <div className="flex items-center gap-2">
          <img src={logo} className="h-7" />
        </div>

        <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 cursor-pointer relative">
          <img
            src={helpIcon}
            className="h-[13px] absolute left-[-17px] top-[2px] rounded-[50%]"
          />
          Contact Us
        </div>
      </header>

      {/* CENTER CONTENT */}
      <main className="flex-1 flex items-center justify-center px-4">
        {/* REGISTRATION CARD */}
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
            {/* USERNAME */}
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

            {/* PASSWORD */}
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
              {(apiError !== null) && (
                <p className="text-xs text-red-500 mt-1">
                  {apiError}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="
                w-full mt-2
                bg-blue-600 hover:bg-blue-700
                dark:bg-blue-500 dark:hover:bg-blue-600
                text-white py-3 rounded-xl
                font-semibold transition
              "
            >
              Login
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
