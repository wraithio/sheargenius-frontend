import {
  fetchHaircut,
  getProfileUserData,
} from "@/utils/DataServices";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface HeaderProps {
  searchActive: boolean;
  setSearchActive: (active: boolean) => void;
  title?: string;
  description?: string;
}

const Header = ({
  searchActive,
  setSearchActive,
  title,
  description,
}: HeaderProps) => {
  const [query, setQuery] = useState("");
  const [searchHovered, setSearchHovered] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (searchActive) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [searchActive]);

  const handleSearch = async () => {
    console.log("Search..", query); 
    const result = await fetchHaircut(query);
    if (result !== undefined) {
      const queryParams = new URLSearchParams({
        h: query,
      }).toString();
      router.push(`/directory?${queryParams}`);
    } else {
      const profileData = await getProfileUserData(query);
      if (profileData !== null) {
        const queryParams = new URLSearchParams({
          u: query,
        }).toString();
        router.push(`/user-profile?${queryParams}`);
      } else {
        // setError(true);
            const queryParams = new URLSearchParams({
      s: query,
    }).toString();
    router.push(`/search?${queryParams}`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative overflow-hidden">
      <img
        className="w-full h-[450px] sm:h-[550px] md:h-[650px] lg:h-[724px] object-cover"
        src="./webpsheargenius-banner.webp"
        alt="Barber Shop Leather Chair Banner Image"
      />
      {searchActive && (
        <div className="absolute inset-0 bg-[#00000026] blur-3xl z-5" />
      )}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 ${
          searchActive ? "-translate-y-16 sm:-translate-y-20" : "-translate-y-1/2"
        } flex flex-col items-center transition-all duration-300 z-10 w-[90%] max-w-xl lg:max-w-2xl`}
      >
        <h1 className="font-[NeueMontreal-Medium] text-[#FFFD71] text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-center leading-tight">
          {title || "ShearGenius"}
        </h1>
        <p className="font-[NeueMontreal-Medium] text-white text-center text-base sm:text-lg lg:text-xl mt-1 px-2">
          {description || "A Hub For All Things Hair"}
        </p>

        {searchActive && (
          <div className="mt-4 sm:mt-5 flex flex-col items-center gap-2 w-full px-2">
            <div className="flex items-center gap-1 sm:gap-2 w-full max-w-lg">
              <input
                type="text"
                placeholder="Search.."
                value={query}
                onChange={(e) => setQuery(e.target.value.toLowerCase())}
                onKeyDown={handleKeyDown}
                className="bg-white font-[NeueMontreal-Medium] flex-grow w-full px-3 py-2 sm:px-4 sm:py-3 rounded-md outline-none text-sm sm:text-base"
              />
              <button
                onClick={handleSearch}
                onMouseEnter={() => setSearchHovered(true)}
                onMouseLeave={() => setSearchHovered(false)}
                onMouseDown={() => setSearchHovered(false)}
                onMouseUp={() => setSearchHovered(true)}
                className={`flex-shrink-0 p-2 sm:p-3 rounded-md transition-colors duration-100 ${
                  searchHovered ? "bg-white" : "bg-black"
                }`}
              >
                <img
                  className="w-[20px] sm:w-[25px]"
                  src={
                    searchHovered
                      ? "./icons/search.png"
                      : "./icons/search-white.png"
                  }
                  alt="Search Icon"
                />
              </button>
              <button
                onClick={() => setSearchActive(false)}
                className="bg-transparent flex-shrink-0 p-2 sm:p-3 rounded-md"
              >
                <X color="white"/>
              </button>
            </div>
            <p className="font-[NeueMontreal-Medium] text-white text-xs sm:text-sm mt-1">
              {error ? "Invalid Search..." : "Search ShearGenius"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;