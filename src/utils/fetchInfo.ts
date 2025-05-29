import { getLoggedInUserData, loggedInData } from "@/utils/DataServices";

export const fetchInfo = async () => {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("Token");
  const existingInfo = sessionStorage.getItem("AccountInfo");

  // If sessionStorage already has it, no need to re-fetch
  if (existingInfo || !token) return;

  try {
    // You need to persist username to reuse it — optionally store it during login
    const storedUser = localStorage.getItem("Username");
    if (!storedUser) {
      throw new Error("No username found to fetch user data");
    }

    // Re-fetch and store account info in sessionStorage
    await getLoggedInUserData(storedUser);
    const accountInfo = loggedInData();

    if (accountInfo) {
      sessionStorage.setItem("AccountInfo", JSON.stringify(accountInfo));
    }
  } catch (err) {
    console.error("Failed to fetch account info:", err);
    localStorage.removeItem("Token");
    localStorage.removeItem("Username");
  }
};
