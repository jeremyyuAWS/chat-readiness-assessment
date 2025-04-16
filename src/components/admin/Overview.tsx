import React, { useEffect } from 'react';
import { useTracking } from '../../context/TrackingContext';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { format, subDays } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Overview: React.FC = () => {
  const { sessions, getAggregatedStats } = useTracking();
  const stats = getAggregatedStats();

  // Helper to get last 7 days labels
  const getLast7DaysLabels = () => {
    return Array.from({ length: 7 }, (_, i) => {
      return format(subDays(new Date(), 6 - i), 'MMM d');
    });
  };

  // Count sessions per day for the last 7 days
  const getSessionsPerDay = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));
    
    const counts = last7Days.map(day => {
      const dayFormatted = format(day, 'yyyy-MM-dd');
      return sessions.filter(session => {
        const sessionDate = format(new Date(session.startTime), 'yyyy-MM-dd');
        return sessionDate === dayFormatted;
      }).length;
    });
    
    return counts;
  };

  const userEngagementData = {
    labels: getLast7DaysLabels(),
    datasets: [
      {
        label: 'Total Sessions',
        data: getSessionsPerDay(),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
    ],
  };

  const completionRateData = {
    labels: ['Completed', 'Abandoned'],
    datasets: [
      {
        data: [stats.completedSessions, stats.totalSessions - stats.completedSessions],
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(209, 213, 219, 0.6)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(209, 213, 219, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const leadsByCategoryData = {
    labels: Object.keys(stats.sessionsByRole).filter(role => role !== 'unknown'),
    datasets: [
      {
        label: 'Sessions by Role',
        data: Object.values(stats.sessionsByRole).filter((_, i) => Object.keys(stats.sessionsByRole)[i] !== 'unknown'),
        backgroundColor: [
          'rgba(99, 102, 241, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(139, 92, 246, 0.6)',
          'rgba(236, 72, 153, 0.6)',
          'rgba(248, 113, 113, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Sample lead quality conversion trend
  const daysAgo = Array.from({ length: 30 }, (_, i) => format(subDays(new Date(), 29 - i), 'MMM d'));
  const leadQualityData = {
    labels: daysAgo,
    datasets: [
      {
        label: 'Lead Quality Score (avg)',
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 30) + 40),
        fill: false,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1,
      },
      {
        label: 'Conversion Rate (%)',
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 15) + 20),
        fill: false,
        borderColor: 'rgb(139, 92, 246)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Conversations</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.totalSessions}</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              24%
            </span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Completion Rate</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.completionRate.toFixed(1)}%</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              5%
            </span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Email Capture Rate</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.emailCaptureRate.toFixed(1)}%</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-red-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              2%
            </span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Conversation Time</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.averageSessionDuration.toFixed(1)} min</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              12%
            </span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
      </div>
      
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">User Engagement (Last 7 Days)</h3>
          <div className="h-64">
            <Bar 
              data={userEngagementData} 
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
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Conversation Completion Rate</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="w-64">
              <Doughnut 
                data={completionRateData} 
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
        </div>
      </div>
      
      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Leads by Role</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="w-64">
              <Doughnut 
                data={leadsByCategoryData} 
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right' as const,
                    },
                  },
                }} 
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Lead Quality & Conversion Trends</h3>
          <div className="h-64">
            <Line 
              data={leadQualityData} 
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
      
      {/* User Flow Insights */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">User Flow Insights</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Time</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Most Common Answer</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  AI journey stage
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="ml-2">92%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8.2s</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Just Starting (42%)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  User role
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="ml-2">85%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6.7s</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Marketing/Growth (36%)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Area of interest
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <span className="ml-2">78%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">9.3s</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Marketing (29%)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Help needed
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <span className="ml-2">72%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7.5s</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Use Cases (38%)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;