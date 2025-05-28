"use client";
import { changePassword, fetchInfo, getLoggedInUserData, getToken, login } from "@/utils/DataServices";
import { IUserInfo, IUserProfileInfo } from "@/utils/Interfaces";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ForgotPassword = () => {
  // PAGE DOES NOT WORK YET
  const [username, setUsername] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [newPassword, setnewPassword] = useState("");
  const [showQuestion, setShowQuestion] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("please wait...");
  const router = useRouter();
  const [accountData, setAccountData] = useState<IUserProfileInfo>({
    id: 0,
    username: "",
    salt: "",
    hash: "",
    date: "",
    accountType: "",
    name: "",
    rating: 0,
    ratingCount: [],
    followers: [],
    following: [],
    likes: [],
    securityQuestion: "",
    securityAnswer: "",
    bio: "",
    email: "",
    shopName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    pfp: "",
    isDeleted: false,
  });

  const toggleQuestion = async () => {
    setShowQuestion(true);
    const dataCheck = await getLoggedInUserData(username);
    if (dataCheck != null) {
      setAccountData(dataCheck);
      setQuestion(dataCheck.securityQuestion);
    }
  };

  const handleSubmit = async() => {
    console.log("password change initiated");
    if (accountData.securityAnswer == answer.toLowerCase()) {
      // RESET PASSWORD LOGIC AND PUSH THE USER PAGE
      console.log("answers matches");
      const payload:IUserInfo = {username:username, password:newPassword}
      if(await changePassword(payload,getToken()))
      {
        setError(false)
        await login(payload)
           const queryParams = new URLSearchParams({
      u: username,
    }).toString();
    router.push(`/user-profile?${queryParams}`);
      }
    }
    else{
      setError(true)
    }
  };

  return (
    <div className="bg-white flex">
      <div className="flex-4/10 py-6 px-8">
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
          <Link href={"/"} className="cursor-pointer">
            <p className="font-[NeueMontreal-Medium] text-lg lg:text-xl text-white lg:text-black">
              SHEARGENIUS
            </p>
          </Link>
        </div>
        <div className="flex flex-col justify-center text-center mt-14">
          <p className="font-[NeueMontreal-Bold] text-3xl"> CHANGE PASSWORD </p>
          <p className="font-[NeueMontreal-Medium] text-sm">
            {" "}
            Enter username to reset password{" "}
          </p>
        </div>
        <div className="flex flex-col mt-20">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <p className="font-[NeueMontreal-Medium] text-sm pb-1">
                {" "}
                Username{" "}
              </p>
              <input
                className="bg-[#F5F5F5] rounded-md p-4 disabled:"
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={showQuestion ? true : false}
              />
            </div>
            {showQuestion && question != "please wait..." ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <p className="font-[NeueMontreal-Medium] text-sm pb-1">
                    {showQuestion ? `Your security question: ${question}` : ""}
                  </p>
                  <input
                    className="bg-[#F5F5F5] rounded-md p-4"
                    type="text"
                    placeholder="Answer"
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                  />
                  {error && (<p className="font-[NeueMontreal-Medium] text-sm pb-1">Security answer was incorrect...</p>)}
                </div>
                <div className="flex flex-col">
                  <p className="font-[NeueMontreal-Medium] text-sm pb-1">
                    {" "}
                    New Password{" "}
                  </p>
                  <input
                    className="bg-[#F5F5F5] rounded-md p-4"
                    type="text"
                    placeholder="Password"
                    onChange={(e) => setnewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col mt-8 text-center">
                  <button
                    className="bg-[#1500FF] text-white py-4 rounded-md font-[NeueMontreal-Medium] text-sm hover:bg-black active:bg-[#1500FF] cursor-pointer"
                    onClick={handleSubmit}
                  >
                    SUBMIT
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col mt-8 text-center">
                <button
                  className="bg-[#1500FF] text-white py-4 rounded-md font-[NeueMontreal-Medium] text-sm hover:bg-black active:bg-[#1500FF] cursor-pointer"
                  onClick={toggleQuestion}
                >
                  SUBMIT
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-6/10">
        <img
          className="w-[1000px] h-[100vh] object-cover"
          src="./loginregister-img.webp"
          alt=""
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
