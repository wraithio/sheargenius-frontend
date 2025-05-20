"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import UserProfileCard from "@/components/UserProfileCard";
import { IUserProfileInfo } from "@/utils/Interfaces";
import PostFeed from "@/components/PostFeed";
import Footer from "@/components/Footer";
import { useSearchParams } from "next/navigation";
import { fetchInfo, getUserData } from "@/utils/DataServices";
import SearchProfileCard from "@/components/SearchProfileCard";

const UserProfile = () => {
  const [searchActive, setSearchActive] = useState(false);
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
    pfp: "/nofileselected.png",
    isDeleted: false,
  });
  const searchParams = useSearchParams()

  useEffect(() => {
    const getInfo = async() => {
      if(searchParams.get("u")) setAccountData(await getUserData(searchParams.get("u")||""))
    }
    getInfo()
  }, [searchActive,searchParams]);
  // useEffect(() => {
  //   if (
  //     typeof window !== "undefined" &&
  //     sessionStorage.getItem("AccountInfo")
  //   ) {
  //     setAccountData(JSON.parse(sessionStorage.getItem("AccountInfo") || "{}"));
  //   }
  // }, [searchActive]);

  // console.log(accountData);

  // const router = useRouter();

  // account checking
  // if(!checkFToken) router.push("/login")

  return (
    <div>
      <Navbar setSearchActive={setSearchActive} />
      <div className="flex min-h-screen flex-col gap-2 font-[NeueMontreal-Medium] mx-5">
        {accountData.username == fetchInfo().username ? 
        <UserProfileCard {...accountData} />
      :
        <SearchProfileCard {...accountData}/>
        }
        <PostFeed {...accountData} />
      </div>
      <div className="mt-16 sm:mt-20 lg:mt-25">
        <Footer />
      </div>
    </div>
  );
};

export default UserProfile;
