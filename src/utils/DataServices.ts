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
const blobURL = "https://aaronsblob123.blob.core.windows.net/aaronsblob"

let userData: IUserProfileInfo;
let profileData: INewUser;

export const createAccount = async (user: INewUser) => {
  const res = await fetch(`${url}User/CreateUser`, {
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
    return data.success;
  }

  const data = await res.json();
  return data.success;
};

export const editAccount = async (newUser: IUserProfileInfo) => {
  const res = await fetch(`${url}User/EditAccount`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  });

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

export const getLoggedInUserData = async (username: string) => {
  const res = await fetch(`${url}User/GetUserInfoByUsername/${username}`);
  if (!res.ok) {
    const data = await res.json();
    const message = data.message;
    console.log(message);
    return null;
  }
  userData = await res.json();
  return userData;
};

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
    return profileData;
  } catch (error) {
    console.error("Error fetching profile user data:", error as Error);
    return null;
  }
};

export const getUserData = async (username: string) => {
  const res = await fetch(
    `${url}User/GetUserInfoByUsername/${username.toLowerCase()}`
  );
  userData = await res.json();
  return userData;
};

export const loggedInData = () => {
  return userData;
};

export const fetchInfo = () => {
  if (typeof window !== "undefined" && sessionStorage.getItem("AccountInfo")) {
    return JSON.parse(sessionStorage.getItem("AccountInfo") || "{}");
  }
  return {};
};

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

export const getAllPosts = async () => {
  const res = await fetch(`${url}Post/GetAllPosts`);
  if (!res.ok) {
    const errorData = await res.json();
    const message = errorData.message;
    console.log(message);
    return [];
  }
  const data = await res.json();
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
      body: params,
  });

  if (response.ok) {
      const fileName = params.get('fileName') as string;
      const uploadedFileUrl = `${blobURL}/${fileName}`;
      return uploadedFileUrl;
  } else {
      console.log('Failed to upload file.');
      return null;
  }
};

export const chatBot = async(prompt:string) =>{
  try{
  const response: Response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${APIKEY}`,
    "HTTP-Referer": "https://sheargenius.vercel.app/",
    "X-Title": "ShearGenius",
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

export const deleteAccount = async (username: string) => {
  try {
    const token = getToken();
    if (!token) {
      return false;
    }

    const res = await fetch(`${url}User/DeleteUser/${username}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

