"use client";
import {
  addPostItem,
  blobUpload,
  fetchInfo,
  getFormattedDate,
  getToken,
} from "@/utils/DataServices";
import { IHaircutInterface, IPostItems } from "@/utils/Interfaces";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const categoryTitles = async () => {
  const response = await fetch("/Haircuts.json");
  const data = await response.json();
  const titles: string[] = [];
  data.haircuts.map((haircut: IHaircutInterface) => {
    titles.push(haircut.name);
  });
  return titles;
};

const AddPostComponent = () => {
  const [dropDown, toggleDropDown] = useState(false);
  const [style, setStyle] = useState<string>("Drop Fade");
  const [caption, setCaption] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>(
    "/nofileselected.png"
  );
  const [haircuts, setHaircuts] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTitles = async () => {
      setHaircuts(await categoryTitles());
    };
    fetchTitles();
  }, [router]);

  const handleStyle = (cut: string) => {
    setStyle(cut);
    toggleDropDown(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImage(e);
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      console.log(e.target.files[0]);
    }
  };

  //A Function that Handles the submitting of file to our backend
  const handleSubmit = async () => {
    //Check if the file is inside of our state Variable
    console.log(file);
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    //A Unique file name so data isn't being overwritten in our blob
    const uniqueFileName = `${Date.now()}-${file.name}`;

    //New Form Data Object to append our file and file name
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", uniqueFileName);

    //Finally passing that formData into our Backend
    const uploadedUrl = await blobUpload(formData);

    if (uploadedUrl) {
      const newPost: IPostItems = {
        id: 0,
        userId: fetchInfo().id,
        publisherName: fetchInfo().username,
        date: getFormattedDate(),
        caption: caption,
        image: uploadedUrl,
        likes: [],
        category: style,
        isPublished: true,
        isDeleted: false,
        comments: [],
      };
      console.log(newPost);
      await addPostItem(newPost, getToken());
      const queryParams = new URLSearchParams({
        u: fetchInfo().username,
      }).toString();
      router.push(`/search?${queryParams}`);
      window.location.reload();
    }
  };

  //normal file reader for image preview NOT added to DB
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    const file = e.target.files?.[0];

    if (file) {
      //when this files if turned into a string this on load function will run
      reader.onload = () => {
        setImagePreview(String(reader.result)); //once the file is read we will store the result into our setter function
      };
      reader.readAsDataURL(file); //this converts the file into a bas64-encoded string
    }
  };

  return (
    <div className="px-10 pb-10 pt-3">
      <h2 className="font-[NeueMontreal-Medium] text-center text-2xl mb-10">
        Create Post
      </h2>
      <div className="flex justify-center place-items-center h-[50vh]">
        <div className="flex w-[70%] flex-col gap-3">
          <div className="flex gap-3 min-h-[15vh]">
            <div className="w-[40%]">
              <h4 className="font-[NeueMontreal-Medium]">Image</h4>
              <img
                src={imagePreview}
                alt="new post picture"
                className="w-full h-[205px] aspect-square outline-2 rounded-sm"
              />
            </div>
            <div className="w-[60%]">
              <div className="flex justify-between items-center">
                <h4 className="font-[NeueMontreal-Medium]">Caption</h4>
                <h5 className="font-[NeueMontreal-Medium] text-gray-500 text-xs">
                  300 characters
                </h5>
              </div>

              <textarea
                name="caption"
                id="postCaption"
                maxLength={300}
                placeholder="Caption..."
                className="bg-[#f5f5f5] p-2 w-full h-[205px] resize-none rounded-sm font-[NeueMontreal-Medium]"
                onChange={(e) => setCaption(e.target.value)}
              ></textarea>
            </div>
          </div>

          <label htmlFor="pictureSelect" className="cursor-pointer">
            <div className="bg-black w-full text-white text-sm font-[NeueMontreal-Medium] py-2 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75 text-center">
              Upload Image
            </div>
          </label>

          <input
            type="file"
            id="pictureSelect"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          <div>
            <h4 className="font-[NeueMontreal-Medium]">Category/Style</h4>

            <div
              onClick={() => toggleDropDown(!dropDown)}
              className="bg-[#f5f5f5] flex justify-between items-center rounded-md px-4 py-2 cursor-pointer text-black"
            >
              {style}
              <img
                className={`w-[25px] m-0 p-0 transition-transform duration-500 ${
                  dropDown ? "rotate-180" : "rotate-0"
                }`}
                src="./icons/dropdown.png"
                alt="Drop Down Icon"
              />
            </div>
            {dropDown && (
              <div
                className={`rounded-md border-gray-300 bg-white p-3 absolute z-30 shadow-md transition-all duration-700 h-50 w-[62.5%] overflow-y-scroll mt-1 ${
                  dropDown ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                <div>
                  {haircuts.map((cut) => (
                    <div
                      key={cut}
                      onClick={() => handleStyle(cut)}
                      className="cursor-pointer hover:bg-gray-100 p-1 rounded-sm"
                    >
                      {cut}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            className="bg-[#1500FF] text-white py-3 mt-2 rounded-md font-[NeueMontreal-Medium] text-sm hover:bg-black active:bg-[#1500FF] cursor-pointer"
            onClick={handleSubmit}
          >
            POST
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPostComponent;
