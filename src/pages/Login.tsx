import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import ChangeThemes from "../components/ChangesThemes";
import Loader from "../components/Loader";
import mtnLogo from "../../public/images/mtn-logo.svg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login, isAuthenticated, loading } = useAuth();

  // ✅ Ensuring hooks always run in the same order
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/", { replace: true });
    } catch (error) {
      // console.error("Login error:", error);
      toast.error("Invalid credentials");
    }
  };

  // ✅ Correct placement for conditional rendering
  if (loading) return <Loader />;

  return (
    <div className="w-full p-0 m-0">
      <form
        className="w-full min-h-screen flex justify-center items-center bg-base-200 relative"
        onSubmit={handleSubmit}
      >
        <div className="absolute top-5 right-5 z-[99]">
          <ChangeThemes />
        </div>
        <div className="w-full h-screen xl:h-auto xl:w-[30%] 2xl:w-[25%] 3xl:w-[20%] bg-base-100 rounded-lg shadow-md flex flex-col items-center p-5 pb-7 gap-8 pt-20 xl:pt-7">
          <div className="flex items-center gap-1 xl:gap-2">
            <img src={mtnLogo} alt="logo" />
            <span className="text-[18px] sm:text-lg xl:text-3xl font-semibold text-base-content dark:text-neutral-200"></span>
          </div>
          <span className="xl:text-xl font-semibold">
            Hello, 👋 Welcome Back!
          </span>
          <div className="w-full flex flex-col items-stretch gap-3">
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow input outline-none border-none pl-1"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="password"
                className="grow input outline-none border-none pl-1"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button type="submit" className="btn btn-block btn-primary">
              Log In
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
