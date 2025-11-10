import { useState, useEffect, useRef } from "react";
import { Settings, Edit, Share, Trophy, TrendingUp, Calendar, Target, Zap, Loader2, LogOut, Star, Gift, Camera, Upload, X, MessageCircle, Send, Bot } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { apiCall } from "../utils/supabase/client";
import { toast } from "sonner@2.0.3";

interface ProfileScreenProps {
  userId: string | null;
  onLogout: () => void;
}

export function ProfileScreen({ userId, onLogout }: ProfileScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
  });
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'bot', message: string}>>([
    { role: 'bot', message: "Hi! I'm your ECO-Tracker assistant. How can I help you today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const data = await apiCall('/user/profile');
        setProfileData(data.profile);
      } catch (error) {
        // API error - using demo data fallback
        
        // Use demo data if API fails
        setProfileData({
          id: userId,
          name: 'Demo User',
          email: 'demo@ecotracker.com',
          ecoScore: 2450,
          level: 5,
          points: 2450,
          streak: 7,
          co2Saved: 15.3,
          weeklyPoints: 420,
          activities: 23,
          joinedDate: new Date().toISOString(),
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  useEffect(() => {
    if (profileData) {
      setEditForm({
        name: profileData.name || '',
        email: profileData.email || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
      });
    }
  }, [profileData]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleEditProfile = () => {
    setIsEditDialogOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      // Update profile via API
      await apiCall('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(editForm),
      });
      
      // Update local state
      setProfileData({
        ...profileData,
        ...editForm,
        avatar: tempAvatar || profileData.avatar,
      });
      
      if (tempAvatar) {
        setProfileData((prev: any) => ({ ...prev, avatar: tempAvatar }));
      }
      
      toast.success("Profile updated successfully!");
      setIsEditDialogOpen(false);
    } catch (error) {
      // Fallback for demo
      setProfileData({
        ...profileData,
        ...editForm,
        avatar: tempAvatar || profileData.avatar,
      });
      toast.success("Profile updated successfully!");
      setIsEditDialogOpen(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatar(reader.result as string);
        toast.success("Photo uploaded! Save your profile to apply changes.");
      };
      reader.readAsDataURL(file);
    }
    setIsImageMenuOpen(false);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', message: userMessage }]);
    setChatInput('');
    
    // Simulate bot response
    setTimeout(() => {
      const response = getBotResponse(userMessage);
      setChatMessages(prev => [...prev, { role: 'bot', message: response }]);
    }, 600);
  };

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('point') || lowerMessage.includes('earn')) {
      return "You can earn points by:\n• Walking/Cycling: 10 points per km\n• Uploading verified eco-activities: 50-150 points\n• Attending events: 50-200 points\n\nYour current points: " + (profileData?.points || 0);
    } else if (lowerMessage.includes('badge') || lowerMessage.includes('achievement')) {
      return "Badges are earned by completing eco-friendly activities! Check the Badges tab to see all available achievements and your progress.";
    } else if (lowerMessage.includes('level')) {
      return "Your current level is " + (profileData?.level || 1) + ". You need " + (1000 - ((profileData?.points || 0) % 1000)) + " more points to reach the next level!";
    } else if (lowerMessage.includes('reward') || lowerMessage.includes('discount')) {
      return "With 100+ points, you can access discounts from partner brands like Patagonia, The Body Shop, EcoRight, and Adidas. Check the Rewards tab!";
    } else if (lowerMessage.includes('event')) {
      return "You can join eco-events organized by NGOs through the Events tab. Events earn you 50-200 points and help make a real impact!";
    } else if (lowerMessage.includes('track') || lowerMessage.includes('activity')) {
      return "Use the Live Tracker to record your walking or cycling activities. You'll earn 10 points per kilometer traveled!";
    } else if (lowerMessage.includes('upload') || lowerMessage.includes('verify')) {
      return "Upload photos of your eco-friendly activities in the Upload tab. After admin verification, you'll earn 50-150 points based on the activity impact.";
    } else if (lowerMessage.includes('streak')) {
      return "Your current streak is " + (profileData?.streak || 0) + " days! Keep logging activities daily to maintain your streak and earn bonus points.";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return "I can help you with:\n• How to earn points\n• Information about badges and levels\n• Rewards and discounts\n• Events and activities\n• Tracking your eco-impact\n\nWhat would you like to know?";
    } else {
      return "Thanks for your question! I can help you with points, badges, levels, rewards, events, and tracking. What would you like to know more about?";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--eco-background)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--eco-green-primary)' }} />
      </div>
    );
  }
  const userData = {
    name: profileData?.name || "User",
    email: profileData?.email || "user@ecotracker.com",
    joinDate: profileData?.joinedDate || "Recently",
    level: profileData?.level || 1,
    nextLevelProgress: profileData?.points ? ((profileData.points % 1000) / 10) : 0,
    ecoScore: profileData?.ecoScore || profileData?.points || 0,
    totalCO2Saved: `${(profileData?.co2Saved || 0).toFixed(1)} kg`,
    totalActivities: profileData?.activities || 0,
    currentStreak: profileData?.streak || 0,
    longestStreak: profileData?.streak || 0,
    avatar: profileData?.avatar || "https://images.unsplash.com/photo-1617441356293-de82acf3552f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBwcm9maWxlJTIwcGVyc29ufGVufDF8fHx8MTc1NzU5Nzc4N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  };

  const monthlyData: any[] = [];

  const recentAchievements = [
    { name: "Streak Keeper", description: "7-day streak", earnedDate: "Today", icon: "🔥" },
    { name: "Eco Warrior", description: "100kg CO₂ saved", earnedDate: "1 week ago", icon: "🌱" },
    { name: "Cycle Master", description: "50km cycling", earnedDate: "2 weeks ago", icon: "🚴" }
  ];

  const stats = [
    { label: "Total CO₂", value: userData.totalCO2Saved, subtext: "saved", icon: TrendingUp, color: "text-green-600" },
    { label: "Activities", value: `${userData.totalActivities}`, subtext: "completed", icon: Target, color: "text-blue-600" },
    { label: "Streak", value: `${userData.currentStreak} days`, subtext: "current", icon: Zap, color: "text-yellow-600" },
    { label: "Level", value: `${userData.level}`, subtext: "eco level", icon: Trophy, color: "text-purple-600" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 pt-12 pb-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="w-20 h-20 border-4 border-white/20">
                <AvatarImage src={tempAvatar || userData.avatar} />
                <AvatarFallback>{userData.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <button
                onClick={() => setIsImageMenuOpen(true)}
                className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
              >
                <Camera className="w-4 h-4 text-green-600" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              <p className="text-green-100">{userData.email}</p>
              <p className="text-sm text-green-200">Member since {userData.joinDate}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Share className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Points & Level Progress */}
        <div className="space-y-3">
          {/* Eco Points Card */}
          <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 border-0 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Star className="w-7 h-7 text-yellow-600 fill-yellow-600" />
                </div>
                <div>
                  <p className="text-yellow-900 text-sm font-medium">Total Eco Points</p>
                  <p className="text-3xl font-bold text-yellow-900">{profileData?.points || 0}</p>
                </div>
              </div>
              <Gift className="w-8 h-8 text-yellow-800" />
            </div>
          </Card>

          {/* Level Progress Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-0 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-green-100 text-sm">Level {userData.level} • Eco Champion</p>
                <p className="text-2xl font-bold">{userData.ecoScore}</p>
              </div>
              <div className="text-right">
                <p className="text-green-100 text-sm">Next Level</p>
                <p className="font-semibold">227 points to go</p>
              </div>
            </div>
            <Progress value={userData.nextLevelProgress} className="h-2" />
          </Card>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 -mt-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4 border-0 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.subtext}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Impact Chart - Simplified */}
      <div className="px-6 mb-6">
        <Card className="p-6 border-0 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Monthly Impact</h2>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-1" />
              6 months
            </Button>
          </div>
          
          {/* Simplified chart visualization */}
          <div className="h-48 mb-4 flex items-end justify-between px-4">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex flex-col items-center">
                <div 
                  className="bg-green-500 rounded-t-md mb-2 transition-all hover:bg-green-600" 
                  style={{ 
                    height: `${(data.co2 / 80) * 120}px`,
                    width: '24px'
                  }}
                ></div>
                <span className="text-xs text-gray-600">{data.month}</span>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-gray-800">{userData.totalCO2Saved}</p>
              <p className="text-sm text-gray-600">Total CO₂ Saved</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800">{userData.totalActivities}</p>
              <p className="text-sm text-gray-600">Total Activities</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800">{userData.longestStreak}</p>
              <p className="text-sm text-gray-600">Longest Streak</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Achievements */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Achievements</h2>
          <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">
            View all
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentAchievements.map((achievement, index) => (
            <Card key={index} className="p-4 border-0 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-xl">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{achievement.name}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    {achievement.earnedDate}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Account Actions */}
      <div className="px-6 pb-6">
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start h-12"
            onClick={handleEditProfile}
          >
            <Edit className="w-5 h-5 mr-3" />
            Edit Profile
          </Button>
          
          <Button variant="outline" className="w-full justify-start h-12">
            <Settings className="w-5 h-5 mr-3" />
            Settings & Privacy
          </Button>
          
          <Button variant="outline" className="w-full justify-start h-12">
            <Share className="w-5 h-5 mr-3" />
            Share Profile
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start h-12 text-red-600 border-red-200 hover:bg-red-50"
            onClick={onLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Log Out
          </Button>
        </div>
      </div>

      {/* Floating Chatbot Button */}
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information and save your changes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                placeholder="City, Country"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Tell us about yourself and your eco journey..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Upload Menu Dialog */}
      <Dialog open={isImageMenuOpen} onOpenChange={setIsImageMenuOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogDescription>
              Choose a new profile picture from your camera or gallery.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <Button
              variant="outline"
              className="w-full justify-start h-14"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="w-5 h-5 mr-3" />
              Take Photo
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-14"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-5 h-5 mr-3" />
              Choose from Gallery
            </Button>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Chatbot Sheet */}
      <Sheet open={isChatbotOpen} onOpenChange={setIsChatbotOpen}>
        <SheetContent side="bottom" className="h-[600px] sm:h-[500px]">
          <SheetHeader>
            <SheetTitle className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <p>ECO-Tracker Assistant</p>
                <p className="text-sm font-normal text-gray-500">Online • Always here to help</p>
              </div>
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col h-[calc(100%-80px)] mt-6">
            {/* Chat Messages */}
            <ScrollArea className="flex-1 pr-4 mb-4">
              <div ref={chatScrollRef} className="space-y-4">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.role === 'user'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Quick Questions */}
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setChatInput("How do I earn points?");
                  handleSendMessage();
                }}
                className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs hover:bg-green-100 transition-colors"
              >
                How do I earn points?
              </button>
              <button
                onClick={() => {
                  setChatInput("What are the rewards?");
                  handleSendMessage();
                }}
                className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs hover:bg-green-100 transition-colors"
              >
                What are rewards?
              </button>
              <button
                onClick={() => {
                  setChatInput("How do levels work?");
                  handleSendMessage();
                }}
                className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs hover:bg-green-100 transition-colors"
              >
                How do levels work?
              </button>
            </div>

            {/* Input Area */}
            <div className="flex items-center space-x-2 border-t pt-4">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="bg-green-600 hover:bg-green-700 rounded-full"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}