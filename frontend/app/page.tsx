"use client"

import LayoutWrapper from "./_sections/Wrapper";
import AchievementSection, { AchievementItem } from "./_sections/Achievement";
import { IconUser } from "@tabler/icons-react";
import { useTheme } from "./_contexts/ThemeContext";

// Fake data for demonstration
const achievements: AchievementItem[] = [
  { name: "Nguyen Hoang Khang", description: "Accepted AI paper", level: "gold" },
  { name: "Nguyen Vu Nhu Huynh", description: "Accepted AI paper", level: "gold" },
  { name: "Tran Cong Luan", description: "Second place in FPTU Code Arena", level: "silver" },
  { name: "Lam Tan Phat", description: "Second place in FPTU Code Arena", level: "silver" },
  { name: "Doan Vo Quoc Thai", description: "Second place in FPTU Code Arena", level: "silver" },
];

const coreMembers = [
  { name: "Nguyen Kim Bao Nguyen", role: "President", description: "Current Fcoder's Generation 5 President" },
  { name: "Le Nhut Anh", role: "Vice President", description: "Vice President of Fcoder's Generation 5, Head of Academics" },
  { name: "Truong Doan Minh Phuc", role: "Vice President", description: "Vice President of Fcoder's Generation 5, Head of Human Resources, Deputy Head of Academics" },
  { name: "Chau Tan Cuong", role: "Head of Events", description: "Head of Events of Fcoder's Generation 5" },
  { name: "Nguyen Quang Huy", role: "Head of Communications", description: "Head of Communications of Fcoder's Generation 5" }
];

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <LayoutWrapper maxWidth="w-full">
      {/* Hero Section */}
      <section className="mb-8 md:mb-16">
        <div className={`rounded-xl p-4 md:p-8 mb-6 md:mb-8 ${isDark ? 'bg-zinc-800/50' : 'bg-violet-50'}`}>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Welcome to the Fcoder Community</h1>
            <p className={`text-base md:text-lg mb-4 md:mb-6 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
              Learn, build, and grow with fellow developers in a supportive community
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <button className={`px-4 md:px-6 py-2 md:py-3 rounded-md font-medium text-sm md:text-base ${isDark ? 'bg-violet-600 text-white hover:bg-violet-700' : 'bg-violet-600 text-white hover:bg-violet-700'}`}>
                Join the Community
              </button>
              <button className={`px-4 md:px-6 py-2 md:py-3 rounded-md font-medium text-sm md:text-base ${isDark ? 'bg-zinc-700 text-zinc-200 hover:bg-zinc-600' : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'}`}>
                Explore Resources
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements and Core Team - Responsive layout */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Recent Achievements Section - Grid on mobile, sidebar on desktop */}
        <div className="w-full lg:w-1/5 order-1 lg:order-1 mb-6 lg:mb-0">
          <AchievementSection achievements={achievements} useGrid={true} />
        </div>

        {/* Core Team Section - Full width on mobile, 4/5 on desktop */}
        <section className="w-full lg:w-4/5 order-2 lg:order-2">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <IconUser className={isDark ? "text-violet-400" : "text-violet-600"} size={22} stroke={1.5} />
              Core Team Members
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {coreMembers.map((member, index) => (
              <div
                key={index}
                className={`flex flex-col rounded-xl overflow-hidden transition-transform hover:-translate-y-1 ${isDark ? 'bg-zinc-800/40' : 'bg-white border border-zinc-100 shadow-sm'}`}
              >
                <div className={`h-32 sm:h-40 relative ${isDark ? 'bg-zinc-700' : 'bg-zinc-100'}`}>
                  {/* Replace with actual images when available */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <IconUser size={48} className={`${isDark ? 'text-zinc-600' : 'text-zinc-300'}`} stroke={1} />
                  </div>
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="font-bold text-base md:text-lg">{member.name}</h3>
                  <p className={`text-xs md:text-sm font-medium ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                    {member.role}
                  </p>
                  <p className={`mt-1 md:mt-2 text-xs md:text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {member.description}
                  </p>
                  <div className="mt-3 md:mt-4 flex items-center">
                    <button className={`px-2 md:px-3 py-1 text-xs rounded-md ${isDark ? 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'}`}>
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Community Stats Section */}
      <section className={`mt-8 md:mt-12 p-4 md:p-8 rounded-xl ${isDark ? 'bg-zinc-800/20' : 'bg-zinc-50'}`}>
        <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-center">Community Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
          <div className="p-2 md:p-3">
            <div className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>100+</div>
            <div className={`mt-1 md:mt-2 text-sm md:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Active Members</div>
          </div>
          <div className="p-2 md:p-3">
            <div className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>1+</div>
            <div className={`mt-1 md:mt-2 text-sm md:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Weekly Events</div>
          </div>
          <div className="p-2 md:p-3">
            <div className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>0+</div>
            <div className={`mt-1 md:mt-2 text-sm md:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Learning Resources</div>
          </div>
          <div className="p-2 md:p-3">
            <div className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>0+</div>
            <div className={`mt-1 md:mt-2 text-sm md:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Partner Companies</div>
          </div>
        </div>
      </section>
    </LayoutWrapper>
  );
}
