"use client";
import { chatBot, setCategory } from "@/utils/DataServices";
import { IHaircutInterface } from "@/utils/Interfaces";
import React, { useEffect, useRef, useState } from "react";
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

const StylistAIComponent = ({ inlineMode = false }) => {
  const [showLink, setShowLink] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<{type: 'user' | 'ai', text: string}[]>([]);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (conversation.length > 0) {
      scrollToBottom();
    }
  }, [conversation]);

  const generateQ = async () => {
    if (!question.trim() || isLoading) return;
    
    const userQuestion = question.trim();
    setConversation([...conversation, {type: 'user', text: userQuestion}]);
    setQuestion("");
    setIsLoading(true);
    
    try {
      const response = await chatBot(
        `Recommend one hairstyle out of these hairstyles (${await categoryTitles()}) from this prompt: "${userQuestion}" Keep the answer short, but casual with a brief explanation of why the selected haircut suits their needs. Stringify the response and make it sound natural and remove the quotation marks. When selecting a haircut, use the name verbatim.`
      );
      
      setResult(response);
      setConversation(prev => [...prev, {type: 'ai', text: response}]);
    } catch (error) {
      const errorMessage = "Sorry, I had trouble processing that. Please try again.";
      setResult(errorMessage);
      setConversation(prev => [...prev, {type: 'ai', text: errorMessage}]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const findLink = async () => {
      if (!result || result === "Thinking...") return;
      
      const titles = await categoryTitles();
      const titleList = titles.split(", ");
      
      for (let i = 0; i < titleList.length; i++) {
        if (result.includes(titleList[i])) {
          setShowLink(true);
          setLink(titleList[i]);
          return;
        }
      }
      
      setShowLink(false);
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

  if (!inlineMode) {
    return (
      <div className="mt-12 flex justify-center items-center flex-col gap-3">
        <div className="text-center w-full max-w-md">
          <h3 className="text-lg font-medium">Hi I am Buzzby, your virtual stylist!</h3>
          <h3 className="text-sm mt-2 text-gray-600">
            Just tell me a little about yourself—your face shape, hair type,
            favorite looks, or even your mood—and I&apos;ll suggest a hairstyle that
            complements your unique style.
          </h3>
        </div>
        <div className="w-full max-w-md mt-4">
          <h3 className="text-xs font-bold mb-1">
            What kind of haircut are you looking for?
          </h3>
          <div className="flex gap-2">
            <input
              className="border-2 rounded-lg w-full p-2 text-sm"
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., something professional but easy to maintain"
              value={question}
              onKeyDown={(e) => e.key === 'Enter' && generateQ()}
            />
          </div>
        </div>
        <div className="w-full max-w-md flex flex-col gap-1 justify-center text-center">
          <h3 className={isLoading ? "animate-pulse" : ""}>
            {result}
          </h3>
          {showLink && (
            <div className="text-xs flex gap-1 justify-center">
              <h3>Learn More about the </h3>
              <h3
                className="font-bold cursor-pointer text-blue-600"
                onClick={() => gotoPage(link)}
              >
                {link}
              </h3>
              <h3>here</h3>
            </div>
          )}
        </div>

        <button
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors mt-4"
          onClick={generateQ}
          disabled={isLoading || !question.trim()}
        >
          {isLoading ? "Thinking..." : "Ask!"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-sm:justify-between">
      <div className="text-center mb-1">
        <h3 className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
          Hi, I'm Buzzby!
        </h3>
        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
          Tell me about your style preferences and I'll suggest the perfect haircut.
        </p>
      </div>
      
      <div className="flex-grow overflow-y-auto my-2">
        {conversation.length > 0 ? (
          <div className="flex flex-col gap-3 p-1 rounded-lg">
            {conversation.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-2xl p-2.5 px-3.5 text-sm max-w-[85%] ${
                  message.type === 'user' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100'
                }`}>
                  {message.text}
                  
                  {message.type === 'ai' && showLink && index === conversation.length - 1 && (
                    <div className="mt-2 text-xs py-1 flex items-center gap-1 border-t border-gray-200 pt-1">
                      <span className="text-gray-600">Learn more about:</span>
                      <button
                        className="font-medium text-blue-600 hover:underline"
                        onClick={() => gotoPage(link)}
                      >
                        {link}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={conversationEndRef} />
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-3 shadow-sm">
            <p className="text-xs text-gray-600 text-center leading-relaxed">
              Ask me about what haircut might suit you based on your face shape, style preferences, or maintenance needs!
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-auto">
        <div className="flex items-center gap-2 rounded-full bg-gray-100 pr-1 pl-3 mt-1">
          <input
            className="bg-transparent text-sm py-2.5 flex-1 focus:outline-none placeholder-gray-400"
            placeholder={isLoading ? "Thinking..." : "e.g., short hair for round face..."}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateQ()}
            disabled={isLoading}
          />
          <button
            className={`rounded-full p-2 ${isLoading || !question.trim() 
              ? 'bg-gray-300 text-gray-500' 
              : 'bg-black text-white hover:bg-gray-800'} transition-all`}
            onClick={generateQ}
            disabled={isLoading || !question.trim()}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" className={isLoading ? "animate-spin" : ""}>
              {isLoading ? (
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              ) : (
                <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StylistAIComponent;
