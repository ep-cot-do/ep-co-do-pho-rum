"use client";

import { useState } from 'react';
import LayoutWrapper from "../_sections/Wrapper";
import { useTheme } from "../_contexts/ThemeContext";
import Modal from "../_components/reusable/modal";
import { IconCalendar, IconChevronLeft, IconChevronRight, IconInfoCircle } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

// Sample events data
const eventData = [
  {
    id: 1,
    date: new Date("2025-05-14"), // Format: YYYY-MM-DD
    title: "Club Meeting",
    description: "Regular club meeting to discuss upcoming events and activities.",
    time: "6:30 PM",
    location: "Room G406"
  }
];

// Upcoming events (fixed list regardless of current month view)
const upcomingEvents = [
  {
    id: 101,
    date: new Date(2025, 7, 15),
    title: "Test Event",
    description: "Test Event"
  },
  {
    id: 102,
    date: new Date(2025, 7, 22),
    title: "Test Event",
    description: "Test Event"
  },
  {
    id: 103,
    date: new Date(2025, 8, 5),
    title: "Test Event",
    description: "Test Event"
  }
] as const;

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
  const [animationDirection, setAnimationDirection] = useState("right");

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
    setAnimationDirection("left");
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setAnimationDirection("right");
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setAnimationDirection("center");
    setCurrentDate(new Date());
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

      // Check if this is today's date
      const isToday = new Date().toDateString() === date.toDateString();

      days.push({
        day,
        date,
        isCurrentMonth: true,
        hasEvents: events.length > 0,
        isToday,
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

  // Animation variants
  const calendarVariants = {
    hidden: (direction: string) => ({
      x: direction === "right" ? 50 : direction === "left" ? -50 : 0,
      y: direction === "center" ? 20 : 0,
      opacity: 0
    }),
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: (direction: string) => ({
      x: direction === "right" ? -50 : direction === "left" ? 50 : 0,
      y: direction === "center" ? -20 : 0,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    })
  };

  return (
    <LayoutWrapper maxWidth="w-full">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 md:mb-8"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Events Calendar</h1>
        <p className={`mt-2 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
          View and manage upcoming events and activities
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Achievements Section - Grid on mobile, sidebar on desktop */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full lg:w-1/5 order-2 lg:order-1"
        >
          <div className={`p-4 rounded-xl ${isDark ? 'bg-zinc-800/30' : 'bg-white shadow-sm border border-zinc-100'}`}>
            <div className="flex items-center gap-2 mb-4">
              <IconInfoCircle size={20} className={isDark ? "text-violet-400" : "text-violet-600"} />
              <h2 className="font-bold text-lg">Upcoming Events</h2>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  key={event.id}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${isDark ? 'bg-zinc-800/40 hover:bg-zinc-700/70' : 'bg-zinc-50 hover:bg-zinc-100'}`}
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
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Calendar Section - Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-4/5 order-1 lg:order-2"
        >
          {/* Calendar Container */}
          <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-zinc-800/30' : 'bg-white shadow-sm border border-zinc-100'}`}>
            {/* Calendar Header */}
            <div className={`p-4 flex items-center justify-between ${isDark ? 'bg-zinc-800/60' : 'bg-zinc-50'}`}>
              <div className="flex items-center gap-2">
                <IconCalendar size={20} className={isDark ? "text-violet-400" : "text-violet-600"} />
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={`${monthName}-${currentDate.getFullYear()}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="font-bold text-lg">
                    {monthName} {currentDate.getFullYear()}
                  </motion.h2>
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevMonth}
                  className={`p-2 rounded-full ${isDark ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100'}`}
                  aria-label="Previous month"
                >
                  <IconChevronLeft size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToToday}
                  className={`px-3 py-1 text-sm rounded-md ${isDark ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-zinc-100 hover:bg-zinc-200'}`}
                >
                  Today
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextMonth}
                  className={`p-2 rounded-full ${isDark ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100'}`}
                  aria-label="Next month"
                >
                  <IconChevronRight size={20} />
                </motion.button>
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
                      className={`p-3 text-center text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <AnimatePresence custom={animationDirection} mode="wait">
                  <motion.div
                    key={`${currentDate.getMonth()}-${currentDate.getFullYear()}`}
                    custom={animationDirection}
                    variants={calendarVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="grid grid-cols-7"
                  >
                    {days.map((day, index) => (
                      <motion.div
                        key={index}
                        whileHover={day.isCurrentMonth && day.day ?
                          { scale: 1.01, backgroundColor: isDark ? 'rgba(82, 82, 91, 0.3)' : 'rgba(243, 244, 246, 1)', transition: { duration: 0.15 } } :
                          {}
                        }
                        className={`
                          relative min-h-[100px] p-2 border-b border-r transition-colors duration-100
                          ${isDark ? 'border-zinc-700' : 'border-zinc-100'}
                          ${!day.isCurrentMonth ? (isDark ? 'bg-zinc-800/20' : 'bg-zinc-50/50') : ''}
                          ${day.isCurrentMonth && day.day ? 'cursor-pointer' : ''}
                        `}
                        onClick={() => day.isCurrentMonth && day.day && handleDateClick(day.date)}
                      >
                        {day.day && (
                          <>
                            <motion.span
                              className={`
                                inline-block w-8 h-8 leading-8 rounded-full text-center
                                ${day.isToday ?
                                  (isDark ? 'bg-violet-500 text-white ring-2 ring-violet-300 ring-offset-1 ring-offset-zinc-800' :
                                    'bg-violet-600 text-white ring-2 ring-violet-200 ring-offset-1') :
                                  day.hasEvents ?
                                    (isDark ? 'bg-violet-600/60 text-white' : 'bg-violet-100 text-violet-800') :
                                    ''
                                }
                              `}
                            >
                              {day.day}
                            </motion.span>

                            {/* Event indicators */}
                            {day.hasEvents && (
                              <div className="mt-2 space-y-1">
                                {day.events.map((event, eventIndex) => (
                                  <motion.div
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * eventIndex }}
                                    whileHover={{ scale: 1.03 }}
                                    key={eventIndex}
                                    className={`text-xs p-1.5 rounded truncate shadow-sm ${isDark ?
                                      'bg-violet-900/30 text-violet-300 hover:bg-violet-800/40' :
                                      'bg-violet-50 text-violet-700 hover:bg-violet-100'
                                      }`}
                                    title={event.title}
                                  >
                                    {event.title}
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal
            opened={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            className={`w-full max-w-md ${isDark ? 'bg-zinc-800 text-white' : 'bg-white'}`}
          >
            {selectedEvent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <motion.h2
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl font-bold"
                  >
                    {selectedEvent.title}
                  </motion.h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsModalOpen(false)}
                    className={`p-1 rounded-full ${isDark ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100'}`}
                  >
                    ✕
                  </motion.button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`p-4 rounded-lg mb-4 ${isDark ? 'bg-zinc-700/50' : 'bg-zinc-50'}`}
                >
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-4"
                >
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    {selectedEvent.description}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-3 justify-end"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(false)}
                    className={`px-4 py-2 rounded-md ${isDark ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-zinc-100 hover:bg-zinc-200'}`}
                  >
                    Close
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-md ${isDark ? 'bg-violet-600 hover:bg-violet-700' : 'bg-violet-600 hover:bg-violet-700'} text-white`}
                  >
                    Going
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </LayoutWrapper>
  );
}
