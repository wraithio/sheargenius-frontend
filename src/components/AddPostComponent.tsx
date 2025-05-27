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

const AddPostComponent = () => {
  const [dropDown, toggleDropDown] = useState(false);
  const [style, setStyle] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>(
    "/nofileselected.png"
  );
  const [haircuts, setHaircuts] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategoryTitles = async () => {
      try {
        const response = await fetch("/Haircuts.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const titles: string[] = data.haircuts.map(
          (haircut: IHaircutInterface) => haircut.name
        );
        setHaircuts(titles);
        if (titles.length > 0 && style === "") {
          setStyle(titles[0]);
        }
      } catch (error) {
        console.error("Failed to fetch haircut titles:", error);
      }
    };

    fetchCategoryTitles();
  }, []);

  const handleStyle = (cut: string) => {
    setStyle(cut);
    toggleDropDown(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(String(reader.result));
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    console.log(file);
    if (!file) {
      alert("Please select an image to upload.");
      return;
    }
    if (!style) {
      alert("Please select a category/style.");
      return;
    }

    const uniqueFileName = `${Date.now()}-${file.name}`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", uniqueFileName);

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
      console.log("Post added successfully!");
      const queryParams = new URLSearchParams({
        u: newPost.publisherName,
      }).toString();
      router.push(`/user-profile?${queryParams}`);
      window.location.reload();
    }
  };

  return (
    <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 w-full max-h-[90vh] overflow-y-auto">
      <h2 className="font-[NeueMontreal-Medium] text-center text-lg sm:text-xl md:text-2xl mb-4 sm:mb-5">
        Create Post
      </h2>

      <div className="mx-auto flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-5">
          <div className="w-full md:w-2/5 flex flex-col gap-1 sm:gap-1.5">
            <label
              htmlFor="pictureSelect"
              className="font-[NeueMontreal-Medium] text-xs sm:text-sm"
            >
              Image
            </label>
            <div className="aspect-square w-full bg-gray-100 rounded-md overflow-hidden border border-gray-300 flex items-center justify-center">
              <img
                src={imagePreview}
                alt="New post preview"
                className={`w-full h-full ${
                  imagePreview === "/nofileselected.png"
                    ? "object-scale-down p-4 sm:p-6 md:p-8 opacity-50"
                    : "object-cover"
                }`}
              />
            </div>
          </div>

          <div className="w-full md:w-3/5 flex flex-col gap-1 sm:gap-1.5">
            <div className="flex justify-between items-center">
              <label
                htmlFor="postCaption"
                className="font-[NeueMontreal-Medium] text-xs sm:text-sm"
              >
                Caption
              </label>
              <span className="font-[NeueMontreal-Medium] text-gray-500 text-xs">
                300 characters
              </span>
            </div>
            <textarea
              name="caption"
              id="postCaption"
              maxLength={300}
              placeholder="Write a caption..."
              className="bg-white border border-gray-300 p-2 sm:p-3 w-full min-h-[100px] sm:min-h-[120px] md:h-full resize-none rounded-md font-[NeueMontreal-Medium] text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
              onChange={(e) => setCaption(e.target.value)}
              value={caption}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="pictureSelect"
            className="block text-center bg-black w-full text-white font-[NeueMontreal-Medium] py-2.5 sm:py-3 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75 text-sm sm:text-base"
          >
            Upload Image
          </label>
          <input
            type="file"
            id="pictureSelect"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex flex-col gap-1 sm:gap-1.5">
          <label
            htmlFor="categoryStyle"
            className="font-[NeueMontreal-Medium] text-xs sm:text-sm"
          >
            Category / Style
          </label>
          <div className="relative">
            <button
              type="button"
              id="categoryStyle"
              onClick={() => toggleDropDown(!dropDown)}
              className="bg-white border border-gray-300 flex justify-between items-center rounded-md px-2 sm:px-3 py-2 sm:py-2.5 cursor-pointer text-black w-full text-left font-[NeueMontreal-Medium] text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
            >
              <span className={style ? "text-black" : "text-gray-500"}>
                {style || "Select a style"}
              </span>
              <img
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 transform ${
                  dropDown ? "rotate-180" : "rotate-0"
                }`}
                src="/icons/dropdown.png"
                alt="Dropdown arrow"
              />
            </button>
            {dropDown && (
              <div className="rounded-md border border-gray-300 bg-white p-1 sm:p-2 absolute z-10 shadow-lg mt-1 w-full max-h-36 sm:max-h-44 md:max-h-52 overflow-y-auto transition-opacity duration-150 ease-in-out">
                {haircuts.length > 0 ? (
                  haircuts.map((cut) => (
                    <div
                      key={cut}
                      onClick={() => handleStyle(cut)}
                      className="cursor-pointer hover:bg-gray-100 p-1.5 sm:p-2 rounded-sm font-[NeueMontreal-Medium] text-xs sm:text-sm"
                    >
                      {cut}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-xs sm:text-sm text-gray-500 font-[NeueMontreal-Medium]">
                    Loading styles...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          className="bg-[#1500FF] text-white py-2.5 sm:py-3 px-4 mt-1 sm:mt-2 rounded-md font-[NeueMontreal-Medium] text-sm sm:text-base hover:bg-white hover:outline-2 hover:text-[#1500FF] active:bg-[#1500FF] active:text-white active:outline-none transition-colors duration-150 w-full"
          onClick={handleSubmit}
        >
          POST
        </button>
      </div>
    </div>
  );
};

export default AddPostComponent;
