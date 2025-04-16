import React, { createContext, useState, useContext, ReactNode } from 'react';
import { EnrichedLeadData } from '../components/admin/LeadEnrichmentPanel';

// Define the types for user interactions
export type InteractionType = 
  | 'chat_start' 
  | 'chat_end' 
  | 'question_answered' 
  | 'email_collected'
  | 'lead_qualified'
  | 'recommendation_viewed'
  | 'cta_clicked'
  | 'message_reaction';

export interface UserInteraction {
  id: string;
  type: InteractionType;
  timestamp: Date;
  userId: string;
  data?: Record<string, any>;
  sessionId: string;
}

export interface UserSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  userAgent: string;
  referrer?: string;
  userId: string;
  completedFlow: boolean;
  userProfile?: Record<string, string>;
  leadScore?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  engagementMetrics?: {
    responseTimeAvg?: number;
    dwellTimeTotal?: number;
    clickCount?: number;
    questionCount?: number;
  };
}

interface TrackingContextType {
  interactions: UserInteraction[];
  sessions: UserSession[];
  addInteraction: (type: InteractionType, data?: Record<string, any>) => void;
  startSession: (referrer?: string) => string;
  endSession: (sessionId: string, userProfile?: Record<string, string>, completedFlow?: boolean) => void;
  getSessionById: (sessionId: string) => UserSession | undefined;
  calculateLeadScore: (sessionId: string) => number;
  getAggregatedStats: () => Record<string, any>;
  analyzeSentiment: (sessionId: string) => 'positive' | 'neutral' | 'negative';
  getEngagementMetrics: (sessionId: string) => UserSession['engagementMetrics'];
  getFunnelData: () => Record<string, number>;
  enrichLeadData: (sessionId: string) => EnrichedLeadData;
}

// Create the context
const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

// Mock data generation functions
const generateMockSessions = (): UserSession[] => {
  const sessions: UserSession[] = [];
  
  // Generate 100 mock sessions over the past 30 days
  for (let i = 0; i < 100; i++) {
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - Math.floor(Math.random() * 30));
    startTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    
    const endTime = new Date(startTime);
    // Sessions last between 1 and 15 minutes
    endTime.setMinutes(endTime.getMinutes() + 1 + Math.floor(Math.random() * 14));
    
    const completedFlow = Math.random() > 0.3; // 70% complete the flow
    
    const roles = ['founder', 'technical', 'marketing', 'hr', 'other'];
    const stages = ['starting', 'exploring', 'piloting', 'scaling'];
    const interests = ['support', 'content', 'data', 'other'];
    
    const userProfile = completedFlow ? {
      role: roles[Math.floor(Math.random() * roles.length)],
      journeyStage: stages[Math.floor(Math.random() * stages.length)],
      interest: interests[Math.floor(Math.random() * interests.length)]
    } : undefined;
    
    const leadScore = completedFlow ? Math.floor(Math.random() * 100) : undefined;
    const sentiment = Math.random() > 0.7 ? 'positive' : Math.random() > 0.4 ? 'neutral' : 'negative';
    
    // Add engagement metrics
    const engagementMetrics = {
      responseTimeAvg: 2 + Math.random() * 8,
      dwellTimeTotal: 30 + Math.random() * 300,
      clickCount: Math.floor(Math.random() * 10),
      questionCount: 2 + Math.floor(Math.random() * 5)
    };
    
    sessions.push({
      id: `session-${i}`,
      startTime,
      endTime: completedFlow ? endTime : undefined,
      userAgent: 'Mozilla/5.0 (Mock Browser)',
      referrer: Math.random() > 0.5 ? 'https://google.com' : 'https://linkedin.com',
      userId: `user-${Math.floor(Math.random() * 80)}`, // Some users have multiple sessions
      completedFlow,
      userProfile,
      leadScore,
      sentiment,
      engagementMetrics
    });
  }
  
  return sessions;
};

const generateMockInteractions = (sessions: UserSession[]): UserInteraction[] => {
  const interactions: UserInteraction[] = [];
  const interactionTypes: InteractionType[] = [
    'chat_start', 'chat_end', 'question_answered', 
    'email_collected', 'lead_qualified', 'recommendation_viewed', 'cta_clicked', 'message_reaction'
  ];
  
  sessions.forEach(session => {
    // Every session has a chat_start
    interactions.push({
      id: `interaction-${interactions.length}`,
      type: 'chat_start',
      timestamp: new Date(session.startTime),
      userId: session.userId,
      sessionId: session.id
    });
    
    if (session.completedFlow) {
      // Add some interactions during the session
      const interactionCount = 3 + Math.floor(Math.random() * 10); // 3-12 interactions
      
      for (let i = 0; i < interactionCount; i++) {
        const interactionTime = new Date(session.startTime);
        const progressPercent = i / interactionCount;
        const sessionDuration = session.endTime!.getTime() - session.startTime.getTime();
        
        interactionTime.setTime(session.startTime.getTime() + sessionDuration * progressPercent);
        
        // Most interactions are question_answered
        const type = i === 0 ? 'chat_start' : 
                   i === interactionCount - 1 ? 'chat_end' : 
                   Math.random() > 0.8 ? interactionTypes[Math.floor(Math.random() * interactionTypes.length)] : 
                   'question_answered';
        
        let data: Record<string, any> | undefined;
        
        if (type === 'question_answered') {
          const questionIndices = [1, 2, 3, 4];
          data = { 
            questionIndex: questionIndices[Math.floor(Math.random() * questionIndices.length)],
            answer: 'mock answer'
          };
        } else if (type === 'email_collected') {
          data = { email: `mock-${Math.floor(Math.random() * 1000)}@example.com` };
        } else if (type === 'lead_qualified') {
          data = { 
            email: `mock-${Math.floor(Math.random() * 1000)}@example.com`,
            name: 'Mock User',
            company: 'Mock Company'
          };
        } else if (type === 'cta_clicked') {
          data = { ctaType: Math.random() > 0.5 ? 'schedule_call' : 'download_resources' };
        } else if (type === 'message_reaction') {
          data = { reaction: Math.random() > 0.7 ? 'helpful' : 'not-helpful' };
        }
        
        interactions.push({
          id: `interaction-${interactions.length}`,
          type,
          timestamp: interactionTime,
          userId: session.userId,
          data,
          sessionId: session.id
        });
      }
      
      // Always add a chat_end for completed sessions
      interactions.push({
        id: `interaction-${interactions.length}`,
        type: 'chat_end',
        timestamp: new Date(session.endTime!),
        userId: session.userId,
        sessionId: session.id
      });
    }
  });
  
  return interactions;
};

// Company name mapping based on roles and industries (for enrichment)
const companyNamesByIndustry: Record<string, string[]> = {
  'technical': ['TechCorp', 'DevGenius', 'CodeMasters', 'ByteWorks', 'DataSphere'],
  'marketing': ['BrandBoost', 'MarketMinds', 'VisualVortex', 'EngageMedia', 'ContentCraft'],
  'founder': ['NextGen Innovations', 'Horizon Ventures', 'PrimeStart', 'FoundersFuture', 'ScaleSphere'],
  'hr': ['TalentForce', 'PeopleFirst', 'HRSolutions', 'TeamGrowth', 'CultureBuilders'],
  'other': ['GlobalCorp', 'Enterprise Solutions', 'MetaWorks', 'VisionaryGroup', 'IndustryLeaders']
};

// Technology stacks by interest areas
const techStacksByInterest: Record<string, string[][]> = {
  'support': [
    ['Zendesk', 'Slack', 'Intercom', 'Salesforce'],
    ['Freshdesk', 'Microsoft Teams', 'HubSpot', 'Notion'],
    ['Help Scout', 'Asana', 'Zoom', 'Monday.com'],
  ],
  'content': [
    ['WordPress', 'HubSpot', 'Google Analytics', 'Mailchimp'],
    ['Contentful', 'Adobe Creative Cloud', 'Hootsuite', 'SEMrush'],
    ['Webflow', 'Buffer', 'Canva', 'Ahrefs'],
  ],
  'data': [
    ['Tableau', 'Python', 'SQL', 'AWS'],
    ['PowerBI', 'R', 'MongoDB', 'Azure'],
    ['Looker', 'Snowflake', 'Databricks', 'GCP'],
  ],
  'other': [
    ['Salesforce', 'Slack', 'Microsoft Office', 'Google Workspace'],
    ['Jira', 'Confluence', 'Teams', 'Trello'],
    ['SAP', 'Oracle', 'Netsuite', 'Zoho'],
  ]
};

// Mock enrichment functionality
const generateEnrichedData = (session: UserSession): EnrichedLeadData => {
  const role = session.userProfile?.role || 'other';
  const interest = session.userProfile?.interest || 'other';
  
  // Generate a company name based on role
  const companyNames = companyNamesByIndustry[role] || companyNamesByIndustry.other;
  const companyName = companyNames[Math.floor(Math.random() * companyNames.length)];
  
  // Generate a technology stack
  const techStacks = techStacksByInterest[interest] || techStacksByInterest.other;
  const technologies = techStacks[Math.floor(Math.random() * techStacks.length)];
  
  // Generate random first and last name
  const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Jamie', 'Sam', 'Chris'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Taylor', 'Clark', 'Lewis'];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const fullName = `${firstName} ${lastName}`;
  
  // Generate a title based on role
  let title = '';
  switch (role) {
    case 'founder':
      title = Math.random() > 0.5 ? 'CEO & Founder' : 'Founder & Executive Director';
      break;
    case 'technical':
      title = Math.random() > 0.5 ? 'CTO' : (Math.random() > 0.5 ? 'VP of Engineering' : 'Tech Lead');
      break;
    case 'marketing':
      title = Math.random() > 0.5 ? 'CMO' : (Math.random() > 0.5 ? 'Marketing Director' : 'Growth Lead');
      break;
    case 'hr':
      title = Math.random() > 0.5 ? 'Head of People' : (Math.random() > 0.5 ? 'HR Director' : 'Talent Acquisition Manager');
      break;
    default:
      title = Math.random() > 0.5 ? 'Director' : (Math.random() > 0.5 ? 'Senior Manager' : 'Project Lead');
  }
  
  // Generate company size and revenue based on journey stage
  let size = '';
  let revenue = '';
  let employees = 0;
  switch (session.userProfile?.journeyStage) {
    case 'starting':
      size = '1-10 employees';
      revenue = '$0-1M';
      employees = Math.floor(Math.random() * 10) + 1;
      break;
    case 'exploring':
      size = '11-50 employees';
      revenue = '$1-10M';
      employees = Math.floor(Math.random() * 40) + 11;
      break;
    case 'piloting':
      size = '51-200 employees';
      revenue = '$10-50M';
      employees = Math.floor(Math.random() * 150) + 51;
      break;
    case 'scaling':
      size = '201-1000 employees';
      revenue = '$50-250M';
      employees = Math.floor(Math.random() * 800) + 201;
      break;
    default:
      size = '1-50 employees';
      revenue = '$1-10M';
      employees = Math.floor(Math.random() * 50) + 1;
  }
  
  // Generate enrichment metadata
  const enrichmentSource = Math.random() > 0.5 ? 'Clay' : (Math.random() > 0.5 ? 'Clearbit' : 'ZoomInfo');
  const enrichmentDate = new Date();
  const enrichmentStatus = Math.random() > 0.7 ? 'complete' : (Math.random() > 0.5 ? 'partial' : 'failed');
  const matchConfidence = Math.floor(Math.random() * 30) + 70; // 70-100%
  
  // Generate intent score and buying stage
  const intentScore = Math.floor(Math.random() * 100) + 1;
  let buyingStage: 'Awareness' | 'Consideration' | 'Decision' | 'Unknown' = 'Unknown';
  if (intentScore > 75) buyingStage = 'Decision';
  else if (intentScore > 40) buyingStage = 'Consideration';
  else buyingStage = 'Awareness';
  
  // Generate industry based on interest
  let industry = '';
  switch (interest) {
    case 'support':
      industry = Math.random() > 0.5 ? 'Customer Service' : 'E-commerce';
      break;
    case 'content':
      industry = Math.random() > 0.5 ? 'Media & Entertainment' : 'Marketing & Advertising';
      break;
    case 'data':
      industry = Math.random() > 0.5 ? 'Technology' : 'Financial Services';
      break;
    default:
      industry = Math.random() > 0.5 ? 'Business Services' : 'Retail';
  }
  
  // Generate company description
  const descriptions = [
    `${companyName} is a leading provider of ${industry.toLowerCase()} solutions that help businesses achieve their goals.`,
    `${companyName} builds innovative software for the ${industry.toLowerCase()} industry, serving clients worldwide.`,
    `${companyName} offers cutting-edge services in ${industry.toLowerCase()}, with a focus on customer satisfaction.`,
  ];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  // Generate location
  const locations = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Boston, MA', 'Seattle, WA', 'Chicago, IL'];
  const location = locations[Math.floor(Math.random() * locations.length)];
  
  // Generate company location
  const companyLocations = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Boston, MA', 'Seattle, WA', 'Chicago, IL', 'London, UK', 'Toronto, Canada'];
  const headquarters = companyLocations[Math.floor(Math.random() * companyLocations.length)];
  
  // Generate founding year
  const founded = Math.floor(Math.random() * 20) + 2000; // 2000-2020
  
  // Generate funding amount
  const fundingAmounts = ['Bootstrapped', 'Seed ($1-3M)', 'Series A ($5-15M)', 'Series B ($20-50M)', 'Series C+ ($50M+)'];
  const funding = fundingAmounts[Math.floor(Math.random() * fundingAmounts.length)];
  
  // Generate engagement data
  const firstVisit = new Date(session.startTime);
  firstVisit.setDate(firstVisit.getDate() - Math.floor(Math.random() * 60)); // 0-60 days ago
  
  const visits = Math.floor(Math.random() * 10) + 1; // 1-10 visits
  const pagesViewed = Math.floor(Math.random() * 25) + 1; // 1-25 pages
  
  const resources = [
    'AI Implementation Guide.pdf',
    'ROI Calculator.xlsx',
    'Industry Benchmark Report.pdf',
    'Case Study - AI in Customer Service.pdf',
    'Beginner\'s Guide to Machine Learning.pdf',
    'AI Maturity Assessment.pdf'
  ];
  
  const webinars = [
    'AI for Business Leaders',
    'Implementing Your First AI Use Case',
    'Scaling AI Across the Enterprise',
    'AI Ethics & Compliance',
    'Building Custom AI Agents'
  ];
  
  // Pick a random number of resources the user has downloaded
  const downloadedResources = [];
  const resourcesCount = Math.floor(Math.random() * 3); // 0-2 resources
  for (let i = 0; i < resourcesCount; i++) {
    const resource = resources[Math.floor(Math.random() * resources.length)];
    if (!downloadedResources.includes(resource)) {
      downloadedResources.push(resource);
    }
  }
  
  // Pick a random number of webinars the user has attended
  const webinarsAttended = [];
  const webinarsCount = Math.floor(Math.random() * 2); // 0-1 webinars
  for (let i = 0; i < webinarsCount; i++) {
    const webinar = webinars[Math.floor(Math.random() * webinars.length)];
    if (!webinarsAttended.includes(webinar)) {
      webinarsAttended.push(webinar);
    }
  }
  
  // Generate email engagement metrics
  const emailsOpened = Math.floor(Math.random() * 5); // 0-4 emails opened
  const emailsClicked = emailsOpened > 0 ? Math.floor(Math.random() * emailsOpened) : 0; // 0-emailsOpened clicked
  
  // Calculate chat completion rate
  const chatCompletionRate = session.completedFlow ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 60) + 10; // 80-100% if completed, 10-70% if not
  
  // Create enriched lead data
  return {
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
    name: fullName,
    title,
    location,
    linkedin: `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    twitter: Math.random() > 0.7 ? `https://twitter.com/${firstName.toLowerCase()}${lastName.toLowerCase()}` : undefined,
    lastActive: session.endTime || session.startTime,
    
    company: {
      name: companyName,
      website: `https://www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      industry,
      size,
      funding,
      founded,
      description,
      headquarters,
      linkedinUrl: `https://linkedin.com/company/${companyName.toLowerCase().replace(/\s+/g, '')}`,
      employees,
      revenue,
      technologies
    },
    
    engagement: {
      firstVisit,
      lastVisit: session.endTime || session.startTime,
      visits,
      pagesViewed,
      downloadedResources,
      webinarsAttended,
      emailsOpened,
      emailsClicked,
      chatCompletionRate
    },
    
    intentScore,
    buyingStage,
    
    enrichmentSource,
    enrichmentDate,
    enrichmentStatus,
    matchConfidence
  };
};

// Create the provider component
export const TrackingProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // Initialize with mock data
  const [sessions, setSessions] = useState<UserSession[]>(generateMockSessions());
  const [interactions, setInteractions] = useState<UserInteraction[]>(generateMockInteractions(generateMockSessions()));
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>(`user-${Math.floor(Math.random() * 1000)}`);
  const [enrichedLeads, setEnrichedLeads] = useState<Record<string, EnrichedLeadData>>({});

  const addInteraction = (type: InteractionType, data?: Record<string, any>) => {
    if (!currentSessionId) return;
    
    const newInteraction: UserInteraction = {
      id: `interaction-${Date.now()}`,
      type,
      timestamp: new Date(),
      userId: currentUserId,
      data,
      sessionId: currentSessionId
    };
    
    setInteractions(prev => [...prev, newInteraction]);
    
    // Update engagement metrics based on interaction type
    if (currentSessionId) {
      setSessions(prev => prev.map(session => {
        if (session.id === currentSessionId) {
          const metrics = session.engagementMetrics || {
            responseTimeAvg: 0,
            dwellTimeTotal: 0,
            clickCount: 0,
            questionCount: 0
          };
          
          // Update metrics based on interaction type
          if (type === 'question_answered') {
            metrics.questionCount = (metrics.questionCount || 0) + 1;
          } else if (type === 'cta_clicked') {
            metrics.clickCount = (metrics.clickCount || 0) + 1;
          }
          
          return {
            ...session,
            engagementMetrics: metrics
          };
        }
        return session;
      }));
    }
  };

  const startSession = (referrer?: string): string => {
    const sessionId = `session-${Date.now()}`;
    const newSession: UserSession = {
      id: sessionId,
      startTime: new Date(),
      userAgent: navigator.userAgent,
      referrer,
      userId: currentUserId,
      completedFlow: false,
      engagementMetrics: {
        responseTimeAvg: 0,
        dwellTimeTotal: 0,
        clickCount: 0,
        questionCount: 0
      }
    };
    
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(sessionId);
    
    // Add chat_start interaction
    addInteraction('chat_start');
    
    return sessionId;
  };

  const endSession = (
    sessionId: string, 
    userProfile?: Record<string, string>, 
    completedFlow: boolean = true
  ) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { 
            ...session, 
            endTime: new Date(), 
            completedFlow, 
            userProfile,
            leadScore: calculateLeadScore(sessionId),
            sentiment: analyzeSentiment(sessionId)
          }
        : session
    ));
    
    // Add chat_end interaction
    addInteraction('chat_end');
    
    setCurrentSessionId(null);
  };

  const getSessionById = (sessionId: string): UserSession | undefined => {
    return sessions.find(session => session.id === sessionId);
  };

  const calculateLeadScore = (sessionId: string): number => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return 0;
    
    // Base score
    let score = 30;
    
    // Add points for session interactions
    const sessionInteractions = interactions.filter(interaction => interaction.sessionId === sessionId);
    
    // Add points for conversation completion
    if (session.completedFlow) score += 20;
    
    // Add points for profile completeness
    if (session.userProfile) {
      if (session.userProfile.role) score += 10;
      if (session.userProfile.journeyStage) score += 10;
      if (session.userProfile.interest) score += 10;
    }
    
    // Add points for specific interactions
    const hasEmailCollected = sessionInteractions.some(i => i.type === 'email_collected');
    if (hasEmailCollected) score += 20;
    
    const hasLeadQualified = sessionInteractions.some(i => i.type === 'lead_qualified');
    if (hasLeadQualified) score += 15;
    
    const hasCTAClicked = sessionInteractions.some(i => i.type === 'cta_clicked');
    if (hasCTAClicked) score += 15;
    
    // Score for engagement metrics
    if (session.engagementMetrics) {
      if ((session.engagementMetrics.questionCount || 0) > 3) score += 5;
      if ((session.engagementMetrics.clickCount || 0) > 2) score += 5;
    }
    
    return Math.min(score, 100); // Cap at 100
  };
  
  const analyzeSentiment = (sessionId: string): 'positive' | 'neutral' | 'negative' => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return 'neutral';
    
    // In a real implementation, we would analyze the conversation text
    // For now, we'll determine sentiment based on user behavior
    
    const sessionInteractions = interactions.filter(i => i.sessionId === sessionId);
    
    // Positive indicators
    const completedFlow = session.completedFlow;
    const providedEmail = sessionInteractions.some(i => i.type === 'email_collected');
    const clickedCTA = sessionInteractions.some(i => i.type === 'cta_clicked');
    
    // Count positive signals
    let positiveSignals = 0;
    if (completedFlow) positiveSignals++;
    if (providedEmail) positiveSignals++;
    if (clickedCTA) positiveSignals++;
    
    // Determine sentiment based on signals
    if (positiveSignals >= 2) return 'positive';
    if (positiveSignals === 1) return 'neutral';
    return 'negative';
  };
  
  const getEngagementMetrics = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    return session?.engagementMetrics;
  };
  
  const getFunnelData = () => {
    // Calculate conversion rates through the funnel
    const totalSessions = sessions.length;
    const startedChat = interactions.filter(i => i.type === 'chat_start').length;
    const answeredQuestions = interactions.filter(i => i.type === 'question_answered').length;
    const viewedRecommendations = interactions.filter(i => i.type === 'recommendation_viewed').length;
    const providedEmail = interactions.filter(i => i.type === 'email_collected').length;
    const qualifiedLeads = interactions.filter(i => i.type === 'lead_qualified').length;
    const bookedCalls = interactions.filter(i => 
      i.type === 'cta_clicked' && i.data?.ctaType === 'schedule_call'
    ).length;
    
    return {
      totalSessions,
      startedChat,
      answeredQuestions,
      viewedRecommendations,
      providedEmail,
      qualifiedLeads,
      bookedCalls
    };
  };

  const getAggregatedStats = () => {
    // Total sessions
    const totalSessions = sessions.length;
    
    // Completed sessions
    const completedSessions = sessions.filter(s => s.completedFlow).length;
    
    // Completion rate
    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
    
    // Email capture rate
    const sessionsWithEmail = interactions.filter(i => i.type === 'email_collected')
      .map(i => i.sessionId)
      .filter((v, i, a) => a.indexOf(v) === i).length;
    
    const emailCaptureRate = totalSessions > 0 ? (sessionsWithEmail / totalSessions) * 100 : 0;
    
    // Lead qualification rate
    const qualifiedLeads = interactions.filter(i => i.type === 'lead_qualified')
      .map(i => i.sessionId)
      .filter((v, i, a) => a.indexOf(v) === i).length;
    
    const leadQualificationRate = totalSessions > 0 ? (qualifiedLeads / totalSessions) * 100 : 0;
    
    // Average session duration
    const completedSessionsWithDuration = sessions.filter(s => s.completedFlow && s.endTime);
    const totalDuration = completedSessionsWithDuration.reduce((total, session) => {
      return total + ((session.endTime?.getTime() || 0) - session.startTime.getTime());
    }, 0);
    const averageSessionDuration = completedSessionsWithDuration.length > 0 
      ? totalDuration / completedSessionsWithDuration.length / 1000 / 60 // in minutes
      : 0;
    
    // Sessions by journey stage
    const sessionsByJourneyStage = sessions.reduce((acc: Record<string, number>, session) => {
      const stage = session.userProfile?.journeyStage || 'unknown';
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {});
    
    // Sessions by role
    const sessionsByRole = sessions.reduce((acc: Record<string, number>, session) => {
      const role = session.userProfile?.role || 'unknown';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});
    
    // Sessions by interest
    const sessionsByInterest = sessions.reduce((acc: Record<string, number>, session) => {
      const interest = session.userProfile?.interest || 'unknown';
      acc[interest] = (acc[interest] || 0) + 1;
      return acc;
    }, {});
    
    // Sessions by sentiment
    const sessionsBySentiment = sessions.reduce((acc: Record<string, number>, session) => {
      const sentiment = session.sentiment || 'neutral';
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {});
    
    // High-value leads (score > 70)
    const highValueLeads = sessions.filter(s => (s.leadScore || 0) > 70).length;
    
    // Engagement metrics averages
    const sessionsWithMetrics = sessions.filter(s => s.engagementMetrics);
    const avgResponseTime = sessionsWithMetrics.reduce((sum, s) => 
      sum + (s.engagementMetrics?.responseTimeAvg || 0), 0) / (sessionsWithMetrics.length || 1);
    
    const avgDwellTime = sessionsWithMetrics.reduce((sum, s) => 
      sum + (s.engagementMetrics?.dwellTimeTotal || 0), 0) / (sessionsWithMetrics.length || 1);
    
    return {
      totalSessions,
      completedSessions,
      completionRate,
      emailCaptureRate,
      leadQualificationRate,
      averageSessionDuration,
      sessionsByJourneyStage,
      sessionsByRole,
      sessionsByInterest,
      sessionsBySentiment,
      highValueLeads,
      avgResponseTime,
      avgDwellTime,
      funnel: getFunnelData()
    };
  };

  // Enrichment functionality
  const enrichLeadData = (sessionId: string): EnrichedLeadData => {
    // Check if we already have enriched data for this session
    if (enrichedLeads[sessionId]) {
      return enrichedLeads[sessionId];
    }
    
    // Find the session
    const session = sessions.find(s => s.id === sessionId);
    if (!session) {
      // Return a minimal enriched data object if session not found
      return { email: 'unknown@example.com' };
    }
    
    // Generate enriched data
    const enrichedData = generateEnrichedData(session);
    
    // Store the enriched data
    setEnrichedLeads(prev => ({
      ...prev,
      [sessionId]: enrichedData
    }));
    
    return enrichedData;
  };

  return (
    <TrackingContext.Provider value={{
      interactions,
      sessions,
      addInteraction,
      startSession,
      endSession,
      getSessionById,
      calculateLeadScore,
      getAggregatedStats,
      analyzeSentiment,
      getEngagementMetrics,
      getFunnelData,
      enrichLeadData
    }}>
      {children}
    </TrackingContext.Provider>
  );
};

// Custom hook to use the tracking context
export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (context === undefined) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};