"use client"
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const BuzzbyComponent = () => {
    const router = useRouter();
    const path = usePathname();
    
  return (
    <div className={`fixed right-5 bottom-5 w-[25%] h-24 border-2 border-slate-200 drop-shadow-2xl bg-white p-2 rounded-md flex place-items-center justify-center animate-bounce ${path == "/explore" || path == "/login" || path.includes("/register") ? "hidden" : ""}`}>
        <div className='flex flex-col gap-2'>
            <p className='text-sm'>Chat with Buzzby! Your virtual hair stylist!</p>
            <button
              onClick={() => router.push("/explore")}
              className="bg-black w-full text-white font-[NeueMontreal-Regular] py-1 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75"
            >
              Click Here to Begin
            </button>
        </div>
    </div>
  )
}

export default BuzzbyComponent