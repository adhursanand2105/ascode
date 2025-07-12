import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Code, 
  Zap, 
  Shield, 
  Users, 
  BarChart3, 
  GitBranch,
  Smartphone,
  ArrowRight,
  CheckCircle,
  Star,
  Mail,
  Lock,
  User,
  Github,
  Chrome,
  Eye,
  EyeOff
} from "lucide-react";

export default function Landing() {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const handleLogin = async () => {
    setIsLoading(true);
    window.location.href = "/api/login";
  };

  const handleSkipLogin = () => {
    // Skip login and go directly to the dashboard
    window.location.href = "/projects";
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, redirect to OAuth login
    handleLogin();
  };

  const features = [
    {
      icon: Code,
      title: "Advanced Code Editor",
      description: "VS Code-like editing experience with syntax highlighting, IntelliSense, and debugging tools.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "AI-Powered Analysis",
      description: "Intelligent bug detection, code quality analysis, and automated fix suggestions.",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: GitBranch,
      title: "Project Management",
      description: "Comprehensive project tracking with team collaboration and version control integration.",
      gradient: "from-green-500 to-teal-600"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time insights into code quality, team performance, and project health metrics.",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with encrypted data storage and secure authentication protocols.",
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Real-time collaborative editing, code reviews, and integrated communication tools.",
      gradient: "from-indigo-500 to-blue-600"
    }
  ];

  const stats = [
    { value: "99.9%", label: "Uptime" },
    { value: "10M+", label: "Lines of Code" },
    { value: "50K+", label: "Developers" },
    { value: "24/7", label: "Support" }
  ];

  if (showLoginForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="glass-card border-gold-500/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-charcoal-900" />
              </div>
              <CardTitle className="text-2xl font-bold text-gold-500">AndroidIDE</CardTitle>
              <CardDescription className="text-gray-400">
                {isSignUp ? "Create your account" : "Welcome back"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-300">
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="pl-10 bg-charcoal-800 border-charcoal-600 text-gray-100 focus:border-gold-500 hover:border-gold-500/50 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-300">
                        Last Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="pl-10 bg-charcoal-800 border-charcoal-600 text-gray-100 focus:border-gold-500 hover:border-gold-500/50 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="pl-10 bg-charcoal-800 border-charcoal-600 text-gray-100 focus:border-gold-500 hover:border-gold-500/50 transition-colors"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="pl-10 pr-10 bg-charcoal-800 border-charcoal-600 text-gray-100 focus:border-gold-500 hover:border-gold-500/50 transition-colors"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-100 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 font-semibold hover:from-gold-400 hover:to-gold-300 hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  {isLoading ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-charcoal-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-charcoal-800 text-gray-400">or continue with</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="bg-charcoal-800 border-charcoal-600 text-gray-100 hover:bg-charcoal-700 hover:border-gold-500/50 hover:scale-[1.02] transition-all duration-200"
                  onClick={handleLogin}
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  className="bg-charcoal-800 border-charcoal-600 text-gray-100 hover:bg-charcoal-700 hover:border-gold-500/50 hover:scale-[1.02] transition-all duration-200"
                  onClick={handleLogin}
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Google
                </Button>
              </div>
              
              <div className="text-center space-y-4">
                <Button
                  variant="ghost"
                  className="text-gray-400 hover:text-gray-100 hover:bg-charcoal-700 transition-all duration-200"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </Button>
                
                <div className="border-t border-charcoal-600 pt-4">
                  <Button
                    variant="ghost"
                    className="text-gold-400 hover:text-gold-300 hover:bg-gold-500/10 underline transition-all duration-200"
                    onClick={handleSkipLogin}
                  >
                    Skip for now - Try the editor
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-charcoal-700/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-charcoal-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gold-500">AndroidIDE</h1>
                <p className="text-xs text-gray-400">Premium Mobile IDE</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-gold-500/20 to-gold-400/20 border-gold-500/30 text-gold-400">
                <Zap className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
              <Button 
                onClick={() => setShowLoginForm(true)}
                className="bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 font-semibold hover:from-gold-400 hover:to-gold-300 hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gold-500/20 to-gold-400/20 border border-gold-500/30 rounded-full text-gold-400 text-sm mb-6">
            <Star className="w-4 h-4" />
            <span>Premium Android Development Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gold-500 to-gold-400 bg-clip-text text-transparent">
            Build Android Apps
            <br />
            with AI Power
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Professional mobile IDE with advanced code editing, AI-powered bug detection, 
            and comprehensive project management tools for Android developers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setShowLoginForm(true)}
              className="bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 font-semibold px-8 py-4 text-lg hover:from-gold-400 hover:to-gold-300 hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Building Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleSkipLogin}
              className="border-gold-500/30 text-gold-400 hover:bg-gold-500/10 hover:border-gold-500 px-8 py-4 text-lg hover:scale-[1.02] transition-all duration-200"
            >
              Try Live Demo
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-gold-500 mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-100 mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}