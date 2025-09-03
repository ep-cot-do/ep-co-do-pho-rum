import { usePathname, useRouter } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import {
    Icon, IconCalendar, IconMoon,
    IconProps,
    IconSun, IconUser,
    IconCode, IconMenu2,
    IconChartBar,
    IconLogout,
    IconDatabase
} from "@tabler/icons-react";
import { useTheme } from "@/app/_contexts/ThemeContext";
// import { useModal } from "@/app/_contexts/ModalContext";
import { useAdmin } from "@/app/_contexts/AdminContext";
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
  // const { modalType, isModalOpen, openModal, closeModal } = useModal();
  const { user, logout } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = theme === 'dark';

  const tabs: Tab[] = [
    {
      name: "Dashboard",
      icon: IconChartBar,
      route: "/admin/insights",
    },
    {
      name: "Users",
      icon: IconUser,
      route: "/admin/users",
    },
    {
      name: "Problems",
      icon: IconCode,
      route: "/admin/problems",
    },
    {
      name: "Events",
      icon: IconCalendar,
      route: "/admin/events",
    },
    {
      name: "Data",
      icon: IconDatabase,
      route: "/admin/data",
    },
  ];

  const handleClickTab = (route: string) => {
    router.push(route);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`sticky top-0 z-50 flex flex-row justify-between py-4 px-3 sm:py-6 sm:px-5 items-center border-b ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white'}`}>
        <div className="flex items-center gap-2 cursor-pointer"
          onClick={
            () => handleClickTab("/")
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

          {/* Admin User Info */}
          <div className="hidden md:flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-md text-sm ${
              isDark ? 'bg-violet-900/50 text-violet-200' : 'bg-violet-100 text-violet-700'
            }`}>
              Welcome, {user}
            </div>

            <button
              className={`py-1.5 px-3 text-sm rounded-md transition-colors flex items-center gap-1.5 ${isDark
                ? 'bg-red-900/50 text-red-200 hover:bg-red-800/50'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              onClick={logout}
              title="Logout"
            >
              <IconLogout size={16} stroke={1.5} />
              Logout
            </button>
          </div>
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
                <div className={`px-3 py-1.5 rounded-md text-sm ${
                  isDark ? 'bg-violet-900/50 text-violet-200' : 'bg-violet-100 text-violet-700'
                }`}>
                  {user}
                </div>
                <button
                  className={`py-1.5 px-3 text-sm rounded-md transition-colors flex items-center gap-1.5 ${isDark
                    ? 'bg-red-900/50 text-red-200'
                    : 'bg-red-100 text-red-700'}`}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                >
                  <IconLogout size={16} stroke={1.5} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </>
  );
}
