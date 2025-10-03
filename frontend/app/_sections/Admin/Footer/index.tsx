"use client";

import { useTheme } from "@/app/_contexts/ThemeContext";
import {
  IconBrandGithub,
  IconBrandDiscord,
  IconHeart,
  IconMailFilled,
  IconCode,
} from "@tabler/icons-react";
import Link from "next/link";

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Social media links
  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/ep-cot-do/ep-co-do-pho-rum",
      icon: IconBrandGithub,
    },
    {
      name: "Discord",
      href: "https://discord.gg/BAm6AwSM",
      icon: IconBrandDiscord,
    },
    {
      name: "Email",
      href: "mailto:contact@fcoder.com",
      icon: IconMailFilled,
    },
  ];

  return (
    <footer
      className={`border-t ${
        isDark ? "border-zinc-800" : "border-zinc-200"
      } py-8 mt-auto`}
    >
      <div className="w-full mx-auto px-5">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          {/* Brand section with logo and description */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <div
                className={`p-2 rounded-md ${
                  isDark ? "bg-violet-900" : "bg-violet-100"
                }`}
              >
                <IconCode
                  size={20}
                  className={isDark ? "text-violet-300" : "text-violet-700"}
                  stroke={2}
                />
              </div>
              <div className="font-bold text-xl">FCoder</div>
            </div>
            <p
              className={`text-sm ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Empowering developers through community and resources. Learn,
              build, and grow with us.
            </p>
          </div>

          {/* Social links section */}
          <div className="flex flex-col">
            <h3 className="font-semibold mb-3 text-sm">Connect With Us</h3>
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map((socialLink) => {
                const SocialIcon = socialLink.icon;
                return (
                  <Link
                    key={socialLink.name}
                    href={socialLink.href}
                    className={`p-2 rounded-md transition-colors flex items-center gap-2 ${
                      isDark
                        ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                        : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
                    }`}
                    title={socialLink.name}
                    aria-label={`Visit our ${socialLink.name} page`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcon size={18} stroke={1.5} />
                    <span className="text-sm hidden sm:inline">
                      {socialLink.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div
          className={`pt-6 border-t ${
            isDark ? "border-zinc-800" : "border-zinc-200"
          } flex flex-col sm:flex-row justify-between items-center gap-4`}
        >
          <p
            className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
          >
            © {new Date().getFullYear()} Fcoder. All rights reserved.
          </p>
          <div className="flex items-center">
            <span
              className={`flex items-center text-sm ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Made with
              <IconHeart
                size={16}
                className={`mx-1 ${isDark ? "text-red-400" : "text-red-500"}`}
                fill="currentColor"
                stroke={1.5}
              />
              by the Fcoder team
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
