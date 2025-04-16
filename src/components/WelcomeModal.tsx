import React, { useState } from 'react';
import { Bot, X, Sparkles, Lightbulb, ShieldCheck, Clock, CheckCircle, Users, Target } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Progress indicator */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>

        {currentStep === 1 && (
          <>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 pt-10 pb-12 px-8 text-white text-center">
              <div className="bg-white/20 rounded-full p-3 inline-block mb-4">
                <Bot className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome to Your AI Readiness Assessment
              </h2>
              <p className="opacity-90">
                I'm your Lyzr AI Navigator, designed to help you discover your perfect AI journey.
              </p>
            </div>

            <div className="p-6 px-8">
              <h3 className="font-semibold text-indigo-900 text-lg mb-3">
                How I Can Help You:
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-indigo-800">Personalized Assessment</h4>
                    <p className="text-sm text-gray-600">
                      I'll ask a few quick questions to understand your AI needs and goals.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <Lightbulb className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-indigo-800">Custom Recommendations</h4>
                    <p className="text-sm text-gray-600">
                      You'll receive tailored use cases, resources, and next steps for your situation.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <ShieldCheck className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-indigo-800">Responsible AI</h4>
                    <p className="text-sm text-gray-600">
                      All recommendations follow Lyzr's responsible AI principles and best practices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {currentStep === 2 && (
          <>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 pt-10 pb-12 px-8 text-white text-center">
              <div className="bg-white/20 rounded-full p-3 inline-block mb-4">
                <Clock className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Your AI Assessment Journey
              </h2>
              <p className="opacity-90">
                In just 2 minutes, we'll create your personalized AI readiness plan
              </p>
            </div>

            <div className="p-6 px-8">
              <h3 className="font-semibold text-indigo-900 text-lg mb-3">
                What to Expect:
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-3 flex-shrink-0">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-indigo-800">Quick Assessment (30 seconds)</h4>
                    <p className="text-sm text-gray-600">
                      Answer 5 short questions about your role and AI needs
                    </p>
                    <div className="flex mt-1 space-x-1">
                      <span className="inline-block h-1.5 w-12 bg-green-500 rounded-full"></span>
                      <span className="inline-block h-1.5 w-12 bg-green-500 rounded-full"></span>
                      <span className="inline-block h-1.5 w-12 bg-green-500 rounded-full"></span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3 flex-shrink-0">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-indigo-800">Personalized Results (45 seconds)</h4>
                    <p className="text-sm text-gray-600">
                      Get your AI maturity score and tailored use cases
                    </p>
                    <div className="flex mt-1 space-x-1">
                      <span className="inline-block h-1.5 w-12 bg-blue-500 rounded-full"></span>
                      <span className="inline-block h-1.5 w-12 bg-blue-500 rounded-full"></span>
                      <span className="inline-block h-1.5 w-12 bg-blue-500 rounded-full"></span>
                      <span className="inline-block h-1.5 w-12 bg-blue-500 rounded-full"></span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3 flex-shrink-0">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-indigo-800">Action Plan (45 seconds)</h4>
                    <p className="text-sm text-gray-600">
                      Receive your implementation roadmap and resources
                    </p>
                    <div className="flex mt-1 space-x-1">
                      <span className="inline-block h-1.5 w-12 bg-purple-500 rounded-full"></span>
                      <span className="inline-block h-1.5 w-12 bg-purple-500 rounded-full"></span>
                      <span className="inline-block h-1.5 w-12 bg-purple-500 rounded-full"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {currentStep === 3 && (
          <>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 pt-10 pb-12 px-8 text-white text-center">
              <div className="bg-white/20 rounded-full p-3 inline-block mb-4">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Ready to Get Started?
              </h2>
              <p className="opacity-90">
                Join 10,000+ companies using Lyzr to accelerate their AI journey
              </p>
            </div>

            <div className="p-6 px-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="p-2 rounded-lg mr-3">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium text-indigo-800">Businesses like yours are already succeeding</h4>
                      <div className="flex ml-2">
                        {['bg-blue-600', 'bg-green-600', 'bg-yellow-500', 'bg-purple-600'].map((color, i) => (
                          <div key={i} className={`w-6 h-6 ${color} rounded-full border-2 border-white -ml-2 first:ml-0`}></div>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Companies report 40% faster AI implementation after using our assessment
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-2 rounded-lg mr-3">
                    <Target className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-indigo-800">Industry-specific insights</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Your recommendations are calibrated to your specific industry and role
                    </p>
                  </div>
                </div>
                
                <div className="p-3 bg-indigo-50 rounded-lg mt-4 flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <div className="bg-indigo-100 p-1.5 rounded-full">
                      <Lightbulb className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <p className="text-xs text-indigo-700">
                    <span className="font-medium">Pro Tip:</span> Be specific about your goals and challenges to get the most accurate recommendations.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-2 mt-8">
                <div className="flex space-x-1">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <div 
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index + 1 === currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
          
        <div className="bg-gray-50 p-4 flex justify-between border-t border-gray-200">
          {currentStep > 1 ? (
            <button
              onClick={prevStep}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Back
            </button>
          ) : (
            <div></div> // Empty div to maintain flex layout
          )}
          
          <button
            onClick={nextStep}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {currentStep === totalSteps ? "Start My Assessment" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;