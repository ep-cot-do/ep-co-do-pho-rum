import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/_contexts/ThemeContext";
import { ValidationError } from "@/app/_libs/validationUtils";

interface ErrorDisplayProps {
    errors: ValidationError[];
    fieldName?: string;
    className?: string;
}

export default function ErrorDisplay({ errors, fieldName, className = "" }: ErrorDisplayProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // If fieldName is provided, show only errors for that field
    const relevantErrors = fieldName
        ? errors.filter(error => error.field === fieldName)
        : errors.filter(error => error.field === 'general');

    if (relevantErrors.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                className={`text-red-500 text-sm space-y-1 ${className}`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
            >
                {relevantErrors.map((error, index) => (
                    <motion.div
                        key={`${error.field}-${index}`}
                        className={`flex items-center gap-1 ${isDark ? 'text-red-400' : 'text-red-600'
                            }`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <svg
                            className="w-4 h-4 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>{error.message}</span>
                    </motion.div>
                ))}
            </motion.div>
        </AnimatePresence>
    );
}
