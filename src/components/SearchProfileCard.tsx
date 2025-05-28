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
import FollowModal from "./FollowModal";
import {
  UserRoundMinus,
  UserRoundPlus,
  Sparkles,
  ClipboardPlus,
  Star,
} from "lucide-react";

const SearchProfileCard = (data: IUserProfileInfo) => {
  const [profileData, setProfileData] = useState<IUserProfileInfo>(data);
  const [rate, setRate] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<boolean>(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
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

  const setRatingNum = () => {
    const division_result = profileData.rating / profileData.ratingCount.length;
    return String(Math.round(division_result * 10) / 10);
  };

  return (
    <section className="font-[NeueMontreal-Medium]">
      <div className="rounded-2xl overflow-hidden border border-gray-100/20 backdrop-blur-xl bg-white/50">
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="relative w-full">
                <div className="absolute top-0 right-0 flex items-center gap-4">
                  {profileData.accountType == "Barber" && (
                    <button
                      onClick={() => setSchedule(true)}
                      className="group relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ClipboardPlus className="w-5 h-5 text-gray-600 hover:text-black transition-colors" />
                      <span className="absolute -bottom-8 right-0 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Schedule Appointment
                      </span>
                    </button>
                  )}
                  <button
                    onClick={follow}
                    className="group relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {profileData.followers.includes(loggedInUsername) ? (
                      <>
                        <UserRoundMinus className="w-5 h-5 text-red-500 hover:text-red-600 transition-colors" />
                        <span className="absolute -bottom-8 right-0 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Unfollow
                        </span>
                      </>
                    ) : (
                      <>
                        <UserRoundPlus className="w-5 h-5 text-blue-500 hover:text-blue-600 transition-colors" />
                        <span className="absolute -bottom-8 right-0 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Follow
                        </span>
                      </>
                    )}
                  </button>
                  {profileData.accountType == "Barber" && (
                    <button
                      onClick={openRate}
                      className="group relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Sparkles className="w-5 h-5 text-yellow-500 hover:text-yellow-600 transition-colors" />
                      <span className="absolute -bottom-8 right-0 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Rate Barber
                      </span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-8">
                  <div className="relative group">
                    <Image
                      width={300}
                      height={300}
                      src={profileData.pfp}
                      alt={`${profileData.username} profile pic`}
                      className="w-36 h-36 rounded-full object-cover ring-4 ring-black/5"
                      priority
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <span>Joined: {profileData.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-3xl sm:text-4xl font-[NeueMontreal-Medium] bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                          {profileData.username}
                        </h2>
                        <div
                          className={`px-3 mt-1.5 py-1 rounded-full text-xs font-medium ${
                            profileData.accountType === "Barber"
                              ? "bg-blue-100 text-blue-800 ring-1 ring-blue-800/10"
                              : "bg-gray-100 text-gray-800 ring-1 ring-gray-800/10"
                          }`}
                        >
                          {profileData.accountType}
                        </div>
                        {profileData.accountType === "Barber" && (
                          <div className="flex items-center gap-1 px-3 py-1 bg-yellow-50 rounded-full mt-1.5">
                            <span className="text-yellow-700 text-sm">
                              {profileData.ratingCount.length !== 0
                                ? setRatingNum()
                                : "0"}
                            </span>
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl text-gray-600">
                        {profileData.name}
                      </h3>
                    </div>

                    <div className="flex gap-6 text-sm">
                      <button
                        onClick={() => setShowFollowModal(true)}
                        className="text-gray-600 hover:text-black transition-colors"
                      >
                        {profileData.followers.length === 1
                          ? `${profileData.followers.length} Follower`
                          : `${profileData.followers.length} Followers`}
                      </button>
                      <button
                        onClick={() => setShowFollowModal(true)}
                        className="text-gray-600 hover:text-black transition-colors"
                      >
                        {profileData.following.length} Following
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 mt-8">
                  <div className="flex-1 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-lg mb-3">Bio</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {profileData.bio || "No bio yet."}
                    </p>
                  </div>

                  {profileData.accountType === "Barber" && (
                    <div className="lg:w-80 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                      <h3 className="text-lg mb-4">Location</h3>
                      <div className="space-y-2">
                        <h2 className="text-xl font-medium">
                          {profileData.shopName}
                        </h2>
                        <p className="text-gray-600">{profileData.address}</p>
                        <p className="text-gray-600">
                          {profileData.city}, {profileData.state}{" "}
                          {profileData.zip}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FollowModal
        isOpen={showFollowModal}
        onClose={() => setShowFollowModal(false)}
        followers={profileData.followers}
        following={profileData.following}
        onViewProfile={goToProfile}
        isOwnProfile={false}
      />

      {schedule && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-in zoom-in-95 relative">
            <button
              onClick={() => setSchedule(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <img
                className="w-5 h-5"
                src="/icons/cross-small.png"
                alt="Close"
              />
            </button>
            <SendRequestComponent barberName={profileData.username} />
          </div>
        </div>
      )}

      {rate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-in zoom-in-95 relative">
            <button
              onClick={() => setRate(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <img
                className="w-5 h-5"
                src="/icons/cross-small.png"
                alt="Close"
              />
            </button>
            <RatingComponent usernameToRate={profileData.username} />
          </div>
        </div>
      )}
    </section>
  );
};

export default SearchProfileCard;
