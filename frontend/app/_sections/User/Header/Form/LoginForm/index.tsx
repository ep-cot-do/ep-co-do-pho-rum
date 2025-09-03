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
  validators
} from "@/app/_libs/validationUtils";
import ErrorDisplay from "@/app/_components/reusable/ErrorDisplay";

type LoginFormProps = {
  closeModal: () => void;
  switchToSignup: () => void;
};

export default function LoginForm({ closeModal, switchToSignup }: LoginFormProps) {
  const { theme } = useTheme();
  const { login } = useAuth();
  const isDark = theme === 'dark';
  const router = useRouter();

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
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
    setTouched(prev => ({ ...prev, [name]: true }));

    // Real-time validation for touched fields
    if (touched[name] || value === '') {
      const newErrors = [...validationErrors];

      // Remove existing errors for this field
      const filteredErrors = newErrors.filter(error => error.field !== name);

      // Validate the field
      let fieldValidation;
      if (name === 'username') {
        fieldValidation = validators.username(value);
      } else if (name === 'password') {
        if (value.trim() === '') {
          fieldValidation = {
            isValid: false,
            errors: [{ field: name, message: 'Mật khẩu là bắt buộc' }]
          };
        } else {
          fieldValidation = { isValid: true, errors: [] };
        }
      } if (fieldValidation && !fieldValidation.isValid) {
        filteredErrors.push(...fieldValidation.errors);
      }

      setValidationErrors(filteredErrors);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    // Trigger validation when field loses focus
    const event = {
      target: {
        name,
        value: e.target.value
      }
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
          setValidationErrors([{
            field: 'general',
            message: 'Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.'
          }]);
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
          setValidationErrors([{
            field: 'general',
            message: "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
          }]);
        } else {
          setValidationErrors([{
            field: 'general',
            message: "Đăng nhập thất bại. Vui lòng thử lại."
          }]);
        }
      } else {
        setValidationErrors([{
          field: 'general',
          message: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại."
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-violet-600' : 'bg-violet-600'
              } shadow-lg`}>
              <Image
                src="/icon.png"
                alt="Fcoder Logo"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Fcoder
            </span>
          </div>

          <div>
            <h1 className={`text-xl font-semibold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              Sign In
            </h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Access your account to continue
            </p>
          </div>
        </div>
        <button
          onClick={closeModal}
          className={`
            p-1.5 rounded-md transition-colors duration-150
            ${isDark
              ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Error Display */}
      <ErrorDisplay errors={validationErrors} />

      {/* Login Form */}
      <form className="space-y-5" onSubmit={handleLoginSubmit}>
        {/* Username Field */}
        <div className="space-y-2">
          <label
            htmlFor="username"
            className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
          >
            Username
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <div className={`
              absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
              ${hasFieldError(validationErrors, 'username')
                ? 'text-red-500'
                : isDark ? 'text-gray-500' : 'text-gray-400'
              }
            `}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
                w-full pl-10 pr-4 py-2.5 border rounded-lg
                transition-colors duration-150 ease-in-out
                placeholder:text-sm
                ${hasFieldError(validationErrors, 'username')
                  ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : isDark
                    ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                }
              `}
              placeholder="Enter your username"
              required
              autoComplete="username"
            />
          </div>
          <ErrorDisplay errors={validationErrors} fieldName="username" className="mt-1" />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
          >
            Password
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <div className={`
              absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
              ${hasFieldError(validationErrors, 'password')
                ? 'text-red-500'
                : isDark ? 'text-gray-500' : 'text-gray-400'
              }
            `}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
                w-full pl-10 pr-12 py-2.5 border rounded-lg
                transition-colors duration-150 ease-in-out
                placeholder:text-sm
                ${hasFieldError(validationErrors, 'password')
                  ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : isDark
                    ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                }
              `}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
            {/* Toggle Password Visibility Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`
                absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4
                transition-colors duration-150
                ${isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}
              `}
            >
              {showPassword ? (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          <ErrorDisplay errors={validationErrors} fieldName="password" className="mt-1" />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`
            w-full py-2.5 px-4 rounded-lg font-medium
            transition-all duration-150 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${isLoading || validationErrors.length > 0
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : isDark
                ? 'bg-violet-600 hover:bg-violet-700 text-white focus:ring-violet-500'
                : 'bg-violet-600 hover:bg-violet-700 text-white focus:ring-violet-500'
            }
          `}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className={`absolute inset-0 flex items-center`}>
          <div className={`w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className={`px-2 ${isDark ? 'bg-gray-900 text-gray-500' : 'bg-white text-gray-500'}`}>
            New to Fcoder?
          </span>
        </div>
      </div>

      {/* Sign Up Link */}
      <div className="text-center">
        <button
          onClick={switchToSignup}
          className={`
            text-sm font-medium transition-colors duration-150
            ${isDark
              ? 'text-violet-400 hover:text-violet-300'
              : 'text-violet-600 hover:text-violet-500'
            }
          `}
        >
          Create an account
        </button>
      </div>
    </motion.div>
  );
}
