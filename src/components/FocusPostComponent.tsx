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
import { Clock, Heart, MessageSquare, Send, Tag, User } from "lucide-react";

interface FocusPostComponentProps extends IPostItems {
  onLikeToggle?: (updatedPost: IPostItems) => void;
}

const FocusPostComponent = (props: FocusPostComponentProps) => {
  const { onLikeToggle, ...data } = props;

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
  const [commentersData, setCommentersData] = useState<Record<string, IUserProfileInfo>>({});
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const initialMount = useRef(true);
  const currentUserInfo = useRef<IUserProfileInfo | null>(null);

  const gotoInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (initialMount.current) {
      setPostData(data);
      initialMount.current = false;
    }
  }, []);

  useEffect(() => {
    if (!initialMount.current && JSON.stringify(data.likes) !== JSON.stringify(postData.likes)) {
      setPostData(prevData => ({
        ...prevData,
        likes: data.likes
      }));
    }
  }, [data.likes]);

  useEffect(() => {
    const fetchProfileData = async (username: string, id: number) => {
      const userData = await getUserData(username);
      setUserData(userData);
      const commentsData = await getCommentsbyId(id);
      setComments(commentsData);
      
      const currentUsername = fetchInfo().username;
      if (currentUsername) {
        const currentUserData = await getUserData(currentUsername);
        currentUserInfo.current = currentUserData;
      }
    };

    fetchProfileData(username, postData.id);
  }, [newComment, postData.id, username]);

  useEffect(() => {
    const fetchCommentersData = async () => {
      if (comments && comments.length > 0) {
        const uniqueUsernames = [...new Set(comments.map(c => c.username))];
        const userData: Record<string, IUserProfileInfo> = {};
        
        for (const username of uniqueUsernames) {
          const userInfo = await getUserData(username);
          if (userInfo) {
            userData[username] = userInfo;
          }
        }
        
        setCommentersData(userData);
      }
    };
    
    fetchCommentersData();
  }, [comments]);

  const addLike = async () => {
    if (!checkToken()) {
      redirect("/login");
    } else {
      await toggleLikes(postData.id, fetchInfo().username, getToken());
      const updatedPost = await getPostbyPostId(postData.id);
      
      if (updatedPost) {
        setPostData(updatedPost);
        
        if (onLikeToggle) {
          onLikeToggle(updatedPost);
        }
      }
    }
  };

  const addComment = async () => {
    if (!checkToken()) {
      redirect("/login");
    } else {
      setError(false);
      
      const currentUsername = fetchInfo().username;
      
      const commentToAdd: ICommentInfo = {
        id: 0,
        postId: postData.id,
        username: currentUsername,
        comment: commentText,
      };
      
      const tempDisplayComment: ICommentInfo = {
        ...commentToAdd,
        id: Date.now(),
      };

      try {
        setComments(prevComments => {
          const newComments = prevComments ? [...prevComments, tempDisplayComment] : [tempDisplayComment];
          return newComments;
        });
        
        if (currentUserInfo.current && !commentersData[currentUsername]) {
          setCommentersData(prev => ({
            ...prev,
            [currentUsername]: currentUserInfo.current!
          }));
        }

        const success = await addCommentToPost(commentToAdd);
        
        if (success) {
          setNewComment(prev => !prev);
        } else {
          setComments(prevComments => 
            prevComments ? prevComments.filter(c => c.id !== tempDisplayComment.id) : null
          );
          setError(true);
          console.error("Failed to add comment");
        }
      } catch (err) {
        console.error("Error adding comment:", err);
        setComments(prevComments => 
          prevComments ? prevComments.filter(c => c.id !== tempDisplayComment.id) : null
        );
        setError(true);
      } finally {
        setCommentText("");
      }
    }
  };

  const viewMore = () => {
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

  const displayComments = comments ? [...comments].reverse() : [];

  return (
    <div className="font-[NeueMontreal-Regular] pt-2 pb-4">
      <div className="flex flex-col w-full">
        <div className="flex flex-col lg:flex-row w-full">
          <div className="w-full lg:w-3/5">
            <div className="flex items-center justify-between w-full h-14 px-3 py-3 border-b">
              <div className="flex items-center gap-2">
                {userData.pfp ? (
                  <Image
                    width={300}
                    height={300}
                    src={userData.pfp}
                    className="w-8 h-8 rounded-full object-cover cursor-pointer"
                    alt={`${postData.publisherName}'s profile pic`}
                    onClick={() => gotoProfile(postData.publisherName)}
                  />
                ) : (
                  <div 
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer"
                    onClick={() => gotoProfile(postData.publisherName)}
                  >
                    <User size={16} className="text-gray-500 cursor-pointer" />
                  </div>
                )}
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <h2
                      onClick={() => gotoProfile(postData.publisherName)}
                      className="cursor-pointer font-[NeueMontreal-Medium] hover:underline text-sm mr-2"
                    >
                      {postData.publisherName}
                    </h2>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock size={10} className="mr-1" />
                      {new Date(postData.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center gap-1 bg-gray-100 text-xs text-gray-500 px-2 py-1 rounded-full">
                  <Tag size={10} className="text-gray-400" />
                  <span className="font-[NeueMontreal-Medium]">{postData.category}</span>
                </div>
              </div>
            </div>
            
            <div className="w-full">
              <Image
                width={800}
                height={800}
                src={postData.image}
                className="w-full aspect-square object-cover"
                alt={`${postData.publisherName}'s post`}
                priority
              />
            </div>
            
            <div className="flex flex-col px-3 py-3 w-full gap-2">
              <div className="flex items-center gap-4">
                <button onClick={addLike} className="flex items-center gap-1.5 group cursor-pointer">
                  <Heart 
                    size={26} 
                    fill={postData.likes.includes(fetchInfo().username) ? "#ff3040" : "none"} 
                    strokeWidth={2}
                    className={`${postData.likes.includes(fetchInfo().username) ? "text-red-500" : "text-gray-700"} group-hover:scale-110 transition-transform cursor-pointer`}
                  />
                  <span className="font-[NeueMontreal-Medium] text-sm">
                    {postData.likes.length}
                  </span>
                </button>
                
                <button onClick={gotoInput} className="flex items-center gap-1.5 group cursor-pointer">
                  <MessageSquare 
                    size={26} 
                    strokeWidth={2}
                    className="text-gray-700 group-hover:scale-110 transition-transform cursor-pointer" 
                  />
                  <span className="font-[NeueMontreal-Medium] text-sm">
                    {comments != null && comments.length !== 0 ? comments.length : "0"}
                  </span>
                </button>
              </div>
              
              <div className="flex items-start gap-2 mt-1">
                <span
                  className="font-[NeueMontreal-Medium] cursor-pointer hover:underline shrink-0 text-sm"
                  onClick={() => gotoProfile(postData.publisherName)}
                >
                  {postData.publisherName}
                </span>
                <span className="text-gray-800 text-sm">{postData.caption}</span>
              </div>
            </div>

            <div className="px-3 pt-2">
              <button
                onClick={viewMore}
                className="bg-black w-full text-white font-[NeueMontreal-Medium] py-5 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75"
              >
                View More Posts Like This
              </button>
            </div>
          </div>
          
          <div className="w-full lg:w-2/5 border-l lg:min-h-[500px] flex flex-col mt-4 lg:mt-0">
            <div className="sticky top-0 z-10 bg-white h-14 px-3 py-3 border-b flex items-center">
              <h2 className="font-[NeueMontreal-Medium]">Comments</h2>
            </div>
            
            <div className="flex-1 p-3 flex flex-col gap-3 max-h-[60vh] lg:max-h-none">
              <div className="flex items-center gap-2 border rounded-full p-1 pl-3">
                <input
                  type="text"
                  ref={inputRef}
                  placeholder="Add a comment..."
                  className="bg-transparent text-sm w-full focus:outline-none cursor-text"
                  value={commentText}
                  maxLength={70}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && commentText.trim() !== '' && addComment()}
                />
                <button 
                  className={`p-1.5 rounded-full flex justify-center items-center ${
                    commentText.trim() !== '' 
                      ? 'bg-black text-white hover:bg-gray-800 cursor-pointer'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  } transition-colors`}
                  onClick={commentText.trim() !== '' ? addComment : () => setError(true)}
                  disabled={commentText.trim() === ''}
                >
                  <Send size={14} className={commentText.trim() !== '' ? 'cursor-pointer' : 'cursor-not-allowed'} />
                </button>
              </div>
              
              {error && (
                <p className="text-red-500 text-xs">There was an error posting your comment</p>
              )}
              
              <div className="overflow-y-auto flex-1">
                {comments != null && comments.length !== 0 ? (
                  <div className="flex flex-col gap-4">
                    {displayComments.map((entry, idx) => (
                      <div key={entry.id || idx} className="flex flex-col">
                        <div className="flex items-center gap-2">
                          {commentersData[entry.username]?.pfp ? (
                            <Image
                              width={24}
                              height={24}
                              src={commentersData[entry.username].pfp}
                              className="w-6 h-6 rounded-full object-cover cursor-pointer shrink-0"
                              alt={`${entry.username}'s profile pic`}
                              onClick={() => gotoProfile(entry.username)}
                            />
                          ) : (
                            <div 
                              className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer shrink-0"
                              onClick={() => gotoProfile(entry.username)}
                            >
                              <User size={12} className="text-gray-500 cursor-pointer" />
                            </div>
                          )}
                          <span
                            className="font-[NeueMontreal-Medium] cursor-pointer hover:underline text-sm"
                            onClick={() => gotoProfile(entry.username)}
                          >
                            {entry.username}
                          </span>
                        </div>
                        <div className="pl-8">
                          <span className="text-gray-800 break-words text-sm">{entry.comment}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                    <MessageSquare size={28} className="text-gray-300 mb-2" />
                    <p className="text-sm">No comments yet</p>
                    <p className="text-xs text-gray-400">Be the first to comment</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusPostComponent;
