import React from 'react';
import { ArrowRight, BrainCircuit, Cpu, LineChart, Users } from 'lucide-react';

interface LandingScreenProps {
  onStartChat: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onStartChat }) => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-24">
        <div className="lg:w-1/2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-900 leading-tight">
            Discover Your <span className="text-indigo-600">AI Readiness</span> Journey
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            Chat with our AI Navigator to get personalized recommendations and a roadmap 
            for implementing AI in your organization, no matter where you are in your journey.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onStartChat}
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors flex items-center"
            >
              Start Your Assessment <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="px-8 py-4 border border-indigo-600 text-indigo-600 rounded-lg text-lg font-medium hover:bg-indigo-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
        <div className="lg:w-1/2">
          <div className="relative">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-70"></div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-purple-100 rounded-full filter blur-3xl opacity-70"></div>
            <img 
              src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
              alt="AI Technology" 
              className="relative z-10 rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center text-indigo-900 mb-12">
          Why Assess Your AI Readiness?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <BrainCircuit className="h-10 w-10 text-indigo-600" />,
              title: "Personalized Roadmap",
              description: "Get a tailored plan for implementing AI based on your current stage and goals."
            },
            {
              icon: <Cpu className="h-10 w-10 text-indigo-600" />,
              title: "Use Case Discovery",
              description: "Identify the most impactful AI use cases for your specific industry and role."
            },
            {
              icon: <LineChart className="h-10 w-10 text-indigo-600" />,
              title: "ROI Maximization",
              description: "Learn how to measure and maximize the return on your AI investments."
            },
            {
              icon: <Users className="h-10 w-10 text-indigo-600" />,
              title: "Team Alignment",
              description: "Align your team around a clear AI strategy and implementation plan."
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-indigo-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-900 rounded-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your AI Journey?
          </h2>
          <p className="text-indigo-100 text-lg mb-8">
            Our AI Readiness Chat Agent will guide you through a personalized assessment and provide
            tailored recommendations to help you succeed with AI.
          </p>
          <button 
            onClick={onStartChat}
            className="px-8 py-4 bg-white text-indigo-900 rounded-lg text-lg font-medium hover:bg-indigo-50 transition-colors"
          >
            Chat with AI Navigator
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;