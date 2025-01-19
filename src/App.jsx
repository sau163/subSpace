

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthenticationStatus } from '@nhost/react';
import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import Summary from './components/Summary';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const { isAuthenticated } = useAuthenticationStatus();
  const [currentSummary, setCurrentSummary] = useState(() => {
    const stored = localStorage.getItem('currentSummary');
    return stored ? JSON.parse(stored) : null;
  });

  const handleNewSummary = (summary) => {
    setCurrentSummary(summary);
    localStorage.setItem('currentSummary', JSON.stringify(summary));
  };

  return (
    <Router>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex">
                {isAuthenticated && <Sidebar onSelectChat={handleNewSummary} />}
                <div className="flex-1">
                  <SearchBar onNewSummary={handleNewSummary} />
                  <Summary currentSummary={currentSummary} />
                </div>
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;