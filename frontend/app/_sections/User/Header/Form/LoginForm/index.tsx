"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/_contexts/ThemeContext";
import { Login } from "@/app/_apis/user/auth";
import { useRouter } from "next/navigation";

type LoginFormProps = {
  closeModal: () => void;
  switchToSignup: () => void;
};

export default function LoginForm({ closeModal, switchToSignup }: LoginFormProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await Login(loginForm.username, loginForm.password);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to login');
      }

      // Success handling
      const data = await response.json();

      // Store the token or user data in localStorage or context
      localStorage.setItem('token', data.token);

      closeModal();
      router.refresh(); // Refresh the page to update the authentication state
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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

      {error && (
        <motion.div
          className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-md text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      <motion.form
        className="flex flex-col gap-4"
        onSubmit={handleLoginSubmit}
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
            htmlFor="username"
            className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={loginForm.username}
            onChange={handleLoginChange}
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
            htmlFor="password"
            className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={loginForm.password}
            onChange={handleLoginChange}
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
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${isLoading
              ? 'bg-violet-400 cursor-not-allowed'
              : isDark
                ? 'bg-violet-600 hover:bg-violet-700'
                : 'bg-violet-600 hover:bg-violet-700'
            }`}
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          disabled={isLoading}
          style={{
            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)'
          }}
        >
          {isLoading ? "Logging in..." : "Log in"}
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
            onClick={switchToSignup}
            whileHover={{ scale: 1.05, x: 2 }}
          >
            Sign up
          </motion.button>
        </p>
      </motion.div>
    </motion.div>
  );
}
