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
      image: "/nofileselected.png",
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
      image: "/nofileselected.png",
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
      image: "/nofileselected.png",
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
    <div className="bg-white min-h-screen w-full">
      <nav>
        <Navbar setSearchActive={setSearchActive} />
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
         <div className="container mt-20 px-4 mx-auto">
           <div>
             <div className="flex flex-col md:flex-row gap-12 justify-evenly items-center">
               <Image
                width={300}
               height={300}
                 src={haircut.photo1}
                 alt={haircut.name}
                 className="w-full md:w-[500px] h-[400px] md:h-[500px] object-cover rounded-lg shadow-lg"
               />
               <img src="/icons/sheargenius-logo.svg" alt="Shear Genius Logo" className="hidden md:block w-16 h-16" />
               <Image
               width={300}
               height={300}
                 src={haircut.photo2}
                 alt={haircut.name}
                 className="w-full md:w-[500px] h-[400px] md:h-[500px] object-cover rounded-lg shadow-lg"
               />
             </div>
           </div>

           <div className="mt-28">
             <h2 className="text-2xl mb-10 font-[NeueMontreal-Medium]">
               Related Posts
             </h2>
             {posts && posts.length > 0 && posts[0].id !== 0 ? (
                <>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {posts.slice(0, 3).map((post) => (
                     <div key={post.id}>
                       <PostCard {...post} />
                     </div>
                   ))}
                 </div>
                 {posts.length > 1 && (
                    <div className="mt-6">
                    <button className="bg-black w-full text-white font-[NeueMontreal-Medium] py-5 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white transition-all duration-75" onClick={() => goToSearch(haircut.name)}>
                      VIEW ALL POSTS
                    </button>
                  </div>
                 )}
                </>
             ) : (
                <p className="text-center text-gray-500 font-[NeueMontreal-Medium]">No related posts found for {haircut.name}.</p>
             )}
           </div>

           {(haircut.howTo?.step1 || (haircut.video?.src && haircut.video.src !== '#')) && (
              <div className="flex flex-col lg:flex-row justify-center items-start gap-12 mt-20">
              {haircut.howTo?.step1 && (
                 <div className="w-full lg:w-1/3 text-left">
                 <h3 className="text-2xl mb-4 font-[NeueMontreal-Medium]">
                   How To:
                 </h3>
                 <ul className="text-lg space-y-2 font-[NeueMontreal-Medium]">
                   {haircut.howTo.step1 && <li>1. {haircut.howTo.step1}</li>}
                   {haircut.howTo.step2 && <li>2. {haircut.howTo.step2}</li>}
                   {haircut.howTo.step3 && <li>3. {haircut.howTo.step3}</li>}
                   {haircut.howTo.step4 && <li>4. {haircut.howTo.step4}</li>}
                 </ul>
               </div>
              )}

               {haircut.video?.src && haircut.video.src !== '#' && (
                  <div className={`w-full ${haircut.howTo?.step1 ? 'lg:w-2/3' : 'lg:w-full'} text-center`}>
                  <div className="flex justify-center">
                    <iframe
                      width="100%"
                      height="450px"
                      src={haircut.video.src}
                      title={`${haircut.name} Tutorial`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
               )}
            </div>
           )}
         </div>
       ) : (
         <div className="container mt-20 px-4 mx-auto text-center">
            <p className="text-xl text-gray-600 font-[NeueMontreal-Medium]">{haircut.description || "Loading..."}</p>
         </div>
       )}

      <div className="mt-24">
        <Footer />
      </div>
    </div></Suspense>
  );
}