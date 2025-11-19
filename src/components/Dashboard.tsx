"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaTrash, FaChartBar, FaCopy, FaMagic, FaSearch, FaLink, FaSpinner, FaPlus } from "react-icons/fa";
import toast from 'react-hot-toast';

interface UrlData {
  shortCode: string;
  originalUrl: string;
  clicks: number;
  lastClickedAt: string | null;
  createdAt: string;
}

export default function Dashboard() {
  const [links, setLinks] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomCode, setShowCustomCode] = useState(false);

  // Search state
  const [search, setSearch] = useState("");

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/links");
      if (!res.ok) throw new Error("Failed to fetch links");
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      console.error("Error loading links:", err);
      toast.error("Failed to load links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, shortCode: customCode || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create link");
      }

      toast.success(`Link created! Code: ${data.shortCode}`);
      setUrl("");
      setCustomCode("");
      setShowCustomCode(false);
      fetchLinks(); // Refresh list
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error creating link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    const deletePromise = fetch(`/api/links/${code}`, {
      method: "DELETE",
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to delete");
      fetchLinks();
    });

    toast.promise(deletePromise, {
      loading: 'Deleting...',
      success: 'Link deleted successfully!',
      error: 'Failed to delete link',
    });
  };

  const filteredLinks = links.filter(link => 
    link.shortCode.toLowerCase().includes(search.toLowerCase()) || 
    link.originalUrl.toLowerCase().includes(search.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 animate-gradient">
            TinyLink
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform long URLs into powerful short links ✨
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Links</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{links.length}</p>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <FaLink className="text-blue-600 dark:text-blue-400 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Clicks</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalClicks}</p>
              </div>
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <FaChartBar className="text-purple-600 dark:text-purple-400 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Avg. Clicks</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {links.length > 0 ? (totalClicks / links.length).toFixed(1) : '0'}
                </p>
              </div>
              <div className="p-4 bg-pink-100 dark:bg-pink-900/30 rounded-full">
                <FaMagic className="text-pink-600 dark:text-pink-400 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Create Link Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 relative animate-slide-up">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <FaMagic className="text-white text-xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                Create New Link
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Enter your long URL
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLink className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="url"
                      placeholder="https://example.com/very-long-url-here"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-200 placeholder:text-gray-400"
                    />
                  </div>
                </div>
                
                {showCustomCode && (
                  <div className="animate-slide-down">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Custom Short Code (Optional)
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-400 font-medium">/</span>
                      </div>
                      <input
                        type="text"
                        placeholder="my-custom-link"
                        value={customCode}
                        onChange={(e) => setCustomCode(e.target.value)}
                        pattern="[A-Za-z0-9]{6,8}"
                        title="6-8 characters, alphanumeric only"
                        className="block w-full pl-10 pr-4 py-4 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-200 placeholder:text-gray-400"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      6-8 characters, alphanumeric only
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomCode(!showCustomCode)}
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-base font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-200"
                >
                  <FaPlus className="mr-2" />
                  {showCustomCode ? 'Hide' : 'Add'} Custom Code
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaMagic className="mr-2" />
                      Shorten URL
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="space-y-6 animate-slide-up">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Your Links</h2>
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search links..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 dark:text-white transition-all duration-200"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Short Link</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Original URL</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Clicks</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <FaSpinner className="animate-spin text-blue-600 dark:text-blue-400 text-4xl" />
                          <p className="text-gray-500 dark:text-gray-400">Loading your links...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredLinks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                            <FaLink className="text-gray-400 text-3xl" />
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">No links found</p>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">Create your first short link above!</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredLinks.map((link, index) => (
                      <tr 
                        key={link.shortCode} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                              {link.shortCode.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                <a href={`/${link.shortCode}`} target="_blank" rel="noopener noreferrer">
                                  /{link.shortCode}
                                </a>
                              </div>
                              <button 
                                className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 mt-1 transition-colors" 
                                onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/${link.shortCode}`)}
                              >
                                <FaCopy className="h-3 w-3" /> Copy
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm text-gray-900 dark:text-gray-200 max-w-md truncate hover:text-clip" title={link.originalUrl}>
                            {link.originalUrl}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 shadow-sm">
                            {link.clicks}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {new Date(link.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end items-center space-x-2">
                            <Link 
                              href={`/code/${link.shortCode}`} 
                              className="p-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30" 
                              title="View Analytics"
                            >
                              <FaChartBar className="h-5 w-5" />
                            </Link>
                            <button 
                              onClick={() => handleDelete(link.shortCode)} 
                              className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
                              title="Delete Link"
                            >
                              <FaTrash className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
