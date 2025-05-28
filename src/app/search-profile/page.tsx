"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PostFeed from "@/components/PostFeed";
import SearchProfileCard from "@/components/SearchProfileCard";
import { getCategory, getUserData } from "@/utils/DataServices";
import { IUserProfileInfo } from "@/utils/Interfaces";
import React, { useEffect, useState } from "react";

const SearchProfile = () => {
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [data, setData] = useState<IUserProfileInfo>({
    id: 0,
    username: "",
    salt: "",
    hash: "",
    accountType: "",
    date: "",
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
    pfp: "#",
    isDeleted: false,
  });

  useEffect(() => {
    const getData = async (name: string) => {
      setData(await getUserData(name));
    };
    getData(getCategory());
  }, [searchActive]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar setSearchActive={setSearchActive} />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col gap-8">
          <SearchProfileCard {...data} />
          
          <div className="w-full">
            <PostFeed {...data} />
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

export default SearchProfile;
