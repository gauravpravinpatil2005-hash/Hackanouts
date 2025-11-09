import { Award, Star, Target, Zap, TreePine, Footprints, Bike, Recycle, Droplets, Lock } from "lucide-react";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

interface BadgeData {
  id: number;
  name: string;
  description: string;
  icon: any;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
  category: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedDate?: string;
}

interface BadgesScreenProps {
  userId: string | null;
}

export function BadgesScreen({ userId }: BadgesScreenProps) {
  const badges: BadgeData[] = [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first walking activity",
      icon: Footprints,
      earned: true,
      category: "Walking",
      color: "bg-green-500",
      rarity: "common",
      earnedDate: "2 days ago"
    },
    {
      id: 2,
      name: "Eco Warrior",
      description: "Save 100kg of CO₂ in total",
      icon: TreePine,
      earned: true,
      category: "Environmental",
      color: "bg-emerald-600",
      rarity: "epic",
      earnedDate: "1 week ago"
    },
    {
      id: 3,
      name: "Cycle Master",
      description: "Complete 50km on bike",
      icon: Bike,
      earned: true,
      category: "Cycling",
      color: "bg-blue-500",
      rarity: "rare",
      earnedDate: "3 days ago"
    },
    {
      id: 4,
      name: "Streak Keeper",
      description: "Maintain a 7-day activity streak",
      icon: Zap,
      earned: true,
      category: "Consistency",
      color: "bg-yellow-500",
      rarity: "rare",
      earnedDate: "Today"
    },
    {
      id: 5,
      name: "Recycling Hero",
      description: "Recycle 100 items",
      icon: Recycle,
      earned: false,
      progress: 73,
      maxProgress: 100,
      category: "Recycling",
      color: "bg-green-600",
      rarity: "rare"
    },
    {
      id: 6,
      name: "Water Guardian",
      description: "Save 1000L of water",
      icon: Droplets,
      earned: false,
      progress: 425,
      maxProgress: 1000,
      category: "Conservation",
      color: "bg-blue-600",
      rarity: "epic"
    },
    {
      id: 7,
      name: "Marathon Walker",
      description: "Walk 100km in total",
      icon: Target,
      earned: false,
      progress: 67,
      maxProgress: 100,
      category: "Walking",
      color: "bg-purple-500",
      rarity: "epic"
    },
    {
      id: 8,
      name: "Planet Protector",
      description: "Save 1000kg of CO₂",
      icon: Star,
      earned: false,
      progress: 248,
      maxProgress: 1000,
      category: "Environmental",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      rarity: "legendary"
    }
  ];

  const earnedBadges = badges.filter(badge => badge.earned);
  const inProgressBadges = badges.filter(badge => !badge.earned);
  
  const categories = ['All', 'Walking', 'Cycling', 'Environmental', 'Recycling', 'Conservation', 'Consistency'];
  
  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-gradient-to-r from-purple-300 to-pink-300';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 pt-12 pb-8 text-white">
        <h1 className="text-2xl font-bold mb-2">Badges & Achievements</h1>
        <p className="text-purple-100 mb-6">Track your eco-friendly milestones</p>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{earnedBadges.length}</p>
            <p className="text-sm text-purple-100">Earned</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{inProgressBadges.length}</p>
            <p className="text-sm text-purple-100">In Progress</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{badges.length}</p>
            <p className="text-sm text-purple-100">Total</p>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="px-6 py-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Progress to Next Badge</h2>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            73%
          </Badge>
        </div>
        <Progress value={73} className="h-3 mb-2" />
        <p className="text-sm text-gray-600">27 more items to recycle for "Recycling Hero"</p>
      </div>

      {/* Earned Badges */}
      <div className="px-6 py-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-green-600" />
          Earned Badges ({earnedBadges.length})
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {earnedBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <Card key={badge.id} className={`p-4 border-2 ${getRarityBorder(badge.rarity)} shadow-sm relative overflow-hidden`}>
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`w-12 h-12 ${badge.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{badge.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {badge.earnedDate}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>

        {/* In Progress Badges */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          In Progress ({inProgressBadges.length})
        </h2>
        
        <div className="space-y-4">
          {inProgressBadges.map((badge) => {
            const Icon = badge.icon;
            const progressPercentage = badge.progress && badge.maxProgress 
              ? (badge.progress / badge.maxProgress) * 100 
              : 0;
            
            return (
              <Card key={badge.id} className="p-4 border-0 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="absolute -top-1 -right-1">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{badge.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                    
                    {badge.progress && badge.maxProgress && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">
                            {badge.progress}/{badge.maxProgress}
                          </span>
                          <span className="text-xs text-gray-500">
                            {Math.round(progressPercentage)}%
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Motivational Message */}
      <div className="px-6 pb-6">
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-0">
          <div className="text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Keep Going!</h3>
            <p className="text-sm text-gray-600">
              You're making a real difference for our planet. Every small action counts towards a greener future!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}