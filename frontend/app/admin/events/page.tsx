'use client';

import LayoutWrapper from "@/app/_sections/Wrapper";
import { withAdminAuth } from "@/app/_contexts/AdminContext";
import { useTheme } from "@/app/_contexts/ThemeContext";
import {
    IconPlus,
    IconSearch,
    IconEdit,
    IconTrash,
    IconCalendar, IconMapPin,
    IconEye, IconDownload
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { adminApi } from "@/app/_libs/adminApi";

interface Event {
  id: string;
  title: string;
  description: string;
  type: 'contest' | 'workshop' | 'meetup' | 'hackathon';
  startDate: string;
  endDate: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  organizer: string;
  registrationDeadline: string;
  prize: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

function EventsManagement() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load events from API
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        const response = await adminApi.getEvents({
          search: searchTerm || undefined,
          type: selectedType !== 'all' ? selectedType : undefined,
          status: selectedStatus !== 'all' ? selectedStatus : undefined,
        });

        if (response.success && response.data) {
          setEvents(response.data);
        }
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [searchTerm, selectedType, selectedStatus]);

  // Since filtering is now done on backend, we use events directly
  const filteredEvents = events;

  const TypeBadge = ({ type }: { type: string }) => {
    const colors = {
      contest: isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800',
      workshop: isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800',
      meetup: isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800',
      hackathon: isDark ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${colors[type as keyof typeof colors]}`}>
        {type}
      </span>
    );
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      upcoming: isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800',
      ongoing: isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800',
      completed: isDark ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 text-gray-800',
      cancelled: isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${colors[status as keyof typeof colors]}`}>
        {status}
      </span>
    );
  };

  const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
    const colors = {
      beginner: isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800',
      intermediate: isDark ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
      advanced: isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${colors[difficulty as keyof typeof colors]}`}>
        {difficulty}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getParticipationRate = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        // Add delete API call when backend supports it
        setEvents(events.filter(event => event.id !== eventId));
      } catch (error) {
        console.error('Failed to delete event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const handleStatusChange = async (eventId: string, newStatus: string) => {
    try {
      // Add update status API call when backend supports it
      setEvents(events.map(event =>
        event.id === eventId ? { ...event, status: newStatus as 'upcoming' | 'ongoing' | 'completed' | 'cancelled' } : event
      ));
    } catch (error) {
      console.error('Failed to update event status:', error);
      alert('Failed to update event status. Please try again.');
    }
  };

  return (
    <LayoutWrapper maxWidth="w-full" isAdmin={true} showFooter={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Events Management
            </h1>
            <p className={`mt-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
              Organize and manage contests, workshops, and community events
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${isDark
                  ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
              <IconDownload size={20} />
              Export
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isDark
                  ? 'bg-violet-600 text-white hover:bg-violet-700'
                  : 'bg-violet-600 text-white hover:bg-violet-700'
                }`}
            >
              <IconPlus size={20} />
              Create Event
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
          } shadow-sm`}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <IconSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-400' : 'text-gray-400'
                }`} size={20} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${isDark
                    ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:ring-2 focus:ring-violet-500 focus:border-violet-500`}
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={`px-3 py-2 border rounded-lg ${isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-violet-500 focus:border-violet-500`}
            >
              <option value="all">All Types</option>
              <option value="contest">Contest</option>
              <option value="workshop">Workshop</option>
              <option value="meetup">Meetup</option>
              <option value="hackathon">Hackathon</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`px-3 py-2 border rounded-lg ${isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-violet-500 focus:border-violet-500`}
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className={`px-3 py-2 border rounded-lg ${isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-violet-500 focus:border-violet-500`}
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <div className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'} flex items-center justify-center`}>
              {filteredEvents.length} of {events.length} events
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className={`rounded-xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
          } shadow-sm overflow-hidden`}>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDark ? 'bg-zinc-800/50' : 'bg-gray-50'}>
                  <tr>
                    <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                      }`}>
                      Event
                    </th>
                    <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                      }`}>
                      Type
                    </th>
                    <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                      }`}>
                      Date & Time
                    </th>
                    <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                      }`}>
                      Participants
                    </th>
                    <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                      }`}>
                      Status
                    </th>
                    <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                      }`}>
                      Difficulty
                    </th>
                    <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                      }`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-zinc-800' : 'divide-gray-200'}`}>
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className={`hover:${isDark ? 'bg-zinc-800/30' : 'bg-gray-50'} transition-colors`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${isDark ? 'bg-violet-900/50' : 'bg-violet-100'
                            }`}>
                            <IconCalendar size={16} className={isDark ? 'text-violet-300' : 'text-violet-600'} />
                          </div>
                          <div>
                            <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {event.title}
                            </div>
                            <div className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'} flex items-center gap-1`}>
                              <IconMapPin size={12} />
                              {event.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <TypeBadge type={event.type} />
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                          <div>{formatDate(event.startDate)}</div>
                          <div className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                            to {formatDate(event.endDate)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                          {event.currentParticipants}/{event.maxParticipants}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                          {getParticipationRate(event.currentParticipants, event.maxParticipants)}% filled
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={event.status} />
                      </td>
                      <td className="px-6 py-4">
                        <DifficultyBadge difficulty={event.difficulty} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className={`p-1.5 rounded hover:${isDark ? 'bg-zinc-700' : 'bg-gray-100'
                              } transition-colors`}
                            title="View event"
                          >
                            <IconEye size={16} className={isDark ? 'text-zinc-400' : 'text-gray-600'} />
                          </button>
                          <button
                            className={`p-1.5 rounded hover:${isDark ? 'bg-zinc-700' : 'bg-gray-100'
                              } transition-colors`}
                            title="Edit event"
                          >
                            <IconEdit size={16} className={isDark ? 'text-zinc-400' : 'text-gray-600'} />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className={`p-1.5 rounded hover:${isDark ? 'bg-red-900/50' : 'bg-red-100'
                              } transition-colors`}
                            title="Delete event"
                          >
                            <IconTrash size={16} className="text-red-500" />
                          </button>
                          <select
                            value={event.status}
                            onChange={(e) => handleStatusChange(event.id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded border ${isDark
                                ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                                : 'bg-white border-gray-300 text-gray-700'
                              }`}
                          >
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
            }`}>
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {events.length}
            </div>
            <div className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
              Total Events
            </div>
          </div>
          <div className={`p-4 rounded-lg border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
            }`}>
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {events.filter(e => e.status === 'upcoming').length}
            </div>
            <div className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
              Upcoming Events
            </div>
          </div>
          <div className={`p-4 rounded-lg border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
            }`}>
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {events.reduce((total, e) => total + e.currentParticipants, 0)}
            </div>
            <div className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
              Total Participants
            </div>
          </div>
          <div className={`p-4 rounded-lg border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
            }`}>
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {Math.round((events.reduce((total, e) => total + e.currentParticipants, 0) / events.reduce((total, e) => total + e.maxParticipants, 0)) * 100) || 0}%
            </div>
            <div className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
              Average Fill Rate
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}

export default withAdminAuth(EventsManagement);
