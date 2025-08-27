"use client";

import { useState, useMemo, useEffect } from "react";
import LayoutWrapper from "../_sections/Wrapper";
import { useTheme } from "../_contexts/ThemeContext";
import {
  IconSearch,
  IconFileText,
  IconPdf,
  IconFileCode,
  IconFileZip,
  IconFileTypePpt,
  IconFileTypeXls,
  IconFileTypeDoc,
  IconPhoto,
  IconLink,
  IconFolder,
  IconExternalLink,
  IconDownload,
  IconEye,
  IconChevronDown,
  IconInfoCircle,
  IconList,
  IconLayoutGrid,
  IconX,
  IconLoader2,
} from "@tabler/icons-react";
import {
  getLibraries,
  getAccountById,
  LibraryResource,
  UserAccount,
  getResourceTypeFromApiType,
  formatDate,
  PaginationInfo,
} from "../_apis/user/resources";

type ResourceType =
  | "document"
  | "presentation"
  | "code"
  | "archive"
  | "spreadsheet"
  | "image"
  | "link"
  | "pdf"
  | "folder";

interface EnhancedResource extends LibraryResource {
  resourceType: ResourceType;
  author?: UserAccount;
  formattedDate: string;
  tags?: string[];
  views: number;
  downloads: number;
}

// Define
type ViewMode = "grid" | "list";

export default function ResourcesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMajor, setSelectedMajor] = useState<string>("all");
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isMajorDropdownOpen, setIsMajorDropdownOpen] = useState(false);
  const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [selectedResource, setSelectedResource] =
    useState<EnhancedResource | null>(null);

  // API state
  const [resources, setResources] = useState<EnhancedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Get unique majors
  const majors = useMemo(() => {
    const uniqueMajors = new Set(resources.map((r) => r.major).filter(Boolean));
    return Array.from(uniqueMajors).sort();
  }, [resources]);

  // Get unique types
  const resourceTypes = useMemo(() => {
    const uniqueTypes = new Set(resources.map((r) => r.type).filter(Boolean));
    return Array.from(uniqueTypes).sort();
  }, [resources]);

  // Fetch API
  const fetchResources = async (page: number = 0) => {
    setLoading(true);
    setError(null);

    try {
      const params: {
        page: number;
        size: number;
        semester?: number;
        major?: string;
        type?: string;
      } = {
        page,
        size: 20,
      };

      if (selectedSemester !== null) {
        params.semester = selectedSemester;
      }

      if (selectedMajor !== "all") {
        params.major = selectedMajor;
      }

      if (selectedType !== "all") {
        params.type = selectedType;
      }

      const { resources: apiResources, pagination: apiPagination } =
        await getLibraries(params);

      const enhancedResources: EnhancedResource[] = await Promise.all(
        apiResources.map(async (resource) => {
          const resourceType = getResourceTypeFromApiType(
            resource.type
          ) as ResourceType;
          const formattedDate = formatDate(resource.createdDate);

          // Fetch author information
          let author: UserAccount | undefined;
          try {
            author = (await getAccountById(resource.authorId)) || undefined;
          } catch (err) {
            console.warn(`Failed to fetch author ${resource.authorId}:`, err);
          }

          return {
            ...resource,
            resourceType,
            formattedDate,
            author,
            views: Math.floor(Math.random() * 300) + 50,
            downloads: Math.floor(Math.random() * 200) + 20,
            tags: resource.type
              ? [resource.type, resource.major].filter(Boolean)
              : [],
          };
        })
      );

      setResources(enhancedResources);
      setPagination(apiPagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch resources"
      );
      console.error("Error fetching resources:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchResources(0);
  }, [selectedSemester, selectedMajor, selectedType]);

  const filteredResources = useMemo(() => {
    if (!searchTerm) return resources;

    return resources.filter((resource) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        resource.description.toLowerCase().includes(searchLower) ||
        resource.major.toLowerCase().includes(searchLower) ||
        resource.type.toLowerCase().includes(searchLower) ||
        resource.author?.fullName.toLowerCase().includes(searchLower) ||
        resource.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    });
  }, [searchTerm, resources]);

  const semesters = useMemo(() => {
    const uniqueSemesters = new Set(
      resources.map((r) => r.semester).filter((s) => s > 0)
    );
    return Array.from(uniqueSemesters).sort((a, b) => a - b);
  }, [resources]);

  // Function to render  icon for resource type
  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case "pdf":
        return (
          <IconPdf
            size={24}
            className={isDark ? "text-red-400" : "text-red-500"}
          />
        );
      case "document":
        return (
          <IconFileTypeDoc
            size={24}
            className={isDark ? "text-blue-400" : "text-blue-500"}
          />
        );
      case "presentation":
        return (
          <IconFileTypePpt
            size={24}
            className={isDark ? "text-orange-400" : "text-orange-500"}
          />
        );
      case "code":
        return (
          <IconFileCode
            size={24}
            className={isDark ? "text-green-400" : "text-green-500"}
          />
        );
      case "archive":
        return (
          <IconFileZip
            size={24}
            className={isDark ? "text-purple-400" : "text-purple-500"}
          />
        );
      case "spreadsheet":
        return (
          <IconFileTypeXls
            size={24}
            className={isDark ? "text-emerald-400" : "text-emerald-500"}
          />
        );
      case "image":
        return (
          <IconPhoto
            size={24}
            className={isDark ? "text-pink-400" : "text-pink-500"}
          />
        );
      case "link":
        return (
          <IconLink
            size={24}
            className={isDark ? "text-sky-400" : "text-sky-500"}
          />
        );
      case "folder":
        return (
          <IconFolder
            size={24}
            className={isDark ? "text-yellow-400" : "text-yellow-500"}
          />
        );
      default:
        return (
          <IconFileText
            size={24}
            className={isDark ? "text-zinc-400" : "text-zinc-500"}
          />
        );
    }
  };

  // Function to handle resource click
  const handleResourceClick = (resource: EnhancedResource) => {
    setSelectedResource(resource);
    setShowInfoPanel(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const panel = document.getElementById("info-panel");
      if (
        panel &&
        !panel.contains(event.target as Node) &&
        !event.composedPath().some((el) => {
          const element = el as HTMLElement;
          return (
            element.classList && element.classList.contains("resource-item")
          );
        })
      ) {
        setShowInfoPanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (error) {
    return (
      <LayoutWrapper maxWidth="w-full">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center gap-3">
            <IconFileText
              className={isDark ? "text-violet-400" : "text-violet-600"}
              size={30}
              stroke={1.5}
            />
            Learning Resources
          </h1>
        </div>

        <div
          className={`p-8 text-center rounded-xl ${
            isDark ? "bg-zinc-800/30" : "bg-white border border-zinc-100"
          }`}
        >
          <p className={`text-red-500 mb-4`}>
            Error loading resources: {error}
          </p>
          <button
            onClick={() => fetchResources(0)}
            className={`px-4 py-2 rounded-md ${
              isDark
                ? "bg-violet-600 hover:bg-violet-700 text-white"
                : "bg-violet-600 hover:bg-violet-700 text-white"
            }`}
          >
            Try Again
          </button>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper maxWidth="w-full">
      {/* Page Title */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center gap-3">
          <IconFileText
            className={isDark ? "text-violet-400" : "text-violet-600"}
            size={30}
            stroke={1.5}
          />
          Learning Resources
        </h1>
        <p className={`mt-2 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
          Browse and download resources organized by subject
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div
        className={`p-4 mb-6 rounded-xl ${
          isDark
            ? "bg-zinc-800/30"
            : "bg-white border border-zinc-100 shadow-sm"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                isDark
                  ? "bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500"
                  : "bg-white border-zinc-200 text-zinc-800 placeholder:text-zinc-400"
              } border`}
            />
            <IconSearch
              size={18}
              className={`absolute left-3 top-2.5 ${
                isDark ? "text-zinc-500" : "text-zinc-400"
              }`}
            />
          </div>

          {/* Major Filter */}
          <div className="md:w-64 relative">
            <div
              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${
                isDark
                  ? "bg-zinc-800 border-zinc-700 text-zinc-200"
                  : "bg-white border-zinc-200 text-zinc-800"
              } border`}
              onClick={() => setIsMajorDropdownOpen(!isMajorDropdownOpen)}
            >
              <span
                className={
                  selectedMajor === "all"
                    ? isDark
                      ? "text-zinc-400"
                      : "text-zinc-500"
                    : ""
                }
              >
                {selectedMajor === "all" ? "All Majors" : selectedMajor}
              </span>
              <IconChevronDown
                size={18}
                className={isDark ? "text-zinc-400" : "text-zinc-500"}
              />
            </div>

            {isMajorDropdownOpen && (
              <div
                className={`absolute z-10 mt-1 w-full max-h-64 overflow-y-auto rounded-lg border ${
                  isDark
                    ? "bg-zinc-800 border-zinc-700"
                    : "bg-white border-zinc-200 shadow-lg"
                }`}
              >
                <div
                  className={`px-4 py-2 cursor-pointer ${
                    selectedMajor === "all"
                      ? isDark
                        ? "bg-zinc-700"
                        : "bg-zinc-100"
                      : isDark
                      ? "hover:bg-zinc-700"
                      : "hover:bg-zinc-50"
                  }`}
                  onClick={() => {
                    setSelectedMajor("all");
                    setIsMajorDropdownOpen(false);
                  }}
                >
                  All Majors
                </div>
                {majors.map((major) => (
                  <div
                    key={major}
                    className={`px-4 py-2 cursor-pointer ${
                      selectedMajor === major
                        ? isDark
                          ? "bg-zinc-700"
                          : "bg-zinc-100"
                        : isDark
                        ? "hover:bg-zinc-700"
                        : "hover:bg-zinc-50"
                    }`}
                    onClick={() => {
                      setSelectedMajor(major);
                      setIsMajorDropdownOpen(false);
                    }}
                  >
                    {major}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Semester Filter */}
          <div className="md:w-48 relative">
            <div
              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${
                isDark
                  ? "bg-zinc-800 border-zinc-700 text-zinc-200"
                  : "bg-white border-zinc-200 text-zinc-800"
              } border`}
              onClick={() => setIsSemesterDropdownOpen(!isSemesterDropdownOpen)}
            >
              <span
                className={
                  selectedSemester === null
                    ? isDark
                      ? "text-zinc-400"
                      : "text-zinc-500"
                    : ""
                }
              >
                {selectedSemester === null
                  ? "All Semesters"
                  : `Semester ${selectedSemester}`}
              </span>
              <IconChevronDown
                size={18}
                className={isDark ? "text-zinc-400" : "text-zinc-500"}
              />
            </div>

            {isSemesterDropdownOpen && (
              <div
                className={`absolute z-10 mt-1 w-full max-h-64 overflow-y-auto rounded-lg border ${
                  isDark
                    ? "bg-zinc-800 border-zinc-700"
                    : "bg-white border-zinc-200 shadow-lg"
                }`}
              >
                <div
                  className={`px-4 py-2 cursor-pointer ${
                    selectedSemester === null
                      ? isDark
                        ? "bg-zinc-700"
                        : "bg-zinc-100"
                      : isDark
                      ? "hover:bg-zinc-700"
                      : "hover:bg-zinc-50"
                  }`}
                  onClick={() => {
                    setSelectedSemester(null);
                    setIsSemesterDropdownOpen(false);
                  }}
                >
                  All Semesters
                </div>
                {semesters.map((semester) => (
                  <div
                    key={semester}
                    className={`px-4 py-2 cursor-pointer ${
                      selectedSemester === semester
                        ? isDark
                          ? "bg-zinc-700"
                          : "bg-zinc-100"
                        : isDark
                        ? "hover:bg-zinc-700"
                        : "hover:bg-zinc-50"
                    }`}
                    onClick={() => {
                      setSelectedSemester(semester);
                      setIsSemesterDropdownOpen(false);
                    }}
                  >
                    Semester {semester}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Type Filter */}
          <div className="md:w-40 relative">
            <div
              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${
                isDark
                  ? "bg-zinc-800 border-zinc-700 text-zinc-200"
                  : "bg-white border-zinc-200 text-zinc-800"
              } border`}
              onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
            >
              <span
                className={
                  selectedType === "all"
                    ? isDark
                      ? "text-zinc-400"
                      : "text-zinc-500"
                    : ""
                }
              >
                {selectedType === "all" ? "All Types" : selectedType}
              </span>
              <IconChevronDown
                size={18}
                className={isDark ? "text-zinc-400" : "text-zinc-500"}
              />
            </div>

            {isTypeDropdownOpen && (
              <div
                className={`absolute z-10 mt-1 w-full max-h-64 overflow-y-auto rounded-lg border ${
                  isDark
                    ? "bg-zinc-800 border-zinc-700"
                    : "bg-white border-zinc-200 shadow-lg"
                }`}
              >
                <div
                  className={`px-4 py-2 cursor-pointer ${
                    selectedType === "all"
                      ? isDark
                        ? "bg-zinc-700"
                        : "bg-zinc-100"
                      : isDark
                      ? "hover:bg-zinc-700"
                      : "hover:bg-zinc-50"
                  }`}
                  onClick={() => {
                    setSelectedType("all");
                    setIsTypeDropdownOpen(false);
                  }}
                >
                  All Types
                </div>
                {resourceTypes.map((type) => (
                  <div
                    key={type}
                    className={`px-4 py-2 cursor-pointer ${
                      selectedType === type
                        ? isDark
                          ? "bg-zinc-700"
                          : "bg-zinc-100"
                        : isDark
                        ? "hover:bg-zinc-700"
                        : "hover:bg-zinc-50"
                    }`}
                    onClick={() => {
                      setSelectedType(type);
                      setIsTypeDropdownOpen(false);
                    }}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* View Mode Toggle & Results Count */}
        <div className="flex justify-between items-center mt-4">
          <div className={isDark ? "text-zinc-400" : "text-zinc-500"}>
            {loading ? (
              <div className="flex items-center gap-2">
                <IconLoader2 size={16} className="animate-spin" />
                Loading resources...
              </div>
            ) : (
              <>
                {filteredResources.length}{" "}
                {filteredResources.length === 1 ? "resource" : "resources"}{" "}
                found
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${
                viewMode === "list"
                  ? isDark
                    ? "bg-zinc-700 text-zinc-200"
                    : "bg-zinc-200 text-zinc-800"
                  : isDark
                  ? "text-zinc-400"
                  : "text-zinc-600"
              }`}
              aria-label="List view"
              title="List view"
            >
              <IconList
                size={18}
                className={isDark ? "text-zinc-400" : "text-zinc-600"}
              />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${
                viewMode === "grid"
                  ? isDark
                    ? "bg-zinc-700 text-zinc-200"
                    : "bg-zinc-200 text-zinc-800"
                  : isDark
                  ? "text-zinc-400"
                  : "text-zinc-600"
              }`}
              aria-label="Grid view"
              title="Grid view"
            >
              <IconLayoutGrid
                size={18}
                className={isDark ? "text-zinc-400" : "text-zinc-600"}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area with Resources */}
      <div className="relative flex flex-col lg:flex-row gap-4">
        {/* Resources List */}
        <div className={`flex-grow ${showInfoPanel ? "lg:w-2/3" : "w-full"}`}>
          {loading ? (
            <div
              className={`p-8 text-center rounded-xl ${
                isDark ? "bg-zinc-800/30" : "bg-white border border-zinc-100"
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <IconLoader2 size={24} className="animate-spin" />
                <p className={isDark ? "text-zinc-400" : "text-zinc-500"}>
                  Loading resources...
                </p>
              </div>
            </div>
          ) : filteredResources.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "flex flex-col gap-2"
              }
            >
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className={`resource-item cursor-pointer transition-colors ${
                    viewMode === "grid"
                      ? `rounded-xl overflow-hidden aspect-[4/2] flex flex-col ${
                          isDark
                            ? "bg-zinc-800/40 hover:bg-zinc-800/60"
                            : "bg-white hover:bg-zinc-50 border border-zinc-100 shadow-sm"
                        }`
                      : `rounded-lg ${
                          isDark ? "hover:bg-zinc-800/40" : "hover:bg-zinc-50"
                        } p-3`
                  } ${
                    selectedResource?.id === resource.id
                      ? isDark
                        ? "bg-zinc-800/60 ring-1 ring-violet-500"
                        : "bg-zinc-50 ring-1 ring-violet-500"
                      : ""
                  }`}
                  onClick={() => handleResourceClick(resource)}
                >
                  {viewMode === "grid" ? (
                    /* Grid View */
                    <>
                      <div
                        className={`p-5 flex items-center justify-center ${
                          isDark ? "bg-zinc-700/50" : "bg-zinc-50"
                        }`}
                      >
                        {resource.thumbnail ? (
                          <img
                            src={resource.thumbnail}
                            alt={resource.description}
                            className="w-8 h-8 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              target.nextElementSibling?.setAttribute(
                                "style",
                                "display: block"
                              );
                            }}
                          />
                        ) : null}
                        <div
                          style={{
                            display: resource.thumbnail ? "none" : "block",
                          }}
                        >
                          {getResourceIcon(resource.resourceType)}
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <h3
                          className="font-medium text-base mb-1 truncate"
                          title={resource.description}
                        >
                          {resource.description.length > 50
                            ? `${resource.description.substring(0, 50)}...`
                            : resource.description}
                        </h3>
                        <p
                          className={`text-xs mb-3 line-clamp-2 ${
                            isDark ? "text-zinc-400" : "text-zinc-500"
                          }`}
                        >
                          {resource.major} • Semester {resource.semester}
                        </p>
                        <div className="flex justify-between items-center text-xs">
                          <span
                            className={`px-2 py-1 rounded-full ${
                              isDark
                                ? "bg-zinc-700 text-zinc-300"
                                : "bg-zinc-200 text-zinc-700"
                            }`}
                          >
                            {resource.type}
                          </span>
                          <span
                            className={
                              isDark ? "text-zinc-500" : "text-zinc-400"
                            }
                          >
                            {resource.formattedDate}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* List View */
                    <div className="flex gap-3 items-center">
                      <div
                        className={`p-2 rounded-lg flex-shrink-0 ${
                          isDark ? "bg-zinc-800" : "bg-zinc-100"
                        }`}
                      >
                        {resource.thumbnail ? (
                          <img
                            src={resource.thumbnail}
                            alt={resource.description}
                            className="w-6 h-6 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              target.nextElementSibling?.setAttribute(
                                "style",
                                "display: block"
                              );
                            }}
                          />
                        ) : null}
                        <div
                          style={{
                            display: resource.thumbnail ? "none" : "block",
                          }}
                        >
                          {getResourceIcon(resource.resourceType)}
                        </div>
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3
                          className="font-medium truncate"
                          title={resource.description}
                        >
                          {resource.description.length > 80
                            ? `${resource.description.substring(0, 80)}...`
                            : resource.description}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              isDark
                                ? "bg-zinc-700 text-zinc-300"
                                : "bg-zinc-200 text-zinc-700"
                            }`}
                          >
                            {resource.major}
                          </span>
                          <span
                            className={`text-xs ${
                              isDark ? "text-zinc-500" : "text-zinc-400"
                            }`}
                          >
                            Sem {resource.semester}
                          </span>
                          <span
                            className={`text-xs ${
                              isDark ? "text-zinc-500" : "text-zinc-400"
                            }`}
                          >
                            {resource.formattedDate}
                          </span>
                          <span
                            className={`text-xs ${
                              isDark ? "text-zinc-500" : "text-zinc-400"
                            }`}
                          >
                            {resource.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 text-xs items-center">
                        <span
                          className="flex items-center gap-1"
                          title="Downloads"
                        >
                          <IconDownload
                            size={14}
                            className={
                              isDark ? "text-zinc-500" : "text-zinc-400"
                            }
                          />
                          {resource.downloads}
                        </span>
                        <span
                          className="flex items-center gap-1 ml-2"
                          title="Views"
                        >
                          <IconEye
                            size={14}
                            className={
                              isDark ? "text-zinc-500" : "text-zinc-400"
                            }
                          />
                          {resource.views}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`p-8 text-center rounded-xl ${
                isDark ? "bg-zinc-800/30" : "bg-white border border-zinc-100"
              }`}
            >
              <p className={isDark ? "text-zinc-400" : "text-zinc-500"}>
                No resources found matching your filters. Try adjusting your
                search criteria.
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const newPage = currentPage - 1;
                    setCurrentPage(newPage);
                    fetchResources(newPage);
                  }}
                  disabled={currentPage === 0}
                  className={`px-3 py-1 rounded ${
                    currentPage === 0
                      ? isDark
                        ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                        : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                      : isDark
                      ? "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                      : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
                  }`}
                >
                  Previous
                </button>

                <span
                  className={`px-3 py-1 ${
                    isDark ? "text-zinc-400" : "text-zinc-600"
                  }`}
                >
                  Page {currentPage + 1} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => {
                    const newPage = currentPage + 1;
                    setCurrentPage(newPage);
                    fetchResources(newPage);
                  }}
                  disabled={currentPage >= pagination.totalPages - 1}
                  className={`px-3 py-1 rounded ${
                    currentPage >= pagination.totalPages - 1
                      ? isDark
                        ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                        : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                      : isDark
                      ? "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                      : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Panel */}
        {showInfoPanel && selectedResource && (
          <div
            id="info-panel"
            className={`lg:w-1/3 sticky top-24 h-min rounded-xl overflow-hidden ${
              isDark
                ? "bg-zinc-800/40"
                : "bg-white border border-zinc-100 shadow-sm"
            }`}
          >
            <div
              className={`p-4 ${
                isDark ? "bg-zinc-800/60" : "bg-zinc-50"
              } flex items-center justify-between`}
            >
              <h3 className="font-medium flex items-center gap-2">
                <IconInfoCircle
                  size={18}
                  className={isDark ? "text-violet-400" : "text-violet-600"}
                />
                Resource Details
              </h3>
              <button
                onClick={() => setShowInfoPanel(false)}
                className={`p-1 rounded-full ${
                  isDark ? "hover:bg-zinc-700" : "hover:bg-zinc-200"
                }`}
              >
                <IconX
                  size={18}
                  className={isDark ? "text-zinc-400" : "text-zinc-600"}
                />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-2 rounded-lg ${
                    isDark ? "bg-zinc-700" : "bg-zinc-100"
                  }`}
                >
                  {selectedResource.thumbnail ? (
                    <img
                      src={selectedResource.thumbnail}
                      alt={selectedResource.description}
                      className="w-6 h-6 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.setAttribute(
                          "style",
                          "display: block"
                        );
                      }}
                    />
                  ) : null}
                  <div
                    style={{
                      display: selectedResource.thumbnail ? "none" : "block",
                    }}
                  >
                    {getResourceIcon(selectedResource.resourceType)}
                  </div>
                </div>
                <h2 className="text-lg font-medium">
                  {selectedResource.description.length > 50
                    ? `${selectedResource.description.substring(0, 50)}...`
                    : selectedResource.description}
                </h2>
              </div>

              <div className="mb-4">
                <p
                  className={`mb-4 text-sm ${
                    isDark ? "text-zinc-300" : "text-zinc-700"
                  }`}
                >
                  {selectedResource.description}
                </p>

                <div
                  className={`p-3 rounded-lg mb-4 ${
                    isDark ? "bg-zinc-700/50" : "bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Major</span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        isDark
                          ? "bg-zinc-600 text-zinc-300"
                          : "bg-zinc-200 text-zinc-700"
                      }`}
                    >
                      {selectedResource.major}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Semester</span>
                    <span className="text-sm">{selectedResource.semester}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div
                    className={`p-3 rounded-lg ${
                      isDark ? "bg-zinc-700/50" : "bg-zinc-50"
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">Uploaded by</div>
                    <div
                      className={`text-sm ${
                        isDark ? "text-zinc-300" : "text-zinc-700"
                      }`}
                    >
                      {selectedResource.author?.fullName ||
                        selectedResource.authorId}
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      isDark ? "bg-zinc-700/50" : "bg-zinc-50"
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">Upload date</div>
                    <div
                      className={`text-sm ${
                        isDark ? "text-zinc-300" : "text-zinc-700"
                      }`}
                    >
                      {selectedResource.formattedDate}
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      isDark ? "bg-zinc-700/50" : "bg-zinc-50"
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">Status</div>
                    <div
                      className={`text-sm capitalize ${
                        isDark ? "text-zinc-300" : "text-zinc-700"
                      }`}
                    >
                      {selectedResource.status.toLowerCase()}
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      isDark ? "bg-zinc-700/50" : "bg-zinc-50"
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">Type</div>
                    <div
                      className={`text-sm capitalize ${
                        isDark ? "text-zinc-300" : "text-zinc-700"
                      }`}
                    >
                      {selectedResource.type}
                    </div>
                  </div>
                </div>

                {selectedResource.tags && selectedResource.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedResource.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded-full ${
                            isDark
                              ? "bg-zinc-700 text-zinc-300"
                              : "bg-zinc-100 text-zinc-700"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 justify-end">
                  {selectedResource.resourceType === "link" ||
                  selectedResource.url.startsWith("http") ? (
                    <a
                      href={selectedResource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                        isDark
                          ? "bg-violet-600 hover:bg-violet-700 text-white"
                          : "bg-violet-600 hover:bg-violet-700 text-white"
                      }`}
                    >
                      <IconExternalLink size={16} />
                      Open Link
                    </a>
                  ) : (
                    <a
                      href={selectedResource.url}
                      download
                      className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                        isDark
                          ? "bg-violet-600 hover:bg-violet-700 text-white"
                          : "bg-violet-600 hover:bg-violet-700 text-white"
                      }`}
                    >
                      <IconDownload size={16} />
                      Download
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
}
