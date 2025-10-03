// Validation utilities for form fields
import { Account } from "./types";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface SignupFormData extends Partial<Account> {
  rePassword: string;
}

export interface ServerErrorResponse {
  message?: string;
  validationErrors?: Array<{
    field?: string;
    message?: string;
  }>;
}

// Common validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  PHONE: /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/,
  STUDENT_CODE: /^[A-Z]{2}\d{6}$/,
  GITHUB_USERNAME: /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/,
};

// Error messages
export const VALIDATION_MESSAGES = {
  REQUIRED: (field: string) => `${field} là bắt buộc`,
  EMAIL_INVALID: "Vui lòng nhập địa chỉ email hợp lệ",
  USERNAME_INVALID:
    "Tên đăng nhập phải có 3-20 ký tự và chỉ chứa chữ cái, số, và dấu gạch dưới",
  PASSWORD_WEAK:
    "Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số",
  PASSWORD_MISMATCH: "Mật khẩu xác nhận không khớp",
  PHONE_INVALID: "Vui lòng nhập số điện thoại Việt Nam hợp lệ",
  STUDENT_CODE_INVALID: "Mã sinh viên phải có định dạng XX######",
  GITHUB_INVALID: "Vui lòng nhập tên người dùng GitHub hợp lệ",
  FULL_NAME_INVALID: "Họ tên phải có ít nhất 2 ký tự",
  CURRENT_TERM_INVALID: "Học kỳ hiện tại phải từ 1 đến 10",
  AGE_INVALID: "Bạn phải từ 16 tuổi trở lên",
  ROLE_ID_REQUIRED: "ID vai trò là bắt buộc",
  LOGIN_FAILED: "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.",
  NETWORK_ERROR:
    "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.",
  GENERAL_ERROR: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.",
};

// Individual field validators
export const validators = {
  username: (value: string): ValidationResult => {
    const errors: ValidationError[] = [];

    if (!value || value.trim() === "") {
      errors.push({
        field: "username",
        message: VALIDATION_MESSAGES.REQUIRED("Tên đăng nhập"),
      });
    } else if (!VALIDATION_PATTERNS.USERNAME.test(value.trim())) {
      errors.push({
        field: "username",
        message: VALIDATION_MESSAGES.USERNAME_INVALID,
      });
    }

    return { isValid: errors.length === 0, errors };
  },

  email: (value: string): ValidationResult => {
    const errors: ValidationError[] = [];

    if (!value || value.trim() === "") {
      errors.push({
        field: "email",
        message: VALIDATION_MESSAGES.REQUIRED("Email"),
      });
    } else if (!VALIDATION_PATTERNS.EMAIL.test(value.trim())) {
      errors.push({
        field: "email",
        message: VALIDATION_MESSAGES.EMAIL_INVALID,
      });
    }

    return { isValid: errors.length === 0, errors };
  },

  password: (value: string): ValidationResult => {
    const errors: ValidationError[] = [];

    if (!value || value.trim() === "") {
      errors.push({
        field: "password",
        message: VALIDATION_MESSAGES.REQUIRED("Mật khẩu"),
      });
    } else if (!VALIDATION_PATTERNS.PASSWORD.test(value)) {
      errors.push({
        field: "password",
        message: VALIDATION_MESSAGES.PASSWORD_WEAK,
      });
    }

    return { isValid: errors.length === 0, errors };
  },

  confirmPassword: (
    password: string,
    confirmPassword: string
  ): ValidationResult => {
    const errors: ValidationError[] = [];

    if (!confirmPassword || confirmPassword.trim() === "") {
      errors.push({
        field: "rePassword",
        message: VALIDATION_MESSAGES.REQUIRED("Xác nhận mật khẩu"),
      });
    } else if (password !== confirmPassword) {
      errors.push({
        field: "rePassword",
        message: VALIDATION_MESSAGES.PASSWORD_MISMATCH,
      });
    }

    return { isValid: errors.length === 0, errors };
  },

  fullName: (value: string): ValidationResult => {
    const errors: ValidationError[] = [];

    if (!value || value.trim() === "") {
      errors.push({
        field: "fullName",
        message: VALIDATION_MESSAGES.REQUIRED("Họ tên"),
      });
    } else if (value.trim().length < 2) {
      errors.push({
        field: "fullName",
        message: VALIDATION_MESSAGES.FULL_NAME_INVALID,
      });
    }

    return { isValid: errors.length === 0, errors };
  },

  phone: (value: string): ValidationResult => {
    const errors: ValidationError[] = [];

    if (!value || value.trim() === "") {
      errors.push({
        field: "phone",
        message: VALIDATION_MESSAGES.REQUIRED("Số điện thoại"),
      });
    } else if (
      value &&
      value.trim() !== "" &&
      !VALIDATION_PATTERNS.PHONE.test(value.trim())
    ) {
      errors.push({
        field: "phone",
        message: VALIDATION_MESSAGES.PHONE_INVALID,
      });
    }

    return { isValid: errors.length === 0, errors };
  },

  studentCode: (value: string): ValidationResult => {
    const errors: ValidationError[] = [];

    if (!value || value.trim() === "") {
      errors.push({
        field: "studentCode",
        message: VALIDATION_MESSAGES.REQUIRED("Student Code"),
      });
    } else if (
      value &&
      value.trim() !== "" &&
      !VALIDATION_PATTERNS.STUDENT_CODE.test(value.trim().toUpperCase())
    ) {
      errors.push({
        field: "studentCode",
        message: VALIDATION_MESSAGES.STUDENT_CODE_INVALID,
      });
    }

    return { isValid: errors.length === 0, errors };
  },

  github: (value: string, required: boolean = false): ValidationResult => {
    const errors: ValidationError[] = [];

    if (required && (!value || value.trim() === "")) {
      errors.push({
        field: "github",
        message: VALIDATION_MESSAGES.REQUIRED("GitHub Username"),
      });
    } else if (
      value &&
      value.trim() !== "" &&
      !VALIDATION_PATTERNS.GITHUB_USERNAME.test(value.trim())
    ) {
      errors.push({
        field: "github",
        message: VALIDATION_MESSAGES.GITHUB_INVALID,
      });
    }

    return { isValid: errors.length === 0, errors };
  },

  currentTerm: (value: number | undefined): ValidationResult => {
    const errors: ValidationError[] = [];

    if (value === undefined || value === null) {
      errors.push({
        field: "currentTerm",
        message: VALIDATION_MESSAGES.REQUIRED("Current Term"),
      });
    } else if (value < 1 || value > 10) {
      errors.push({
        field: "currentTerm",
        message: VALIDATION_MESSAGES.CURRENT_TERM_INVALID,
      });
    }

    return { isValid: errors.length === 0, errors };
  },

  birthday: (
    value: Date | string | undefined,
    required: boolean = false
  ): ValidationResult => {
    const errors: ValidationError[] = [];

    if (required && (!value || value === "")) {
      errors.push({
        field: "birthday",
        message: VALIDATION_MESSAGES.REQUIRED("Birthday"),
      });
    } else if (value) {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        if (age - 1 < 16) {
          errors.push({
            field: "birthday",
            message: VALIDATION_MESSAGES.AGE_INVALID,
          });
        }
      } else if (age < 16) {
        errors.push({
          field: "birthday",
          message: VALIDATION_MESSAGES.AGE_INVALID,
        });
      }
    }

    return { isValid: errors.length === 0, errors };
  },

  gender: (value: string): ValidationResult => {
    const errors: ValidationError[] = [];
    const validGenders = ["MALE", "FEMALE", "OTHER"];

    if (!value || value.trim() === "") {
      errors.push({
        field: "gender",
        message: VALIDATION_MESSAGES.REQUIRED("Gender"),
      });
    } else if (!validGenders.includes(value)) {
      errors.push({ field: "gender", message: "Please select a valid gender" });
    }

    return { isValid: errors.length === 0, errors };
  },

  major: (value: string): ValidationResult => {
    const errors: ValidationError[] = [];
    const validMajors = ["SE", "AI", "IA"];

    if (!value || value.trim() === "") {
      errors.push({
        field: "major",
        message: VALIDATION_MESSAGES.REQUIRED("Major"),
      });
    } else if (!validMajors.includes(value)) {
      errors.push({ field: "major", message: "Please select a valid major" });
    }

    return { isValid: errors.length === 0, errors };
  },
};

// Form validators
export const validateLoginForm = (formData: {
  username: string;
  password: string;
}): ValidationResult => {
  const allErrors: ValidationError[] = [];

  // Validate username
  const usernameResult = validators.username(formData.username);
  allErrors.push(...usernameResult.errors);

  // Validate password (basic required check for login)
  if (!formData.password || formData.password.trim() === "") {
    allErrors.push({
      field: "password",
      message: VALIDATION_MESSAGES.REQUIRED("Mật khẩu"),
    });
  }

  return { isValid: allErrors.length === 0, errors: allErrors };
};

export const validateSignupForm = (
  formData: SignupFormData
): ValidationResult => {
  const allErrors: ValidationError[] = [];

  // Validate required fields
  const usernameResult = validators.username(formData.username || "");
  allErrors.push(...usernameResult.errors);

  const emailResult = validators.email(formData.email || "");
  allErrors.push(...emailResult.errors);

  const passwordResult = validators.password(formData.password || "");
  allErrors.push(...passwordResult.errors);

  const confirmPasswordResult = validators.confirmPassword(
    formData.password || "",
    formData.rePassword || ""
  );
  allErrors.push(...confirmPasswordResult.errors);

  const fullNameResult = validators.fullName(formData.fullName || "");
  allErrors.push(...fullNameResult.errors);

  const genderResult = validators.gender(formData.gender || "");
  allErrors.push(...genderResult.errors);

  const majorResult = validators.major(formData.major || "");
  allErrors.push(...majorResult.errors);

  const currentTermResult = validators.currentTerm(formData.currentTerm);
  allErrors.push(...currentTermResult.errors);

  // Validate optional fields
  const phoneResult = validators.phone(formData.phone || "", false);
  allErrors.push(...phoneResult.errors);

  const studentCodeResult = validators.studentCode(
    formData.studentCode || "",
    false
  );
  allErrors.push(...studentCodeResult.errors);

  const githubResult = validators.github(formData.github || "", false);
  allErrors.push(...githubResult.errors);

  const birthdayResult = validators.birthday(formData.birthday, false);
  allErrors.push(...birthdayResult.errors);

  return { isValid: allErrors.length === 0, errors: allErrors };
};

// Real-time validation helpers
export const getFieldError = (
  errors: ValidationError[],
  fieldName: string
): string | null => {
  const error = errors.find((err) => err.field === fieldName);
  return error ? error.message : null;
};

export const hasFieldError = (
  errors: ValidationError[],
  fieldName: string
): boolean => {
  return errors.some((err) => err.field === fieldName);
};

// Server error handling
export const handleServerValidationErrors = (
  serverResponse: ServerErrorResponse
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (serverResponse.message) {
    // Handle specific backend validation errors
    if (serverResponse.message.includes("Role ID")) {
      errors.push({
        field: "roleId",
        message: VALIDATION_MESSAGES.ROLE_ID_REQUIRED,
      });
    } else if (
      serverResponse.message.includes("Bad credentials") ||
      serverResponse.message.includes("Invalid credentials") ||
      serverResponse.message.includes("Authentication failed") ||
      serverResponse.message.includes("Unauthorized")
    ) {
      errors.push({
        field: "general",
        message: "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.",
      });
    } else if (serverResponse.message.includes("username")) {
      errors.push({ field: "username", message: serverResponse.message });
    } else if (serverResponse.message.includes("email")) {
      errors.push({ field: "email", message: serverResponse.message });
    } else {
      // Translate common error messages to Vietnamese
      let translatedMessage = serverResponse.message;
      if (serverResponse.message.toLowerCase().includes("failed to login")) {
        translatedMessage =
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      } else if (
        serverResponse.message.toLowerCase().includes("login failed")
      ) {
        translatedMessage = "Đăng nhập thất bại. Vui lòng thử lại.";
      }

      errors.push({ field: "general", message: translatedMessage });
    }
  }

  // Handle validation array from backend if exists
  if (
    serverResponse.validationErrors &&
    Array.isArray(serverResponse.validationErrors)
  ) {
    serverResponse.validationErrors.forEach((error) => {
      errors.push({
        field: error.field || "general",
        message: error.message || "Lỗi xác thực dữ liệu",
      });
    });
  }

  return errors;
};
