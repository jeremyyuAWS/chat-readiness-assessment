import React, { useState, useEffect, useRef } from 'react';
import { useTracking, UserSession } from '../../context/TrackingContext';
import { 
  Download, 
  MessageSquare, 
  Mail, 
  Calendar, 
  ExternalLink, 
  ChevronDown, 
  Users, 
  Trophy, 
  Search, 
  Database, 
  Layers, 
  Filter, 
  Tag, 
  Building, 
  BarChart2, 
  UserCheck,
  AlertTriangle,
  Info,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import LeadEnrichmentPanel, { EnrichedLeadData } from './LeadEnrichmentPanel';

const LeadManagement: React.FC = () => {
  const { sessions, enrichLeadData } = useTracking();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [showEnrichment, setShowEnrichment] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichedData, setEnrichedData] = useState<EnrichedLeadData | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);

  // Ref to access DOM elements directly if needed
  const tableRef = useRef<HTMLTableElement>(null);
  
  // Auto-select the first lead when the component mounts
  useEffect(() => {
    if (sessions.length > 0 && !selectedLead) {
      const firstLead = sessions.find(session => session.userProfile)?.id;
      if (firstLead) {
        handleEnrichLead(firstLead);
      } else {
        setShowNoDataMessage(true);
      }
    } else if (sessions.length === 0) {
      setShowNoDataMessage(true);
    }
  }, [sessions]);
  
  // Filter sessions with some profile data (these are our leads)
  const leads = sessions.filter(session => session.userProfile);
  
  // Apply filters
  const filteredLeads = leads.filter(lead => {
    // Score filter
    if (filter !== 'all') {
      if (filter === 'high-value' && (lead.leadScore || 0) < 70) return false;
      if (filter === 'medium-value' && ((lead.leadScore || 0) < 40 || (lead.leadScore || 0) >= 70)) return false;
      if (filter === 'low-value' && (lead.leadScore || 0) >= 40) return false;
    }
    
    // Additional filter conditions can be added here
    
    return true;
  });
  
  // Apply sorting
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? a.startTime.getTime() - b.startTime.getTime()
        : b.startTime.getTime() - a.startTime.getTime();
    } else if (sortBy === 'score') {
      const scoreA = a.leadScore || 0;
      const scoreB = b.leadScore || 0;
      return sortOrder === 'asc' ? scoreA - scoreB : scoreB - scoreA;
    }
    return 0;
  });
  
  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-200 text-gray-800';
    if (score >= 70) return 'bg-green-100 text-green-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  const getRoleEmoji = (role?: string) => {
    if (!role) return '👤';
    switch (role) {
      case 'founder': return '👑';
      case 'technical': return '🔧';
      case 'marketing': return '📢';
      case 'hr': return '👥';
      default: return '👤';
    }
  };
  
  const getRoleIcon = (role?: string) => {
    if (!role) return <Users className="h-4 w-4" />;
    switch (role) {
      case 'founder': return <Trophy className="h-4 w-4 text-yellow-600" />;
      case 'technical': return <BarChart2 className="h-4 w-4 text-blue-600" />;
      case 'marketing': return <Tag className="h-4 w-4 text-pink-600" />;
      case 'hr': return <UserCheck className="h-4 w-4 text-green-600" />;
      default: return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleEnrichLead = (sessionId: string, event?: React.MouseEvent) => {
    // If it's an event from a button click, stop propagation
    if (event) {
      event.stopPropagation();
    }

    console.log('Enriching lead:', sessionId);

    // If this lead is already selected and showing enrichment, just return
    if (selectedLead === sessionId && showEnrichment) {
      return;
    }

    setSelectedLead(sessionId);
    setShowEnrichment(true);
    setIsEnriching(true);
    
    // Simulate API call to enrichment service
    setTimeout(() => {
      const lead = leads.find(lead => lead.id === sessionId);
      if (lead) {
        const enriched = enrichLeadData(sessionId);
        
        setEnrichedData({
          ...enriched,
          engagement: {
            ...enriched.engagement!,
            lastVisit: new Date(),
            productsViewed: ['AI Readiness Assessment', 'Custom AI Agents', 'Enterprise Solutions'],
            conversionPath: [
              'First visited homepage',
              'Viewed AI Readiness Assessment',
              'Started chat conversation',
              'Completed assessment',
              'Downloaded resource',
              'Viewed pricing page'
            ],
            averageTimeOnSite: Math.floor(Math.random() * 8) + 2 // 2-10 minutes
          },
          buyingSignals: [
            { 
              topic: 'AI Implementation', 
              strength: Math.floor(Math.random() * 40) + 60 
            },
            { 
              topic: 'ROI Calculation', 
              strength: Math.floor(Math.random() * 50) + 30 
            },
            { 
              topic: 'Integration Concerns', 
              strength: Math.floor(Math.random() * 40) + 20 
            },
          ],
          previousCompanies: [
            Math.random() > 0.5 ? 'Acme Corp' : 'Globex Industries',
            Math.random() > 0.5 ? 'Tech Innovators' : 'Future Systems'
          ],
          skills: [
            'Artificial Intelligence',
            'Product Management',
            'Strategic Planning',
            'Team Leadership'
          ],
          bio: `Experienced ${enriched.title} with a passion for implementing innovative solutions. Focused on driving business growth through technology adoption.`,
          education: ['MBA, Business School', 'BS Computer Science, Tech University'],
          company: {
            ...enriched.company!,
            competitors: ['Competitor A', 'Competitor B', 'Competitor C'],
            customers: ['Customer X', 'Customer Y', 'Customer Z', 'Another Customer'],
            growthStage: ['Early Stage', 'Growth Phase', 'Mature', 'Expansion'][Math.floor(Math.random() * 4)]
          },
          financials: {
            annualRevenue: enriched.company?.revenue,
            growthRate: `${Math.floor(Math.random() * 30) + 5}% YoY`,
            publicCompany: Math.random() > 0.8,
            stockSymbol: Math.random() > 0.8 ? 'SYMB' : undefined,
            fundingRounds: Math.random() > 0.6 ? [
              {
                date: 'Jun 2022',
                amount: 'Series A - $12M',
                investors: ['Sequoia Capital', 'Andreessen Horowitz']
              },
              {
                date: 'Aug 2021',
                amount: 'Seed - $3M',
                investors: ['Y Combinator', 'Angel Investors']
              }
            ] : []
          },
          opportunity: {
            estimatedDealSize: `$${(Math.floor(Math.random() * 95) + 5) * 1000}`,
            winProbability: Math.floor(Math.random() * 60) + 20,
            estimatedCloseDate: new Date(new Date().setDate(new Date().getDate() + Math.floor(Math.random() * 90) + 30)),
            recommendedProducts: ['AI Readiness Assessment', 'Custom AI Agents', 'Implementation Services'],
            decisionMakers: [
              `${enriched.name}`,
              `CTO at ${enriched.company?.name}`,
              `Head of Innovation at ${enriched.company?.name}`
            ]
          }
        });
        
        setIsEnriching(false);
      }
    }, 1200);
  };

  const handleCloseEnrichment = () => {
    setShowEnrichment(false);
    setSelectedLead(null);
    setEnrichedData(null);
  };

  const handleBatchEnrichment = () => {
    // This would call the API to enrich all leads
    alert('Started batch enrichment process for all leads. This will take a few minutes.');
  };

  // Render a direct "click here" message for the first lead if no lead is currently selected
  const renderClickablePrompt = () => {
    if (sortedLeads.length > 0 && !selectedLead && !showEnrichment) {
      const firstLead = sortedLeads[0];
      return (
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{pointerEvents: 'none'}}
        >
          <div className="bg-indigo-100 rounded-lg p-3 shadow-lg border border-indigo-300 text-center max-w-xs">
            <AlertTriangle className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-indigo-800">
              Click on a lead row to view detailed information
            </p>
            <div className="mt-2">
              <svg className="h-8 w-8 text-indigo-500 mx-auto animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-indigo-100 text-indigo-600 mr-3 flex-shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Leads</h3>
              <p className="text-2xl font-bold text-gray-800">{leads.length}</p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-green-100 text-green-600 mr-3 flex-shrink-0">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">High Value Leads</h3>
              <p className="text-2xl font-bold text-gray-800">
                {leads.filter(lead => (lead.leadScore || 0) >= 70).length}
              </p>
              <p className="text-xs text-green-600 mt-1">+24% from last month</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-blue-100 text-blue-600 mr-3 flex-shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email Collected</h3>
              <p className="text-2xl font-bold text-gray-800">
                {leads.length > 0 ? Math.floor(leads.length * 0.65) : 0}
              </p>
              <p className="text-xs text-green-600 mt-1">+8% from last month</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-yellow-100 text-yellow-600 mr-3 flex-shrink-0">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Companies</h3>
              <p className="text-2xl font-bold text-gray-800">
                {Math.ceil(leads.length * 0.7)}
              </p>
              <p className="text-xs text-green-600 mt-1">+15% from last month</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                filter === 'all' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Leads
            </button>
            <button
              onClick={() => setFilter('high-value')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                filter === 'high-value' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              High Value
            </button>
            <button
              onClick={() => setFilter('medium-value')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                filter === 'medium-value' 
                  ? 'bg-yellow-100 text-yellow-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Medium Value
            </button>
            <button
              onClick={() => setFilter('low-value')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                filter === 'low-value' 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Low Value
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center ml-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-100"
            >
              <Filter className="h-4 w-4 mr-1.5" />
              Advanced Filters
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search leads..."
                className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
              />
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex border border-gray-200 rounded-md">
              <button 
                onClick={() => setViewMode('list')}
                className={`px-2 py-1.5 ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-700' : 'bg-white text-gray-500'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-2 py-1.5 ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-700' : 'bg-white text-gray-500'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </button>
            </div>
            
            <button 
              onClick={handleBatchEnrichment}
              className="inline-flex items-center px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Database className="h-4 w-4 mr-1.5" />
              <span>Batch Enrich</span>
            </button>
            
            <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Lead Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md text-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="new">New Lead</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="unqualified">Unqualified</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Industry</label>
              <select 
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md text-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Industries</option>
                <option value="technology">Technology</option>
                <option value="financial">Financial Services</option>
                <option value="healthcare">Healthcare</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manufacturing</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">AI Journey Stage</label>
              <select 
                className="w-full border border-gray-300 rounded-md text-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Stages</option>
                <option value="starting">Just Starting</option>
                <option value="exploring">Exploring</option>
                <option value="piloting">Piloting</option>
                <option value="scaling">Scaling</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Table/Grid */}
        <div className={`${showEnrichment ? 'lg:col-span-2' : 'lg:col-span-3'} relative`}>
          {/* Click Me Prompt */}
          {renderClickablePrompt()}
          
          {viewMode === 'list' ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-700">Chat-Generated Leads</h3>
                  
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="date">Sort by Date</option>
                        <option value="score">Sort by Score</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                    
                    <div className="relative">
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            
              <div className="overflow-x-auto">
                <table ref={tableRef} className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Score</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedLeads.map((lead) => (
                      <tr 
                        key={lead.id} 
                        className={`hover:bg-indigo-50 transition-colors cursor-pointer ${
                          selectedLead === lead.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                        }`}
                        onClick={() => handleEnrichLead(lead.id)}
                        data-testid={`lead-row-${lead.id}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
                              {getRoleEmoji(lead.userProfile?.role)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {!enrichedData ? `User ${lead.userId.split('-')[1]}` : 
                                  selectedLead === lead.id && enrichedData ? enrichedData.name : 
                                  `User ${lead.userId.split('-')[1]}`
                                }
                              </div>
                              <div className="text-sm text-indigo-600">
                                {selectedLead === lead.id && enrichedData ? (
                                  enrichedData.title
                                ) : (
                                  <>
                                    {lead.userProfile?.role === 'founder' && 'CEO/Founder'}
                                    {lead.userProfile?.role === 'technical' && 'Technical Leader'}
                                    {lead.userProfile?.role === 'marketing' && 'Marketing Executive'}
                                    {lead.userProfile?.role === 'hr' && 'HR Professional'}
                                    {lead.userProfile?.role === 'other' && 'Business Professional'}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-1">
                            <div className="text-xs">
                              <span className="font-medium text-gray-500">AI Journey:</span>{' '}
                              <span className="text-gray-900">
                                {lead.userProfile?.journeyStage === 'starting' && 'Just Starting'}
                                {lead.userProfile?.journeyStage === 'exploring' && 'Exploring Options'}
                                {lead.userProfile?.journeyStage === 'piloting' && 'Piloting Use Cases'}
                                {lead.userProfile?.journeyStage === 'scaling' && 'Scaling Implementation'}
                              </span>
                            </div>
                            <div className="text-xs">
                              <span className="font-medium text-gray-500">Interest:</span>{' '}
                              <span className="text-gray-900">
                                {lead.userProfile?.interest === 'support' && 'Customer Support'}
                                {lead.userProfile?.interest === 'content' && 'Marketing & Content'}
                                {lead.userProfile?.interest === 'data' && 'Data Analysis'}
                                {lead.userProfile?.interest === 'other' && 'Other Areas'}
                              </span>
                            </div>
                            <div className="text-xs">
                              <span className="font-medium text-gray-500">Company:</span>{' '}
                              <span className="text-gray-900">
                                {selectedLead === lead.id && enrichedData?.company 
                                  ? enrichedData.company.name 
                                  : 'Unknown Company'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(lead.startTime), 'MMM d, yyyy')}
                          <div className="text-xs text-gray-400">
                            {format(new Date(lead.startTime), 'h:mm a')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getScoreColor(lead.leadScore)}`}>
                            {lead.leadScore || 0}/100
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                            {/* NEW LEAD DETAILS BUTTON */}
                            <button 
                              className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-2.5 py-1 rounded-md flex items-center text-xs font-medium transition-colors"
                              onClick={(e) => handleEnrichLead(lead.id, e)}
                              title="View full lead details"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              View Details
                            </button>
                            <button 
                              className={`text-indigo-600 hover:bg-indigo-100 p-1 rounded-full ${selectedLead === lead.id && showEnrichment ? 'bg-indigo-100' : ''}`}
                              onClick={(e) => handleEnrichLead(lead.id, e)}
                              title="Enrich lead data"
                            >
                              <Layers className="h-4 w-4" />
                            </button>
                            <button className="text-indigo-600 hover:bg-indigo-100 p-1 rounded-full" title="Message lead">
                              <MessageSquare className="h-4 w-4" />
                            </button>
                            <button className="text-indigo-600 hover:bg-indigo-100 p-1 rounded-full" title="Email lead">
                              <Mail className="h-4 w-4" />
                            </button>
                            <button className="text-indigo-600 hover:bg-indigo-100 p-1 rounded-full" title="Schedule call">
                              <Calendar className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {sortedLeads.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-gray-500">No leads match your filter criteria.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-700">Chat-Generated Leads</h3>
                  
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="date">Sort by Date</option>
                        <option value="score">Sort by Score</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedLeads.map((lead) => (
                    <div 
                      key={lead.id} 
                      className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
                        selectedLead === lead.id ? 'ring-2 ring-indigo-500 bg-indigo-50 border-indigo-300' : 'border-gray-200 hover:border-indigo-300'
                      }`}
                      onClick={() => handleEnrichLead(lead.id)}
                      data-testid={`lead-card-${lead.id}`}
                    >
                      <div className="p-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
                            {getRoleEmoji(lead.userProfile?.role)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {!enrichedData ? `User ${lead.userId.split('-')[1]}` : 
                                selectedLead === lead.id && enrichedData ? enrichedData.name : 
                                `User ${lead.userId.split('-')[1]}`
                              }
                            </div>
                            <div className="text-xs text-indigo-600">
                              {selectedLead === lead.id && enrichedData ? (
                                enrichedData.title
                              ) : (
                                <>
                                  {lead.userProfile?.role === 'founder' && 'CEO/Founder'}
                                  {lead.userProfile?.role === 'technical' && 'Technical Leader'}
                                  {lead.userProfile?.role === 'marketing' && 'Marketing Executive'}
                                  {lead.userProfile?.role === 'hr' && 'HR Professional'}
                                  {lead.userProfile?.role === 'other' && 'Business Professional'}
                                </>
                              )}
                            </div>
                            {selectedLead === lead.id && enrichedData?.company && (
                              <div className="text-xs text-gray-500 mt-0.5 flex items-center">
                                <Building className="h-3 w-3 mr-1" />
                                {enrichedData.company.name}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-3 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">Lead Score:</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getScoreColor(lead.leadScore)}`}>
                              {lead.leadScore || 0}/100
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">Journey Stage:</span>
                            <span className="text-xs">
                              {lead.userProfile?.journeyStage === 'starting' && 'Just Starting'}
                              {lead.userProfile?.journeyStage === 'exploring' && 'Exploring Options'}
                              {lead.userProfile?.journeyStage === 'piloting' && 'Piloting Use Cases'}
                              {lead.userProfile?.journeyStage === 'scaling' && 'Scaling Implementation'}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">Date Added:</span>
                            <span className="text-xs">{format(new Date(lead.startTime), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          {/* NEW LEAD DETAILS BUTTON */}
                          <button
                            className="w-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 py-1.5 rounded-md flex items-center justify-center text-xs font-medium transition-colors mb-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnrichLead(lead.id, e);
                            }}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                            View Lead Details
                          </button>
                          
                          <div className="flex justify-between">
                            <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                              <button 
                                className={`p-1 rounded-full hover:bg-indigo-100 ${selectedLead === lead.id && showEnrichment ? 'bg-indigo-100 text-indigo-700' : 'text-indigo-600'}`}
                                onClick={(e) => handleEnrichLead(lead.id, e)}
                                title="Enrich lead data"
                              >
                                <Layers className="h-4 w-4" />
                              </button>
                              <button className="p-1 rounded-full text-indigo-600 hover:bg-indigo-100" title="Message lead">
                                <MessageSquare className="h-4 w-4" />
                              </button>
                              <button className="p-1 rounded-full text-indigo-600 hover:bg-indigo-100" title="Email lead">
                                <Mail className="h-4 w-4" />
                              </button>
                              <button className="p-1 rounded-full text-indigo-600 hover:bg-indigo-100" title="Schedule call">
                                <Calendar className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <div className="flex items-center">
                              {getRoleIcon(lead.userProfile?.role)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {sortedLeads.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-gray-500">No leads match your filter criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Enrichment Panel */}
        {showEnrichment && (
          <div className="lg:col-span-1">
            <LeadEnrichmentPanel 
              lead={enrichedData || {email: 'loading@example.com'}} 
              isLoading={isEnriching}
              onClose={handleCloseEnrichment}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadManagement;