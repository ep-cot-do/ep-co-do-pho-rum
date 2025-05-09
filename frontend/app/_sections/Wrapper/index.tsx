"use client";

import { ReactNode } from "react";
import Header from "@/app/_sections/Header";
import Footer from "@/app/_sections/Footer";
import { useTheme } from "@/app/_contexts/ThemeContext";

type LayoutWrapperProps = {
  children: ReactNode;
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
  showHeader = true,
  showFooter = true,
  className = "",
  withPadding = true,
  maxWidth = "max-w-7xl",
}: LayoutWrapperProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`flex flex-col min-h-screen ${isDark ? "bg-zinc-900" : "bg-white"}`}>
      {showHeader && <Header />}

      <main
        className={`flex-grow w-full ${maxWidth} mx-auto ${withPadding ? "px-4 sm:px-6 py-8" : ""
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
