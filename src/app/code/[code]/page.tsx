import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FaGlobe, FaLink, FaMousePointer, FaClock, FaCalendarAlt, FaArrowLeft, FaCopy, FaCheck } from "react-icons/fa";

export default async function StatsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  
  const url = await prisma.url.findUnique({
    where: { shortCode: code }
  });

  if (!url) {
    notFound();
  }

  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/${url.shortCode}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors">
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Link Statistics</h1>
                <p className="opacity-90">Detailed analytics for your shortened URL</p>
            </div>

            <div className="p-8 space-y-8">
                
                {/* URL Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Original URL */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-100 dark:border-gray-600">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                <FaGlobe />
                            </div>
                            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Original URL</h2>
                        </div>
                        <div className="text-gray-900 dark:text-white font-medium break-all hover:text-blue-600 transition-colors">
                            <a href={url.originalUrl} target="_blank" rel="noopener noreferrer">{url.originalUrl}</a>
                        </div>
                    </div>

                    {/* Short URL */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-100 dark:border-gray-600">
                         <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                <FaLink />
                            </div>
                            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Short URL</h2>
                        </div>
                        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                            <Link href={`/${url.shortCode}`} className="text-blue-600 font-medium hover:underline truncate mr-2">
                                {shortUrl}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Clicks */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                                <FaMousePointer className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">All time</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{url.clicks}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Clicks</p>
                    </div>

                    {/* Last Clicked */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                         <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400">
                                <FaClock className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                             {url.lastClickedAt ? new Date(url.lastClickedAt).toLocaleDateString() : 'Never'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                             {url.lastClickedAt ? new Date(url.lastClickedAt).toLocaleTimeString() : 'No clicks yet'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Last Clicked</p>
                    </div>

                    {/* Created At */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                         <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                                <FaCalendarAlt className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                             {new Date(url.createdAt).toLocaleDateString()}
                        </h3>
                         <p className="text-sm text-gray-500 dark:text-gray-400">
                             {new Date(url.createdAt).toLocaleTimeString()}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Created At</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
