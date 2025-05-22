"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { redirect, usePathname, useRouter } from "next/navigation";
import {
  checkToken,
  fetchHaircut,
  fetchInfo,
  getProfileUserData,
} from "@/utils/DataServices";
import AddPostComponent from "./AddPostComponent";
import { CircleUserRound, Plus, Search, X } from "lucide-react";
import SchedulingComponent from "./SchedulingComponent";

interface NavbarProps {
  setSearchActive: (active: boolean) => void;
}

const Navbar = ({ setSearchActive }: NavbarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [addPost, setAddPost] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const [error] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"explore" | "schedule" | null>(
    null
  );
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const path = usePathname();
  // console.log(path);

  const openSidebar = (tab: "explore" | "schedule") => {
    setActiveTab(tab);
    setOpenCategory(null);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setOpenCategory(null);
    setActiveTab(null);
    setIsSidebarOpen(false);
  };

  const handleTabClick = (tab: "explore" | "schedule") => {
    if(!checkToken() && tab === "schedule") redirect("/login");
    openSidebar(tab);
  };

  const toggleCategory = (category: string) => {
    setOpenCategory((prev) => (prev === category ? null : category));
  };

  const handleSearchClick = () => {
    setSearchActive(true);
    if (isSidebarOpen) closeSidebar();
    if (path !== "/") setPopUp(true);
  };

  const handleHaircutLinkClick = (haircutName: string) => {
    // setCategory(haircutName);
    const queryParams = new URLSearchParams({
      h: haircutName,
    }).toString();
    if (path.includes("/directory")) {
      window.location.reload();
    }
    router.push(`/directory?${queryParams}`);
    setOpenCategory(null);
    closeSidebar();
  };

  const activeClass = "bg-gray-300 px-2 rounded-sm";

  const profileClick = () => {
    if (checkToken()) {
      const queryParams = new URLSearchParams({
        u: fetchInfo().username,
      }).toString();
      router.push(`/user-profile?${queryParams}`);
    } else {
      redirect("/login");
    }
    if (isSidebarOpen) closeSidebar();
  };

  const addPostClick = () => {
    if (checkToken()) {
      if (isSidebarOpen) closeSidebar();
      setAddPost(true);
    } else {
      if (isSidebarOpen) closeSidebar();
      router.push("/login");
    }
  };

  useEffect(() => {
    const handleOpenNavbarCategory = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.category) {
        openSidebar("explore");
        setTimeout(() => setOpenCategory(detail.category), 0);
      }
    };

    window.addEventListener("openNavbarCategory", handleOpenNavbarCategory);
    return () => {
      window.removeEventListener(
        "openNavbarCategory",
        handleOpenNavbarCategory
      );
    };
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      closeSidebar();
    }
  },[path]);

  useEffect(() => {
    setIsLoggedIn(checkToken());
  }, []);

  const handleSearch = async (q: string) => {
    console.log("Search..", query);
    const result = await fetchHaircut(q);
    if (result !== undefined) {
      const queryParams = new URLSearchParams({
        h: q,
      }).toString();
      setPopUp(false);
      router.push(`/directory?${queryParams}`);
    } else {
      const profileData = await getProfileUserData(q);
      if (profileData !== null) {
        const queryParams = new URLSearchParams({
          u: q,
        }).toString();
        setPopUp(false);
        router.push(`/user-profile?${queryParams}`);
      } else {
        // setError(true);
        const queryParams = new URLSearchParams({
          s: q,
        }).toString();
        router.push(`/search?${queryParams}`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 w-full z-30 bg-white text-black text-sm font-[NeueMontreal-Medium] border-b-2">
        <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center flex-row">
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Link href="/" className="flex items-center gap-1.5">
                  <img
                    style={{ width: "33px", height: "auto", flexShrink: 0 }}
                    src="/icons/sheargenius-logo.svg"
                    alt="ShearGenius Logo"
                  />
                  SHEARGENIUS
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleTabClick("schedule")}
                    className="relative block cursor-pointer"
                  >
                    <span className="hidden min-[425px]:inline">SCHEDULE</span>
                    <span className="inline min-[425px]:hidden">SCHED</span>
                  </button>
                  <button
                    onClick={() => handleTabClick("explore")}
                    className="relative block cursor-pointer"
                  >
                    <span className="hidden min-[425px]:inline">EXPLORE</span>
                    <span className="inline min-[425px]:hidden">EXP</span>
                  </button>
                </div>
                <div className="flex items-center gap-6">
                  <button className="cursor-pointer" onClick={addPostClick}>
                    <Plus size={24} />
                  </button>
                  <button
                    className="cursor-pointer"
                    onClick={handleSearchClick}
                  >
                    <Search size={22} />
                  </button>
                  {popUp && (
                    <div className="absolute right-10 top-15">
                      <div className="bg-white p-1 flex gap-1">
                        <div className="flex flex-col gap-1">
                          <input
                            type="text"
                            placeholder="Search.."
                            // value={query}
                            onChange={(e) =>
                              setQuery(e.target.value.toLowerCase())
                            }
                            onKeyDown={handleKeyDown}
                            className="bg-white font-[NeueMontreal-Medium] flex-grow w-full px-2 py-1 rounded-md border-1 outline-none text-sm"
                          />
                          {error && (
                            <p className="font-[NeueMontreal-Medium] text-white text-xs sm:text-sm mt-1">
                              Invalid Search...
                            </p>
                          )}
                        </div>
                        <button
                          className="p-1 rounded-full text-slate-600 hover:text-black hover:bg-gray-100 cursor-pointer transition-colors"
                          onClick={() => setPopUp(false)}
                          aria-label="Close Search Modal"
                        >
                          <img
                            className="w-5 h-5 sm:w-6 sm:h-6"
                            src="/icons/cross-small.png"
                            alt="Close"
                          />
                        </button>
                      </div>
                    </div>
                  )}
                  <button className="cursor-pointer" onClick={profileClick}>
                    <CircleUserRound size={22} />
                  </button>
                </div>
              </div>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => openSidebar("explore")}
                className="p-2"
                aria-label="Open Menu"
              >
                <svg
                  style={{ width: "24px", height: "24px", flexShrink: 0 }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-16"></div>

      {addPost && (
         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
           <div className="w-[90%] max-w-xl md:w-[70%] lg:w-[50%] bg-white rounded-lg relative">
             <button className="absolute top-2 left-2 p-1 rounded-full text-slate-600 hover:text-black hover:bg-gray-100 cursor-pointer transition-colors" onClick={() => setAddPost(false)} aria-label="Close Add Post Modal">

              <X />
            </button>
            <AddPostComponent />
          </div>
        </div>
      )}

      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 w-full min-h-screen bg-black/40 z-40"
            onClick={closeSidebar}
          ></div>
          <div className="fixed top-0 right-0 bg-white min-h-full w-full md:max-w-md lg:w-[500px] z-50 px-4 sm:px-6 md:px-8 lg:px-10 pb-10 shadow-lg overflow-y-auto">
            <div className="flex items-center justify-between h-16 mb-6">
              <button
                onClick={closeSidebar}
                className="p-2 -ml-2 cursor-pointer hover:bg-gray-100 active:bg-transparent rounded-full"
                aria-label="Close Menu"
              >
                <X />
              </button>
              <div className="flex font-[NeueMontreal-Medium] text-sm items-center gap-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleTabClick("schedule")}
                    className={`relative block cursor-pointer z-50 ${
                      activeTab === "schedule" ? activeClass : ""
                    }`}
                  >
                    <span className="hidden min-[425px]:inline">SCHEDULE</span>
                    <span className="inline min-[425px]:hidden">SCHED</span>
                  </button>
                  <button
                    onClick={() => handleTabClick("explore")}
                    className={`relative block cursor-pointer z-50 ${
                      activeTab === "explore" ? activeClass : ""
                    }`}
                  >
                    <span className="hidden min-[425px]:inline">EXPLORE</span>
                    <span className="inline min-[425px]:hidden">EXP</span>
                  </button>
                </div>
                <div className="flex items-center gap-6">
                  <button className="cursor-pointer" onClick={addPostClick}>
                    <Plus size={24} />
                  </button>
                  <button
                    className="cursor-pointer"
                    onClick={handleSearchClick}
                  >
                    <Search size={22} />
                  </button>
                  <button className="cursor-pointer" onClick={profileClick}>
                    <CircleUserRound size={22} />
                  </button>
                </div>
              </div>
            </div>

            {activeTab === "explore" && (
              <div className="space-y-5">
                <div className="ml-2">
                  <button
                    onClick={() => toggleCategory("fades")}
                    className="font-[NeueMontreal-Medium] text-xl flex items-center gap-1 cursor-pointer hover:text-gray-600 w-full justify-between"
                  >
                    FADES
                    <img
                      style={{ width: "20px", height: "20px", flexShrink: 0 }}
                      src={
                        openCategory === "fades"
                          ? "/icons/minus-small.png"
                          : "/icons/plus-small.png"
                      }
                      alt={openCategory === "fades" ? "Collapse" : "Expand"}
                    />
                  </button>
                  {openCategory === "fades" && (
                    <div className="mt-2 ml-8 space-y-1">
                      <button
                        onClick={() => handleHaircutLinkClick("Drop Fade")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Drop Fade
                      </button>
                      <button
                        onClick={() => handleHaircutLinkClick("Taper Fade")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Taper Fade
                      </button>
                      <button
                        onClick={() => handleHaircutLinkClick("Burst Fade")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Burst Fade
                      </button>
                      <button
                        onClick={() =>
                          handleHaircutLinkClick("Burst Taper Fade")
                        }
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Burst Taper Fade
                      </button>
                      <button
                        onClick={() => handleHaircutLinkClick("Hard Part Fade")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Hard Part Fade
                      </button>
                      <button
                        onClick={() => handleHaircutLinkClick("Crop Fade")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Crop Fade
                      </button>
                      <button
                        onClick={() => handleHaircutLinkClick("Pompadour Fade")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Pompadour Fade
                      </button>
                      <button
                        onClick={() => handleHaircutLinkClick("Undercut Fade")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Undercut Fade
                      </button>
                      <button
                        onClick={() => handleHaircutLinkClick("Temp Fade")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Temp Fade
                      </button>
                    </div>
                  )}
                </div>
                <div className="ml-2">
                  <button
                    onClick={() => toggleCategory("skin-fades")}
                    className="font-[NeueMontreal-Medium] text-xl flex items-center gap-1 cursor-pointer hover:text-gray-600 w-full justify-between"
                  >
                    SKIN FADES
                    <img
                      style={{ width: "20px", height: "20px", flexShrink: 0 }}
                      src={
                        openCategory === "skin-fades"
                          ? "/icons/minus-small.png"
                          : "/icons/plus-small.png"
                      }
                      alt={
                        openCategory === "skin-fades" ? "Collapse" : "Expand"
                      }
                    />
                  </button>
                  {openCategory === "skin-fades" && (
                    <div className="mt-2 ml-8 space-y-1">
                      <button
                        onClick={() => handleHaircutLinkClick("Low Skin Fade")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Low Skin Fade
                      </button>
                      <button
                        onClick={() => handleHaircutLinkClick("Mid Skin Fade")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Mid Skin Fade
                      </button>
                      <button
                        onClick={() => handleHaircutLinkClick("High Skin Fade")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        High Skin Fade
                      </button>
                    </div>
                  )}
                </div>
                <div className="ml-2">
                  <button
                    onClick={() => toggleCategory("styles")}
                    className="font-[NeueMontreal-Medium] text-xl flex items-center gap-1 cursor-pointer hover:text-gray-600 w-full justify-between"
                  >
                    STYLES
                    <img
                      style={{ width: "20px", height: "20px", flexShrink: 0 }}
                      src={
                        openCategory === "styles"
                          ? "/icons/minus-small.png"
                          : "/icons/plus-small.png"
                      }
                      alt={openCategory === "styles" ? "Collapse" : "Expand"}
                    />
                  </button>
                  {openCategory === "styles" && (
                    <div className="mt-2 ml-8 space-y-1">
                      <button
                        onClick={() => handleHaircutLinkClick("Taper Cut")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Taper Cut
                      </button>
                      <button
                        onClick={() => handleHaircutLinkClick("Crew Cut")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Crew Cut
                      </button>
                      <button
                        onClick={() => handleHaircutLinkClick("Buzz Cut")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Buzz Cut
                      </button>
                      <button
                        onClick={() => handleHaircutLinkClick("Mullet")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Mullet Cut
                      </button>
                      <button
                        onClick={() => handleHaircutLinkClick("Cornrows")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Cornrows
                      </button>
                      <button
                        onClick={() => handleHaircutLinkClick("Dread Locs")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Dreadlocks
                      </button>
                      <button
                        onClick={() => handleHaircutLinkClick("Braids")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Braids
                      </button>
                      <button
                        onClick={() => handleHaircutLinkClick("Short Layer")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Short Layer
                      </button>
                      <button
                        onClick={() => handleHaircutLinkClick("Blowouts")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Blowouts
                      </button>
                      <button
                        onClick={() => handleHaircutLinkClick("Fringe Cut")}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Fringe Cut
                      </button>
                      <Link
                        href="/styles-more"
                        onClick={closeSidebar}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        More
                      </Link>
                    </div>
                  )}
                </div>
                <div className="ml-2">
                  <button
                    onClick={() => toggleCategory("general-knowledge")}
                    className="font-[NeueMontreal-Medium] text-xl flex items-center gap-1 cursor-pointer hover:text-gray-600 w-full justify-between"
                  >
                    GENERAL KNOWLEDGE
                    <img
                      style={{ width: "20px", height: "20px", flexShrink: 0 }}
                      src={
                        openCategory === "general-knowledge"
                          ? "/icons/minus-small.png"
                          : "/icons/plus-small.png"
                      }
                      alt={
                        openCategory === "general-knowledge"
                          ? "Collapse"
                          : "Expand"
                      }
                    />
                  </button>
                  {openCategory === "general-knowledge" && (
                    <div className="mt-2 ml-8 space-y-1">
                      <Link
                        href="/generalknowledge#clipper-crash-course"
                        onClick={closeSidebar}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Clippers Crash Course
                      </Link>
                      <Link
                        href="/generalknowledge#barber-essentials"
                        onClick={closeSidebar}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Barber Essentials
                      </Link>
                      <Link
                        href="/generalknowledge#barber-shop-etiquette"
                        onClick={closeSidebar}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Barber Shop Etiquette
                      </Link>
                      <Link
                        href="/generalknowledge#proper-hygiene"
                        onClick={closeSidebar}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Proper Hygiene
                      </Link>
                      <Link
                        href="/generalknowledge#hair-growth-essentials"
                        onClick={closeSidebar}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Hair Growth Essentials
                      </Link>
                      <Link
                        href="/generalknowledge"
                        onClick={closeSidebar}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        More About ShearGenius
                      </Link>
                      <Link
                        href="/generalknowledge#why-mens-hair"
                        onClick={closeSidebar}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Why Men&#39;s Hair?
                      </Link>
                      <Link
                        href="/generalknowledge#credits"
                        onClick={closeSidebar}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Credits
                      </Link>
                      <Link
                        href="/generalknowledge#credits"
                        onClick={closeSidebar}
                        className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                      >
                        Contact
                      </Link>
                      {!isLoggedIn && (
                        <Link
                          href="/login"
                          onClick={closeSidebar}
                          className="font-[NeueMontreal-Medium] block text-md hover:text-gray-600"
                        >
                          Create An Account
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "schedule" && (
              <div>
                {/* <h3 className="font-[NeueMontreal-Medium] text-xl text-center text-gray-500 mt-10">
                  Schedule Content Goes Here
                </h3> */}
                <SchedulingComponent />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
