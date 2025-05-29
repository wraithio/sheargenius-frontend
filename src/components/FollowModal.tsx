import React, { useEffect, useState } from 'react';
import { X, UserRoundMinus, UserRoundPlus } from 'lucide-react';
import Image from 'next/image';
import { getUserData, fetchInfo, toggleFollowers, checkToken, getToken } from '@/utils/DataServices';
import { redirect } from 'next/navigation';

interface FollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  followers: string[];
  following: string[];
  onViewProfile: (username: string) => void;
  isOwnProfile?: boolean;
}

interface UserProfilePictures {
  [username: string]: string;
}

const FollowModal = ({ isOpen, onClose, followers, following, onViewProfile, isOwnProfile = false }: FollowModalProps) => {
  const [followerPics, setFollowerPics] = useState<UserProfilePictures>({});
  const [followingPics, setFollowingPics] = useState<UserProfilePictures>({});
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');
  const loggedInUsername = fetchInfo()?.username || "";

  const handleFollow = async (username: string) => {
    if (!checkToken()) {
      redirect("/login");
    } else {
      await toggleFollowers(loggedInUsername, username, getToken());
      window.location.reload();
    }
  };

  useEffect(() => {
    const fetchProfilePictures = async () => {
      const followerPromises = followers.map(async (follower) => {
        const userData = await getUserData(follower);
        return { username: follower, pfp: userData?.pfp || '/default-pfp.jpeg' };
      });

      const followingPromises = following.map(async (followedUser) => {
        const userData = await getUserData(followedUser);
        return { username: followedUser, pfp: userData?.pfp || '/default-pfp.jpeg' };
      });

      const followerResults = await Promise.all(followerPromises);
      const newFollowerPics: UserProfilePictures = {};
      followerResults.forEach(result => {
        newFollowerPics[result.username] = result.pfp;
      });
      setFollowerPics(newFollowerPics);

      const followingResults = await Promise.all(followingPromises);
      const newFollowingPics: UserProfilePictures = {};
      followingResults.forEach(result => {
        newFollowingPics[result.username] = result.pfp;
      });
      setFollowingPics(newFollowingPics);
    };

    if (isOpen) {
      fetchProfilePictures();
    }
  }, [isOpen, followers, following]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl animate-in zoom-in-95 relative">
        <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b border-gray-200">
          <div className="flex-1" />
          <div className="flex-[2] text-center">
            <h2 className="text-xl font-[NeueMontreal-Medium]">Connections</h2>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="md:hidden">
          <div className="flex border-b border-gray-200">
            <div className="grid grid-cols-2 w-full">
              <div className="flex justify-center relative">
                <button
                  onClick={() => setActiveTab('followers')}
                  className={`py-4 px-6 text-center font-[NeueMontreal-Medium] text-lg transition-colors ${
                    activeTab === 'followers' 
                      ? 'text-black' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Followers
                  <span className="text-base text-gray-500 ml-2.5 font-[NeueMontreal-Medium]">
                    {followers.length}
                  </span>
                </button>
                {activeTab === 'followers' && (
                  <div className="absolute bottom-0 w-full h-0.5 bg-black" />
                )}
              </div>
              <div className="flex justify-center relative">
                <button
                  onClick={() => setActiveTab('following')}
                  className={`py-4 px-6 text-center font-[NeueMontreal-Medium] text-lg transition-colors ${
                    activeTab === 'following' 
                      ? 'text-black' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Following
                  <span className="text-base text-gray-500 ml-2.5 font-[NeueMontreal-Medium]">
                    {following.length}
                  </span>
                </button>
                {activeTab === 'following' && (
                  <div className="absolute bottom-0 w-full h-0.5 bg-black" />
                )}
              </div>
            </div>
          </div>

          <div className="p-6 min-h-[50vh] max-h-[70vh]">
            {activeTab === 'followers' ? (
              <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-2">
                  {followers.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center">No followers yet</p>
                  ) : (
                    followers.map((follower, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <div 
                          className="flex-1 flex items-center gap-3 cursor-pointer"
                          onClick={() => onViewProfile(follower)}
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                            <Image
                              width={40}
                              height={40}
                              src={followerPics[follower] || '/default-pfp.jpeg'}
                              alt={`${follower}'s profile picture`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-[NeueMontreal-Medium] truncate">
                            {follower}
                          </span>
                        </div>
                        <button
                          onClick={() => handleFollow(follower)}
                          className="group relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          {following.includes(follower) ? (
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
                                {isOwnProfile ? "Follow Back" : "Follow"}
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-2">
                  {following.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center">Not following anyone yet</p>
                  ) : (
                    following.map((followedUser, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <div 
                          className="flex-1 flex items-center gap-3 cursor-pointer"
                          onClick={() => onViewProfile(followedUser)}
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                            <Image
                              width={40}
                              height={40}
                              src={followingPics[followedUser] || '/default-pfp.jpeg'}
                              alt={`${followedUser}'s profile picture`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-[NeueMontreal-Medium] truncate">
                            {followedUser}
                          </span>
                        </div>
                        <button
                          onClick={() => handleFollow(followedUser)}
                          className="group relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <UserRoundMinus className="w-5 h-5 text-red-500 hover:text-red-600 transition-colors" />
                          <span className="absolute -bottom-8 right-0 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Unfollow
                          </span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:block">
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-[NeueMontreal-Medium] mb-4 text-center">
                Followers
                <span className="text-base text-gray-500 ml-2.5 font-[NeueMontreal-Medium]">
                  {followers.length}
                </span>
              </h3>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {followers.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center">No followers yet</p>
                ) : (
                  followers.map((follower, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <div 
                        className="flex-1 flex items-center gap-3 cursor-pointer"
                        onClick={() => onViewProfile(follower)}
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                          <Image
                            width={40}
                            height={40}
                            src={followerPics[follower] || '/default-pfp.jpeg'}
                            alt={`${follower}'s profile picture`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-[NeueMontreal-Medium] truncate">
                          {follower}
                        </span>
                      </div>
                      <button
                        onClick={() => handleFollow(follower)}
                        className="group relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        {following.includes(follower) ? (
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
                              {isOwnProfile ? "Follow Back" : "Follow"}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-[NeueMontreal-Medium] mb-4 text-center">
                Following
                <span className="text-base text-gray-500 ml-2.5 font-[NeueMontreal-Medium]">
                  {following.length}
                </span>
              </h3>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {following.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center">Not following anyone yet</p>
                ) : (
                  following.map((followedUser, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <div 
                        className="flex-1 flex items-center gap-3 cursor-pointer"
                        onClick={() => onViewProfile(followedUser)}
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                          <Image
                            width={40}
                            height={40}
                            src={followingPics[followedUser] || '/default-pfp.jpeg'}
                            alt={`${followedUser}'s profile picture`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-[NeueMontreal-Medium] truncate">
                          {followedUser}
                        </span>
                      </div>
                      <button
                        onClick={() => handleFollow(followedUser)}
                        className="group relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <UserRoundMinus className="w-5 h-5 text-red-500 hover:text-red-600 transition-colors" />
                        <span className="absolute -bottom-8 right-0 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Unfollow
                        </span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowModal; 