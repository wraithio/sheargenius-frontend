'use client';
import React, { useState } from 'react';

import { ISchedule } from "@/utils/Interfaces";
import { setSchedule } from "@/lib/api";
import { fetchInfo } from '@/utils/DataServices';
import { useRouter } from 'next/navigation';


const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];

const timeSlots = Array.from({ length: 17 }, (_, i) => {
  const hour = 6 + i;
  const suffix = hour >= 12 ? 'pm' : 'am';
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}${suffix}`;
});

const ScheduleForm = () => {
  const router = useRouter();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleTime = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleSubmit = async () => {
    // const payload: ISchedule = {
    //   id: 0,
    //   username: fetchInfo().username,
    //   days: selectedDays,
    //   times: selectedTimes,
    // };

    try {
      // await setSchedule(payload);
      alert("✅ Your schedule has been successfully saved!");
      const queryParams = new URLSearchParams({
        u: fetchInfo().username,
      }).toString();
      router.push(`/user-profile?${queryParams}`);

    } catch (error) {
      console.error("Failed to submit schedule:", error);
      alert("❌ There was an error saving your schedule. Please try again.");
    }
  };

  const backToProfile = (username:string) => {
    const queryParams = new URLSearchParams({
      u: username,
    }).toString();
    router.push(`/user-profile?${queryParams}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="relative bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 w-full max-w-2xl">
        
        
        <button
          onClick={() => backToProfile(fetchInfo().username)}
          className="absolute top-4 right-4 text-gray-600 dark:text-white hover:text-black text-2xl font-bold"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          {editMode ? 'Edit Your Barber Schedule' : 'Set Your Barber Schedule'}
        </h2>

        
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Available Days
          </p>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                  selectedDays.includes(day)
                    ? 'bg-black text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

       
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Available Time Slots
          </p>
          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => toggleTime(time)}
                className={`px-3 py-1 rounded-lg text-sm font-medium border transition ${
                  selectedTimes.includes(time)
                    ? 'bg-black text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl shadow"
          >
            {editMode ? 'Update Schedule' : 'Submit Schedule'}
          </button>

          <button
            onClick={() => setEditMode(!editMode)}
            className="px-5 py-2 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl shadow"
          >
            {editMode ? 'Cancel Edit' : 'Edit Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleForm;
