"use client";
import React, { Suspense, useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { IHaircutInterface, IPostItems } from "@/utils/Interfaces";
import {
  fetchHaircut,
  getPostItemsByCategory,
} from "@/utils/DataServices";
import Header from "@/components/Header";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function DirectoryPage() {
  const [haircut, setHaircut] = useState<IHaircutInterface>({
    id: 0,
    name: "",
    description: "",
    photo1: "#",
    photo2: "#",
    video: { src: "#" },
    howTo: {
      step1: "",
      step2: "",
      step3: "",
      step4: "",
    },
  });

  const [posts, setPosts] = useState<IPostItems[]>([
    {
      id: 0,
      userId: 0,
      publisherName: "",
      date: "",
      caption: "",
      image: null,
      likes: [],
      category: "",
      isPublished: true,
      isDeleted: false,
      comments: [],
    },
    {
      id: 0,
      userId: 0,
      publisherName: "",
      date: "",
      caption: "",
      image: null,
      likes: [],
      category: "",
      isPublished: true,
      isDeleted: false,
      comments: [],
    },
    {
      id: 0,
      userId: 0,
      publisherName: "",
      date: "",
      caption: "",
      image: null,
      likes: [],
      category: "",
      isPublished: true,
      isDeleted: false,
      comments: [],
    },
  ]);

  const [searchActive, setSearchActive] = useState(false);
  const router = useRouter();
  const searchParameters = useSearchParams()
  useEffect(() => {
    const fetchData = async () => {
      const category = searchParameters.get("h");

      if (category) {
        try {
          const haircutData = await fetchHaircut(category);
          if (haircutData) {
             setHaircut(haircutData);
          } else {
             setHaircut({
               id: 0, name: "Not Found", description: `Could not find details for ${category}.`, photo1: "#", photo2: "#", video: { src: "#" }, howTo: { step1: "", step2: "", step3: "", step4: "" }
             });
          }

          const postData = await getPostItemsByCategory(category);
          setPosts(postData && postData.length > 0 ? postData : []);

        } catch (error) {
          console.error("Error fetching directory data:", error);
           setHaircut({
             id: 0, name: "Error", description: "Failed to load data.", photo1: "#", photo2: "#", video: { src: "#" }, howTo: { step1: "", step2: "", step3: "", step4: "" }
           });
           setPosts([]);
        }
      } else {
         setHaircut({
           id: 0, name: "Directory", description: "Select a style or search.", photo1: "#", photo2: "#", video: { src: "#" }, howTo: { step1: "", step2: "", step3: "", step4: "" }
         });
         setPosts([]);
      }
    };

    fetchData();
  }, [searchParameters]);

  const goToSearch = (cut:string) => {
    const queryParams = new URLSearchParams({
      s: cut,
    }).toString();
    router.push(`/search?${queryParams}`);
  }

  return (
    <Suspense>
      <div className="bg-white min-h-screen w-full overflow-x-hidden">
        <nav>
          <Navbar setSearchActive={setSearchActive} hasHeader={true} />
        </nav>
        <header>
          <Header
            searchActive={searchActive}
            setSearchActive={setSearchActive}
            title={haircut.name || "ShearGenius"}
            description={haircut.description || "A Hub For All Things Hair"}
          />
        </header>
        {haircut && haircut.id !== 0 && haircut.name !== "Directory" && haircut.name !== "Error" && haircut.name !== "Not Found" ? (
          <div className="container mt-12 sm:mt-16 lg:mt-20 px-3 sm:px-4 lg:px-8 mx-auto max-w-7xl">
            <div>
              <div className="flex flex-col md:flex-row gap-6 sm:gap-8 lg:gap-12 justify-evenly items-center">
                <Image
                  width={300}
                height={300}
                  src={haircut.photo1}
                  alt={haircut.name}
                  className="w-full max-w-xs sm:max-w-sm md:w-[300px] lg:w-[400px] xl:w-[500px] aspect-square object-cover rounded-lg shadow-lg"
                />
                <img src="/icons/sheargenius-logo.svg" alt="Shear Genius Logo" className="hidden md:block w-8 h-8 lg:w-12 lg:h-12 xl:w-16 xl:h-16" />
                <Image
                width={300}
                height={300}
                  src={haircut.photo2}
                  alt={haircut.name}
                  className="w-full max-w-xs sm:max-w-sm md:w-[300px] lg:w-[400px] xl:w-[500px] aspect-square object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>

            <div className="mt-16 sm:mt-20 lg:mt-28">
              <h2 className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 lg:mb-10 font-[NeueMontreal-Medium] text-center">
                Related Posts
              </h2>
              {posts && posts.length > 0 && posts[0].id !== 0 ? (
                  <>
                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6">
                    {posts.slice(0, 3).map((post) => (
                      <div key={post.id} className="w-full max-w-sm sm:w-80 lg:w-96 flex-shrink-0">
                        <PostCard {...post} />
                      </div>
                    ))}
                  </div>
                  {posts.length > 1 && (
                      <div className="mt-6 sm:mt-8">
                      <button className="bg-black w-full text-white font-[NeueMontreal-Medium] py-4 sm:py-5 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75 text-sm sm:text-base" onClick={() => goToSearch(haircut.name)}>
                        VIEW ALL POSTS
                      </button>
                    </div>
                  )}
                  </>
              ) : (
                  <p className="text-center text-gray-500 font-[NeueMontreal-Medium] text-sm sm:text-base">No related posts found for {haircut.name}.</p>
              )}
            </div>

            {(haircut.howTo?.step1 || (haircut.video?.src && haircut.video.src !== '#')) && (
                <div className="flex flex-col lg:flex-row justify-center items-start gap-8 sm:gap-10 lg:gap-12 mt-16 sm:mt-20">
                {haircut.howTo?.step1 && (
                  <div className="w-full lg:w-1/3 text-left">
                  <h3 className="text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 font-[NeueMontreal-Medium]">
                    How To:
                  </h3>
                  <ul className="text-sm sm:text-base lg:text-lg space-y-2 sm:space-y-3 font-[NeueMontreal-Medium]">
                    {haircut.howTo.step1 && <li className="leading-relaxed">1. {haircut.howTo.step1}</li>}
                    {haircut.howTo.step2 && <li className="leading-relaxed">2. {haircut.howTo.step2}</li>}
                    {haircut.howTo.step3 && <li className="leading-relaxed">3. {haircut.howTo.step3}</li>}
                    {haircut.howTo.step4 && <li className="leading-relaxed">4. {haircut.howTo.step4}</li>}
                  </ul>
                </div>
                )}

                {haircut.video?.src && haircut.video.src !== '#' && (
                    <div className={`w-full ${haircut.howTo?.step1 ? 'lg:w-2/3' : 'lg:w-full'} text-center`}>
                    <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden shadow-lg">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={haircut.video.src}
                        title={`${haircut.name} Tutorial`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="container mt-12 sm:mt-16 lg:mt-20 px-3 sm:px-4 lg:px-8 mx-auto text-center">
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-[NeueMontreal-Medium] max-w-2xl mx-auto leading-relaxed">{haircut.description || "Loading..."}</p>
          </div>
        )}

        <div className="mt-16 sm:mt-20 lg:mt-24">
          <Footer />
        </div>
      </div>
    </Suspense>
  );
}