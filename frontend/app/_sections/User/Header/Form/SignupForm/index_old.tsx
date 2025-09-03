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
  SignupFormData
} from "@/app/_libs/validationUtils";
import ErrorDisplay from "@/app/_components/reusable/ErrorDisplay";

type SignupFormProps = {
  closeModal: () => void;
  switchToLogin: () => void;
};

export default function SignupForm({ closeModal, switchToLogin }: SignupFormProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [signupForm, setSignupForm] = useState<SignupFormData>({
    username: "",
    password: "",
    rePassword: "",
    email: "",
    github: "",
    studentCode: "",
    fullName: "",
    gender: 'MALE',
    phone: "",
    major: 'SE',
    birthday: undefined,
    profileImg: '',
    currentTerm: 1,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | undefined = value;

    // Process value based on type
    if (type === "number") {
      processedValue = value === '' ? undefined : Number(value);
    } else if (name === 'birthday' && value) {
      processedValue = value;
    }

    // Update form data
    setSignupForm((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));

    // Real-time validation for touched fields
    if (touched[name] || value === '') {
      validateField(name, processedValue);
    }
  };

  const validateField = (fieldName: string, value: string | number | undefined) => {
    const newErrors = [...validationErrors];
    const filteredErrors = newErrors.filter(error => error.field !== fieldName);

    let fieldValidation;
    const currentForm = { ...signupForm, [fieldName]: value };

    switch (fieldName) {
      case 'username':
        fieldValidation = validators.username(String(value || ''));
        break;
      case 'email':
        fieldValidation = validators.email(String(value || ''));
        break;
      case 'password':
        fieldValidation = validators.password(String(value || ''));
        // Also revalidate confirm password if it's been touched
        if (touched.rePassword) {
          const confirmValidation = validators.confirmPassword(String(value || ''), String(currentForm.rePassword || ''));
          if (!confirmValidation.isValid) {
            const otherErrors = filteredErrors.filter(error => error.field !== 'rePassword');
            otherErrors.push(...confirmValidation.errors);
            setValidationErrors([...otherErrors, ...fieldValidation.errors]);
            return;
          }
        }
        break;
      case 'rePassword':
        fieldValidation = validators.confirmPassword(String(currentForm.password || ''), String(value || ''));
        break;
      case 'fullName':
        fieldValidation = validators.fullName(String(value || ''));
        break;
      case 'phone':
        fieldValidation = validators.phone(String(value || ''), false);
        break;
      case 'studentCode':
        fieldValidation = validators.studentCode(String(value || ''), false);
        break;
      case 'github':
        fieldValidation = validators.github(String(value || ''), false);
        break;
      case 'currentTerm':
        fieldValidation = validators.currentTerm(typeof value === 'number' ? value : undefined);
        break;
      case 'birthday':
        fieldValidation = validators.birthday(typeof value === 'string' ? value : undefined, false);
        break;
      case 'gender':
        fieldValidation = validators.gender(String(value || ''));
        break;
      case 'major':
        fieldValidation = validators.major(String(value || ''));
        break;
      default:
        fieldValidation = { isValid: true, errors: [] };
    }

    if (fieldValidation && !fieldValidation.isValid) {
      filteredErrors.push(...fieldValidation.errors);
    }

    setValidationErrors(filteredErrors);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFieldNames = Object.keys(signupForm);
    const touchedState = allFieldNames.reduce((acc, field) => ({ ...acc, [field]: true }), {});
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
        birthday: signupForm.birthday ? new Date(signupForm.birthday) : new Date(),
        currentTerm: signupForm.currentTerm || 1,
        roleId: 2 // Add default roleId to fix the backend validation error
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
      const errorMessage = error instanceof Error ? error.message : "Failed to sign up";
      setValidationErrors([{ field: 'general', message: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col space-y-6 max-h-[80vh] overflow-y-auto"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start sticky top-0 z-10 pb-2" style={{
        background: isDark ? 'rgb(17 24 39)' : 'white'
      }}>
        <div className="space-y-3">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-violet-600' : 'bg-violet-600'
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
            <h1 className={`text-xl font-semibold tracking-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Create Account
            </h1>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Join the Fcoder community
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

      {/* Signup Form */}
      <form className="space-y-5" onSubmit={handleSignupSubmit}>
        {/* Basic Information Section */}
        <div className="space-y-4">
          <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} pb-1`}>
            Basic Information
          </h3>
          
          {/* Username */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
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
                value={signupForm.username || ''}
                onChange={handleSignupChange}
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
                placeholder="3-20 characters, letters, numbers, underscore"
                required
                autoComplete="username"
              />
            </div>
            <ErrorDisplay errors={validationErrors} fieldName="username" className="mt-1" />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Email
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className={`
                absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                ${hasFieldError(validationErrors, 'email')
                  ? 'text-red-500'
                  : isDark ? 'text-gray-500' : 'text-gray-400'
                }
              `}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={signupForm.email || ''}
                onChange={handleSignupChange}
                onBlur={handleBlur}
                className={`
                  w-full pl-10 pr-4 py-2.5 border rounded-lg
                  transition-colors duration-150 ease-in-out
                  placeholder:text-sm
                  ${hasFieldError(validationErrors, 'email')
                    ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : isDark
                      ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                  }
                `}
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>
            <ErrorDisplay errors={validationErrors} fieldName="email" className="mt-1" />
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Full Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className={`
                absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                ${hasFieldError(validationErrors, 'fullName')
                  ? 'text-red-500'
                  : isDark ? 'text-gray-500' : 'text-gray-400'
                }
              `}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={signupForm.fullName || ''}
                onChange={handleSignupChange}
                onBlur={handleBlur}
                className={`
                  w-full pl-10 pr-4 py-2.5 border rounded-lg
                  transition-colors duration-150 ease-in-out
                  placeholder:text-sm
                  ${hasFieldError(validationErrors, 'fullName')
                    ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : isDark
                      ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                  }
                `}
                placeholder="Your full name"
                required
                autoComplete="name"
              />
            </div>
            <ErrorDisplay errors={validationErrors} fieldName="fullName" className="mt-1" />
          </div>
        </div>

        </div>

        {/* Security Section */}
        <div className="space-y-4">
          <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} pb-1`}>
            Security
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
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
                  value={signupForm.password || ''}
                  onChange={handleSignupChange}
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
                  placeholder="8+ chars, uppercase, lowercase, number"
                  required
                  autoComplete="new-password"
                />
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <label
                htmlFor="rePassword"
                className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Confirm Password
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className={`
                  absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                  ${hasFieldError(validationErrors, 'rePassword')
                    ? 'text-red-500'
                    : isDark ? 'text-gray-500' : 'text-gray-400'
                  }
                `}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  id="rePassword"
                  name="rePassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={signupForm.rePassword || ''}
                  onChange={handleSignupChange}
                  onBlur={handleBlur}
                  className={`
                    w-full pl-10 pr-12 py-2.5 border rounded-lg
                    transition-colors duration-150 ease-in-out
                    placeholder:text-sm
                    ${hasFieldError(validationErrors, 'rePassword')
                      ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : isDark
                        ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                    }
                  `}
                  placeholder="Confirm password"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`
                    absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4
                    transition-colors duration-150
                    ${isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}
                  `}
                >
                  {showConfirmPassword ? (
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
              <ErrorDisplay errors={validationErrors} fieldName="rePassword" className="mt-1" />
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="space-y-4">
          <h3 className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} pb-1`}>
            Additional Information
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* GitHub */}
            <div className="space-y-2">
              <label
                htmlFor="github"
                className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                GitHub Username
              </label>
              <input
                id="github"
                name="github"
                type="text"
                value={signupForm.github || ''}
                onChange={handleSignupChange}
                onBlur={handleBlur}
                className={`
                  w-full px-3 py-2.5 border rounded-lg
                  transition-colors duration-150 ease-in-out
                  placeholder:text-sm
                  ${hasFieldError(validationErrors, 'github')
                    ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : isDark
                      ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                  }
                `}
                placeholder="GitHub username"
              />
              <ErrorDisplay errors={validationErrors} fieldName="github" className="mt-1" />
            </div>

            {/* Student Code */}
            <div className="space-y-2">
              <label
                htmlFor="studentCode"
                className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Student Code
              </label>
              <input
                id="studentCode"
                name="studentCode"
                type="text"
                value={signupForm.studentCode || ''}
                onChange={handleSignupChange}
                onBlur={handleBlur}
                className={`
                  w-full px-3 py-2.5 border rounded-lg
                  transition-colors duration-150 ease-in-out
                  placeholder:text-sm
                  ${hasFieldError(validationErrors, 'studentCode')
                    ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : isDark
                      ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                  }
                `}
                placeholder="Student code (XX######)"
              />
              <ErrorDisplay errors={validationErrors} fieldName="studentCode" className="mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Gender */}
            <div className="space-y-2">
              <label
                htmlFor="gender"
                className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Gender
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={signupForm.gender || 'MALE'}
                onChange={handleSignupChange}
                onBlur={handleBlur}
                className={`
                  w-full px-3 py-2.5 border rounded-lg
                  transition-colors duration-150 ease-in-out
                  ${hasFieldError(validationErrors, 'gender')
                    ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : isDark
                      ? 'bg-gray-800 border-gray-600 text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                  }
                `}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              <ErrorDisplay errors={validationErrors} fieldName="gender" className="mt-1" />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={signupForm.phone || ''}
                onChange={handleSignupChange}
                onBlur={handleBlur}
                className={`
                  w-full px-3 py-2.5 border rounded-lg
                  transition-colors duration-150 ease-in-out
                  placeholder:text-sm
                  ${hasFieldError(validationErrors, 'phone')
                    ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : isDark
                      ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                  }
                `}
                placeholder="Vietnamese phone number"
                autoComplete="tel"
              />
              <ErrorDisplay errors={validationErrors} fieldName="phone" className="mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Major */}
            <div className="space-y-2">
              <label
                htmlFor="major"
                className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Major
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                id="major"
                name="major"
                value={signupForm.major || 'SE'}
                onChange={handleSignupChange}
                onBlur={handleBlur}
                className={`
                  w-full px-3 py-2.5 border rounded-lg
                  transition-colors duration-150 ease-in-out
                  ${hasFieldError(validationErrors, 'major')
                    ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : isDark
                      ? 'bg-gray-800 border-gray-600 text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                  }
                `}
                required
              >
                <option value="SE">Software Engineering</option>
                <option value="AI">Artificial Intelligence</option>
                <option value="IA">Information Assurance</option>
              </select>
              <ErrorDisplay errors={validationErrors} fieldName="major" className="mt-1" />
            </div>

            {/* Birthday */}
            <div className="space-y-2">
              <label
                htmlFor="birthday"
                className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Birthday
              </label>
              <input
                id="birthday"
                name="birthday"
                type="date"
                value={signupForm.birthday ? (typeof signupForm.birthday === 'string' ? signupForm.birthday : new Date(signupForm.birthday).toISOString().split('T')[0]) : ''}
                onChange={handleSignupChange}
                onBlur={handleBlur}
                className={`
                  w-full px-3 py-2.5 border rounded-lg
                  transition-colors duration-150 ease-in-out
                  ${hasFieldError(validationErrors, 'birthday')
                    ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : isDark
                      ? 'bg-gray-800 border-gray-600 text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                  }
                `}
              />
              <ErrorDisplay errors={validationErrors} fieldName="birthday" className="mt-1" />
            </div>
          </div>

          {/* Current Term */}
          <div className="space-y-2">
            <label
              htmlFor="currentTerm"
              className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
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
                ${hasFieldError(validationErrors, 'currentTerm')
                  ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : isDark
                    ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                }
              `}
              placeholder="Current term (1-10)"
            />
            <ErrorDisplay errors={validationErrors} fieldName="currentTerm" className="mt-1" />
          </div>
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
              <span>Creating account...</span>
            </div>
          ) : (
            'Create Account'
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
            Already have an account?
          </span>
        </div>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <button
          onClick={switchToLogin}
          className={`
            text-sm font-medium transition-colors duration-150
            ${isDark 
              ? 'text-violet-400 hover:text-violet-300' 
              : 'text-violet-600 hover:text-violet-500'
            }
          `}
        >
          Sign in instead
        </button>
      </div>
    </motion.div>
  );
}
