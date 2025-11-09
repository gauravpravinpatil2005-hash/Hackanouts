import { useState, useEffect } from "react";
import { Crown, Medal, Trophy, Search, Filter, ChevronDown, Star, TrendingUp, Loader2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { apiCall } from "../utils/supabase/client";

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  ecoScore: number;
  weeklyPoints: number;
  rank: number;
  isCurrentUser?: boolean;
  trend: 'up' | 'down' | 'same';
  activities: number;
  co2Saved: number | string;
}

interface LeaderboardScreenProps {
  userId: string | null;
}

export function LeaderboardScreen({ userId }: LeaderboardScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('week');
  const [activityFilter, setActivityFilter] = useState('all');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const data = await apiCall(`/leaderboard?time=${timeFilter}`);
        const users = (data.leaderboard || []).map((user: any, index: number) => ({
          ...user,
          rank: index + 1,
          co2Saved: typeof user.co2Saved === 'number' ? `${user.co2Saved.toFixed(1)}kg` : user.co2Saved,
          isCurrentUser: user.id === userId,
        }));
        setLeaderboardData(users);
      } catch (error) {
        // API error - using demo data fallback
        
        // Use demo data if API fails
        const demoUsers = [
          {
            id: '1',
            name: 'Sarah Green',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            ecoScore: 3250,
            weeklyPoints: 580,
            trend: 'up' as const,
            activities: 45,
            co2Saved: '28.5kg',
          },
          {
            id: '2',
            name: 'Mike Thompson',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
            ecoScore: 2890,
            weeklyPoints: 520,
            trend: 'up' as const,
            activities: 38,
            co2Saved: '24.2kg',
          },
          {
            id: '3',
            name: 'Emma Wilson',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
            ecoScore: 2650,
            weeklyPoints: 490,
            trend: 'same' as const,
            activities: 35,
            co2Saved: '22.1kg',
          },
          {
            id: userId || '4',
            name: 'Demo User',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
            ecoScore: 2450,
            weeklyPoints: 420,
            trend: 'up' as const,
            activities: 23,
            co2Saved: '15.3kg',
            isCurrentUser: true,
          },
          {
            id: '5',
            name: 'Alex Chen',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
            ecoScore: 2100,
            weeklyPoints: 380,
            trend: 'down' as const,
            activities: 28,
            co2Saved: '18.7kg',
          },
          {
            id: '6',
            name: 'Lisa Martinez',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
            ecoScore: 1950,
            weeklyPoints: 350,
            trend: 'up' as const,
            activities: 25,
            co2Saved: '16.4kg',
          },
        ].map((user, index) => ({ ...user, rank: index + 1 }));
        
        setLeaderboardData(demoUsers);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeFilter, userId]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Trophy className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-semibold">#{rank}</span>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  const filteredUsers = leaderboardData.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 pt-12 pb-8 text-white">
        <h1 className="text-2xl font-bold mb-2">Leaderboard</h1>
        <p className="text-yellow-100 mb-6">See how you stack up against other eco-warriors</p>
        
        {/* Top 3 Podium */}
        {leaderboardData.length >= 3 ? (
          <div className="flex items-end justify-center space-x-4 mb-6">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="relative mb-2">
                <Avatar className="w-16 h-16 border-4 border-white/30">
                  <AvatarImage src={leaderboardData[1]?.avatar} />
                  <AvatarFallback>{leaderboardData[1]?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2">
                  <Medal className="w-6 h-6 text-gray-300" />
                </div>
              </div>
              <p className="text-sm font-medium">{leaderboardData[1]?.name}</p>
              <p className="text-xs text-yellow-100">{leaderboardData[1]?.ecoScore}</p>
              <div className="w-16 h-12 bg-gray-300/20 rounded-t-lg mt-2 flex items-end justify-center">
                <span className="text-xs font-bold mb-1">2</span>
              </div>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="relative mb-2">
                <Avatar className="w-20 h-20 border-4 border-white/30">
                  <AvatarImage src={leaderboardData[0]?.avatar} />
                  <AvatarFallback>{leaderboardData[0]?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2">
                  <Crown className="w-7 h-7 text-yellow-300" />
                </div>
              </div>
              <p className="font-semibold">{leaderboardData[0]?.name}</p>
              <p className="text-sm text-yellow-100">{leaderboardData[0]?.ecoScore}</p>
              <div className="w-16 h-16 bg-yellow-300/20 rounded-t-lg mt-2 flex items-end justify-center">
                <span className="font-bold mb-1">1</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="relative mb-2">
                <Avatar className="w-16 h-16 border-4 border-white/30">
                  <AvatarImage src={leaderboardData[2]?.avatar} />
                  <AvatarFallback>{leaderboardData[2]?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2">
                  <Trophy className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <p className="text-sm font-medium">{leaderboardData[2]?.name}</p>
              <p className="text-xs text-yellow-100">{leaderboardData[2]?.ecoScore}</p>
              <div className="w-16 h-8 bg-amber-400/20 rounded-t-lg mt-2 flex items-end justify-center">
                <span className="text-xs font-bold mb-1">3</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-200" />
            <p className="text-yellow-100">Be the first to join the leaderboard!</p>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 border-gray-200 focus:border-orange-500"
          />
        </div>

        {/* Filter Options */}
        <div className="flex space-x-3">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={activityFilter} onValueChange={setActivityFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Activity Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="walking">Walking</SelectItem>
              <SelectItem value="cycling">Cycling</SelectItem>
              <SelectItem value="recycling">Recycling</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Current User Position */}
      <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50">
        <Card className="p-4 border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-bold">
                4
              </div>
              <Avatar className="w-10 h-10">
                <AvatarImage src={leaderboardData[3].avatar} />
                <AvatarFallback>AE</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-green-800">Your Position</p>
                <p className="text-sm text-green-600">+3 from last week</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-800">847</p>
              <p className="text-sm text-green-600">eco score</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Leaderboard List */}
      <div className="flex-1 px-6 py-4">
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <Card 
              key={user.id} 
              className={`p-4 border-0 shadow-sm ${
                user.isCurrentUser ? 'bg-green-50 border-green-200' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(user.rank)}
                    {getTrendIcon(user.trend)}
                  </div>
                  
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-semibold ${user.isCurrentUser ? 'text-green-800' : 'text-gray-800'}`}>
                        {user.name}
                      </h3>
                      {user.isCurrentUser && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-sm text-gray-600">{user.activities} activities</span>
                      <span className="text-sm text-green-600">{user.co2Saved} saved</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-lg font-bold ${user.isCurrentUser ? 'text-green-800' : 'text-gray-800'}`}>
                    {user.ecoScore.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-sm text-gray-600">+{user.weeklyPoints}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}