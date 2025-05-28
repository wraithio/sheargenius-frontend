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
  const searchParams = useSearchParams();

  useEffect(() => {
    const getInfo = async () => {
      if (searchParams.get("u"))
        setAccountData(await getUserData(searchParams.get("u") || ""));
    };
    getInfo();
  }, [searchActive, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar setSearchActive={setSearchActive} />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col gap-8">
          {accountData.username == fetchInfo().username ? (
            <UserProfileCard {...accountData} />
          ) : (
            <SearchProfileCard {...accountData} />
          )}

          <div className="w-full">
            <PostFeed {...accountData} />
          </div>
        </div>
      </main>

      <div className="mt-16 sm:mt-20 lg:mt-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50"></div>
        <div className="relative">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
