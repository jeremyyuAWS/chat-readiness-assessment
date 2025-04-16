import React, { useState } from 'react';
import { useTracking } from '../../context/TrackingContext';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Globe, 
  Zap,
  Share2,
  Tag,
  Lightbulb,
  AlertCircle,
  Filter,
  Calendar,
  Download
} from 'lucide-react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';

const MarketingAnalytics: React.FC = () => {
  const { sessions, interactions, getFunnelData, getAggregatedStats } = useTracking();
  const [dateRange, setDateRange] = useState<'7days' | '30days' | '90days'>('30days');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  
  const stats = getAggregatedStats();
  const funnelData = getFunnelData();
  
  // Mock campaign data
  const campaigns = [
    { id: 'email-1', name: 'Monthly Newsletter', source: 'email', startDate: subDays(new Date(), 25) },
    { id: 'social-1', name: 'LinkedIn Campaign', source: 'linkedin', startDate: subDays(new Date(), 20) },
    { id: 'ads-1', name: 'Google Search Ads', source: 'google', startDate: subDays(new Date(), 15) },
    { id: 'content-1', name: 'AI Readiness Blog', source: 'blog', startDate: subDays(new Date(), 10) },
    { id: 'webinar-1', name: 'AI Strategy Webinar', source: 'webinar', startDate: subDays(new Date(), 5) },
  ];
  
  // Campaign performance data 
  const campaignData = {
    'email-1': { clicks: 842, conversations: 156, leads: 37, conversionRate: 4.4, cpl: 12.50 },
    'social-1': { clicks: 1245, conversations: 192, leads: 45, conversionRate: 3.6, cpl: 14.20 },
    'ads-1': { clicks: 1876, conversations: 243, leads: 58, conversionRate: 3.1, cpl: 16.80 },
    'content-1': { clicks: 962, conversations: 187, leads: 51, conversionRate: 5.3, cpl: 9.70 },
    'webinar-1': { clicks: 580, conversations: 145, leads: 42, conversionRate: 7.2, cpl: 11.30 },
  };
  
  // Calculate totals for all campaigns
  const allCampaigns = {
    clicks: Object.values(campaignData).reduce((sum, campaign) => sum + campaign.clicks, 0),
    conversations: Object.values(campaignData).reduce((sum, campaign) => sum + campaign.conversations, 0),
    leads: Object.values(campaignData).reduce((sum, campaign) => sum + campaign.leads, 0),
    conversionRate: Object.values(campaignData).reduce((sum, campaign) => sum + campaign.conversionRate, 0) / Object.values(campaignData).length,
    cpl: Object.values(campaignData).reduce((sum, campaign) => sum + campaign.cpl, 0) / Object.values(campaignData).length,
  };
  
  // Chart data for campaign performance
  const campaignPerformanceData = {
    labels: campaigns.map(c => c.name),
    datasets: [
      {
        label: 'Conversion Rate (%)',
        data: campaigns.map(c => campaignData[c.id].conversionRate),
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        label: 'Cost per Lead ($)',
        data: campaigns.map(c => campaignData[c.id].cpl),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        yAxisID: 'y1',
      }
    ],
  };
  
  // Chart data for lead sources
  const leadSourceData = {
    labels: ['Email', 'LinkedIn', 'Google', 'Blog', 'Webinar', 'Direct'],
    datasets: [
      {
        data: [37, 45, 58, 51, 42, 23],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(99, 102, 241, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Chart data for time series
  const getTimeSeriesData = () => {
    const days = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;
    const labels = Array.from({ length: days }, (_, i) => format(subDays(new Date(), days - 1 - i), 'MMM d'));
    
    // Generate realistic-looking time series data with some trends
    const baseline = 10;
    const trend = 0.2;
    const noise = 4;
    const weekend = 0.7; // weekend dip factor
    
    const data = labels.map((_, i) => {
      // Add a slight upward trend
      const trendValue = baseline + (i * trend);
      // Weekend effect (dips on weekends)
      const day = subDays(new Date(), days - 1 - i).getDay();
      const weekendEffect = (day === 0 || day === 6) ? weekend : 1;
      // Random noise
      const randomNoise = (Math.random() * noise) - (noise / 2);
      
      return Math.max(0, Math.round(trendValue * weekendEffect + randomNoise));
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'New Leads',
          data,
          fill: false,
          borderColor: 'rgb(99, 102, 241)',
          tension: 0.1,
          pointBackgroundColor: 'rgb(99, 102, 241)',
        }
      ],
    };
  };
  
  // Get selected campaign data
  const selectedCampaignData = selectedCampaign === 'all' ? allCampaigns : campaignData[selectedCampaign];
  const selectedCampaignInfo = selectedCampaign === 'all' ? null : campaigns.find(c => c.id === selectedCampaign);
  
  // Get UTM attribution data
  const utmAttribution = [
    { campaign: 'Monthly Newsletter', leads: 37, conversionRate: 4.4, roi: 280 },
    { campaign: 'LinkedIn Campaign', leads: 45, conversionRate: 3.6, roi: 210 },
    { campaign: 'Google Search Ads', leads: 58, conversionRate: 3.1, roi: 175 },
    { campaign: 'AI Readiness Blog', leads: 51, conversionRate: 5.3, roi: 320 },
    { campaign: 'AI Strategy Webinar', leads: 42, conversionRate: 7.2, roi: 350 },
  ];
  
  // Content theme performance
  const contentThemes = [
    { theme: 'AI ROI & Business Case', engagement: 87, conversion: 6.2 },
    { theme: 'Implementation Guides', engagement: 76, conversion: 5.8 },
    { theme: 'Industry Use Cases', engagement: 92, conversion: 7.1 },
    { theme: 'Technical Tutorials', engagement: 68, conversion: 4.5 },
    { theme: 'AI Ethics & Compliance', engagement: 71, conversion: 3.9 },
  ];
  
  return (
    <div className="space-y-6">
      {/* Dashboard Header with Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Marketing Campaign Performance</h2>
          <p className="text-sm text-gray-500">Track your AI Readiness assessment funnel and campaign effectiveness</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
          
          <select 
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Campaigns</option>
            {campaigns.map(campaign => (
              <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
            ))}
          </select>
          
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md text-sm font-medium hover:bg-indigo-100">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      {/* Campaign Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-500">Clicks</div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Globe className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{selectedCampaignData.clicks.toLocaleString()}</div>
          <div className="mt-1 text-xs flex items-center text-green-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>12% vs previous period</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-500">Conversations</div>
            <div className="bg-purple-100 p-2 rounded-full">
              <Zap className="h-4 w-4 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{selectedCampaignData.conversations.toLocaleString()}</div>
          <div className="mt-1 text-xs flex items-center text-green-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>8% vs previous period</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-500">Qualified Leads</div>
            <div className="bg-green-100 p-2 rounded-full">
              <Target className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{selectedCampaignData.leads.toLocaleString()}</div>
          <div className="mt-1 text-xs flex items-center text-green-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>15% vs previous period</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-500">Conversion Rate</div>
            <div className="bg-indigo-100 p-2 rounded-full">
              <Share2 className="h-4 w-4 text-indigo-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{selectedCampaignData.conversionRate.toFixed(1)}%</div>
          <div className="mt-1 text-xs flex items-center text-green-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>2.5% vs previous period</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-500">Cost per Lead</div>
            <div className="bg-red-100 p-2 rounded-full">
              <Tag className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">${selectedCampaignData.cpl.toFixed(2)}</div>
          <div className="mt-1 text-xs flex items-center text-red-600">
            <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
            <span>3.2% vs previous period</span>
          </div>
        </div>
      </div>
      
      {/* Campaign Details (if specific campaign selected) */}
      {selectedCampaign !== 'all' && selectedCampaignInfo && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{selectedCampaignInfo.name} Details</h3>
            <div className="text-sm text-gray-500">Started {format(selectedCampaignInfo.startDate, 'MMMM d, yyyy')}</div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-indigo-900">Top Converting Content</h4>
                  <Lightbulb className="h-5 w-5 text-indigo-600" />
                </div>
                <ul className="mt-2 space-y-1">
                  <li className="text-sm text-indigo-800">AI ROI Calculator (8.3%)</li>
                  <li className="text-sm text-indigo-800">Customer Support Use Case (7.1%)</li>
                  <li className="text-sm text-indigo-800">5-Minute Assessment (6.5%)</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-green-900">Top Lead Sources</h4>
                  <Globe className="h-5 w-5 text-green-600" />
                </div>
                <ul className="mt-2 space-y-1">
                  <li className="text-sm text-green-800">Direct (42%)</li>
                  <li className="text-sm text-green-800">Email (28%)</li>
                  <li className="text-sm text-green-800">Social (23%)</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-blue-900">Top Lead Categories</h4>
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <ul className="mt-2 space-y-1">
                  <li className="text-sm text-blue-800">Marketing Executives (35%)</li>
                  <li className="text-sm text-blue-800">IT Leaders (28%)</li>
                  <li className="text-sm text-blue-800">Startup Founders (22%)</li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800">Campaign Insights</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    This campaign performs 23% better on weekdays between 10am-2pm. 
                    Users who answer all assessment questions convert at 3.2x the rate of those who drop off.
                    First-time visitors have a 45% higher bounce rate than returning visitors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Leads Over Time</h3>
          <div className="h-64">
            <Line 
              data={getTimeSeriesData()} 
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Campaign Performance</h3>
          <div className="h-64">
            <Bar 
              data={campaignPerformanceData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                      display: true,
                      text: 'Conversion Rate (%)'
                    }
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                      display: true,
                      text: 'Cost per Lead ($)'
                    },
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Lead Sources</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="w-48">
              <Pie 
                data={leadSourceData}
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
        
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">UTM Attribution</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leads</th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conv. Rate</th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {utmAttribution.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.campaign}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.leads}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.conversionRate > 5 ? 'bg-green-100 text-green-800' : 
                        item.conversionRate > 3 ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.conversionRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.roi}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Content Performance */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Content Theme Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content Theme</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement Score</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contentThemes.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.theme}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full" 
                          style={{ width: `${item.engagement}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{item.engagement}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.conversion > 6 ? 'bg-green-100 text-green-800' : 
                      item.conversion > 4 ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.conversion.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900">
                    <button>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Key Takeaways */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Marketing Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <Lightbulb className="h-6 w-6 mb-2" />
            <h4 className="font-semibold text-lg">Content Strategy</h4>
            <p className="text-white/90 mt-2">
              Industry-specific use cases and ROI calculators drive 40% higher engagement.
              Consider creating more vertical-specific content.
            </p>
          </div>
          
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <TrendingUp className="h-6 w-6 mb-2" />
            <h4 className="font-semibold text-lg">Conversion Optimization</h4>
            <p className="text-white/90 mt-2">
              Reducing chat steps from 6 to 5 could improve completion rates by 18% based on current drop-off patterns.
            </p>
          </div>
          
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <Target className="h-6 w-6 mb-2" />
            <h4 className="font-semibold text-lg">Audience Targeting</h4>
            <p className="text-white/90 mt-2">
              Marketing professionals and CTOs show the highest engagement and lead quality. 
              Consider further targeting these segments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingAnalytics;