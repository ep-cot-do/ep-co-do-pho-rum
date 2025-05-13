"use client"

import { IconMedal, IconCrown } from "@tabler/icons-react";
import { useTheme } from "@/app/_contexts/ThemeContext";

// Types
export type AchievementItem = {
  name: string;
  description: string;
  level: "gold" | "silver" | "bronze";
}

interface AchievementProps {
  achievements: AchievementItem[];
  maxItems?: number;
  useGrid?: boolean;
}

function AchievementIcon({ level }: { level: string }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  let color = "";
  if (level === "gold") {
    color = "text-yellow-500";
  } else if (level === "silver") {
    color = isDark ? "text-zinc-300" : "text-zinc-400";
  } else {
    color = "text-amber-700";
  }

  return <IconMedal className={`${color}`} size={32} stroke={1.5} />;
}

export default function AchievementSection({ achievements, maxItems = 6, useGrid = false }: AchievementProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Ensure we don't try to display more items than we have
  const displayItems = achievements.slice(0, maxItems);

  return (
    <section className={`p-4 md:p-6 rounded-xl h-full flex flex-col ${isDark ? 'bg-zinc-800/30' : 'bg-white shadow-sm border border-zinc-100'}`}>
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <IconCrown size={24} className={isDark ? "text-yellow-400" : "text-yellow-500"} stroke={1.5} />
        <h2 className="text-xl font-bold">Recent Achievements</h2>
      </div>

      {/* Grid layout for mobile / list layout for desktop if useGrid=true */}
      <div className={`
        ${useGrid
          ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-1 lg:space-y-4 lg:block'
          : 'space-y-4 md:space-y-6'
        } flex-grow
      `}>
        {displayItems.map((achievement, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-700/50' : 'hover:bg-zinc-50'}`}
          >
            <div className={`flex-shrink-0 p-2 rounded-full ${isDark
              ? achievement.level === "gold"
                ? "bg-yellow-900/30"
                : achievement.level === "silver"
                  ? "bg-zinc-700"
                  : "bg-amber-900/30"
              : achievement.level === "gold"
                ? "bg-yellow-100"
                : achievement.level === "silver"
                  ? "bg-zinc-100"
                  : "bg-amber-100"
              }`}>
              <AchievementIcon level={achievement.level} />
            </div>
            <div>
              <h3 className="font-medium text-sm md:text-base">{achievement.name}</h3>
              <p className={`text-xs md:text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {achievement.description}
              </p>
            </div>
          </div>
        ))}

        {/* Show a placeholder if we have fewer items than maxItems */}
        {displayItems.length === 0 && (
          <div className={`text-center py-8 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            No achievements to display.
          </div>
        )}
      </div>

      {achievements.length > maxItems && (
        <button className={`w-full mt-6 py-2 text-center rounded-md text-sm ${isDark ? 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'}`}>
          View All Achievements
        </button>
      )}
    </section>
  );
}
