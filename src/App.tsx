import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Bot, Sparkles } from 'lucide-react';
import LandingScreen from './components/LandingScreen';
import ChatInterface from './components/ChatInterface';
import WelcomeModal from './components/WelcomeModal';
import AdminDashboard from './components/admin/AdminDashboard';
import { TrackingProvider } from './context/TrackingContext';

function App() {
  const [showChat, setShowChat] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [chatInitiatedAt, setChatInitiatedAt] = useState<Date | null>(null);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleStartChat = () => {
    setShowWelcomeModal(true);
    // Track when the chat is initiated for analytics purposes
    setChatInitiatedAt(new Date());
  };

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  // Reset chat when navigating back to home
  useEffect(() => {
    if (location.pathname === '/' && isAdminRoute) {
      setShowChat(false);
    }
  }, [location.pathname, isAdminRoute]);

  // Show welcome modal automatically if the user has been on the page for 15 seconds
  useEffect(() => {
    if (!showWelcomeModal && !showChat && !isAdminRoute) {
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
      }, 15000);
      
      return () => clearTimeout(timer);
    }
  }, [showWelcomeModal, showChat, isAdminRoute]);

  return (
    <TrackingProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Header */}
        {!isAdminRoute && (
          <header className="py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="text-2xl font-bold text-indigo-900">Lyzr AI</span>
            </div>
            <nav>
              <ul className="flex space-x-8">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 font-medium">Platform</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 font-medium">Solutions</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 font-medium">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600 font-medium">Docs</a></li>
                <li><Link to="/admin" className="text-gray-600 hover:text-indigo-600 font-medium">Admin</Link></li>
              </ul>
            </nav>
            <div>
              <button 
                onClick={handleStartChat}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                AI Readiness Assessment
              </button>
            </div>
          </header>
        )}

        {/* Main Content */}
        <Routes>
          <Route path="/" element={
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {!showChat && <LandingScreen onStartChat={handleStartChat} />}
            </main>
          } />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>

        {/* Chat Interface */}
        {showChat && !isAdminRoute && <ChatInterface onClose={handleCloseChat} />}

        {/* Welcome Modal */}
        {showWelcomeModal && !isAdminRoute && <WelcomeModal onClose={handleCloseWelcomeModal} />}

        {/* Floating Chat Button (when chat is not open) */}
        {!showChat && !showWelcomeModal && !isAdminRoute && (
          <button 
            onClick={handleStartChat}
            className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center z-50 animate-pulse"
          >
            <Bot className="h-6 w-6" />
          </button>
        )}
      </div>
    </TrackingProvider>
  );
}

export default App;