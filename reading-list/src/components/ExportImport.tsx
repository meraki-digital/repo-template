/**
 * Export/Import component
 * Provides manual data backup and restore functionality
 */

import { useRef } from 'react';
import { downloadBackup, importFromFile } from '../services/backup.ts';
import { saveBooks } from '../services/books.ts';
import { saveNotes } from '../services/notes.ts';

interface ExportImportProps {
  onImportComplete?: () => void;
}

export function ExportImport({ onImportComplete }: ExportImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    downloadBackup();
    console.log('✨ Data exported successfully!');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Confirm overwrite
      const confirmed = window.confirm(
        'This will replace all your current books and notes. Continue?'
      );
      
      if (!confirmed) {
        return;
      }

      // Import and validate data
      const backupData = await importFromFile(file);
      
      // Save to localStorage
      saveBooks(backupData.books);
      saveNotes(backupData.notes);
      
      console.log('✨ Data imported successfully!');
      
      // Notify parent to refresh
      onImportComplete?.();
      
      // Reload page to show imported data
      window.location.reload();
      
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to import data');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExport}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        📥 Export Data
      </button>
      
      <button
        onClick={handleImportClick}
        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
      >
        📤 Import Data
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelected}
        className="hidden"
      />
    </div>
  );
}
