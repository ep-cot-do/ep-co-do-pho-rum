"use client";

import LayoutWrapper from "./_sections/Wrapper";
// import AchievementSection, { AchievementItem } from "./_sections/Achievement";
import { IconUser } from "@tabler/icons-react";
import { useTheme } from "./_contexts/ThemeContext";
import { coreMembersData } from "./_data/coreMembers";
import { useState } from "react";
import Image from "next/image";
import { ImageErrorState } from "./_data/coreMembers";

// Fake data for demonstration
// const achievements: AchievementItem[] = [
//   { name: "Nguyen Hoang Khang", description: "Accepted AI paper", level: "gold" },
//   { name: "Nguyen Vu Nhu Huynh", description: "Accepted AI paper", level: "gold" },
//   { name: "Tran Cong Luan", description: "Second place in FPTU Code Arena", level: "silver" },
//   { name: "Lam Tan Phat", description: "Second place in FPTU Code Arena", level: "silver" },
//   { name: "Doan Vo Quoc Thai", description: "Second place in FPTU Code Arena", level: "silver" },
// ];

export default function Home() {
  const { theme } = useTheme();
  const isDark: boolean = theme === "dark";
  const [imageErrors, setImageErrors] = useState<ImageErrorState>({});

  const handleImageError = (memberIndex: number, genIndex: number): void => {
    setImageErrors((prev: ImageErrorState) => ({
      ...prev,
      [`${genIndex}-${memberIndex}`]: true,
    }));
  };

  return (
    <LayoutWrapper maxWidth="w-full">
      {/* Achievements and Core Team - Responsive layout */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Core Team Section - Full width on mobile, 4/5 on desktop */}
        <section className="w-full">
          {coreMembersData.map((generation, genIndex: number) => (
            <div key={genIndex} className="mb-8">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                  <IconUser
                    className={isDark ? "text-violet-400" : "text-violet-600"}
                    size={22}
                    stroke={1.5}
                  />
                  {generation.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
                {generation.members.map((member, index: number) => (
                  <div
                    key={index}
                    className={`flex flex-col rounded-xl overflow-hidden transition-transform hover:-translate-y-1 ${
                      isDark
                        ? "bg-zinc-800/40"
                        : "bg-white border border-zinc-100 shadow-sm"
                    }`}
                  >
                    <div
                      className={`h-56 sm:h-64 relative ${
                        isDark ? "bg-zinc-700" : "bg-zinc-100"
                      }`}
                    >
                      {member.image && !imageErrors[`${genIndex}-${index}`] ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover object-top"
                          onError={() => handleImageError(index, genIndex)}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <IconUser
                            size={48}
                            className={`${
                              isDark ? "text-zinc-600" : "text-zinc-300"
                            }`}
                            stroke={1}
                          />
                        </div>
                      )}
                    </div>
                    <div className="p-3 md:p-4">
                      <h3 className="font-bold text-base md:text-lg">
                        {member.name}
                      </h3>
                      <p
                        className={`text-xs md:text-sm font-medium ${
                          isDark ? "text-violet-400" : "text-violet-600"
                        }`}
                      >
                        {member.role}
                      </p>
                      <p
                        className={`mt-1 md:mt-2 text-xs md:text-sm ${
                          isDark ? "text-zinc-400" : "text-zinc-600"
                        }`}
                      >
                        {member.description}
                      </p>
                      <div className="mt-3 md:mt-4 flex items-center">
                        <button
                          className={`px-2 md:px-3 py-1 text-xs rounded-md ${
                            isDark
                              ? "bg-zinc-700 hover:bg-zinc-600 text-zinc-300"
                              : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                          }`}
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </LayoutWrapper>
  );
}
