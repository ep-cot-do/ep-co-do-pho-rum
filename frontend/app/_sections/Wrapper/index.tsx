"use client";

import { ReactNode } from "react";
import UserHeader from "@/app/_sections/User/Header";
import UserFooter from "@/app/_sections/User/Footer";
import AdminHeader from "@/app/_sections/Admin/Header";
import AdminFooter from "@/app/_sections/Admin/Footer";
import { useTheme } from "@/app/_contexts/ThemeContext";
import "@/app/animation.css";

type LayoutWrapperProps = {
  children: ReactNode;
  /**
   * Whether for admin or user layout
   * @default false
   */
  isAdmin?: boolean;
  /**
   * Whether to show the Header component
   * @default true
   */
  showHeader?: boolean;
  /**
   * Whether to show the Footer component
   * @default true
   */
  showFooter?: boolean;
  /**
   * Additional CSS classes for the main content container
   */
  className?: string;
  /**
   * Whether to add padding to the main content
   * @default true
   */
  withPadding?: boolean;
  /**
   * Maximum width for the content container
   * @default 'max-w-7xl'
   */
  maxWidth?: string;
};

export default function LayoutWrapper({
  children,
  isAdmin = false,
  showHeader = true,
  showFooter = true,
  className = "",
  withPadding = true,
  maxWidth = "max-w-7xl",
}: LayoutWrapperProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const Header = isAdmin ? AdminHeader : UserHeader;
  const Footer = isAdmin ? AdminFooter : UserFooter;

  return (
    <div className={`relative flex flex-col min-h-screen overflow-hidden ${isDark
      ? "bg-gradient-to-br from-zinc-900/95 via-zinc-800/90 to-violet-900/50"
      : "bg-gradient-to-br from-white via-violet-50/70 to-violet-100/40"
      }`}>
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10 animate-float ${isDark ? "bg-violet-600" : "bg-violet-300"
          }`}></div>
        <div className={`absolute top-1/2 -left-32 w-64 h-64 rounded-full opacity-8 animate-float ${isDark ? "bg-purple-600" : "bg-purple-300"
          }`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute -bottom-40 right-1/4 w-96 h-96 rounded-full opacity-5 animate-float ${isDark ? "bg-indigo-600" : "bg-indigo-300"
          }`} style={{ animationDelay: '2s' }}></div>
      </div>

      {showHeader && <Header />}

      <main
        className={`relative z-10 flex-grow w-full ${maxWidth} mx-auto ${withPadding ? "px-4 sm:px-6 py-8" : ""
          } ${className}`}
      >
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
}

// // For a page without a footer:
// export default function AuthPage() {
//   return (
//     <LayoutWrapper showFooter={false}>
//       <div>Login form...</div>
//     </LayoutWrapper>
//   );
// }

// // For a full-width page:
// export default function DashboardPage() {
//   return (
//     <LayoutWrapper withPadding={false} maxWidth="w-full">
//       <div>Dashboard content...</div>
//     </LayoutWrapper>
//   );
// }
