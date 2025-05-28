import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { Button } from "./ui/button";
import { IPostItems, IUserProfileInfo } from "@/utils/Interfaces";
import { fetchInfo, getUserPosts } from "@/utils/DataServices";

const PostFeed = (data: IUserProfileInfo) => {
  const [isDropDownOpen, setDropDownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Most Recent");
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState<IPostItems[]>([]);
  const [likedPosts, setLikedPosts] = useState<IPostItems[]>([]);

  useEffect(() => {
    const asyncGetPosts = async (id: number) => {
      if (id !== 0) {
        const userPosts = await getUserPosts(id);
        setPosts(userPosts.filter((post: IPostItems) => !post.isDeleted));
        
        // Filter liked posts
        const liked = userPosts.filter((post: IPostItems) => 
          post.likes && post.likes.includes(data.id) && !post.isDeleted
        );
        setLikedPosts(liked);
      }
    };
    asyncGetPosts(data.id);
  }, [data.id, data.username]);

  const toggleDropDown = () => {
    setDropDownOpen(!isDropDownOpen);
  };

  const selectFilter = (question: string) => {
    setSelectedFilter(question);
    setDropDownOpen(false);
  };

  const handleTabClick = (tab: "posts" | "likes") => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => handleTabClick("posts")}
            className={`px-4 py-2 rounded-full text-sm font-[NeueMontreal-Medium] transition-colors ${
              activeTab === "posts"
                ? "bg-black text-white"
                : "bg-transparent text-gray-600 hover:bg-gray-100"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => handleTabClick("likes")}
            className={`px-4 py-2 rounded-full text-sm font-[NeueMontreal-Medium] transition-colors ${
              activeTab === "likes"
                ? "bg-black text-white"
                : "bg-transparent text-gray-600 hover:bg-gray-100"
            }`}
          >
            Likes
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Sort by:</span>
          <div className="relative">
            <button
              onClick={toggleDropDown}
              className="bg-gray-50 hover:bg-gray-100 flex items-center gap-2 rounded-full px-4 py-2 transition-colors"
            >
              <span>{selectedFilter}</span>
              <img
                className={`w-4 transition-transform duration-200 ${
                  isDropDownOpen ? "rotate-180" : "rotate-0"
                }`}
                src="./icons/dropdown.png"
                alt="Drop Down Icon"
              />
            </button>
            {isDropDownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-[5]">
                <div
                  onClick={() => selectFilter("Top Rated")}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  Top Rated
                </div>
                <div
                  onClick={() => selectFilter("Category: A-Z")}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  Category: A-Z
                </div>
                <div
                  onClick={() => selectFilter("Category: Z-A")}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  Category: Z-A
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {activeTab === "posts" && (
        <>
          {posts.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl py-12 px-4 text-center">
              <p className="text-gray-600">
                {data.username === fetchInfo().username
                  ? "Click the + above to create your first post!"
                  : "No posts yet..."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 max-[860px]:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {posts.map((post, idx) => (
                <div key={idx} className="w-full">
                  <PostCard {...post} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "likes" && (
        <>
          {likedPosts.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl py-12 px-4 text-center">
              <p className="text-gray-600">No liked posts yet...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 max-[860px]:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {likedPosts.map((post, idx) => (
                <div key={idx} className="w-full">
                  <PostCard {...post} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostFeed;
