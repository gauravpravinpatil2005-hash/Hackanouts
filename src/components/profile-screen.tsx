import { useState, useEffect } from "react";
import { Settings, Edit, Share, Trophy, TrendingUp, Calendar, Target, Zap, Loader2, LogOut, Star, Gift } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { apiCall } from "../utils/supabase/client";

interface ProfileScreenProps {
  userId: string | null;
  onLogout: () => void;
}

export function ProfileScreen({ userId, onLogout }: ProfileScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

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
            <Avatar className="w-20 h-20 border-4 border-white/20">
              <AvatarImage src={userData.avatar} />
              <AvatarFallback>{userData.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
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
          <Button variant="outline" className="w-full justify-start h-12">
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
    </div>
  );
}