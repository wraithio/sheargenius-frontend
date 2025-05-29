import { blobUpload, editAccount } from "@/utils/DataServices";
import { IUserProfileInfo } from "@/utils/Interfaces";
import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { X, Camera, MapPin, Mail, User, Calendar, AlignLeft, Smile, TextSelect, Settings, LogOut, Trash2, Type } from "lucide-react";
import FollowModal from "./FollowModal";

const UserProfileCard = (info: IUserProfileInfo) => {
  const [isDropDownOpen, setDropDownOpen] = useState(false);
  const [isDropDownOpen2, setDropDownOpen2] = useState(false);
  const [openState, setOpenState] = useState(false);
  const [edit, setEdit] = useState(false);
  const [openFollowing, setOpenFollowing] = useState(false);
  const [openFollowers, setOpenFollowers] = useState(false);
  const [name, setName] = useState<string>(info.name);
  const [email, setEmail] = useState<string>(info.email);
  const [pfp] = useState<string>(info.pfp);
  const [pfpPreview, setPfpPreview] = useState<string>(info.pfp);
  const [accountType, setAccountType] = useState<string>(info.accountType);
  const [shopName, setShopName] = useState<string>(info.shopName);
  const [address, setAddress] = useState<string>(info.address);
  const [city, setCity] = useState<string>(info.city);
  const [state, setState] = useState<string>(info.state);
  const [zip, setZip] = useState<string>(info.zip);
  const [bio, setBio] = useState<string>(info.bio);
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<IUserProfileInfo>({ ...info });
  const router = useRouter();
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const setRatingNum = () => {
    const division_result = data.rating / data.ratingCount.length;
    return String(Math.round(division_result * 10) / 10);
  };

  const toggleDropDown = () => {
    setDropDownOpen(!isDropDownOpen);
  };
  const toggleDropDown2 = () => {
    setDropDownOpen2(!isDropDownOpen2);
  };

  const enableEdit = () => {
    setEdit(true);
    setDropDownOpen(false);
  };

  const setType = (role: string) => {
    setAccountType(role);
    setDropDownOpen(false);
  };
  const setStateMenu = (state: string) => {
    setState(state);
    setDropDownOpen2(false);
  };

  const cancelEdit = () => {
    setEdit(false);
  };

  const handlePicSubmit = async () => {
    if (!file) {
      return data.pfp;
    }
    const uniqueFileName = `${Date.now()}-${file.name}`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", uniqueFileName);

    const uploadedUrl = await blobUpload(formData);

    if (uploadedUrl) {
      console.log("File uploaded at:", uploadedUrl);
      return uploadedUrl;
    }
    return data.pfp;
  };

  const saveEdits = async () => {
    const newEditedUser: IUserProfileInfo = {
      id: 0,
      username: data.username,
      salt: data.salt,
      hash: data.hash,
      date: data.date,
      accountType: accountType,
      name: name,
      rating: data.rating,
      ratingCount: data.ratingCount,
      followers: data.followers,
      following: data.following,
      likes: data.likes,
      securityQuestion: data.securityQuestion,
      securityAnswer: data.securityAnswer,
      bio: bio,
      email: email,
      shopName: shopName,
      address: address,
      city: city,
      state: state,
      zip: zip,
      pfp: (await handlePicSubmit()) || data.pfp,
      isDeleted: data.isDeleted,
    };

    const result = await editAccount(newEditedUser);
    if (result) {
      sessionStorage.setItem("AccountInfo", JSON.stringify(newEditedUser));
      setData(newEditedUser);
      cancelEdit();
      window.dispatchEvent(new Event('storage'));
    } else {
      alert("Editing Failed");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("AccountInfo");
    localStorage.removeItem("token");
    redirect("/login");
  };

  const deleteAccount = async (model: IUserProfileInfo) => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      const { deleteAccount: deleteAccountService } = await import('@/utils/DataServices');
      
      const result = await deleteAccountService(model.username);
      if (result) {
        sessionStorage.clear();
        localStorage.clear();
        router.push('/login');
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImage(e);
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    const file = e.target.files?.[0];

    if (file) {
      reader.onload = () => {
        setPfpPreview(String(reader.result));
      };
      reader.readAsDataURL(file);
    }
  };

  const goToProfile = (name: string) => {
    const queryParams = new URLSearchParams({
      u: name,
    }).toString();
    router.push(`/user-profile?${queryParams}`);
  };

  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  return (
    <section className="font-[NeueMontreal-Medium]">
      {edit ? (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100/20 backdrop-blur-xl bg-white/50">
          <div className="flex flex-col gap-6 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-[NeueMontreal-Medium] bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Edit Profile
              </h2>
              <button
                className="text-gray-500 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-full"
                onClick={cancelEdit}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div className="relative">
                  <Image
                    width={300}
                    height={300}
                    src={pfpPreview.startsWith('data:') ? pfpPreview : (pfp || "/default-pfp.jpeg")}
                    alt={`${data.username} profile pic`}
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-black/5"
                  />
                  <label
                    htmlFor="pictureSelect"
                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </label>
                </div>
                <input
                  type="file"
                  id="pictureSelect"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username
                  </label>
                  <input
                    className="w-full bg-gray-100 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-shadow"
                    type="text"
                    disabled
                    value={data.username}
                    onChange={(e) => {
                      setData({ ...data, username: e.target.value });
                    }}
                    placeholder="Enter your username"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Name
                  </label>
                  <input
                    className="w-full bg-white border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-shadow"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    className="w-full bg-white border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-shadow"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 flex items-center gap-2">
                    <Smile className="w-4 h-4" />
                    Role
                  </label>
                  <div className="relative">
                    <div
                      onClick={toggleDropDown}
                      className="w-full bg-white border border-gray-200 p-3 rounded-xl flex justify-between items-center cursor-pointer hover:border-gray-300 transition-colors"
                    >
                      <span>{accountType}</span>
                      <img
                        className={`w-5 transition-transform duration-200 ${
                          isDropDownOpen ? "rotate-180" : "rotate-0"
                        }`}
                        src="./icons/dropdown.png"
                        alt="Drop Down Icon"
                      />
                    </div>
                    {isDropDownOpen && (
                      <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <div
                          onClick={() => setType("User")}
                          className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          User
                        </div>
                        <div
                          onClick={() => setType("Barber")}
                          className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          Barber
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Link 
                    href="/forgot-password"
                    className="text-sm text-gray-600 hover:text-black transition-colors flex items-center gap-2"
                  >
                    Change your Password
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <AlignLeft className="w-4 h-4" />
                  Bio
                </label>
                <div className="relative">
                  <textarea
                    className="w-full h-full bg-white border border-gray-200 p-3 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-black/5 transition-shadow"
                    placeholder="Tell us about yourself..."
                    value={bio}
                    maxLength={300}
                    onChange={(e) => setBio(e.target.value)}
                  />
                  <span className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {bio.length}/300
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {(data.accountType === "Barber" || accountType === "Barber") && (
                  <div className="space-y-4">
                    <label className="text-sm text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </label>
                    <input
                      className="w-full bg-white border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-shadow"
                      type="text"
                      placeholder="Barbershop Name"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                    />
                    <input
                      className="w-full bg-white border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-shadow"
                      type="text"
                      placeholder="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <input
                      className="w-full bg-white border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-shadow"
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <div className="relative">
                      <div
                        onClick={toggleDropDown2}
                        className="w-full bg-white border border-gray-200 p-3 rounded-xl flex justify-between items-center cursor-pointer hover:border-gray-300 transition-colors"
                      >
                        <span>{state}</span>
                        <img
                          className={`w-5 transition-transform duration-200 ${
                            isDropDownOpen2 ? "rotate-180" : "rotate-0"
                          }`}
                          src="./icons/dropdown.png"
                          alt="Drop Down Icon"
                        />
                      </div>
                      {isDropDownOpen2 && (
                        <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-48 overflow-y-auto">
                          {states.map((state) => (
                            <div
                              key={state}
                              onClick={() => setStateMenu(state)}
                              className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                              {state}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      className="w-full bg-white border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-shadow"
                      type="text"
                      placeholder="ZIP"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              className="bg-black w-full text-white font-[NeueMontreal-Medium] py-5 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75"
              onClick={saveEdits}
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-gray-100/20 backdrop-blur-xl bg-white/50">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="relative w-full">
                  <div className="absolute top-0 right-0 flex items-center gap-4">
                    <button
                      onClick={enableEdit}
                      className="group relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Settings className="w-5 h-5 text-gray-600 hover:text-black transition-colors" />
                      <span className="absolute -bottom-8 right-0 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Edit Profile
                      </span>
                    </button>
                    <button
                      onClick={logout}
                      className="group relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <LogOut className="w-5 h-5 text-gray-600 hover:text-black transition-colors" />
                      <span className="absolute -bottom-8 right-0 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Logout
                      </span>
                    </button>
                    <button
                      onClick={() => setOpenState(true)}
                      className="group relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-500 hover:text-red-600 transition-colors" />
                      <span className="absolute -bottom-8 right-0 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Delete Account
                      </span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-8">
                    <div className="relative group">
                      <Image
                        width={300}
                        height={300}
                        src={data.pfp || "/default-pfp.jpeg"}
                        alt={`${data.username} profile pic`}
                        className="w-36 h-36 rounded-full object-cover ring-4 ring-black/5"
                        priority
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>Joined: {data.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-3xl sm:text-4xl font-[NeueMontreal-Medium] bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            {data.username}
                          </h2>
                          <div className={`px-3 mt-1.5 py-1 rounded-full text-xs font-medium ${
                            data.accountType === "Barber" 
                              ? "bg-blue-100 text-blue-800 ring-1 ring-blue-800/10" 
                              : "bg-gray-100 text-gray-800 ring-1 ring-gray-800/10"
                          }`}>
                            {data.accountType}
                          </div>
                        </div>
                        <h3 className="text-xl text-gray-600">{data.name}</h3>
                      </div>
                      
                      <div className="flex gap-6 text-sm">
                        <button
                          onClick={() => setShowFollowModal(true)}
                          className="text-gray-600 hover:text-black transition-colors"
                        >
                          {data.followers.length === 1
                            ? `${data.followers.length} Follower`
                            : `${data.followers.length} Followers`}
                        </button>
                        <button
                          onClick={() => setShowFollowModal(true)}
                          className="text-gray-600 hover:text-black transition-colors"
                        >
                          {data.following.length} Following
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
                 <div className="flex flex-col lg:flex-row gap-8 mt-8">
                  <div className="flex-1 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-lg mb-3">Bio</h3>
                    <p className="text-gray-600 leading-relaxed">{data.bio || "No bio yet."}</p>
                  </div>

                  {data.accountType === "Barber" && (
                    <div className="lg:w-80 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                      <h3 className="text-lg mb-4">Location</h3>
                      <div className="space-y-2">
                        <h2 className="text-xl font-medium">{data.shopName}</h2>
                        <p className="text-gray-600">{data.address}</p>
                        <p className="text-gray-600">
                          {data.city}, {data.state} {data.zip}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <FollowModal
        isOpen={showFollowModal}
        onClose={() => setShowFollowModal(false)}
        followers={data.followers}
        following={data.following}
        onViewProfile={goToProfile}
        isOwnProfile={true}
      />

      {openState && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-in zoom-in-95 relative">
            <button
              onClick={() => setOpenState(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-2xl font-[NeueMontreal-Medium] mb-2">Delete Account</h3>
              <p className="text-gray-600 mb-2">Are you sure you want to delete your account?</p>
              <p className="text-red-500 text-sm mb-8">This action CANNOT be undone!</p>
              
              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={() => deleteAccount(data)}
                  disabled={isDeleting}
                  className={`w-full py-4 rounded-xl font-[NeueMontreal-Medium] transition-colors ${
                    isDeleting 
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600 active:bg-red-500'
                  }`}
                >
                  {isDeleting ? 'Deleting account...' : 'Yes, delete my account'}
                </button>
                <button
                  onClick={() => setOpenState(false)}
                  disabled={isDeleting}
                  className="w-full bg-gray-100 text-gray-600 py-4 rounded-xl hover:bg-gray-200 active:bg-gray-100 transition-colors font-[NeueMontreal-Medium]"
                >
                  No, keep my account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserProfileCard;
