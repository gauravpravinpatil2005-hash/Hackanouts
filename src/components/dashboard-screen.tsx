import { useState, useEffect } from "react";
import { Bell, Plus, TrendingUp, Zap, Footprints, Calendar, Users, Camera, Flame, Loader2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { apiCall } from "../utils/supabase/client";

interface DashboardScreenProps {
  onNavigate: (tab: string) => void;
  userId: string | null;
}

export function DashboardScreen({ onNavigate, userId }: DashboardScreenProps) {
  const [profile, setProfile] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Fetch user profile
        const profileData = await apiCall('/user/profile');
        setProfile(profileData.profile);

        // Fetch recent activities
        const activitiesData = await apiCall('/activities');
        setRecentActivities(activitiesData.activities.slice(0, 3));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--eco-background)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--eco-green-primary)' }} />
      </div>
    );
  }

  const quickStats = [
    { label: 'This Week', value: `${(profile?.co2Saved || 0).toFixed(1)} kg`, subtext: 'CO₂ saved', icon: TrendingUp, color: 'var(--eco-green-primary)' },
    { label: 'Streak', value: `${profile?.streak || 0} days`, subtext: 'current', icon: Flame, color: 'var(--streak-fire)' },
    { label: 'Level', value: `${profile?.level || 1}`, subtext: 'eco champion', icon: Zap, color: 'var(--eco-blue-primary)' },
  ];

  const ecoGoals = [
    { 
      title: 'Walk 50km this month', 
      progress: profile?.totalDistance ? Math.min((profile.totalDistance / 50) * 100, 100) : 0, 
      target: `${Math.min(profile?.totalDistance || 0, 50)}/50 km` 
    },
    { 
      title: 'Upload 5 eco-proofs', 
      progress: profile?.totalUploads ? Math.min((profile.totalUploads / 5) * 100, 100) : 0, 
      target: `${Math.min(profile?.totalUploads || 0, 5)}/5 uploads` 
    },
    { 
      title: 'Join 2 NGO events', 
      progress: profile?.eventsJoined ? Math.min((profile.eventsJoined / 2) * 100, 100) : 0, 
      target: `${Math.min(profile?.eventsJoined || 0, 2)}/2 events` 
    }
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20" style={{ backgroundColor: 'var(--eco-background)' }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-8 text-white" style={{ background: 'linear-gradient(135deg, var(--eco-green-primary) 0%, var(--eco-green-light) 100%)' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 border-2 border-white/20">
              <AvatarImage src={profile?.avatar} />
              <AvatarFallback>{profile?.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold">Good morning, {profile?.name || 'User'}!</h1>
              <p className="text-green-100 text-sm">Track. Save. Reward. 🌱</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
            <Bell className="w-5 h-5" />
          </Button>
        </div>

        {/* Eco Score */}
        <Card className="bg-white/10 backdrop-blur-sm border-0 p-6">
          <div className="text-center">
            <p className="text-green-100 text-sm mb-1">Your Eco Score</p>
            <div className="text-4xl font-bold mb-2">{profile?.ecoScore || 0}</div>
            <div className="flex items-center justify-center space-x-2">
              <Badge variant="secondary" className="bg-green-400 text-green-900 border-0">
                +{profile?.weeklyPoints || 0} this week
              </Badge>
              <TrendingUp className="w-4 h-4 text-green-200" />
            </div>
            <Progress value={((profile?.points || 0) % 1000) / 10} className="mt-3 h-2" />
            <p className="text-green-100 text-xs mt-1">{1000 - ((profile?.points || 0) % 1000)} points to Level {(profile?.level || 1) + 1}</p>
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="px-6 -mt-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4 text-center border-0 shadow-sm">
                <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: stat.color }} />
                <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                <p className="font-semibold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.subtext}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => onNavigate('tracker')}
            className="h-16 text-white rounded-xl flex flex-col items-center justify-center space-y-1 shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--eco-blue-primary) 0%, #42A5F5 100%)' }}
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm">Track Activity</span>
          </Button>
          
          <Button 
            onClick={() => onNavigate('upload')}
            className="h-16 text-white rounded-xl flex flex-col items-center justify-center space-y-1 shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--eco-green-primary) 0%, var(--eco-green-light) 100%)' }}
          >
            <Camera className="w-6 h-6" />
            <span className="text-sm">Upload Proof</span>
          </Button>
          
          <Button 
            onClick={() => onNavigate('events')}
            className="h-16 text-white rounded-xl flex flex-col items-center justify-center space-y-1 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #8E24AA 0%, #BA68C8 100%)' }}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-sm">Join Events</span>
          </Button>
          
          <Button 
            onClick={() => onNavigate('community')}
            className="h-16 text-white rounded-xl flex flex-col items-center justify-center space-y-1 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8A65 100%)' }}
          >
            <Users className="w-6 h-6" />
            <span className="text-sm">Community</span>
          </Button>
        </div>
      </div>

      {/* Eco Goals */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Personal Eco Goals 🎯</h2>
          <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">
            View all
          </Button>
        </div>
        
        <div className="space-y-3">
          {ecoGoals.map((goal, index) => (
            <Card key={index} className="p-4 border-0 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-800 text-sm">{goal.title}</h3>
                <span className="text-xs text-gray-500">{goal.target}</span>
              </div>
              <Progress value={goal.progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">{goal.progress}% complete</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="px-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('activities')}
            className="text-green-600 hover:bg-green-50"
          >
            View all
          </Button>
        </div>
        
        {recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <Card key={activity.id} className="p-4 border-0 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                           style={{ backgroundColor: 'var(--eco-green-lighter)' }}>
                        <Icon className="w-5 h-5" style={{ color: 'var(--eco-green-primary)' }} />
                      </div>
                      <div>
                        <p className="font-medium capitalize">{activity.type}</p>
                        <p className="text-sm text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{activity.distance}</p>
                      <p className="text-sm" style={{ color: 'var(--eco-green-primary)' }}>
                        {activity.type === 'upload' ? `+${activity.co2}` : `-${activity.co2} CO₂`}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-6 border-0 shadow-sm text-center">
            <Footprints className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <h3 className="font-medium text-gray-800 mb-2">No activities yet</h3>
            <p className="text-sm text-gray-600 mb-4">Start tracking your eco-friendly activities!</p>
            <Button 
              onClick={() => onNavigate('tracker')}
              className="text-white"
              style={{ backgroundColor: 'var(--eco-green-primary)' }}
            >
              Track Activity
            </Button>
          </Card>
        )}

        {/* Streak Motivation */}
        <Card className="mt-6 p-6 text-center border-0" 
              style={{ background: 'linear-gradient(135deg, var(--eco-green-lighter) 0%, var(--eco-blue-light) 100%)' }}>
          <Flame className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--streak-fire)' }} />
          <h3 className="font-semibold text-gray-800 mb-2">🔥 7-Day Streak!</h3>
          <p className="text-sm text-gray-600 mb-3">
            You're on fire! Keep your eco-streak going for bonus points.
          </p>
          <Button 
            size="sm"
            className="text-white"
            style={{ backgroundColor: 'var(--eco-green-primary)' }}
            onClick={() => onNavigate('tracker')}
          >
            Continue Streak
          </Button>
        </Card>
      </div>
    </div>
  );
}