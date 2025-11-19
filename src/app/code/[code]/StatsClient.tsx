"use client";

import { FaCopy } from "react-icons/fa";
import toast from 'react-hot-toast';

export default function StatsClient({ shortUrl }: { shortUrl: string }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      toast.success('Copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  return (
    <button
      onClick={copyToClipboard}
      className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
    >
      <FaCopy className="mr-2" />
      Copy Link
    </button>
  );
}

