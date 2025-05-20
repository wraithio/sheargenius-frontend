'use client'
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
const Footer = () => {
  const [email,setEmail] = useState<string>("")
  const router = useRouter();
  const openNavbarCategory = (category: string) => {
    window.dispatchEvent(
      new CustomEvent("openNavbarCategory", { detail: { category } })
    );
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const gotoCreate = () => {
    const queryParams = new URLSearchParams({ 
      presetEmail: email,  
    }).toString();
    router.push(`/register?${queryParams}`);
  }

  return (
    <div className="bg-black w-full min-h-[350px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10 text-xs sm:text-sm">
      <p
        onClick={() => scrollToSection("page-header")}
        className="font-[NeueMontreal-Medium] text-white hover:underline cursor-pointer mb-6 sm:mb-8 lg:mb-10 text-sm"
      >
        Back To Top ↑
      </p>

      <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-6 lg:gap-10">
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 md:gap-16 lg:gap-20">
          <div className="flex flex-col gap-2 sm:gap-3">
            <p className="font-[NeueMontreal-Medium] text-white mb-1"> HOME </p>
            <div className="flex flex-col gap-1">
              <a
                onClick={(e) => { e.preventDefault(); scrollToSection("top-posts"); }}
                className="font-[NeueMontreal-Regular] text-gray-300 hover:text-white cursor-pointer transition-colors duration-150"
                href="#top-posts"
              >
                TOP POSTS
              </a>
              <a
                onClick={(e) => { e.preventDefault(); scrollToSection("local-barbers"); }}
                className="font-[NeueMontreal-Regular] text-gray-300 hover:text-white cursor-pointer transition-colors duration-150"
                href="#local-barbers"
              >
                LOCAL BARBERS
              </a>
              <a
                onClick={(e) => { e.preventDefault(); scrollToSection("create-account"); }}
                className="font-[NeueMontreal-Regular] text-gray-300 hover:text-white cursor-pointer transition-colors duration-150"
                href="#create-account"
              >
                CREATE ACCOUNT
              </a>
              <a
                onClick={(e) => { e.preventDefault(); scrollToSection("barber-essentials"); }}
                className="font-[NeueMontreal-Regular] text-gray-300 hover:text-white cursor-pointer transition-colors duration-150"
                href="#barber-essentials"
              >
                BARBER ESSENTIALS
              </a>
              <a
                onClick={(e) => { e.preventDefault(); scrollToSection("barber-etiquette"); }}
                className="font-[NeueMontreal-Regular] text-gray-300 hover:text-white cursor-pointer transition-colors duration-150"
                href="#barber-etiquette"
              >
                BARBER SHOP ETIQUETTE
              </a>
              <a
                onClick={(e) => { e.preventDefault(); scrollToSection("clippers-crash-course"); }}
                className="font-[NeueMontreal-Regular] text-gray-300 hover:text-white cursor-pointer transition-colors duration-150"
                href="#clippers-crash-course"
              >
                CLIPPERS CRASH COURSE
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:gap-3">
            <p className="font-[NeueMontreal-Medium] text-white mb-1"> EXPLORE </p>
            <div className="flex flex-col gap-1">
              <Link
                href=""
                onClick={(e) => { e.preventDefault(); openNavbarCategory("fades"); }}
                className="font-[NeueMontreal-Regular] text-gray-300 hover:text-white transition-colors duration-150"
              >
                FADES
              </Link>
               <Link
                href=""
                onClick={(e) => { e.preventDefault(); openNavbarCategory("skin-fades"); }}
                className="font-[NeueMontreal-Regular] text-gray-300 hover:text-white transition-colors duration-150"
              >
                SKIN FADES
              </Link>
              <Link
                href=""
                onClick={(e) => { e.preventDefault(); openNavbarCategory("styles"); }}
                className="font-[NeueMontreal-Regular] text-gray-300 hover:text-white transition-colors duration-150"
              >
                STYLES
              </Link>
              <Link
                href=""
                onClick={(e) => { e.preventDefault(); openNavbarCategory("general-knowledge"); }}
                className="font-[NeueMontreal-Regular] text-gray-300 hover:text-white transition-colors duration-150"
              >
                GENERAL KNOWLEDGE
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3 mt-4 md:mt-0 md:max-w-xs lg:max-w-sm xl:max-w-md">
          <p className="font-[NeueMontreal-Medium] text-white mb-1">
            CREATE YOUR ACCOUNT
          </p>
          <div className="flex flex-col gap-2">
            <input
              className="bg-white font-[NeueMontreal-Regular] w-full lg:w-[350px] rounded-sm px-3 py-2 sm:px-4 sm:py-3 text-black text-sm placeholder-gray-500 outline-none"
              type="text"
              placeholder="email"
              aria-label="Email for account creation"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={gotoCreate}
              className="bg-[#1500FF] font-[NeueMontreal-Medium] rounded-sm text-white px-5 py-2.5 sm:py-3 text-sm hover:bg-blue-700 active:bg-blue-800 transition-colors duration-150 w-full lg:w-auto"
            >
              CREATE ACCOUNT
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 mt-8 pt-6 border-t border-gray-700 sm:flex-row sm:justify-between sm:mt-10 sm:pt-8">
        <p className="font-[NeueMontreal-Medium] text-gray-400">
          CodeStack Academy
        </p>
        <p className="font-[NeueMontreal-Medium] text-gray-400">
          © 2025 ShearGenius
        </p>
      </div>
    </div>
  );
};
export default Footer;