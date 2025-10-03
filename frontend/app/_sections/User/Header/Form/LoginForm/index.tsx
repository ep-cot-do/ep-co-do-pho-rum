"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "@/app/_contexts/ThemeContext";
import { Login } from "@/app/_apis/user/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_contexts/AuthContext";
import {
  validateLoginForm,
  ValidationError,
  hasFieldError,
  handleServerValidationErrors,
  validators,
} from "@/app/_libs/validationUtils";
import ErrorDisplay from "@/app/_components/reusable/ErrorDisplay";

type LoginFormProps = {
  closeModal: () => void;
  switchToSignup: () => void;
};

export default function LoginForm({
  closeModal,
  switchToSignup,
}: LoginFormProps) {
  const { theme } = useTheme();
  const { login } = useAuth();
  const isDark = theme === "dark";
  const router = useRouter();

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update form data
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Real-time validation for touched fields
    if (touched[name] || value === "") {
      const newErrors = [...validationErrors];

      // Remove existing errors for this field
      const filteredErrors = newErrors.filter((error) => error.field !== name);

      // Validate the field
      let fieldValidation;
      if (name === "username") {
        fieldValidation = validators.username(value);
      } else if (name === "password") {
        if (value.trim() === "") {
          fieldValidation = {
            isValid: false,
            errors: [{ field: name, message: "Mật khẩu là bắt buộc" }],
          };
        } else {
          fieldValidation = { isValid: true, errors: [] };
        }
      }
      if (fieldValidation && !fieldValidation.isValid) {
        filteredErrors.push(...fieldValidation.errors);
      }

      setValidationErrors(filteredErrors);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Trigger validation when field loses focus
    const event = {
      target: {
        name,
        value: e.target.value,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleLoginChange(event);
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ username: true, password: true });

    // Validate form
    const validation = validateLoginForm(loginForm);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setValidationErrors([]);

    try {
      const response = await Login(loginForm.username, loginForm.password);

      if (!response.ok) {
        const errorData = await response.json();

        // Handle specific login errors
        if (response.status === 401 || response.status === 403) {
          setValidationErrors([
            {
              field: "general",
              message:
                "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.",
            },
          ]);
        } else {
          const serverErrors = handleServerValidationErrors(errorData);
          setValidationErrors(serverErrors);
        }
        return;
      }

      // Success handling
      const data = await response.json();

      // Store the token or user data in localStorage or context
      await login(data.token);

      closeModal();
      router.refresh(); // Refresh the page to update the authentication state
    } catch (error) {
      console.error("Login error:", error);

      // Handle network or other errors
      if (error instanceof Error) {
        if (error.message.includes("fetch")) {
          setValidationErrors([
            {
              field: "general",
              message:
                "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.",
            },
          ]);
        } else {
          setValidationErrors([
            {
              field: "general",
              message: "Đăng nhập thất bại. Vui lòng thử lại.",
            },
          ]);
        }
      } else {
        setValidationErrors([
          {
            field: "general",
            message: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.",
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[400px] w-full max-w-md mx-auto">
      {/* Background with Gradient */}
      <div
        className={`absolute inset-0 rounded-3xl ${
          isDark
            ? "bg-gradient-to-br from-slate-900/90 via-purple-900/20 to-slate-900/90"
            : "bg-gradient-to-br from-white/95 via-blue-50/30 to-white/95"
        } backdrop-blur-xl border ${
          isDark ? "border-white/10" : "border-white/20"
        } shadow-2xl`}
      />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <div
          className={`absolute -top-20 -right-20 w-40 h-40 rounded-full ${
            isDark ? "bg-purple-500/10" : "bg-blue-200/20"
          } blur-3xl animate-pulse`}
        />
        <div
          className={`absolute -bottom-20 -left-20 w-32 h-32 rounded-full ${
            isDark ? "bg-blue-500/10" : "bg-purple-200/20"
          } blur-3xl animate-pulse delay-1000`}
        />
      </div>

      <motion.div
        className="relative z-10 p-4 h-full"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            {/* Logo with Glow Effect */}
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <div
                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isDark
                    ? "bg-gradient-to-br from-purple-600 to-blue-600"
                    : "bg-gradient-to-br from-blue-600 to-purple-600"
                } shadow-lg`}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-blue-400/20 blur-xl" />
                <Image
                  src="/icon.png"
                  alt="FCoder Logo"
                  width={28}
                  height={28}
                  className="object-contain relative z-10"
                />
              </div>
              <span
                className={`text-2xl font-bold bg-gradient-to-r ${
                  isDark
                    ? "from-white to-purple-200 text-transparent bg-clip-text"
                    : "from-gray-900 to-blue-700 text-transparent bg-clip-text"
                }`}
              >
                FCoder
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <h1
                className={`text-2xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Welcome Back
              </h1>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-300/80" : "text-gray-600"
                }`}
              >
                Sign in to continue your coding journey
              </p>
            </motion.div>
          </div>

          <motion.button
            onClick={closeModal}
            className={`
              p-2 rounded-xl transition-all duration-200
              ${
                isDark
                  ? "text-gray-400 hover:text-white hover:bg-white/10"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/80"
              } hover:scale-110
            `}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        </div>

        {/* Error Display */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <ErrorDisplay errors={validationErrors} />
        </motion.div>

        {/* Login Form */}
        <motion.form
          className="space-y-4"
          onSubmit={handleLoginSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {/* Username Field */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className={`block text-sm font-semibold ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Username
              <span className="text-red-400 ml-1">*</span>
            </label>
            <div className="relative group">
              <div
                className={`
                absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 z-10
                transition-colors duration-200
                ${
                  hasFieldError(validationErrors, "username")
                    ? "text-red-400"
                    : isDark
                    ? "text-gray-400 group-focus-within:text-purple-400"
                    : "text-gray-500 group-focus-within:text-blue-500"
                }
              `}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <input
                id="username"
                name="username"
                type="text"
                value={loginForm.username}
                onChange={handleLoginChange}
                onBlur={handleBlur}
                className={`
                  w-full pl-12 pr-4 py-3.5 rounded-xl border-2
                  transition-all duration-300 ease-in-out
                  placeholder:text-sm font-medium
                  focus:outline-none focus:ring-0
                  ${
                    hasFieldError(validationErrors, "username")
                      ? "border-red-300 bg-red-50/30 focus:border-red-400 shadow-red-100/50 shadow-lg"
                      : isDark
                      ? "bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-400/50 focus:bg-white/10 backdrop-blur-sm"
                      : "bg-white/80 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-blue-400 focus:bg-white backdrop-blur-sm shadow-sm"
                  }
                  hover:shadow-lg transition-shadow
                `}
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
              <div
                className={`absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300 ${
                  isDark
                    ? "bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-focus-within:from-purple-500/10 group-focus-within:to-blue-500/10"
                    : "bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-focus-within:from-blue-500/5 group-focus-within:to-purple-500/5"
                }`}
              />
            </div>
            <ErrorDisplay
              errors={validationErrors}
              fieldName="username"
              className="mt-1"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className={`block text-sm font-semibold ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Password
              <span className="text-red-400 ml-1">*</span>
            </label>
            <div className="relative group">
              <div
                className={`
                absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 z-10
                transition-colors duration-200
                ${
                  hasFieldError(validationErrors, "password")
                    ? "text-red-400"
                    : isDark
                    ? "text-gray-400 group-focus-within:text-purple-400"
                    : "text-gray-500 group-focus-within:text-blue-500"
                }
              `}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={loginForm.password}
                onChange={handleLoginChange}
                onBlur={handleBlur}
                className={`
                  w-full pl-12 pr-14 py-3.5 rounded-xl border-2
                  transition-all duration-300 ease-in-out
                  placeholder:text-sm font-medium
                  focus:outline-none focus:ring-0
                  ${
                    hasFieldError(validationErrors, "password")
                      ? "border-red-300 bg-red-50/30 focus:border-red-400 shadow-red-100/50 shadow-lg"
                      : isDark
                      ? "bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-400/50 focus:bg-white/10 backdrop-blur-sm"
                      : "bg-white/80 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-blue-400 focus:bg-white backdrop-blur-sm shadow-sm"
                  }
                  hover:shadow-lg transition-shadow
                `}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <div
                className={`absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300 ${
                  isDark
                    ? "bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-focus-within:from-purple-500/10 group-focus-within:to-blue-500/10"
                    : "bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-focus-within:from-blue-500/5 group-focus-within:to-purple-500/5"
                }`}
              />
              {/* Toggle Password Visibility Button */}
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`
                  absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 z-10
                  transition-all duration-200
                  ${
                    isDark
                      ? "text-gray-400 hover:text-purple-300"
                      : "text-gray-500 hover:text-blue-600"
                  }
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </motion.button>
            </div>
            <ErrorDisplay
              errors={validationErrors}
              fieldName="password"
              className="mt-1"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className={`
              w-full py-4 px-6 rounded-xl font-bold text-lg
              transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-0 relative overflow-hidden
              ${
                isLoading || validationErrors.length > 0
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : isDark
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-xl hover:shadow-purple-500/25"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl hover:shadow-blue-500/25"
              }
              transform hover:scale-[1.02] active:scale-[0.98]
            `}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {isLoading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing you in...</span>
              </div>
            ) : (
              <span className="relative z-10">Sign In</span>
            )}
          </motion.button>
        </motion.form>

        {/* Divider */}
        <motion.div
          className="relative my-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <div className={`absolute inset-0 flex items-center`}>
            <div
              className={`w-full border-t ${
                isDark ? "border-white/10" : "border-gray-200"
              }`}
            />
          </div>
          <div className="relative flex justify-center text-sm">
            <span
              className={`px-4 py-1 rounded-full ${
                isDark
                  ? "bg-slate-900/90 text-gray-300 border border-white/10"
                  : "bg-white/90 text-gray-600 border border-gray-100"
              } backdrop-blur-sm`}
            >
              New to FCoder?
            </span>
          </div>
        </motion.div>

        {/* Sign Up Link */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <motion.button
            onClick={switchToSignup}
            className={`
              px-6 py-3 rounded-xl font-semibold transition-all duration-300
              ${
                isDark
                  ? "text-purple-300 hover:text-white hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-400"
                  : "text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 hover:border-blue-300"
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create an account
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
