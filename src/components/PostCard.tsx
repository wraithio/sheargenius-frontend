import { ICommentInfo, IPostItems } from "@/utils/Interfaces";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import FocusPostComponent from "./FocusPostComponent";
import { fetchInfo, getCommentsbyId } from "@/utils/DataServices";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const PostCard = (data: IPostItems) => {
  const router = useRouter();
  const [focus, setFocus] = useState<boolean>(false);
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
  },[router,data.id]);

  return (
    <div>
      {focus && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="w-[50%] bg-white p-2 rounded-sm relative">
            <h3
              className="absolute top-2 left-2 p-1 rounded-full text-slate-600 hover:text-black hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => setFocus(false)}
            >
              <X />
            </h3>
            <FocusPostComponent {...data} />
          </div>
        </div>
      )}
      <div
        onClick={() => setFocus(true)}
        className="w-full h-[500px] rounded-lg relative cursor-pointer overflow-hidden"
      >
        <div className="bg-gray-300 text-white h-[410px] flex justify-center">
          <Image
            width={100}
            height={100}
            src={data.image != null ? data.image : "/nofileselected.png"}
            alt={`${data.publisherName}'s post #${data.id}`}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        <div className="bg-[#F5F5F5] w-full h-[90px] px-5 py-3 flex flex-col absolute bottom-0">
          <div className="flex justify-between">
            <p className="font-[NeueMontreal-Medium] text-[#949DA4]">
              {data.publisherName}
            </p>
          </div>
          <div className="flex justify-between items-center mt-3">
            <p className="font-[NeueMontreal-Medium] text-black text-lg">
              {data.category}
            </p>
            <div className="flex flex-row gap-5">
              <div className="flex flex-row gap-2">
                <button>
                  <img
                    className="w-[25px]"
                    src={
                      data.likes.includes(fetchInfo().username)
                        ? "./icons/heartliked.png"
                        : "./icons/heart.png"
                    }
                    alt="Heart Like Button Icon"
                  />
                </button>
                <p className="font-[NeueMontreal-Medium] text-lg">
                  {data.likes.length}
                </p>
              </div>
              <div className="flex flex-row gap-2">
                <img
                  className="w-[25px] h-[25px]"
                  src="./icons/beacon.png"
                  alt="Beacon Comment Icon"
                />
                <p className="font-[NeueMontreal-Medium] text-lg">
                  {comments != null ? comments.length : "0"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
