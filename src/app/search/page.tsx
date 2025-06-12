"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { getAllPosts } from "@/utils/DataServices";
import { IPostItems } from "@/utils/Interfaces";
import { Filter, Search, X } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SearchResults = () => {
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [searchSuccess, setSearchSuccess] = useState<boolean>(false);
  const [heading, setHeading] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const searchParams = useSearchParams();
  const [selectedFilter, setSelectedFilter] = useState("Most Recent");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [results, setResults] = useState<IPostItems[]>([]);

  const filters = [
    "Most Recent",
    "Top Rated",
    "Category: A-Z",
    "Category: Z-A",
  ];

  const handleSearch = async (i: string) => {
    setHeading(i);
    const allPosts = await getAllPosts();
    const searchResults: IPostItems[] = [];
    allPosts.reverse().map((post: IPostItems) => {
      if (
        post.category.toLowerCase().includes(i.toLowerCase()) ||
        post.publisherName.toLowerCase().includes(i.toLowerCase())
      ) {
        searchResults.push(post);
        setSearchSuccess(true);
      }
    });
    setResults(searchResults);
  };

  const loadResults = async (i: string) => {
    if (!i.trim()) return;
    const queryParams = new URLSearchParams({
      s: i.trim(),
    }).toString();
    redirect(`/search?${queryParams}`);
  };

  useEffect(() => {
    setHeading(searchParams.get("s") || "");
    if (searchParams.get("s") == "all posts") {
      handleSearch("");
    } else {
      handleSearch(searchParams.get("s") || "");
    }
  }, [searchActive, heading, searchParams]);

  useEffect(() => {
    if (selectedFilter === "Most Recent") {
      setResults((prev) =>
        [...prev].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    } else if (selectedFilter === "Top Rated") {
      setResults((prev) =>
        [...prev].sort((a, b) => b.likes.length - a.likes.length)
      );
    } else if (selectedFilter === "Category: A-Z") {
      setResults((prev) =>
        [...prev].sort((a, b) => a.category.localeCompare(b.category))
      );
    } else if (selectedFilter === "Category: Z-A") {
      setResults((prev) =>
        [...prev].sort((a, b) => b.category.localeCompare(a.category))
      );
    }
  }, [selectedFilter]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      loadResults(query);
    }
  };

  const FiltersContent = () => (
    <>
      <h2 className="font-[NeueMontreal-Medium] text-lg mb-6">Sort By</h2>
      <div className="space-y-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setSelectedFilter(filter);
              if (showMobileFilters) setShowMobileFilters(false);
            }}
            className={`block w-full text-left text-sm py-2 px-3 rounded-lg transition-colors ${
              selectedFilter === filter
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      <nav>
        <Navbar setSearchActive={setSearchActive} hasHeader={false} />
      </nav>

      <main className="max-w-[2000px] mx-auto sm:px-6 lg:px-8 pt-8">
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search styles, barbers, or posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-gray-50 pl-5 pr-12 py-4 rounded-xl outline-none focus:ring-2 focus:ring-black/5 transition-shadow text-base"
            />
            <button
              onClick={() => loadResults(query)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <Search className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="md:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-sm font-[NeueMontreal-Medium]"
          >
            <Filter size={16} />
            Sort Options
          </button>
        </div>

        {showMobileFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
            <div className="absolute right-0 top-0 h-full w-80 max-w-[calc(100%-3rem)] bg-white shadow-xl p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-[NeueMontreal-Medium] text-lg">
                  Sort Options
                </h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <FiltersContent />
            </div>
          </div>
        )}

        <div className="flex gap-8">
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24 border-r pr-6">
              <FiltersContent />
            </div>
          </div>

          <div className="flex-1 min-w-0">
           <h2 className="text-2xl font-[NeueMontreal-Medium] sm:px-0 px-2">
              Search Results for:{" "}
              <span className="font-[NeueMontreal-Regular]">
                {heading === "" ? "all posts" : heading}
              </span>
            </h2>
            <div className="mb-8">
              <span className="sm:px-0 px-2 font-[NeueMontreal-Regular]">
                showing {results.length} results
              </span>
            </div>

            {searchSuccess || results.length !== 0 ? (
              <div
                className="
      grid 
       min-h-[600px]
      grid-cols-3 md:min-h-0 sm:gap-2
    "
              >
                {results
                  .filter(
                    (post) =>
                      post.isDeleted === false && post.isPublished === true
                  )
                  .map((post, idx) => {
                    const mobilePositions = [
                      "col-span-2 row-span-2",
                      "col-start-3",
                      "col-start-3 row-start-2",
                      "row-start-3",
                      "row-start-3",
                      "row-start-3",
                      "row-start-4",
                      "row-start-4",
                      "row-start-4",
                      "row-start-5",
                      "col-span-2 row-span-2 col-start-2 row-start-5",
                      "col-start-1 row-start-6",
                      "col-start-1 row-start-6",
                    ];

                    return (
                      <div
                        key={post.id || idx}
                        className={`
                ${idx < 13 ? mobilePositions[idx] : ""} 
                sm:col-auto sm:row-auto sm:col-span-1 sm:row-span-1
              `}
                      >
                        <PostCard {...post} />
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <p className="text-lg font-[NeueMontreal-Medium] mb-2">
                  No results found
                </p>
                <p className="text-sm">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </div>
      </main>
       <div className="sm:mt-20 lg:mt-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50"></div>
        <div className="relative">
          <Footer />
        </div>
      </div>
    </div>
  
  );
};

export default SearchResults;
