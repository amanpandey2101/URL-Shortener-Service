"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaTrash, FaChartBar, FaCopy, FaCheck, FaExternalLinkAlt, FaMagic, FaSearch, FaLink } from "react-icons/fa";

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
  const [error, setError] = useState("");
  
  // Form state
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search state
  const [search, setSearch] = useState("");

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/links");
      if (!res.ok) throw new Error("Failed to fetch links");
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      setError("Error loading links");
      console.error(err);
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
    setFormError("");
    setSuccessMsg("");

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

      setSuccessMsg(`Link created! Short code: ${data.shortCode}`);
      setUrl("");
      setCustomCode("");
      fetchLinks(); // Refresh list
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Error creating link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      const res = await fetch(`/api/links/${code}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      fetchLinks();
    } catch (err) {
      console.error(err);
      alert("Error deleting link");
    }
  };

  const filteredLinks = links.filter(link => 
    link.shortCode.toLowerCase().includes(search.toLowerCase()) || 
    link.originalUrl.toLowerCase().includes(search.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!"); // Simple feedback
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            TinyLink
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Simplify your links, track your reach. The modern URL shortener for everyone.
          </p>
        </div>

        {/* Create Link Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
              <FaMagic className="text-blue-500" /> Create New Link
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original URL</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLink className="text-gray-400" />
                    </div>
                    <input
                      type="url"
                      placeholder="https://example.com/very-long-url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      className="block w-full pl-10 pr-4 py-3 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-4">
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Custom Alias (Optional)</label>
                   <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-sm">/</span>
                      </div>
                      <input
                        type="text"
                        placeholder="my-link"
                        value={customCode}
                        onChange={(e) => setCustomCode(e.target.value)}
                        className="block w-full pl-8 pr-4 py-3 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                      />
                   </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                 <div className="flex-1">
                    {formError && (
                      <div className="flex items-center text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        <span className="mr-2">●</span> {formError}
                      </div>
                    )}
                    {successMsg && (
                      <div className="flex items-center text-green-500 text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded">
                        <span className="mr-2">●</span> {successMsg}
                      </div>
                    )}
                 </div>
                 <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-4 inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all hover:scale-105"
                  >
                    {isSubmitting ? "Creating..." : "Shorten URL"}
                  </button>
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Links</h2>
              <div className="relative w-full sm:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search links..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Short Link</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Original URL</th>
                      <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Clicks</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                       <tr>
                          <td colSpan={5} className="px-6 py-12 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                          </td>
                       </tr>
                    ) : filteredLinks.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                            No links found. Create one above!
                          </td>
                        </tr>
                    ) : (
                      filteredLinks.map((link) => (
                        <tr key={link.shortCode} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                                /{link.shortCode.substring(0, 2)}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                  <a href={`/${link.shortCode}`} target="_blank" rel="noopener noreferrer">
                                    {link.shortCode}
                                  </a>
                                </div>
                                <div className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 flex items-center gap-1" onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/${link.shortCode}`)}>
                                   <FaCopy className="h-3 w-3" /> Copy Link
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-gray-200 max-w-xs truncate" title={link.originalUrl}>
                              {link.originalUrl}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              {link.clicks}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(link.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end items-center space-x-3">
                              <Link href={`/code/${link.shortCode}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30" title="Analytics">
                                <FaChartBar className="h-4 w-4" />
                              </Link>
                              <button 
                                onClick={() => handleDelete(link.shortCode)} 
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                                title="Delete"
                              >
                                <FaTrash className="h-4 w-4" />
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
