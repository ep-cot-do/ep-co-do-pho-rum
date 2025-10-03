"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "@/app/_contexts/ThemeContext";
import { Account } from "@/app/_libs/types";
import { Signup } from "@/app/_apis/user/auth";
import {
  validateSignupForm,
  ValidationError,
  hasFieldError,
  handleServerValidationErrors,
  validators,
  SignupFormData,
} from "@/app/_libs/validationUtils";
import ErrorDisplay from "@/app/_components/reusable/ErrorDisplay";

type SignupFormProps = {
  closeModal: () => void;
  switchToLogin: () => void;
};

export default function SignupForm({
  closeModal,
  switchToLogin,
}: SignupFormProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [signupForm, setSignupForm] = useState<SignupFormData>({
    username: "",
    password: "",
    rePassword: "",
    email: "",
    github: "",
    studentCode: "",
    fullName: "",
    gender: "MALE",
    phone: "",
    major: "SE",
    birthday: undefined,
    profileImg: "",
    currentTerm: 1,
  });

  const handleSignupChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | undefined = value;

    // Handle number fields
    if (type === "number") {
      processedValue = value === "" ? undefined : parseInt(value, 10);
    }

    // Update form data
    setSignupForm((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Real-time validation for touched fields
    if (touched[name] || value === "") {
      const newErrors = [...validationErrors];

      // Remove existing errors for this field
      const filteredErrors = newErrors.filter((error) => error.field !== name);

      // Validate the field if we have validators for it
      let fieldValidation;
      switch (name) {
        case "username":
          fieldValidation = validators.username(value);
          break;
        case "email":
          fieldValidation = validators.email(value);
          break;
        case "password":
          fieldValidation = validators.password(value);
          break;
        case "rePassword":
          // Check if passwords match
          fieldValidation = validators.confirmPassword(
            value,
            signupForm.password || ""
          );
          break;
        case "fullName":
          fieldValidation = validators.fullName(value);
          break;
        case "github":
          if (value.trim() !== "") {
            fieldValidation = validators.github(value);
          } else {
            fieldValidation = { isValid: true, errors: [] };
          }
          break;
        case "studentCode":
          if (value.trim() !== "") {
            fieldValidation = validators.studentCode(value);
          } else {
            fieldValidation = { isValid: true, errors: [] };
          }
          break;
        case "phone":
          if (value.trim() !== "") {
            fieldValidation = validators.phone(value);
          } else {
            fieldValidation = { isValid: true, errors: [] };
          }
          break;
        case "currentTerm":
          fieldValidation = validators.currentTerm(processedValue as number);
          break;
        default:
          fieldValidation = { isValid: true, errors: [] };
      }

      if (fieldValidation && !fieldValidation.isValid) {
        filteredErrors.push(...fieldValidation.errors);
      }

      setValidationErrors(filteredErrors);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Trigger validation when field loses focus
    const event = {
      target: {
        name,
        value: e.target.value,
        type: e.target.type,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleSignupChange(event);
  };

  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const touchedState = Object.keys(signupForm).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(touchedState);

    // Validate entire form
    const validation = validateSignupForm(signupForm);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setValidationErrors([]);

    try {
      // Create full registration object with proper data types
      const registrationData = {
        ...signupForm,
        fundStatus: false,
        isActive: true,
        phone: signupForm.phone || "",
        birthday: signupForm.birthday
          ? new Date(signupForm.birthday)
          : new Date(),
        currentTerm: signupForm.currentTerm || 1,
        roleId: 3, // Add default roleId to fix the backend validation error
      } as Account & { roleId: number };

      const response = await Signup(registrationData);

      if (!response.ok) {
        const errorData = await response.json();
        const serverErrors = handleServerValidationErrors(errorData);
        setValidationErrors(serverErrors);
        return;
      }

      // Success handling
      closeModal();
      setTimeout(() => switchToLogin(), 100);
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to sign up";
      setValidationErrors([{ field: "general", message: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[600px] w-full max-w-lg mx-auto">
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
        className="relative z-10 h-full max-h-[80vh] flex flex-col"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Fixed Header Section */}
        <div
          className="flex justify-between items-start p-4 pb-2 sticky top-0 z-20 rounded-t-3xl"
          style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(88, 28, 135, 0.1) 50%, rgba(15, 23, 42, 0.95) 100%)"
              : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(219, 234, 254, 0.3) 50%, rgba(255, 255, 255, 0.95) 100%)",
            backdropFilter: "blur(20px)",
            borderBottom: isDark
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(0, 0, 0, 0.05)",
          }}
        >
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
                Join FCoder
              </h1>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-300/80" : "text-gray-600"
                }`}
              >
                Create your account and start coding
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
        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 modal-scroll">
          {/* Error Display */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <ErrorDisplay errors={validationErrors} />
          </motion.div>

          {/* Signup Form */}
          <motion.form
            className="space-y-4"
            onSubmit={handleSignupSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            {/* Basic Information Section */}
            <div className="space-y-3">
              <h3
                className={`text-sm font-bold ${
                  isDark ? "text-purple-300" : "text-blue-700"
                } border-b-2 ${
                  isDark ? "border-purple-500/30" : "border-blue-300"
                } pb-2 mb-4`}
              >
                Basic Information
              </h3>

              {/* Username */}
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
                    value={signupForm.username || ""}
                    onChange={handleSignupChange}
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
                    placeholder="3-20 characters, letters, numbers, underscore"
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

              {/* Email & Full Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div
                      className={`
                  absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                  ${
                    hasFieldError(validationErrors, "email")
                      ? "text-red-500"
                      : isDark
                      ? "text-gray-500"
                      : "text-gray-400"
                  }
                `}
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={signupForm.email || ""}
                      onChange={handleSignupChange}
                      onBlur={handleBlur}
                      className={`
                    w-full pl-10 pr-4 py-2.5 border rounded-lg
                    transition-colors duration-150 ease-in-out
                    placeholder:text-sm
                    ${
                      hasFieldError(validationErrors, "email")
                        ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : isDark
                        ? "bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                        : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    }
                  `}
                      placeholder="your@email.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <ErrorDisplay
                    errors={validationErrors}
                    fieldName="email"
                    className="mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="fullName"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Full Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={signupForm.fullName || ""}
                    onChange={handleSignupChange}
                    onBlur={handleBlur}
                    className={`
                  w-full px-3 py-2.5 border rounded-lg
                  transition-colors duration-150 ease-in-out
                  placeholder:text-sm
                  ${
                    hasFieldError(validationErrors, "fullName")
                      ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : isDark
                      ? "bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  }
                `}
                    placeholder="Your full name"
                    required
                    autoComplete="name"
                  />
                  <ErrorDisplay
                    errors={validationErrors}
                    fieldName="fullName"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-3">
              <h3
                className={`text-sm font-bold ${
                  isDark ? "text-purple-300" : "text-blue-700"
                } border-b-2 ${
                  isDark ? "border-purple-500/30" : "border-blue-300"
                } pb-2 mb-4`}
              >
                Security
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Password
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div
                      className={`
                  absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                  ${
                    hasFieldError(validationErrors, "password")
                      ? "text-red-500"
                      : isDark
                      ? "text-gray-500"
                      : "text-gray-400"
                  }
                `}
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
                      value={signupForm.password || ""}
                      onChange={handleSignupChange}
                      onBlur={handleBlur}
                      className={`
                    w-full pl-10 pr-12 py-2.5 border rounded-lg
                    transition-colors duration-150 ease-in-out
                    placeholder:text-sm
                    ${
                      hasFieldError(validationErrors, "password")
                        ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : isDark
                        ? "bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                        : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    }
                  `}
                      placeholder="8+ chars, upper, lower, number"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`
                    absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4
                    transition-colors duration-150
                    ${
                      isDark
                        ? "text-gray-500 hover:text-gray-400"
                        : "text-gray-400 hover:text-gray-600"
                    }
                  `}
                    >
                      {showPassword ? (
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
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
                    </button>
                  </div>
                  <ErrorDisplay
                    errors={validationErrors}
                    fieldName="password"
                    className="mt-1"
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="rePassword"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Confirm Password
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div
                      className={`
                  absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                  ${
                    hasFieldError(validationErrors, "rePassword")
                      ? "text-red-500"
                      : isDark
                      ? "text-gray-500"
                      : "text-gray-400"
                  }
                `}
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <input
                      id="rePassword"
                      name="rePassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={signupForm.rePassword || ""}
                      onChange={handleSignupChange}
                      onBlur={handleBlur}
                      className={`
                    w-full pl-10 pr-12 py-2.5 border rounded-lg
                    transition-colors duration-150 ease-in-out
                    placeholder:text-sm
                    ${
                      hasFieldError(validationErrors, "rePassword")
                        ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : isDark
                        ? "bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                        : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    }
                  `}
                      placeholder="Confirm password"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className={`
                    absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4
                    transition-colors duration-150
                    ${
                      isDark
                        ? "text-gray-500 hover:text-gray-400"
                        : "text-gray-400 hover:text-gray-600"
                    }
                  `}
                    >
                      {showConfirmPassword ? (
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
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
                    </button>
                  </div>
                  <ErrorDisplay
                    errors={validationErrors}
                    fieldName="rePassword"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-3">
              <h3
                className={`text-sm font-bold ${
                  isDark ? "text-purple-300" : "text-blue-700"
                } border-b-2 ${
                  isDark ? "border-purple-500/30" : "border-blue-300"
                } pb-2 mb-4`}
              >
                Additional Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* GitHub & Student Code */}
                <div className="space-y-2">
                  <label
                    htmlFor="github"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    GitHub Username
                  </label>
                  <input
                    id="github"
                    name="github"
                    type="text"
                    value={signupForm.github || ""}
                    onChange={handleSignupChange}
                    onBlur={handleBlur}
                    className={`
                  w-full px-3 py-2.5 border rounded-lg
                  transition-colors duration-150 ease-in-out
                  placeholder:text-sm
                  ${
                    hasFieldError(validationErrors, "github")
                      ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : isDark
                      ? "bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  }
                `}
                    placeholder="GitHub username"
                  />
                  <ErrorDisplay
                    errors={validationErrors}
                    fieldName="github"
                    className="mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="studentCode"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Student Code
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <input
                    id="studentCode"
                    name="studentCode"
                    type="text"
                    value={signupForm.studentCode || ""}
                    onChange={handleSignupChange}
                    onBlur={handleBlur}
                    className={`
                  w-full px-3 py-2.5 border rounded-lg
                  transition-colors duration-150 ease-in-out
                  placeholder:text-sm
                  ${
                    hasFieldError(validationErrors, "studentCode")
                      ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : isDark
                      ? "bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  }
                `}
                    placeholder="Student code (XX######)"
                  />
                  <ErrorDisplay
                    errors={validationErrors}
                    fieldName="studentCode"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Gender */}
                <div className="space-y-2">
                  <label
                    htmlFor="gender"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Gender
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={signupForm.gender || "MALE"}
                    onChange={handleSignupChange}
                    onBlur={handleBlur}
                    className={`
                  w-full px-3 py-2.5 border rounded-lg
                  transition-colors duration-150 ease-in-out
                  ${
                    hasFieldError(validationErrors, "gender")
                      ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : isDark
                      ? "bg-gray-800 border-gray-600 text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  }
                `}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <ErrorDisplay
                    errors={validationErrors}
                    fieldName="gender"
                    className="mt-1"
                  />
                </div>

                {/* Major */}
                <div className="space-y-2">
                  <label
                    htmlFor="major"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Major
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    id="major"
                    name="major"
                    value={signupForm.major || "SE"}
                    onChange={handleSignupChange}
                    onBlur={handleBlur}
                    className={`
                  w-full px-3 py-2.5 border rounded-lg
                  transition-colors duration-150 ease-in-out
                  ${
                    hasFieldError(validationErrors, "major")
                      ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : isDark
                      ? "bg-gray-800 border-gray-600 text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  }
                `}
                    required
                  >
                    <option value="SE">Software Engineering</option>
                    <option value="AI">Artificial Intelligence</option>
                    <option value="IA">Information Assurance</option>
                  </select>
                  <ErrorDisplay
                    errors={validationErrors}
                    fieldName="major"
                    className="mt-1"
                  />
                </div>

                {/* Current Term */}
                <div className="space-y-2">
                  <label
                    htmlFor="currentTerm"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Current Term
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="currentTerm"
                    name="currentTerm"
                    type="number"
                    min="1"
                    max="10"
                    value={signupForm.currentTerm || 1}
                    onChange={handleSignupChange}
                    onBlur={handleBlur}
                    className={`
                  w-full px-3 py-2.5 border rounded-lg
                  transition-colors duration-150 ease-in-out
                  placeholder:text-sm
                  ${
                    hasFieldError(validationErrors, "currentTerm")
                      ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : isDark
                      ? "bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  }
                `}
                    placeholder="1-10"
                  />
                  <ErrorDisplay
                    errors={validationErrors}
                    fieldName="currentTerm"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Phone
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={signupForm.phone || ""}
                    onChange={handleSignupChange}
                    onBlur={handleBlur}
                    className={`
                  w-full px-3 py-2.5 border rounded-lg
                  transition-colors duration-150 ease-in-out
                  placeholder:text-sm
                  ${
                    hasFieldError(validationErrors, "phone")
                      ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : isDark
                      ? "bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  }
                `}
                    placeholder="Vietnamese phone number"
                    autoComplete="tel"
                  />
                  <ErrorDisplay
                    errors={validationErrors}
                    fieldName="phone"
                    className="mt-1"
                  />
                </div>

                {/* Birthday */}
                <div className="space-y-2">
                  <label
                    htmlFor="birthday"
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Birthday
                  </label>
                  <input
                    id="birthday"
                    name="birthday"
                    type="date"
                    value={
                      signupForm.birthday
                        ? typeof signupForm.birthday === "string"
                          ? signupForm.birthday
                          : new Date(signupForm.birthday)
                              .toISOString()
                              .split("T")[0]
                        : ""
                    }
                    onChange={handleSignupChange}
                    onBlur={handleBlur}
                    className={`
                  w-full px-3 py-2.5 border rounded-lg
                  transition-colors duration-150 ease-in-out
                  ${
                    hasFieldError(validationErrors, "birthday")
                      ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : isDark
                      ? "bg-gray-800 border-gray-600 text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                      : "bg-white border-gray-300 text-gray-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  }
                `}
                  />
                  <ErrorDisplay
                    errors={validationErrors}
                    fieldName="birthday"
                    className="mt-1"
                  />
                </div>
              </div>
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
                  <span>Creating your account...</span>
                </div>
              ) : (
                <span className="relative z-10">Create Account</span>
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
                Already have an account?
              </span>
            </div>
          </motion.div>

          {/* Login Link */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <motion.button
              onClick={switchToLogin}
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
              Sign in instead
            </motion.button>
          </motion.div>
        </div>{" "}
        {/* Close scrollable content container */}
      </motion.div>
    </div>
  );
}
