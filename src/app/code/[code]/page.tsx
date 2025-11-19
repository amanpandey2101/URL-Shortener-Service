import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FaGlobe, FaLink, FaMousePointer, FaClock, FaCalendarAlt, FaArrowLeft, FaExternalLinkAlt, FaChartBar } from "react-icons/fa";
import StatsClient from "./StatsClient";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-medium group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Dashboard
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-slide-up">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
                <FaChartBar className="text-3xl" />
                Link Analytics
              </h1>
              <p className="text-blue-100 text-lg">Detailed insights for your shortened URL</p>
            </div>
          </div>

          <div className="p-8 md:p-10 space-y-10">
            
            {/* URL Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original URL */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border-2 border-blue-100 dark:border-blue-800/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-xl shadow-lg">
                    <FaGlobe className="text-white text-xl" />
                  </div>
                  <h2 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Original URL</h2>
                </div>
                <div className="text-gray-900 dark:text-white font-medium break-all mb-3">
                  {url.originalUrl}
                </div>
                <a 
                  href={url.originalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  Visit URL <FaExternalLinkAlt className="ml-2 text-xs" />
                </a>
              </div>

              {/* Short URL */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-purple-100 dark:border-purple-800/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-600 dark:bg-purple-500 rounded-xl shadow-lg">
                    <FaLink className="text-white text-xl" />
                  </div>
                  <h2 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Short URL</h2>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-purple-200 dark:border-purple-700/50 mb-3">
                  <Link href={`/${url.shortCode}`} className="text-purple-600 dark:text-purple-400 font-semibold hover:underline break-all">
                    {shortUrl}
                  </Link>
                </div>
                <StatsClient shortUrl={shortUrl} />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Clicks */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                      <FaMousePointer className="text-white text-2xl" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">ALL TIME</span>
                  </div>
                  <h3 className="text-5xl font-black text-gray-900 dark:text-white mb-2">{url.clicks}</h3>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Clicks</p>
                </div>
              </div>

              {/* Last Clicked */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                      <FaClock className="text-white text-2xl" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {url.lastClickedAt ? new Date(url.lastClickedAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    }) : 'Never'}
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 mb-3">
                    {url.lastClickedAt ? new Date(url.lastClickedAt).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : 'No clicks yet'}
                  </p>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Last Clicked</p>
                </div>
              </div>

              {/* Created At */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                      <FaCalendarAlt className="text-white text-2xl" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {new Date(url.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 mb-3">
                    {new Date(url.createdAt).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Created At</p>
                </div>
              </div>
            </div>

            {/* Short Code Badge */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Short Code</p>
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                    {url.shortCode}
                  </p>
                </div>
                <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
                    #
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
