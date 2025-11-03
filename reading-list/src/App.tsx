import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            📚 Reading List Tracker
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">
              Setup complete! Tailwind CSS and React Router are working. 🎉
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Ready to start building...
            </p>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
