"use client";
import {
  createAccount,
  getFormattedDate,
  getLoggedInUserData,
  loggedInData,
  login,
} from "@/utils/DataServices";
import { INewUser, IToken } from "@/utils/Interfaces";
import Link from "next/link";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [isDropDownOpen, setDropDownOpen] = useState(false);
  const [isDropDownOpen2, setDropDownOpen2] = useState(false);
  const [isDropDownOpen3, setDropDownOpen3] = useState(false);
  const [selectedRole, setSelectedRole] = useState("User / Barber");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [exp, setExp] = useState<string>("");
  const [barbershopName, setBarbershopName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("State");
  const [zip, setZIP] = useState<string>("");
  const [securityQuestion, setSecurityQestion] =
    useState<string>("-please select-");
  const [securityAnswer, setSecurityAnswer] = useState<string>("");
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const toggleDropDown = () => {
    setDropDownOpen(!isDropDownOpen);
  };
  const toggleDropDown2 = () => {
    setDropDownOpen2(!isDropDownOpen2);
  };
  const toggleDropDown3 = () => {
    setDropDownOpen3(!isDropDownOpen3);
  };

  const selectRole = (role: string) => {
    setSelectedRole(role);
    setDropDownOpen(false);
  };

  const setStateMenu = (state: string) => {
    setState(state);
    setDropDownOpen3(false);
  };

  const selectQuestion = (question: string) => {
    setSecurityQestion(question);
    setDropDownOpen2(false);
  };

  const handleConfirmSecurity = () => {
    if (securityQuestion === "-please select-" || !securityAnswer) {
      alert("Please select a security question and provide an answer.");
      return;
    }
    setIsSecurityModalOpen(false);
  };

  const evaluatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[@$!%*?&#^+=]/.test(pwd)) strength++;

    if (strength <= 2) return "Weak";
    if (strength === 3 || strength === 4) return "Moderate";
    return "Strong";
  };

  const handleSubmit = async () => {
    if (
      !username ||
      !password ||
      !name ||
      !email ||
      securityQuestion === "-please select-" ||
      !securityAnswer
    ) {
      alert(
        "Please fill out all required fields, including setting a security question and answer."
      );
      return;
    }
    if (selectedRole === "User / Barber") {
      alert("Please select a Role (User or Barber).");
      return;
    }
    if (
      selectedRole === "Barber" &&
      (!exp || !address || !city || state === "State" || !zip)
    ) {
      alert("Please fill out all barber-specific fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log(getFormattedDate());
    const newEditedUser: INewUser = {
      id: 0,
      username: username.toLowerCase().trim(),
      password: password.trim(),
      accountType: selectedRole,
      name: name.trim(),
      date: getFormattedDate(),
      rating: 0,
      ratingCount: [],
      followers: [],
      following: [],
      likes: [],
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer.toLowerCase().trim(),
      bio: Number(exp) > 0 ? `${exp} year(s) of experience.` : "",
      email: email,
      shopName: barbershopName.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      zip: zip.trim(),
      pfp: "/icons/user-white.png",
      isDeleted: false,
    };

    console.log(newEditedUser);
    let accountCreated = false;
    try {
      accountCreated = await createAccount(newEditedUser);
    } catch (err) {
      console.error("Create account API call failed:", err);
      alert("An error occurred during account creation.");
    }

    if (accountCreated) {
      console.log("Account Created");
      const userData = { username: username, password: password };
      let token: IToken | null = null;
      try {
        token = await login(userData);
      } catch (err) {
        console.error("Login API call failed after registration:", err);
        alert(
          "Account created, but automatic login failed. Please log in manually."
        );
        redirect("/login");
      }

      if (token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("Token", token.token);
          console.log(token.token);
          try {
            await getLoggedInUserData(username);
            const accountInfo = loggedInData();
            sessionStorage.setItem("AccountInfo", JSON.stringify(accountInfo));
            if (accountInfo && accountInfo.isDeleted === false) {
              router.push("/");
            } else {
              console.log(
                "Account is deleted or info missing post-registration."
              );
              localStorage.removeItem("Token");
              sessionStorage.removeItem("AccountInfo");
              redirect("/login");
            }
          } catch (err) {
            console.error(
              "Failed to get user data or navigate post-registration:",
              err
            );
            alert(
              "Account created and logged in, but failed to load user data. Please refresh or log in again."
            );
          }
        }
      } else {
        console.log("Automatic login was unsuccessful after registration.");
        alert("Account created successfully! Please log in.");
        redirect("/login");
      }
    } else {
      alert("Username already exists or another error occurred.");
      console.log("Account creation failed.");
    }
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

  const inputBaseClass =
    "bg-[#F5F5F5] rounded-md p-3 sm:p-4 text-sm sm:text-base";
  const inputSmallClass =
    "bg-[#F5F5F5] rounded-md px-3 py-2 sm:px-4 text-sm sm:text-base";
  const dropdownTriggerClass =
    "bg-[#f5f5f5] flex justify-between items-center rounded-md px-3 py-2 sm:px-4 cursor-pointer text-sm sm:text-base";
  const primaryButtonClass =
    "bg-[#1500FF] text-white py-3 sm:py-4 rounded-md font-[NeueMontreal-Medium] text-sm hover:bg-black active:bg-[#1500FF] cursor-pointer transition-colors duration-150";
  const secondaryButtonClass =
    "bg-gray-200 text-black py-2 px-4 rounded-md font-[NeueMontreal-Medium] text-sm hover:bg-gray-300 active:bg-gray-400 cursor-pointer transition-colors duration-150";

  useEffect(() => {
    if (searchParams.size != 0 && searchParams.get("presetEmail")) {
      setEmail(searchParams.get("presetEmail") || "");
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <Link href={"/"} className="cursor-pointer">
          <p className="font-[NeueMontreal-Medium] text-lg lg:text-xl text-white lg:text-black">
            SHEARGENIUS
          </p>
        </Link>
      </div>

      <div
        className="w-full lg:w-4/10 flex flex-col flex-grow lg:overflow-y-auto
                     bg-cover bg-center bg-[url('/loginregister-img.webp')] lg:bg-none
                     lg:justify-center lg:p-8 lg:pt-24"
      >
        <div
          className="w-full max-w-md mx-auto mt-24 mb-8 bg-white p-6 sm:p-8 shadow-xl rounded-lg flex flex-col
                        lg:shadow-none lg:rounded-none lg:p-0 lg:my-0 lg:mx-0 lg:max-w-none"
        >
          <div className="flex flex-col justify-center text-center">
            <p className="font-[NeueMontreal-Bold] text-2xl lg:text-3xl">
              {" "}
              CREATE ACCOUNT{" "}
            </p>
            <p className="font-[NeueMontreal-Medium] text-sm">
              {" "}
              Welcome to ShearGenius{" "}
            </p>
          </div>

          <div className="flex flex-col mt-8 sm:mt-12">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col">
                <p className="font-[NeueMontreal-Medium] text-sm pb-1">
                  {" "}
                  Name{" "}
                </p>
                <input
                  className={inputBaseClass}
                  type="text"
                  placeholder="Name"
                   maxLength={20}
                  onChange={(e) => setName(e.target.value)}
                  required
                  aria-label="Name"
                />
              </div>
              <div className="flex flex-col">
                <p className="font-[NeueMontreal-Medium] text-sm pb-1">
                  {" "}
                  Username{" "}
                </p>
                <input
                  className={inputBaseClass}
                  type="text"
                  maxLength={20}
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  aria-label="Username"
                />
              </div>
              <div className="flex flex-col">
                <p className="font-[NeueMontreal-Medium] text-sm pb-1">
                  {" "}
                  Email{" "}
                </p>
                {searchParams.get("presetEmail") ? (
                  <input
                    className={inputBaseClass}
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={searchParams.get("presetEmail") || ""}
                  />
                ) : (
                  <input
                    className={inputBaseClass}
                    type="email"
                    placeholder="Email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email"
                  />
                )}
              </div>

              <div className="flex flex-col relative">
                <p className="font-[NeueMontreal-Medium] text-sm pb-1">
                  Password
                </p>
                <input
                  className={`${inputBaseClass} pr-10`}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordStrength(
                      evaluatePasswordStrength(e.target.value)
                    );
                  }}
                  value={password}
                  required
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[50%] text-gray-500 hover:text-black cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>

                {password && (
                  <>
                    <div className="h-2 mt-1 rounded bg-gray-200">
                      <div
                        className={`h-full rounded transition-all duration-300 ${
                          passwordStrength === "Strong"
                            ? "bg-green-500 w-full"
                            : passwordStrength === "Moderate"
                            ? "bg-yellow-500 w-2/3"
                            : "bg-red-500 w-1/3"
                        }`}
                      ></div>
                    </div>
                    <span
                      className={`text-xs mt-1 ${
                        passwordStrength === "Strong"
                          ? "text-green-600"
                          : passwordStrength === "Moderate"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      Strength: {passwordStrength}
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col relative">
                <p className="font-[NeueMontreal-Medium] text-sm pb-1">
                  Confirm Password
                </p>
                <input
                  className={`${inputBaseClass} pr-10`}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  required
                  aria-label="Confirm Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[50%] text-gray-500 hover:text-black cursor-pointer"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>

                {confirmPassword && password !== confirmPassword && (
                  <span className="text-red-600 text-xs mt-1">
                    Passwords do not match.
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <p className="font-[NeueMontreal-Medium] text-sm pb-1">
                  {" "}
                  Role{" "}
                </p>
                <div className="relative">
                  <div
                    onClick={toggleDropDown}
                    className={`${dropdownTriggerClass} ${
                      selectedRole === "User / Barber"
                        ? "text-gray-500"
                        : "text-black"
                    }`}
                  >
                    {selectedRole}
                    <img
                      className={`w-[20px] sm:w-[25px] transition-transform duration-300 ${
                        isDropDownOpen ? "rotate-180" : "rotate-0"
                      }`}
                      src="/icons/dropdown.png"
                      alt="Drop Down Icon"
                    />
                  </div>
                  {isDropDownOpen && (
                    <div
                      className={`rounded-md border border-gray-200 bg-white p-2 absolute top-full mt-1 w-full shadow-lg transition-opacity duration-300 z-30 ${
                        isDropDownOpen
                          ? "opacity-100 visible"
                          : "opacity-0 invisible"
                      }`}
                    >
                      <div
                        onClick={() => selectRole("User")}
                        className="cursor-pointer hover:bg-gray-100 p-2 rounded-sm text-sm sm:text-base"
                      >
                        User
                      </div>
                      <div
                        onClick={() => selectRole("Barber")}
                        className="cursor-pointer hover:bg-gray-100 p-2 rounded-sm text-sm sm:text-base"
                      >
                        Barber
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`${
                  selectedRole === "Barber"
                    ? "flex flex-col gap-3 mt-2 border-t border-gray-200 pt-3"
                    : "hidden"
                }`}
              >
                <div className="flex flex-col">
                  <p className="font-[NeueMontreal-Medium] text-sm pb-1">
                    {" "}
                    Years of Experience{" "}
                  </p>
                  <input
                    className={inputSmallClass}
                    type="number"
                    placeholder="e.g., 3"
                    onChange={(e) => setExp(e.target.value)}
                    aria-label="Years of Experience"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="font-[NeueMontreal-Medium] text-sm pb-1">
                    {" "}
                    Barbershop Name{" "}
                    <span className="text-gray-500 text-xs">(Optional)</span>
                  </p>
                  <input
                    className={inputSmallClass}
                    type="text"
                    placeholder="Shop Name"
                    onChange={(e) => setBarbershopName(e.target.value)}
                    aria-label="Barbershop Name"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="font-[NeueMontreal-Medium] text-sm pb-1">
                    {" "}
                    Address{" "}
                  </p>
                  <input
                    className={inputSmallClass}
                    type="text"
                    placeholder="Street Address"
                    onChange={(e) => setAddress(e.target.value)}
                    aria-label="Address"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="font-[NeueMontreal-Medium] text-sm pb-1">
                    {" "}
                    City{" "}
                  </p>
                  <input
                    className={inputSmallClass}
                    type="text"
                    placeholder="City"
                    onChange={(e) => setCity(e.target.value)}
                    aria-label="City"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="font-[NeueMontreal-Medium] text-sm pb-1">
                    {" "}
                    State{" "}
                  </p>
                  <div className="relative">
                    <div
                      onClick={toggleDropDown3}
                      className={`${dropdownTriggerClass} ${
                        state === "State" ? "text-gray-500" : "text-black"
                      }`}
                    >
                      {state}
                      <img
                        className={`w-[20px] sm:w-[25px] transition-transform duration-300 ${
                          isDropDownOpen3 ? "rotate-180" : "rotate-0"
                        }`}
                        src="/icons/dropdown.png"
                        alt="Drop Down Icon"
                      />
                    </div>
                    {isDropDownOpen3 && (
                      <div
                        className={`rounded-md border border-gray-200 bg-white p-2 absolute top-full mt-1 w-full shadow-lg transition-opacity duration-300 z-30 max-h-60 overflow-y-auto ${
                          isDropDownOpen3
                            ? "opacity-100 visible"
                            : "opacity-0 invisible"
                        }`}
                      >
                        {states.map((stateItem) => (
                          <div
                            key={stateItem}
                            onClick={() => setStateMenu(stateItem)}
                            className="cursor-pointer hover:bg-gray-100 p-2 rounded-sm text-sm sm:text-base"
                          >
                            {stateItem}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="font-[NeueMontreal-Medium] text-sm pb-1">
                    {" "}
                    ZIP Code{" "}
                  </p>
                  <input
                    className={inputSmallClass}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="ZIP Code"
                    onChange={(e) => setZIP(e.target.value)}
                    aria-label="ZIP Code"
                  />
                </div>
              </div>

              <div className="flex flex-col mt-2 border-t border-gray-200 pt-3">
                <p className="font-[NeueMontreal-Medium] text-sm pb-1">
                  {" "}
                  Security{" "}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSecurityModalOpen(true)}
                    className={`${secondaryButtonClass} w-full`}
                  >
                    {securityQuestion !== "-please select-" && securityAnswer
                      ? "Change Security Question"
                      : "Set Security Question"}
                  </button>
                  {securityQuestion !== "-please select-" && securityAnswer && (
                    <span className="text-green-600 text-xl font-bold flex-shrink-0">
                      ✓
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col mt-4 sm:mt-6 text-center gap-2 pb-4">
                <button className={primaryButtonClass} onClick={handleSubmit}>
                  CREATE ACCOUNT
                </button>
                <p className="font-[NeueMontreal-Medium] text-xs sm:text-sm pt-1">
                  Already have an account?
                  <Link
                    className="text-[#1500FF] active:text-[#3F5CFF] hover:underline ml-1"
                    href={"./login"}
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-6/10">
        <img
          className="w-full h-full object-cover"
          src="/loginregister-img.webp"
          alt="Decorative background image showing barber tools or shop interior"
        />
      </div>

      {isSecurityModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="relative bg-white p-6 pt-10 sm:p-8 sm:pt-12 rounded-lg shadow-xl w-full max-w-md">
            <button
              onClick={() => setIsSecurityModalOpen(false)}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <img
                src="/icons/cross-small.png"
                alt="Close"
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
            </button>
            <h3 className="text-lg sm:text-xl font-[NeueMontreal-Bold] mb-4 text-center">
              Security Question & Answer
            </h3>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col">
                <p className="font-[NeueMontreal-Medium] text-sm pb-1">
                  {" "}
                  Security Question{" "}
                </p>
                <div className="relative">
                  <div
                    onClick={toggleDropDown2}
                    className={`${dropdownTriggerClass} ${
                      securityQuestion === "-please select-"
                        ? "text-gray-500"
                        : "text-black"
                    }`}
                  >
                    {securityQuestion}
                    <img
                      className={`w-[20px] sm:w-[25px] transition-transform duration-300 ${
                        isDropDownOpen2 ? "rotate-180" : "rotate-0"
                      }`}
                      src="/icons/dropdown.png"
                      alt="Drop Down Icon"
                    />
                  </div>
                  {isDropDownOpen2 && (
                    <div
                      className={`rounded-md border border-gray-200 bg-white p-2 absolute top-full mt-1 w-full shadow-lg transition-opacity duration-300 z-50 ${
                        isDropDownOpen2
                          ? "opacity-100 visible"
                          : "opacity-0 invisible"
                      }`}
                    >
                      <div
                        onClick={() =>
                          selectQuestion("Which city were you born in?")
                        }
                        className="cursor-pointer hover:bg-gray-100 p-2 rounded-sm text-sm sm:text-base"
                      >
                        Which city were you born in?
                      </div>
                      <div
                        onClick={() =>
                          selectQuestion(
                            "What is the name of your third grade teacher?"
                          )
                        }
                        className="cursor-pointer hover:bg-gray-100 p-2 rounded-sm text-sm sm:text-base"
                      >
                        What is the name of your third grade teacher?
                      </div>
                      <div
                        onClick={() =>
                          selectQuestion("What is your mother's maiden name?")
                        }
                        className="cursor-pointer hover:bg-gray-100 p-2 rounded-sm text-sm sm:text-base"
                      >
                        What is your mother&#39;s maiden name?
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <p className="font-[NeueMontreal-Medium] text-sm pb-1">
                  {" "}
                  Security Answer{" "}
                </p>
                <input
                  className={inputSmallClass}
                  type="text"
                  placeholder="Your Answer"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  required
                  aria-label="Security Answer"
                />
              </div>
              <button
                onClick={handleConfirmSecurity}
                className={`${primaryButtonClass} mt-2`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
