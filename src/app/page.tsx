"use client";
import React, { useEffect, useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import PostCard from "@/components/PostCard";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllBarbers, getAllPosts } from "@/utils/DataServices";
import { IPostItems, IUserProfileInfo } from "@/utils/Interfaces";
import RegisterForm from "@/components/RegisterForm";
import { useRouter } from "next/navigation";

export default function Home() {
  const [searchActive, setSearchActive] = useState(false);
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
  const [barbers, setBarbers] = useState<IUserProfileInfo[]>([]);
  const router = useRouter();

  useEffect(() => {
    const asyncGetPosts = async () => {
      const fetchedPosts = await getAllPosts();
      if (Array.isArray(fetchedPosts)) {
        setPosts(fetchedPosts);
      } else {
        console.error("getAllPosts did not return an array:", fetchedPosts);
        setPosts([]);
      }
    };
    const setBarberPreviews = async () => {
      const allBarbers = await getAllBarbers();
      setBarbers(allBarbers.slice(0, 3));
    };
    asyncGetPosts();
    setBarberPreviews();
  }, [searchActive]);

  const goToSearch = () => {
    const queryParams = new URLSearchParams({
      s: "all posts",
    }).toString();
    router.push(`/search?${queryParams}`);
  };

  return (
    <div className="bg-white min-h-screen w-full overflow-x-hidden">
      <Navbar setSearchActive={setSearchActive} />

      <header id="page-header">
        <Header searchActive={searchActive} setSearchActive={setSearchActive} />
      </header>
      <main className="px-4 sm:px-6 lg:px-8">
        <section
          id="create-account"
          className="mt-16 sm:mt-20 lg:mt-24 xl:mt-44"
        >
          <RegisterForm />
        </section>
        <section id="local-barbers" className="mt-16 sm:mt-20 lg:mt-24">
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <h2 className="font-[NeueMontreal-Medium] text-xl sm:text-2xl lg:text-3xl">
              {" "}
              Top Barbers{" "}
            </h2>
            <p className="font-[NeueMontreal-Regular] text-sm sm:text-base text-gray-600 mt-1">
              Curated by the community, for the community
            </p>
          </div>
          <div className="mt-10">
            {/* <div className="grid lg:grid-cols-3 lg:grid-rows-1 md:grid-cols-2 md:grid-rows-2 sm:grid-cols-1 sm:grid-rows-3 gap-3">
              <ProfileCard />
              <ProfileCard />
              <div className="lg:col-span-1 md:col-span-full">
                <ProfileCard />
              </div>
            </div> */}
            <div className="grid lg:grid-cols-3 lg:grid-rows-1 md:grid-cols-2 md:grid-rows-2 sm:grid-cols-1 sm:grid-rows-3 gap-3">
              {barbers.map((barber, idx) => (
                <div key={idx}>
                  <ProfileCard {...barber} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="top-posts" className="mt-12 sm:mt-16 lg:mt-20">
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <h2 className="font-[NeueMontreal-Medium] text-xl sm:text-2xl lg:text-3xl">
              {" "}
              Top Posts{" "}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {posts.slice(0, 3).map((post, index) => (
              <div key={post.id && post.id !== 0 ? post.id : `post-${index}`}>
                <PostCard {...post} />
              </div>
            ))}
          </div>
          <div className="mt-8 sm:mt-10 lg:mt-12">
            <button
              className="bg-black w-full text-white font-[NeueMontreal-Medium] py-5 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75"
              onClick={goToSearch}
            >
              VIEW ALL POSTS
            </button>
          </div>
        </section>
      </main>

      {/* <section id="create-account" className="mt-16 sm:mt-20 lg:mt-24 xl:mt-44">
        <RegisterForm />
      </section> */}

      <section className="mt-16 sm:mt-20 lg:mt-24 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-5">
          <div
            id="barber-essentials"
            className="relative col-span-1 lg:col-span-2 rounded-lg overflow-hidden"
          >
            <img
              className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover"
              src="./barberessentials.webp"
              alt="Barber Essentials Background Image"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <img
                className="w-[40px] sm:w-[50px] mb-3 sm:mb-5"
                src="./icons/sheargenius-essentials.svg"
                alt="ShearGenius Logo"
              />
              <div className="mb-6 sm:mb-8 lg:mb-10">
                <p className="font-[NeueMontreal-Medium] text-white text-3xl sm:text-4xl lg:text-5xl leading-tight">
                  Barber Essentials
                </p>
                <p className="font-[NeueMontreal-Regular] text-white text-sm sm:text-base mt-1">
                  Create the best toolbox for success
                </p>
              </div>
              <button className="font-[NeueMontreal-Medium] text-black bg-white px-8 py-2 sm:px-10 sm:py-3 rounded text-sm sm:text-base cursor-pointer transition-all duration-75 hover:bg-[#FFFFFF1A] hover:outline-2 hover:outline-white hover:text-white active:text-black active:bg-white active:outline-none">
                EXPLORE
              </button>
            </div>
          </div>

          <div
            id="barber-etiquette"
            className="relative col-span-1 rounded-lg overflow-hidden"
          >
            <img
              className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover"
              src="./barberetiquette.webp"
              alt="Barber Shop Cutting Area Background"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center gap-5 sm:gap-7">
              <div>
                <p className="font-[NeueMontreal-Medium] text-white text-3xl sm:text-4xl lg:text-5xl leading-tight">
                  Barber Shop <br className="hidden sm:block" /> Etiquette
                </p>
                <p className="font-[NeueMontreal-Regular] text-white text-sm sm:text-base mt-1">
                  Make your next visit a breeze
                </p>
              </div>
              <button className="font-[NeueMontreal-Medium] text-black bg-white px-8 py-2 sm:px-10 sm:py-3 rounded text-sm sm:text-base cursor-pointer transition-all duration-75 hover:bg-[#FFFFFF1A] hover:outline-2 hover:outline-white hover:text-white active:text-black active:bg-white active:outline-none">
                LEARN MORE
              </button>
            </div>
          </div>

          <div
            id="clippers-crash-course"
            className="relative col-span-1 rounded-lg overflow-hidden"
          >
            <img
              className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover"
              src="./barberitems.webp"
              alt="Barber Clippers and Items Background"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center gap-5 sm:gap-7">
              <div>
                <p className="font-[NeueMontreal-Medium] text-white text-3xl sm:text-4xl lg:text-5xl leading-tight">
                  Clippers <br className="hidden sm:block" /> Crash Course
                </p>
                <p className="font-[NeueMontreal-Regular] text-white text-sm sm:text-base mt-1">
                  Learn basic terminology
                </p>
              </div>
              <button className="font-[NeueMontreal-Medium] text-black bg-white px-8 py-2 sm:px-10 sm:py-3 rounded text-sm sm:text-base cursor-pointer transition-all duration-75 hover:bg-[#FFFFFF1A] hover:outline-2 hover:outline-white hover:text-white active:text-black active:bg-white active:outline-none">
                BEGIN
              </button>
            </div>
          </div>
        </div>
      </section>
      <footer className="mt-16 sm:mt-20 lg:mt-25">
        <Footer />
      </footer>
    </div>
  );
}
