export interface IUserProfileInfo {
  id: number;
  username: string;
  salt: string;
  hash: string;
  date: string;
  accountType: string;
  name: string;
  rating: number;
  ratingCount: string[];
  followers: string[];
  following: string[];
  likes: string[];
  securityQuestion: string;
  securityAnswer: string;
  bio: string;
  email: string;
  shopName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  pfp: string;
  isDeleted: boolean;
}

export interface IPostItems {
  id: number;
  userId: number;
  publisherName: string;
  date: string;
  caption: string;
  image: string | null;
  likes: number[];
  category: string;
  isPublished: boolean;
  isDeleted: boolean;
  comments: string[] | null;
}

export interface ICommentInfo {
  id: number;
  postId: number;
  username: string;
  comment: string;
}

export interface IUserInfo {
  username: string;
  password: string;
}

export interface INewUser {
  id: number;
  username: string;
  password: string;
  accountType: string;
  date: string;
  name: string;
  rating: number;
  ratingCount: string[];
  followers: string[];
  following: string[];
  likes: number[];
  securityQuestion: string;
  securityAnswer: string;
  bio: string;
  email: string;
  shopName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  pfp: string;
  isDeleted: boolean;
}

export interface IUserData {
  id: number;
  username: string;
}

export interface IToken {
  token: string;
}

export interface IHaircutInterface {
  id: number;
  name: string;
  description: string;
  photo1: string;
  photo2: string;
  video: { src: string };
  howTo: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
  };
}

export interface ISchedule {
  id: number;
  username: string;
  mondayTimes: string[];
  tuesdayTimes: string[];
  wednesdayTimes: string[];
  thursdayTimes: string[];
  fridayTimes: string[];
  saturdayTimes: string[];
  sundayTimes: string[];
}

export interface IRequest {
  id: number;
  username: string;
  barberName: string;
  day: string;
  time: string;
  isAccepted: boolean;
}

export interface IRatingInterface {
  rating: number;
  username: string;
  userToRate: string;
}
