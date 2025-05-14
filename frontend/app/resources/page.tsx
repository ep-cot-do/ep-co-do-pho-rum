"use client";

import { useState, useMemo, useEffect } from 'react';
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
  IconX
} from "@tabler/icons-react";

// Define subject and resource types
type Subject = {
  code: string;
  name: string;
  semester: number;
};

type ResourceType =
  'document' |
  'presentation' |
  'code' |
  'archive' |
  'spreadsheet' |
  'image' |
  'link' |
  'pdf' |
  'folder';

interface Resource {
  id: number;
  title: string;
  description: string;
  type: ResourceType;
  subjectCode: string;
  uploadedBy: string;
  uploadDate: string;
  fileSize?: string;
  url: string;
  downloads: number;
  views: number;
  tags?: string[];
}

// List of subjects from the data you provided
const subjects: Subject[] = [
  { code: 'MAE101', name: 'Mathematics for Engineering', semester: 1 },
  { code: 'PRF192', name: 'Programming Fundamentals', semester: 1 },
  { code: 'CEA201', name: 'Computer Organization and Architecture', semester: 1 },
  { code: 'SSL101c', name: 'Academic skills for University success', semester: 1 },
  { code: 'CSI104', name: 'Introduction to Computer Science', semester: 1 },
  { code: 'SSG104', name: 'Communication and In-Group Working Skills', semester: 2 },
  { code: 'NWC203c', name: 'Computer Networking', semester: 2 },
  { code: 'MAD101', name: 'Discrete mathematics', semester: 2 },
  { code: 'PRO192', name: 'Object-Oriented Programming', semester: 2 },
  { code: 'OSG202', name: 'Operating System', semester: 2 },
  { code: 'CSD201', name: 'Data Structures and Algorithm', semester: 3 },
  { code: 'LAB211', name: 'OOP with Java Lab', semester: 3 },
  { code: 'DBI202', name: 'Database Systems', semester: 3 },
  { code: 'WED201c', name: 'Web design', semester: 3 },
  { code: 'JPD113', name: 'Elementary Japanese 1- A1.1', semester: 3 },
  { code: 'IOT102', name: 'Internet of Things', semester: 4 },
  { code: 'PRJ301', name: 'Java Web Application Development', semester: 4 },
  { code: 'SWE201c', name: 'Introduction to Software Engineering', semester: 4 },
  { code: 'JPD123', name: 'Elementary Japanese 1-A1.2', semester: 4 },
  { code: 'MAS291', name: 'Statistics & Probability', semester: 4 },
  { code: 'FER202', name: 'Front-End web development with React', semester: 5 },
  { code: 'ITE302c', name: 'Ethics in IT', semester: 5 },
  { code: 'SWP391', name: 'Software development project', semester: 5 },
  { code: 'SWR302', name: 'Software Requirement', semester: 5 },
  { code: 'SWT301', name: 'Software Testing', semester: 5 },
  { code: 'OJT202', name: 'On-The-Job Training', semester: 6 },
  { code: 'ENW493c', name: 'Research method and academic writing skills', semester: 6 },
  { code: 'SDN302', name: 'Server-Side development with NodeJS, Express, and MongoDB', semester: 7 },
  { code: 'MMA301', name: 'Multiplatform Mobile App Development', semester: 7 },
  { code: 'EXE101', name: 'Experiential Entrepreneurship 1', semester: 7 },
  { code: 'PMG201c', name: 'Project management', semester: 7 },
  { code: 'SWD392', name: 'Software Architecture and Design', semester: 7 },
  { code: 'MLN111', name: 'Philosophy of Marxism - Leninism', semester: 8 },
  { code: 'MLN122', name: 'Political economics of Marxism - Leninism', semester: 8 },
  { code: 'EXE201', name: 'Experiential Entrepreneurship 2', semester: 8 },
  { code: 'WDU203c', name: 'UI/UX Design', semester: 8 },
  { code: 'PRM392', name: 'Mobile Programming', semester: 8 },
  { code: 'WDP301', name: 'Web Development Project', semester: 8 },
  { code: 'SE_GRA_ELE', name: 'Graduation Elective - Software Engineering', semester: 9 },
  { code: 'VNR202', name: 'History of CPV', semester: 9 },
  { code: 'MLN131', name: 'Scientific socialism', semester: 9 },
  { code: 'HCM202', name: 'HCM Ideology', semester: 9 },
];

// Sample resource data
const resources: Resource[] = [
  {
    id: 1,
    title: 'PRF192 - Final Exam Review Materials',
    description: 'Comprehensive review materials for Programming Fundamentals final exam',
    type: 'pdf',
    subjectCode: 'PRF192',
    uploadedBy: 'Nguyen Kim Bao',
    uploadDate: '2023-05-15',
    fileSize: '2.4 MB',
    url: '/resources/prf192-final-review.pdf',
    downloads: 128,
    views: 243,
    tags: ['Exam', 'Review', 'Programming']
  },
  {
    id: 2,
    title: 'Java OOP Examples',
    description: 'Example code for Object-Oriented Programming concepts in Java',
    type: 'code',
    subjectCode: 'PRO192',
    uploadedBy: 'Le Nhut Anh',
    uploadDate: '2023-04-20',
    fileSize: '1.1 MB',
    url: '/resources/java-oop-examples.zip',
    downloads: 87,
    views: 156,
    tags: ['Java', 'OOP', 'Examples']
  },
  {
    id: 3,
    title: 'Database Design Handbook',
    description: 'Comprehensive guide to database design principles and practices',
    type: 'document',
    subjectCode: 'DBI202',
    uploadedBy: 'Truong Doan Minh Phuc',
    uploadDate: '2023-03-10',
    fileSize: '5.7 MB',
    url: '/resources/database-design-handbook.docx',
    downloads: 63,
    views: 115,
    tags: ['Database', 'Design', 'SQL']
  },
  {
    id: 4,
    title: 'React Hooks Tutorial',
    description: 'Step-by-step tutorial on React hooks with practical examples',
    type: 'presentation',
    subjectCode: 'FER202',
    uploadedBy: 'Chau Tan Cuong',
    uploadDate: '2023-06-05',
    fileSize: '3.2 MB',
    url: '/resources/react-hooks-tutorial.pptx',
    downloads: 112,
    views: 189,
    tags: ['React', 'Hooks', 'Frontend']
  },
  {
    id: 5,
    title: 'Operating Systems Study Guide',
    description: 'Comprehensive study guide for Operating Systems course',
    type: 'pdf',
    subjectCode: 'OSG202',
    uploadedBy: 'Nguyen Quang Huy',
    uploadDate: '2023-02-18',
    fileSize: '4.5 MB',
    url: '/resources/os-study-guide.pdf',
    downloads: 94,
    views: 176,
    tags: ['OS', 'Study Guide']
  },
  {
    id: 6,
    title: 'Data Structures Visualizations',
    description: 'Interactive visualizations for common data structures',
    type: 'link',
    subjectCode: 'CSD201',
    uploadedBy: 'Doan Vo Quoc Thai',
    uploadDate: '2023-01-30',
    url: 'https://visualgo.net/en',
    downloads: 0,
    views: 215,
    tags: ['Data Structures', 'Visualization', 'Learning Resource']
  },
  {
    id: 7,
    title: 'Discrete Mathematics Formula Sheet',
    description: 'Comprehensive formula sheet for Discrete Mathematics',
    type: 'pdf',
    subjectCode: 'MAD101',
    uploadedBy: 'Lam Tan Phat',
    uploadDate: '2023-03-25',
    fileSize: '1.8 MB',
    url: '/resources/discrete-math-formulas.pdf',
    downloads: 134,
    views: 267,
    tags: ['Mathematics', 'Formulas', 'Reference']
  },
  {
    id: 8,
    title: 'UI Design Principles',
    description: 'Guide to fundamental UI design principles with examples',
    type: 'presentation',
    subjectCode: 'WDU203c',
    uploadedBy: 'Nguyen Vu Nhu Huynh',
    uploadDate: '2023-07-12',
    fileSize: '6.3 MB',
    url: '/resources/ui-design-principles.pptx',
    downloads: 58,
    views: 103,
    tags: ['UI', 'Design', 'UX']
  },
  {
    id: 9,
    title: 'Software Testing Templates',
    description: 'Collection of templates for software testing documentation',
    type: 'archive',
    subjectCode: 'SWT301',
    uploadedBy: 'Tran Cong Luan',
    uploadDate: '2023-05-28',
    fileSize: '8.5 MB',
    url: '/resources/testing-templates.zip',
    downloads: 76,
    views: 124,
    tags: ['Testing', 'Templates', 'Documentation']
  },
  {
    id: 10,
    title: 'Node.js Project Structure',
    description: 'Example project structure for Node.js applications',
    type: 'folder',
    subjectCode: 'SDN302',
    uploadedBy: 'Pham Minh Tuan',
    uploadDate: '2023-06-15',
    fileSize: '12.7 MB',
    url: '/resources/nodejs-project-structure.zip',
    downloads: 91,
    views: 148,
    tags: ['Node.js', 'Project Structure', 'Backend']
  },
  {
    id: 11,
    title: 'Introduction to Computer Science Slides',
    description: 'Lecture slides for Introduction to Computer Science',
    type: 'presentation',
    subjectCode: 'CSI104',
    uploadedBy: 'Kim Bao Nguyen',
    uploadDate: '2023-01-15',
    fileSize: '5.6 MB',
    url: '/resources/intro-cs-slides.pptx',
    downloads: 145,
    views: 283,
    tags: ['CS', 'Introduction', 'Lecture']
  },
  {
    id: 12,
    title: 'Statistics Dataset Examples',
    description: 'Example datasets for statistics exercises',
    type: 'spreadsheet',
    subjectCode: 'MAS291',
    uploadedBy: 'Le Nhut Anh',
    uploadDate: '2023-04-05',
    fileSize: '3.2 MB',
    url: '/resources/statistics-datasets.xlsx',
    downloads: 67,
    views: 112,
    tags: ['Statistics', 'Dataset', 'Examples']
  },
  {
    id: 13,
    title: 'Software Requirements Specification Template',
    description: 'Template for creating software requirements specifications',
    type: 'document',
    subjectCode: 'SWR302',
    uploadedBy: 'Truong Doan Minh Phuc',
    uploadDate: '2023-02-28',
    fileSize: '1.7 MB',
    url: '/resources/srs-template.docx',
    downloads: 104,
    views: 187,
    tags: ['Requirements', 'Template', 'Documentation']
  },
  {
    id: 14,
    title: 'Mobile UI Wireframes',
    description: 'Example wireframes for mobile application UI design',
    type: 'image',
    subjectCode: 'PRM392',
    uploadedBy: 'Chau Tan Cuong',
    uploadDate: '2023-07-08',
    fileSize: '4.8 MB',
    url: '/resources/mobile-ui-wireframes.zip',
    downloads: 52,
    views: 94,
    tags: ['UI', 'Mobile', 'Wireframes']
  },
  {
    id: 15,
    title: 'Computer Networking Cheat Sheet',
    description: 'Quick reference guide for computer networking concepts',
    type: 'pdf',
    subjectCode: 'NWC203c',
    uploadedBy: 'Nguyen Quang Huy',
    uploadDate: '2023-03-18',
    fileSize: '2.2 MB',
    url: '/resources/networking-cheatsheet.pdf',
    downloads: 118,
    views: 225,
    tags: ['Networking', 'Reference', 'Cheat Sheet']
  },
];

// Define view types
type ViewMode = 'grid' | 'list';

export default function ResourcesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  // Filter resources based on selected filters and search term
  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      // Filter by subject
      const matchesSubject = selectedSubject === 'all' || resource.subjectCode === selectedSubject;

      // Filter by semester
      const subjectSemester = subjects.find(s => s.code === resource.subjectCode)?.semester;
      const matchesSemester = selectedSemester === null || subjectSemester === selectedSemester;

      // Filter by search term
      const matchesSearch =
        searchTerm === '' ||
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

      return matchesSubject && matchesSemester && matchesSearch;
    });
  }, [searchTerm, selectedSubject, selectedSemester]);

  // Get all unique semesters from the subjects data
  const semesters = useMemo(() => {
    const uniqueSemesters = new Set(subjects.map(subject => subject.semester));
    return Array.from(uniqueSemesters).sort((a, b) => a - b);
  }, []);

  // Function to render appropriate icon for resource type
  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'pdf':
        return <IconPdf size={24} className={isDark ? "text-red-400" : "text-red-500"} />;
      case 'document':
        return <IconFileTypeDoc size={24} className={isDark ? "text-blue-400" : "text-blue-500"} />;
      case 'presentation':
        return <IconFileTypePpt size={24} className={isDark ? "text-orange-400" : "text-orange-500"} />;
      case 'code':
        return <IconFileCode size={24} className={isDark ? "text-green-400" : "text-green-500"} />;
      case 'archive':
        return <IconFileZip size={24} className={isDark ? "text-purple-400" : "text-purple-500"} />;
      case 'spreadsheet':
        return <IconFileTypeXls size={24} className={isDark ? "text-emerald-400" : "text-emerald-500"} />;
      case 'image':
        return <IconPhoto size={24} className={isDark ? "text-pink-400" : "text-pink-500"} />;
      case 'link':
        return <IconLink size={24} className={isDark ? "text-sky-400" : "text-sky-500"} />;
      case 'folder':
        return <IconFolder size={24} className={isDark ? "text-yellow-400" : "text-yellow-500"} />;
      default:
        return <IconFileText size={24} className={isDark ? "text-zinc-400" : "text-zinc-500"} />;
    }
  };

  // Function to handle resource click
  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource);
    setShowInfoPanel(true);
  };

  // Close the info panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const panel = document.getElementById('info-panel');
      if (panel && !panel.contains(event.target as Node) &&
        !event.composedPath().some(el => {
          const element = el as HTMLElement;
          return element.classList && element.classList.contains('resource-item');
        })) {
        setShowInfoPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <LayoutWrapper maxWidth="w-full">
      {/* Page Title */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center gap-3">
          <IconFileText className={isDark ? "text-violet-400" : "text-violet-600"} size={30} stroke={1.5} />
          Learning Resources
        </h1>
        <p className={`mt-2 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
          Browse and download resources organized by subject
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className={`p-4 mb-6 rounded-xl ${isDark ? 'bg-zinc-800/30' : 'bg-white border border-zinc-100 shadow-sm'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${isDark
                ? 'bg-zinc-800 border-zinc-700 text-zinc-200 placeholder:text-zinc-500'
                : 'bg-white border-zinc-200 text-zinc-800 placeholder:text-zinc-400'
                } border`}
            />
            <IconSearch
              size={18}
              className={`absolute left-3 top-2.5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}
            />
          </div>

          {/* Subject Filter */}
          <div className="md:w-64 relative">
            <div
              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${isDark
                ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                : 'bg-white border-zinc-200 text-zinc-800'
                } border`}
              onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
            >
              <span className={selectedSubject === 'all' ? (isDark ? 'text-zinc-400' : 'text-zinc-500') : ''}>
                {selectedSubject === 'all'
                  ? 'All Subjects'
                  : subjects.find(s => s.code === selectedSubject)?.code || 'Select Subject'}
              </span>
              <IconChevronDown size={18} className={isDark ? 'text-zinc-400' : 'text-zinc-500'} />
            </div>

            {isSubjectDropdownOpen && (
              <div
                className={`absolute z-10 mt-1 w-full max-h-64 overflow-y-auto rounded-lg border ${isDark
                  ? 'bg-zinc-800 border-zinc-700'
                  : 'bg-white border-zinc-200 shadow-lg'
                  }`}
              >
                <div
                  className={`px-4 py-2 cursor-pointer ${selectedSubject === 'all'
                    ? isDark ? 'bg-zinc-700' : 'bg-zinc-100'
                    : isDark ? 'hover:bg-zinc-700' : 'hover:bg-zinc-50'
                    }`}
                  onClick={() => {
                    setSelectedSubject('all');
                    setIsSubjectDropdownOpen(false);
                  }}
                >
                  All Subjects
                </div>
                {subjects.map((subject) => (
                  <div
                    key={subject.code}
                    className={`px-4 py-2 cursor-pointer ${selectedSubject === subject.code
                      ? isDark ? 'bg-zinc-700' : 'bg-zinc-100'
                      : isDark ? 'hover:bg-zinc-700' : 'hover:bg-zinc-50'
                      }`}
                    onClick={() => {
                      setSelectedSubject(subject.code);
                      setIsSubjectDropdownOpen(false);
                    }}
                  >
                    <div className="font-medium">{subject.code}</div>
                    <div className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{subject.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Semester Filter */}
          <div className="md:w-48 relative">
            <div
              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${isDark
                ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                : 'bg-white border-zinc-200 text-zinc-800'
                } border`}
              onClick={() => setIsSemesterDropdownOpen(!isSemesterDropdownOpen)}
            >
              <span className={selectedSemester === null ? (isDark ? 'text-zinc-400' : 'text-zinc-500') : ''}>
                {selectedSemester === null ? 'All Semesters' : `Semester ${selectedSemester}`}
              </span>
              <IconChevronDown size={18} className={isDark ? 'text-zinc-400' : 'text-zinc-500'} />
            </div>

            {isSemesterDropdownOpen && (
              <div
                className={`absolute z-10 mt-1 w-full max-h-64 overflow-y-auto rounded-lg border ${isDark
                  ? 'bg-zinc-800 border-zinc-700'
                  : 'bg-white border-zinc-200 shadow-lg'
                  }`}
              >
                <div
                  className={`px-4 py-2 cursor-pointer ${selectedSemester === null
                    ? isDark ? 'bg-zinc-700' : 'bg-zinc-100'
                    : isDark ? 'hover:bg-zinc-700' : 'hover:bg-zinc-50'
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
                    className={`px-4 py-2 cursor-pointer ${selectedSemester === semester
                      ? isDark ? 'bg-zinc-700' : 'bg-zinc-100'
                      : isDark ? 'hover:bg-zinc-700' : 'hover:bg-zinc-50'
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
        </div>

        {/* View Mode Toggle & Results Count */}
        <div className="flex justify-between items-center mt-4">
          <div className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>
            {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'} found
          </div>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list'
                ? isDark ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-200 text-zinc-800'
                : isDark ? 'text-zinc-400' : 'text-zinc-600'
                }`}
              aria-label="List view"
              title="List view"
            >
              <IconList size={18} className={isDark ? 'text-zinc-400' : 'text-zinc-600'} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid'
                ? isDark ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-200 text-zinc-800'
                : isDark ? 'text-zinc-400' : 'text-zinc-600'
                }`}
              aria-label="Grid view"
              title="Grid view"
            >
              <IconLayoutGrid size={18} className={isDark ? 'text-zinc-400' : 'text-zinc-600'} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area with Resources */}
      <div className="relative flex flex-col lg:flex-row gap-4">
        {/* Resources List */}
        <div className={`flex-grow ${showInfoPanel ? 'lg:w-2/3' : 'w-full'}`}>
          {filteredResources.length > 0 ? (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'flex flex-col gap-2'
            }>
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className={`resource-item cursor-pointer transition-colors ${viewMode === 'grid'
                    ? `rounded-xl overflow-hidden ${isDark
                      ? 'bg-zinc-800/40 hover:bg-zinc-800/60'
                      : 'bg-white hover:bg-zinc-50 border border-zinc-100 shadow-sm'
                    }`
                    : `rounded-lg ${isDark
                      ? 'hover:bg-zinc-800/40'
                      : 'hover:bg-zinc-50'
                    } p-3`
                    } ${selectedResource?.id === resource.id
                      ? isDark ? 'bg-zinc-800/60 ring-1 ring-violet-500' : 'bg-zinc-50 ring-1 ring-violet-500'
                      : ''
                    }`}
                  onClick={() => handleResourceClick(resource)}
                >
                  {viewMode === 'grid' ? (
                    /* Grid View */
                    <>
                      <div className={`p-5 flex items-center justify-center ${isDark ? 'bg-zinc-700/50' : 'bg-zinc-50'}`}>
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-base mb-1 truncate" title={resource.title}>{resource.title}</h3>
                        <p className={`text-xs mb-3 line-clamp-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          {resource.description}
                        </p>
                        <div className="flex justify-between items-center text-xs">
                          <span className={`px-2 py-1 rounded-full ${isDark ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-200 text-zinc-700'}`}>
                            {resource.subjectCode}
                          </span>
                          <span className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>
                            {resource.fileSize || '–'}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* List View */
                    <div className="flex gap-3 items-center">
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-medium truncate" title={resource.title}>{resource.title}</h3>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-200 text-zinc-700'}`}>
                            {resource.subjectCode}
                          </span>
                          <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            {resource.uploadDate}
                          </span>
                          {resource.fileSize && (
                            <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                              {resource.fileSize}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 text-xs items-center">
                        <span className="flex items-center gap-1" title="Downloads">
                          <IconDownload size={14} className={isDark ? 'text-zinc-500' : 'text-zinc-400'} />
                          {resource.downloads}
                        </span>
                        <span className="flex items-center gap-1 ml-2" title="Views">
                          <IconEye size={14} className={isDark ? 'text-zinc-500' : 'text-zinc-400'} />
                          {resource.views}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={`p-8 text-center rounded-xl ${isDark ? 'bg-zinc-800/30' : 'bg-white border border-zinc-100'
              }`}>
              <p className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>
                No resources found matching your filters. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>

        {/* Info Panel (only shows when a resource is selected) */}
        {showInfoPanel && selectedResource && (
          <div
            id="info-panel"
            className={`lg:w-1/3 sticky top-24 h-min rounded-xl overflow-hidden ${isDark ? 'bg-zinc-800/40' : 'bg-white border border-zinc-100 shadow-sm'
              }`}
          >
            <div className={`p-4 ${isDark ? 'bg-zinc-800/60' : 'bg-zinc-50'} flex items-center justify-between`}>
              <h3 className="font-medium flex items-center gap-2">
                <IconInfoCircle size={18} className={isDark ? "text-violet-400" : "text-violet-600"} />
                Resource Details
              </h3>
              <button
                onClick={() => setShowInfoPanel(false)}
                className={`p-1 rounded-full ${isDark ? 'hover:bg-zinc-700' : 'hover:bg-zinc-200'}`}
              >
                <IconX size={18} className={isDark ? 'text-zinc-400' : 'text-zinc-600'} />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-zinc-700' : 'bg-zinc-100'}`}>
                  {getResourceIcon(selectedResource.type)}
                </div>
                <h2 className="text-lg font-medium">{selectedResource.title}</h2>
              </div>

              <div className="mb-4">
                <p className={`mb-4 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  {selectedResource.description}
                </p>

                <div className={`p-3 rounded-lg mb-4 ${isDark ? 'bg-zinc-700/50' : 'bg-zinc-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Subject</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${isDark ? 'bg-zinc-600 text-zinc-300' : 'bg-zinc-200 text-zinc-700'}`}>
                      {selectedResource.subjectCode}
                    </span>
                  </div>
                  <div className="text-sm">
                    {subjects.find(s => s.code === selectedResource.subjectCode)?.name || 'Unknown Subject'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-zinc-700/50' : 'bg-zinc-50'}`}>
                    <div className="text-sm font-medium mb-1">Uploaded by</div>
                    <div className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      {selectedResource.uploadedBy}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-zinc-700/50' : 'bg-zinc-50'}`}>
                    <div className="text-sm font-medium mb-1">Upload date</div>
                    <div className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      {selectedResource.uploadDate}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-zinc-700/50' : 'bg-zinc-50'}`}>
                    <div className="text-sm font-medium mb-1">File size</div>
                    <div className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      {selectedResource.fileSize || 'N/A'}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-zinc-700/50' : 'bg-zinc-50'}`}>
                    <div className="text-sm font-medium mb-1">Type</div>
                    <div className={`text-sm capitalize ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      {selectedResource.type}
                    </div>
                  </div>
                </div>

                {selectedResource.tags && (
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedResource.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-100 text-zinc-700'
                            }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 justify-end">
                  {selectedResource.type === 'link' ? (
                    <a
                      href={selectedResource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2 rounded-md ${isDark
                        ? 'bg-violet-600 hover:bg-violet-700 text-white'
                        : 'bg-violet-600 hover:bg-violet-700 text-white'
                        }`}
                    >
                      <IconExternalLink size={16} />
                      Open Link
                    </a>
                  ) : (
                    <a
                      href={selectedResource.url}
                      download
                      className={`flex items-center gap-2 px-4 py-2 rounded-md ${isDark
                        ? 'bg-violet-600 hover:bg-violet-700 text-white'
                        : 'bg-violet-600 hover:bg-violet-700 text-white'
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
