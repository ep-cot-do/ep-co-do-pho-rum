"use client";

import { useState } from 'react';
import LayoutWrapper from "../_sections/Wrapper";
import { useTheme } from "../_contexts/ThemeContext";
import { IconTrophy, IconSearch, IconAdjustments, IconFilter, IconMedal, IconCrown } from "@tabler/icons-react";
import { AchievementItem } from '../_sections/User/Achievement';

// Sample achievements data with more details for the dedicated page
const achievements: (AchievementItem & {
  member: string;
  date: string;
  details: string;
  tags?: string[];
})[] = [
    {
      name: "AI Research Paper Accepted",
      description: "Paper accepted at International Conference on Machine Learning",
      level: "gold",
      member: "Nguyen Hoang Khang",
      date: "June 12, 2023",
      details: "Research on 'Optimizing Neural Networks for Edge Devices' was accepted at ICML 2023.",
      tags: ["AI", "Research", "Machine Learning"]
    },
    {
      name: "AI Research Paper Accepted",
      description: "Paper accepted at International Conference on Machine Learning",
      level: "gold",
      member: "Nguyen Vu Nhu Huynh",
      date: "June 12, 2023",
      details: "Research on 'Generative Models for Synthetic Data' was accepted at ICML 2023.",
      tags: ["AI", "Research", "Generative Models"]
    },
    {
      name: "FPTU Code Arena Winner",
      description: "Second place in the competitive programming contest",
      level: "silver",
      member: "Tran Cong Luan",
      date: "April 5, 2023",
      details: "Solved 7 out of 9 problems with optimal time complexity.",
      tags: ["Competitive Programming", "Algorithms"]
    },
    {
      name: "FPTU Code Arena Winner",
      description: "Second place in the competitive programming contest",
      level: "silver",
      member: "Lam Tan Phat",
      date: "April 5, 2023",
      details: "Solved 7 out of 9 problems with optimal time complexity.",
      tags: ["Competitive Programming", "Algorithms"]
    },
    {
      name: "FPTU Code Arena Winner",
      description: "Second place in the competitive programming contest",
      level: "silver",
      member: "Doan Vo Quoc Thai",
      date: "April 5, 2023",
      details: "Solved 7 out of 9 problems with optimal time complexity.",
      tags: ["Competitive Programming", "Algorithms"]
    },
    {
      name: "Open Source Contribution",
      description: "Major contribution to React library",
      level: "gold",
      member: "Le Nhut Anh",
      date: "March 20, 2023",
      details: "Contributed performance improvements to React's rendering engine, merged by core team.",
      tags: ["Open Source", "React", "JavaScript"]
    },
    {
      name: "Hackathon Winner",
      description: "First place in FPT Hackathon 2023",
      level: "gold",
      member: "Truong Doan Minh Phuc",
      date: "February 8, 2023",
      details: "Led a team of 4 to develop an educational platform for teaching programming to children.",
      tags: ["Hackathon", "EdTech", "Team Lead"]
    },
    {
      name: "Mobile App Published",
      description: "Released productivity app on App Store",
      level: "bronze",
      member: "Chau Tan Cuong",
      date: "January 15, 2023",
      details: "Designed and developed 'StudyFlow', a pomodoro and note-taking app for students.",
      tags: ["Mobile Development", "iOS", "Swift"]
    },
    {
      name: "Web Development Workshop",
      description: "Conducted workshop on modern React",
      level: "bronze",
      member: "Nguyen Quang Huy",
      date: "December 10, 2022",
      details: "Led a hands-on workshop teaching 50+ students about React hooks and modern patterns.",
      tags: ["Workshop", "Teaching", "React"]
    },
    {
      name: "Microsoft Certification",
      description: "Obtained Azure Developer Associate certification",
      level: "silver",
      member: "Kim Bao Nguyen",
      date: "November 5, 2022",
      details: "Passed the AZ-204 exam with a score of 925/1000.",
      tags: ["Certification", "Azure", "Cloud"]
    },
    {
      name: "Tech Blog Recognition",
      description: "Blog featured on DEV.to weekly digest",
      level: "bronze",
      member: "Hoang Van Minh",
      date: "October 23, 2022",
      details: "Article about 'Building accessible React components' featured on DEV.to weekly digest.",
      tags: ["Technical Writing", "Accessibility", "React"]
    },
    {
      name: "Internship at Google",
      description: "Secured summer internship at Google",
      level: "gold",
      member: "Pham Minh Tuan",
      date: "October 1, 2022",
      details: "Selected for the competitive Software Engineering Internship program at Google Singapore.",
      tags: ["Internship", "Google", "Career"]
    }
  ];

// Achievement filters
const filters = {
  levels: [
    { id: 'all', label: 'All Levels' },
    { id: 'gold', label: 'Gold' },
    { id: 'silver', label: 'Silver' },
    { id: 'bronze', label: 'Bronze' },
  ],
  categories: [
    { id: 'all', label: 'All Categories' },
    { id: 'research', label: 'Research' },
    { id: 'competition', label: 'Competitions' },
    { id: 'opensource', label: 'Open Source' },
    { id: 'certification', label: 'Certifications' },
    { id: 'internship', label: 'Internships' },
    { id: 'workshop', label: 'Workshops' },
  ],
  timeframes: [
    { id: 'all', label: 'All Time' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' },
  ]
};

export default function AchievementPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<typeof achievements[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter achievements based on selected filters and search term
  const filteredAchievements = achievements.filter(achievement => {
    // Search filter
    const matchesSearch = searchTerm === '' ||
      achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Level filter
    const matchesLevel = selectedLevel === 'all' || achievement.level === selectedLevel;

    // Category filter - simplified, would normally check tags or categories
    const matchesCategory = selectedCategory === 'all' ||
      (achievement.tags?.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase())));

    // Time filter - simplified, would normally use proper date comparison
    let matchesTimeframe = true;
    if (selectedTimeframe !== 'all') {
      const achievementDate = new Date(achievement.date);
      const now = new Date();

      if (selectedTimeframe === 'month') {
        matchesTimeframe = achievementDate.getMonth() === now.getMonth() &&
          achievementDate.getFullYear() === now.getFullYear();
      } else if (selectedTimeframe === 'quarter') {
        const achievementQuarter = Math.floor(achievementDate.getMonth() / 3);
        const currentQuarter = Math.floor(now.getMonth() / 3);
        matchesTimeframe = achievementQuarter === currentQuarter &&
          achievementDate.getFullYear() === now.getFullYear();
      } else if (selectedTimeframe === 'year') {
        matchesTimeframe = achievementDate.getFullYear() === now.getFullYear();
      }
    }

    return matchesSearch && matchesLevel && matchesCategory && matchesTimeframe;
  });

  // Function to view achievement details
  const handleViewAchievement = (achievement: typeof achievements[0]) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

  // Function to render level badge
  const renderLevelBadge = (level: string) => {
    // let color = "";
    if (level === "gold") {
      return <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${isDark ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-700'}`}>
        <IconCrown size={14} className="text-yellow-500" stroke={1.5} />
        Gold
      </span>;
    } else if (level === "silver") {
      return <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-200 text-zinc-700'}`}>
        <IconMedal size={14} className={isDark ? "text-zinc-300" : "text-zinc-500"} stroke={1.5} />
        Silver
      </span>;
    } else {
      return <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${isDark ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
        <IconMedal size={14} className="text-amber-700" stroke={1.5} />
        Bronze
      </span>;
    }
  };

  return (
    <LayoutWrapper maxWidth="w-full">
      {/* Page Title */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center gap-3">
          <IconTrophy className={isDark ? "text-yellow-400" : "text-yellow-500"} size={32} stroke={1.5} />
          Achievements
        </h1>
        <p className={`mt-2 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
          Celebrating our members&aquos; accomplishments and milestones
        </p>
      </div>

      {/* Filters Bar */}
      <div className={`p-4 mb-6 rounded-xl flex flex-col gap-4 ${isDark ? 'bg-zinc-800/30' : 'bg-white border border-zinc-100 shadow-sm'}`}>
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search achievements or members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${isDark
              ? 'bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500'
              : 'bg-white border-zinc-200 text-zinc-800 placeholder:text-zinc-400'
              } border`}
          />
          <IconSearch
            size={18}
            className={`absolute left-3 top-2.5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}
          />
        </div>

        {/* Filter Toggle Button - Mobile */}
        <div className="sm:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg w-full ${isDark
              ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700'
              : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200'
              } border`}
          >
            <IconAdjustments size={18} />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>

        {/* Filter Options - Desktop always visible, mobile conditional */}
        <div className={`${showFilters ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row gap-3 sm:gap-4`}>
          {/* Level Filter */}
          <div className="sm:w-1/3">
            <label className={`block mb-1 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Achievement Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className={`w-full p-2 rounded-lg ${isDark
                ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                : 'bg-white border-zinc-200 text-zinc-800'
                } border`}
            >
              {filters.levels.map(level => (
                <option key={level.id} value={level.id}>{level.label}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:w-1/3">
            <label className={`block mb-1 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full p-2 rounded-lg ${isDark
                ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                : 'bg-white border-zinc-200 text-zinc-800'
                } border`}
            >
              {filters.categories.map(category => (
                <option key={category.id} value={category.id}>{category.label}</option>
              ))}
            </select>
          </div>

          {/* Time Filter */}
          <div className="sm:w-1/3">
            <label className={`block mb-1 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Time Period
            </label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className={`w-full p-2 rounded-lg ${isDark
                ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                : 'bg-white border-zinc-200 text-zinc-800'
                } border`}
            >
              {filters.timeframes.map(time => (
                <option key={time.id} value={time.id}>{time.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredAchievements.length > 0 ? (
          filteredAchievements.map((achievement, index) => (
            <div
              key={index}
              className={`rounded-xl overflow-hidden transition-all hover:-translate-y-1 cursor-pointer ${isDark ? 'bg-zinc-800/40 hover:bg-zinc-800/60' : 'bg-white hover:bg-zinc-50 border border-zinc-100 shadow-sm'
                }`}
              onClick={() => handleViewAchievement(achievement)}
            >
              <div className={`h-24 ${isDark ? 'bg-zinc-700/50' : 'bg-zinc-50'} flex items-center justify-center`}>
                <div className={`p-4 rounded-full ${achievement.level === "gold"
                  ? isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'
                  : achievement.level === "silver"
                    ? isDark ? 'bg-zinc-700' : 'bg-zinc-200'
                    : isDark ? 'bg-amber-900/30' : 'bg-amber-100'
                  }`}>
                  <IconMedal
                    size={32}
                    className={
                      achievement.level === "gold"
                        ? "text-yellow-500"
                        : achievement.level === "silver"
                          ? isDark ? "text-zinc-300" : "text-zinc-400"
                          : "text-amber-700"
                    }
                    stroke={1.5}
                  />
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h2 className="font-bold text-lg">{achievement.name}</h2>
                  {renderLevelBadge(achievement.level)}
                </div>
                <h3 className={`text-base ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                  {achievement.member}
                </h3>
                <p className={`mt-1 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {achievement.description}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {achievement.date}
                  </span>
                  <button className={`text-sm px-3 py-1 rounded-md ${isDark
                    ? 'bg-violet-600/30 hover:bg-violet-600/50 text-violet-300'
                    : 'bg-violet-50 hover:bg-violet-100 text-violet-700'
                    }`}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`col-span-1 sm:col-span-2 lg:col-span-3 p-8 text-center rounded-xl ${isDark ? 'bg-zinc-800/30' : 'bg-white border border-zinc-100'
            }`}>
            <p className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>
              No achievements match your filters. Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>

      {/* Achievement Details Modal */}
      {selectedAchievement && (
        <div className={`fixed inset-0 z-40 ${isModalOpen ? 'flex' : 'hidden'} items-center justify-center backdrop-blur-sm`} onClick={() => setIsModalOpen(false)}>
          <div
            className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-xl m-4 ${isDark ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-900'
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={`absolute top-4 right-4 p-1 rounded-full ${isDark ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100'}`}
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>

            <div className="flex items-start gap-4 mb-6">
              <div className={`p-3 rounded-full flex-shrink-0 ${selectedAchievement.level === "gold"
                ? isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'
                : selectedAchievement.level === "silver"
                  ? isDark ? 'bg-zinc-700' : 'bg-zinc-200'
                  : isDark ? 'bg-amber-900/30' : 'bg-amber-100'
                }`}>
                <IconMedal
                  size={32}
                  className={
                    selectedAchievement.level === "gold"
                      ? "text-yellow-500"
                      : selectedAchievement.level === "silver"
                        ? isDark ? "text-zinc-300" : "text-zinc-400"
                        : "text-amber-700"
                  }
                  stroke={1.5}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">{selectedAchievement.name}</h2>
                  {renderLevelBadge(selectedAchievement.level)}
                </div>
                <h3 className={`text-base ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                  {selectedAchievement.member}
                </h3>
                <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {selectedAchievement.date}
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-zinc-700/50' : 'bg-zinc-50'}`}>
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm">{selectedAchievement.details}</p>
            </div>

            {selectedAchievement.tags && (
              <div>
                <h3 className="font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAchievement.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-100 text-zinc-700'
                        }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                className={`px-4 py-2 rounded-md ${isDark ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-zinc-100 hover:bg-zinc-200'}`}
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Section */}
      <div className="mt-12">
        <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
          <IconFilter size={22} className={isDark ? "text-violet-400" : "text-violet-600"} />
          Achievement Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl ${isDark ? 'bg-zinc-800/30' : 'bg-white border border-zinc-100 shadow-sm'}`}>
            <h3 className={`text-lg font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`}>
              {achievements.filter(a => a.level === 'gold').length}
            </h3>
            <p className={`${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Gold Achievements</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-zinc-800/30' : 'bg-white border border-zinc-100 shadow-sm'}`}>
            <h3 className={`text-lg font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-400'}`}>
              {achievements.filter(a => a.level === 'silver').length}
            </h3>
            <p className={`${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Silver Achievements</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-zinc-800/30' : 'bg-white border border-zinc-100 shadow-sm'}`}>
            <h3 className={`text-lg font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
              {achievements.filter(a => a.level === 'bronze').length}
            </h3>
            <p className={`${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Bronze Achievements</p>
          </div>
          <div className={`p-4 rounded-xl ${isDark ? 'bg-zinc-800/30' : 'bg-white border border-zinc-100 shadow-sm'}`}>
            <h3 className={`text-lg font-bold ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
              {new Set(achievements.map(a => a.member)).size}
            </h3>
            <p className={`${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Total Achievers</p>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
