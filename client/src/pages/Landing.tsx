import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Onboarding from "@/components/Onboarding";
import { Code, Sparkles, Users, BarChart3 } from "lucide-react";

export default function Landing() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="glass-card border-gold-500/20 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center">
              <Code className="w-8 h-8 text-charcoal-900" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gold-500">AndroidIDE</CardTitle>
              <CardDescription className="text-gray-400">
                Premium Mobile IDE with AI-powered development
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-charcoal-800">
                <TabsTrigger value="signin" className="data-[state=active]:bg-gold-500 data-[state=active]:text-charcoal-900">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-gold-500 data-[state=active]:text-charcoal-900">
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="developer@example.com"
                    className="bg-charcoal-800 border-charcoal-600 text-gray-100 placeholder-gray-500 focus:border-gold-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-charcoal-800 border-charcoal-600 text-gray-100 placeholder-gray-500 focus:border-gold-500"
                  />
                </div>
                
                <Button 
                  onClick={handleSignIn}
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Sign In
                </Button>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Developer"
                    className="bg-charcoal-800 border-charcoal-600 text-gray-100 placeholder-gray-500 focus:border-gold-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-signup" className="text-gray-300">Email</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="developer@example.com"
                    className="bg-charcoal-800 border-charcoal-600 text-gray-100 placeholder-gray-500 focus:border-gold-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password-signup" className="text-gray-300">Password</Label>
                  <Input
                    id="password-signup"
                    type="password"
                    placeholder="••••••••"
                    className="bg-charcoal-800 border-charcoal-600 text-gray-100 placeholder-gray-500 focus:border-gold-500"
                  />
                </div>
                
                <Button 
                  onClick={handleSignIn}
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Create Account
                </Button>
              </TabsContent>
            </Tabs>
            
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setShowOnboarding(true)}
                className="text-gold-500 hover:text-gold-400 hover:bg-gold-500/10"
              >
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Feature highlights */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Card className="glass-card border-gold-500/10">
            <CardContent className="p-4 text-center">
              <Sparkles className="w-8 h-8 text-gold-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-100 mb-1">AI-Powered</h3>
              <p className="text-xs text-gray-400">Smart code analysis and bug detection</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-gold-500/10">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-gold-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-100 mb-1">Team Collaboration</h3>
              <p className="text-xs text-gray-400">Real-time project collaboration</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
