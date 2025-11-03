import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Book } from './types/index.ts';
import { loadBooks } from './services/books.ts';
import { initializeSampleData } from './services/sampleData.ts';

function App() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    // Initialize sample data on first load
    initializeSampleData();
    
    // Load books from localStorage
    const loadedBooks = loadBooks();
    setBooks(loadedBooks);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📚 Reading List Tracker
          </h1>
          <p className="text-gray-600 mb-8">
            Testing localStorage services...
          </p>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ✅ Setup Complete
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Vite + React + TypeScript</li>
              <li>✓ Tailwind CSS configured</li>
              <li>✓ React Router installed</li>
              <li>✓ Type definitions created</li>
              <li>✓ Validation utilities ready</li>
              <li>✓ localStorage services working</li>
              <li>✓ Sample data initialized</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📖 Books in localStorage ({books.length})
            </h2>
            {books.length === 0 ? (
              <p className="text-gray-500 italic">No books found</p>
            ) : (
              <div className="space-y-4">
                {books.map(book => (
                  <div key={book.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h3 className="font-bold text-lg text-gray-900">
                      {book.title}
                    </h3>
                    <p className="text-gray-600">by {book.author}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                      book.status === 'Finished' ? 'bg-green-100 text-green-800' :
                      book.status === 'Currently Reading' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {book.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Check your browser's localStorage:</strong> Open DevTools → Application → Local Storage → http://localhost:5175
            </p>
            <p className="text-sm text-blue-700 mt-2">
              You should see keys: <code className="bg-blue-100 px-2 py-1 rounded">books</code> and <code className="bg-blue-100 px-2 py-1 rounded">notes</code>
            </p>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
