"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
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
      className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center sticky top-0 bg-inherit z-10">
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

      {/* General error display */}
      <ErrorDisplay errors={validationErrors} />

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
            Username <span className="text-red-500">*</span>
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={signupForm.username || ''}
            onChange={handleSignupChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md transition-colors ${
              hasFieldError(validationErrors, 'username')
                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : isDark
                ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
            }`}
            placeholder="Username (3-20 characters, letters, numbers, underscore)"
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
            htmlFor="email"
            className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={signupForm.email || ''}
            onChange={handleSignupChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md transition-colors ${
              hasFieldError(validationErrors, 'email')
                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : isDark
                ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
            }`}
            placeholder="your@email.com"
            required
          />
          <ErrorDisplay errors={validationErrors} fieldName="email" className="mt-1" />
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
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={signupForm.fullName || ''}
            onChange={handleSignupChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md transition-colors ${
              hasFieldError(validationErrors, 'fullName')
                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : isDark
                ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
            }`}
            placeholder="Your full name"
            required
          />
          <ErrorDisplay errors={validationErrors} fieldName="fullName" className="mt-1" />
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
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={signupForm.password || ''}
              onChange={handleSignupChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md transition-colors ${
                hasFieldError(validationErrors, 'password')
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                  : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
              }`}
              placeholder="8+ chars, uppercase, lowercase, number"
              required
            />
            <ErrorDisplay errors={validationErrors} fieldName="password" className="mt-1" />
          </div>

          <div>
            <label
              htmlFor="rePassword"
              className={`block text-sm font-medium mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              id="rePassword"
              name="rePassword"
              type="password"
              value={signupForm.rePassword || ''}
              onChange={handleSignupChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md transition-colors ${
                hasFieldError(validationErrors, 'rePassword')
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                  : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
              }`}
              placeholder="Confirm password"
              required
            />
            <ErrorDisplay errors={validationErrors} fieldName="rePassword" className="mt-1" />
          </div>
        </motion.div>

        {/* Additional information */}
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
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md transition-colors ${
                hasFieldError(validationErrors, 'github')
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                  : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
              }`}
              placeholder="GitHub username"
            />
            <ErrorDisplay errors={validationErrors} fieldName="github" className="mt-1" />
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
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md transition-colors ${
                hasFieldError(validationErrors, 'studentCode')
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                  : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
              }`}
              placeholder="Student code (XX######)"
            />
            <ErrorDisplay errors={validationErrors} fieldName="studentCode" className="mt-1" />
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
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={signupForm.gender || 'MALE'}
              onChange={handleSignupChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md transition-colors ${
                hasFieldError(validationErrors, 'gender')
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                  : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
              }`}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            <ErrorDisplay errors={validationErrors} fieldName="gender" className="mt-1" />
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
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md transition-colors ${
                hasFieldError(validationErrors, 'phone')
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                  : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
              }`}
              placeholder="Vietnamese phone number"
            />
            <ErrorDisplay errors={validationErrors} fieldName="phone" className="mt-1" />
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
              Major <span className="text-red-500">*</span>
            </label>
            <select
              id="major"
              name="major"
              value={signupForm.major || 'SE'}
              onChange={handleSignupChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md transition-colors ${
                hasFieldError(validationErrors, 'major')
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                  : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
              }`}
              required
            >
              <option value="SE">Software Engineering</option>
              <option value="AI">Artificial Intelligence</option>
              <option value="IA">Information Assurance</option>
            </select>
            <ErrorDisplay errors={validationErrors} fieldName="major" className="mt-1" />
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
              value={signupForm.birthday ? (typeof signupForm.birthday === 'string' ? signupForm.birthday : new Date(signupForm.birthday).toISOString().split('T')[0]) : ''}
              onChange={handleSignupChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md transition-colors ${
                hasFieldError(validationErrors, 'birthday')
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                  : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
              }`}
            />
            <ErrorDisplay errors={validationErrors} fieldName="birthday" className="mt-1" />
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
            Current Term <span className="text-red-500">*</span>
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
            className={`w-full px-3 py-2 border rounded-md transition-colors ${
              hasFieldError(validationErrors, 'currentTerm')
                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : isDark
                ? 'bg-zinc-800 border-zinc-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
                : 'bg-white border-zinc-300 text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-500'
            }`}
            placeholder="Current term (1-10)"
          />
          <ErrorDisplay errors={validationErrors} fieldName="currentTerm" className="mt-1" />
        </motion.div>

        <motion.div
          className="mt-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <motion.button
            type="submit"
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
              isLoading || validationErrors.length > 0
                ? 'bg-violet-400 cursor-not-allowed'
                : isDark
                  ? 'bg-violet-600 hover:bg-violet-700'
                  : 'bg-violet-600 hover:bg-violet-700'
            }`}
            whileHover={!isLoading && validationErrors.length === 0 ? { scale: 1.02 } : {}}
            whileTap={!isLoading && validationErrors.length === 0 ? { scale: 0.98 } : {}}
            style={{
              boxShadow: validationErrors.length === 0 ? '0 4px 14px rgba(124, 58, 237, 0.4)' : 'none'
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
