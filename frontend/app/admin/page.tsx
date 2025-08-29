'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/_contexts/ThemeContext';
import { IconCode, IconEye, IconEyeOff } from '@tabler/icons-react';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Hardcoded admin credentials
        if (username === 'FCODER' && password === 'FCODER') {
            // Store admin session
            localStorage.setItem('adminAuthenticated', 'true');
            localStorage.setItem('adminUser', 'FCODER');
            router.push('/admin/insights');
        } else {
            setError('Invalid credentials. Please try again.');
        }

        setIsLoading(false);
    };

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-violet-900' : 'bg-gradient-to-br from-gray-50 via-white to-violet-50'
            }`}>
            <div className={`w-full max-w-md space-y-8 ${isDark ? 'bg-zinc-900/90 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'
                } p-8 rounded-2xl border ${isDark ? 'border-zinc-700/50' : 'border-gray-200/50'
                } shadow-2xl`}>

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex justify-center">
                        <div className={`p-3 rounded-xl ${isDark ? 'bg-violet-900/50 border border-violet-800' : 'bg-violet-100 border border-violet-200'
                            }`}>
                            <IconCode
                                size={32}
                                className={isDark ? 'text-violet-300' : 'text-violet-700'}
                                stroke={2}
                            />
                        </div>
                    </div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        FCoder Admin
                    </h1>
                    <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                        Sign in to access the administration panel
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className={`p-3 rounded-lg text-sm ${isDark
                            ? 'bg-red-900/20 border border-red-800 text-red-300'
                            : 'bg-red-50 border border-red-200 text-red-600'
                            }`}>
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="username"
                                className={`block text-sm font-medium mb-2 ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                    }`}
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border transition-colors ${isDark
                                    ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400 focus:border-violet-500 focus:ring-violet-500/20'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500/20'
                                    } focus:ring-2 focus:outline-none`}
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className={`block text-sm font-medium mb-2 ${isDark ? 'text-zinc-300' : 'text-gray-700'
                                    }`}
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full px-4 py-3 pr-12 rounded-lg border transition-colors ${isDark
                                        ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400 focus:border-violet-500 focus:ring-violet-500/20'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500/20'
                                        } focus:ring-2 focus:outline-none`}
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded ${isDark ? 'text-zinc-400 hover:text-zinc-300' : 'text-gray-400 hover:text-gray-600'
                                        } transition-colors`}
                                >
                                    {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-violet-600 hover:bg-violet-700 focus:bg-violet-700'
                            } text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 shadow-lg hover:shadow-xl`}
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                {/* Dev Info */}
                <div className={`text-center text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'} space-y-1`}>
                    <p>Development Mode</p>
                    <p className={`font-mono ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                    </p>
                </div>
            </div>
        </div>
    );
}
