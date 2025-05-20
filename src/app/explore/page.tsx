"use client";
import Navbar from "@/components/Navbar";
import StylistAIComponent from "@/components/StylistAIComponent";
import React, { useState } from "react";

const Explore = () => {
  const [searchActive, setSearchActive] = useState(false);
  console.log(searchActive);
  return (
    <div className="min-h-screen">
      <Navbar setSearchActive={setSearchActive} />
      <div className="flex justify-center">PAGE IN PROGRESS...</div>
      <StylistAIComponent />
      <div className="absolute bottom-2 right-2 flex gap-1 text-sm">
        <p>Built with DeepSeek R1</p>
        <p>
          <a
            href="https://openrouter.ai/deepseek/deepseek-r1:free/api"
            className="cursor-pointer text-blue-400 hover:text-blue-600" target="_blank"
          >
            openrouter.ai
          </a>
        </p>
      </div>
    </div>
  );
};

export default Explore;
