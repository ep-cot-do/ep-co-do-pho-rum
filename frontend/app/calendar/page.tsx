"use client";

import { useState } from 'react';
import LayoutWrapper from "../_sections/Wrapper";
import AchievementSection, { AchievementItem } from "../_sections/Achievement";
import { useTheme } from "../_contexts/ThemeContext";
import Modal from "../_components/reusable/modal";
import { IconCalendar, IconChevronLeft, IconChevronRight, IconInfoCircle } from "@tabler/icons-react";

// Sample achievements data
const achievements: AchievementItem[] = [
  { name: "Nguyen Hoang Khang", description: "Accepted AI paper", level: "gold" },
  { name: "Nguyen Vu Nhu Huynh", description: "Accepted AI paper", level: "gold" },
  { name: "Tran Cong Luan", description: "Second place in FPTU Code Arena", level: "silver" },
  { name: "Lam Tan Phat", description: "Second place in FPTU Code Arena", level: "silver" },
  { name: "Doan Vo Quoc Thai", description: "Second place in FPTU Code Arena", level: "silver" },
];

// Sample events data
const eventData = [
  {
    id: 1,
    date: new Date(2025, 7, 5),
    title: "Coding Workshop",
    description: "Learn advanced React techniques with our tech lead.",
    time: "2:00 PM - 4:00 PM",
    location: "Room A101"
  },
  {
    id: 2,
    date: new Date(2025, 7, 12),
    title: "AI Meetup",
    description: "Discussion on recent advancements in machine learning algorithms.",
    time: "6:00 PM - 8:00 PM",
    location: "Online via Zoom"
  },
  {
    id: 3,
    date: new Date(2025, 7, 20),
    title: "Hackathon Planning",
    description: "Planning session for the upcoming campus hackathon.",
    time: "3:30 PM - 5:00 PM",
    location: "Innovation Hub"
  },
  {
    id: 4,
    date: new Date(2025, 7, 25),
    title: "Tech Talk",
    description: "Guest speaker from Google discussing cloud infrastructure.",
    time: "5:00 PM - 6:30 PM",
    location: "Main Auditorium"
  }
];

// Upcoming events (fixed list regardless of current month view)
const upcomingEvents = [
  {
    id: 101,
    date: new Date(2023, 7, 15),
    title: "Frontend Workshop",
    description: "Hands-on session on modern CSS techniques"
  },
  {
    id: 102,
    date: new Date(2023, 7, 22),
    title: "Algorithms Study Group",
    description: "Weekly meetup to solve competitive programming problems"
  },
  {
    id: 103,
    date: new Date(2023, 8, 5),
    title: "New Member Orientation",
    description: "Welcome session for new club members"
  }
];

export default function Calendar() {
  type Event = {
    id: number;
    date: Date;
    title: string;
    description: string;
    time: string;
    location: string;
  }

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get events for the selected date
  const getEventsForDate = (date: Date) => {
    return eventData.filter(event =>
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  // Handle cell click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const events = getEventsForDate(date);
    if (events.length > 0) {
      setSelectedEvent(events[0]); // For simplicity, just show the first event
      setIsModalOpen(true);
    }
  };

  // Calendar navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    // Add cells for days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const events = getEventsForDate(date);
      days.push({
        day,
        date,
        isCurrentMonth: true,
        hasEvents: events.length > 0,
        events
      });
    }

    // Calculate how many empty cells we need to add after the last day
    // to make sure we have complete weeks
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 0; i < remainingCells; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    return days;
  };

  const days = generateCalendarDays();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <LayoutWrapper maxWidth="w-full">
      {/* Page Title */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Events Calendar</h1>
        <p className={`mt-2 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
          View and manage upcoming events and activities
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Achievements Section - Grid on mobile, sidebar on desktop */}
        <div className="w-full lg:w-1/5 order-2 lg:order-1">
          <AchievementSection achievements={achievements} useGrid={true} />
        </div>

        {/* Calendar Section - Main content */}
        <div className="w-full lg:w-4/5 order-1 lg:order-2">
          {/* Calendar Container */}
          <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-zinc-800/30' : 'bg-white shadow-sm border border-zinc-100'}`}>
            {/* Calendar Header */}
            <div className={`p-4 flex items-center justify-between ${isDark ? 'bg-zinc-800/60' : 'bg-zinc-50'}`}>
              <div className="flex items-center gap-2">
                <IconCalendar size={20} className={isDark ? "text-violet-400" : "text-violet-600"} />
                <h2 className="font-bold text-lg">{monthName} {currentDate.getFullYear()}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className={`p-2 rounded-full ${isDark ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100'}`}
                  aria-label="Previous month"
                >
                  <IconChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className={`px-3 py-1 text-sm rounded-md ${isDark ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-zinc-100 hover:bg-zinc-200'}`}
                >
                  Today
                </button>
                <button
                  onClick={nextMonth}
                  className={`p-2 rounded-full ${isDark ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100'}`}
                  aria-label="Next month"
                >
                  <IconChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-700">
                  {weekdays.map((day, index) => (
                    <div
                      key={index}
                      className={`p-3 text-center text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-600'
                        }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                  {days.map((day, index) => (
                    <div
                      key={index}
                      className={`
                        relative min-h-[100px] p-2 border-b border-r
                        ${isDark ? 'border-zinc-700' : 'border-zinc-100'}
                        ${!day.isCurrentMonth ? (isDark ? 'bg-zinc-800/20' : 'bg-zinc-50/50') : ''}
                      `}
                      onClick={() => day.isCurrentMonth && day.day && handleDateClick(day.date)}
                    >
                      {day.day && (
                        <>
                          <span className={`
                            inline-block w-7 h-7 leading-7 rounded-full text-center
                            ${day.hasEvents ?
                              (isDark ? 'bg-violet-600/60 text-white' : 'bg-violet-100 text-violet-800') :
                              ''
                            }
                          `}>
                            {day.day}
                          </span>

                          {/* Event indicators */}
                          {day.hasEvents && (
                            <div className="mt-1 space-y-1">
                              {day.events.map((event, eventIndex) => (
                                <div
                                  key={eventIndex}
                                  className={`text-xs p-1 rounded truncate ${isDark ? 'bg-violet-900/30 text-violet-300' : 'bg-violet-50 text-violet-700'
                                    }`}
                                  title={event.title}
                                >
                                  {event.title}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events Section */}
          <div className={`mt-6 md:mt-8 p-4 rounded-xl ${isDark ? 'bg-zinc-800/30' : 'bg-white shadow-sm border border-zinc-100'}`}>
            <div className="flex items-center gap-2 mb-4">
              <IconInfoCircle size={20} className={isDark ? "text-violet-400" : "text-violet-600"} />
              <h2 className="font-bold text-lg">Upcoming Events</h2>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg ${isDark ? 'bg-zinc-800/40' : 'bg-zinc-50'}`}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <h3 className="font-medium text-lg">{event.title}</h3>
                    <span className={`text-sm px-2 py-1 rounded inline-block ${isDark ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-200 text-zinc-700'
                      }`}>
                      {event.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className={`mt-2 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className={`w-full max-w-md ${isDark ? 'bg-zinc-800 text-white' : 'bg-white'}`}
      >
        {selectedEvent && (
          <div>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{selectedEvent.title}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`p-1 rounded-full ${isDark ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100'}`}
              >
                ✕
              </button>
            </div>

            <div className={`p-4 rounded-lg mb-4 ${isDark ? 'bg-zinc-700/50' : 'bg-zinc-50'}`}>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Date:</span>
                  <span>{selectedEvent.date.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Time:</span>
                  <span>{selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Location:</span>
                  <span>{selectedEvent.location}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                {selectedEvent.description}
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className={`px-4 py-2 rounded-md ${isDark ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-zinc-100 hover:bg-zinc-200'}`}
              >
                Close
              </button>
              <button
                className={`px-4 py-2 rounded-md ${isDark ? 'bg-violet-600 hover:bg-violet-700' : 'bg-violet-600 hover:bg-violet-700'} text-white`}
              >
                RSVP
              </button>
            </div>
          </div>
        )}
      </Modal>
    </LayoutWrapper>
  );
}
