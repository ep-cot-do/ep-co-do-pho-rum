'use client';

import LayoutWrapper from "@/app/_sections/Wrapper";
import { withAdminAuth } from "@/app/_contexts/AdminContext";
import { useTheme } from "@/app/_contexts/ThemeContext";
import {
  IconDatabase,
  IconRefresh,
  IconDownload,
  IconUpload,
  IconTrash,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconServer,
  IconCloudDownload,
  IconSettings,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { adminApi } from "@/app/_libs/adminApi";

interface DatabaseTable {
  name: string;
  records: number;
  size: string;
  lastUpdated: string;
  status: 'healthy' | 'warning' | 'error';
}

interface BackupFile {
  id: string;
  filename: string;
  size: string;
  createdAt: string;
  type: 'full' | 'incremental';
  status: 'completed' | 'failed' | 'in_progress';
}

function DataManagement() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isBackupInProgress, setIsBackupInProgress] = useState(false);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [tables, setTables] = useState<DatabaseTable[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load database stats from API
  useEffect(() => {
    const loadDatabaseStats = async () => {
      setIsLoading(true);
      try {
        const response = await adminApi.getDatabaseStats();
        if (response.success && response.data) {
          setTables(response.data.tables || []);
        }
      } catch (error) {
        console.error('Failed to load database stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDatabaseStats();
  }, []);

  const [backups, setBackups] = useState<BackupFile[]>([
    {
      id: '1',
      filename: 'fcoder_backup_20241220_143000.sql',
      size: '456.8 MB',
      createdAt: '2024-12-20 14:30:00',
      type: 'full',
      status: 'completed'
    },
    {
      id: '2',
      filename: 'fcoder_backup_20241219_140000.sql',
      size: '445.2 MB',
      createdAt: '2024-12-19 14:00:00',
      type: 'full',
      status: 'completed'
    },
    {
      id: '3',
      filename: 'fcoder_incremental_20241220_120000.sql',
      size: '23.4 MB',
      createdAt: '2024-12-20 12:00:00',
      type: 'incremental',
      status: 'completed'
    },
    {
      id: '4',
      filename: 'fcoder_backup_20241218_140000.sql',
      size: '442.1 MB',
      createdAt: '2024-12-18 14:00:00',
      type: 'full',
      status: 'failed'
    }
  ]);

  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      healthy: isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800',
      warning: isDark ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
      error: isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800',
    };

    const icons = {
      healthy: IconCheck,
      warning: IconAlertTriangle,
      error: IconX,
    };

    const Icon = icons[status as keyof typeof icons];

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${colors[status as keyof typeof colors]}`}>
        <Icon size={12} />
        {status}
      </span>
    );
  };

  const BackupStatusBadge = ({ status }: { status: string }) => {
    const colors = {
      completed: isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800',
      failed: isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800',
      in_progress: isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${colors[status as keyof typeof colors]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const TypeBadge = ({ type }: { type: string }) => {
    const colors = {
      full: isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800',
      incremental: isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${colors[type as keyof typeof colors]}`}>
        {type}
      </span>
    );
  };

  const handleTableSelect = (tableName: string) => {
    setSelectedTables(prev =>
      prev.includes(tableName)
        ? prev.filter(t => t !== tableName)
        : [...prev, tableName]
    );
  };

  const handleSelectAll = () => {
    setSelectedTables(selectedTables.length === tables.length ? [] : tables.map(t => t.name));
  };

  const handleCreateBackup = async (type: 'full' | 'incremental') => {
    setIsBackupInProgress(true);
    try {
      const response = await adminApi.createBackup(type);
      if (response.success) {
        // Add to backups list
        const newBackup: BackupFile = {
          id: Date.now().toString(),
          filename: response.data?.filename || `fcoder_${type}_${Date.now()}.sql`,
          size: type === 'full' ? '450.0 MB' : '25.0 MB',
          createdAt: new Date().toISOString().replace('T', ' ').split('.')[0],
          type,
          status: 'completed'
        };
        setBackups(prev => [newBackup, ...prev]);
      }
    } catch (error) {
      console.error('Failed to create backup:', error);
      alert('Failed to create backup. Please try again.');
    } finally {
      setIsBackupInProgress(false);
    }
  };

  const handleDeleteBackup = (backupId: string) => {
    if (confirm('Are you sure you want to delete this backup?')) {
      setBackups(prev => prev.filter(b => b.id !== backupId));
    }
  };

  const totalRecords = tables.reduce((sum, table) => sum + table.records, 0);
  const totalSize = tables.reduce((sum, table) => sum + parseFloat(table.size), 0);
  const healthyTables = tables.filter(t => t.status === 'healthy').length;
  const warningTables = tables.filter(t => t.status === 'warning').length;
  const errorTables = tables.filter(t => t.status === 'error').length;

  return (
    <LayoutWrapper maxWidth="w-full" isAdmin={true} showFooter={false}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Data Management
            </h1>
            <p className={`mt-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
              Monitor database health, manage backups, and maintain data integrity
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${isDark
                  ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
              <IconRefresh size={20} />
              Refresh
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${isDark
                  ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
              <IconSettings size={20} />
              Settings
            </button>
          </div>
        </div>

        {/* Database Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
            }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'
                }`}>
                <IconDatabase size={20} className={isDark ? 'text-blue-300' : 'text-blue-600'} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {tables.length}
                </div>
                <div className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                  Total Tables
                </div>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
            }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-green-900/50' : 'bg-green-100'
                }`}>
                <IconCheck size={20} className={isDark ? 'text-green-300' : 'text-green-600'} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {totalRecords.toLocaleString()}
                </div>
                <div className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                  Total Records
                </div>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
            }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'
                }`}>
                <IconServer size={20} className={isDark ? 'text-purple-300' : 'text-purple-600'} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {totalSize.toFixed(1)} MB
                </div>
                <div className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                  Database Size
                </div>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
            }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${errorTables > 0 ?
                  isDark ? 'bg-red-900/50' : 'bg-red-100' :
                  warningTables > 0 ?
                    isDark ? 'bg-yellow-900/50' : 'bg-yellow-100' :
                    isDark ? 'bg-green-900/50' : 'bg-green-100'
                }`}>
                {errorTables > 0 ?
                  <IconX size={20} className={isDark ? 'text-red-300' : 'text-red-600'} /> :
                  warningTables > 0 ?
                    <IconAlertTriangle size={20} className={isDark ? 'text-yellow-300' : 'text-yellow-600'} /> :
                    <IconCheck size={20} className={isDark ? 'text-green-300' : 'text-green-600'} />
                }
              </div>
              <div>
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {healthyTables}/{tables.length}
                </div>
                <div className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                  Healthy Tables
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Database Tables */}
        <div className={`rounded-xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
          } shadow-sm overflow-hidden`}>
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Database Tables
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${isDark
                      ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {selectedTables.length === tables.length ? 'Deselect All' : 'Select All'}
                </button>
                <button
                  disabled={selectedTables.length === 0}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${selectedTables.length === 0
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : isDark
                        ? 'bg-violet-600 text-white hover:bg-violet-700'
                        : 'bg-violet-600 text-white hover:bg-violet-700'
                    }`}
                >
                  Export Selected
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDark ? 'bg-zinc-800/50' : 'bg-gray-50'}>
                  <tr>
                    <th className="w-8 px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedTables.length === tables.length}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                      }`}>
                      Table Name
                    </th>
                    <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                      }`}>
                      Records
                    </th>
                    <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                      }`}>
                      Size
                    </th>
                    <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                      }`}>
                      Last Updated
                    </th>
                    <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                      }`}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-zinc-800' : 'divide-gray-200'}`}>
                  {tables.map((table) => (
                    <tr key={table.name} className={`hover:${isDark ? 'bg-zinc-800/30' : 'bg-gray-50'} transition-colors`}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedTables.includes(table.name)}
                          onChange={() => handleTableSelect(table.name)}
                          className="rounded"
                        />
                      </td>
                      <td className={`px-6 py-4 text-sm font-mono ${isDark ? 'text-zinc-200' : 'text-gray-900'}`}>
                        {table.name}
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                        {table.records.toLocaleString()}
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                        {table.size}
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                        {table.lastUpdated}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={table.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Backup Management */}
        <div className={`rounded-xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
          } shadow-sm overflow-hidden`}>
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Backup Management
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCreateBackup('incremental')}
                  disabled={isBackupInProgress}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${isBackupInProgress
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : isDark
                        ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <IconCloudDownload size={20} />
                  Incremental Backup
                </button>
                <button
                  onClick={() => handleCreateBackup('full')}
                  disabled={isBackupInProgress}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isBackupInProgress
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : isDark
                        ? 'bg-violet-600 text-white hover:bg-violet-700'
                        : 'bg-violet-600 text-white hover:bg-violet-700'
                    }`}
                >
                  <IconDownload size={20} />
                  {isBackupInProgress ? 'Creating Backup...' : 'Full Backup'}
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDark ? 'bg-zinc-800/50' : 'bg-gray-50'}>
                <tr>
                  <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                    }`}>
                    Filename
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                    }`}>
                    Type
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                    }`}>
                    Size
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                    }`}>
                    Created At
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                    }`}>
                    Status
                  </th>
                  <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                    }`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-zinc-800' : 'divide-gray-200'}`}>
                {backups.map((backup) => (
                  <tr key={backup.id} className={`hover:${isDark ? 'bg-zinc-800/30' : 'bg-gray-50'} transition-colors`}>
                    <td className={`px-6 py-4 text-sm font-mono ${isDark ? 'text-zinc-200' : 'text-gray-900'}`}>
                      {backup.filename}
                    </td>
                    <td className="px-6 py-4">
                      <TypeBadge type={backup.type} />
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                      {backup.size}
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                      {backup.createdAt}
                    </td>
                    <td className="px-6 py-4">
                      <BackupStatusBadge status={backup.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className={`p-1.5 rounded hover:${isDark ? 'bg-zinc-700' : 'bg-gray-100'
                            } transition-colors`}
                          title="Download backup"
                        >
                          <IconDownload size={16} className={isDark ? 'text-zinc-400' : 'text-gray-600'} />
                        </button>
                        <button
                          onClick={() => handleDeleteBackup(backup.id)}
                          className={`p-1.5 rounded hover:${isDark ? 'bg-red-900/50' : 'bg-red-100'
                            } transition-colors`}
                          title="Delete backup"
                        >
                          <IconTrash size={16} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}

export default withAdminAuth(DataManagement);
