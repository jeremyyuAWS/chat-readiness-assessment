export interface AgentMessage {
  content: string;
  responseType?: 'text' | 'multiChoice';
  choices?: string[];
}

export interface AgentResponse {
  content: string;
  responseType?: 'text' | 'multiChoice';
  choices?: string[];
  final?: boolean;
  tag?: string;
  value?: string;
  recommendations?: Recommendation[];
}

export interface UseCase {
  title: string;
  description: string;
  link: string;
  priority: number; // Higher number = higher priority
}

export interface Resource {
  title: string;
  description: string;
  link: string;
  type: 'tutorial' | 'blog' | 'demo' | 'template' | 'webinar';
  popularity: number; // Higher number = more popular
}

export interface CompetitorAnalysis {
  name: string;
  strengths: string[];
  weaknesses: string[];
}

export interface IndustryInsight {
  title: string;
  insight: string;
}

export interface Recommendation {
  maturityScore: number;
  maturityInsight: string;
  useCases: UseCase[];
  resources: Resource[];
  nextSteps: string[];
  industryInsights?: IndustryInsight[];
  competitorAnalysis?: CompetitorAnalysis[];
  estimatedTimeToValue?: string;
  estimatedCost?: string;
  implementationDifficulty?: 'Low' | 'Medium' | 'High';
}

// Pre-defined agent messages
export const agentMessages: AgentMessage[] = [
  {
    content: "Hi there 👋 Ready to explore how AI fits into your journey?",
    responseType: 'text'
  },
  {
    content: "Great! What best describes your current AI journey?",
    responseType: 'multiChoice',
    choices: [
      "Just Starting - New to AI implementation",
      "Exploring - Researching potential applications",
      "Piloting - Testing specific use cases",
      "Scaling - Expanding existing AI solutions"
    ]
  },
  {
    content: "Thanks for sharing! What's your role?",
    responseType: 'multiChoice',
    choices: [
      "Founder/CEO - Business leadership",
      "CTO/Technical Leader - Technology focus",
      "Marketing/Growth - Customer acquisition",
      "HR/People Operations - Team management",
      "Operations/Finance - Business processes",
      "Other Business Function"
    ]
  },
  {
    content: "What area are you most excited to use AI in?",
    responseType: 'multiChoice',
    choices: [
      "Customer Support - Automate responses",
      "Marketing - Content and campaigns",
      "Data Analysis - Business insights",
      "Product Development - Smart features",
      "Knowledge Management - Internal systems",
      "Not Sure Yet - Exploring options"
    ]
  },
  {
    content: "What kind of help do you need most right now?",
    responseType: 'multiChoice',
    choices: [
      "Tutorials & Learning - Educational resources",
      "Use Cases - Real-world examples",
      "Strategic Planning - Roadmap development",
      "Technical Guidance - Implementation help",
      "Business Case - ROI calculation"
    ]
  },
  {
    content: "What industry is your business in?",
    responseType: 'multiChoice',
    choices: [
      "Technology - Software or hardware",
      "Financial Services - Banking, insurance, etc.",
      "Healthcare - Medical services or products",
      "Retail & E-commerce - Consumer goods",
      "Manufacturing - Industrial production",
      "Other"
    ]
  }
];

// Industry-specific insights
const industryInsights: Record<string, IndustryInsight[]> = {
  'technology': [
    {
      title: "AI Adoption in Technology Companies",
      insight: "Tech companies implementing AI are seeing a 23% increase in developer productivity and 35% reduction in QA time."
    },
    {
      title: "Key AI Trends in Tech",
      insight: "The most successful tech companies are using AI for code generation, automated testing, and customer behavior analysis."
    }
  ],
  'financial': [
    {
      title: "AI in Financial Services",
      insight: "Financial institutions using AI chatbots report a 40% reduction in service costs and 25% improvement in customer satisfaction."
    },
    {
      title: "Risk Management Applications",
      insight: "AI-powered risk assessment models are 68% more accurate at detecting fraud than traditional methods."
    }
  ],
  'healthcare': [
    {
      title: "Healthcare AI Applications",
      insight: "AI diagnostics tools are showing 93% accuracy rates in early detection scenarios, compared to 87% for human-only diagnosis."
    },
    {
      title: "Patient Experience Enhancement",
      insight: "Healthcare providers using AI for patient management report 32% faster appointment scheduling and 27% reduction in administrative costs."
    }
  ],
  'retail': [
    {
      title: "AI in Retail",
      insight: "Retailers using AI for inventory management reduce out-of-stock incidents by 45% and overstock by 32%."
    },
    {
      title: "Personalization Impact",
      insight: "AI-driven product recommendations generate 35% higher conversion rates and 25% larger average order values."
    }
  ],
  'manufacturing': [
    {
      title: "Manufacturing AI Applications",
      insight: "Predictive maintenance AI systems reduce unplanned downtime by 39% and maintenance costs by 29% in manufacturing facilities."
    },
    {
      title: "Quality Control Improvements",
      insight: "AI-powered visual inspection systems detect 97% of defects compared to 83% with traditional inspection methods."
    }
  ]
};

// Competitor analyses for different types of AI solutions
const competitorAnalyses: Record<string, CompetitorAnalysis[]> = {
  'chatbot': [
    {
      name: "Traditional Chatbot Solutions",
      strengths: ["Lower initial cost", "Simpler implementation"],
      weaknesses: ["Limited understanding", "Frustrating user experience", "Requires constant manual updates"]
    },
    {
      name: "Generic AI Platforms",
      strengths: ["Broad capabilities", "Name recognition"],
      weaknesses: ["Lacks industry-specific training", "Difficult to customize", "Higher error rates for specialized queries"]
    }
  ],
  'analytics': [
    {
      name: "Traditional BI Tools",
      strengths: ["Established workflows", "Familiar to analysts"],
      weaknesses: ["Requires manual query building", "Limited predictive capabilities", "Slow insight generation"]
    },
    {
      name: "Generic AI Analytics",
      strengths: ["Automated reporting", "Natural language queries"],
      weaknesses: ["Black box reasoning", "Difficulty with complex data relationships", "Lacks domain expertise"]
    }
  ],
  'content': [
    {
      name: "Template-Based Content Systems",
      strengths: ["Consistent brand voice", "Predictable output"],
      weaknesses: ["Limited variety", "Time-consuming to create", "Static and inflexible"]
    },
    {
      name: "Generic AI Content Tools",
      strengths: ["Fast content generation", "Wide topic coverage"],
      weaknesses: ["Inconsistent brand voice", "Factual inaccuracies", "Limited understanding of marketing strategy"]
    }
  ]
};

// Enhanced implementation difficulty assessments
const implementationDifficulty: Record<string, Record<string, 'Low' | 'Medium' | 'High'>> = {
  'starting': {
    'support': 'Low',
    'content': 'Low',
    'data': 'Medium',
    'product': 'High',
    'knowledge': 'Medium'
  },
  'exploring': {
    'support': 'Low',
    'content': 'Low',
    'data': 'Medium',
    'product': 'Medium',
    'knowledge': 'Low'
  },
  'piloting': {
    'support': 'Low',
    'content': 'Low',
    'data': 'Low',
    'product': 'Medium',
    'knowledge': 'Low'
  },
  'scaling': {
    'support': 'Medium',
    'content': 'Medium',
    'data': 'Medium',
    'product': 'High',
    'knowledge': 'Medium'
  }
};

// Time to value estimates
const timeToValue: Record<string, Record<string, string>> = {
  'starting': {
    'support': '2-4 weeks',
    'content': '1-3 weeks',
    'data': '4-8 weeks',
    'product': '8-12 weeks',
    'knowledge': '3-6 weeks'
  },
  'exploring': {
    'support': '1-3 weeks',
    'content': '1-2 weeks',
    'data': '3-6 weeks',
    'product': '6-10 weeks',
    'knowledge': '2-4 weeks'
  },
  'piloting': {
    'support': '1-2 weeks',
    'content': '1 week',
    'data': '2-4 weeks',
    'product': '4-8 weeks',
    'knowledge': '1-3 weeks'
  },
  'scaling': {
    'support': '2-6 weeks',
    'content': '2-4 weeks',
    'data': '4-8 weeks',
    'product': '6-12 weeks',
    'knowledge': '3-6 weeks'
  }
};

// Cost estimates
const costEstimates: Record<string, Record<string, string>> = {
  'starting': {
    'support': '$5,000-$15,000',
    'content': '$3,000-$10,000',
    'data': '$15,000-$30,000',
    'product': '$25,000-$50,000',
    'knowledge': '$10,000-$25,000'
  },
  'exploring': {
    'support': '$3,000-$12,000',
    'content': '$2,000-$8,000',
    'data': '$10,000-$25,000',
    'product': '$20,000-$40,000',
    'knowledge': '$8,000-$20,000'
  },
  'piloting': {
    'support': '$2,000-$10,000',
    'content': '$1,500-$7,000',
    'data': '$8,000-$20,000',
    'product': '$15,000-$35,000',
    'knowledge': '$5,000-$15,000'
  },
  'scaling': {
    'support': '$10,000-$30,000',
    'content': '$8,000-$25,000',
    'data': '$20,000-$50,000',
    'product': '$30,000-$100,000',
    'knowledge': '$15,000-$40,000'
  }
};

// Mock recommendations based on user profile
const mockRecommendations: Record<string, Recommendation> = {
  // For Founder + Just Starting + Customer Support
  'founder-starting-support': {
    maturityScore: 20,
    maturityInsight: "You're at the beginning of your AI journey with great potential for customer support improvements.",
    useCases: [
      {
        title: "AI Customer Support Assistant",
        description: "Deploy an AI agent that can handle common customer inquiries, reducing response time by up to 70%.",
        link: "#customer-support-demo",
        priority: 10
      },
      {
        title: "Knowledge Base Enhancement",
        description: "Use AI to improve your knowledge base by identifying gaps and generating helpful content.",
        link: "#knowledge-base-demo",
        priority: 8
      },
      {
        title: "Customer Sentiment Analysis",
        description: "Implement AI-powered sentiment analysis to identify customer satisfaction trends and issues.",
        link: "#sentiment-analysis",
        priority: 6
      }
    ],
    resources: [
      {
        title: "Executive's Guide to AI Implementation",
        description: "A comprehensive guide for business leaders implementing AI for the first time.",
        link: "#executive-guide",
        type: 'tutorial',
        popularity: 95
      },
      {
        title: "Customer Support ROI Calculator",
        description: "Calculate the potential return on investment from AI-powered customer support.",
        link: "#roi-calculator",
        type: 'template',
        popularity: 90
      },
      {
        title: "Quick-Start Support Agent Template",
        description: "A ready-to-customize template for deploying your first customer support AI agent.",
        link: "#quick-start-template",
        type: 'template',
        popularity: 85
      }
    ],
    nextSteps: [
      "Schedule a discovery call with our AI consultants",
      "Identify your top 3 customer support challenges",
      "Explore our AI customer support template",
      "Consider a 30-day pilot program"
    ],
    competitorAnalysis: competitorAnalyses['chatbot'],
    implementationDifficulty: 'Low',
    estimatedTimeToValue: '2-4 weeks',
    estimatedCost: '$5,000-$15,000'
  },
  
  // For CTO + Exploring + Data Analysis
  'technical-exploring-data': {
    maturityScore: 40,
    maturityInsight: "You have a solid technical foundation and are well-positioned to implement data analysis AI solutions.",
    useCases: [
      {
        title: "Automated Data Insights Agent",
        description: "Deploy an AI system that continuously analyzes your data and surfaces valuable insights.",
        link: "#data-insights-demo",
        priority: 10
      },
      {
        title: "Predictive Analytics Implementation",
        description: "Use AI to predict future trends based on historical data across your business.",
        link: "#predictive-analytics",
        priority: 9
      },
      {
        title: "Anomaly Detection System",
        description: "Implement AI-powered anomaly detection to identify unusual patterns in your business data.",
        link: "#anomaly-detection",
        priority: 8
      }
    ],
    resources: [
      {
        title: "Technical Implementation Playbook",
        description: "Step-by-step guide for CTOs to implement AI data analysis tools.",
        link: "#implementation-guide",
        type: 'tutorial',
        popularity: 98
      },
      {
        title: "Data Analysis Architecture Blueprint",
        description: "Reference architecture for building scalable AI data analysis systems.",
        link: "#architecture-blueprint",
        type: 'blog',
        popularity: 92
      },
      {
        title: "AI Integration Patterns Webinar",
        description: "Technical deep-dive on integrating AI analysis into existing data pipelines.",
        link: "#integration-webinar",
        type: 'webinar',
        popularity: 88
      }
    ],
    nextSteps: [
      "Audit your current data infrastructure",
      "Identify integration points for AI capabilities",
      "Review our API documentation",
      "Start with a focused proof-of-concept"
    ],
    competitorAnalysis: competitorAnalyses['analytics'],
    implementationDifficulty: 'Medium',
    estimatedTimeToValue: '3-6 weeks',
    estimatedCost: '$10,000-$25,000'
  },
  
  // For Marketing + Piloting + Content Generation
  'marketing-piloting-content': {
    maturityScore: 60,
    maturityInsight: "You're making good progress with AI content generation and ready to expand your capabilities.",
    useCases: [
      {
        title: "Multi-channel Content Generation",
        description: "Scale your content creation across all marketing channels with consistent messaging.",
        link: "#content-generation-demo",
        priority: 10
      },
      {
        title: "Personalized Campaign Optimizer",
        description: "Use AI to automatically optimize campaigns based on performance data and user behavior.",
        link: "#campaign-optimizer",
        priority: 9
      },
      {
        title: "Audience Insights Generator",
        description: "Apply AI to identify audience trends and content preferences to guide your strategy.",
        link: "#audience-insights",
        priority: 8
      }
    ],
    resources: [
      {
        title: "AI for Modern Marketing Teams",
        description: "Comprehensive guide to implementing AI across your marketing operations.",
        link: "#marketing-ai-guide",
        type: 'tutorial',
        popularity: 96
      },
      {
        title: "Content Generation Case Studies",
        description: "Real-world examples of marketing teams achieving 10x productivity with AI.",
        link: "#case-studies",
        type: 'blog',
        popularity: 90
      },
      {
        title: "Campaign Optimization Template",
        description: "Ready-to-use template for implementing AI-driven marketing campaign optimization.",
        link: "#campaign-template",
        type: 'template',
        popularity: 85
      }
    ],
    nextSteps: [
      "Expand your pilot to include more content types",
      "Integrate analytics to measure content performance",
      "Train team members on advanced AI prompting",
      "Set up A/B testing for AI vs human content"
    ],
    competitorAnalysis: competitorAnalyses['content'],
    implementationDifficulty: 'Low',
    estimatedTimeToValue: '1 week',
    estimatedCost: '$1,500-$7,000'
  },
  
  // Default recommendation
  'default': {
    maturityScore: 35,
    maturityInsight: "Based on your responses, you're making progress on your AI journey with opportunities to accelerate adoption.",
    useCases: [
      {
        title: "Custom AI Agent Development",
        description: "Build specialized AI agents tailored to your specific business needs and workflows.",
        link: "#custom-agent-demo",
        priority: 10
      },
      {
        title: "Knowledge Management Solution",
        description: "Implement an AI system to organize, search, and leverage your organizational knowledge.",
        link: "#knowledge-management",
        priority: 8
      },
      {
        title: "Process Automation with AI",
        description: "Identify and automate repetitive tasks in your business workflows using AI agents.",
        link: "#process-automation",
        priority: 7
      }
    ],
    resources: [
      {
        title: "AI Implementation Roadmap",
        description: "A step-by-step guide to implementing AI solutions in your organization.",
        link: "#implementation-roadmap",
        type: 'tutorial',
        popularity: 94
      },
      {
        title: "Lyzr Platform Overview",
        description: "Learn how the Lyzr platform can accelerate your AI journey with pre-built components.",
        link: "#platform-overview",
        type: 'demo',
        popularity: 90
      },
      {
        title: "AI Strategy Workshop Materials",
        description: "Templates and exercises to help you develop your organization's AI strategy.",
        link: "#strategy-workshop",
        type: 'template',
        popularity: 86
      }
    ],
    nextSteps: [
      "Define your AI strategy and priorities",
      "Identify quick-win opportunities",
      "Schedule a demo with our solutions team",
      "Explore our template library for your use case"
    ],
    implementationDifficulty: 'Medium',
    estimatedTimeToValue: '4-8 weeks',
    estimatedCost: '$10,000-$25,000'
  }
};

// Map industry selection to insight key
function getIndustryKey(industryInput: string): string {
  if (industryInput.toLowerCase().includes('technology')) return 'technology';
  if (industryInput.toLowerCase().includes('financial')) return 'financial';
  if (industryInput.toLowerCase().includes('healthcare')) return 'healthcare';
  if (industryInput.toLowerCase().includes('retail')) return 'retail';
  if (industryInput.toLowerCase().includes('manufacturing')) return 'manufacturing';
  return 'technology'; // default
}

// Get competitor analysis based on interest
function getCompetitorAnalysis(interest: string): CompetitorAnalysis[] {
  if (interest === 'support') return competitorAnalyses['chatbot'];
  if (interest === 'content') return competitorAnalyses['content'];
  if (interest === 'data') return competitorAnalyses['analytics'];
  return competitorAnalyses['chatbot']; // default
}

// Agent response logic
export function agentRespond(
  userInput: string, 
  step: number,
  userProfile: Record<string, string>
): AgentResponse {
  // Store user's journey stage at step 1
  if (step === 1) {
    let journeyStage = '';
    
    if (userInput.toLowerCase().includes('just starting')) {
      journeyStage = 'starting';
    } else if (userInput.toLowerCase().includes('exploring')) {
      journeyStage = 'exploring';
    } else if (userInput.toLowerCase().includes('piloting')) {
      journeyStage = 'piloting';
    } else if (userInput.toLowerCase().includes('scaling')) {
      journeyStage = 'scaling';
    }
    
    return {
      content: agentMessages[2].content,
      responseType: agentMessages[2].responseType,
      choices: agentMessages[2].choices,
      tag: 'journeyStage',
      value: journeyStage
    };
  }
  
  // Store user's role at step 2
  if (step === 2) {
    let role = '';
    
    if (userInput.toLowerCase().includes('founder')) {
      role = 'founder';
    } else if (userInput.toLowerCase().includes('cto') || userInput.toLowerCase().includes('technical')) {
      role = 'technical';
    } else if (userInput.toLowerCase().includes('marketing')) {
      role = 'marketing';
    } else if (userInput.toLowerCase().includes('hr')) {
      role = 'hr';
    } else {
      role = 'other';
    }
    
    return {
      content: agentMessages[3].content,
      responseType: agentMessages[3].responseType,
      choices: agentMessages[3].choices,
      tag: 'role',
      value: role
    };
  }
  
  // Store user's area of interest at step 3
  if (step === 3) {
    let interest = '';
    
    if (userInput.toLowerCase().includes('customer support')) {
      interest = 'support';
    } else if (userInput.toLowerCase().includes('marketing')) {
      interest = 'content';
    } else if (userInput.toLowerCase().includes('data')) {
      interest = 'data';
    } else if (userInput.toLowerCase().includes('product')) {
      interest = 'product';
    } else if (userInput.toLowerCase().includes('knowledge')) {
      interest = 'knowledge';
    } else {
      interest = 'other';
    }
    
    return {
      content: agentMessages[4].content,
      responseType: agentMessages[4].responseType,
      choices: agentMessages[4].choices,
      tag: 'interest',
      value: interest
    };
  }
  
  // Store user's help needed at step 4
  if (step === 4) {
    let helpNeeded = '';
    
    if (userInput.toLowerCase().includes('tutorials')) {
      helpNeeded = 'learning';
    } else if (userInput.toLowerCase().includes('use cases')) {
      helpNeeded = 'usecases';
    } else if (userInput.toLowerCase().includes('strategic')) {
      helpNeeded = 'planning';
    } else if (userInput.toLowerCase().includes('technical')) {
      helpNeeded = 'technical';
    } else if (userInput.toLowerCase().includes('business case')) {
      helpNeeded = 'roi';
    } else {
      helpNeeded = 'general';
    }
    
    return {
      content: agentMessages[5].content,
      responseType: agentMessages[5].responseType,
      choices: agentMessages[5].choices,
      tag: 'helpNeeded',
      value: helpNeeded
    };
  }
  
  // Store user's industry at step 5 and proceed to final recommendations
  if (step === 5) {
    let industry = '';
    
    if (userInput.toLowerCase().includes('technology')) {
      industry = 'technology';
    } else if (userInput.toLowerCase().includes('financial')) {
      industry = 'financial';
    } else if (userInput.toLowerCase().includes('healthcare')) {
      industry = 'healthcare';
    } else if (userInput.toLowerCase().includes('retail')) {
      industry = 'retail';
    } else if (userInput.toLowerCase().includes('manufacturing')) {
      industry = 'manufacturing';
    } else {
      industry = 'other';
    }
    
    // Generate profile key based on collected data
    const { role = '', journeyStage = '', interest = '' } = userProfile;
    const profileKey = `${role}-${journeyStage}-${interest}`;
    
    // Lookup recommendation or use default
    let recommendation = mockRecommendations[profileKey] || mockRecommendations['default'];
    
    // Enhance with industry-specific insights if available
    const industryKey = getIndustryKey(industry);
    if (industryInsights[industryKey]) {
      recommendation = {
        ...recommendation,
        industryInsights: industryInsights[industryKey]
      };
    }
    
    // Add implementation difficulty, time to value, and cost if available
    if (journeyStage && interest) {
      let interestKey = interest;
      if (!['support', 'content', 'data', 'product', 'knowledge'].includes(interestKey)) {
        interestKey = 'data'; // default
      }
      
      recommendation = {
        ...recommendation,
        implementationDifficulty: implementationDifficulty[journeyStage]?.[interestKey] || 'Medium',
        estimatedTimeToValue: timeToValue[journeyStage]?.[interestKey] || '4-8 weeks',
        estimatedCost: costEstimates[journeyStage]?.[interestKey] || '$10,000-$25,000'
      };
    }
    
    // Sort use cases by priority
    recommendation.useCases.sort((a, b) => b.priority - a.priority);
    
    // Sort resources by popularity
    recommendation.resources.sort((a, b) => b.popularity - a.popularity);
    
    // Personalized final message
    const finalMessage = "Thanks for sharing your AI journey with me! Based on your responses, I've created a personalized AI readiness assessment and recommendations specifically tailored to your needs as a " + 
      (role === 'founder' ? 'founder/CEO' : 
       role === 'technical' ? 'technical leader' :
       role === 'marketing' ? 'marketing professional' :
       role === 'hr' ? 'HR professional' : 'business professional') + 
      " in the " + (industry || 'technology') + " industry.";
    
    return {
      content: finalMessage,
      final: true,
      recommendations: [recommendation],
      tag: 'industry',
      value: industry
    };
  }
  
  // Fallback response
  return {
    content: "Let me help you with your AI journey. What specifically are you looking to achieve?",
    responseType: 'text'
  };
}