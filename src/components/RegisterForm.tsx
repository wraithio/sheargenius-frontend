"use client";
import { checkToken } from "@/utils/DataServices";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    setIsHidden(checkToken());
  }, [router]);

  const gotoCreate = () => {
    const queryParams = new URLSearchParams({
      presetEmail: email,
    }).toString();
    router.push(`/register?${queryParams}`);
  };

  return (
    <div
      className={`bg-black w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 ${
        isHidden ? "hidden" : ""
      }`}
    >
      <div className="flex flex-col justify-center gap-12 md:gap-16 lg:gap-20">
        <div>
          <p className="font-[NeueMontreal-Medium] text-white text-xl sm:text-2xl lg:text-3xl">
            Looking to being a career in barbering? Or seeking inspiration to
            try something new?
          </p>
          <p className="font-[NeueMontreal-Medium] text-white text-base sm:text-lg lg:text-xl mt-4 sm:mt-6 md:mt-8 lg:mt-10">
            Create an account to make posts, connect with barbers in your area
            and join a motivating and exclusive community
          </p>
        </div>

        <div className="flex flex-col gap-3 max-w-md w-full self-center md:self-start">
          <input
            className="bg-white w-full px-4 py-3 rounded-sm text-sm sm:text-base placeholder-gray-500 outline-none"
            type="text"
            placeholder="email"
            aria-label="Email for account creation"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="bg-[#1500FF] block font-[NeueMontreal-Medium] w-full px-5 py-3 rounded-sm text-white text-center text-sm sm:text-base hover:bg-white hover:text-[#1500FF] active:bg-[#1500FF] active:text-white cursor-pointer transition-all duration-150"
            onClick={gotoCreate}
          >
            Create Account
          </button>

          <div className="flex justify-center items-center mt-2">
            <p className="font-[NeueMontreal-Medium] text-white text-xs sm:text-sm">
              Already have an account?
              <Link
                className="text-[#FF4649] hover:text-[#ff7070] active:text-[#d71114] mx-1 underline"
                href={"./login"}
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex justify-center md:justify-end items-center">
        <img
          className="max-h-[450px] sm:max-h-[550px] md:max-h-[600px] lg:max-h-[700px] w-auto object-contain rounded-md"
          src="./registerpopup-image.webp"
          alt="Barber working illustration"
        />
      </div>
    </div>
  );
};

export default RegisterForm;
