"use client";

import LayoutWrapper from "./_sections/Wrapper";
// import AchievementSection, { AchievementItem } from "./_sections/Achievement";
import {
  IconUser,
  IconX,
  IconMail,
  IconBrandFacebook,
  IconSchool,
} from "@tabler/icons-react";
import { useTheme } from "./_contexts/ThemeContext";
import { coreMembersData, CoreMember } from "./_data/coreMembers";
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
  const [selectedMember, setSelectedMember] = useState<CoreMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleImageError = (memberIndex: number, genIndex: number): void => {
    setImageErrors((prev: ImageErrorState) => ({
      ...prev,
      [`${genIndex}-${memberIndex}`]: true,
    }));
  };

  const openMemberProfile = (member: CoreMember): void => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeMemberProfile = (): void => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMember(null), 300); // Wait for animation
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
                      className={`relative h-56 sm:h-64 ${
                        isDark ? "bg-zinc-700" : "bg-zinc-100"
                      }`}
                    >
                      {member.image && !imageErrors[`${genIndex}-${index}`] ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover object-center"
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
                          onClick={() => openMemberProfile(member)}
                          className={`px-2 md:px-3 py-1 text-xs rounded-md transition-colors ${
                            isDark
                              ? "bg-zinc-700 hover:bg-zinc-600 text-zinc-300 hover:text-white"
                              : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900"
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

      {/* Member Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={closeMemberProfile}
          />

          {/* Modal Content */}
          <div
            className={`relative w-full max-w-md mx-4 rounded-xl overflow-hidden shadow-2xl transform transition-all ${
              isDark ? "bg-zinc-900" : "bg-white"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={closeMemberProfile}
              className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${
                isDark
                  ? "bg-black/20 hover:bg-black/40 text-white"
                  : "bg-white/20 hover:bg-white/40 text-black"
              }`}
            >
              <IconX size={20} />
            </button>

            {selectedMember && (
              <>
                {/* Profile Image */}
                <div
                  className={`h-64 relative ${
                    isDark ? "bg-zinc-800" : "bg-zinc-100"
                  }`}
                >
                  {selectedMember.image ? (
                    <Image
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      fill
                      className="object-cover object-center"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <IconUser
                        size={64}
                        className={isDark ? "text-zinc-600" : "text-zinc-300"}
                        stroke={1}
                      />
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedMember.name}
                  </h2>
                  <p
                    className={`text-lg font-medium mb-4 ${
                      isDark ? "text-violet-400" : "text-violet-600"
                    }`}
                  >
                    {selectedMember.role}
                  </p>
                  <p
                    className={`text-sm mb-6 ${
                      isDark ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    {selectedMember.description}
                  </p>

                  {/* Contact Information */}
                  <div className="space-y-3">
                    {selectedMember.studentCode && (
                      <div className="flex items-center gap-3">
                        <IconSchool
                          size={20}
                          className={isDark ? "text-zinc-400" : "text-zinc-500"}
                        />
                        <div>
                          <p
                            className={`text-sm ${
                              isDark ? "text-zinc-400" : "text-zinc-500"
                            }`}
                          >
                            Student Code
                          </p>
                          <p
                            className={`font-medium ${
                              isDark ? "text-white" : "text-black"
                            }`}
                          >
                            {selectedMember.studentCode}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedMember.email && (
                      <div className="flex items-center gap-3">
                        <IconMail
                          size={20}
                          className={isDark ? "text-zinc-400" : "text-zinc-500"}
                        />
                        <div>
                          <p
                            className={`text-sm ${
                              isDark ? "text-zinc-400" : "text-zinc-500"
                            }`}
                          >
                            Email
                          </p>
                          <a
                            href={`mailto:${selectedMember.email}`}
                            className={`font-medium transition-colors ${
                              isDark
                                ? "text-violet-400 hover:text-violet-300"
                                : "text-violet-600 hover:text-violet-700"
                            }`}
                          >
                            {selectedMember.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {selectedMember.facebook && (
                      <div className="flex items-center gap-3">
                        <IconBrandFacebook
                          size={20}
                          className={isDark ? "text-zinc-400" : "text-zinc-500"}
                        />
                        <div>
                          <p
                            className={`text-sm ${
                              isDark ? "text-zinc-400" : "text-zinc-500"
                            }`}
                          >
                            Facebook
                          </p>
                          <a
                            href={selectedMember.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`font-medium transition-colors ${
                              isDark
                                ? "text-violet-400 hover:text-violet-300"
                                : "text-violet-600 hover:text-violet-700"
                            }`}
                          >
                            View Profile
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </LayoutWrapper>
  );
}
