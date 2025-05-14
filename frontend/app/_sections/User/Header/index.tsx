"use client";

import { usePathname, useRouter } from "next/navigation";
import { FormEvent, ForwardRefExoticComponent, RefAttributes } from "react";
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
import { Account } from "@/app/_libs/types";
import { Signup } from "@/app/_apis/user/auth";
import { motion, AnimatePresence } from "framer-motion";

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

  const [signupForm, setSignupForm] = useState<Partial<Account>>({
    username: "",
    password: "",
    rePassword: "",
    email: "",
    github: "",
    studentCode: "",
    fullName: "",
    gender: 'MALE', // Default value
    phone: undefined,
    major: '',
    birthday: undefined,
    profileImg: '',
    currentTerm: 1,
  })

  const handleClickTab = (route: string) => {
    router.push(route);
    setMobileMenuOpen(false);
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const numValue = (type === "number") ? Number(value) : value;

    setSignupForm((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  }

  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Validate form
      if (signupForm.password !== signupForm.rePassword) {
        return;
      }

      // Create full registration object with default values for isActive and fundStatus
      const registrationData = {
        ...signupForm,
        fundStatus: false,  // These will be removed by the Signup function
        isActive: true,     // These will be removed by the Signup function
        phone: signupForm.phone || 0,
        birthday: signupForm.birthday ? new Date(signupForm.birthday) : new Date(),
        currentTerm: signupForm.currentTerm || 1,
      } as Account;

      const response = await Signup(registrationData);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to sign up');
      }

      // Success handling
      closeModal();
      // You might want to automatically log in the user or redirect them
      // Or show a success notification

    } catch (error) {
      console.error("Signup error:", error);
    } finally {//
    }
  };


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

          {/* Auth buttons */}
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

          {/* User Profile Button */}
          <motion.button
            className={`p-2 rounded-md transition-colors ${isDark ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
              }`}
            title="User profile"
            aria-label="User profile"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: isDark
                ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                : '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}
          >
            <IconUser size={20} stroke={1.5} />
          </motion.button>
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
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center">
            <motion.h2
              className="text-xl font-bold"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Log in to
              <span className="text-violet-500 ml-1">Fcoder</span>
            </motion.h2>
            <motion.button
              onClick={closeModal}
              className={`p-1 rounded-full hover:${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              &times;
            </motion.button>
          </div>

          <motion.form
            className="flex flex-col gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
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
                  ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                  : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                  }`}
                placeholder="your@email.com"
                required
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
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
                  ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                  : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                  }`}
                placeholder="••••••••"
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${isDark ? 'bg-violet-600 hover:bg-violet-700' : 'bg-violet-600 hover:bg-violet-700'
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)'
              }}
            >
              Log in
            </motion.button>
          </motion.form>

          <motion.div
            className="text-center text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
              Don&apos;t have an account?{' '}
              <motion.button
                className={`font-medium ${isDark ? 'text-violet-400' : 'text-violet-600'}`}
                onClick={() => {
                  closeModal();
                  setTimeout(() => openModal('signup'), 100);
                }}
                whileHover={{ scale: 1.05, x: 2 }}
              >
                Sign up
              </motion.button>
            </p>
          </motion.div>
        </motion.div>
      </Modal>

      {/* Signup Modal */}
      <Modal
        opened={isModalOpen && modalType === 'signup'}
        onClose={closeModal}
        className={`w-full max-w-md ${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}
      >
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center">
            <motion.h2
              className="text-xl font-bold"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Create an account on
              <span className="text-violet-500 ml-1">Fcoder</span>
            </motion.h2>
            <motion.button
              onClick={closeModal}
              className={`p-1 rounded-full hover:${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close modal"
            >
              &times;
            </motion.button>
          </div>

          <motion.form
            className="flex flex-col gap-4"
            onSubmit={handleSignupSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Basic Information */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label
                htmlFor="username"
                className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={signupForm.username || ''}
                onChange={handleSignupChange}
                className={`w-full px-3 py-2 border rounded-md ${isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                  : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                  }`}
                placeholder="Username"
                required
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={signupForm.email || ''}
                onChange={handleSignupChange}
                className={`w-full px-3 py-2 border rounded-md ${isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                  : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                  }`}
                placeholder="your@email.com"
                required
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label
                htmlFor="fullName"
                className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={signupForm.fullName || ''}
                onChange={handleSignupChange}
                className={`w-full px-3 py-2 border rounded-md ${isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                  : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                  }`}
                placeholder="Your full name"
                required
              />
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div>
                <label
                  htmlFor="password"
                  className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={signupForm.password || ''}
                  onChange={handleSignupChange}
                  className={`w-full px-3 py-2 border rounded-md ${isDark
                    ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                    : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                    }`}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="rePassword"
                  className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
                >
                  Confirm Password
                </label>
                <input
                  id="rePassword"
                  name="rePassword"
                  type="password"
                  value={signupForm.rePassword || ''}
                  onChange={handleSignupChange}
                  className={`w-full px-3 py-2 border rounded-md ${isDark
                    ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                    : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                    }`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </motion.div>

            {/* Additional information - can be collapsed/expanded if desired */}
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div>
                <label
                  htmlFor="github"
                  className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
                >
                  GitHub Username
                </label>
                <input
                  id="github"
                  name="github"
                  type="text"
                  value={signupForm.github || ''}
                  onChange={handleSignupChange}
                  className={`w-full px-3 py-2 border rounded-md ${isDark
                    ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                    : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                    }`}
                  placeholder="GitHub username"
                />
              </div>

              <div>
                <label
                  htmlFor="studentCode"
                  className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
                >
                  Student Code
                </label>
                <input
                  id="studentCode"
                  name="studentCode"
                  type="text"
                  value={signupForm.studentCode || ''}
                  onChange={handleSignupChange}
                  className={`w-full px-3 py-2 border rounded-md ${isDark
                    ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                    : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                    }`}
                  placeholder="Student code"
                />
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div>
                <label
                  htmlFor="gender"
                  className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={signupForm.gender || 'MALE'}
                  onChange={handleSignupChange}
                  className={`w-full px-3 py-2 border rounded-md ${isDark
                    ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                    : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                    }`}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={signupForm.phone || ''}
                  onChange={handleSignupChange}
                  className={`w-full px-3 py-2 border rounded-md ${isDark
                    ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                    : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                    }`}
                  placeholder="Phone number"
                />
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div>
                <label
                  htmlFor="major"
                  className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
                >
                  Major
                </label>
                <input
                  id="major"
                  name="major"
                  type="text"
                  value={signupForm.major || ''}
                  onChange={handleSignupChange}
                  className={`w-full px-3 py-2 border rounded-md ${isDark
                    ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                    : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                    }`}
                  placeholder="Your major"
                />
              </div>

              <div>
                <label
                  htmlFor="birthday"
                  className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
                >
                  Birthday
                </label>
                <input
                  id="birthday"
                  name="birthday"
                  type="date"
                  value={signupForm.birthday ? new Date(signupForm.birthday).toISOString().split('T')[0] : ''}
                  onChange={handleSignupChange}
                  className={`w-full px-3 py-2 border rounded-md ${isDark
                    ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                    : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                    }`}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <label
                htmlFor="currentTerm"
                className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
              >
                Current Term
              </label>
              <input
                id="currentTerm"
                name="currentTerm"
                type="number"
                min="1"
                max="10"
                value={signupForm.currentTerm || 1}
                onChange={handleSignupChange}
                className={`w-full px-3 py-2 border rounded-md ${isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                  : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                  }`}
                placeholder="Current term"
              />
            </motion.div>

            <motion.div
              className="mt-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <motion.button
                type="submit"
                className={`w-full py-2 px-4 rounded-md text-white font-medium
                        ${isDark ? 'bg-violet-600 hover:bg-violet-700' : 'bg-violet-600 hover:bg-violet-700'
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)'
                }}
              >
                Create account
              </motion.button>
            </motion.div>
          </motion.form>

          <motion.div
            className="text-center text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
              Already have an account?{' '}
              <motion.button
                className={`font-medium ${isDark ? 'text-violet-400' : 'text-violet-600'} hover:underline`}
                onClick={() => {
                  closeModal();
                  setTimeout(() => openModal('login'), 100);
                }}
                type="button"
                whileHover={{ scale: 1.05, x: 2 }}
              >
                Log in
              </motion.button>
            </p>
          </motion.div>
        </motion.div>
      </Modal>
    </>
  );
}
