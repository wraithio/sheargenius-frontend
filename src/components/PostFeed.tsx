import React, { use, useEffect, useState } from "react";
import PostCard from "./PostCard";
import { Button } from "./ui/button";
import { IPostItems, IUserProfileInfo } from "@/utils/Interfaces";
import {
  fetchInfo,
  findLikesByUsername,
  getPostbyPostId,
  getUserPosts,
} from "@/utils/DataServices";

const PostFeed = (data: IUserProfileInfo) => {
  const [isDropDownOpen, setDropDownOpen] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Most Recent");
  const [posts, setPosts] = useState<IPostItems[]>([
    {
      id: 0,
      userId: 0,
      publisherName: "",
      date: "",
      caption: "",
      image: "/nofileselected.png",
      likes: [],
      category: "",
      isPublished: false,
      isDeleted: true,
      comments: null,
    },
  ]);
  const [likedPosts, setLikedPosts] = useState<IPostItems[]>([
    {
      id: 0,
      userId: 0,
      publisherName: "",
      date: "",
      caption: "",
      image: "/nofileselected.png",
      likes: [],
      category: "",
      isPublished: false,
      isDeleted: true,
      comments: null,
    },
  ]);
  const [feedPosts, setFeedPosts] = useState<IPostItems[]>([
    {
      id: 0,
      userId: 0,
      publisherName: "",
      date: "",
      caption: "",
      image: "/nofileselected.png",
      likes: [],
      category: "",
      isPublished: false,
      isDeleted: true,
      comments: null,
    },
  ]);

  useEffect(() => {
    const asyncGetPosts = async (id: number) => {
      if (id != 0) {
        setPosts(await getUserPosts(id));
        setFeedPosts(await getUserPosts(id));
        const likesArr = await findLikesByUsername(data.username);
        const likes: IPostItems[] = [];
        for (let i = 0; i < likesArr.length; i++) {
          likes.push(await getPostbyPostId(likesArr[i]));
        }
        setLikedPosts(likes);
      }
    };
    asyncGetPosts(data.id);
  }, [data.id]);

  useEffect(() => {
    console.log("showLikes: ", showLikes);
    showLikes ? setPosts(likedPosts) : setPosts(feedPosts);
    // window.location.reload();
    // console.log("Likes: ", likedPosts);
    // console.log("Posts: ", posts);
    // if (!showLikes) {
    // setShowLikes(false);
    // console.log("Showing posts");
    // setPosts(posts);
    // console.log("posts feed: ", posts);
    // } else {
    // setShowLikes(true);
    // console.log("Showing likes");
    // setPosts(likedPosts);
    // console.log("likes feed: ", posts);
    // }
  }, [showLikes]);

  useEffect(() => {
    console.log("posts feed: ", posts);
  }, [posts]);

  useEffect(() => {
    if (selectedFilter === "Top Rated") {
      setPosts((prevPosts) =>
        [...prevPosts].sort((a, b) => b.likes.length - a.likes.length)
      );
    } else if (selectedFilter === "Category: A-Z") {
      setPosts((prevPosts) =>
        [...prevPosts].sort((a, b) => a.category.localeCompare(b.category))
      );
    } else if (selectedFilter === "Category: Z-A") {
      setPosts((prevPosts) =>
        [...prevPosts].sort((a, b) => b.category.localeCompare(a.category))
      );
    } else {
      setPosts((prevPosts) =>
        [...prevPosts].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    }
  }, [selectedFilter]);

  // const toggleLikes = (likes: boolean) => {
  //   console.log("Likes: ", likedPosts);
  //   console.log("Posts: ", posts);
  //   if (!likes) {
  //     setShowLikes(false);
  //     console.log("Showing posts");
  //   } else {
  //     setShowLikes(true);
  //     console.log("Showing likes");
  //   }
  // };

  const toggleDropDown = () => {
    setDropDownOpen(!isDropDownOpen);
  };

  const selectFilter = (question: string) => {
    setSelectedFilter(question);
    setDropDownOpen(false);
  };

  return (
    <div>
      {" "}
      <div className="flex justify-between mt-12 mb-4 place-items-center">
        <div className="flex gap-8">
          <Button className="shadow-none rounded-[2px] bg-transparent text-block h-fit p-0 px-1 hover:text-white hover:bg-black">
            <h3 className="text-lg" onClick={() => setShowLikes(false)}>
              Posts
            </h3>
          </Button>
          <Button className="shadow-none rounded-[2px] bg-transparent text-block h-fit p-0 px-1 hover:text-white hover:bg-black">
            <h3 className="text-lg" onClick={() => setShowLikes(true)}>
              Likes
            </h3>
          </Button>
        </div>
        <div className="flex gap-2 place-items-center">
          <h3>Sort by:</h3>
          <div className="flex flex-col mt-1">
            <div className="flex flex-col">
              <div className="relative">
                <div
                  onClick={toggleDropDown}
                  className="bg-[#f5f5f5] flex justify-between items-center rounded-md px-4 py-2 cursor-pointer"
                >
                  {selectedFilter}
                  <img
                    className={`w-[25px] m-0 p-0 transition-transform duration-500 ${
                      isDropDownOpen ? "rotate-180" : "rotate-0"
                    }`}
                    src="./icons/dropdown.png"
                    alt="Drop Down Icon"
                  />
                </div>
                {isDropDownOpen && (
                  <div
                    className={`rounded-md border-gray-300 bg-white p-3 absolute z-50 top-[45px] w-[100%] shadow-md transition-all duration-700 ${
                      isDropDownOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                    }`}
                  >
                    <div
                      onClick={() => selectFilter("Top Rated")}
                      className="cursor-pointer hover:bg-gray-100 p-1 rounded-sm"
                    >
                      Top Rated
                    </div>
                    <div
                      onClick={() => selectFilter("Category: A-Z")}
                      className="cursor-pointer hover:bg-gray-100 p-1 rounded-sm"
                    >
                      Category: A-Z
                    </div>
                    <div
                      onClick={() => selectFilter("Category: Z-A")}
                      className="cursor-pointer hover:bg-gray-100 p-1 rounded-sm"
                    >
                      Category: Z-A
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {posts.length == 0 ? (
        <div className="bg-[#F5F5F5] flex justify-center place-items-center h-24 mb-8">
          <h3>
            {data.username == fetchInfo().username
              ? `Click the + above to create your first post!`
              : `No posts yet...`}
          </h3>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-4 gap-3">
            {/* {showLikes ? (
            <div className="grid grid-cols-4 gap-3">
              {likedPosts
                .filter((post) => post.isDeleted == false)
                .map((post, idx) => (
                  <PostCard key={idx} {...post} />
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {posts
                .filter((post) => post.isDeleted == false)
                .map((post, idx) => (
                  <PostCard key={idx} {...post} />
                ))}
            </div>
          )} */}
            {posts
              .filter((post) => post.isDeleted == false)
              .map((post, idx) => (
                <PostCard key={idx} {...post} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostFeed;
