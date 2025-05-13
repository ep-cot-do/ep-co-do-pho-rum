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
  IconChartBar,
} from "@tabler/icons-react";
import { useTheme } from "@/app/_contexts/ThemeContext";
import { useModal } from "@/app/_contexts/ModalContext";
import Modal from "@/app/_components/reusable/modal";
import { useState } from "react";
import { Account } from "@/app/_libs/types";
import { Signup } from "@/app/_apis/user/auth";

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
      name: "Insight",
      icon: IconChartBar,
      route: "/insights",
    },
    {
      name: "Schedule",
      icon: IconCalendar,
      route: "/schedules",
    },
    {
      name: "Thread",
      icon: IconBrandThreads,
      route: "/threads",
    },
    {
      name: "Material",
      icon: IconFileSmile,
      route: "/materials",
    },
    {
      name: "Accomplishment",
      icon: IconTrophy,
      route: "/accomplishments",
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

  // const [loginForm, setLoginForm] = useState<Partial<Account>>({
  //   username: "",
  //   password: "",
  // });

  const handleClickTab = (route: string) => {
    router.push(route);
    setMobileMenuOpen(false);
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setSignupForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  }

  // const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value, type } = e.target as HTMLInputElement;

  //   setLoginForm((prev) => ({
  //     ...prev,
  //     [name]: type === "number" ? Number(value) : value,
  //   }));
  // }

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
      <header className={`sticky top-0 z-50 flex flex-row justify-between py-4 px-3 sm:py-6 sm:px-5 items-center border-b ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white'}`}>
        <div className="flex items-center gap-2 cursor-pointer"
          onClick={
            () => handleClickTab("/admin")
          }
        >
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

          <form className="flex flex-col gap-4" onSubmit={handleSignupSubmit}>
            {/* Basic Information */}
            <div>
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
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-white border-zinc-300 text-black'
                  }`}
                placeholder="Username"
                required
              />
            </div>

            <div>
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
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-white border-zinc-300 text-black'
                  }`}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
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
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-white border-zinc-300 text-black'
                  }`}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
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
                    ? 'bg-zinc-800 border-zinc-700 text-white'
                    : 'bg-white border-zinc-300 text-black'
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
                    ? 'bg-zinc-800 border-zinc-700 text-white'
                    : 'bg-white border-zinc-300 text-black'
                    }`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Additional information - can be collapsed/expanded if desired */}
            <div className="grid grid-cols-2 gap-3">
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
                    ? 'bg-zinc-800 border-zinc-700 text-white'
                    : 'bg-white border-zinc-300 text-black'
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
                    ? 'bg-zinc-800 border-zinc-700 text-white'
                    : 'bg-white border-zinc-300 text-black'
                    }`}
                  placeholder="Student code"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
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
                  value={signupForm.gender || 'male'}
                  onChange={() => handleSignupChange}
                  className={`w-full px-3 py-2 border rounded-md ${isDark
                    ? 'bg-zinc-800 border-zinc-700 text-white'
                    : 'bg-white border-zinc-300 text-black'
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
                    ? 'bg-zinc-800 border-zinc-700 text-white'
                    : 'bg-white border-zinc-300 text-black'
                    }`}
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
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
                    ? 'bg-zinc-800 border-zinc-700 text-white'
                    : 'bg-white border-zinc-300 text-black'
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
                    ? 'bg-zinc-800 border-zinc-700 text-white'
                    : 'bg-white border-zinc-300 text-black'
                    }`}
                />
              </div>
            </div>

            <div>
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
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-white border-zinc-300 text-black'
                  }`}
                placeholder="Current term"
              />
            </div>

            <div className="mt-2">
              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-md text-white font-medium
                        ${isDark ? 'bg-violet-600 hover:bg-violet-700' : 'bg-violet-600 hover:bg-violet-700'
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
