"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
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

      {/* General error display */}
      <ErrorDisplay errors={validationErrors} />

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
            Username <span className="text-red-500">*</span>
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={loginForm.username}
            onChange={handleLoginChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md transition-colors ${hasFieldError(validationErrors, 'username')
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : isDark
                ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
              }`}
            placeholder="Username"
            required
          />
          <ErrorDisplay errors={validationErrors} fieldName="username" className="mt-1" />
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
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={loginForm.password}
            onChange={handleLoginChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md transition-colors ${hasFieldError(validationErrors, 'password')
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : isDark
                ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
              }`}
            placeholder="••••••••"
            required
          />
          <ErrorDisplay errors={validationErrors} fieldName="password" className="mt-1" />
        </motion.div>

        <motion.button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${isLoading || validationErrors.length > 0
            ? 'bg-violet-400 cursor-not-allowed'
            : isDark
              ? 'bg-violet-600 hover:bg-violet-700'
              : 'bg-violet-600 hover:bg-violet-700'
            }`}
          whileHover={!isLoading && validationErrors.length === 0 ? { scale: 1.02 } : {}}
          whileTap={!isLoading && validationErrors.length === 0 ? { scale: 0.98 } : {}}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          disabled={isLoading}
          style={{
            boxShadow: validationErrors.length === 0 ? '0 4px 14px rgba(124, 58, 237, 0.4)' : 'none'
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
