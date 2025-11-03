import { useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeSampleData } from './services/sampleData';
import { BookList } from './pages/BookList';
import { BookDetail } from './pages/BookDetail';
import { StorageWarning } from './components/StorageWarning';
import { ExportImport } from './components/ExportImport';
import { Toast } from './components/Toast';
import { useToast } from './hooks/useToast';
import { useAutoBackup } from './hooks/useAutoBackup';

export const AutoBackupContext = createContext<{ recordChange: () => void }>({
  recordChange: () => {},
});

function App() {
  const { toasts } = useToast();

  useEffect(() => {
    initializeSampleData();
  }, []);

  const { recordChange } = useAutoBackup();

  return (
    <AutoBackupContext.Provider value={{ recordChange }}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <StorageWarning />
          
          <div className="fixed top-4 right-4 z-50">
            <ExportImport />
          </div>

          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/books/:id" element={<BookDetail />} />
          </Routes>

          <div className="fixed bottom-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
              <Toast key={toast.id} toast={toast} onDismiss={() => {}} />
            ))}
          </div>
        </div>
      </Router>
    </AutoBackupContext.Provider>
  );
}

export default App;
