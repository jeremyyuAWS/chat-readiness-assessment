import React, { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, Users, MessageSquare, Filter, LogOut, ChevronLeft, PieChart, LineChart, Trophy, Megaphone } from 'lucide-react';
import Overview from './Overview';
import LeadManagement from './LeadManagement';
import ConversationAnalytics from './ConversationAnalytics';
import MarketingAnalytics from './MarketingAnalytics';

const AdminDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, handle proper logout
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`bg-indigo-900 text-white transition-all duration-300 flex flex-col ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-indigo-800">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="bg-white rounded-full p-1">
                <div className="bg-indigo-600 rounded-full w-6 h-6 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">L</span>
                </div>
              </div>
              <span className="font-bold">Lyzr Admin</span>
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-full hover:bg-indigo-800"
          >
            <ChevronLeft className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Sidebar Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => 
                  `flex items-center py-2 px-4 ${isActive ? 'bg-indigo-800' : 'hover:bg-indigo-800'} transition-colors`
                }
              >
                <BarChart3 className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Overview</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/leads"
                className={({ isActive }) => 
                  `flex items-center py-2 px-4 ${isActive ? 'bg-indigo-800' : 'hover:bg-indigo-800'} transition-colors`
                }
              >
                <Users className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Lead Management</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/conversations"
                className={({ isActive }) => 
                  `flex items-center py-2 px-4 ${isActive ? 'bg-indigo-800' : 'hover:bg-indigo-800'} transition-colors`
                }
              >
                <MessageSquare className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Conversation Analytics</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/marketing"
                className={({ isActive }) => 
                  `flex items-center py-2 px-4 ${isActive ? 'bg-indigo-800' : 'hover:bg-indigo-800'} transition-colors`
                }
              >
                <Megaphone className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Marketing Analytics</span>}
              </NavLink>
            </li>
          </ul>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-indigo-800">
          <button 
            onClick={handleLogout}
            className="flex items-center py-2 px-4 w-full rounded hover:bg-indigo-800 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">AI Readiness Chat Analytics</h1>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div>
              <button className="flex items-center space-x-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg transition-colors">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/leads" element={<LeadManagement />} />
            <Route path="/conversations" element={<ConversationAnalytics />} />
            <Route path="/marketing" element={<MarketingAnalytics />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;