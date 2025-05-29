import {
  acceptRequest,
  declineRequest,
  deleteRequest,
  editSchedule,
  getRequestsbyBarberName,
  getRequestsbyUsername,
  getScheduleByUsername,
  setSchedule,
} from "@/lib/api";
import { fetchInfo, getUserData } from "@/utils/DataServices";
import { IRequest, ISchedule } from "@/utils/Interfaces";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { Calendar, Clock, X, Check, AlertCircle, CalendarClock, CalendarDays, CalendarRange, UserRoundCheck, SquarePen, MapPin } from "lucide-react";

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
  const [username] = useState<string>(fetchInfo().username || "");
  const [accountType] = useState<string>(fetchInfo().accountType || "");
  const router = useRouter();

  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = 6 + i;
    const suffix = hour >= 12 ? "pm" : "am";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}${suffix}`;
  });

  const formatDayTimeRange = (times: string[]) => {
    if (times.length === 0) return [];
    
    const sortedTimes = [...times].sort((a, b) => {
      const aHour = parseInt(a.replace(/[ap]m/, ''));
      const bHour = parseInt(b.replace(/[ap]m/, ''));
      const aIsPM = a.includes('pm');
      const bIsPM = b.includes('pm');
      
      if (aIsPM && !bIsPM) return 1;
      if (!aIsPM && bIsPM) return -1;
      
      if (aHour === 12) return -1;
      if (bHour === 12) return 1;
      
      return aHour - bHour;
    });

    if (times.length === timeSlots.length) {
      return [`6am - 9pm`];
    }

    const ranges: string[] = [];
    let rangeStart = sortedTimes[0];
    let prevHour = parseInt(sortedTimes[0].replace(/[ap]m/, ''));
    let prevSuffix = sortedTimes[0].includes('pm') ? 'pm' : 'am';

    const addRange = (start: string, end: string) => {
      const startHour = parseInt(start.replace(/[ap]m/, ''));
      const endHour = parseInt(end.replace(/[ap]m/, ''));
      const startSuffix = start.includes('pm') ? 'pm' : 'am';
      const endSuffix = end.includes('pm') ? 'pm' : 'am';

      if (startHour === endHour && startSuffix === endSuffix) {
        ranges.push(start);
        return;
      }

      let endTime;
      if (endHour === 11) {
        endTime = `12${endSuffix === 'am' ? 'pm' : 'am'}`;
      } else if (endHour === 12) {
        endTime = `1${endSuffix}`;
      } else if (endHour === 8 && endSuffix === 'pm') {
        endTime = '9pm';
      } else {
        endTime = `${endHour + 1}${endSuffix}`;
      }

      ranges.push(`${start} - ${endTime}`);
    };

    for (let i = 1; i < sortedTimes.length; i++) {
      const currentTime = sortedTimes[i];
      const currentHour = parseInt(currentTime.replace(/[ap]m/, ''));
      const currentSuffix = currentTime.includes('pm') ? 'pm' : 'am';
      
      const isConsecutive = (
        (prevHour === 11 && currentHour === 12) ||
        (prevHour === 12 && currentHour === 1) ||
        (currentHour === prevHour + 1 && currentSuffix === prevSuffix)
      );
      
      if (!isConsecutive) {
        addRange(rangeStart, sortedTimes[i - 1]);
        rangeStart = currentTime;
      }
      
      if (i === sortedTimes.length - 1) {
        addRange(rangeStart, currentTime);
      }
      
      prevHour = currentHour;
      prevSuffix = currentSuffix;
    }

    if (sortedTimes.length === 1) {
      addRange(sortedTimes[0], sortedTimes[0]);
    }
    
    return ranges;
  };

  const fetchSchedule = async () => {
    if (accountType == "Barber") {
      const data = await getScheduleByUsername(username);
      if (data != undefined) setUserSchedule(data);
      const data2 = await getRequestsbyBarberName(username);
      if (data2 != undefined)
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

  useEffect(() => {
    fetchSchedule();
  }, [username, accountType]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[id^="dropdown-"]') && !target.closest('button')) {
        document.querySelectorAll('[id^="dropdown-"]').forEach(el => el.classList.add('hidden'));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const accept = async (id: number) => {
    await acceptRequest(id);
    fetchSchedule();
  };

  const deny = async (id: number) => {
    await declineRequest(id);
    fetchSchedule();
  };

  const complete = async (id: number) => {
    await deleteRequest(id);
    fetchSchedule();
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
    if (schedule) await editSchedule(payload);
    else await setSchedule(payload);
  };

  const gotoProfile = (username: string) => {
    window.dispatchEvent(new Event('closeNavbar'));
    
    const queryParams = new URLSearchParams({
      u: username,
    }).toString();
    router.push(`/user-profile?${queryParams}`);
  };

  return (
    <div className="h-[85vh] overflow-y-auto flex flex-col gap-6 px-2">
      {accountType == "Barber" &&
        (schedule == undefined && !edit ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <CalendarRange className="w-12 h-12 mb-4" />
            <p className="font-[NeueMontreal-Medium] text-lg">No schedule found</p>
            <p className="text-sm text-gray-400">Set up your availability to start accepting appointments</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {!edit && schedule && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <h2 className="font-[NeueMontreal-Medium] text-xl">My Schedule</h2>
                  </div>
                  <button
                    onClick={() => setEdit(true)}
                    className="group relative w-10 h-10 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 active:transform active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
                  >
                    <SquarePen className="w-5 h-5" />
                    <span className="absolute -bottom-8 right-0 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Edit Schedule
                    </span>
                  </button>
                </div>

                <div className="space-y-6">
                  {[
                    { day: "Monday", times: schedule.mondayTimes },
                    { day: "Tuesday", times: schedule.tuesdayTimes },
                    { day: "Wednesday", times: schedule.wednesdayTimes },
                    { day: "Thursday", times: schedule.thursdayTimes },
                    { day: "Friday", times: schedule.fridayTimes },
                    { day: "Saturday", times: schedule.saturdayTimes },
                    { day: "Sunday", times: schedule.sundayTimes },
                  ].map(({ day, times }) => times.length > 0 && (
                    <div key={day} className="space-y-2">
                      <h3 className="font-[NeueMontreal-Medium] text-gray-700">{day}</h3>
                      <div className="bg-gray-100 rounded-xl p-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                          {formatDayTimeRange(times).map((range, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 bg-white shadow-sm rounded-lg text-sm font-[NeueMontreal-Medium] text-gray-700"
                            >
                              {range}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

      {edit && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-gray-600" />
              <h2 className="font-[NeueMontreal-Medium] text-xl">
                {!schedule ? "Set Schedule" : "Edit Schedule"}
              </h2>
            </div>
            <button
              onClick={() => setEdit(false)}
              className="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 active:transform active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {[
              { day: "Monday", times: newMondayTimes, toggle: toggleMondayTime },
              { day: "Tuesday", times: newTuesdayTimes, toggle: toggleTuesdayTime },
              { day: "Wednesday", times: newWednesdayTimes, toggle: toggleWednesdayTime },
              { day: "Thursday", times: newThursdayTimes, toggle: toggleThursdayTime },
              { day: "Friday", times: newFridayTimes, toggle: toggleFridayTime },
              { day: "Saturday", times: newSaturdayTimes, toggle: toggleSaturdayTime },
              { day: "Sunday", times: newSundayTimes, toggle: toggleSundayTime },
            ].map(({ day, times, toggle }) => (
              <div key={day} className="space-y-3">
                <h3 className="font-[NeueMontreal-Medium] text-gray-700">{day}</h3>
                <div className="relative">
                  <button
                    onClick={() => {
                      const dropdownId = `dropdown-${day}`;
                      const currentState = document.getElementById(dropdownId)?.classList.contains('hidden');
                      document.querySelectorAll('[id^="dropdown-"]').forEach(el => el.classList.add('hidden'));
                      if (currentState) {
                        document.getElementById(dropdownId)?.classList.remove('hidden');
                      }
                    }}
                    type="button"
                    className="w-full bg-white border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-shadow text-sm font-[NeueMontreal-Medium] cursor-pointer pr-10 text-left relative"
                  >
                    {times.length === 0 ? (
                      <span className="text-gray-500">Not Available</span>
                    ) : times.length === timeSlots.length ? (
                      <span className="text-gray-700">All Times</span>
                    ) : (
                      <span className="text-gray-700">
                        {times.length} time{times.length !== 1 ? 's' : ''} selected
                      </span>
                    )}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </button>
                  <div
                    id={`dropdown-${day}`}
                    className="hidden absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => {
                          const setter = day === "Monday" ? setNewMondayTimes :
                                       day === "Tuesday" ? setNewTuesdayTimes :
                                       day === "Wednesday" ? setNewWednesdayTimes :
                                       day === "Thursday" ? setNewThursdayTimes :
                                       day === "Friday" ? setNewFridayTimes :
                                       day === "Saturday" ? setNewSaturdayTimes :
                                       setNewSundayTimes;
                          setter([]);
                          document.getElementById(`dropdown-${day}`)?.classList.add('hidden');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-[NeueMontreal-Medium] text-gray-700"
                      >
                        Not Available
                      </button>
                      <button
                        onClick={() => {
                          const setter = day === "Monday" ? setNewMondayTimes :
                                       day === "Tuesday" ? setNewTuesdayTimes :
                                       day === "Wednesday" ? setNewWednesdayTimes :
                                       day === "Thursday" ? setNewThursdayTimes :
                                       day === "Friday" ? setNewFridayTimes :
                                       day === "Saturday" ? setNewSaturdayTimes :
                                       setNewSundayTimes;
                          setter([...timeSlots]);
                          document.getElementById(`dropdown-${day}`)?.classList.add('hidden');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-[NeueMontreal-Medium] text-gray-700"
                      >
                        All Times
                      </button>
                      <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center px-3">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                      </div>
                      {timeSlots.map((time) => (
                        <label
                          key={time}
                          className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={times.includes(time)}
                            onChange={() => toggle(time)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm font-[NeueMontreal-Medium] text-gray-700">
                            {time}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <button
              className="w-full bg-black text-white font-[NeueMontreal-Medium] py-3 rounded-xl hover:bg-gray-800 active:transform active:scale-[0.98] transition-all duration-200"
              onClick={saveSchedule}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {accountType == "Barber" &&
        (appointments?.length == 0 || appointments == undefined ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <CalendarClock className="w-12 h-12 mb-4" />
            <p className="font-[NeueMontreal-Medium] text-lg">No scheduled appointments</p>
            <p className="text-sm text-gray-400">Your upcoming appointments will appear here</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <CalendarDays className="w-5 h-5 text-gray-600" />
              <h2 className="font-[NeueMontreal-Medium] text-xl">Scheduled Appointments</h2>
            </div>
            <div className="space-y-4">
              {appointments?.map((request, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <button
                        onClick={() => gotoProfile(request.username)}
                        className="text-lg font-[NeueMontreal-Medium] text-blue-600 hover:text-blue-700 active:text-blue-800 cursor-pointer transition-colors"
                      >
                        {request.username}
                      </button>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{request.day}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{request.time}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="w-10 h-10 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 active:transform active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
                      onClick={() => complete(request.id)}
                      title="Complete Appointment"
                    >
                      <UserRoundCheck className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      {upcoming?.length == 0 || upcoming == undefined ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <CalendarClock className="w-12 h-12 mb-4" />
          <p className="font-[NeueMontreal-Medium] text-lg">No upcoming appointments</p>
          <p className="text-sm text-gray-400">Your future appointments will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <CalendarDays className="w-5 h-5 text-gray-600" />
            <h2 className="font-[NeueMontreal-Medium] text-xl">Upcoming Appointments</h2>
          </div>
          <div className="space-y-4">
            {upcoming?.map((request, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex flex-col gap-4">
                  <div>
                    <button
                      onClick={() => gotoProfile(request.barberName)}
                      className="text-lg font-[NeueMontreal-Medium] text-blue-600 hover:text-blue-700 active:text-blue-800 cursor-pointer transition-colors"
                    >
                      {request.barberName}
                    </button>
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{request.day}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{request.time}</span>
                      </div>
                    </div>
                  </div>
                  {barberLocations.length != 0 && (
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                      <div className="space-y-1.5">
                        <p className="text-sm text-gray-500 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          Location
                        </p>
                        <p className="font-[NeueMontreal-Medium] text-gray-900">
                          {barberLocations[index].shopName}
                        </p>
                        <div className="text-sm text-gray-600 space-y-0.5">
                          <p>{barberLocations[index].address}</p>
                          <p>
                            {barberLocations[index].city}, {barberLocations[index].state} {barberLocations[index].zip}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {requests?.length == 0 || requests == undefined ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <CalendarClock className="w-12 h-12 mb-4" />
          <p className="font-[NeueMontreal-Medium] text-lg">No pending requests</p>
          <p className="text-sm text-gray-400">New appointment requests will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <CalendarRange className="w-5 h-5 text-gray-600" />
            <h2 className="font-[NeueMontreal-Medium] text-xl">Pending Requests</h2>
          </div>
          <div className="space-y-4">
            {accountType == "Barber"
              ? requests?.map((request, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                  >
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <button
                          onClick={() => gotoProfile(request.username)}
                          className="text-lg font-[NeueMontreal-Medium] text-blue-600 hover:text-blue-700 active:text-blue-800 cursor-pointer transition-colors"
                        >
                          {request.username}
                        </button>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{request.day}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{request.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="w-10 h-10 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 active:transform active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
                          onClick={() => accept(request.id)}
                          title="Accept"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          className="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 active:transform active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
                          onClick={() => deny(request.id)}
                          title="Decline"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              : requests
                  ?.filter((request) => request.isAccepted == false && request.time !== "404")
                  .map((request, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Appointment with</p>
                          <button
                            onClick={() => gotoProfile(request.barberName)}
                            className="text-lg font-[NeueMontreal-Medium] text-blue-600 hover:text-blue-700 active:text-blue-800 cursor-pointer transition-colors"
                          >
                            {request.barberName}
                          </button>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{request.day}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{request.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-gray-500">
                          <div className="animate-pulse flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">Awaiting approval...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
            {requests
              ?.filter((request) => request.time == "404")
              .map((request, index) => (
                <div key={index} className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-red-500 mb-1">Declined appointment with</p>
                        <button
                          onClick={() => gotoProfile(request.barberName)}
                          className="text-lg font-[NeueMontreal-Medium] text-blue-600 hover:text-blue-700 active:text-blue-800 cursor-pointer transition-colors"
                        >
                          {request.barberName}
                        </button>
                      </div>
                      <p className="text-sm text-red-500">
                        Your appointment request for {request.day} was declined
                      </p>
                    </div>
                    <button
                      className="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 active:transform active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
                      onClick={() => complete(request.id)}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulingComponent;
