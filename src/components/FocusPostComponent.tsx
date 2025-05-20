import {
  addCommentToPost,
  checkToken,
  fetchInfo,
  getCommentsbyId,
  getPostbyPostId,
  getToken,
  getUserData,
  toggleLikes,
} from "@/utils/DataServices";
import { ICommentInfo, IPostItems, IUserProfileInfo } from "@/utils/Interfaces";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const FocusPostComponent = (data: IPostItems) => {
  const [userData, setUserData] = useState<IUserProfileInfo>({
    id: 0,
    username: "",
    salt: "",
    hash: "",
    date: "",
    accountType: "",
    name: "",
    rating: 0,
    ratingCount: [""],
    followers: [""],
    following: [""],
    likes: [""],
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
  const [username] = useState<string>(data.publisherName);
  const [commentText, setCommentText] = useState<string>("");
  const [comments, setComments] = useState<ICommentInfo[] | null>(null);
  const [newComment, setNewComment] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [postData, setPostData] = useState<IPostItems>(data);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const gotoInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    const fetchProfileData = async (username: string, id: number) => {
      //retrieves posters picture
      setUserData(await getUserData(username));
      //retireves comment by userID
      setComments(await getCommentsbyId(id));
    };

    fetchProfileData(username, postData.id);
  }, [newComment, postData.id, username]);

  const addLike = async () => {
    if (!checkToken()) {
      redirect("/login");
    } else {
      await toggleLikes(postData.id, fetchInfo().username, getToken());
      setPostData(await getPostbyPostId(postData.id));
    }
  };

  const addComment = async () => {
    if (!checkToken()) {
      redirect("/login");
    } else {
      setError(false);
      const commentToAdd: ICommentInfo = {
        id: 0,
        postId: postData.id,
        username: fetchInfo().username,
        comment: commentText,
      };

      console.log(commentToAdd);
      addCommentToPost(commentToAdd);
      setNewComment(!newComment);
      setCommentText("");
      // comments?.push(commentToAdd);
    }
  };

  const viewMore = () => {
    // setCategory(postData.category)
    const queryParams = new URLSearchParams({
      h: postData.category,
    }).toString();
    router.push(`/directory?${queryParams}`);
  };

  const gotoProfile = (username: string) => {
    const queryParams = new URLSearchParams({
      u: username,
    }).toString();
    router.push(`/user-profile?${queryParams}`);
  };

  return (
    <div>
      <h2 className="text-center text-2xl">Post</h2>
      <div className="flex place-items-center p-2">
        <div className="flex gap-2 w-full">
          <div className="w-[50%]">
            <div className="flex p-3 w-full gap-2 bg-[#f5f5f5]">
              <Image
                width={300}
                height={300}
                src={userData.pfp != "" ? userData.pfp : "/nofileselected.png"}
                className="w-6 rounded-full h-6 cursor-pointer"
                alt={`${postData.publisherName}'s profile pic`}
                onClick={() => gotoProfile(postData.publisherName)}
              />
              <h2
                onClick={() => gotoProfile(postData.publisherName)}
                className="cursor-pointer"
              >
                {postData.publisherName}
              </h2>
            </div>
            <Image
              width={300}
              height={300}
              src={postData.image}
              className="w-full aspect-square object-cover"
              alt={`${postData.publisherName}'s post no.${postData.id}`}
            />
            <div className="flex flex-col p-3 w-full gap-1 bg-[#f5f5f5]">
              <div className="flex flex-row gap-5">
                <div className="flex flex-row gap-2">
                  <button>
                    <img
                      className="w-[25px] cursor-pointer"
                      src={
                        postData.likes.includes(fetchInfo().username)
                          ? "./icons/heartliked.png"
                          : "./icons/heart.png"
                      }
                      alt="Heart Like Button Icon"
                      onClick={addLike}
                    />
                  </button>
                  <p className="font-[NeueMontreal-Medium] text-lg">
                    {postData.likes.length}
                  </p>
                </div>
                <div className="flex flex-row gap-2">
                  <img
                    className="w-[25px] h-[25px] cursor-pointer"
                    src="./icons/beacon.png"
                    alt="Beacon Comment Icon"
                    onClick={gotoInput}
                  />
                  <p className="font-[NeueMontreal-Medium] text-lg">
                    {comments != null && comments.length != 0
                      ? comments.length
                      : "0"}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <b
                  className="cursor-pointer"
                  onClick={() => gotoProfile(postData.publisherName)}
                >
                  {postData.publisherName}
                </b>
                <h3>{postData.caption}</h3>
              </div>
              <div className="flex gap-1 text-sm">
                <h3>category:</h3>
                <h3>{postData.category}</h3>
              </div>
            </div>

            <button
              onClick={viewMore}
              className="bg-black w-full text-white font-[NeueMontreal-Regular] py-1 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75"
            >
              View More Posts Like This
            </button>
          </div>
          <div className="bg-[#f5f5f5] p-2 flex flex-col gap-2 w-[50%]">
            <h1 className="text-center">Comments</h1>
            <div className="flex gap-1">
              <input
                type="text"
                ref={inputRef}
                placeholder="Add a comment"
                className="rounded-md bg-white text-sm p-1 w-full"
                value={commentText}
                maxLength={70}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="rounded-full w-8 h-8 flex justify-center place-items-center cursor-pointer">
                <button
                  onClick={
                    commentText.trim() != "" ? addComment : () => setError(true)
                  }
                >
                  <Image
                    width={100}
                    height={100}
                    alt="comment icon"
                    src="/icons/addcomment.png"
                    className="h-[25px] w-[25px] cursor-pointer p-1"
                  />
                </button>
              </div>
            </div>
            {error && (
              <h3 className="text-red-500 text-[12px]">Invalid Input</h3>
            )}
            <hr />
            {comments != null && comments.length != 0 ? (
              comments.reverse().map((entry, idx) => (
                <div key={idx} className="flex gap-2">
                  <b
                    className="cursor-pointer"
                    onClick={() => gotoProfile(entry.username)}
                  >
                    {entry.username}
                  </b>
                  <h3>{entry.comment}</h3>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400">no comments yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusPostComponent;
