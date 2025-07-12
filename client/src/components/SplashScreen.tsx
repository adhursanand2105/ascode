import { useEffect, useState } from "react";
import { Code, Zap } from "lucide-react";

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing AndroidIDE...");

  useEffect(() => {
    const loadingSteps = [
      { progress: 20, text: "Loading development environment..." },
      { progress: 40, text: "Connecting to AI services..." },
      { progress: 60, text: "Setting up workspace..." },
      { progress: 80, text: "Preparing dashboard..." },
      { progress: 100, text: "Ready to code!" },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setProgress(loadingSteps[currentStep].progress);
        setLoadingText(loadingSteps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 flex items-center justify-center z-50">
      <div className="text-center animate-fade-in">
        {/* Logo Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center animate-pulse-glow">
            <Code className="w-12 h-12 text-charcoal-900 animate-float" />
          </div>
          
          {/* Floating particles */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-2 right-2 w-2 h-2 bg-gold-500 rounded-full animate-ping delay-100"></div>
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-gold-400 rounded-full animate-ping delay-300"></div>
            <div className="absolute top-1/2 left-0 w-1 h-1 bg-gold-500 rounded-full animate-ping delay-500"></div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="mb-2">
          <h1 className="text-4xl font-bold text-gold-500 mb-1 animate-slide-up">
            AndroidIDE
          </h1>
          <p className="text-lg text-gray-400 animate-slide-up delay-100">
            Premium Mobile IDE
          </p>
        </div>

        {/* AI Badge */}
        <div className="flex items-center justify-center space-x-2 mb-8 animate-slide-up delay-200">
          <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-gold-500/20 to-gold-400/20 border border-gold-500/30 rounded-full">
            <Zap className="w-3 h-3 text-gold-500" />
            <span className="text-xs text-gold-400 font-medium">AI-Powered</span>
          </div>
        </div>

        {/* Loading Progress */}
        <div className="w-80 mx-auto animate-slide-up delay-300">
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2">{loadingText}</p>
            <div className="w-full h-2 bg-charcoal-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {/* Loading percentage */}
          <div className="text-right">
            <span className="text-xs text-gray-500">{progress}%</span>
          </div>
        </div>

        {/* Features showcase */}
        <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto animate-slide-up delay-500">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Code className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-xs text-gray-400">Full IDE</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xs text-gray-400">AI Assistant</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-green-500/20 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-green-400"></div>
            </div>
            <p className="text-xs text-gray-400">Real-time</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-xs text-gray-600 animate-slide-up delay-700">
          <p>© 2024 AndroidIDE. Premium Development Platform.</p>
        </div>
      </div>
    </div>
  );
}
