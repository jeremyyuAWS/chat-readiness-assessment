import React, { useState } from 'react';
import { useTracking } from '../../context/TrackingContext';
import { 
  BarChart3, 
  MessageSquare, 
  ChevronsUpDown, 
  MessageCircle, 
  CheckCircle, 
  XCircle,
  Flag,
  PieChart,
  TrendingUp,
  Clock,
  Eye,
  FileText,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

const ConversationAnalytics: React.FC = () => {
  const { interactions, sessions, getAggregatedStats, getFunnelData } = useTracking();
  const [dropoutAnalysisOpen, setDropoutAnalysisOpen] = useState(false);
  const [heatmapOpen, setHeatmapOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [viewConversationDetails, setViewConversationDetails] = useState(false);
  const stats = getAggregatedStats();
  const funnelData = getFunnelData();
  
  // Handler for when a session is clicked
  const handleSessionClick = (sessionId: string) => {
    setSelectedSession(sessionId);
    setViewConversationDetails(true);
  };
  
  const handleViewDetails = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSession(sessionId);
    setViewConversationDetails(true);
  };
  
  const handleCloseDetails = () => {
    setViewConversationDetails(false);
    setSelectedSession(null);
  };
  
  // Sentiment data calculation
  const sentimentCounts = {
    positive: sessions.filter(s => s.sentiment === 'positive').length,
    neutral: sessions.filter(s => s.sentiment === 'neutral').length,
    negative: sessions.filter(s => s.sentiment === 'negative').length,
  };
  
  const sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [sentimentCounts.positive, sentimentCounts.neutral, sentimentCounts.negative],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(59, 130, 246)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Conversation funnel data
  const funnelLabels = [
    'Started Chat', 
    'Answered Questions', 
    'Viewed Recommendations', 
    'Provided Email',
    'Qualified Leads',
    'Booked Calls'
  ];
  
  const funnelChartData = {
    labels: funnelLabels,
    datasets: [
      {
        label: 'Conversion Funnel',
        data: [
          funnelData.startedChat,
          funnelData.answeredQuestions,
          funnelData.viewedRecommendations,
          funnelData.providedEmail,
          funnelData.qualifiedLeads,
          funnelData.bookedCalls
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
    ],
  };
  
  // Mock data for question dropoff
  const dropoffData = {
    labels: [
      'Initial Question', 
      'AI Journey Stage', 
      'User Role', 
      'AI Interest Area', 
      'Help Needed', 
      'Industry'
    ],
    datasets: [
      {
        label: 'User Dropoff Rate (%)',
        data: [5, 12, 18, 25, 30, 35],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
      {
        label: 'Completion Rate (%)',
        data: [95, 88, 82, 75, 70, 65],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  };
  
  // Time to answer each question
  const responseTimeData = {
    labels: [
      'Initial Question', 
      'AI Journey Stage', 
      'User Role', 
      'AI Interest Area', 
      'Help Needed', 
      'Industry'
    ],
    datasets: [
      {
        label: 'Average Response Time (seconds)',
        data: [5.2, 7.4, 6.3, 9.1, 8.7, 10.2],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  // Commonly asked questions by users (frequency analysis)
  const commonQuestions = [
    { question: "What's the difference between AI and ML?", count: 42 },
    { question: "How much does it cost to implement AI?", count: 36 },
    { question: "How long does AI implementation take?", count: 29 },
    { question: "Do you offer custom solutions?", count: 24 },
    { question: "Can I integrate with my existing systems?", count: 21 },
  ];

  // Sample session data for sessions table
  const recentSessions = sessions.slice(0, 10).map(session => ({
    id: session.id,
    startTime: session.startTime,
    completedFlow: session.completedFlow,
    userId: session.userId,
    questionCount: session.engagementMetrics?.questionCount || 0,
    dwellTime: session.engagementMetrics?.dwellTimeTotal || 0,
    sentiment: session.sentiment || 'neutral'
  }));

  // Mock conversation data for selected session
  const mockConversation = viewConversationDetails && selectedSession ? [
    { sender: 'agent', message: "Hi there 👋 Ready to explore how AI fits into your journey?", timestamp: new Date() },
    { sender: 'user', message: "Yes, I'd like to learn more about AI implementation.", timestamp: new Date() },
    { sender: 'agent', message: "Great! What best describes your current AI journey?", timestamp: new Date() },
    { sender: 'user', message: "Just Starting - New to AI implementation", timestamp: new Date() },
    { sender: 'agent', message: "Thanks for sharing! What's your role?", timestamp: new Date() },
    { sender: 'user', message: "CTO/Technical Leader - Technology focus", timestamp: new Date() },
    { sender: 'agent', message: "What area are you most excited to use AI in?", timestamp: new Date() },
    { sender: 'user', message: "Data Analysis - Business insights", timestamp: new Date() },
    { sender: 'agent', message: "What kind of help do you need most right now?", timestamp: new Date() },
    { sender: 'user', message: "Strategic Planning - Roadmap development", timestamp: new Date() },
    { sender: 'agent', message: "What industry is your business in?", timestamp: new Date() },
    { sender: 'user', message: "Technology - Software or hardware", timestamp: new Date() },
    { sender: 'agent', message: "Thanks for sharing your AI journey with me! I've created a personalized AI readiness assessment for you.", timestamp: new Date() },
  ] : [];
  
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-indigo-100 text-indigo-600 mr-4">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Conversations</h3>
              <p className="text-2xl font-bold text-gray-800">{sessions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-green-100 text-green-600 mr-4">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Completed Conversations</h3>
              <p className="text-2xl font-bold text-gray-800">
                {sessions.filter(s => s.completedFlow).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-red-100 text-red-600 mr-4">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Abandoned Conversations</h3>
              <p className="text-2xl font-bold text-gray-800">
                {sessions.filter(s => !s.completedFlow).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-blue-100 text-blue-600 mr-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
              <p className="text-2xl font-bold text-gray-800">
                {((funnelData.qualifiedLeads / funnelData.startedChat) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Conversation Funnel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">Conversation Funnel</h3>
          </div>
        </div>
        
        <div className="p-6">
          <div className="h-72">
            <Bar 
              data={funnelChartData} 
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6">
            {funnelLabels.map((label, index) => {
              const currentValue = funnelChartData.datasets[0].data[index];
              const prevValue = index > 0 ? funnelChartData.datasets[0].data[index - 1] : currentValue;
              const conversionRate = prevValue ? (currentValue / prevValue) * 100 : 100;
              
              return (
                <div key={index} className="bg-indigo-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-indigo-600 font-medium mb-1">{label}</p>
                  <p className="text-lg font-bold text-indigo-900">{currentValue}</p>
                  {index > 0 && (
                    <p className="text-xs text-indigo-700">
                      {conversionRate.toFixed(1)}% from previous
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Recent Sessions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">Recent Conversations</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dwell Time</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentSessions.map(session => (
                <tr 
                  key={session.id} 
                  className={`hover:bg-gray-50 cursor-pointer ${selectedSession === session.id ? 'bg-indigo-50' : ''}`}
                  onClick={() => handleSessionClick(session.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    User {session.userId.split('-')[1]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(session.startTime), 'MMM d, h:mm a')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      session.completedFlow ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {session.completedFlow ? 'Completed' : 'Abandoned'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.questionCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.dwellTime}s
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      session.sentiment === 'positive' ? 'bg-green-100 text-green-800' : 
                      session.sentiment === 'neutral' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {session.sentiment.charAt(0).toUpperCase() + session.sentiment.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-2.5 py-1 rounded-md flex items-center text-xs font-medium transition-colors"
                      onClick={(e) => handleViewDetails(session.id, e)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Conversation Details Modal */}
      {viewConversationDetails && selectedSession && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-indigo-50">
              <div>
                <h3 className="text-lg font-bold text-indigo-900">Conversation Details</h3>
                <p className="text-sm text-indigo-700">Session ID: {selectedSession}</p>
              </div>
              <button 
                onClick={handleCloseDetails}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {/* Conversation Transcript */}
              <div className="md:col-span-2 h-[600px] overflow-y-auto p-4">
                <div className="flex items-center mb-4">
                  <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                  <h4 className="text-md font-medium text-gray-800">Conversation Transcript</h4>
                </div>
                
                <div className="space-y-4">
                  {mockConversation.map((message, idx) => (
                    <div 
                      key={idx} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'user' 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="text-sm">{message.message}</div>
                        <div className="text-xs mt-1 opacity-70">
                          {format(message.timestamp, 'h:mm a')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Conversation Analytics */}
              <div className="p-4 h-[600px] overflow-y-auto">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-5 w-5 text-indigo-600 mr-2" />
                  <h4 className="text-md font-medium text-gray-800">Conversation Metrics</h4>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Clock className="h-4 w-4 text-indigo-500 mr-1" />
                      Timing
                    </h5>
                    <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                      <div>
                        <div className="text-xs text-gray-500">Total Duration</div>
                        <div className="text-sm font-medium">6:32 minutes</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Avg Response Time</div>
                        <div className="text-sm font-medium">8.2 seconds</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Agent Response Time</div>
                        <div className="text-sm font-medium">1.3 seconds</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Info className="h-4 w-4 text-indigo-500 mr-1" />
                      Conversation Summary
                    </h5>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                      <p>
                        User is a Technical Leader in the Technology industry who is just starting their AI journey. 
                        They're primarily interested in Data Analysis solutions and need help with strategic planning 
                        for their AI roadmap.
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">User Profile</h5>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                      <div className="grid grid-cols-2 gap-y-2">
                        <div>
                          <span className="text-xs text-gray-500">Role:</span>
                          <p className="font-medium">Technical Leader</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">AI Maturity:</span>
                          <p className="font-medium">Just Starting</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Interest Area:</span>
                          <p className="font-medium">Data Analysis</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Industry:</span>
                          <p className="font-medium">Technology</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h5>
                    <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                      <div className="text-xs font-medium p-2 bg-blue-50 text-blue-800 rounded">
                        Automated Data Insights Agent
                      </div>
                      <div className="text-xs font-medium p-2 bg-blue-50 text-blue-800 rounded">
                        Technical Implementation Playbook
                      </div>
                      <div className="text-xs font-medium p-2 bg-blue-50 text-blue-800 rounded">
                        Data Analysis Architecture Blueprint
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Lead Status</h5>
                    <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Lead Score:</span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                          86/100
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Email Captured:</span>
                        <span className="text-xs font-medium">Yes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-500">Call Booked:</span>
                        <span className="text-xs font-medium">No</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                onClick={handleCloseDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Sentiment Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <PieChart className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">Conversation Sentiment</h3>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 flex items-center justify-center">
              <div className="h-64 w-64">
                <Doughnut 
                  data={sentimentData} 
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom' as const,
                      },
                    },
                  }}
                />
              </div>
            </div>
            
            <div className="col-span-2">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-green-700">Positive Sentiment</h4>
                    <span className="text-green-700 font-bold">{sentimentCounts.positive} users</span>
                  </div>
                  <p className="text-sm text-green-600 mb-2">
                    Users who completed the flow, provided email details, and interacted with recommendations.
                  </p>
                  <div className="flex items-center">
                    <div className="w-full bg-green-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${(sentimentCounts.positive / sessions.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-green-700">
                      {((sentimentCounts.positive / sessions.length) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-blue-700">Neutral Sentiment</h4>
                    <span className="text-blue-700 font-bold">{sentimentCounts.neutral} users</span>
                  </div>
                  <p className="text-sm text-blue-600 mb-2">
                    Users who engaged with the conversation but didn't complete all actions.
                  </p>
                  <div className="flex items-center">
                    <div className="w-full bg-blue-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(sentimentCounts.neutral / sessions.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-blue-700">
                      {((sentimentCounts.neutral / sessions.length) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-red-700">Negative Sentiment</h4>
                    <span className="text-red-700 font-bold">{sentimentCounts.negative} users</span>
                  </div>
                  <p className="text-sm text-red-600 mb-2">
                    Users who abandoned the conversation early without significant engagement.
                  </p>
                  <div className="flex items-center">
                    <div className="w-full bg-red-200 rounded-full h-2.5">
                      <div 
                        className="bg-red-600 h-2.5 rounded-full" 
                        style={{ width: `${(sentimentCounts.negative / sessions.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-red-700">
                      {((sentimentCounts.negative / sessions.length) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Response Analytics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">Response Analytics</h3>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Question Dropout Rates */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Question Completion/Dropout</h4>
              <div className="h-64">
                <Bar 
                  data={dropoffData} 
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                      },
                    },
                  }}
                />
              </div>
            </div>
            
            {/* Response Time by Question */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Average Response Time</h4>
              <div className="h-64">
                <Bar 
                  data={responseTimeData} 
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Engagement Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">Engagement Metrics</h3>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-medium text-indigo-800 mb-2">Average Dwell Time</h4>
              <p className="text-3xl font-bold text-indigo-900">{stats.avgDwellTime.toFixed(1)}s</p>
              <p className="text-sm text-indigo-600 mt-1">
                Average time users spend actively engaging with the chat
              </p>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-medium text-indigo-800 mb-2">Average Response Time</h4>
              <p className="text-3xl font-bold text-indigo-900">{stats.avgResponseTime.toFixed(1)}s</p>
              <p className="text-sm text-indigo-600 mt-1">
                Average time users take to respond to questions
              </p>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-medium text-indigo-800 mb-2">Average Session Length</h4>
              <p className="text-3xl font-bold text-indigo-900">{stats.averageSessionDuration.toFixed(1)}m</p>
              <p className="text-sm text-indigo-600 mt-1">
                Average total duration of completed conversations
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* User Questions Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">Common Questions Analysis</h3>
          </div>
        </div>
        
        <div className="p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {commonQuestions.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.question}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full" 
                          style={{ width: `${(item.count / commonQuestions[0].count) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">{item.count}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900">Improve Response</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Insights and Recommendations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <Flag className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">Insights and Recommendations</h3>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
            <h4 className="font-medium text-indigo-700 mb-2">User Dropoff Point</h4>
            <p className="text-sm text-indigo-600 mb-2">
              30% of users drop off at the "Help Needed" question. Consider rewording or simplifying this question.
            </p>
            <button className="text-xs font-medium text-indigo-700 hover:text-indigo-900">
              View Detailed Analysis
            </button>
          </div>
          
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <h4 className="font-medium text-green-700 mb-2">High Performing Audience</h4>
            <p className="text-sm text-green-600 mb-2">
              Marketing executives in the "exploring" phase have the highest conversion rate (72%). 
              Consider targeting similar segments in acquisition campaigns.
            </p>
            <button className="text-xs font-medium text-green-700 hover:text-green-900">
              Export Segment
            </button>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
            <h4 className="font-medium text-yellow-700 mb-2">Response Improvement</h4>
            <p className="text-sm text-yellow-600 mb-2">
              Users are frequently asking about cost and implementation timeframes. 
              Consider adding more specific information on these topics to the agent's responses.
            </p>
            <button className="text-xs font-medium text-yellow-700 hover:text-yellow-900">
              Update Agent Knowledge
            </button>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="font-medium text-blue-700 mb-2">Conversion Optimization</h4>
            <p className="text-sm text-blue-600 mb-2">
              Only 65% of users who view recommendations provide their email. Consider testing different email
              capture messaging or offering additional incentives.
            </p>
            <button className="text-xs font-medium text-blue-700 hover:text-blue-900">
              A/B Test Email Capture
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationAnalytics;