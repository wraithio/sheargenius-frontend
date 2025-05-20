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
  }, [router, data.id]);

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
        className="w-full aspect-square rounded-lg relative cursor-pointer overflow-hidden"
      >
        <div className="bg-gray-300 text-white w-full aspect-square flex justify-center">
          <Image
            width={300}
            height={300}
            src={data.image != null ? data.image : "/nofileselected.png"}
            alt={`${data.publisherName}'s post #${data.id}`}
            className="w-full aspect-square object-cover"
            priority
          />
        </div>
        <div className="bg-[#ffffff8f] backdrop-blur-sm w-full md:h-[70px] h-[50px] lg:px-5 px-2 lg:py-2 py-1 flex place-items-center absolute bottom-0">
          <div className="w-full">
            <p className="font-[NeueMontreal-Medium] text-[#373738] text-sm">
              {data.publisherName}
            </p>

            <div className="flex justify-between">
              <p className="font-[NeueMontreal-Medium] text-black ">
                {data.category}
              </p>
              <div className="flex flex-row gap-2">
                <div className="flex flex-row gap-1">
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
                  <p className="font-[NeueMontreal-Medium] ">
                    {data.likes.length}
                  </p>
                </div>
                <div className="flex flex-row gap-1">
                  <img
                    className="w-[25px] h-[25px]"
                    src="./icons/beacon.png"
                    alt="Beacon Comment Icon"
                  />
                  <p className="font-[NeueMontreal-Medium] ">
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
