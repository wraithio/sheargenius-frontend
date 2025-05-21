"use client"
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Image from 'next/image'
import StylistAIComponent from './StylistAIComponent'

const BuzzbyComponent = () => {
    const router = useRouter();
    const path = usePathname();
    const [isChatOpen, setIsChatOpen] = useState(false);
    
    const toggleChat = () => {
      setIsChatOpen(!isChatOpen);
    }

    if (path === "/explore" || path === "/login" || path.includes("/register")) {
      return null;
    }
    
    return (
      <>
        <button 
          onClick={toggleChat}
          className={`fixed ${isChatOpen ? 'right-2 bottom-2 scale-75 sm:opacity-80' : 'right-4 bottom-4'} w-14 h-14 md:w-16 md:h-16 rounded-full bg-black shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 z-50 ${isChatOpen ? 'sm:scale-75 sm:opacity-80 max-sm:hidden' : ''}`}
          aria-label="Chat with Buzzby"
        >
          <Image 
            src="/icons/trimmer.png" 
            alt="Electric Trimmer" 
            width={30} 
            height={30}
            className="w-8 h-8 md:w-10 md:h-10 invert"
          />
        </button>

        {isChatOpen && (
          <div className="fixed max-sm:inset-0 sm:right-4 sm:bottom-20 max-sm:w-full sm:w-[calc(100%-2rem)] sm:max-w-[22rem] md:max-w-[24rem] bg-white max-sm:rounded-none sm:rounded-xl overflow-hidden shadow-2xl border-gray-100 sm:border z-50 sm:z-40 transition-all duration-300 ease-in-out flex flex-col">
            <div className="flex justify-between items-center p-3 sm:p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="bg-black rounded-full p-1.5 flex items-center justify-center">
                  <Image 
                    src="/icons/trimmer.png" 
                    alt="Buzzby" 
                    width={18} 
                    height={18}
                    className="w-5 h-5 invert"
                  />
                </div>
                <h3 className="font-medium text-gray-800 text-sm">Chat with Buzzby</h3>
              </div>
              <button 
                onClick={toggleChat} 
                className="rounded-full p-1.5 hover:bg-gray-200 text-gray-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-3 sm:p-4 max-sm:flex-1 max-sm:flex max-sm:flex-col sm:max-h-[70vh] overflow-hidden">
              <StylistAIComponent inlineMode={true} />
            </div>
          </div>
        )}
      </>
    )
}

export default BuzzbyComponent