"use client";

import { usePathname, useRouter } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes, useEffect, useRef } from "react";
import {
  Icon,
  IconBrandThreads,
  IconCalendar,
  IconFileSmile,
  IconMoon,
  IconProps,
  IconSun,
  IconTrophy,
  IconUser,
  IconCode,
  IconLogin,
  IconMenu2,
  IconHome,
} from "@tabler/icons-react";
import { useTheme } from "@/app/_contexts/ThemeContext";
import { useModal } from "@/app/_contexts/ModalContext";
import Modal from "@/app/_components/reusable/modal";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./Form/LoginForm";
import SignupForm from "./Form/SignupForm";
import { useAuth } from "@/app/_contexts/AuthContext";

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
  const { isAuthenticated, user, logout, loading } = useAuth();
  const { modalType, isModalOpen, openModal, closeModal } = useModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

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

  const switchToLogin = () => {
    closeModal();
    setTimeout(() => openModal('login'), 100);
  };

  const switchToSignup = () => {
    closeModal();
    setTimeout(() => openModal('signup'), 100);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const closeProfileDropdown = () => {
    setProfileDropdownOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !(profileDropdownRef.current as Node).contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownRef]);

  return (
    <>
      <motion.header
        className={`sticky top-0 z-50 flex flex-row justify-between py-4 px-3 sm:py-6 sm:px-5 items-center border-b ${isDark ? 'border-zinc-800 bg-zinc-900/95 backdrop-blur-sm' : 'border-zinc-200 bg-white/95 backdrop-blur-sm'
          }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          boxShadow: isDark
            ? '0 4px 20px rgba(0, 0, 0, 0.3)'
            : '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}
      >
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleClickTab("/")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.div
            className={`p-1.5 rounded ${isDark ? 'bg-violet-900' : 'bg-violet-100'}`}
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            whileHover={{ rotate: 10, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <IconCode
              size={20}
              className={isDark ? 'text-violet-300' : 'text-violet-700'}
              stroke={2}
            />
          </motion.div>
          <div className="text-xl font-bold">
            FCoder
          </div>
        </motion.div>

        {/* Hamburger menu for mobile */}
        <motion.button
          className="md:hidden p-2 rounded-md"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          whileTap={{ scale: 0.9 }}
        >
          <IconMenu2 size={22} />
        </motion.button>

        {/* Desktop navigation */}
        <nav className="hidden md:block flex-1 max-w-2xl mx-auto">
          <div className="grid grid-cols-5 w-full">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = pathname === tab.route;

              return (
                <motion.div
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
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 * tabs.indexOf(tab) }}
                >
                  <motion.div
                    className={`p-2 rounded-md ${isActive
                      ? isDark ? 'bg-violet-900 text-violet-200' : 'bg-violet-100 text-violet-700'
                      : isDark ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-700'
                      }`}
                    whileHover={{
                      boxShadow: isActive
                        ? isDark
                          ? '0 0 12px rgba(167, 139, 250, 0.4)'
                          : '0 0 12px rgba(124, 58, 237, 0.2)'
                        : 'none'
                    }}
                  >
                    <IconComponent size={22} stroke={1.5} />
                  </motion.div>
                  <span className="text-xs mt-1.5">{tab.name}</span>
                </motion.div>
              );
            })}
          </div>
        </nav>

        {/* Right side buttons */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          <motion.button
            className={`p-2 rounded-md transition-colors ${isDark ? 'bg-zinc-800 text-yellow-300 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
              }`}
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: isDark ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {isDark ? <IconSun size={20} stroke={1.5} /> : <IconMoon size={20} stroke={1.5} />}
            </motion.div>
          </motion.button>

          {/* Conditional rendering based on auth state */}
          {!loading && (
            <>
              {!isAuthenticated ? (
                /* Auth buttons */
                <div className="hidden md:flex items-center gap-2">
                  <motion.button
                    className={`py-1.5 px-3 text-sm rounded-md transition-colors flex items-center gap-1.5 ${isDark
                      ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                      : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                      }`}
                    onClick={() => openModal('login')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      boxShadow: isDark
                        ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                        : '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <IconLogin size={16} stroke={1.5} />
                    Login
                  </motion.button>
                  <motion.button
                    className={`py-1.5 px-3 text-sm rounded-md transition-colors flex items-center gap-1.5 ${isDark
                      ? 'bg-violet-600 text-white hover:bg-violet-700'
                      : 'bg-violet-600 text-white hover:bg-violet-700'
                      }`}
                    onClick={() => openModal('signup')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      boxShadow: '0 2px 10px rgba(124, 58, 237, 0.4)'
                    }}
                  >
                    Sign up
                  </motion.button>
                </div>
              ) : (
                /* User Profile Button with dropdown */
                <div className="relative" ref={profileDropdownRef}>
                  <motion.button
                    className={`p-2 rounded-md transition-colors ${isDark ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                      }`}
                    title={user?.fullName || "User profile"}
                    aria-label="User profile"
                    onClick={toggleProfileDropdown}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      boxShadow: isDark
                        ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                        : '0 2px 8px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    {user?.profileImg ? (
                      <img
                        src={user.profileImg}
                        alt={user.fullName || "Profile"}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <IconUser size={20} stroke={1.5} />
                    )}
                  </motion.button>

                  {/* Profile Dropdown Menu */}
                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg overflow-hidden z-50 ${isDark ? 'bg-zinc-800 border border-zinc-700' : 'bg-white border border-zinc-200'
                          }`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 py-3 border-b border-zinc-700/50">
                          <p className="text-sm font-medium">{user?.fullName || "User"}</p>
                          <p className="text-xs text-zinc-500 truncate">{user?.email || ""}</p>
                        </div>
                        <div className="py-1">
                          <motion.button
                            className={`flex items-center w-full px-4 py-2 text-sm text-left ${isDark ? 'hover:bg-zinc-700 text-zinc-200' : 'hover:bg-zinc-100 text-zinc-800'
                              }`}
                            onClick={() => {
                              logout();
                              closeProfileDropdown();
                            }}
                            whileHover={{ x: 5 }}
                          >
                            <IconLogin size={16} className="mr-2 rotate-180" />
                            Logout
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </div>
      </motion.header>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className={`md:hidden fixed z-40 inset-x-0 top-[61px] border-b shadow-lg ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-3">
              {/* Mobile navigation */}
              <nav className="grid grid-cols-3 gap-3 mb-4">
                {tabs.map((tab, index) => {
                  const IconComponent = tab.icon;
                  const isActive = pathname === tab.route;

                  return (
                    <motion.div
                      key={tab.name}
                      className={`flex flex-col items-center justify-center py-2 cursor-pointer rounded-md ${isActive
                        ? isDark ? 'bg-violet-900/30 text-violet-300' : 'bg-violet-100 text-violet-700'
                        : isDark ? 'bg-zinc-800/50 text-zinc-300' : 'bg-zinc-100 text-zinc-700'
                        }`}
                      onClick={() => handleClickTab(tab.route)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        boxShadow: isActive
                          ? isDark
                            ? '0 4px 12px rgba(139, 92, 246, 0.3)'
                            : '0 4px 12px rgba(139, 92, 246, 0.2)'
                          : isDark
                            ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                            : '0 4px 12px rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      <IconComponent size={20} stroke={1.5} />
                      <span className="text-xs mt-1">{tab.name}</span>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Mobile action buttons */}
              <motion.div
                className="flex items-center justify-between pt-3 border-t border-zinc-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.button
                  className={`p-2 rounded-md transition-colors ${isDark ? 'text-yellow-300' : 'text-zinc-800'}`}
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isDark ? <IconSun size={20} stroke={1.5} /> : <IconMoon size={20} stroke={1.5} />}
                </motion.button>

                {!loading && (
                  <>
                    {!isAuthenticated ? (
                      <div className="flex gap-2">
                        <motion.button
                          className={`py-1.5 px-3 text-sm rounded-md transition-colors ${isDark
                            ? 'bg-zinc-800 text-zinc-200'
                            : 'bg-zinc-100 text-zinc-800'}`}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            openModal('login');
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            boxShadow: isDark
                              ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                              : '0 2px 8px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          Login
                        </motion.button>
                        <motion.button
                          className={`py-1.5 px-3 text-sm rounded-md transition-colors bg-violet-600 text-white`}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            openModal('signup');
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            boxShadow: '0 2px 10px rgba(124, 58, 237, 0.4)'
                          }}
                        >
                          Sign up
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button
                        className={`py-1.5 px-3 text-sm rounded-md transition-colors ${isDark
                          ? 'bg-zinc-800 text-zinc-200'
                          : 'bg-zinc-100 text-zinc-800'}`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          logout();
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          boxShadow: isDark
                            ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                            : '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        Logout
                      </motion.button>
                    )}
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <Modal
        opened={isModalOpen && modalType === 'login'}
        onClose={closeModal}
        className={`w-full max-w-md ${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}
      >
        <LoginForm closeModal={closeModal} switchToSignup={switchToSignup} />
      </Modal>

      {/* Signup Modal */}
      <Modal
        opened={isModalOpen && modalType === 'signup'}
        onClose={closeModal}
        className={`w-full max-w-md ${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}
      >
        <SignupForm closeModal={closeModal} switchToLogin={switchToLogin} />
      </Modal>
    </>
  );
}
