import React from 'react';
import { X, ExternalLink, Mail, Layers, Building, Calendar, Clock, User, PhoneCall, BarChart, Target, DollarSign, TrendingUp, Award } from 'lucide-react';
import { format } from 'date-fns';

type FundingRound = {
  date: string;
  amount: string;
  investors: string[];
};

export interface EnrichedLeadData {
  email: string;
  name?: string;
  title?: string;
  location?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  lastActive?: Date;
  
  // Professional background
  previousCompanies?: string[];
  skills?: string[];
  bio?: string;
  education?: string[];
  
  // Company info
  company?: {
    name: string;
    website?: string;
    industry?: string;
    size?: string;
    revenue?: string;
    founded?: number;
    description?: string;
    headquarters?: string;
    linkedinUrl?: string;
    employees?: number;
    technologies?: string[];
    competitors?: string[];
    customers?: string[];
    growthStage?: string;
  };
  
  // Financial info
  financials?: {
    annualRevenue?: string;
    growthRate?: string;
    publicCompany?: boolean;
    stockSymbol?: string;
    fundingRounds?: FundingRound[];
  };
  
  // Engagement data
  engagement?: {
    firstVisit?: Date;
    lastVisit?: Date;
    visits?: number;
    pagesViewed?: number;
    productsViewed?: string[];
    downloadedResources?: string[];
    webinarsAttended?: string[];
    emailsOpened?: number;
    emailsClicked?: number;
    chatCompletionRate?: number;
    conversionPath?: string[];
    averageTimeOnSite?: number;
  };
  
  // Intent scoring
  intentScore?: number;
  buyingStage?: 'Awareness' | 'Consideration' | 'Decision' | 'Unknown';
  buyingSignals?: Array<{
    topic: string;
    strength: number;
  }>;
  
  // Sales opportunity
  opportunity?: {
    estimatedDealSize?: string;
    winProbability?: number;
    estimatedCloseDate?: Date;
    recommendedProducts?: string[];
    decisionMakers?: string[];
  };
  
  // Enrichment metadata
  enrichmentSource?: string;
  enrichmentDate?: Date;
  enrichmentStatus?: 'complete' | 'partial' | 'failed';
  matchConfidence?: number;
}

interface LeadEnrichmentPanelProps {
  lead: EnrichedLeadData;
  isLoading?: boolean;
  onClose: () => void;
}

const LeadEnrichmentPanel: React.FC<LeadEnrichmentPanelProps> = ({ lead, isLoading = false, onClose }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-700 flex items-center">
            <Layers className="h-4 w-4 text-indigo-600 mr-2" /> 
            Lead Enrichment
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex justify-center items-center h-96">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
            <p className="text-gray-600">Loading lead data...</p>
            <p className="text-xs text-gray-500 mt-2">Enriching lead profile from external sources...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-700 flex items-center">
            <Layers className="h-4 w-4 text-indigo-600 mr-2" /> 
            Lead Enrichment
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Enrichment metadata */}
        {lead.enrichmentSource && (
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-2">Source: {lead.enrichmentSource}</span>
              {lead.matchConfidence && (
                <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full text-xs">
                  {lead.matchConfidence}% confidence
                </span>
              )}
            </div>
            
            {lead.enrichmentDate && (
              <div className="text-xs text-gray-500">
                Updated {format(lead.enrichmentDate, 'MMM d, yyyy')}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-6">
        {/* Person Summary */}
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center text-3xl text-indigo-600">
              {lead.name ? lead.name.charAt(0) : '?'}
            </div>
            
            <div className="ml-4">
              <h4 className="font-medium text-lg text-gray-900">{lead.name || 'Unknown Name'}</h4>
              <div className="text-sm text-indigo-700">{lead.title || 'Unknown Position'}</div>
              
              <div className="flex mt-2 space-x-3">
                {lead.linkedin && (
                  <a 
                    href={lead.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM8 19H5V8h3v11zM6.5 6.73c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zM20 19h-3v-5.6c0-1.95-.45-3.4-2.75-3.4-1.65 0-2.25 1.2-2.25 2.4V19h-3V8h3v.95c.57-.82 1.65-1.45 3.25-1.45 2.5 0 4.75 1.65 4.75 5.5V19z" />
                    </svg>
                  </a>
                )}
                
                {lead.email && (
                  <a 
                    href={`mailto:${lead.email}`}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                )}
                
                {lead.twitter && (
                  <a 
                    href={lead.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.954 4.569a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.691 8.094 4.066 6.13 1.64 3.161a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {lead.bio && (
            <div className="mt-4 text-sm text-gray-600">
              {lead.bio}
            </div>
          )}
          
          {/* Additional person details */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {lead.location && (
              <div className="text-sm">
                <span className="text-gray-500 font-medium">Location:</span>{' '}
                <span className="text-gray-700">{lead.location}</span>
              </div>
            )}
            
            {lead.phone && (
              <div className="text-sm">
                <span className="text-gray-500 font-medium">Phone:</span>{' '}
                <span className="text-gray-700">{lead.phone}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Buying Intent */}
        {(lead.intentScore !== undefined || lead.buyingStage) && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-800 mb-3 flex items-center">
              <Target className="h-4 w-4 text-indigo-600 mr-2" />
              Buying Intent
            </h5>
            
            <div className="grid grid-cols-2 gap-4">
              {lead.intentScore !== undefined && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Intent Score</div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div 
                        className={`h-2.5 rounded-full ${
                          lead.intentScore > 70 ? 'bg-green-600' : 
                          lead.intentScore > 40 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{width: `${lead.intentScore}%`}}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{lead.intentScore}/100</span>
                  </div>
                </div>
              )}
              
              {lead.buyingStage && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Buying Stage</div>
                  <span 
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      lead.buyingStage === 'Decision' ? 'bg-green-100 text-green-800' : 
                      lead.buyingStage === 'Consideration' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {lead.buyingStage}
                  </span>
                </div>
              )}
            </div>
            
            {/* Buying signals */}
            {lead.buyingSignals && lead.buyingSignals.length > 0 && (
              <div className="mt-4">
                <h6 className="text-xs font-medium text-gray-600 mb-2">Detected Buying Signals</h6>
                <div className="space-y-2">
                  {lead.buyingSignals.map((signal, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{signal.topic}</span>
                        <span>{signal.strength}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            signal.strength > 70 ? 'bg-green-500' : 
                            signal.strength > 40 ? 'bg-yellow-500' : 
                            'bg-blue-500'
                          }`}
                          style={{width: `${signal.strength}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Company Information */}
        {lead.company && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-800 mb-3 flex items-center">
              <Building className="h-4 w-4 text-indigo-600 mr-2" />
              Company Information
            </h5>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <h6 className="font-medium text-gray-700">{lead.company.name}</h6>
                  {lead.company.website && (
                    <a 
                      href={lead.company.website}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 text-xs"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                
                {lead.company.description && (
                  <p className="text-sm text-gray-600 mt-1">{lead.company.description}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                {lead.company.industry && (
                  <div>
                    <span className="text-gray-500">Industry:</span>{' '}
                    <span className="text-gray-800">{lead.company.industry}</span>
                  </div>
                )}
                
                {lead.company.size && (
                  <div>
                    <span className="text-gray-500">Size:</span>{' '}
                    <span className="text-gray-800">{lead.company.size}</span>
                  </div>
                )}
                
                {lead.company.founded && (
                  <div>
                    <span className="text-gray-500">Founded:</span>{' '}
                    <span className="text-gray-800">{lead.company.founded}</span>
                  </div>
                )}
                
                {lead.company.headquarters && (
                  <div>
                    <span className="text-gray-500">HQ:</span>{' '}
                    <span className="text-gray-800">{lead.company.headquarters}</span>
                  </div>
                )}
                
                {lead.company.revenue && (
                  <div>
                    <span className="text-gray-500">Revenue:</span>{' '}
                    <span className="text-gray-800">{lead.company.revenue}</span>
                  </div>
                )}
                
                {lead.company.employees && (
                  <div>
                    <span className="text-gray-500">Employees:</span>{' '}
                    <span className="text-gray-800">{lead.company.employees}</span>
                  </div>
                )}
              </div>
              
              {/* Tech Stack */}
              {lead.company.technologies && lead.company.technologies.length > 0 && (
                <div className="mt-2">
                  <h6 className="text-xs font-medium text-gray-600 mb-2">Technologies</h6>
                  <div className="flex flex-wrap gap-2">
                    {lead.company.technologies.map((tech, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Growth Stage */}
              {lead.company.growthStage && (
                <div>
                  <h6 className="text-xs font-medium text-gray-600 mb-1">Company Stage</h6>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                    {lead.company.growthStage}
                  </span>
                </div>
              )}
              
              {/* Competitors */}
              {lead.company.competitors && lead.company.competitors.length > 0 && (
                <div>
                  <h6 className="text-xs font-medium text-gray-600 mb-1">Competitors</h6>
                  <p className="text-sm text-gray-700">
                    {lead.company.competitors.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Funding Information */}
        {lead.financials?.fundingRounds && lead.financials.fundingRounds.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-800 mb-3 flex items-center">
              <DollarSign className="h-4 w-4 text-indigo-600 mr-2" />
              Funding History
            </h5>
            
            <div className="space-y-3">
              {lead.financials.fundingRounds.map((round, index) => (
                <div key={index} className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{round.amount}</span>
                    <span className="text-xs text-gray-500">{round.date}</span>
                  </div>
                  {round.investors && (
                    <div className="text-xs text-gray-600 mt-1">
                      Investors: {round.investors.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
              {lead.financials.growthRate && (
                <div>
                  <span className="text-gray-500">Growth:</span>{' '}
                  <span className="text-green-600">{lead.financials.growthRate}</span>
                </div>
              )}
              
              {lead.financials.publicCompany !== undefined && (
                <div>
                  <span className="text-gray-500">Public:</span>{' '}
                  <span className="text-gray-700">{lead.financials.publicCompany ? 'Yes' : 'No'}</span>
                  {lead.financials.stockSymbol && (
                    <span className="ml-1 text-indigo-600">({lead.financials.stockSymbol})</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Engagement Data */}
        {lead.engagement && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-800 mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 text-indigo-600 mr-2" />
              Engagement History
            </h5>
            
            <div className="space-y-4">
              {/* Visit Data */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-indigo-600">{lead.engagement.visits || 0}</div>
                  <div className="text-xs text-gray-500">Total Visits</div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-indigo-600">{lead.engagement.pagesViewed || 0}</div>
                  <div className="text-xs text-gray-500">Pages Viewed</div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-indigo-600">{lead.engagement.averageTimeOnSite || 0}m</div>
                  <div className="text-xs text-gray-500">Avg. Time</div>
                </div>
              </div>
              
              {/* First/Last Visit */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {lead.engagement.firstVisit && (
                  <div>
                    <span className="text-gray-500">First visit:</span>{' '}
                    <span className="text-gray-800">{format(new Date(lead.engagement.firstVisit), 'MMM d, yyyy')}</span>
                  </div>
                )}
                
                {lead.engagement.lastVisit && (
                  <div>
                    <span className="text-gray-500">Last visit:</span>{' '}
                    <span className="text-gray-800">{format(new Date(lead.engagement.lastVisit), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
              
              {/* Products Viewed */}
              {lead.engagement.productsViewed && lead.engagement.productsViewed.length > 0 && (
                <div>
                  <h6 className="text-xs font-medium text-gray-600 mb-1">Products Viewed</h6>
                  <div className="flex flex-wrap gap-2">
                    {lead.engagement.productsViewed.map((product, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Downloaded Resources */}
              {lead.engagement.downloadedResources && lead.engagement.downloadedResources.length > 0 && (
                <div>
                  <h6 className="text-xs font-medium text-gray-600 mb-1">Downloaded Resources</h6>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {lead.engagement.downloadedResources.map((resource, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="h-3 w-3 text-green-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        {resource}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Conversion Path */}
              {lead.engagement.conversionPath && lead.engagement.conversionPath.length > 0 && (
                <div>
                  <h6 className="text-xs font-medium text-gray-600 mb-1">User Journey</h6>
                  <ol className="relative border-l border-gray-200 ml-2 space-y-2">
                    {lead.engagement.conversionPath.map((step, index) => (
                      <li key={index} className="mb-4 ml-4">
                        <div className="absolute w-3 h-3 bg-indigo-200 rounded-full mt-1 -left-1.5 border border-white"></div>
                        <p className="text-xs text-gray-700">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              
              {/* Chat Completion Rate */}
              {lead.engagement.chatCompletionRate !== undefined && (
                <div>
                  <h6 className="text-xs font-medium text-gray-600 mb-1">Chat Completion Rate</h6>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${
                          lead.engagement.chatCompletionRate > 80 ? 'bg-green-500' : 
                          lead.engagement.chatCompletionRate > 50 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`} 
                        style={{width: `${lead.engagement.chatCompletionRate}%`}}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">{lead.engagement.chatCompletionRate}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Sales Opportunity */}
        {lead.opportunity && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-800 mb-3 flex items-center">
              <Award className="h-4 w-4 text-indigo-600 mr-2" />
              Sales Opportunity
            </h5>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {lead.opportunity.estimatedDealSize && (
                  <div>
                    <span className="text-gray-500">Est. Deal Size:</span>{' '}
                    <span className="text-gray-800 font-medium">{lead.opportunity.estimatedDealSize}</span>
                  </div>
                )}
                
                {lead.opportunity.winProbability !== undefined && (
                  <div>
                    <span className="text-gray-500">Win Probability:</span>{' '}
                    <span 
                      className={`font-medium ${
                        lead.opportunity.winProbability > 70 ? 'text-green-600' : 
                        lead.opportunity.winProbability > 40 ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}
                    >
                      {lead.opportunity.winProbability}%
                    </span>
                  </div>
                )}
                
                {lead.opportunity.estimatedCloseDate && (
                  <div>
                    <span className="text-gray-500">Est. Close Date:</span>{' '}
                    <span className="text-gray-800">{format(new Date(lead.opportunity.estimatedCloseDate), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
              
              {/* Recommended Products */}
              {lead.opportunity.recommendedProducts && lead.opportunity.recommendedProducts.length > 0 && (
                <div>
                  <h6 className="text-xs font-medium text-gray-600 mb-1">Recommended Products</h6>
                  <div className="flex flex-wrap gap-2">
                    {lead.opportunity.recommendedProducts.map((product, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Key Decision Makers */}
              {lead.opportunity.decisionMakers && lead.opportunity.decisionMakers.length > 0 && (
                <div>
                  <h6 className="text-xs font-medium text-gray-600 mb-1">Key Decision Makers</h6>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {lead.opportunity.decisionMakers.map((person, index) => (
                      <li key={index} className="flex items-center">
                        <User className="h-3 w-3 text-gray-500 mr-1" />
                        {person}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button 
            className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            <Mail className="h-4 w-4 mr-1.5" />
            Email Lead
          </button>
          
          <button 
            className="flex items-center justify-center border border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            <PhoneCall className="h-4 w-4 mr-1.5" />
            Schedule Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadEnrichmentPanel;