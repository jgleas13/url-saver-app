'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data for the activity page
const mockActivities = [
  {
    id: '1',
    url: 'https://example.com/article-1',
    title: 'Example Article 1',
    dateProcessed: '2024-03-28 15:25:33',
    status: 'completed',
    message: 'Successfully processed and summarized.'
  },
  {
    id: '2',
    url: 'https://example.com/article-2',
    title: 'Example Article 2',
    dateProcessed: '2024-03-27 12:15:20',
    status: 'completed',
    message: 'Successfully processed and summarized.'
  },
  {
    id: '3',
    url: 'https://example.com/article-3',
    title: 'Example Article 3',
    dateProcessed: '2024-03-26 09:45:11',
    status: 'failed',
    message: 'Failed to generate summary. The content could not be accessed.'
  }
];

export default function Activity() {
  const [activities, setActivities] = useState(mockActivities);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity</h1>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Dashboard
            </Link>
            <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Sign Out
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Processing History</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">View the status of your shared URLs</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    URL / Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date Processed
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No activity recorded yet.
                    </td>
                  </tr>
                ) : (
                  activities.map((activity) => (
                    <tr key={activity.id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                            <a href={activity.url} target="_blank" rel="noopener noreferrer">
                              {activity.title}
                            </a>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {activity.url}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {activity.dateProcessed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full inline-block
                          ${activity.status === 'completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                        >
                          {activity.status === 'completed' ? 'Completed' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {activity.message}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
} 