"use client";

import { useState } from 'react';
import LayoutWrapper from "../_sections/Wrapper";
import AchievementSection, { AchievementItem } from "../_sections/Achievement";
import { useTheme } from "../_contexts/ThemeContext";
import { IconMessageCircle, IconHeart, IconShare3, IconEdit, IconFilter, IconHash } from "@tabler/icons-react";
// import Image from 'next/image';
import Modal from "../_components/reusable/modal";

// Sample achievements data
const achievements: AchievementItem[] = [
  { name: "Nguyen Hoang Khang", description: "Accepted AI paper", level: "gold" },
  { name: "Nguyen Vu Nhu Huynh", description: "Accepted AI paper", level: "gold" },
  { name: "Tran Cong Luan", description: "Second place in FPTU Code Arena", level: "silver" },
  { name: "Lam Tan Phat", description: "Second place in FPTU Code Arena", level: "silver" },
  { name: "Doan Vo Quoc Thai", description: "Second place in FPTU Code Arena", level: "silver" },
];

// Sample forum posts data
const initialPosts = [
  {
    id: 1,
    author: "Kim Bao Nguyen",
    authorUsername: "@kbnguyen",
    avatar: "/avatars/avatar1.jpg", // These would be replaced with actual paths
    content: "Just released a new tutorial on how to build a real-time chat application with WebSockets and React. Check it out on our resources page!",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 5,
    reposts: 3,
    category: "Tutorials",
    liked: false,
    bookmarked: false
  },
  {
    id: 2,
    author: "Le Nhut Anh",
    authorUsername: "@lnanh",
    avatar: "/avatars/avatar2.jpg",
    content: "Excited to announce our upcoming hackathon! The theme will be 'AI for Education'. Mark your calendars for next month. Registration opens next week. 🚀 #FCodingHackathon",
    timestamp: "5 hours ago",
    likes: 42,
    comments: 12,
    reposts: 15,
    category: "Events",
    liked: true,
    bookmarked: true
  },
  {
    id: 3,
    author: "Truong Doan Minh Phuc",
    authorUsername: "@tdmphuc",
    avatar: "/avatars/avatar3.jpg",
    content: "Debugging question: Anyone familiar with this error in React? 'Objects are not valid as a React child'. I'm trying to render a component but keep getting this error.",
    timestamp: "Yesterday",
    likes: 8,
    comments: 19,
    reposts: 1,
    category: "Help",
    liked: false,
    bookmarked: false
  },
  {
    id: 4,
    author: "Chau Tan Cuong",
    authorUsername: "@ctcuong",
    avatar: "/avatars/avatar4.jpg",
    content: "I've been learning TypeScript for the past month and I'm amazed at how it's improved my development workflow. Strong typing really does catch so many bugs early! Anyone else had a similar experience?",
    timestamp: "2 days ago",
    likes: 36,
    comments: 14,
    reposts: 7,
    category: "Discussion",
    liked: false,
    bookmarked: true
  },
  {
    id: 5,
    author: "Nguyen Quang Huy",
    authorUsername: "@nqhuy",
    avatar: "/avatars/avatar5.jpg",
    content: "Just published my first npm package! It's a utility library for handling complex form validations in React. Would appreciate any feedback: npm.js/form-validator-pro",
    timestamp: "3 days ago",
    likes: 52,
    comments: 8,
    reposts: 21,
    category: "Projects",
    liked: true,
    bookmarked: false
  }
];

// Forum categories
const categories = [
  { id: 'all', name: 'All Posts', color: 'gray' },
  { id: 'tutorials', name: 'Tutorials', color: 'blue' },
  { id: 'events', name: 'Events', color: 'green' },
  { id: 'help', name: 'Help & Questions', color: 'red' },
  { id: 'discussion', name: 'Discussion', color: 'purple' },
  { id: 'projects', name: 'Projects', color: 'orange' },
  { id: 'jobs', name: 'Job Postings', color: 'teal' },
  { id: 'resources', name: 'Resources', color: 'pink' },
];

export default function Forum() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [posts, setPosts] = useState(initialPosts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('discussion');

  // Function to toggle like on a post
  const toggleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const liked = !post.liked;
        return {
          ...post,
          liked,
          likes: liked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  // Function to submit a new post
  const handleNewPost = () => {
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      author: "Current User", // Would be replaced with actual user data
      authorUsername: "@currentuser",
      avatar: "/avatars/default.jpg",
      content: newPostContent,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      reposts: 0,
      category: newPostCategory.charAt(0).toUpperCase() + newPostCategory.slice(1),
      liked: false,
      bookmarked: false
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setShowNewPostModal(false);
  };

  // Filter posts by category
  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.category.toLowerCase() === selectedCategory);

  // Get category color based on name
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
    return category?.color || 'gray';
  };

  // Generate CSS class for category badge
  const getCategoryBadgeClass = (categoryName: string) => {
    const colorMap: { [key: string]: string } = {
      'gray': isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-800',
      'blue': isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800',
      'green': isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800',
      'red': isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800',
      'purple': isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800',
      'orange': isDark ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-800',
      'teal': isDark ? 'bg-teal-900/50 text-teal-300' : 'bg-teal-100 text-teal-800',
      'pink': isDark ? 'bg-pink-900/50 text-pink-300' : 'bg-pink-100 text-pink-800',
    };

    const color = getCategoryColor(categoryName);
    return colorMap[color] || colorMap.gray;
  };

  return (
    <LayoutWrapper maxWidth="w-full">
      {/* Page Title */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Community Forum</h1>
        <p className={`mt-2 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
          Connect, share, and engage with fellow members
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Achievements Section - Left sidebar */}
        <div className="w-full lg:w-1/5 order-2 lg:order-1">
          <AchievementSection achievements={achievements} useGrid={true} />
        </div>

        {/* Forum Feed - Main content */}
        <div className="w-full lg:w-3/5 order-1 lg:order-2">
          {/* New Post Button */}
          <div className="mb-4">
            <button
              onClick={() => setShowNewPostModal(true)}
              className={`w-full py-3 px-4 flex items-center gap-3 rounded-lg text-left ${isDark ? 'bg-zinc-800/50 hover:bg-zinc-800/80' : 'bg-white hover:bg-zinc-50 border border-zinc-200'
                }`}
            >
              <div className="w-9 h-9 rounded-full bg-zinc-300 flex items-center justify-center">
                <IconUser size={20} className="text-zinc-600" />
              </div>
              <span className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>
                Start a new thread...
              </span>
              <div className="ml-auto">
                <IconEdit size={18} className={isDark ? 'text-zinc-500' : 'text-zinc-400'} />
              </div>
            </button>
          </div>

          {/* Mobile Category Filter */}
          <div className="mb-4 lg:hidden">
            <div className={`p-3 rounded-lg ${isDark ? 'bg-zinc-800/50' : 'bg-white border border-zinc-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <IconFilter size={18} className={isDark ? 'text-violet-400' : 'text-violet-600'} />
                <h3 className="font-medium">Filter by Category</h3>
              </div>
              <div className="flex overflow-x-auto pb-2 gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${selectedCategory === category.id
                      ? isDark ? 'bg-violet-600 text-white' : 'bg-violet-600 text-white'
                      : isDark ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-100 text-zinc-700'
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <article
                  key={post.id}
                  className={`p-4 rounded-xl ${isDark ? 'bg-zinc-800/30' : 'bg-white border border-zinc-100 shadow-sm'
                    }`}
                >
                  {/* Post Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-300 overflow-hidden flex-shrink-0">
                      {/* We'd use actual images here */}
                      <div className="w-full h-full flex items-center justify-center">
                        <IconUser size={20} className="text-zinc-600" />
                      </div>
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{post.author}</h3>
                          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                            {post.authorUsername} · {post.timestamp}
                          </p>
                        </div>

                        <div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryBadgeClass(post.category)}`}>
                            {post.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className={`text-sm md:text-base ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                      {post.content}
                    </p>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-2 text-sm ${post.liked
                        ? 'text-red-500'
                        : isDark ? 'text-zinc-400 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-700'
                        }`}
                    >
                      <IconHeart
                        size={18}
                        fill={post.liked ? "currentColor" : "none"}
                        stroke={1.5}
                      />
                      <span>{post.likes}</span>
                    </button>

                    <button className={`flex items-center gap-2 text-sm ${isDark ? 'text-zinc-400 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-700'
                      }`}>
                      <IconMessageCircle size={18} stroke={1.5} />
                      <span>{post.comments}</span>
                    </button>

                    <button className={`flex items-center gap-2 text-sm ${isDark ? 'text-zinc-400 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-700'
                      }`}>
                      <IconShare3 size={18} stroke={1.5} />
                      <span>{post.reposts}</span>
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className={`p-8 text-center rounded-xl ${isDark ? 'bg-zinc-800/30' : 'bg-white border border-zinc-100'
                }`}>
                <p className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>
                  No posts found in this category. Be the first to post!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Categories Section - Right sidebar */}
        <div className="w-full lg:w-1/5 order-3">
          <div className={`p-4 rounded-xl sticky top-20 ${isDark ? 'bg-zinc-800/30' : 'bg-white shadow-sm border border-zinc-100'
            }`}>
            <div className="flex items-center gap-2 mb-4">
              <IconHash size={18} className={isDark ? 'text-violet-400' : 'text-violet-600'} />
              <h2 className="font-bold">Categories</h2>
            </div>

            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${selectedCategory === category.id
                    ? isDark ? 'bg-violet-600/30 text-violet-200' : 'bg-violet-50 text-violet-800'
                    : isDark ? 'hover:bg-zinc-700' : 'hover:bg-zinc-50'
                    }`}
                >
                  <span>{category.name}</span>
                  {selectedCategory === category.id && (
                    <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-violet-400' : 'bg-violet-600'
                      }`}></div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-700">
              <h3 className={`text-sm font-medium mb-2 ${isDark ? 'text-zinc-300' : 'text-zinc-600'
                }`}>
                Community Guidelines
              </h3>
              <ul className={`text-xs space-y-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'
                }`}>
                <li>• Be respectful to all members</li>
                <li>• Don&apos;t spam or self-promote excessively</li>
                <li>• Use appropriate categories for your posts</li>
                <li>• Report inappropriate content</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      <Modal
        opened={showNewPostModal}
        onClose={() => setShowNewPostModal(false)}
        className={`w-full max-w-lg ${isDark ? 'bg-zinc-800 text-white' : 'bg-white'}`}
      >
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Create a new post</h2>
            <button
              onClick={() => setShowNewPostModal(false)}
              className={`p-1 rounded-full ${isDark ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100'}`}
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's on your mind?"
              className={`w-full p-3 rounded-lg resize-none h-32 ${isDark
                ? 'bg-zinc-700 text-white placeholder:text-zinc-400 border border-zinc-600'
                : 'bg-white text-zinc-800 placeholder:text-zinc-400 border border-zinc-300'
                }`}
            />
          </div>

          <div className="mb-6">
            <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'
              }`}>
              Category
            </label>
            <select
              value={newPostCategory}
              onChange={(e) => setNewPostCategory(e.target.value)}
              className={`w-full p-2 rounded-lg ${isDark
                ? 'bg-zinc-700 text-white border border-zinc-600'
                : 'bg-white text-zinc-800 border border-zinc-300'
                }`}
            >
              {categories.filter(c => c.id !== 'all').map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowNewPostModal(false)}
              className={`px-4 py-2 rounded-md ${isDark ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-zinc-100 hover:bg-zinc-200'
                }`}
            >
              Cancel
            </button>
            <button
              onClick={handleNewPost}
              disabled={!newPostContent.trim()}
              className={`px-4 py-2 rounded-md ${newPostContent.trim()
                ? isDark ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-violet-600 hover:bg-violet-700 text-white'
                : isDark ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                }`}
            >
              Post
            </button>
          </div>
        </div>
      </Modal>
    </LayoutWrapper>
  );
}

// Missing IconUser component - would need to be imported or defined
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function IconUser(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  );
}
