const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1`;

// Library/Resource interfaces based on your API response
export interface LibraryResource {
  id: number;
  authorId: string;
  semester: number;
  major: string;
  description: string;
  url: string;
  thumbnail: string;
  type: string;
  status: string;
  createdDate: string;
  updatedDate: string;
}

export interface LibraryApiResponse {
  content: LibraryResource;
  message: string;
  code: string;
  success: boolean;
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
}

export interface LibrariesApiResponse {
  content: LibraryResource[];
  message: string;
  code: string;
  success: boolean;
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
}

// Account/User interface for author information
export interface UserAccount {
  id: number;
  username: string;
  email: string;
  github: string;
  studentCode: string;
  fullName: string;
  gender: "MALE" | "FEMALE";
  phone: string;
  major: string;
  birthday: string | null;
  profileImg: string;
  currentTerm: number;
  fundStatus: boolean;
  createdDate: string;
  updatedDate: string;
  lastLogin: string;
  isActive: boolean;
  role: string;
}

export interface AccountApiResponse {
  content: UserAccount;
  message: string;
  code: string;
  success: boolean;
  pagination: null;
}

export interface PaginationInfo {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

// Get all
export async function getLibraries(params?: {
  page?: number;
  size?: number;
  semester?: number;
  major?: string;
  type?: string;
}): Promise<{
  resources: LibraryResource[];
  pagination: PaginationInfo | null;
}> {
  try {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params?.size !== undefined)
      queryParams.append("size", params.size.toString());
    if (params?.semester !== undefined)
      queryParams.append("semester", params.semester.toString());
    if (params?.major) queryParams.append("major", params.major);
    if (params?.type) queryParams.append("type", params.type);

    const url = `${endpoint}/libraries${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LibrariesApiResponse = await response.json();

    if (data.success && data.content && Array.isArray(data.content)) {
      return {
        resources: data.content,
        pagination: data.pagination,
      };
    } else {
      console.warn("Unexpected API response format:", data);
      return { resources: [], pagination: null };
    }
  } catch (error) {
    console.error("Error fetching libraries:", error);
    throw error;
  }
}

// Get library by ID
export async function getLibraryById(
  id: number
): Promise<LibraryResource | null> {
  try {
    const response = await fetch(`${endpoint}/libraries/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LibraryApiResponse = await response.json();

    if (data.success && data.content) {
      return data.content;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching library by ID:", error);
    throw error;
  }
}

// Get user account by ID
export async function getAccountById(id: string): Promise<UserAccount | null> {
  try {
    const response = await fetch(`${endpoint}/accounts/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AccountApiResponse = await response.json();

    if (data.success && data.content) {
      return data.content;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching account by ID:", error);
    throw error;
  }
}

// Helper: function to get resource type from file extension or type
export function getResourceTypeFromApiType(apiType: string): string {
  const type = apiType.toLowerCase();

  if (type.includes("pdf")) return "pdf";
  if (type.includes("doc") || type.includes("word")) return "document";
  if (type.includes("ppt") || type.includes("powerpoint"))
    return "presentation";
  if (type.includes("code") || type.includes("zip") || type.includes("github"))
    return "code";
  if (type.includes("zip") || type.includes("rar")) return "archive";
  if (type.includes("xls") || type.includes("excel") || type.includes("csv"))
    return "spreadsheet";
  if (type.includes("jpg") || type.includes("png") || type.includes("image"))
    return "image";
  if (type.includes("link") || type.includes("url") || type.includes("http"))
    return "link";
  if (type.includes("folder") || type.includes("directory")) return "folder";

  return "document";
}

// Helper function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Helper function to format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;

  return date.toLocaleDateString();
}
