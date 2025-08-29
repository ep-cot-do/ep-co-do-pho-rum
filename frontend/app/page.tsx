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
import { coreMembersData, CoreMember, ImageErrorState } from "./_data/coreMembers";
import { useState, useEffect } from "react";
import Image from "next/image";
import "./animation.css"; // Import the new animation CSS file

// Fake data for demonstration
// const achievements: AchievementItem[] = [
//   { name: "Nguyen Hoang Khang", description: "Accepted AI paper", level: "gold" },
//   { name: "Nguyen Vu Nhu Huynh", description: "Accepted AI paper", level: "gold" },
//   { name: "Tran Cong Luan", description: "Second place in FPTU Code Arena", level: "silver" },
//   { name: "Lam Tan Phat", description: "Second place in FPTU Code Arena", level: "silver" },
//   { name: "Doan Vo Quoc Thai", description: "Second place in FPTU Code Arena", level: "silver" },
// ];

// Group images for rotating carousel
const groupImages = [
  "/images/group/main.jpg",
  "/images/group/main1.jpg"
];

export default function Home() {
  const { theme } = useTheme();
  const isDark: boolean = theme === "dark";
  const [imageErrors, setImageErrors] = useState<ImageErrorState>({});
  const [selectedMember, setSelectedMember] = useState<CoreMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

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

  // Auto-rotate group images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % groupImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <LayoutWrapper maxWidth="w-full">
      {/* Club header / introduction */}
      <header className="relative w-full mb-8 p-6 md:p-8 lg:p-10 animate-fade-in-up">

        {/* Main content */}
        <div className="relative z-10 stagger-children">
          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-12">
            {/* Left side - Text content */}
            <div className="flex-1 lg:max-w-2xl w-full lg:text-left">
              {/* Title with enhanced styling */}
              <div className="mb-4">
                <h1 className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-2 leading-tight ${isDark ? "text-gradient-animated" : "text-gradient-animated"
                  }`}>
                  FCoder
                </h1>
                <div className={`h-1 w-20 rounded-full animate-gradient ${isDark
                  ? "bg-gradient-to-r from-violet-400 to-purple-500"
                  : "bg-gradient-to-r from-violet-500 to-purple-600"
                  }`}></div>
              </div>

              {/* Subtitle */}
              <p className={`text-lg md:text-xl font-semibold mb-4 ${isDark ? "text-violet-300" : "text-violet-700"
                }`}>
                Empowering Student Developers
              </p>

              {/* Description with better typography */}
              <p className={`text-sm md:text-base lg:text-lg leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-700"
                }`}>
                FCoder is a vibrant programming club dedicated to fostering innovation and collaboration among students.
                We create an ecosystem where aspiring developers can learn, grow, and build impactful projects together.
                Through workshops, coding challenges, and community events, we bridge the gap between academic learning
                and real-world software development.
              </p>
            </div>

            {/* Right side - Group Images Carousel */}
            <div className="flex-shrink-0 lg:flex-1 w-full lg:w-auto flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-none flex justify-center">
                <div className={`absolute inset-0 rounded-2xl blur-xl opacity-20 animate-pulse-glow ${isDark ? "bg-violet-500" : "bg-violet-400"
                  }`}></div>
                <div className="relative p-4 lg:p-8">
                  <div className="relative w-64 h-48 md:w-80 md:h-56 lg:w-96 lg:h-72 xl:w-[28rem] xl:h-80 rounded-2xl overflow-hidden shadow-2xl">
                    {groupImages.map((imageSrc, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                          }`}
                      >
                        <Image
                          src={imageSrc}
                          alt={`FCoder Group Photo ${index + 1}`}
                          fill
                          className="object-cover animate-float"
                          style={{ animationDelay: `${index * 0.5}s` }}
                          priority={index === 0}
                        />
                      </div>
                    ))}
                    {/* Image overlay with gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${isDark
                      ? "from-zinc-900/20 via-transparent to-violet-900/10"
                      : "from-white/10 via-transparent to-violet-100/10"
                      }`}></div>
                  </div>

                  {/* Image indicators */}
                  <div className="flex justify-center mt-4 space-x-2">
                    {groupImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex
                          ? isDark ? "bg-violet-400 w-6" : "bg-violet-600 w-6"
                          : isDark ? "bg-zinc-600 hover:bg-zinc-500" : "bg-zinc-300 hover:bg-zinc-400"
                          }`}
                        aria-label={`View group photo ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Committee / leadership per generation */}
      <section className="w-full animate-fade-in-up">
        <div className="w-full mb-8">
          <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${isDark ? "text-white" : "text-zinc-800"}`}>
            Committee / Leadership per Generation
          </h2>
          <div className={`h-0.5 w-32 rounded-full ${isDark
            ? "bg-gradient-to-r from-violet-400 to-purple-500"
            : "bg-gradient-to-r from-violet-500 to-purple-600"
            }`}></div>
        </div>
      </section>
      {/* Achievements and Core Team - Responsive layout */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Core Team Section - Full width on mobile, 4/5 on desktop */}
        <section className="w-full">
          {coreMembersData.map((generation, genIndex: number) => (
            <div key={genIndex} className="mb-12 animate-fade-in-up" style={{ animationDelay: `${genIndex * 0.2}s` }}>
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isDark ? "bg-violet-500/20 text-violet-400" : "bg-violet-100 text-violet-600"
                    }`}>
                    <IconUser size={24} stroke={1.5} />
                  </div>
                  <div>
                    <h2 className={`text-xl md:text-2xl font-bold ${isDark ? "text-white" : "text-zinc-800"}`}>
                      {generation.title}
                    </h2>
                    <div className={`h-0.5 w-16 rounded-full mt-1 ${isDark
                      ? "bg-gradient-to-r from-violet-400 to-purple-500"
                      : "bg-gradient-to-r from-violet-500 to-purple-600"
                      }`}></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5 stagger-children">
                {generation.members.map((member, index: number) => (
                  <div
                    key={index}
                    className={`flex flex-col rounded-xl overflow-hidden cursor-pointer hover-scale hover-glow transition-all duration-300 ${isDark
                      ? "bg-zinc-800/60 border border-zinc-700/50 shadow-lg"
                      : "bg-white border border-zinc-200/80 shadow-md hover:shadow-xl"
                      }`}
                    onClick={() => openMemberProfile(member)}
                  >
                    <div
                      className={`relative h-56 sm:h-64 ${isDark ? "bg-zinc-700" : "bg-zinc-100"
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
                            className={`${isDark ? "text-zinc-600" : "text-zinc-300"
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
                        className={`text-xs md:text-sm font-medium ${isDark ? "text-violet-400" : "text-violet-600"
                          }`}
                      >
                        {member.role}
                      </p>
                      <p
                        className={`mt-1 md:mt-2 text-xs md:text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"
                          }`}
                      >
                        {member.description}
                      </p>
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
            className={`relative w-full max-w-md mx-4 rounded-xl overflow-hidden shadow-2xl transform transition-all ${isDark ? "bg-zinc-900" : "bg-white"} animate-modal-scale-open`}
          >
            {/* Close Button */}
            <button
              onClick={closeMemberProfile}
              className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${isDark
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
                  className={`h-64 relative ${isDark ? "bg-zinc-800" : "bg-zinc-100"
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
                    className={`text-lg font-medium mb-4 ${isDark ? "text-violet-400" : "text-violet-600"
                      }`}
                  >
                    {selectedMember.role}
                  </p>
                  <p
                    className={`text-sm mb-6 ${isDark ? "text-zinc-400" : "text-zinc-600"
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
                            className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"
                              }`}
                          >
                            Student Code
                          </p>
                          <p
                            className={`font-medium ${isDark ? "text-white" : "text-black"
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
                            className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"
                              }`}
                          >
                            Email
                          </p>
                          <a
                            href={`mailto:${selectedMember.email}`}
                            className={`font-medium transition-colors ${isDark
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
                            className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"
                              }`}
                          >
                            Facebook
                          </p>
                          <a
                            href={selectedMember.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`font-medium transition-colors ${isDark
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
