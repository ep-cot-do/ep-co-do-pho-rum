"use client";

import { useState, useEffect } from "react";
import LayoutWrapper from "../_sections/Wrapper";
import { useTheme } from "../_contexts/ThemeContext";
import Modal from "../_components/reusable/modal";
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconInfoCircle,
  IconLoader,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { getEvents, EventResponse } from "../_apis/user/events"; // Adjust path as needed

interface CalendarEvent {
  id: number;
  date: Date;
  title: string;
  description: string;
  time: string;
  location: string;
  type?: string;
  status?: string;
  maxParticipant?: number;
  eventImg?: string;
  documentLink?: string;
  startDate: Date;
  endDate: Date;
}

export default function Calendar() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animationDirection, setAnimationDirection] = useState("right");

  // API state
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformApiEvent = (
    apiEvent: EventResponse,
    index: number
  ): CalendarEvent => {
    const startDate = new Date(apiEvent.eventStartDate);
    const endDate = new Date(apiEvent.eventEndDate);

    return {
      id: index,
      date: startDate,
      title: apiEvent.title,
      description: apiEvent.description,
      time: startDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      location: apiEvent.location,
      type: apiEvent.type,
      status: apiEvent.status,
      maxParticipant: apiEvent.maxParticipant,
      eventImg: apiEvent.eventImg,
      documentLink: apiEvent.documentLink,
      startDate,
      endDate,
    };
  };

  // Fetch API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiEvents = await getEvents();

        console.log(apiEvents);

        const transformedEvents = apiEvents.map(transformApiEvent);
        setEvents(transformedEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
        console.error("Error loading events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);

      const targetDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const startDate = new Date(
        eventStart.getFullYear(),
        eventStart.getMonth(),
        eventStart.getDate()
      );
      const endDate = new Date(
        eventEnd.getFullYear(),
        eventEnd.getMonth(),
        eventEnd.getDate()
      );

      return targetDate >= startDate && targetDate <= endDate;
    });
  };

  // Get upcoming events (next 30 days)
  const getUpcomingEvents = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return events
      .filter((event) => {
        const eventDate = new Date(event.startDate);
        return eventDate >= today && eventDate <= thirtyDaysFromNow;
      })
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )
      .slice(0, 5);
  };

  // Handle cell click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const eventsForDate = getEventsForDate(date);
    if (eventsForDate.length > 0) {
      setSelectedEvent(eventsForDate[0]);
      setIsModalOpen(true);
    }
  };

  // Calendar navigation
  const prevMonth = () => {
    setAnimationDirection("left");
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setAnimationDirection("right");
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setAnimationDirection("center");
    setCurrentDate(new Date());
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = getEventsForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push({
        day,
        date,
        isCurrentMonth: true,
        hasEvents: dayEvents.length > 0,
        isToday,
        events: dayEvents,
      });
    }
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 0; i < remainingCells; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    return days;
  };

  const days = generateCalendarDays();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const upcomingEvents = getUpcomingEvents();

  const calendarVariants = {
    hidden: (direction: string) => ({
      x: direction === "right" ? 50 : direction === "left" ? -50 : 0,
      y: direction === "center" ? 20 : 0,
      opacity: 0,
    }),
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: (direction: string) => ({
      x: direction === "right" ? -50 : direction === "left" ? 50 : 0,
      y: direction === "center" ? -20 : 0,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    }),
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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Events Calendar
        </h1>
        <p className={`mt-2 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
          View and manage upcoming events and activities
        </p>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <IconLoader className="animate-spin mr-2" size={24} />
          <span className={isDark ? "text-zinc-300" : "text-zinc-600"}>
            Loading events...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            isDark
              ? "bg-red-900/20 border border-red-800 text-red-300"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          <p>Error loading events: {error}</p>
        </div>
      )}

      {/* Main Content */}
      {!loading && (
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Upcoming Events Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-1/5 order-2 lg:order-1"
          >
            <div
              className={`p-4 rounded-xl ${
                isDark
                  ? "bg-zinc-800/30"
                  : "bg-white shadow-sm border border-zinc-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <IconInfoCircle
                  size={20}
                  className={isDark ? "text-violet-400" : "text-violet-600"}
                />
                <h2 className="font-bold text-lg">Upcoming Events</h2>
              </div>

              <div className="space-y-4">
                {upcomingEvents.length === 0 ? (
                  <p
                    className={`text-sm ${
                      isDark ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    No upcoming events
                  </p>
                ) : (
                  upcomingEvents.map((event, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                      key={event.id}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        isDark
                          ? "bg-zinc-800/40 hover:bg-zinc-700/70"
                          : "bg-zinc-50 hover:bg-zinc-100"
                      }`}
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsModalOpen(true);
                      }}
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                        <h3 className="font-medium text-sm">{event.title}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded inline-block ${
                            isDark
                              ? "bg-zinc-700 text-zinc-300"
                              : "bg-zinc-200 text-zinc-700"
                          }`}
                        >
                          {event.startDate.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p
                        className={`mt-2 text-xs ${
                          isDark ? "text-zinc-400" : "text-zinc-600"
                        }`}
                      >
                        {event.description}
                      </p>
                      {event.type && (
                        <span
                          className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                            isDark
                              ? "bg-violet-900/30 text-violet-300"
                              : "bg-violet-100 text-violet-700"
                          }`}
                        >
                          {event.type}
                        </span>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* Calendar Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-4/5 order-1 lg:order-2"
          >
            <div
              className={`rounded-xl overflow-hidden ${
                isDark
                  ? "bg-zinc-800/30"
                  : "bg-white shadow-sm border border-zinc-100"
              }`}
            >
              {/* Calendar Header */}
              <div
                className={`p-4 flex items-center justify-between ${
                  isDark ? "bg-zinc-800/60" : "bg-zinc-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <IconCalendar
                    size={20}
                    className={isDark ? "text-violet-400" : "text-violet-600"}
                  />
                  <AnimatePresence mode="wait">
                    <motion.h2
                      key={`${monthName}-${currentDate.getFullYear()}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="font-bold text-lg"
                    >
                      {monthName} {currentDate.getFullYear()}
                    </motion.h2>
                  </AnimatePresence>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={prevMonth}
                    className={`p-2 rounded-full ${
                      isDark ? "hover:bg-zinc-700" : "hover:bg-zinc-100"
                    }`}
                    aria-label="Previous month"
                  >
                    <IconChevronLeft size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goToToday}
                    className={`px-3 py-1 text-sm rounded-md ${
                      isDark
                        ? "bg-zinc-700 hover:bg-zinc-600"
                        : "bg-zinc-100 hover:bg-zinc-200"
                    }`}
                  >
                    Today
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextMonth}
                    className={`p-2 rounded-full ${
                      isDark ? "hover:bg-zinc-700" : "hover:bg-zinc-100"
                    }`}
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
                        className={`p-3 text-center text-sm font-medium ${
                          isDark ? "text-zinc-300" : "text-zinc-600"
                        }`}
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
                          whileHover={
                            day.isCurrentMonth && day.day
                              ? {
                                  scale: 1.01,
                                  backgroundColor: isDark
                                    ? "rgba(82, 82, 91, 0.3)"
                                    : "rgba(243, 244, 246, 1)",
                                  transition: { duration: 0.15 },
                                }
                              : {}
                          }
                          className={`
                            relative min-h-[100px] p-2 border-b border-r transition-colors duration-100
                            ${isDark ? "border-zinc-700" : "border-zinc-100"}
                            ${
                              !day.isCurrentMonth
                                ? isDark
                                  ? "bg-zinc-800/20"
                                  : "bg-zinc-50/50"
                                : ""
                            }
                            ${
                              day.isCurrentMonth && day.day
                                ? "cursor-pointer"
                                : ""
                            }
                          `}
                          onClick={() =>
                            day.isCurrentMonth &&
                            day.day &&
                            handleDateClick(day.date)
                          }
                        >
                          {day.day && (
                            <>
                              <motion.span
                                className={`
                                  inline-block w-8 h-8 leading-8 rounded-full text-center
                                  ${
                                    day.isToday
                                      ? isDark
                                        ? "bg-violet-500 text-white ring-2 ring-violet-300 ring-offset-1 ring-offset-zinc-800"
                                        : "bg-violet-600 text-white ring-2 ring-violet-200 ring-offset-1"
                                      : day.hasEvents
                                      ? isDark
                                        ? "bg-violet-600/60 text-white"
                                        : "bg-violet-100 text-violet-800"
                                      : ""
                                  }
                                `}
                              >
                                {day.day}
                              </motion.span>

                              {/* Event indicators */}
                              {day.hasEvents && (
                                <div className="mt-2 space-y-1">
                                  {day.events
                                    .slice(0, 2)
                                    .map((event, eventIndex) => (
                                      <motion.div
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * eventIndex }}
                                        whileHover={{ scale: 1.03 }}
                                        key={eventIndex}
                                        className={`text-xs p-1.5 rounded truncate shadow-sm cursor-pointer ${
                                          isDark
                                            ? "bg-violet-900/30 text-violet-300 hover:bg-violet-800/40"
                                            : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                                        }`}
                                        title={event.title}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedEvent(event);
                                          setIsModalOpen(true);
                                        }}
                                      >
                                        {event.title}
                                      </motion.div>
                                    ))}
                                  {day.events.length > 2 && (
                                    <div
                                      className={`text-xs p-1 text-center ${
                                        isDark
                                          ? "text-zinc-400"
                                          : "text-zinc-500"
                                      }`}
                                    >
                                      +{day.events.length - 2} more
                                    </div>
                                  )}
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
      )}

      {/* Event Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedEvent && (
          <Modal
            opened={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            className={`w-full max-w-md ${
              isDark ? "bg-zinc-800 text-white" : "bg-white"
            }`}
          >
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
                  onClick={() => setIsModalOpen(false)}
                  className={`p-1 rounded-full hover:${
                    isDark ? "bg-zinc-700" : "bg-zinc-100"
                  }`}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  &times;
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`p-4 rounded-lg mb-4 ${
                  isDark ? "bg-zinc-700/50" : "bg-zinc-50"
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Start Date:</span>
                    <span>{selectedEvent.startDate.toLocaleDateString()}</span>
                  </div>
                  {selectedEvent.endDate.getTime() !==
                    selectedEvent.startDate.getTime() && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">End Date:</span>
                      <span>{selectedEvent.endDate.toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Time:</span>
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Location:</span>
                    <span>{selectedEvent.location}</span>
                  </div>
                  {selectedEvent.type && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Type:</span>
                      <span>{selectedEvent.type}</span>
                    </div>
                  )}
                  {selectedEvent.status && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          selectedEvent.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedEvent.status}
                      </span>
                    </div>
                  )}
                  {selectedEvent.maxParticipant && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Max Participants:</span>
                      <span>{selectedEvent.maxParticipant}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-4"
              >
                <h3 className="font-medium mb-2">Description</h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-zinc-300" : "text-zinc-700"
                  }`}
                >
                  {selectedEvent.description}
                </p>
              </motion.div>

              {selectedEvent.documentLink && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mb-4"
                >
                  <a
                    href={selectedEvent.documentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm underline ${
                      isDark
                        ? "text-violet-400 hover:text-violet-300"
                        : "text-violet-600 hover:text-violet-700"
                    }`}
                  >
                    View Document
                  </a>
                </motion.div>
              )}

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
                  className={`px-4 py-2 rounded-md ${
                    isDark
                      ? "bg-zinc-700 hover:bg-zinc-600"
                      : "bg-zinc-100 hover:bg-zinc-200"
                  }`}
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-md ${
                    isDark
                      ? "bg-violet-600 hover:bg-violet-700"
                      : "bg-violet-600 hover:bg-violet-700"
                  } text-white`}
                >
                  Join Event
                </motion.button>
              </motion.div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </LayoutWrapper>
  );
}
