import { fetchHaircut, getProfileUserData } from "@/utils/DataServices";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    try {
      const result = await fetchHaircut(query);
      if (result !== undefined) {
        const queryParams = new URLSearchParams({
          h: query,
        }).toString();
        router.push(`/directory?${queryParams}`);
        onClose();
      } else {
        const profileData = await getProfileUserData(query);
        if (profileData !== null) {
          const queryParams = new URLSearchParams({
            u: query,
          }).toString();
          router.push(`/user-profile?${queryParams}`);
          onClose();
        } else {
          const queryParams = new URLSearchParams({
            s: query,
          }).toString();
          router.push(`/search?${queryParams}`);
          onClose();
        }
      }
    } catch (err) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative h-full flex items-start justify-center">
        <div 
          className="w-full max-w-2xl mt-20 mx-4 bg-white rounded-xl shadow-lg transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search ShearGenius..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value.toLowerCase())}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-gray-50 pl-4 pr-10 py-3 rounded-lg outline-none focus:ring-2 focus:ring-black/5 transition-shadow text-base"
                  autoFocus
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <Search className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">
                There was an error with your search. Please try again.
              </p>
            )}
            <div className="mt-4 border-t pt-4">
              <p className="text-sm text-gray-500">
                Search for haircuts, styles, barbers, or users
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal; 