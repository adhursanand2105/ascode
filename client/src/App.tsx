import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import BugTracker from "@/pages/BugTracker";
import Analytics from "@/pages/Analytics";
import Team from "@/pages/Team";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import SplashScreen from "@/components/SplashScreen";
import { useEffect, useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(false); // Disable splash screen

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/projects" component={() => (
        <Layout>
          <Projects />
        </Layout>
      )} />
      <Route path="/bugs" component={() => (
        <Layout>
          <BugTracker />
        </Layout>
      )} />
      <Route path="/analytics" component={() => (
        <Layout>
          <Analytics />
        </Layout>
      )} />
      <Route path="/team" component={() => (
        <Layout>
          <Team />
        </Layout>
      )} />
      <Route path="/settings" component={() => (
        <Layout>
          <Settings />
        </Layout>
      )} />
      <Route path="/dashboard" component={() => (
        <Layout>
          <Dashboard />
        </Layout>
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-charcoal-900 text-gray-100">
        <Router />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
