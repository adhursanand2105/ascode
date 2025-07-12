import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Code, 
  Download,
  Trash2,
  LogOut,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Mail,
  MessageSquare,
  Zap
} from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    role: user?.role || "developer",
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    bugReports: true,
    projectUpdates: true,
    teamInvites: true,
    aiInsights: true,
    weeklyReports: false,
  });

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "dark",
    accentColor: "gold",
    fontSize: "medium",
    codeTheme: "dark",
    sidebarCollapsed: false,
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "team",
    showOnlineStatus: true,
    allowAnalytics: true,
    shareUsageData: true,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest('/api/auth/user', 'PUT', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleProfileUpdate = () => {
    updateProfileMutation.mutate(profileSettings);
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Delete Account",
      description: "This feature is not yet implemented.",
      variant: "destructive",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Data",
      description: "Your data export will be ready shortly.",
    });
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-100">Settings</h2>
        <p className="text-gray-400">Manage your account and application preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-charcoal-800">
          <TabsTrigger value="profile" className="data-[state=active]:bg-gold-500 data-[state=active]:text-charcoal-900">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-gold-500 data-[state=active]:text-charcoal-900">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-gold-500 data-[state=active]:text-charcoal-900">
            <Palette className="w-4 h-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-gold-500 data-[state=active]:text-charcoal-900">
            <Shield className="w-4 h-4 mr-2" />
            Privacy
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="glass-card border-gold-500/20">
            <CardHeader>
              <CardTitle className="text-gold-500">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.profileImageUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-gold-500 to-gold-400 text-charcoal-900 text-2xl">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" className="border-charcoal-600 text-gray-300 hover:bg-charcoal-700">
                    Change Avatar
                  </Button>
                  <p className="text-sm text-gray-400 mt-2">
                    Upload a new profile picture
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileSettings.firstName}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, firstName: e.target.value }))}
                    className="bg-charcoal-700 border-charcoal-600 text-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileSettings.lastName}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, lastName: e.target.value }))}
                    className="bg-charcoal-700 border-charcoal-600 text-gray-100"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileSettings.email}
                  onChange={(e) => setProfileSettings(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-charcoal-700 border-charcoal-600 text-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="role" className="text-gray-300">Role</Label>
                <Select value={profileSettings.role} onValueChange={(value) => setProfileSettings(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger className="bg-charcoal-700 border-charcoal-600 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal-700 border-charcoal-600">
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="lead">Team Lead</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleProfileUpdate}
                  disabled={updateProfileMutation.isPending}
                  className="bg-gradient-to-r from-gold-500 to-gold-400 text-charcoal-900 font-semibold"
                >
                  {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="glass-card border-gold-500/20">
            <CardHeader>
              <CardTitle className="text-gold-500">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="font-medium text-gray-100">Email Notifications</p>
                      <p className="text-sm text-gray-400">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="font-medium text-gray-100">Push Notifications</p>
                      <p className="text-sm text-gray-400">Receive push notifications on your device</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>

                <Separator className="bg-charcoal-600" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="font-medium text-gray-100">Bug Reports</p>
                      <p className="text-sm text-gray-400">Notifications about new bugs and updates</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.bugReports}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, bugReports: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Code className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="font-medium text-gray-100">Project Updates</p>
                      <p className="text-sm text-gray-400">Notifications about project changes</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.projectUpdates}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, projectUpdates: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-gold-500" />
                    <div>
                      <p className="font-medium text-gray-100">AI Insights</p>
                      <p className="text-sm text-gray-400">Notifications about AI analysis results</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.aiInsights}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, aiInsights: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="glass-card border-gold-500/20">
            <CardHeader>
              <CardTitle className="text-gold-500">Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Theme</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {[
                      { value: "light", icon: Sun, label: "Light" },
                      { value: "dark", icon: Moon, label: "Dark" },
                      { value: "system", icon: Monitor, label: "System" },
                    ].map((theme) => (
                      <Card
                        key={theme.value}
                        className={`cursor-pointer transition-all ${
                          appearanceSettings.theme === theme.value
                            ? "border-gold-500 bg-gold-500/10"
                            : "border-charcoal-600 hover:border-charcoal-500"
                        }`}
                        onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: theme.value }))}
                      >
                        <CardContent className="p-4 text-center">
                          <theme.icon className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-100">{theme.label}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Accent Color</Label>
                  <div className="grid grid-cols-4 gap-3 mt-2">
                    {[
                      { value: "gold", color: "bg-gold-500" },
                      { value: "blue", color: "bg-blue-500" },
                      { value: "green", color: "bg-green-500" },
                      { value: "purple", color: "bg-purple-500" },
                    ].map((color) => (
                      <div
                        key={color.value}
                        className={`w-12 h-12 rounded-lg cursor-pointer transition-all ${color.color} ${
                          appearanceSettings.accentColor === color.value
                            ? "ring-2 ring-white"
                            : "hover:scale-105"
                        }`}
                        onClick={() => setAppearanceSettings(prev => ({ ...prev, accentColor: color.value }))}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="fontSize" className="text-gray-300">Font Size</Label>
                  <Select value={appearanceSettings.fontSize} onValueChange={(value) => setAppearanceSettings(prev => ({ ...prev, fontSize: value }))}>
                    <SelectTrigger className="bg-charcoal-700 border-charcoal-600 text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-charcoal-700 border-charcoal-600">
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="codeTheme" className="text-gray-300">Code Editor Theme</Label>
                  <Select value={appearanceSettings.codeTheme} onValueChange={(value) => setAppearanceSettings(prev => ({ ...prev, codeTheme: value }))}>
                    <SelectTrigger className="bg-charcoal-700 border-charcoal-600 text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-charcoal-700 border-charcoal-600">
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="monokai">Monokai</SelectItem>
                      <SelectItem value="solarized">Solarized</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="glass-card border-gold-500/20">
            <CardHeader>
              <CardTitle className="text-gold-500">Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Profile Visibility</Label>
                  <Select value={privacySettings.profileVisibility} onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))}>
                    <SelectTrigger className="bg-charcoal-700 border-charcoal-600 text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-charcoal-700 border-charcoal-600">
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="team">Team Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-100">Show Online Status</p>
                    <p className="text-sm text-gray-400">Let others see when you're online</p>
                  </div>
                  <Switch
                    checked={privacySettings.showOnlineStatus}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showOnlineStatus: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-100">Allow Analytics</p>
                    <p className="text-sm text-gray-400">Help improve the platform with usage analytics</p>
                  </div>
                  <Switch
                    checked={privacySettings.allowAnalytics}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, allowAnalytics: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-100">Share Usage Data</p>
                    <p className="text-sm text-gray-400">Share anonymized usage data for AI improvements</p>
                  </div>
                  <Switch
                    checked={privacySettings.shareUsageData}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, shareUsageData: checked }))}
                  />
                </div>
              </div>

              <Separator className="bg-charcoal-600" />

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-100">Data Management</h3>
                <div className="flex space-x-4">
                  <Button
                    onClick={handleExportData}
                    variant="outline"
                    className="border-charcoal-600 text-gray-300 hover:bg-charcoal-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button
                    onClick={handleDeleteAccount}
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>

              <Separator className="bg-charcoal-600" />

              <div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-charcoal-600 text-gray-300 hover:bg-charcoal-700 w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
