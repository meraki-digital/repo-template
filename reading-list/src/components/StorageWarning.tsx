/**
 * Storage warning component
 * Shows warning banner when localStorage is approaching capacity
 */

import { useState, useEffect } from 'react';
import { getStorageInfo } from '../utils/storage-monitor.ts';

export function StorageWarning() {
  const [dismissed, setDismissed] = useState(false);
  const [storageInfo, setStorageInfo] = useState(getStorageInfo());

  useEffect(() => {
    // Update storage info periodically
    const interval = setInterval(() => {
      setStorageInfo(getStorageInfo());
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Don't show if dismissed or not near capacity
  if (dismissed || !storageInfo.nearCapacity) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">⚠️</span>
            <h3 className="text-lg font-bold text-yellow-800">
              Heads up! Your reading list is getting pretty full.
            </h3>
          </div>
          <p className="text-yellow-700 mb-2">
            You're using {storageInfo.usedFormatted} of storage (~{storageInfo.percentage}% full).
          </p>
          <p className="text-sm text-yellow-600">
            Consider exporting a backup to save your data safely. You can find the export button in the header.
          </p>
        </div>
        
        <button
          onClick={() => setDismissed(true)}
          className="ml-4 text-yellow-600 hover:text-yellow-800 font-bold"
          aria-label="Dismiss warning"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
