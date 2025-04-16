import React, { useState } from 'react';
import { CheckCircle, ArrowRight, Download, Calendar, ExternalLink, Mail, Loader2 } from 'lucide-react';
import { Recommendation } from '../utils/agentSimulator';
import { useTracking } from '../context/TrackingContext';

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
}

const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({ recommendations }) => {
  const { addInteraction } = useTracking();
  const [formState, setFormState] = useState<'initial' | 'submitting' | 'success'>('initial');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    company: '',
    phone: ''
  });
  const [step, setStep] = useState(1);
  const [showFullForm, setShowFullForm] = useState(false);
  
  const handleCTAClick = (type: string) => {
    addInteraction('cta_clicked', { ctaType: type });
  };
  
  const handleEmailCaptureStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email) {
      addInteraction('email_collected', { email: formData.email, step: 'initial' });
      setStep(2);
      setShowFullForm(true);
    }
  };
  
  const handleFullFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    
    // Simulate API call
    setTimeout(() => {
      addInteraction('lead_qualified', { 
        email: formData.email, 
        name: formData.name,
        company: formData.company,
        phone: formData.phone
      });
      setFormState('success');
    }, 1500);
  };
  
  const renderEmailCaptureForm = () => {
    if (formState === 'success') {
      return (
        <div className="bg-green-50 p-5 rounded-xl text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2 text-green-800">Thank You!</h3>
          <p className="text-sm text-green-700 mb-3">
            Your personalized AI Readiness Kit has been sent to your inbox. Be sure to check your spam folder if you don't see it soon.
          </p>
        </div>
      );
    }
    
    if (!showFullForm) {
      return (
        <div className="bg-indigo-50 p-5 rounded-xl mb-6">
          <h3 className="text-lg font-semibold mb-2 text-indigo-900">Get Your Full AI Readiness Kit</h3>
          <p className="text-sm text-indigo-700 mb-3">
            We've prepared a comprehensive guide based on your responses, including implementation templates and ROI calculators.
          </p>
          <form onSubmit={handleEmailCaptureStep1} className="flex gap-2">
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Your work email" 
              required
              className="flex-1 px-3 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Send Me the Kit
            </button>
          </form>
        </div>
      );
    }
    
    return (
      <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-3 text-indigo-900">Complete Your AI Readiness Profile</h3>
        <p className="text-sm text-gray-600 mb-4">
          To tailor your AI Readiness Kit to your specific business needs, please provide a few additional details:
        </p>
        <form onSubmit={handleFullFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Full name" 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input 
              type="text" 
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              placeholder="Your organization" 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="For personalized follow-up" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button 
            type="submit"
            disabled={formState === 'submitting'}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
          >
            {formState === 'submitting' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Preparing Your Kit...
              </>
            ) : (
              'Get Your Personalized Kit'
            )}
          </button>
          <p className="text-xs text-gray-500 text-center">
            We respect your privacy and will never share your information with third parties.
          </p>
        </form>
      </div>
    );
  };
  
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-8 text-center">
        <div className="bg-indigo-100 text-indigo-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-indigo-900 mb-2">Your AI Readiness Plan</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Based on your responses, we've created a personalized AI strategy plan to help you succeed in your journey.
        </p>
      </div>

      {/* Email Capture Form */}
      {renderEmailCaptureForm()}

      <div className="grid gap-6">
        {/* Maturity Level */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 rounded-xl text-white">
          <h3 className="text-lg font-semibold mb-2">Your AI Maturity Level</h3>
          <div className="flex items-center justify-between mb-2">
            <span>Beginner</span>
            <span>Advanced</span>
          </div>
          <div className="h-2 bg-white/30 rounded-full mb-2">
            <div 
              className="h-full bg-white rounded-full"
              style={{ width: `${recommendations[0]?.maturityScore || 30}%` }}
            ></div>
          </div>
          <p className="text-sm opacity-90">
            {recommendations[0]?.maturityInsight || "You're in the early stages of your AI journey with significant growth opportunities ahead."}
          </p>
        </div>

        {/* Recommended Use Cases */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-3 text-indigo-900">Recommended Use Cases</h3>
          <div className="space-y-3">
            {recommendations[0]?.useCases?.map((useCase, index) => (
              <div key={index} className="border border-gray-100 p-3 rounded-lg hover:border-indigo-200 transition-colors">
                <h4 className="font-medium text-indigo-800">{useCase.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{useCase.description}</p>
                <a 
                  href={useCase.link} 
                  className="text-indigo-600 text-sm font-medium mt-2 flex items-center hover:text-indigo-700"
                  onClick={() => handleCTAClick('use_case_link')}
                >
                  Learn more <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-3 text-indigo-900">Resources for You</h3>
          <div className="space-y-3">
            {recommendations[0]?.resources?.map((resource, index) => (
              <div key={index} className="border border-gray-100 p-3 rounded-lg flex items-start hover:border-indigo-200 transition-colors">
                <div className="bg-indigo-100 rounded-lg p-2 mr-3">
                  {resource.type === 'tutorial' ? (
                    <Download className="h-5 w-5 text-indigo-600" />
                  ) : (
                    <ExternalLink className="h-5 w-5 text-indigo-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-indigo-800">{resource.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                  <a 
                    href={resource.link} 
                    className="text-indigo-600 text-sm font-medium mt-2 flex items-center hover:text-indigo-700"
                    onClick={() => handleCTAClick('resource_link')}
                  >
                    {resource.type === 'tutorial' ? 'Download' : 'View'} <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-indigo-50 p-5 rounded-xl">
          <h3 className="text-lg font-semibold mb-3 text-indigo-900">Next Steps</h3>
          <ul className="space-y-2">
            {recommendations[0]?.nextSteps?.map((step, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-2">
          <button 
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center mx-auto"
            onClick={() => handleCTAClick('schedule_call')}
          >
            <Calendar className="h-5 w-5 mr-2" />
            Talk to an AI Expert
          </button>
          <p className="text-sm text-gray-500 mt-3">
            Schedule a 30-minute consultation to discuss your AI strategy
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPanel;