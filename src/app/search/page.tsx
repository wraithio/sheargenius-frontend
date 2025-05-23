"use client";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { getAllPosts } from "@/utils/DataServices";
import { IPostItems } from "@/utils/Interfaces";
import { Search } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SearchResults = () => {
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [searchSuccess, setSearchSuccess] = useState<boolean>(false);
  const [heading, setHeading] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const searchParams = useSearchParams();
  const [isDropDownOpen, setDropDownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Most Recent");
  const [results, setResults] = useState<IPostItems[]>([
    {
      id: 0,
      userId: 0,
      publisherName: "",
      date: "",
      caption: "",
      image: "/nofileselected.png",
      likes: [],
      category: "",
      isPublished: false,
      isDeleted: true,
      comments: null,
    },
  ]);

  const toggleDropDown = () => {
    setDropDownOpen(!isDropDownOpen);
  };

  const selectFilter = (question: string) => {
    setSelectedFilter(question);
    setDropDownOpen(false);
  };

  const handleSearch = async (i: string) => {
    // alert(`searching for ${i}`);
    setHeading(i);
    const allPosts = await getAllPosts();
    const searchResults: IPostItems[] = []
    allPosts.reverse().map((post: IPostItems) => {
      if (
        post.category.toLowerCase().includes(i.toLowerCase()) ||
        post.publisherName.toLowerCase().includes(i.toLowerCase())
      )
      {
        searchResults.push(post);
        setSearchSuccess(true)
      }
    });
    setResults(searchResults);
  };

  const loadResults = async (i:string) => {
       const queryParams = new URLSearchParams({
      s: i,
    }).toString();
    redirect(`/search?${queryParams}`);
  }

  useEffect(() => {
    setHeading(searchParams.get("s") || "");
    if(searchParams.get("s") == "all posts")
    {
      handleSearch("")
    }
    else{
      handleSearch(searchParams.get("s") || "")
    }
  }, [searchActive,heading,searchParams]);

  return (
    <div>
      <nav>
        <Navbar setSearchActive={setSearchActive} />
      </nav>
      <div className="mx-[10%] mt-5">
        <div className="flex gap-1">
          <input
            type="text"
            className="border-2 rounded-sm px-1"
            placeholder="search"
            id="searchID"
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="cursor-pointer"
            onClick={() => loadResults(query)}
          >
            <Search size={22} />
          </button>
        </div>
        <header className="flex justify-between my-2">
          <h2 className="text-2xl">
            Search Results for: <b>{heading == "" ? "all posts" : heading}</b>
          </h2>
          <div className="flex flex-col">
            <div className="relative">
              <div
                onClick={toggleDropDown}
                className="bg-[#f5f5f5] flex justify-between items-center rounded-md px-4 py-2 cursor-pointer"
              >
                {selectedFilter}
                <img
                  className={`w-[25px] m-0 p-0 transition-transform duration-500 ${
                    isDropDownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  src="./icons/dropdown.png"
                  alt="Drop Down Icon"
                />
              </div>
              {isDropDownOpen && (
                <div
                  className={`rounded-md border-gray-300 bg-white p-3 absolute top-[45px] w-[100%] shadow-md transition-all duration-700 ${
                    isDropDownOpen
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }`}
                >
                  <div
                    onClick={() => selectFilter("Top Rated")}
                    className="cursor-pointer hover:bg-gray-100 p-1 rounded-sm"
                  >
                    Top Rated
                  </div>
                  <div
                    onClick={() => selectFilter("Category: A-Z")}
                    className="cursor-pointer hover:bg-gray-100 p-1 rounded-sm"
                  >
                    Category: A-Z
                  </div>
                  <div
                    onClick={() => selectFilter("Category: Z-A")}
                    className="cursor-pointer hover:bg-gray-100 p-1 rounded-sm"
                  >
                    Category: Z-A
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        {searchSuccess || results.length != 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {results.filter(post => post.isDeleted == false).map((post, idx) => (
              <PostCard key={idx} {...post} />
            ))}
          </div>
        ) : (
           <div className="bg-[#F5F5F5] flex justify-center place-items-center h-24 mb-8">
                    <h3>{`No related posts for ${heading}...`}</h3>
                  </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
