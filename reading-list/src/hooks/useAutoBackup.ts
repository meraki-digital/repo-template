/**
 * Auto-backup hook
 * Triggers automatic backups based on change count and time elapsed
 */

import { useEffect, useRef } from 'react';
import { downloadBackup } from '../services/backup.ts';

const CHANGES_THRESHOLD = 10; // Backup every 10 changes
const TIME_THRESHOLD = 60 * 60 * 1000; // Backup every 60 minutes (in milliseconds)

export function useAutoBackup() {
  const changeCountRef = useRef(0);
  const lastBackupRef = useRef(Date.now());
  const timerRef = useRef<number>(0);

  // Increment change counter and check if backup is needed
  const recordChange = () => {
    changeCountRef.current += 1;
    console.log(`📝 Change recorded (${changeCountRef.current}/${CHANGES_THRESHOLD})`);

    // Check if we've hit the change threshold
    if (changeCountRef.current >= CHANGES_THRESHOLD) {
      triggerBackup('change count');
    }
  };

  // Trigger backup and reset counters
  const triggerBackup = (reason: string) => {
    console.log(`🔄 Auto-backup triggered: ${reason}`);
    downloadBackup();
    
    // Reset counters
    changeCountRef.current = 0;
    lastBackupRef.current = Date.now();
    
    // Show notification (will be replaced with proper toast later)
    console.log('✨ Auto-backup saved to your downloads!');
  };

  // Setup periodic time-based backup check
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      const timeSinceLastBackup = Date.now() - lastBackupRef.current;
      
      // If changes exist and time threshold passed, backup
      if (changeCountRef.current > 0 && timeSinceLastBackup >= TIME_THRESHOLD) {
        triggerBackup('time elapsed');
      }
    }, 60 * 1000); // Check every minute

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    recordChange,
    manualBackup: () => triggerBackup('manual'),
  };
}
