import {
  checkToken,
  getPostItemsByUserId,
} from "@/utils/DataServices";
import { IPostItems, IUserProfileInfo } from "@/utils/Interfaces";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, StarHalf } from "lucide-react";

const ProfileCard = (data: IUserProfileInfo) => {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [picSRCs, setPicSRCs] = useState<string[]>([]);

  useEffect(() => {
    const previewPosts = async () => {
      if (data && data.id) {
        const posts = await getPostItemsByUserId(data.id);
        const srcs: string[] = [];
        posts.forEach((post: IPostItems) => {
          srcs.push(post.image);
        });
        setPicSRCs(srcs.slice(0, 3));
      }
    };
    previewPosts();

    if (data && typeof data.rating === 'number' && data.ratingCount && data.ratingCount.length > 0) {
      const division_result = data.rating / data.ratingCount.length;
      setRating(Math.round(division_result * 10) / 10);
    } else {
      setRating(0);
    }
  }, [data]);

  const renderStars = (averageRating: number | null | undefined, size = 20) => {
    const validRating = (typeof averageRating === 'number' && !isNaN(averageRating) && isFinite(averageRating))
      ? averageRating
      : 0;

    const stars = [];
    const starSize = size;

    for (let i = 1; i <= 5; i++) {
      if (validRating >= i) {
        stars.push(
          <Star
            key={`star-full-${i}`}
            size={starSize}
            fill="#FFD700"
            stroke="#FFD700"
          />
        );
      } else if (validRating >= i - 0.5) {
        stars.push(
          <StarHalf
            key={`star-half-${i}`}
            size={starSize}
            fill="#FFD700"
            stroke="#FFD700"
          />
        );
      } else {
        stars.push(
          <Star
            key={`star-empty-${i}`}
            size={starSize}
            stroke="#FFD700"
            fill="white"
          />
        );
      }
    }
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  const gotoProfile = (username: string) => {
    if (!checkToken()) {
      router.push("/login");
    } else {
      const queryParams = new URLSearchParams({
        u: username,
      }).toString();
      router.push(`/user-profile?${queryParams}`);
    }
  };

  return (
    <div className="bg-[#F5F5F5] w-full h-auto min-[826px]:h-[440px] rounded-xl px-8 py-10">
      <div className="flex flex-col min-[476px]:flex-row justify-between items-start min-[476px]:items-center">
        <div className="flex flex-row gap-3 items-center">
          <Image
            className="bg-white rounded-full w-[75px] h-[75px] text-xs flex justify-center items-center text-center object-cover"
            width={100}
            height={100}
            src={data.pfp || '/placeholder-pfp.png'}
            alt={`${data.username || 'User'}'s profile pic`}
          />
          <div className="mt-3">
            <p className="font-[NeueMontreal-Medium] text-xl">
              {data.username || 'Username'}
            </p>
            <p className="font-[NeueMontreal-Medium] text-sm text-[#949DA4]">
              {(data.city && data.state) ? `${data.city}, ${data.state}` : 'Location not set'}
            </p>
          </div>
        </div>

        <div className="hidden min-[826px]:flex min-[476px]:max-[767px]:flex gap-1">
           {renderStars(rating)}
        </div>
      </div>

      <div className="hidden min-[768px]:max-[825px]:flex mt-3 gap-1">
         {renderStars(rating)}
      </div>

      <div className="max-[475px]:flex hidden mt-3 justify-center gap-1">
         {renderStars(rating)}
      </div>
      
      <hr className="my-5" />
      <div className="hidden min-[826px]:flex flex-row w-full justify-between">
      {picSRCs.length > 0 ?
        picSRCs.map((pic: string, idx: number) => (
          (
            <div key={idx} className="bg-white rounded-sm w-[32%] h-[130px]">
              <Image
                src={pic || '/placeholder-image.png'}
                alt={`Preview ${idx + 1}`}
                width={130}
                height={130}
                className="object-cover w-full h-full rounded-sm"
              />
            </div>)
        )) :
          (
            <div className="flex justify-center items-center bg-gray-200 rounded-sm w-full h-[130px]">
              <h3 className="text-gray-500">No posts yet...</h3>
            </div>
          )
        }
        </div>
      <div className="mt-5">
        <button
          className="bg-black w-full text-white font-[NeueMontreal-Medium] py-5 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75"
          onClick={() => gotoProfile(data.username)}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;