import { ICommentInfo, IPostItems } from "@/utils/Interfaces";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import FocusPostComponent from "./FocusPostComponent";
import { checkToken, fetchInfo, getCommentsbyId, getPostbyPostId, getToken, toggleLikes } from "@/utils/DataServices";
import { useRouter } from "next/navigation";
import { Heart, MessageSquare, X } from "lucide-react";

const PostCard = (data: IPostItems) => {
  const router = useRouter();
  const [focus, setFocus] = useState<boolean>(false);
  const [postData, setPostData] = useState<IPostItems>(data);
  const [comments, setComments] = useState<ICommentInfo[]>([
    {
      id: 0,
      postId: 0,
      username: "",
      comment: "",
    },
  ]);

  useEffect(() => {
    const getCommentNumber = async () => {
      setComments(await getCommentsbyId(data.id));
    };
    getCommentNumber();
  }, [router, data.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!checkToken()) {
      router.push('/login');
      return;
    } 
    
    await toggleLikes(postData.id, fetchInfo().username, getToken());
    const updatedPost = await getPostbyPostId(postData.id);
    if (updatedPost) {
      setPostData(updatedPost);
    }
  };

  const handleFocusLike = (updatedPost: IPostItems) => {
    setPostData(updatedPost);
  };

  return (
    <div>
      {focus && (
        <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-lg relative shadow-xl">
            <button
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-gray-100 text-gray-500 hover:text-black hover:bg-gray-200 transition-colors cursor-pointer"
              onClick={() => setFocus(false)}
            >
              <X size={20} className="cursor-pointer" />
            </button>
            <div className="max-h-[90vh] overflow-y-auto">
              <FocusPostComponent {...postData} onLikeToggle={handleFocusLike} />
            </div>
          </div>
        </div>
      )}
      <div
        onClick={() => setFocus(true)}
        className="w-full aspect-square rounded-lg relative cursor-pointer overflow-hidden group transition-all duration-300 hover:shadow-lg"
      >
        <div className="bg-gray-300 text-white w-full aspect-square flex justify-center">
          <Image
            width={500}
            height={500}
            src={postData.image != null ? postData.image : "/nofileselected.png"}
            alt={`${postData.publisherName}'s post #${postData.id}`}
            className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
        </div>
        <div className="bg-gradient-to-t from-black/70 to-transparent w-full h-20 px-4 py-2 flex items-center absolute bottom-0">
          <div className="w-full text-white">
            <p className="font-[NeueMontreal-Medium] text-sm cursor-pointer" onClick={() => setFocus(true)}>
              {postData.publisherName}
            </p>

            <div className="flex justify-between items-center">
              <p className="font-[NeueMontreal-Medium] cursor-pointer" onClick={() => setFocus(true)}>
                {postData.category}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <button 
                    onClick={handleLike} 
                    className="hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Heart 
                      size={24} 
                      fill={postData.likes.includes(fetchInfo().username) ? "#ff3040" : "none"} 
                      className={`${postData.likes.includes(fetchInfo().username) ? "text-red-500" : "text-white"} cursor-pointer`}
                    />
                  </button>
                  <p className="font-[NeueMontreal-Medium] text-sm cursor-default">
                    {postData.likes.length}
                  </p>
                </div>
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => setFocus(true)}>
                  <MessageSquare size={24} className="text-white cursor-pointer" />
                  <p className="font-[NeueMontreal-Medium] text-sm cursor-default">
                    {comments != null ? comments.length : "0"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
