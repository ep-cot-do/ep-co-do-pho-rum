'use client';

import LayoutWrapper from "@/app/_sections/Wrapper";
import { withAdminAuth } from "@/app/_contexts/AdminContext";
import { useTheme } from "@/app/_contexts/ThemeContext";
import {
    IconUsers,
    IconCode,
    IconCalendar,
    IconTrophy, IconApi,
    IconChartLine,
    IconActivity,
    IconArrowUp,
    IconArrowDown
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { adminApi } from "@/app/_libs/adminApi";

interface APIEndpoint {
  id: string;
  path: string;
  method: string;
  controller: string;
  calls: number;
  avgResponseTime: number;
  errorRate: number;
  status: 'active' | 'inactive';
}

interface DashboardStats {
  totalUsers: number;
  totalProblems: number;
  totalEvents: number;
  totalSubmissions: number;
  apiCalls: number;
  avgResponseTime: number;
}

function AdminDashboard() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProblems: 0,
    totalEvents: 0,
    totalSubmissions: 0,
    apiCalls: 0,
    avgResponseTime: 0,
  });

  const [apiEndpoints, setApiEndpoints] = useState<APIEndpoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load real data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Load dashboard stats
        const statsResponse = await adminApi.getDashboardStats();
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        }

        // Load API endpoints data
        const endpointsResponse = await adminApi.getApiEndpoints();
        if (endpointsResponse.success && endpointsResponse.data) {
          setApiEndpoints(endpointsResponse.data as APIEndpoint[]);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const StatCard = ({ icon: Icon, title, value, change, changeType }: any) => (
    <div className={`p-6 rounded-xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
      } shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-violet-900/50' : 'bg-violet-100'
            }`}>
            <Icon size={24} className={isDark ? 'text-violet-300' : 'text-violet-600'} />
          </div>
          <div>
            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>{title}</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {value.toLocaleString()}
            </p>
          </div>
        </div>
        {change && (
          <div className={`flex items-center gap-1 ${changeType === 'up' ? 'text-green-500' : 'text-red-500'
            }`}>
            {changeType === 'up' ? <IconArrowUp size={16} /> : <IconArrowDown size={16} />}
            <span className="text-sm font-medium">{change}%</span>
          </div>
        )}
      </div>
    </div>
  );

  const MethodBadge = ({ method }: { method: string }) => {
    const colors = {
      GET: isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800',
      POST: isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800',
      PUT: isDark ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-800',
      DELETE: isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${colors[method as keyof typeof colors]}`}>
        {method}
      </span>
    );
  };

  if (isLoading) {
    return (
      <LayoutWrapper maxWidth="w-full" isAdmin={true} showFooter={false}>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper maxWidth="w-full" isAdmin={true} showFooter={false}>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Admin Dashboard
          </h1>
          <p className={`${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
            Monitor system performance and manage API endpoints
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={IconUsers}
            title="Total Users"
            value={stats.totalUsers}
            change={12}
            changeType="up"
          />
          <StatCard
            icon={IconCode}
            title="Problems"
            value={stats.totalProblems}
            change={5}
            changeType="up"
          />
          <StatCard
            icon={IconCalendar}
            title="Events"
            value={stats.totalEvents}
            change={8}
            changeType="up"
          />
          <StatCard
            icon={IconTrophy}
            title="Submissions"
            value={stats.totalSubmissions}
            change={25}
            changeType="up"
          />
          <StatCard
            icon={IconApi}
            title="API Calls (24h)"
            value={stats.apiCalls}
            change={3}
            changeType="down"
          />
          <StatCard
            icon={IconActivity}
            title="Avg Response (ms)"
            value={stats.avgResponseTime}
            change={15}
            changeType="down"
          />
        </div>

        {/* API Endpoints Table */}
        <div className={`rounded-xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
          } shadow-sm overflow-hidden`}>
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                API Endpoints Performance
              </h2>
              <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark
                ? 'bg-violet-600 text-white hover:bg-violet-700'
                : 'bg-violet-600 text-white hover:bg-violet-700'
                }`}>
                Manage APIs
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDark ? 'bg-zinc-800/50' : 'bg-gray-50'}>
                <tr>
                  <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                    }`}>
                    Endpoint
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                    }`}>
                    Method
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                    }`}>
                    Controller
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                    }`}>
                    Calls
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                    }`}>
                    Avg Response
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                    }`}>
                    Error Rate
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                    }`}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {apiEndpoints.map((endpoint) => (
                  <tr key={endpoint.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className={`px-6 py-4 text-sm font-mono ${isDark ? 'text-zinc-200' : 'text-gray-900'
                      }`}>
                      {endpoint.path}
                    </td>
                    <td className="px-6 py-4">
                      <MethodBadge method={endpoint.method} />
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'
                      }`}>
                      {endpoint.controller}
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'
                      }`}>
                      {endpoint.calls.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'
                      }`}>
                      {endpoint.avgResponseTime}ms
                    </td>
                    <td className={`px-6 py-4 text-sm ${endpoint.errorRate > 3 ? 'text-red-500' : isDark ? 'text-zinc-300' : 'text-gray-700'
                      }`}>
                      {endpoint.errorRate}%
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${endpoint.status === 'active'
                        ? isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'
                        : isDark ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {endpoint.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className={`p-6 rounded-xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
          } shadow-sm`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            API Usage Over Time
          </h3>
          <div className={`h-64 rounded-lg flex items-center justify-center ${isDark ? 'bg-zinc-800/50' : 'bg-gray-50'
            }`}>
            <div className="text-center space-y-2">
              <IconChartLine size={48} className={isDark ? 'text-zinc-600' : 'text-gray-400'} />
              <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                Chart will be implemented here
              </p>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}

export default withAdminAuth(AdminDashboard);
