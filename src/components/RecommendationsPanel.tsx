import React, { useState } from 'react';
import { CheckCircle, ArrowRight, Download, Calendar, ExternalLink, Mail, Loader2, X } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl h-[80vh] rounded-lg shadow-xl flex flex-col relative">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-indigo-600 rounded-full p-1.5 mr-2">
              <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-indigo-600 font-bold">L</span>
              </div>
            </div>
            <h2 className="text-lg font-semibold">Your AI Readiness Assessment</h2>
          </div>
          <button 
            onClick={() => {}}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Email capture form */}
          {renderEmailCaptureForm()}
          
          {/* Recommendations */}
          <div className="space-y-6">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {recommendation.maturityInsight}
                </h3>
                
                {/* Use cases */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3">Recommended Use Cases</h4>
                  <div className="grid gap-4">
                    {recommendation.useCases.map((useCase, i) => (
                      <a
                        key={i}
                        href={useCase.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                      >
                        <div>
                          <h5 className="font-medium text-gray-900">{useCase.title}</h5>
                          <p className="text-sm text-gray-600">{useCase.description}</p>
                        </div>
                        <ExternalLink className="h-5 w-5 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
                
                {/* Resources */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3">Helpful Resources</h4>
                  <div className="grid gap-4">
                    {recommendation.resources.map((resource, i) => (
                      <a
                        key={i}
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                      >
                        <div>
                          <h5 className="font-medium text-gray-900">{resource.title}</h5>
                          <p className="text-sm text-gray-600">{resource.description}</p>
                        </div>
                        <ExternalLink className="h-5 w-5 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
                
                {/* Next steps */}
                <div>
                  <h4 className="text-lg font-medium mb-3">Next Steps</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {recommendation.nextSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPanel;