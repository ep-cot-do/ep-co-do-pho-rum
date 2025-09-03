'use client';

import LayoutWrapper from "@/app/_sections/Wrapper";
import { withAdminAuth } from "@/app/_contexts/AdminContext";
import { useTheme } from "@/app/_contexts/ThemeContext";
import {
    IconPlus,
    IconSearch,
    IconEdit,
    IconTrash,
    IconCode,
    IconEye,
    IconDownload,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { adminApi } from "@/app/_libs/adminApi";

interface Problem {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    points: number;
    timeLimit: number;
    memoryLimit: number;
    totalSubmissions: number;
    acceptedSubmissions: number;
    createdAt: string;
    status: 'active' | 'inactive' | 'draft';
    author: string;
}

function ProblemsManagement() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');

    const [problems, setProblems] = useState<Problem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load problems from API
    useEffect(() => {
        const loadProblems = async () => {
            setIsLoading(true);
            try {
                const response = await adminApi.getProblems({
                    search: searchTerm || undefined,
                    difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
                    category: selectedCategory !== 'all' ? selectedCategory : undefined,
                    status: selectedStatus !== 'all' ? selectedStatus : undefined,
                });

                if (response.success && response.data) {
                    setProblems(response.data);
                }
            } catch (error) {
                console.error('Failed to load problems:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProblems();
    }, [searchTerm, selectedDifficulty, selectedCategory, selectedStatus]);

    // Since filtering is now done on backend, we use problems directly
    const filteredProblems = problems;

    const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
        const colors = {
            easy: isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800',
            medium: isDark ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
            hard: isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800',
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${colors[difficulty as keyof typeof colors]}`}>
                {difficulty}
            </span>
        );
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const colors = {
            active: isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800',
            inactive: isDark ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 text-gray-800',
            draft: isDark ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-800',
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${colors[status as keyof typeof colors]}`}>
                {status}
            </span>
        );
    };

    const getAcceptanceRate = (accepted: number, total: number) => {
        if (total === 0) return 0;
        return Math.round((accepted / total) * 100);
    };

    const handleDeleteProblem = async (problemId: string) => {
        if (confirm('Are you sure you want to delete this problem?')) {
            try {
                // Add delete API call when backend supports it
                setProblems(problems.filter(problem => problem.id !== problemId));
            } catch (error) {
                console.error('Failed to delete problem:', error);
                alert('Failed to delete problem. Please try again.');
            }
        }
    };

    const handleStatusChange = async (problemId: string, newStatus: string) => {
        try {
            const response = await adminApi.updateProblemStatus(problemId, newStatus);
            if (response.success) {
                setProblems(problems.map(problem =>
                    problem.id === problemId ? { ...problem, status: newStatus as 'active' | 'inactive' | 'draft' } : problem
                ));
            }
        } catch (error) {
            console.error('Failed to update problem status:', error);
            alert('Failed to update problem status. Please try again.');
        }
    };

    const categories = [...new Set(problems.map(p => p.category))];

    return (
        <LayoutWrapper maxWidth="w-full" isAdmin={true} showFooter={false}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Problems Management
                        </h1>
                        <p className={`mt-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                            Create and manage coding problems for competitions
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${isDark
                                ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <IconDownload size={20} />
                            Export
                        </button>
                        <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isDark
                                ? 'bg-violet-600 text-white hover:bg-violet-700'
                                : 'bg-violet-600 text-white hover:bg-violet-700'
                                }`}
                        >
                            <IconPlus size={20} />
                            Add Problem
                        </button>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                    } shadow-sm`}>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="relative">
                            <IconSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-400' : 'text-gray-400'
                                }`} size={20} />
                            <input
                                type="text"
                                placeholder="Search problems..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${isDark
                                    ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                    } focus:ring-2 focus:ring-violet-500 focus:border-violet-500`}
                            />
                        </div>

                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className={`px-3 py-2 border rounded-lg ${isDark
                                ? 'bg-zinc-800 border-zinc-700 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                                } focus:ring-2 focus:ring-violet-500 focus:border-violet-500`}
                        >
                            <option value="all">All Difficulties</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className={`px-3 py-2 border rounded-lg ${isDark
                                ? 'bg-zinc-800 border-zinc-700 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                                } focus:ring-2 focus:ring-violet-500 focus:border-violet-500`}
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className={`px-3 py-2 border rounded-lg ${isDark
                                ? 'bg-zinc-800 border-zinc-700 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                                } focus:ring-2 focus:ring-violet-500 focus:border-violet-500`}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="draft">Draft</option>
                        </select>

                        <div className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'} flex items-center justify-center`}>
                            {filteredProblems.length} of {problems.length} problems
                        </div>
                    </div>
                </div>

                {/* Problems Table */}
                <div className={`rounded-xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                    } shadow-sm overflow-hidden`}>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className={isDark ? 'bg-zinc-800/50' : 'bg-gray-50'}>
                                    <tr>
                                        <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                            }`}>
                                            Problem
                                        </th>
                                        <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                            }`}>
                                            Difficulty
                                        </th>
                                        <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                            }`}>
                                            Category
                                        </th>
                                        <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                            }`}>
                                            Points
                                        </th>
                                        <th className={`text-left px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                            }`}>
                                            Acceptance Rate
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
                                    {filteredProblems.map((problem) => (
                                        <tr key={problem.id} className={`hover:${isDark ? 'bg-zinc-800/30' : 'bg-gray-50'} transition-colors`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-full ${isDark ? 'bg-violet-900/50' : 'bg-violet-100'
                                                        }`}>
                                                        <IconCode size={16} className={isDark ? 'text-violet-300' : 'text-violet-600'} />
                                                    </div>
                                                    <div>
                                                        <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                            {problem.title}
                                                        </div>
                                                        <div className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'} max-w-xs truncate`}>
                                                            {problem.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <DifficultyBadge difficulty={problem.difficulty} />
                                            </td>
                                            <td className={`px-6 py-4 text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                                                {problem.category}
                                            </td>
                                            <td className={`px-6 py-4 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                                                {problem.points}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`text-sm ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                                                    {getAcceptanceRate(problem.acceptedSubmissions, problem.totalSubmissions)}%
                                                </div>
                                                <div className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                                                    {problem.acceptedSubmissions}/{problem.totalSubmissions}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={problem.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className={`p-1.5 rounded hover:${isDark ? 'bg-zinc-700' : 'bg-gray-100'
                                                            } transition-colors`}
                                                        title="View problem"
                                                    >
                                                        <IconEye size={16} className={isDark ? 'text-zinc-400' : 'text-gray-600'} />
                                                    </button>
                                                    <button
                                                        className={`p-1.5 rounded hover:${isDark ? 'bg-zinc-700' : 'bg-gray-100'
                                                            } transition-colors`}
                                                        title="Edit problem"
                                                    >
                                                        <IconEdit size={16} className={isDark ? 'text-zinc-400' : 'text-gray-600'} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProblem(problem.id)}
                                                        className={`p-1.5 rounded hover:${isDark ? 'bg-red-900/50' : 'bg-red-100'
                                                            } transition-colors`}
                                                        title="Delete problem"
                                                    >
                                                        <IconTrash size={16} className="text-red-500" />
                                                    </button>
                                                    <select
                                                        value={problem.status}
                                                        onChange={(e) => handleStatusChange(problem.id, e.target.value)}
                                                        className={`text-xs px-2 py-1 rounded border ${isDark
                                                            ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                                                            : 'bg-white border-gray-300 text-gray-700'
                                                            }`}
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="inactive">Inactive</option>
                                                        <option value="draft">Draft</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                        }`}>
                        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {problems.length}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                            Total Problems
                        </div>
                    </div>
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                        }`}>
                        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {problems.filter(p => p.status === 'active').length}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                            Active Problems
                        </div>
                    </div>
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                        }`}>
                        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {problems.reduce((total, p) => total + p.totalSubmissions, 0)}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                            Total Submissions
                        </div>
                    </div>
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
                        }`}>
                        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {Math.round((problems.reduce((total, p) => total + p.acceptedSubmissions, 0) / problems.reduce((total, p) => total + p.totalSubmissions, 0)) * 100) || 0}%
                        </div>
                        <div className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                            Overall Acceptance
                        </div>
                    </div>
                </div>
            </div>
        </LayoutWrapper>
    );
}

export default withAdminAuth(ProblemsManagement);
