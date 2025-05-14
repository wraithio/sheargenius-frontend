import { IRequest, ISchedule } from "@/utils/Interfaces";

const BASE_URL =
  "https://sheargenius-awakhjcph2deb6b9.westus-01.azurewebsites.net/";

export const setSchedule = async (schedule: ISchedule) => {
  console.log(schedule);
  const res = await fetch(`${BASE_URL}Schedule/SetSchedule`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(schedule),
  });
  if (!res.ok) {
    const data = await res.json();
    const message = data.message;
    console.log(message);
    return data.success;
  }

  const data = await res.json();
  return data;
};

export const getScheduleByUsername = async (username: string) => {
  const res = await fetch(
    `${BASE_URL}Schedule/GetSheduleByUsername/${username}`
  );
  if (!res.ok) {
    const data = await res.json();
    const message = data.message;
    console.log(message);
    return data.success;
  }
  const data = await res.json();
  return data;
};

export const getRequestsbyBarberName = async (username: string) => {
  const res = await fetch(
    `${BASE_URL}Schedule/FindRequestsByBarberName/${username}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) {
    const data = await res.json();
    const message = data.message;
    console.log(message);
    return data.success;
  }
  const data = await res.json();
  return data;
};

export const FilterScheduleByRequest = async (username: string) => {
  const res = await fetch(
    `${BASE_URL}Schedule/FilterScheduleByRequest/${username}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) {
    const data = await res.json();
    const message = data.message;
    console.log(message);
    return data.success;
  }
  const data = await res.json();
  return data;
};


export const acceptRequest = async (id: number) => {
  const res = await fetch(
    `${BASE_URL}Schedule/AcceptRequest/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) {
    const data = await res.json();
    const message = data.message;
    console.log(message);
    return data.success;
  }
  const data = await res.json();
  return data;
};

export const declineRequest = async (id: number) => {
  const res = await fetch(
    `${BASE_URL}Schedule/DeclineRequest/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) {
    const data = await res.json();
    const message = data.message;
    console.log(message);
    return data.success;
  }
  const data = await res.json();
  return data;
};

export const deleteRequest = async (id: number) => {
  const res = await fetch(
    `${BASE_URL}Schedule/DeleteRequest/${id}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) {
    const data = await res.json();
    const message = data.message;
    console.log(message);
    return data.success;
  }
  const data = await res.json();
  return data;
};

export const sendRequest = async (request: IRequest) => {
  const res = await fetch(
    `${BASE_URL}Schedule/SendRequest`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    }
  );
  if (!res.ok) {
    const data = await res.json();
    const message = data.message;
    console.log(message);
    return data.success;
  }
  const data = await res.json();
  return data;
};
