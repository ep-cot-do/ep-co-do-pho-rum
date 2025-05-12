"use client"

import LayoutWrapper from "./_sections/Wrapper";
// import AchievementSection, { AchievementItem } from "./_sections/Achievement";
import { IconUser } from "@tabler/icons-react";
import { useTheme } from "./_contexts/ThemeContext";

// Fake data for demonstration
// const achievements: AchievementItem[] = [
//   { name: "Nguyen Hoang Khang", description: "Accepted AI paper", level: "gold" },
//   { name: "Nguyen Vu Nhu Huynh", description: "Accepted AI paper", level: "gold" },
//   { name: "Tran Cong Luan", description: "Second place in FPTU Code Arena", level: "silver" },
//   { name: "Lam Tan Phat", description: "Second place in FPTU Code Arena", level: "silver" },
//   { name: "Doan Vo Quoc Thai", description: "Second place in FPTU Code Arena", level: "silver" },
// ];

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

      {/* Achievements and Core Team - Responsive layout */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Core Team Section - Full width on mobile, 4/5 on desktop */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <IconUser className={isDark ? "text-violet-400" : "text-violet-600"} size={22} stroke={1.5} />
              Core Team Members
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
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

    </LayoutWrapper>
  );
}
