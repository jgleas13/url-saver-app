'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '@/config/firebaseClient';

interface UserAvatarProps {
  onClick: () => void;
}

export default function UserAvatar({ onClick }: UserAvatarProps) {
  const [user, setUser] = useState<{
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  } | null>(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setLoading(false);
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <button className="inline-flex items-center text-sm">
        <div className="animate-pulse h-8 w-8 bg-gray-200 rounded-full"></div>
      </button>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
      aria-label="User settings"
    >
      <div className="flex items-center">
        <span className="text-sm text-gray-700 mr-2 hidden md:inline-block">
          {user.displayName || user.email?.split('@')[0] || 'User'}
        </span>
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="h-8 w-8 rounded-full border-2 border-white shadow"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow">
            <span className="text-sm font-medium text-blue-600">
              {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
            </span>
          </div>
        )}
      </div>
    </button>
  );
} 