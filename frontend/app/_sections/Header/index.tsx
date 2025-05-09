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
} from "@tabler/icons-react";
import { useTheme } from "@/app/_contexts/ThemeContext";
import { useModal } from "@/app/_contexts/ModalContext";
import Modal from "@/app/_components/reusable/modal";

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
  };

  return (
    <>
      <header className={`flex flex-row justify-between py-6 px-5 items-center border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded ${isDark ? 'bg-blue-900' : 'bg-blue-100'}`}>
            <IconCode
              size={20}
              className={isDark ? 'text-blue-300' : 'text-blue-700'}
              stroke={2}
            />
          </div>
          <div className="text-xl font-bold">Fcoder</div>
        </div>

        <nav className="flex-1 max-w-2xl mx-auto flex flex-row justify-center gap-4 sm:gap-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = pathname === tab.route;

            return (
              <div
                key={tab.name}
                className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${isActive
                  ? `border-b-2 ${isDark ? 'border-blue-400' : 'border-blue-600'} -mb-[9px] pb-[7px]`
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
                  ? isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
                  : isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'
                  }`}>
                  <IconComponent size={22} stroke={1.5} />
                </div>
                <span className="text-xs mt-1.5 hidden sm:block">{tab.name}</span>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className={`p-2 rounded-md transition-colors ${isDark ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
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
                ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              onClick={() => openModal('login')}
            >
              <IconLogin size={16} stroke={1.5} />
              Login
            </button>
            <button
              className={`py-1.5 px-3 text-sm rounded-md transition-colors flex items-center gap-1.5 ${isDark
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              onClick={() => openModal('signup')}
            >
              Sign up
            </button>
          </div>

          {/* Mobile auth button */}
          <button
            className={`md:hidden p-2 rounded-md transition-colors ${isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            onClick={() => openModal('login')}
            aria-label="Login or Sign up"
          >
            <IconLogin size={20} stroke={1.5} />
          </button>

          {/* User Profile Button - For demonstration, we're showing both auth and profile buttons */}
          <button
            className={`p-2 rounded-md transition-colors ${isDark ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            title="User profile"
            aria-label="User profile"
          >
            <IconUser size={20} stroke={1.5} />
          </button>
        </div>
      </header>

      {/* Login Modal */}
      <Modal
        opened={isModalOpen && modalType === 'login'}
        onClose={closeModal}
        className={`w-full max-w-md ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Log in to Fcoder</h2>
            <button
              onClick={closeModal}
              className={`p-1 rounded-full hover:${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
              &times;
            </button>
          </div>

          <form className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`w-full px-3 py-2 border rounded-md ${isDark
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-black'
                  }`}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`w-full px-3 py-2 border rounded-md ${isDark
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-black'
                  }`}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              Log in
            </button>
          </form>

          <div className="text-center text-sm">
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Don&apos;t have an account?{' '}
              <button
                className={`font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}
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
        className={`w-full max-w-md ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
      >
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Create an account</h2>
            <button
              onClick={closeModal}
              className={`p-1 rounded-full hover:${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>

          <form className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="signup-email"
                className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                className={`w-full px-3 py-2 border rounded-md ${isDark
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-black'
                  }`}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                className={`w-full px-3 py-2 border rounded-md ${isDark
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-black'
                  }`}
                placeholder="••••••••"
                required
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Minimum 8 characters with at least one number
              </p>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                className={`w-full px-3 py-2 border rounded-md ${isDark
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-black'
                  }`}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="mt-2">
              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                Create account
              </button>
            </div>
          </form>

          <div className="text-center text-sm">
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Already have an account?{' '}
              <button
                className={`font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
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
