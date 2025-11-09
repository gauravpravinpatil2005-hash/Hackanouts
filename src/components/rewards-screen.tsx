import { Gift, ShoppingBag, Star, ExternalLink, Clock, CheckCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface Reward {
  id: number;
  title: string;
  description: string;
  pointsCost: number;
  brand: string;
  category: string;
  image: string;
  available: boolean;
  expiresIn?: string;
  redeemed?: boolean;
}

interface RewardsScreenProps {
  userId: string | null;
}

export function RewardsScreen({ userId }: RewardsScreenProps) {
  const userPoints = 847;
  
  const rewards: Reward[] = [
    {
      id: 1,
      title: "10% Off Organic Coffee",
      description: "Discount on premium organic coffee beans",
      pointsCost: 100,
      brand: "Green Bean Co.",
      category: "Food & Drink",
      image: "/placeholder-reward.jpg",
      available: true,
      expiresIn: "3 days"
    },
    {
      id: 2,
      title: "$5 Eco Store Credit",
      description: "Store credit for sustainable products",
      pointsCost: 250,
      brand: "EcoMart",
      category: "Shopping",
      image: "/placeholder-reward.jpg",
      available: true
    },
    {
      id: 3,
      title: "Bamboo Water Bottle",
      description: "Sustainable bamboo fiber water bottle",
      pointsCost: 500,
      brand: "EcoPlanet",
      category: "Lifestyle",
      image: "/placeholder-reward.jpg",
      available: true
    },
    {
      id: 4,
      title: "Plant a Tree Certificate",
      description: "Certificate for one tree planted in your name",
      pointsCost: 300,
      brand: "Forest Heroes",
      category: "Environmental",
      image: "/placeholder-reward.jpg",
      available: true
    },
    {
      id: 5,
      title: "Eco-Friendly Backpack",
      description: "Made from recycled materials",
      pointsCost: 1200,
      brand: "GreenGear",
      category: "Lifestyle",
      image: "/placeholder-reward.jpg",
      available: false
    }
  ];

  const redeemedRewards = [
    {
      id: 101,
      title: "15% Off Organic Groceries",
      brand: "Natural Foods",
      redeemedDate: "2 days ago",
      pointsCost: 150
    },
    {
      id: 102,
      title: "Free Eco Tote Bag",
      brand: "Green Living",
      redeemedDate: "1 week ago",
      pointsCost: 200
    }
  ];

  const categories = ['All', 'Food & Drink', 'Shopping', 'Lifestyle', 'Environmental'];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 pt-12 pb-8 text-white">
        <h1 className="text-2xl font-bold mb-2">Rewards & Points</h1>
        <p className="text-purple-100 mb-6">Redeem your eco-points for amazing rewards</p>
        
        {/* Points Balance */}
        <Card className="bg-white/10 backdrop-blur-sm border-0 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Your Eco Points</p>
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6 text-yellow-300" />
                <span className="text-3xl font-bold">{userPoints.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-purple-100 text-sm">Next Level</p>
              <p className="text-lg font-semibold">153 points</p>
              <Progress value={85} className="w-20 h-2 mt-1" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Categories */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              className="whitespace-nowrap rounded-full border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Available Rewards */}
      <div className="px-6 py-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Gift className="w-5 h-5 mr-2 text-purple-600" />
          Available Rewards
        </h2>
        
        <div className="space-y-4 mb-8">
          {rewards.map((reward) => (
            <Card key={reward.id} className="p-4 border-0 shadow-sm">
              <div className="flex space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <Gift className="w-8 h-8 text-green-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{reward.title}</h3>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{reward.brand}</p>
                    </div>
                    
                    {reward.expiresIn && (
                      <Badge variant="outline" className="text-xs border-orange-200 text-orange-600">
                        <Clock className="w-3 h-3 mr-1" />
                        {reward.expiresIn}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold text-gray-800">{reward.pointsCost}</span>
                      <span className="text-sm text-gray-600">points</span>
                    </div>
                    
                    <Button 
                      size="sm"
                      disabled={!reward.available || userPoints < reward.pointsCost}
                      className={`${
                        reward.available && userPoints >= reward.pointsCost
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      } rounded-full`}
                    >
                      {!reward.available 
                        ? 'Out of Stock' 
                        : userPoints >= reward.pointsCost 
                          ? 'Redeem' 
                          : 'Not Enough Points'
                      }
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Redeemed Rewards */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
          Recent Redemptions
        </h2>
        
        <div className="space-y-3">
          {redeemedRewards.map((reward) => (
            <Card key={reward.id} className="p-4 border-0 shadow-sm bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">{reward.title}</h3>
                  <p className="text-sm text-gray-600">{reward.brand}</p>
                  <p className="text-xs text-gray-500">{reward.redeemedDate}</p>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Redeemed</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-gray-400" />
                    <span className="text-sm text-gray-500">{reward.pointsCost} points</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Partner Brands */}
      <div className="px-6 pb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Partner Brands</h2>
        <div className="grid grid-cols-3 gap-4">
          {['Green Bean Co.', 'EcoMart', 'Forest Heroes'].map((brand, index) => (
            <Card key={index} className="p-4 text-center border-0 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">{brand}</p>
              <Button variant="ghost" size="sm" className="text-xs text-gray-500 mt-1 p-0">
                <ExternalLink className="w-3 h-3 mr-1" />
                Visit
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}