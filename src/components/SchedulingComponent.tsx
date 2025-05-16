import {
  acceptRequest,
  declineRequest,
  deleteRequest,
  editSchedule,
  getRequestsbyBarberName,
  getRequestsbyUsername,
  getScheduleByUsername,
} from "@/lib/api";
import { fetchInfo, getUserData } from "@/utils/DataServices";
import { IRequest, ISchedule } from "@/utils/Interfaces";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ILocation {
  shopName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

const SchedulingComponent = () => {
  const [schedule, setUserSchedule] = useState<ISchedule>();
  const [requests, setRequests] = useState<IRequest[]>();
  const [appointments, setAppointments] = useState<IRequest[]>();
  const [upcoming, setUpcoming] = useState<IRequest[]>();
  const [edit, setEdit] = useState<boolean>(false);
  const [newMondayTimes, setNewMondayTimes] = useState<string[]>([]);
  const [newTuesdayTimes, setNewTuesdayTimes] = useState<string[]>([]);
  const [newWednesdayTimes, setNewWednesdayTimes] = useState<string[]>([]);
  const [newThursdayTimes, setNewThursdayTimes] = useState<string[]>([]);
  const [newFridayTimes, setNewFridayTimes] = useState<string[]>([]);
  const [newSaturdayTimes, setNewSaturdayTimes] = useState<string[]>([]);
  const [newSundayTimes, setNewSundayTimes] = useState<string[]>([]);
  const [barberLocations, setBarberLocations] = useState<ILocation[]>([]);
  const [username] = useState<string>(fetchInfo().username);
  const [accountType] = useState<string>(fetchInfo().accountType);
  const router = useRouter();

  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = 6 + i;
    const suffix = hour >= 12 ? "pm" : "am";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}${suffix}`;
  });

  useEffect(() => {
    const fetchSchedule = async () => {
      // let data:ISchedule|IRequest[]|undefined

      if (accountType == "Barber") {
        const data = await getScheduleByUsername(username);
        setUserSchedule(data);
        const data2 = await getRequestsbyBarberName(username);
        setRequests(
          data2.filter(
            (request: IRequest) =>
              request.isAccepted == false && request.time !== "404"
          )
        );
        setAppointments(
          data2.filter(
            (request: IRequest) =>
              request.isAccepted == true && request.time !== "404"
          )
        );
        setUpcoming(
          data2.filter(
            (request: IRequest) =>
              request.isAccepted == true &&
              request.time !== "404" &&
              request.username == username
          )
        );
      } else {
        const data2 = await getRequestsbyUsername(username);
        setRequests(
          data2.filter((request: IRequest) => request.username == username)
        );
        setAppointments(
          data2.filter(
            (request: IRequest) =>
              request.isAccepted == true && request.time !== "404"
          )
        );
        setUpcoming(
          data2.filter(
            (request: IRequest) =>
              request.isAccepted == true &&
              request.time !== "404" &&
              request.username == username
          )
        );
        findLocation(data2);
      }
    };
    const findLocation = async (data: IRequest[]) => {
      const locations: ILocation[] = [];
      if (data.length != 0) {
        await Promise.all(
          data.map(async (request) => {
            const userData = await getUserData(request.barberName);
            locations.push({
              shopName: userData.shopName,
              address: userData.address,
              city: userData.city,
              state: userData.state,
              zip: userData.zip,
            });
          })
        );
        setBarberLocations(locations);
      }
    };

    fetchSchedule();
  }, [username,accountType]);

  const accept = async (id: number) => {
    await acceptRequest(id);
  };

  const deny = async (id: number) => {
    await declineRequest(id);
  };

  const complete = async (id: number) => {
    await deleteRequest(id);
  };

  const toggleMondayTime = (time: string) => {
    setNewMondayTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const toggleTuesdayTime = (time: string) => {
    setNewTuesdayTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const toggleWednesdayTime = (time: string) => {
    setNewWednesdayTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const toggleThursdayTime = (time: string) => {
    setNewThursdayTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const toggleFridayTime = (time: string) => {
    setNewFridayTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const toggleSaturdayTime = (time: string) => {
    setNewSaturdayTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const toggleSundayTime = (time: string) => {
    setNewSundayTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const saveSchedule = async () => {
    const payload: ISchedule = {
      id: 0,
      username: username,
      mondayTimes: newMondayTimes,
      tuesdayTimes: newTuesdayTimes,
      wednesdayTimes: newWednesdayTimes,
      thursdayTimes: newThursdayTimes,
      fridayTimes: newFridayTimes,
      saturdayTimes: newSaturdayTimes,
      sundayTimes: newSundayTimes,
    };
    setEdit(false);
    setUserSchedule(payload);
    await editSchedule(payload);
  };

  const gotoProfile = (username: string) => {
    const queryParams = new URLSearchParams({
      u: username,
    }).toString();
    router.push(`/user-profile?${queryParams}`);
  };

  // FindRequestsByUsername
  return (
    <div className="h-[85vh] overflow-y-scroll flex flex-col gap-2">
      {accountType == "Barber" &&
        (!schedule ? (
          <p>No schedule found...</p>
        ) : (
          <div className="flex flex-col gap-2">
            {!edit ? (
              <div className="flex flex-col gap-2">
                <p className="font-bold">My Schedule</p>
                {schedule.mondayTimes.length > 0 && (
                  <div>
                    <p>Monday</p>
                    <div className="flex gap-2">
                      {schedule.mondayTimes.map((time, index) => (
                        <div
                          key={index}
                          className="bg-gray-200 py-1 px-2 rounded text-sm"
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {schedule.tuesdayTimes.length > 0 && (
                  <div>
                    <p>Tuesday</p>
                    <div className="flex gap-2">
                      {schedule.tuesdayTimes.map((time, index) => (
                        <div
                          key={index}
                          className="bg-gray-200 py-1 px-2 rounded text-sm"
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {schedule.wednesdayTimes.length > 0 && (
                  <div>
                    <p>Wednesday</p>
                    <div className="flex gap-2">
                      {schedule.wednesdayTimes.map((time, index) => (
                        <div
                          key={index}
                          className="bg-gray-200 py-1 px-2 rounded text-sm"
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {schedule.thursdayTimes.length > 0 && (
                  <div>
                    <p>Thursday</p>
                    <div className="flex gap-2">
                      {schedule.thursdayTimes.map((time, index) => (
                        <div
                          key={index}
                          className="bg-gray-200 py-1 px-2 rounded text-sm"
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {schedule.fridayTimes.length > 0 && (
                  <div>
                    <p>Friday</p>
                    <div className="flex gap-2">
                      {schedule.fridayTimes.map((time, index) => (
                        <div
                          key={index}
                          className="bg-gray-200 py-1 px-2 rounded text-sm"
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {schedule.saturdayTimes.length > 0 && (
                  <div>
                    <p>Saturday</p>
                    <div className="flex gap-2">
                      {schedule.saturdayTimes.map((time, index) => (
                        <div
                          key={index}
                          className="bg-gray-200 py-1 px-2 rounded text-sm"
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {schedule.sundayTimes.length > 0 && (
                  <div>
                    <p>Sunday</p>
                    <div className="flex gap-2">
                      {schedule.sundayTimes.map((time, index) => (
                        <div
                          key={index}
                          className="bg-gray-200 py-1 px-2 rounded text-sm"
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex  flex-col gap-2">
                <div className="flex justify-between">
                  <p className="font-bold">
                    {" "}
                    {!schedule ? "Set Schedule" : "Edit Schedule"}
                  </p>
                  <p
                    className="text-slate-400 hover:text-black cursor-pointer p-2 text-2xl"
                    onClick={() => setEdit(false)}
                  >
                    X
                  </p>
                </div>

                <div className="flex flex-col">
                  <p>Monday</p>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-3 ">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => toggleMondayTime(time)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium border transition cursor-pointer hover:bg-black hover:text-white ${
                          newMondayTimes.includes(time)
                            ? "bg-black text-white animate-[bounce_1s_ease-in-out]"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <p>Tuesday</p>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-3 ">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => toggleTuesdayTime(time)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium border transition cursor-pointer hover:bg-black hover:text-white ${
                          newTuesdayTimes.includes(time)
                            ? "bg-black text-white animate-[bounce_1s_ease-in-out]"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <p>Wednesday</p>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-3 ">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => toggleWednesdayTime(time)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium border transition cursor-pointer hover:bg-black hover:text-white ${
                          newWednesdayTimes.includes(time)
                            ? "bg-black text-white animate-[bounce_1s_ease-in-out]"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <p>Thursday</p>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-3 ">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => toggleThursdayTime(time)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium border transition cursor-pointer hover:bg-black hover:text-white ${
                          newThursdayTimes.includes(time)
                            ? "bg-black text-white animate-[bounce_1s_ease-in-out]"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <p>Friday</p>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-3 ">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => toggleFridayTime(time)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium border transition cursor-pointer hover:bg-black hover:text-white ${
                          newFridayTimes.includes(time)
                            ? "bg-black text-white animate-[bounce_1s_ease-in-out]"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <p>Saturday</p>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-3 ">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => toggleSaturdayTime(time)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium border transition cursor-pointer hover:bg-black hover:text-white ${
                          newSaturdayTimes.includes(time)
                            ? "bg-black text-white animate-[bounce_1s_ease-in-out]"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <p>Sunday</p>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-3 ">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => toggleSundayTime(time)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium border transition cursor-pointer hover:bg-black hover:text-white ${
                          newSundayTimes.includes(time)
                            ? "bg-black text-white animate-[bounce_1s_ease-in-out]"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  className="bg-black w-fit text-white font-[NeueMontreal-Regular] p-2 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75 text-sm"
                  onClick={saveSchedule}
                >
                  Save Changes
                </button>
              </div>
            )}
            {accountType == "Barber" && (
              <button
                className="bg-black w-fit text-white font-[NeueMontreal-Regular] p-2 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75 text-sm"
                onClick={() => setEdit(true)}
              >
                {!schedule ? "Set Schedule" : "Edit Schedule"}
              </button>
            )}
          </div>
        ))}

      {upcoming?.length == 0 ? (
        <p>No upcoming appointments yet...</p>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="font-bold">My Upcoming Appointments</p>
          <div className="flex flex-col gap 1">
            {upcoming?.map((request, index) => (
              <div
                key={index}
                className="bg-gray-200 py-1 px-2 rounded text-sm"
              >
                <div className="flex justify-between">
                  <div>
                    <p
                      className="font-bold text-lg hover:text-slate-700 cursor-pointer"
                      onClick={() => gotoProfile(request.barberName)}
                    >
                      {request.barberName}
                    </p>
                    <p>{request.day}</p>
                    <p>{request.time}</p>
                  </div>
                  {barberLocations.length != 0 && (
                    <div className="text-right">
                      <p className="text-xs">location:</p>
                      <p>{barberLocations[index].shopName}</p>
                      <p>{barberLocations[index].address}</p>
                      <p>
                        {barberLocations[index].city},{" "}
                        {barberLocations[index].state}
                      </p>
                      <p>{barberLocations[index].zip}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {requests?.length == 0 ? (
        <p>No requests yet...</p>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="font-bold">My Requests</p>
          <div className="flex flex-col gap 1">
            {accountType == "Barber"
              ? requests?.map((request, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 py-1 px-2 rounded text-sm"
                  >
                    <p
                      className="font-bold text-lg cursor-pointer hover:text-slate-700"
                      onClick={() => gotoProfile(request.username)}
                    >
                      {request.username}
                    </p>
                    <p>{request.day}</p>
                    <p>{request.time}</p>
                    <div className="flex justify-around gap-2">
                      <button
                        className="bg-black w-fit text-white font-[NeueMontreal-Regular] p-2 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75 text-sm"
                        onClick={() => accept(request.id)}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-black w-fit text-white font-[NeueMontreal-Regular] p-2 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75 text-sm"
                        onClick={() => deny(request.id)}
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                ))
              : requests?.map(
                  (request, index) =>
                    // .filter((request) => request.isAccepted == false && request.time !== "404")

                    (request.isAccepted == false && request.time !== "404" && (
                      <div
                        key={index}
                        className="bg-gray-200 py-1 px-2 rounded text-sm"
                      >
                        <p className="text-sm">appointment with:</p>
                        <p
                          className="font-bold text-lg cursor-pointer hover:text-slate-700"
                          onClick={() => gotoProfile(request.barberName)}
                        >
                          {request.barberName}
                        </p>
                        <p className="text-sm">day:</p>
                        <p className="font-bold">{request.day}</p>
                        <p className="text-sm">time:</p>
                        <p className="font-bold">{request.time}</p>
                        <div className="flex justify-center gap-2 animate-bounce">
                          <p>waiting on approval...</p>
                        </div>
                      </div>
                    )) ||
                    (request.time == "404" && (
                      <div
                        key={index}
                        className="bg-red-200 py-1 px-2 rounded text-sm"
                      >
                        <p className="text-sm">appointment with:</p>
                        <p
                          className="font-bold text-lg cursor-pointer hover:text-slate-700"
                          onClick={() => gotoProfile(request.barberName)}
                        >
                          {request.barberName}
                        </p>
                        <p className="text-sm">day:</p>
                        <p className="font-bold">{request.day}</p>
                        <p className="text-sm">time:</p>
                        <p className="font-bold">{request.time}</p>
                        <div className="flex flex-col justify-center gap-2 animate-bounce">
                          <p>has been declined</p>
                          <button
                            className="bg-black w-fit text-white font-[NeueMontreal-Regular] p-2 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75 text-sm"
                            onClick={() => complete(request.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                )}
          </div>
        </div>
      )}

      {accountType == "Barber" &&
        (appointments?.length == 0 ? (
          <p>No scheduled appointments yet...</p>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="font-bold">My Scheduled Appointments</p>
            <div className="flex flex-col gap 1">
              {appointments?.map((request, index) => (
                <div
                  key={index}
                  className="bg-gray-200 py-1 px-2 rounded text-sm"
                >
                  <p
                    className="font-bold text-lg cursor-pointer hover:text-slate-700"
                    onClick={() => gotoProfile(request.username)}
                  >
                    {request.username}
                  </p>
                  <p>{request.day}</p>
                  <p>{request.time}</p>
                  <div className="flex justify-around gap-2">
                    <button
                      className="bg-black w-fit text-white font-[NeueMontreal-Regular] p-2 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75 text-sm"
                      onClick={() => complete(request.id)}
                    >
                      Mark as Complete
                    </button>
                    {/* <button
                    className="bg-black w-fit text-white font-[NeueMontreal-Regular] p-2 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75 text-sm"
                    onClick={() => deny(request.id)}
                  >
                    Cancel
                  </button> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default SchedulingComponent;
