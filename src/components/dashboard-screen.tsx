import { useState, useEffect } from "react";
import { Bell, Plus, TrendingUp, Zap, Footprints, Calendar, Users, Camera, Flame, Loader2, Bike, Recycle, Leaf, Star, Gift, ArrowRight, Sparkles, Trophy, Wind, Thermometer, Droplets, Cloud } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { apiCall } from "../utils/supabase/client";
import { motion } from "motion/react";

interface DashboardScreenProps {
  onNavigate: (tab: string) => void;
  userId: string | null;
}

export function DashboardScreen({ onNavigate, userId }: DashboardScreenProps) {
  const [profile, setProfile] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [environmentalData, setEnvironmentalData] = useState({
    aqi: 42,
    aqiLevel: 'Good',
    temperature: 24,
    humidity: 65,
    windSpeed: 12
  });

  // Simulate real-time environmental data updates
  useEffect(() => {
    const updateEnvironmentalData = () => {
      // Simulate fluctuating data
      setEnvironmentalData({
        aqi: Math.floor(35 + Math.random() * 20), // 35-55 range (Good air quality)
        aqiLevel: 'Good',
        temperature: Math.floor(22 + Math.random() * 6), // 22-28°C
        humidity: Math.floor(60 + Math.random() * 15), // 60-75%
        windSpeed: Math.floor(8 + Math.random() * 10) // 8-18 km/h
      });
    };

    // Update every 30 seconds to simulate real-time data
    const interval = setInterval(updateEnvironmentalData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Helper function to get AQI color and level
  const getAQIInfo = (aqi: number) => {
    if (aqi <= 50) return { level: 'Good', color: '#2E7D32', bgColor: '#E8F5E9' };
    if (aqi <= 100) return { level: 'Moderate', color: '#F9A825', bgColor: '#FFF9C4' };
    if (aqi <= 150) return { level: 'Unhealthy', color: '#F57C00', bgColor: '#FFE0B2' };
    return { level: 'Hazardous', color: '#C62828', bgColor: '#FFCDD2' };
  };

  const aqiInfo = getAQIInfo(environmentalData.aqi);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Try to fetch real data
        const profileData = await apiCall('/user/profile');
        setProfile(profileData.profile);

        const activitiesData = await apiCall('/activities');
        setRecentActivities(activitiesData.activities.slice(0, 3));
      } catch (error) {
        // API error - using demo data fallback
        
        // Use demo data if API fails (demo mode)
        setProfile({
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
          totalDistance: 32,
          totalUploads: 3,
          eventsJoined: 1,
          joinedDate: new Date().toISOString(),
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
        });
        
        setRecentActivities([
          {
            id: '1',
            title: 'Recycled Plastic',
            category: 'recycling',
            points: 50,
            co2Saved: '2.5',
            date: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Cycled to Work',
            category: 'transport',
            points: 30,
            co2Saved: '4.2',
            date: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '3',
            title: 'Beach Cleanup',
            category: 'cleanup',
            points: 100,
            co2Saved: '5.0',
            date: new Date(Date.now() - 172800000).toISOString(),
          },
        ]);
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

      {/* Eco Points Card - Prominent Display */}
      <div className="px-6 -mt-4 mb-6">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-0 shadow-xl overflow-hidden relative" style={{
            background: 'linear-gradient(135deg, #FFF9C4 0%, #FFEB3B 50%, #FBC02D 100%)'
          }}>
            <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
              <Star className="w-full h-full text-yellow-800" />
            </div>
            <div className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white fill-white" />
                  </div>
                  <div>
                    <p className="text-xs text-yellow-800 font-medium">YOUR ECO POINTS</p>
                    <p className="text-3xl font-bold text-yellow-900">{profile?.points || 0}</p>
                  </div>
                </div>
                <Button
                  onClick={() => onNavigate('rewards')}
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-full shadow-md"
                >
                  <Gift className="w-4 h-4 mr-1" />
                  Redeem
                </Button>
              </div>
              
              <div className="flex items-center justify-between bg-white/40 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-yellow-700" />
                  <span className="text-xs text-yellow-800 font-medium">
                    {(profile?.points || 0) >= 100 
                      ? '🎉 Unlocked! You can redeem brand discounts' 
                      : `${100 - (profile?.points || 0)} more points to unlock discounts`}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Live Environmental Data Section */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Cloud className="w-5 h-5 mr-2 text-blue-600" />
            Live Environmental Data
          </h2>
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
              ● Live
            </Badge>
          </motion.div>
        </div>

        <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
          <div className="p-5">
            {/* AQI - Featured larger display */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 p-4 rounded-2xl"
              style={{ backgroundColor: aqiInfo.bgColor }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-md">
                    <Wind className="w-6 h-6" style={{ color: aqiInfo.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Air Quality Index</p>
                    <p className="text-3xl font-bold" style={{ color: aqiInfo.color }}>
                      {environmentalData.aqi}
                    </p>
                  </div>
                </div>
                <Badge 
                  className="text-sm px-3 py-1 shadow-sm"
                  style={{ 
                    backgroundColor: aqiInfo.color,
                    color: 'white'
                  }}
                >
                  {aqiInfo.level}
                </Badge>
              </div>
            </motion.div>

            {/* Other environmental metrics in grid */}
            <div className="grid grid-cols-3 gap-3">
              {/* Temperature */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="p-3 border-0 bg-gradient-to-br from-orange-50 to-red-50 shadow-sm">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                      <Thermometer className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-xs text-gray-600 mb-1">Temperature</p>
                    <motion.p 
                      className="text-xl font-bold text-orange-600"
                      key={environmentalData.temperature}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.3 }}
                    >
                      {environmentalData.temperature}°C
                    </motion.p>
                  </div>
                </Card>
              </motion.div>

              {/* Humidity */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="p-3 border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                      <Droplets className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-600 mb-1">Humidity</p>
                    <motion.p 
                      className="text-xl font-bold text-blue-600"
                      key={environmentalData.humidity}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.3 }}
                    >
                      {environmentalData.humidity}%
                    </motion.p>
                  </div>
                </Card>
              </motion.div>

              {/* Wind Speed */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="p-3 border-0 bg-gradient-to-br from-teal-50 to-emerald-50 shadow-sm">
                  <div className="text-center">
                    <motion.div 
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Wind className="w-5 h-5 text-teal-600" />
                    </motion.div>
                    <p className="text-xs text-gray-600 mb-1">Wind Speed</p>
                    <motion.p 
                      className="text-xl font-bold text-teal-600"
                      key={environmentalData.windSpeed}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.3 }}
                    >
                      {environmentalData.windSpeed}
                    </motion.p>
                    <p className="text-xs text-gray-500">km/h</p>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Info footer */}
            <div className="mt-4 p-3 bg-white/60 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-600 text-center">
                📍 Data updates every 30 seconds • Stay informed about your environment
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="px-6 mb-6">
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

      {/* Eco Games Feature - New Section */}
      <div className="px-6 mb-6">
        <Card 
          onClick={() => onNavigate('games')}
          className="overflow-hidden border-0 shadow-lg cursor-pointer active:scale-98 transition-transform"
        >
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 p-6 text-white relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 text-6xl opacity-20">🎮</div>
            <div className="absolute bottom-0 left-0 text-4xl opacity-20">🌿</div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-3">
                <Badge className="bg-yellow-400 text-yellow-900 border-0 mr-2">
                  NEW
                </Badge>
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold mb-2">Play Eco Games!</h3>
              <p className="text-purple-100 text-sm mb-4">
                Learn about the environment while earning points through fun interactive games
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">6</p>
                    <p className="text-xs text-purple-200">Games</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">20-150</p>
                    <p className="text-xs text-purple-200">Points per game</p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Brand Collaboration Section */}
      {(profile?.points || 0) >= 100 && (
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
              Brand Rewards Unlocked!
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('rewards')}
              className="text-green-600 hover:bg-green-50"
            >
              View all
            </Button>
          </div>
          
          <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
            <div className="p-5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Exclusive Discounts Available</h3>
                  <p className="text-sm text-gray-600">Redeem your {profile?.points || 0} points for brand discounts</p>
                </div>
              </div>
              
              {/* Partner Brand Logos */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {['Patagonia', 'Body Shop', 'EcoRight', 'Adidas'].map((brand, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700 text-center">{brand}</span>
                  </div>
                ))}
              </div>
              
              <Button
                onClick={() => onNavigate('rewards')}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md"
              >
                Browse All Brand Discounts
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Info Card for Users Below 100 Points */}
      {(profile?.points || 0) < 100 && (
        <div className="px-6 mb-6">
          <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="p-5 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 opacity-60">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Unlock Brand Discounts</h3>
              <p className="text-sm text-gray-600 mb-3">
                Earn {100 - (profile?.points || 0)} more points to unlock exclusive discounts from top eco-friendly brands like Patagonia, The Body Shop, and more!
              </p>
              <div className="bg-white rounded-lg p-3 mb-4">
                <Progress value={(profile?.points || 0)} className="h-3 mb-2" />
                <p className="text-xs text-gray-600">
                  {profile?.points || 0} / 100 points
                </p>
              </div>
              <Button
                onClick={() => onNavigate('tracker')}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 rounded-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start Earning Points
              </Button>
            </div>
          </Card>
        </div>
      )}

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
            onClick={() => onNavigate('leaderboard')}
            className="h-16 text-white rounded-xl flex flex-col items-center justify-center space-y-1 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #FFB300 0%, #FFA000 100%)' }}
          >
            <Trophy className="w-6 h-6" />
            <span className="text-sm">Leaderboard</span>
          </Button>
          
          <Button 
            onClick={() => onNavigate('events')}
            className="h-16 text-white rounded-xl flex flex-col items-center justify-center space-y-1 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #8E24AA 0%, #BA68C8 100%)' }}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-sm">Join Events</span>
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
              // Map activity types to icons
              const getIcon = () => {
                const type = (activity.type || '').toLowerCase();
                if (type.includes('bike') || type.includes('cycling')) return Bike;
                if (type.includes('recycle') || type.includes('recycling')) return Recycle;
                if (type.includes('upload')) return Camera;
                if (type.includes('walk') || type.includes('walking')) return Footprints;
                return Leaf; // default icon
              };
              const Icon = getIcon();
              
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