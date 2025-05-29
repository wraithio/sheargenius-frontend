'use client'
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCategory } from "@/utils/DataServices";

const StylesMore = () => {
  const [searchActive, setSearchActive] = useState(false);
  const router = useRouter();

  const handleStyleClick = (styleName: string) => {
    setCategory(styleName);
          const queryParams = new URLSearchParams({
            h: styleName,
          }).toString();
          router.push(`/directory?${queryParams}`)
  };

  return (
    <div>
        <nav>
            <Navbar setSearchActive={setSearchActive} hasHeader={true} />
        </nav>
        <header>
            <Header
            searchActive={searchActive}
            setSearchActive={setSearchActive}
            title="More Styles"
            description="More styles to choose from"
            />
        </header>
        <main className="mt-16 md:mt-20">
            <div className="flex justify-center items-center mb-8 md:mb-10">
                <h2 className="font-[NeueMontreal-Medium] text-lg sm:text-xl text-black">
                    Styles
                </h2>
            </div>
            <section className="px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                    <div>
                        <button
                            onClick={() => handleStyleClick("Caesar Cut")}
                            className="bg-white font-[NeueMontreal-Medium] outline-2 rounded-sm w-full py-3 sm:py-4 md:py-5 text-sm sm:text-base leading-none cursor-pointer hover:bg-black hover:text-white active:bg-white active:text-black">
                                Caesar Cut
                        </button>
                    </div>
                    <div>
                         <button
                            onClick={() => handleStyleClick("Mohawk")}
                            className="bg-white font-[NeueMontreal-Medium] outline-2 rounded-sm w-full py-3 sm:py-4 md:py-5 text-sm sm:text-base leading-none cursor-pointer hover:bg-black hover:text-white active:bg-white active:text-black">
                                Mohawk
                        </button>
                    </div>
                    <div>
                         <button
                            onClick={() => handleStyleClick("Faux Hawk")}
                            className="bg-white font-[NeueMontreal-Medium] outline-2 rounded-sm w-full py-3 sm:py-4 md:py-5 text-sm sm:text-base leading-none cursor-pointer hover:bg-black hover:text-white active:bg-white active:text-black">
                                Faux Hawk
                        </button>
                    </div>
                    <div>
                         <button
                            onClick={() => handleStyleClick("Bowl Cut")}
                            className="bg-white font-[NeueMontreal-Medium] outline-2 rounded-sm w-full py-3 sm:py-4 md:py-5 text-sm sm:text-base leading-none cursor-pointer hover:bg-black hover:text-white active:bg-white active:text-black">
                                Bowl Cut
                        </button>
                    </div>
                    <div>
                         <button
                            onClick={() => handleStyleClick("Side Part")}
                            className="bg-white font-[NeueMontreal-Medium] outline-2 rounded-sm w-full py-3 sm:py-4 md:py-5 text-sm sm:text-base leading-none cursor-pointer hover:bg-black hover:text-white active:bg-white active:text-black">
                                Side Part
                        </button>
                    </div>
                    <div>
                         <button
                            onClick={() => handleStyleClick("Pompadour")}
                            className="bg-white font-[NeueMontreal-Medium] outline-2 rounded-sm w-full py-3 sm:py-4 md:py-5 text-sm sm:text-base leading-none cursor-pointer hover:bg-black hover:text-white active:bg-white active:text-black">
                                Pompadour
                        </button>
                    </div>
                    <div>
                         <button
                            onClick={() => handleStyleClick("Quiff")}
                            className="bg-white font-[NeueMontreal-Medium] outline-2 rounded-sm w-full py-3 sm:py-4 md:py-5 text-sm sm:text-base leading-none cursor-pointer hover:bg-black hover:text-white active:bg-white active:text-black">
                                Quiff
                        </button>
                    </div>
                    <div>
                         <button
                            onClick={() => handleStyleClick("Comb Over")}
                            className="bg-white font-[NeueMontreal-Medium] outline-2 rounded-sm w-full py-3 sm:py-4 md:py-5 text-sm sm:text-base leading-none cursor-pointer hover:bg-black hover:text-white active:bg-white active:text-black">
                                Comb Over
                        </button>
                    </div>
                    <div>
                         <button
                            onClick={() => handleStyleClick("Slick Back")}
                            className="bg-white font-[NeueMontreal-Medium] outline-2 rounded-sm w-full py-3 sm:py-4 md:py-5 text-sm sm:text-base leading-none cursor-pointer hover:bg-black hover:text-white active:bg-white active:text-black">
                                Slick Back
                        </button>
                    </div>
                    <div>
                         <button
                            onClick={() => handleStyleClick("Flat Top")}
                            className="bg-white font-[NeueMontreal-Medium] outline-2 rounded-sm w-full py-3 sm:py-4 md:py-5 text-sm sm:text-base leading-none cursor-pointer hover:bg-black hover:text-white active:bg-white active:text-black">
                                Flat Top
                        </button>
                    </div>
                    <div>
                         <button
                            onClick={() => handleStyleClick("Man Bun")}
                            className="bg-white font-[NeueMontreal-Medium] outline-2 rounded-sm w-full py-3 sm:py-4 md:py-5 text-sm sm:text-base leading-none cursor-pointer hover:bg-black hover:text-white active:bg-white active:text-black">
                                Man Bun
                        </button>
                    </div>
                    <div>
                         <button
                            onClick={() => handleStyleClick("French Crop")}
                            className="bg-white font-[NeueMontreal-Medium] outline-2 rounded-sm w-full py-3 sm:py-4 md:py-5 text-sm sm:text-base leading-none cursor-pointer hover:bg-black hover:text-white active:bg-white active:text-black">
                                French Crop
                        </button>
                    </div>
                    <div>
                         <button
                            onClick={() => handleStyleClick("Hair Deficient")}
                            className="bg-white font-[NeueMontreal-Medium] outline-2 rounded-sm w-full py-3 sm:py-4 md:py-5 text-sm sm:text-base leading-none cursor-pointer hover:bg-black hover:text-white active:bg-white active:text-black">
                                Hair Deficient
                        </button>
                    </div>
                    <div>
                        <button
                            disabled
                            className="bg-white font-[NeueMontreal-Medium] outline-2 rounded-sm w-full py-3 sm:py-4 md:py-5 text-sm sm:text-base leading-none opacity-50 cursor-not-allowed" >
                                More Coming Soon
                        </button>
                    </div>
                </div>
            </section>
        </main>
        <footer className="mt-16 md:mt-20">
            <Footer />
        </footer>
    </div>
  );
};
export default StylesMore;