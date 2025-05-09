"use client";

import { usePathname, useRouter } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import {
  Icon,
  IconBrandThreads,
  IconCalendar,
  IconFileSmile,
  IconHome,
  IconMoon,
  IconProps,
  IconSun,
  IconTrophy,
  IconUser,
  IconCode,
  IconLogin,
  IconMenu2,
} from "@tabler/icons-react";
import { useTheme } from "@/app/_contexts/ThemeContext";
import { useModal } from "@/app/_contexts/ModalContext";
import Modal from "@/app/_components/reusable/modal";
import { useState } from "react";

// Define type outside the component to improve clarity
type Tab = {
  name: string;
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  route: string;
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { modalType, isModalOpen, openModal, closeModal } = useModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = theme === 'dark';

  const tabs: Tab[] = [
    {
      name: "Home",
      icon: IconHome,
      route: "/",
    },
    {
      name: "Calendar",
      icon: IconCalendar,
      route: "/calendar",
    },
    {
      name: "Forum",
      icon: IconBrandThreads,
      route: "/forum",
    },
    {
      name: "Resources",
      icon: IconFileSmile,
      route: "/resources",
    },
    {
      name: "Achievement",
      icon: IconTrophy,
      route: "/achievement",
    },
  ];

  const handleClickTab = (route: string) => {
    router.push(route);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`sticky top-0 z-50 flex flex-row justify-between py-4 px-3 sm:py-6 sm:px-5 items-center border-b ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white'}`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded ${isDark ? 'bg-violet-900' : 'bg-violet-100'}`}>
            <IconCode
              size={20}
              className={isDark ? 'text-violet-300' : 'text-violet-700'}
              stroke={2}
            />
          </div>
          <div className="text-xl font-bold">FCoder</div>
        </div>

        {/* Hamburger menu for mobile */}
        <button
          className="md:hidden p-2 rounded-md"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <IconMenu2 size={22} />
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:block flex-1 max-w-2xl mx-auto">
          <div className="grid grid-cols-5 w-full">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = pathname === tab.route;

              return (
                <div
                  key={tab.name}
                  className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${isActive
                    ? `border-b-2 ${isDark ? 'border-violet-400' : 'border-violet-600'} -mb-[9px] pb-[7px]`
                    : 'hover:opacity-80'
                    }`}
                  onClick={() => handleClickTab(tab.route)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Navigate to ${tab.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleClickTab(tab.route);
                  }}
                >
                  <div className={`p-2 rounded-md ${isActive
                    ? isDark ? 'bg-violet-900 text-violet-200' : 'bg-violet-100 text-violet-700'
                    : isDark ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-700'
                    }`}>
                    <IconComponent size={22} stroke={1.5} />
                  </div>
                  <span className="text-xs mt-1.5">{tab.name}</span>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Right side buttons */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          <button
            className={`p-2 rounded-md transition-colors ${isDark ? 'bg-zinc-800 text-yellow-300 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
              }`}
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <IconSun size={20} stroke={1.5} /> : <IconMoon size={20} stroke={1.5} />}
          </button>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              className={`py-1.5 px-3 text-sm rounded-md transition-colors flex items-center gap-1.5 ${isDark
                ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                }`}
              onClick={() => openModal('login')}
            >
              <IconLogin size={16} stroke={1.5} />
              Login
            </button>
            <button
              className={`py-1.5 px-3 text-sm rounded-md transition-colors flex items-center gap-1.5 ${isDark
                ? 'bg-violet-600 text-white hover:bg-violet-700'
                : 'bg-violet-600 text-white hover:bg-violet-700'
                }`}
              onClick={() => openModal('signup')}
            >
              Sign up
            </button>
          </div>

          {/* User Profile Button */}
          <button
            className={`p-2 rounded-md transition-colors ${isDark ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
              }`}
            title="User profile"
            aria-label="User profile"
          >
            <IconUser size={20} stroke={1.5} />
          </button>
        </div>
      </header>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className={`md:hidden fixed z-40 inset-x-0 top-[61px] border-b shadow-lg ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="px-4 py-3">
            {/* Mobile navigation */}
            <nav className="grid grid-cols-3 gap-3 mb-4">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = pathname === tab.route;

                return (
                  <div
                    key={tab.name}
                    className={`flex flex-col items-center justify-center py-2 cursor-pointer rounded-md ${isActive
                      ? isDark ? 'bg-violet-900/30 text-violet-300' : 'bg-violet-100 text-violet-700'
                      : isDark ? 'bg-zinc-800/50 text-zinc-300' : 'bg-zinc-100 text-zinc-700'
                      }`}
                    onClick={() => handleClickTab(tab.route)}
                  >
                    <IconComponent size={20} stroke={1.5} />
                    <span className="text-xs mt-1">{tab.name}</span>
                  </div>
                );
              })}
            </nav>

            {/* Mobile action buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-700">
              <button
                className={`p-2 rounded-md transition-colors ${isDark ? 'text-yellow-300' : 'text-zinc-800'}`}
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {isDark ? <IconSun size={20} stroke={1.5} /> : <IconMoon size={20} stroke={1.5} />}
              </button>

              <div className="flex gap-2">
                <button
                  className={`py-1.5 px-3 text-sm rounded-md transition-colors ${isDark
                    ? 'bg-zinc-800 text-zinc-200'
                    : 'bg-zinc-100 text-zinc-800'}`}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openModal('login');
                  }}
                >
                  Login
                </button>
                <button
                  className={`py-1.5 px-3 text-sm rounded-md transition-colors bg-violet-600 text-white`}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openModal('signup');
                  }}
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <Modal
        opened={isModalOpen && modalType === 'login'}
        onClose={closeModal}
        className={`w-full max-w-md ${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Log in to Fcoder</h2>
            <button
              onClick={closeModal}
              className={`p-1 rounded-full hover:${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}
            >
              &times;
            </button>
          </div>

          <form className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`w-full px-3 py-2 border rounded-md ${isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-white border-zinc-300 text-black'
                  }`}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`w-full px-3 py-2 border rounded-md ${isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-white border-zinc-300 text-black'
                  }`}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${isDark ? 'bg-violet-600 hover:bg-violet-700' : 'bg-violet-600 hover:bg-violet-700'
                }`}
            >
              Log in
            </button>
          </form>

          <div className="text-center text-sm">
            <p className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
              Don&apos;t have an account?{' '}
              <button
                className={`font-medium ${isDark ? 'text-violet-400' : 'text-violet-600'}`}
                onClick={() => {
                  closeModal();
                  setTimeout(() => openModal('signup'), 100);
                }}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </Modal>

      {/* Signup Modal */}
      <Modal
        opened={isModalOpen && modalType === 'signup'}
        onClose={closeModal}
        className={`w-full max-w-md ${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Create an account</h2>
            <button
              onClick={closeModal}
              className={`p-1 rounded-full hover:${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>

          <form className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="signup-email"
                className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                className={`w-full px-3 py-2 border rounded-md ${isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-white border-zinc-300 text-black'
                  }`}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
              >
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                className={`w-full px-3 py-2 border rounded-md ${isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-white border-zinc-300 text-black'
                  }`}
                placeholder="••••••••"
                required
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Minimum 8 characters with at least one number
              </p>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                className={`w-full px-3 py-2 border rounded-md ${isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-white border-zinc-300 text-black'
                  }`}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="mt-2">
              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${isDark ? 'bg-violet-600 hover:bg-violet-700' : 'bg-violet-600 hover:bg-violet-700'
                  }`}
              >
                Create account
              </button>
            </div>
          </form>

          <div className="text-center text-sm">
            <p className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
              Already have an account?{' '}
              <button
                className={`font-medium ${isDark ? 'text-violet-400' : 'text-violet-600'} hover:underline`}
                onClick={() => {
                  closeModal();
                  setTimeout(() => openModal('login'), 100);
                }}
                type="button"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
