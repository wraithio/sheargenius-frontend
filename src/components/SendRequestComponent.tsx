import { FilterScheduleByRequest, sendRequest } from "@/lib/api";
import { fetchInfo } from "@/utils/DataServices";
import { IRequest, ISchedule } from "@/utils/Interfaces";
import React, { useEffect, useState } from "react";

interface RatingComponentProps {
  barberName: string;
}

const SendRequestComponent = ({ barberName }: RatingComponentProps) => {
  const [schedule, setSchedule] = useState<ISchedule>();
  const [times, setTimes] = useState<string[]>([]);
  const [desiredTime, setDesiredTime] = useState<string>("");
  const [desiredDay, setDesiredDay] = useState<string>("");

  useEffect(() => {
    const getFilteredSchedule = async () => {
      setSchedule(await FilterScheduleByRequest(barberName));
    };
    getFilteredSchedule();
  }, [barberName]);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const displayTimes = (day: string) => {
    console.log(day);
    setDesiredDay(day);
    setDesiredTime("");
    if (schedule == undefined) {
      console.log(1);
      return;
    }
    switch (day) {
      case "Monday":
        setTimes(schedule.mondayTimes);
        console.log(times);
        break;
      case "Tuesday":
        setTimes(schedule.tuesdayTimes);
        break;
      case "Wednesday":
        setTimes(schedule.wednesdayTimes);
        break;
      case "Thursday":
        setTimes(schedule.thursdayTimes);
        break;
      case "Friday":
        setTimes(schedule.fridayTimes);
        break;
      case "Saturday":
        setTimes(schedule.saturdayTimes);
        break;
      case "Sunday":
        setTimes(schedule.sundayTimes);
        break;
    }
  };

  const handleSubmit = async () => {
    const payload: IRequest = {
      id: 0,
      barberName: barberName,
      username: fetchInfo().username,
      day: desiredDay,
      time: desiredTime,
      isAccepted: false,
    };
    await sendRequest(payload);
    alert("✅ Your request has been successfully sent!");
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex flex-col gap-2">
        <h2>Select a day:</h2>
        <div className="flex flex-row gap-2">
          {daysOfWeek.map((day, idx) => (
            <div key={idx} className="flex items-center">
              <button
                className="bg-black w-fit text-white font-[NeueMontreal-Regular] p-2 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75 text-sm"
                onClick={() => displayTimes(day)}
              >
                {day}
              </button>
            </div>
          ))}
        </div>
      </div>
      {times.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2>Select a time:</h2>
          <div className="flex flex-row gap-2">
            {times.map((time, idx) => (
              <div key={idx} className="flex items-center">
                <button
                  className="bg-black w-fit text-white font-[NeueMontreal-Regular] p-2 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75 text-sm"
                  onClick={() => setDesiredTime(time)}
                >
                  {time}
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <div className="bg-slate-100 w-[90%] p-2 rounded-lg">
              <i className="text-sm">Appointment Request</i>
              <div className="flex justify-around">

              <div>
                <p>
                  <b>Barber:</b> {barberName}
                </p>
                <p>
                  <b>Client:</b> {fetchInfo().username}
                </p>
              </div>
              <div>
                <p>
                  <b>Day:</b> {desiredDay}
                </p>
                <p>
                  <b>Time:</b> {desiredTime}
                </p>
              </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">

          <button
            className="bg-black w-fit text-white font-[NeueMontreal-Regular] p-2 rounded-lg hover:bg-gray-200 hover:outline-2 hover:text-black active:bg-black active:text-white active:outline-0 cursor-pointer transition-all duration-75 text-sm"
            onClick={handleSubmit}
            disabled={desiredTime == "" || desiredDay == ""}
            >
            Submit
          </button>
              </div>
        </div>
      )}
    </div>
  );
};

export default SendRequestComponent;
