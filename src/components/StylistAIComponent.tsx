"use client";
import { chatBot, setCategory } from "@/utils/DataServices";
import { IHaircutInterface } from "@/utils/Interfaces";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface IResult {
  response: string;
  index: number;
}

const categoryTitles = async () => {
  const response = await fetch("/Haircuts.json");
  const data = await response.json();
  const titles: string[] = [];
  data.haircuts.map((haircut: IHaircutInterface) => {
    titles.push(haircut.name);
  });
  return titles.join(", ");
};

const StylistAIComponent = () => {
  const [showLink, setShowLink] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const router = useRouter();

  const generateQ = async () => {
    setResult("loading, this may take a while...");
    setResult(
      `${await chatBot(
        `Recommend one hairstyle out of these hairstyles (${await categoryTitles()}) from this prompt: "${question}" Keep the answer short, but casual with a brief explanation of why the selected haircut suits their needs. Stringify the response and make it sound natural and remove the quotation marks. When selecting a haircut, use the name verbatim.`
      )}`
    );
  };

  useEffect(() => {
    const findLink = async () => {
      const titles: string[] = await (await categoryTitles()).split(", ");
      for (let i = 0; i < (await titles.length); i++) {
        if (result.includes(await titles[i])) {
          setShowLink(true);
          setLink(titles[i]);
          return;
        }
      }
    };
    findLink();
  }, [result]);

  const gotoPage = (page: string) => {
    setCategory(page);
    const queryParams = new URLSearchParams({
      h: page,
    }).toString();
    router.push(`/directory?${queryParams}`);
  };

  return (
    <div className="mt-12 flex justify-center place-items-center flex-col gap-3">
      <div className="text-center w-[50%]">
        <h3>Hi I am Buzzby, your virtual stylist!</h3>
        <h3 className="text-sm">
          Just tell me a little about yourself—your face shape, hair type,
          favorite looks, or even your mood—and I&apos;ll suggest a hairstyle that
          complements your unique style.
        </h3>
      </div>
      <div>
        <h3 className="text-xs font-bold mb-1">
          What kind of haircut are you looking for?
        </h3>
        <input
          className="border-2 rounded-lg w-64 p-1 text-xs"
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1 justify-center text-center">
        <h3 className={result == "loading, this may take a while..." ? "animate-bounce " : ""}>
          {result}
        </h3>
        {showLink && (
          <div className="text-xs flex gap-1 justify-center">
            <h3>Learn More about the </h3>
            <h3
              className="font-bold cursor-pointer"
              onClick={() => gotoPage(link)}
            >
              {link}
            </h3>
            <h3>here</h3>
          </div>
        )}
      </div>

      <button
        className="border-2 px-2 hover:bg-black hover:text-white cursor-pointer"
        onClick={generateQ}
      >
        Ask!
      </button>
    </div>
  );
};

export default StylistAIComponent;
