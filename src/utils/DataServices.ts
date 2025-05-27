import {
  ICommentInfo,
  IHaircutInterface,
  INewUser,
  IPostItems,
  IRatingInterface,
  IUserInfo,
  IUserProfileInfo,
} from "./Interfaces";

const APIKEY = process.env.NEXT_PUBLIC_API_KEY

const url = "https://sheargenius-awakhjcph2deb6b9.westus-01.azurewebsites.net/";
// this variable will be used in our getPost by user id fetch when we set them up
const blobURL = "https://aaronsblob123.blob.core.windows.net/aaronsblob"

let userData: IUserProfileInfo;
let profileData: INewUser;

// Create account fetch
export const createAccount = async (user: INewUser) => {
  const res = await fetch(`${url}User/CreateUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  // if our response is not ok, we will run this block
  if (!res.ok) {
    const data = await res.json();
    const message = data.message;
    console.log(message);
    return data.success;
  }

  const data = await res.json();
  return data.success;
};

// Edit account fetch
export const editAccount = async (newUser: IUserProfileInfo) => {
  const res = await fetch(`${url}User/EditAccount`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  });
  // if our response is not ok, we will run this block
  if (!res.ok) {
    const data = await res.json();
    const message = data.message;
    console.log(message);
    return data.success;
  }

  const data = await res.json();
  return data.success;
};

export const addCommentToPost = async (comment:ICommentInfo) => {
  const res = await fetch(`${url}Post/AddComment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  });
  // if our response is not ok, we will run this block
  if (!res.ok) {
    const data = await res.json();
    const message = data.message;
    console.log(message);
    return data.success;
  }

  const data = await res.json();
  return data.success;
};

export const addRating = async (rating:IRatingInterface) => {
  const res = await fetch(`${url}/User/AddRating`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rating),
  });
  // if our response is not ok, we will run this block
  if (!res.ok) {
    const data = await res.json();
    const message = data.message;
    console.log(message);
    return data.success;
  }

  const data = await res.json();
  return data.success;
};

export const getCommentsbyId = async (id: number) => {
  const res = await fetch(`${url}Post/GetCommentsByPostId?id=${id}`);
  if (!res.ok) {
    const data = await res.json();
    const message = data.message;
    console.log(message);
    return null;
  }
  const data = await res.json();
  return data;
};

//Login fetch
export const login = async (user: IUserInfo) => {
  const res = await fetch(`${url}User/Login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const data = await res.json();
    const message = data.message;
    console.log(message);
    return null;
  }

  const data = await res.json();
  return data;
};
//get Logged in data fetch
export const getLoggedInUserData = async (username: string) => {
  const res = await fetch(`${url}User/GetUserInfoByUsername/${username}`);
  if (!res.ok) {
    const data = await res.json();
    const message = data.message;
    console.log(message);
    return null;
  }
  userData = await res.json();
  //we are going to use this data inside of a variable we will make a separate function for implementation
  return userData;
};

//get Profile Info in data fetch
export const getProfileUserData = async (username: string) => {
  try {
    const res = await fetch(
      `${url}User/GetProfileInfoByUsername/${username.toLowerCase()}`
    );

    if (!res.ok) {
      const data = await res.json();
      const message = data.message;
      console.error(message);
      return null;
    }
    profileData = await res.json();
    // console.log(profileData)
    //we are going to use this data inside of a variable we will make a separate function for implementation
    return profileData;
  } catch (error) {
    console.error("Error fetching profile user data:", error as Error); // Handle network errors
    return null;
  }
};

export const getUserData = async (username: string) => {
  const res = await fetch(
    `${url}User/GetUserInfoByUsername/${username.toLowerCase()}`
  );
  userData = await res.json();
  // console.log(profileData)
  //we are going to use this data inside of a variable we will make a separate function for implementation
  return userData;
};

//get the user's data
export const loggedInData = () => {
  return userData;
};

export const fetchInfo = () => {
  if (typeof window !== "undefined" && sessionStorage.getItem("AccountInfo")) {
    return JSON.parse(sessionStorage.getItem("AccountInfo") || "{}");
  }
  return {};
};

//we are checking if the token is in our storage (see if were logged in)
export const checkToken = () => {
  let result = false;

  if (typeof window !== "undefined") {
    const LSData = sessionStorage.getItem("AccountInfo");
    if (LSData != null) result = true;
  }
  return result;
};

export const getToken = () => {
  return localStorage.getItem("Token") ?? "";
};

//format the days date when creating new User
export function getFormattedDate(): string {
  const today = new Date();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = months[today.getMonth()];
  const day = today.getDate();
  const year = today.getFullYear();

  return `${month} ${day}, ${year}`;
}

// --------------POST ENDPOINTS----------------

export const getAllPosts = async () => {
  const res = await fetch(`${url}Post/GetAllPosts`);
  if (!res.ok) {
    const errorData = await res.json();
    const message = errorData.message;
    console.log(message);
    return [];
  }
  const data = await res.json();
  // console.log(data)
  return data;
};

export const getUserPosts = async (id: number) => {
  const res = await fetch(`${url}Post/GetPostsByUserId/${id}`);
  if (!res.ok) {
    const errorData = await res.json();
    const message = errorData.message;
    console.log(message);
    return [];
  }
  const data = await res.json();
  // console.log(data)
  return data;
};

export const getAllBarbers = async () => {
  const res = await fetch(`${url}User/GetAllBarbers`)
  if (!res.ok) {
    const errorData = await res.json();
    const message = errorData.message;
    console.log(message);
    return [];
  }
  const data = await res.json();
  return data;
};

export const getPostItemsByUserId = async (userId: number) => {
  const res = await fetch(`${url}Post/GetPostsByUserId/${userId}`)
  if (!res.ok) {
    const errorData = await res.json();
    const message = errorData.message;
    console.log(message);
    return [];
  }

  const data = await res.json();
  return data;
};

export const getPostbyPostId = async (postId: number) => {
  const res = await fetch(`${url}Post/GetPostByPostId/${postId}`)
  if (!res.ok) {
    const errorData = await res.json();
    const message = errorData.message;
    console.log(message);
    return null;
  }

  const data = await res.json();
  return data;
};

export const getPostItemsByCategory = async (category: string) => {
  const res = await fetch(`${url}Post/GetPostsbyCategory/${category}`)
  if (!res.ok) {
    const errorData = await res.json();
    const message = errorData.message;
    console.log(message);
    return [];
  }

  const data = await res.json();
  return data;
};

export const addPostItem = async (post: IPostItems, token: string) => {
  const res = await fetch(`${url}Post/AddPost`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(post),
  });
  if (!res.ok) {
    const errorData = await res.json();
    const message = errorData.message;
    console.log(message);
    return false;
  }
  const data = await res.json();
  //returns true and successfully added post to backend
  return data.success;
};

export const updatePostItem = async (post: IPostItems, token: string) => {
  const res = await fetch(`${url}Post/EditPost`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(post),
  });
  if (!res.ok) {
    const errorData = await res.json();
    const message = errorData.message;
    console.log(message);
    return false;
  }
  const data = await res.json();
  //returns true and successfully added post to backend
  return data.success;
};

export const toggleFollowers = async (userFollowing: string, userFollowed: string, token: string) => {
  const res = await fetch(`${url}User/ToggleFollowers?followingUser=${userFollowing}&followedUser=${userFollowed}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ userFollowing, userFollowed }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    const message = errorData.message;
    console.log(message);
    return false;
  }
  const data = await res.json();
  //returns true and successfully added post to backend
  return data.success;
};

export const toggleLikes = async (postId: number, username: string, token: string) => {
  const res = await fetch(`${url}Post/ToggleLikes?postId=${postId}&username=${username}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ postId, username }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    const message = errorData.message;
    console.log(message);
    return false;
  }
  const data = await res.json();
  //returns true and successfully added post to backend
  return data.success;
};

export const fetchHaircut = async (cut: string) => {
  const response = await fetch("/Haircuts.json");
  const data = await response.json();

  const foundHaircut: IHaircutInterface = data.haircuts.find(
    (h: IHaircutInterface) => h.name.toLowerCase() === cut.toLowerCase()
  );
  return foundHaircut;
};

let category: string;
export const setCategory = (cat: string) => {
  category = cat;
  localStorage.setItem("searchQuery", category);
  return category;
};
export const getCategory = () => {
  return localStorage.getItem("searchQuery") as string;
};

export const blobUpload = async (params: FormData)=> {
  const response = await fetch(url + 'Blob/Upload', {
      method: 'POST',
      // The browser automatically sets the correct Content-Type header to multipart/form-data
      body: params, //becuase params is FormData we do NOT need to stringify it
  });

  if (response.ok) {
      // Extract the filename from FormData
      const fileName = params.get('fileName') as string;
      
      // Construct the Blob Storage URL
      const uploadedFileUrl = `${blobURL}/${fileName}`;
      
      return uploadedFileUrl;
  } else {
      console.log('Failed to upload file.');
      return null;
  }
};

// AI fetch

export const chatBot = async(prompt:string) =>{
  try{
  const response: Response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${APIKEY}`,
    "HTTP-Referer": "https://sheargenius.vercel.app/", // Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "ShearGenius", // Optional. Site title for rankings on openrouter.ai.
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": "deepseek/deepseek-r1:free",
    "messages": [
      {
        role: "user",
        content: prompt
      }
    ]
  })
});
  const data = await response.json();
  console.log(data)
  return data.choices?.[0]?.message.content;
} catch (error) {
  console.error("Error in chatBot function:", error);
  return "Error in chatBot function:"+ error;
}
};

// ===================================
export const getPostsByLocation = async (location: string, token: string) => {
  const res = await fetch(`${url}Post/GetPostsByLocation/${location}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    const message = errorData.message;
    console.error(message);
    return [];
  }

  const data = await res.json();
  return data;
}

export const findLikesByUsername = async (username:string) => {
  const res = await fetch(`${url}Post/FindLikesByUsername/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    const message = errorData.message;
    console.error(message);
    return [];
  }
  const data = await res.json();
  return data;
};

