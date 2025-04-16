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
  title: string;
  description: string;
  type: 'learning' | 'technical' | 'business' | 'tools' | 'strategy' | 'industry';
  priority: 'high' | 'medium' | 'low';
}

// Add demo mode types and configurations
export interface DemoResponse {
  answer: string;
  delay: number;
}

export const DEMO_MODE_RESPONSES: Record<number, DemoResponse> = {
  1: {
    answer: "Yes, I'd love to learn more about AI implementation!",
    delay: 3000
  },
  2: {
    answer: "Just Starting - New to AI implementation",
    delay: 4000
  },
  3: {
    answer: "CTO/Technical Leader - Technology focus",
    delay: 3500
  },
  4: {
    answer: "Data Analysis - Business insights",
    delay: 4000
  },
  5: {
    answer: "Strategic Planning - Roadmap development",
    delay: 3500
  },
  6: {
    answer: "Technology - Software or hardware",
    delay: 4000
  }
};

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

// Pre-defined mock recommendations
const mockRecommendations: Record<string, Recommendation> = {
  'default': {
    title: 'Getting Started with AI',
    description: 'A comprehensive guide to understanding and implementing AI in your business.',
    type: 'learning',
    priority: 'high'
  },
  'technical-starting-data_analysis': {
    title: 'Technical AI Implementation Guide',
    description: 'Step-by-step technical guide for implementing AI-powered data analysis.',
    type: 'technical',
    priority: 'high'
  },
  'marketing-exploring-marketing': {
    title: 'AI Marketing Playbook',
    description: 'Learn how to leverage AI for customer acquisition and engagement.',
    type: 'business',
    priority: 'high'
  },
  'founder-piloting-product': {
    title: 'AI Product Strategy Guide',
    description: 'Strategic framework for integrating AI into your product roadmap.',
    type: 'strategy',
    priority: 'high'
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

// Modify the agentRespond function to handle initial greeting
export function agentRespond(
  userInput: string, 
  step: number,
  userProfile: Record<string, string>,
  isDemo: boolean = false
): AgentResponse {
  // For step 0 (initial greeting), return the first message
  if (step === 0) {
    return {
      content: agentMessages[0].content,
      responseType: 'text'
    };
  }

  // If in demo mode, use pre-written responses
  if (isDemo && DEMO_MODE_RESPONSES[step]) {
    const demoResponse = DEMO_MODE_RESPONSES[step];
    userInput = demoResponse.answer;
  }

  // Normalize user input
  const normalizedInput = userInput.toLowerCase().trim();
  
  // Store user's journey stage at step 1
  if (step === 1) {
    let journeyStage = '';
    
    if (normalizedInput.match(/(just starting|new to|beginning|first steps|getting started)/)) {
      journeyStage = 'starting';
    } else if (normalizedInput.match(/(exploring|researching|looking into|investigating)/)) {
      journeyStage = 'exploring';
    } else if (normalizedInput.match(/(piloting|testing|trying out|experimenting)/)) {
      journeyStage = 'piloting';
    } else if (normalizedInput.match(/(scaling|expanding|growing|implementing)/)) {
      journeyStage = 'scaling';
    }
    
    return {
      content: agentMessages[2].content,
      responseType: agentMessages[2].responseType,
      choices: agentMessages[2].choices,
      tag: 'journeyStage',
      value: journeyStage || normalizedInput
    };
  }
  
  // Store user's role at step 2
  if (step === 2) {
    let role = '';
    if (normalizedInput.includes('founder') || normalizedInput.includes('ceo')) {
      role = 'founder';
    } else if (normalizedInput.includes('cto') || normalizedInput.includes('technical')) {
      role = 'technical';
    } else if (normalizedInput.includes('marketing') || normalizedInput.includes('growth')) {
      role = 'marketing';
    } else if (normalizedInput.includes('hr') || normalizedInput.includes('people')) {
      role = 'hr';
    } else if (normalizedInput.includes('operations') || normalizedInput.includes('finance')) {
      role = 'operations';
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
  
  // Store user's interest area at step 3
  if (step === 3) {
    let interest = '';
    if (normalizedInput.includes('customer support')) {
      interest = 'customer_support';
    } else if (normalizedInput.includes('marketing')) {
      interest = 'marketing';
    } else if (normalizedInput.includes('data analysis')) {
      interest = 'data_analysis';
    } else if (normalizedInput.includes('product')) {
      interest = 'product';
    } else if (normalizedInput.includes('knowledge')) {
      interest = 'knowledge';
    } else {
      interest = 'exploring';
    }
    
    return {
      content: agentMessages[4].content,
      responseType: agentMessages[4].responseType,
      choices: agentMessages[4].choices,
      tag: 'interest',
      value: interest
    };
  }
  
  // Store user's help need at step 4
  if (step === 4) {
    let helpNeed = '';
    if (normalizedInput.includes('tutorials')) {
      helpNeed = 'tutorials';
    } else if (normalizedInput.includes('use cases')) {
      helpNeed = 'use_cases';
    } else if (normalizedInput.includes('strategic')) {
      helpNeed = 'strategic';
    } else if (normalizedInput.includes('technical')) {
      helpNeed = 'technical';
    } else if (normalizedInput.includes('business case')) {
      helpNeed = 'business_case';
    }
    
    return {
      content: agentMessages[5].content,
      responseType: agentMessages[5].responseType,
      choices: agentMessages[5].choices,
      tag: 'helpNeed',
      value: helpNeed || normalizedInput
    };
  }
  
  // Store user's industry at step 5
  if (step === 5) {
    let industry = '';
    if (normalizedInput.includes('technology')) {
      industry = 'technology';
    } else if (normalizedInput.includes('financial')) {
      industry = 'financial';
    } else if (normalizedInput.includes('healthcare')) {
      industry = 'healthcare';
    } else if (normalizedInput.includes('retail')) {
      industry = 'retail';
    } else if (normalizedInput.includes('manufacturing')) {
      industry = 'manufacturing';
    } else {
      industry = 'other';
    }
    
    // Generate personalized recommendations based on collected profile
    const recommendations = generateRecommendations(userProfile, industry);
    
    return {
      content: "Thanks for sharing your AI journey with me! I've created a personalized AI readiness assessment for you.",
      responseType: 'text',
      final: true,
      recommendations
    };
  }
  
  // Fallback response
  return {
    content: "I didn't quite catch that. Could you please rephrase or select one of the options?",
    responseType: 'multiChoice',
    choices: agentMessages[step - 1].choices
  };
}

// Helper function to generate recommendations based on user profile
function generateRecommendations(userProfile: Record<string, string>, industry: string): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Basic recommendation based on journey stage
  if (userProfile.journeyStage === 'starting') {
    recommendations.push({
      title: 'AI Fundamentals Course',
      description: 'Start with our beginner-friendly course covering AI basics and use cases.',
      type: 'learning',
      priority: 'high'
    });
  }
  
  // Role-specific recommendations
  if (userProfile.role === 'technical') {
    recommendations.push({
      title: 'Technical Implementation Guide',
      description: 'Step-by-step guide for implementing AI solutions in your tech stack.',
      type: 'technical',
      priority: 'high'
    });
  } else if (userProfile.role === 'marketing') {
    recommendations.push({
      title: 'AI in Marketing Playbook',
      description: 'Learn how to leverage AI for customer acquisition and engagement.',
      type: 'business',
      priority: 'high'
    });
  }
  
  // Interest area recommendations
  if (userProfile.interest === 'data_analysis') {
    recommendations.push({
      title: 'Data Analysis Toolkit',
      description: 'Essential tools and frameworks for AI-powered data analysis.',
      type: 'tools',
      priority: 'medium'
    });
  }
  
  // Help need recommendations
  if (userProfile.helpNeed === 'strategic') {
    recommendations.push({
      title: 'AI Strategy Template',
      description: 'Customizable template for building your AI implementation roadmap.',
      type: 'strategy',
      priority: 'high'
    });
  }
  
  // Industry-specific recommendations
  if (industry === 'technology') {
    recommendations.push({
      title: 'Tech Industry AI Solutions',
      description: 'Proven AI use cases and success stories from tech companies.',
      type: 'industry',
      priority: 'medium'
    });
  }
  
  return recommendations;
}