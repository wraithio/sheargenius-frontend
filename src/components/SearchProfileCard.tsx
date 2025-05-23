import {
  checkToken,
  fetchInfo,
  getToken,
  toggleFollowers,
} from "@/utils/DataServices";
import { IUserProfileInfo } from "@/utils/Interfaces";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import RatingComponent from "./RatingComponent";
import Image from "next/image";
import SendRequestComponent from "./SendRequestComponent";

const SearchProfileCard = (data: IUserProfileInfo) => {
  const [profileData, setProfileData] = useState<IUserProfileInfo>(data);
  const [rate, setRate] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<boolean>(false);
  // const [error, setError] = useState<boolean>(false);
  const [openFollowing, setOpenFollowing] = useState(false);
  const [openFollowers, setOpenFollowers] = useState(false);
  const [rating, setRating] = useState<string>("0");
  const router = useRouter();


  useEffect(() => {
    setProfileData(data);
    const division_result = data.rating / data.ratingCount.length;
    setRating(String(Math.round(division_result * 10) / 10));
  }, [rating, data]);

  const follow = async () => {
    if (!checkToken()) {
      redirect("/login");
    } else {
      await toggleFollowers(
        fetchInfo().username,
        profileData.username,
        getToken()
      );
      window.location.reload();
    }
  };

  const openRate = () => {
    if (!profileData.ratingCount.includes(fetchInfo().username)) {
      setRate(true);
    } else {
      //need front-end styling for when error is set to true
      // setError(true);
      alert(`you have already rated ${profileData.username}`);
    }
  };

  const loggedInUsername = fetchInfo()?.username || "";

  const goToProfile = (name: string) => {
    const queryParams = new URLSearchParams({
      u: name,
    }).toString();
    router.push(`/user-profile?${queryParams}`);
  };

  const closeMenus = (b: boolean) => {
    setOpenFollowers(b);
    setOpenFollowing(b);
  };

  const setFollowers = () => {
    setOpenFollowers(true);
    setOpenFollowing(false);
  };

  const setFollowing = () => {
    setOpenFollowers(false);
    setOpenFollowing(true);
  };

   const setRatingNum = () => {
    const division_result = profileData.rating / profileData.ratingCount.length;
    return String(Math.round(division_result * 10) / 10);
  };

  return (
    <div
      className="flex gap-2 bg-[#F5F5F5] rounded-b-sm p-5"
      onClick={
        openFollowers || openFollowing ? () => closeMenus(false) : undefined
      }
    >
      <div className="w-[60%] sm:w-[70%] flex flex-col sm:gap-2 gap-5">
        <div className="flex sm:gap-7 gap-3 h-[125px]">
          <Image
          width={300}
          height={300}
            src={profileData.pfp}
            alt={`${profileData.username} profile pic`}
            className="sm:w-28 sm:h-28 h-16 w-16 rounded-[50%]"
            priority
          />
          <div className="flex flex-col sm:gap-1">
            <h4 className="text-slate-500 sm:text-sm text-xs">
              Joined: {profileData.date}
            </h4>
            <div className="flex gap-3 place-items-center">
              <h2 className="sm:text-3xl text-xl h-fit">
                {profileData.username}
              </h2>
              <h3 className="sm:text-base text-xs text-slate-400">
                {profileData.accountType}
              </h3>
              <div
                className={
                  profileData.accountType == "Barber"
                    ? "flex gap-1 place-items-center"
                    : "hidden"
                }
              >
                <p>{profileData.ratingCount.length != 0 ? setRatingNum() : "0"}</p>
                <img
                  className="w-[15px] h-[15px] hover:drop-shadow-xl"
                  src="/icons/star.png"
                  alt="Star Icon"
                />
              </div>
            </div>
            <h2>{profileData.name}</h2>
            <div className="sm:text-base text-xs flex sm:gap-12 gap-2">
              <div className="relative">
                <h3
                // onClick={() => setOpenFollowers(true)}
                >
                  {profileData.followers.length} Followers
                </h3>
                <div
                  className="absolute top-0 bottom-0 w-full h-full cursor-pointer "
                  onClick={() => setFollowers()}
                ></div>
                {openFollowers && profileData.followers.length !== 0 && (
                  <div className="absolute p-2 rounded-md border-1 bg-white w-60">
                    {profileData.followers.map((user, index) => (
                      <div key={index} className="flex justify-between">
                        <h3 className="text-xl">{user}</h3>
                        <button
                          className="cursor-pointer hover:text-white hover:bg-black px-2 border-1"
                          onClick={() => goToProfile(user)}
                        >
                          go to profile
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <h3>{profileData.following.length} Following</h3>
                <div
                  className="absolute top-0 bottom-0 w-full h-full cursor-pointer "
                  onClick={() => setFollowing()}
                ></div>
                {openFollowing && profileData.following.length !== 0 && (
                  <div className="absolute p-2 rounded-md border-1 bg-white w-60">
                    {profileData.following.map((user, index) => (
                      <div key={index} className="flex justify-between">
                        <h3 className="text-xl">{user}</h3>
                        <button
                          className="cursor-pointer hover:text-white hover:bg-black px-2 border-1"
                          onClick={() => goToProfile(user)}
                        >
                          go to profile
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 bg-white p-2 rounded-sm w-full h-[150px]">
          <h3>Bio</h3>
          <h3>{profileData.bio}</h3>
        </div>
      </div>
      <div className="w-[40%] sm:w-[30%] flex flex-col sm:gap-2 gap-5">
        <div className=" flex flex-col gap-1 h-[125px] place-content-end">
          <button className="bg-black w-full text-white font-[NeueMontreal-Regular] py-1 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75" onClick={() => setSchedule(true)}>
            Schedule
          </button>
           {schedule && (
        <div className="fixed top-0 left-0 h-screen w-screen bg-[#f5f5f596] flex justify-center place-items-center z-50">
          <div className="w-fit bg-white p-2 rounded-sm relative">
            <h3
              className="text-slate-600 hover:text-black cursor-pointer absolute top-2 left-3 text-2xl"
              onClick={() => setSchedule(false)}
            >
              X
            </h3>
            <div className="mt-7">
            <SendRequestComponent barberName={profileData.username} />

            </div>
          </div>
        </div>
      )}
          <button
            className="bg-blue-500 w-full text-white font-[NeueMontreal-Regular] py-1 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75"
            onClick={follow}
          >
            {profileData.followers.includes(loggedInUsername)
              ? "Unfollow"
              : "Follow"}
          </button>
          <button
            className="bg-red-600 w-full text-white font-[NeueMontreal-Regular] py-1 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75"
            onClick={openRate}
          >
            Rate
          </button>
          {/* {error && (
            <p className="text-red-600 pt-2">
              you have already rated {profileData.username}
            </p>
          // )} */}
          {rate && (
            <div className="fixed inset-0 h-screen w-screen bg-black/60 flex justify-center items-center z-50 p-4">
              <div className="w-[100%] max-w-md sm:w-[70%] md:w-[60%] lg:w-[50%] bg-white p-4 pt-10 sm:pt-12 rounded-lg relative shadow-md">
                <button
                  className="absolute top-2 left-2 p-1 rounded-full text-slate-600 hover:text-black hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => setRate(false)}
                  aria-label="Close Rating Modal"
                >
                  <img
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    src="/icons/cross-small.png"
                    alt="Close"
                  />
                </button>
                <RatingComponent usernameToRate={profileData.username} />
              </div>
            </div>
          )}
        </div>
        <div
          className={
            profileData.accountType == "Barber"
              ? "flex flex-col bg-white p-2 rounded-sm w-full h-[150px]"
              : "hidden"
          }
        >
          <h3>Location</h3>
          <h2 className="text-lg">{profileData.shopName}</h2>
          <h2>{profileData.address}</h2>
          <div className="flex gap-1">
            <h2>{profileData.city},</h2>
            <h2>{profileData.state}</h2>
          </div>
          <h2>{profileData.zip}</h2>
        </div>
      </div>
    </div>
  );
};

export default SearchProfileCard;
