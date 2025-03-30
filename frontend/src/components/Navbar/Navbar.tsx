'use client';

import { useState } from 'react';
import Link from 'next/link';
import UserAvatar from '@/components/UserAvatar/UserAvatar';
import UserSettingsPanel from '@/components/UserSettingsPanel/UserSettingsPanel';

export default function Navbar() {
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

  const openSettingsPanel = () => {
    setIsSettingsPanelOpen(true);
  };

  const closeSettingsPanel = () => {
    setIsSettingsPanelOpen(false);
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">Knowledge Base</h1>
            <nav className="ml-10 flex space-x-8">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/processing-log"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Processing Log
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center">
            <UserAvatar onClick={openSettingsPanel} />
          </div>
        </div>
      </div>

      {/* User Settings Panel */}
      <UserSettingsPanel 
        isOpen={isSettingsPanelOpen} 
        onClose={closeSettingsPanel} 
      />
    </header>
  );
} 