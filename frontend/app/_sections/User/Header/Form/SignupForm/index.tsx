"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/_contexts/ThemeContext";
import { Account } from "@/app/_libs/types";
import { Signup } from "@/app/_apis/user/auth";

type SignupFormProps = {
  closeModal: () => void;
  switchToLogin: () => void;
};

export default function SignupForm({ closeModal, switchToLogin }: SignupFormProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
    major: 'SE', // Default value
    birthday: undefined,
    profileImg: '',
    currentTerm: 1,
  });

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const numValue = (type === "number") ? Number(value) : value;

    setSignupForm((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };

  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate form
      if (signupForm.password !== signupForm.rePassword) {
        setError("Passwords do not match");
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
      // Redirect to login or show success message
      setTimeout(() => switchToLogin(), 100);
    } catch (error) {
      console.error("Signup error:", error);
      setError(error instanceof Error ? error.message : "Failed to sign up");
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
            <select
              id="major"
              name="major"
              value={signupForm.major || 'SE'}
              onChange={handleSignupChange}
              className={`w-full px-3 py-2 border rounded-md ${isDark
                ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                }`}
              required
            >
              <option value="SE">Software Engineering</option>
              <option value="AI">Artificial Intelligence</option>
              <option value="IA">Information Assurance</option>
            </select>
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
                ${isLoading
                ? 'bg-violet-400 cursor-not-allowed'
                : isDark
                  ? 'bg-violet-600 hover:bg-violet-700'
                  : 'bg-violet-600 hover:bg-violet-700'
              }`}
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            style={{
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)'
            }}
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
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
            onClick={switchToLogin}
            type="button"
            whileHover={{ scale: 1.05, x: 2 }}
          >
            Log in
          </motion.button>
        </p>
      </motion.div>
    </motion.div>
  );
}
