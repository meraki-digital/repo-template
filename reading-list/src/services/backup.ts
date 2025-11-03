/**
 * Auto-backup service
 * Handles exporting/importing data to/from JSON files
 */

import type { Book, Note } from '../types/types.ts';
import { loadBooks } from './books.ts';
import { loadNotes } from './notes.ts';

export interface BackupData {
  version: string;
  exportedAt: string;
  books: Book[];
  notes: Note[];
}

export function exportToJSON(): BackupData {
  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    books: loadBooks(),
    notes: loadNotes(),
  };
}

export function downloadBackup(): void {
  const data = exportToJSON();
  
  // Create filename with timestamp (no colons for cross-platform compatibility)
  const timestamp = new Date().toISOString()
    .slice(0, 16)
    .replace(/:/g, '')
    .replace('T', '-');
  const filename = `reading-list-backup-${timestamp}.json`;
  
  // Create blob and download
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  
  // Cleanup
  URL.revokeObjectURL(url);
}

export function validateBackupData(data: unknown): data is BackupData {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  const backup = data as Partial<BackupData>;
  
  return (
    typeof backup.version === 'string' &&
    typeof backup.exportedAt === 'string' &&
    Array.isArray(backup.books) &&
    Array.isArray(backup.notes)
  );
}

export async function importFromFile(file: File): Promise<BackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const data = JSON.parse(json);
        
        if (!validateBackupData(data)) {
          reject(new Error("Oops! That file doesn't look right. Make sure it's a backup from this app."));
          return;
        }
        
        resolve(data);
      } catch (error) {
        reject(new Error("Oops! Couldn't read that file. Make sure it's a valid JSON backup."));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Oops! Something went wrong reading the file."));
    };
    
    reader.readAsText(file);
  });
}
