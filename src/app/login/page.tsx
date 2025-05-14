"use client";
import { getLoggedInUserData, loggedInData, login } from "@/utils/DataServices";
import { IToken } from "@/utils/Interfaces";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    console.log("login attempted");
    const userData = {
      username: username,
      password: password,
    };
    let token: IToken | null = null;
    try {
      token = await login(userData);
    } catch (err) {
      console.error("Login API call failed:", err);
      setError(true);
    }

    if (token) {
      if (typeof window !== "undefined") {
        setError(false);
        localStorage.setItem("Token", token.token);
        // console.log(token.token);
        try {
          await getLoggedInUserData(username);
          const accountInfo = loggedInData();
          sessionStorage.setItem("AccountInfo", JSON.stringify(accountInfo));
          if (accountInfo && accountInfo.isDeleted === false) {
            router.push("/");
          } else {
            console.log("Account is deleted or info missing.");
            setError(true);
            localStorage.removeItem("Token");
            sessionStorage.removeItem("AccountInfo");
          }
        } catch (err) {
          console.error("Failed to get user data or navigate:", err);
          setError(true);
          localStorage.removeItem("Token");
          sessionStorage.removeItem("AccountInfo");
        }
      }
    } else {
      setError(true);
      console.log("Login was unsuccessful, invalid username or password");
    }
  };

  const clearStorage = () =>{
    if(sessionStorage.getItem("presetEmail") != null) sessionStorage.removeItem("presetEmail")
  }
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-10">
        <p className="font-[NeueMontreal-Medium] text-lg lg:text-xl text-white lg:text-black">
          {" "}
          SHEARGENIUS{" "}
        </p>
      </div>

      <div
        className="w-full lg:w-4/10 flex flex-col flex-grow
                     bg-cover bg-center bg-[url('/loginregister-img.jpg')] lg:bg-none
                     lg:justify-center lg:p-8 lg:pt-24"
      >
        <div
          className="w-full max-w-md mx-auto my-auto bg-white p-6 sm:p-8 shadow-xl rounded-lg flex flex-col
                        lg:my-0 lg:max-w-none lg:shadow-none lg:rounded-none lg:bg-white lg:p-0"
        >
          <div className="flex flex-col justify-center text-center pt-12 lg:pt-0 mt-4 md:mt-0">
            <p className="font-[NeueMontreal-Bold] text-2xl lg:text-3xl">
              {" "}
              LOGIN{" "}
            </p>
            <p className="font-[NeueMontreal-Medium] text-sm">
              {" "}
              Welcome Back!{" "}
            </p>
          </div>

          <div className="flex flex-col mt-8 sm:mt-12 flex-grow">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col">
                <p className="font-[NeueMontreal-Medium] text-sm pb-1">
                  {" "}
                  Username{" "}
                </p>
                <input
                  className="bg-[#F5F5F5] rounded-md p-3 sm:p-4 text-sm sm:text-base"
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  aria-label="Username"
                />
              </div>
              <div className="flex flex-col">
                <p className="font-[NeueMontreal-Medium] text-sm pb-1">
                  {" "}
                  Password{" "}
                </p>
                <input
                  className="bg-[#F5F5F5] rounded-md p-3 sm:p-4 text-sm sm:text-base"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="Password"
                />
              </div>
              {error && (
                <p className="text-red-500 font-[NeueMontreal-Medium] text-sm">
                  Invalid username or password
                </p>
              )}
              <div className="flex flex-col mt-6 sm:mt-8 lg:mt-auto text-center gap-2 pt-4">
                <button
                  className="bg-[#1500FF] text-white py-3 sm:py-4 rounded-md font-[NeueMontreal-Medium] text-sm hover:bg-black active:bg-[#1500FF] cursor-pointer transition-colors duration-150"
                  onClick={handleSubmit}
                >
                  LOGIN
                </button>
                <p className="font-[NeueMontreal-Medium] text-xs sm:text-sm pt-1">
                  Don&#39;t have an account?
                  <Link
                    className="text-[#1500FF] active:text-[#3F5CFF] hover:underline ml-1"
                    href={"./register"} onClick={() => clearStorage()}
                  >
                    Sign Up
                  </Link>
                </p>
                <p className="font-[NeueMontreal-Medium] text-xs sm:text-sm">
                  Forgot your password?
                  <Link
                    className="text-[#1500FF] active:text-[#3F5CFF] hover:underline ml-1"
                    href={"/forgot-password"}
                  >
                    Click Here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-6/10 lg:h-screen">
        <img
          className="w-full h-full object-cover"
          src="/loginregister-img.jpg"
          alt="Decorative background image showing barber tools or shop interior"
        />
      </div>
    </div>
  );
};

export default Login;
