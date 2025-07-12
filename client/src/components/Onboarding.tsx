import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Sparkles, 
  Users, 
  BarChart3, 
  Bug, 
  Shield, 
  Zap,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

const onboardingSteps = [
  {
    id: 1,
    title: "Code Anywhere, Anytime",
    description: "Build full-featured Android apps directly on your mobile device with our premium IDE. No desktop required.",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    icon: Code,
    features: ["Mobile-first IDE", "Full Android SDK", "Real-time compilation"],
  },
  {
    id: 2,
    title: "AI-Powered Development",
    description: "Let artificial intelligence help you write better code, detect bugs, and optimize performance automatically.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    icon: Sparkles,
    features: ["Smart code completion", "Bug prediction", "Performance optimization"],
  },
  {
    id: 3,
    title: "Advanced Bug Tracking",
    description: "Track, analyze, and resolve bugs with our intelligent bug tracking system powered by machine learning.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    icon: Bug,
    features: ["AI bug categorization", "Smart priority detection", "Resolution suggestions"],
  },
  {
    id: 4,
    title: "Team Collaboration",
    description: "Work seamlessly with your team using real-time collaboration features and project management tools.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    icon: Users,
    features: ["Real-time editing", "Team chat", "Project sharing"],
  },
  {
    id: 5,
    title: "Powerful Analytics",
    description: "Get deep insights into your development process with comprehensive analytics and reporting.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    icon: BarChart3,
    features: ["Code quality metrics", "Performance tracking", "Team productivity"],
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = onboardingSteps[currentStep];
  const IconComponent = step.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="glass-card border-gold-500/20 shadow-2xl">
          <CardContent className="p-8">
            {/* Progress Indicators */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-2">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? 'w-8 bg-gold-500'
                        : index < currentStep
                        ? 'w-2 bg-gold-500'
                        : 'w-2 bg-charcoal-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-8">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-charcoal-900" />
              </div>

              {/* Image */}
              <div className="rounded-xl mb-6 overflow-hidden">
                <img 
                  src={step.image} 
                  alt={step.title}
                  className="w-full h-48 object-cover"
                />
              </div>

              {/* Title and Description */}
              <h2 className="text-2xl font-bold text-gold-500 mb-4">{step.title}</h2>
              <p className="text-gray-400 mb-6 leading-relaxed">{step.description}</p>

              {/* Features */}
              <div className="space-y-2 mb-8">
                {step.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="text-gray-400 hover:text-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-gray-400 hover:text-gray-100"
              >
                Skip Tour
              </Button>

              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
                {currentStep < onboardingSteps.length - 1 && (
                  <ChevronRight className="w-4 h-4 ml-1" />
                )}
              </Button>
            </div>

            {/* Step Counter */}
            <div className="text-center mt-6">
              <span className="text-xs text-gray-500">
                {currentStep + 1} of {onboardingSteps.length}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Features highlight */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Card className="glass-card border-gold-500/10">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-gold-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-100 mb-1">AI-Powered</h3>
              <p className="text-xs text-gray-400">Smart code analysis and suggestions</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-gold-500/10">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-gold-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-100 mb-1">Secure</h3>
              <p className="text-xs text-gray-400">Enterprise-grade security</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
