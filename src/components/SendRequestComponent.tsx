import { FilterScheduleByRequest, sendRequest } from "@/lib/api";
import { fetchInfo } from "@/utils/DataServices";
import { IRequest, ISchedule } from "@/utils/Interfaces";
import React, { useEffect, useState } from "react";
import { Calendar, Clock, ChevronDown, CheckCircle2 } from "lucide-react";

interface SendRequestComponentProps {
  barberName: string;
  onClose: () => void;
}

const SendRequestComponent = ({ barberName, onClose }: SendRequestComponentProps) => {
  const [schedule, setSchedule] = useState<ISchedule>();
  const [times, setTimes] = useState<string[]>([]);
  const [desiredTime, setDesiredTime] = useState<string>("");
  const [desiredDay, setDesiredDay] = useState<string>("");
  const [username] = useState<string>(fetchInfo().username || "");
  const [error, setError] = useState<boolean>(false);
  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const getFilteredSchedule = async () => {
      const scheduleData = await FilterScheduleByRequest(barberName);
      if (!scheduleData) {
        setError(true);
        return;
      }
      setSchedule(scheduleData);
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
    setDesiredDay(day);
    setDesiredTime("");
    setIsDayDropdownOpen(false);
    if (!schedule) {
      setError(true);
      return;
    }
    switch (day) {
      case "Monday":
        setTimes(schedule.mondayTimes.reverse() || []);
        setError(!schedule.mondayTimes?.length);
        break;
      case "Tuesday":
        setTimes(schedule.tuesdayTimes.reverse() || []);
        setError(!schedule.tuesdayTimes?.length);
        break;
      case "Wednesday":
        setTimes(schedule.wednesdayTimes.reverse() || []);
        setError(!schedule.wednesdayTimes?.length);
        break;
      case "Thursday":
        setTimes(schedule.thursdayTimes.reverse() || []);
        setError(!schedule.thursdayTimes?.length);
        break;
      case "Friday":
        setTimes(schedule.fridayTimes.reverse() || []);
        setError(!schedule.fridayTimes?.length);
        break;
      case "Saturday":
        setTimes(schedule.saturdayTimes.reverse() || []);
        setError(!schedule.saturdayTimes?.length);
        break;
      case "Sunday":
        setTimes(schedule.sundayTimes.reverse() || []);
        setError(!schedule.sundayTimes?.length);
        break;
    }
  };

  const handleTimeSelect = (time: string) => {
    setDesiredTime(time);
    setIsTimeDropdownOpen(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload: IRequest = {
        id: 0,
        barberName: barberName,
        username: username,
        day: desiredDay,
        time: desiredTime,
        isAccepted: false,
      };
      
      const success = await sendRequest(payload);
      
      if (success) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setIsSubmitting(false);
        alert("Unable to send request at this time. The time slot may no longer be available.");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      setIsSubmitting(false);
      alert("An error occurred while sending the request. Please try again later.");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-[NeueMontreal-Medium] mb-2">Request Sent!</h2>
        <p className="text-gray-600">
          Your appointment request has been sent to {barberName}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-[NeueMontreal-Medium] mb-2">Schedule Appointment</h2>
        <p className="text-gray-600 text-sm">Select your preferred day and time</p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h3 className="font-[NeueMontreal-Medium] text-lg">Select Day</h3>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsDayDropdownOpen(!isDayDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg text-left font-[NeueMontreal-Medium] text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <span>{desiredDay || "Choose a day"}</span>
              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isDayDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {isDayDropdownOpen && (
              <div className="fixed z-[200] w-[calc(100%-3rem)] sm:w-[460px] mt-2 bg-white rounded-lg shadow-lg border border-gray-100">
                <div className="py-1 max-h-[200px] overflow-y-auto">
                  {daysOfWeek.map((day, idx) => (
                    <button
                      key={idx}
                      onClick={() => displayTimes(day)}
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-100 text-sm font-[NeueMontreal-Medium] transition-colors"
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2 font-[NeueMontreal-Medium]">
              No available times for {desiredDay}
            </p>
          )}
        </div>

        {times.length > 0 && (
          <div>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-gray-600" />
              <h3 className="font-[NeueMontreal-Medium] text-lg">Select Time</h3>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg text-left font-[NeueMontreal-Medium] text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <span>{desiredTime || "Choose a time"}</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isTimeDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {isTimeDropdownOpen && (
                <div className="fixed z-[200] w-[calc(100%-3rem)] sm:w-[460px] mt-2 bg-white rounded-lg shadow-lg border border-gray-100">
                  <div className="py-1 max-h-[200px] overflow-y-auto">
                    {times.map((time, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleTimeSelect(time)}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-100 text-sm font-[NeueMontreal-Medium] transition-colors"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {desiredTime && desiredDay && (
          <div className="mt-2">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h4 className="text-sm text-gray-500 mb-3 font-[NeueMontreal-Medium]">Appointment Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Barber</p>
                  <p className="font-[NeueMontreal-Medium]">{barberName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="font-[NeueMontreal-Medium]">{username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Day</p>
                  <p className="font-[NeueMontreal-Medium]">{desiredDay}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-[NeueMontreal-Medium]">{desiredTime}</p>
                </div>
              </div>
            </div>

            <button
              className={`w-full font-[NeueMontreal-Medium] py-3 mt-4 rounded-lg transition-all duration-200 ${
                isSubmitting
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-200 hover:text-black active:bg-black active:text-white"
              }`}
              onClick={handleSubmit}
              disabled={!desiredTime || !desiredDay || isSubmitting}
            >
              {isSubmitting ? "Sending Request..." : "Confirm Appointment"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendRequestComponent;
