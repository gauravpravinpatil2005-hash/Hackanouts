import { useState } from "react";
import { Gift, Star, ExternalLink, CheckCircle, Leaf, Sparkles, Copy, X, ChevronRight, ShoppingBag, Zap, Award } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";

interface BrandReward {
  id: number;
  brand: string;
  tagline: string;
  description: string;
  discount: string;
  pointsCost: number;
  image: string;
  category: string;
  available: boolean;
  featured?: boolean;
}

interface RedeemedReward {
  id: number;
  brand: string;
  discount: string;
  discountCode: string;
  redeemedDate: string;
  pointsSpent: number;
  expiresDate: string;
}

interface RewardsScreenProps {
  userId: string | null;
}

export function RewardsScreen({ userId }: RewardsScreenProps) {
  const [userPoints, setUserPoints] = useState(847);
  const [selectedReward, setSelectedReward] = useState<BrandReward | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [redeemedRewardData, setRedeemedRewardData] = useState<RedeemedReward | null>(null);
  const [activeTab, setActiveTab] = useState<"available" | "myRewards">("available");
  
  const brandRewards: BrandReward[] = [
    {
      id: 1,
      brand: "Patagonia",
      tagline: "20% off on sustainable clothing",
      description: "Get 20% discount on all eco-friendly outdoor apparel and gear. Valid on all sustainable collections.",
      discount: "20% OFF",
      pointsCost: 200,
      image: "https://images.unsplash.com/photo-1675239514439-1c128b0cffcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYyNzA5ODA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Fashion",
      available: true,
      featured: true
    },
    {
      id: 2,
      brand: "The Body Shop",
      tagline: "15% off natural beauty products",
      description: "Enjoy 15% off on cruelty-free, eco-certified beauty and skincare products. Shop guilt-free!",
      discount: "15% OFF",
      pointsCost: 150,
      image: "https://images.unsplash.com/photo-1597817109745-c418f4875230?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHByb2R1Y3RzfGVufDF8fHx8MTc2MjY2ODI2OXww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Beauty",
      available: true
    },
    {
      id: 3,
      brand: "EcoRight",
      tagline: "$10 off eco-friendly bags",
      description: "Redeem for $10 off on bags made from recycled materials. Stylish and sustainable.",
      discount: "$10 OFF",
      pointsCost: 180,
      image: "https://images.unsplash.com/photo-1585221330389-24fb30535ec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBzdXN0YWluYWJsZSUyMGJyYW5kfGVufDF8fHx8MTc2MjcwOTgwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Accessories",
      available: true
    },
    {
      id: 4,
      brand: "Adidas Parley",
      tagline: "25% off ocean plastic collection",
      description: "Get 25% discount on products made from recycled ocean plastic. Run for the planet!",
      discount: "25% OFF",
      pointsCost: 250,
      image: "https://images.unsplash.com/photo-1751199484060-7845af711ec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMHN0b3JlfGVufDF8fHx8MTc2MjY4NDczOHww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Sports",
      available: true,
      featured: true
    },
    {
      id: 5,
      brand: "Whole Foods Market",
      tagline: "$15 off organic groceries",
      description: "Receive $15 off your purchase of $50+ on organic, locally-sourced groceries.",
      discount: "$15 OFF",
      pointsCost: 220,
      image: "https://images.unsplash.com/photo-1597817109745-c418f4875230?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHByb2R1Y3RzfGVufDF8fHx8MTc2MjY2ODI2OXww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Food",
      available: true
    },
    {
      id: 6,
      brand: "Tesla Charging",
      tagline: "Free charging session",
      description: "Redeem one free Supercharger session at any Tesla charging station. Drive electric!",
      discount: "FREE SESSION",
      pointsCost: 300,
      image: "https://images.unsplash.com/photo-1585221330389-24fb30535ec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBzdXN0YWluYWJsZSUyMGJyYW5kfGVufDF8fHx8MTc2MjcwOTgwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Transportation",
      available: true
    },
    {
      id: 7,
      brand: "IKEA Sustainability",
      tagline: "20% off eco furniture",
      description: "Save 20% on furniture made from sustainable wood and recycled materials.",
      discount: "20% OFF",
      pointsCost: 350,
      image: "https://images.unsplash.com/photo-1751199484060-7845af711ec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMHN0b3JlfGVufDF8fHx8MTc2MjY4NDczOHww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Home",
      available: true
    },
    {
      id: 8,
      brand: "TreeCard",
      tagline: "Plant 50 trees with your card",
      description: "Get a TreeCard debit card that plants trees with every purchase. Initial 50 trees included.",
      discount: "50 TREES",
      pointsCost: 400,
      image: "https://images.unsplash.com/photo-1597817109745-c418f4875230?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHByb2R1Y3RzfGVufDF8fHx8MTc2MjY2ODI2OXww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Finance",
      available: false
    }
  ];

  const [myRewards, setMyRewards] = useState<RedeemedReward[]>([
    {
      id: 101,
      brand: "Organic Harvest",
      discount: "10% OFF",
      discountCode: "ECO-HARVEST-10",
      redeemedDate: "Nov 6, 2025",
      pointsSpent: 120,
      expiresDate: "Dec 9, 2025"
    },
    {
      id: 102,
      brand: "Green Energy Co.",
      discount: "$5 OFF",
      discountCode: "GREEN-5-SAVE",
      redeemedDate: "Nov 1, 2025",
      pointsSpent: 100,
      expiresDate: "Nov 30, 2025"
    }
  ]);

  const categories = ['All', 'Fashion', 'Beauty', 'Food', 'Sports', 'Home'];

  const handleRedeemClick = (reward: BrandReward) => {
    setSelectedReward(reward);
  };

  const confirmRedeem = () => {
    if (!selectedReward) return;
    
    // Deduct points
    setUserPoints(prev => prev - selectedReward.pointsCost);
    
    // Generate discount code
    const code = `${selectedReward.brand.toUpperCase().replace(/\s+/g, '-').substring(0, 10)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Add to redeemed rewards
    const newReward: RedeemedReward = {
      id: Date.now(),
      brand: selectedReward.brand,
      discount: selectedReward.discount,
      discountCode: code,
      redeemedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      pointsSpent: selectedReward.pointsCost,
      expiresDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setMyRewards(prev => [newReward, ...prev]);
    setRedeemedRewardData(newReward);
    
    // Close reward dialog and show success
    setSelectedReward(null);
    setShowSuccessModal(true);
    
    // Auto close success modal
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
  };

  const copyDiscountCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9] pb-20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#66BB6A]/10 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-20 left-0 w-48 h-48 bg-[#2E7D32]/10 rounded-full blur-3xl -z-0" />
      
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#2E7D32] to-[#66BB6A] px-6 pt-12 pb-8 text-white">
        <div className="absolute top-4 right-4 opacity-20">
          <Leaf className="w-32 h-32" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-2">
            <h1 className="flex-1">Redeem Your Eco Points 🌿</h1>
            <Award className="w-8 h-8 text-yellow-300" />
          </div>
          <p className="text-green-100 mb-3">Earn rewards from brands that care about the planet</p>
          
          {/* Brand Discount Requirement Info */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
            <p className="text-sm text-white font-medium mb-1">
              💡 Brand Discount Eligibility
            </p>
            <p className="text-xs text-green-50">
              Earn <strong>100+ points</strong> through eco-friendly activities to unlock exclusive discounts from partner brands like Patagonia, The Body Shop, and more!
            </p>
          </div>
          
          {/* Points Balance Card */}
          <Card className="bg-white/15 backdrop-blur-md border-0 border-white/20 p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Your Eco Points</p>
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-300 rounded-full p-1.5">
                    <Star className="w-5 h-5 text-[#2E7D32] fill-[#2E7D32]" />
                  </div>
                  <span className="text-4xl tracking-tight">{userPoints.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-right">
                <Sparkles className="w-6 h-6 ml-auto mb-1 text-yellow-300" />
                <p className="text-sm text-green-100">Keep earning!</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-20 shadow-sm">
        <div className="flex space-x-1 bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setActiveTab("available")}
            className={`flex-1 py-2 px-4 rounded-full transition-all ${
              activeTab === "available"
                ? "bg-[#2E7D32] text-white shadow-md"
                : "text-gray-600"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Available Rewards</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("myRewards")}
            className={`flex-1 py-2 px-4 rounded-full transition-all ${
              activeTab === "myRewards"
                ? "bg-[#2E7D32] text-white shadow-md"
                : "text-gray-600"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Gift className="w-4 h-4" />
              <span>My Rewards ({myRewards.length})</span>
            </div>
          </button>
        </div>
      </div>

      {/* Available Rewards Tab */}
      {activeTab === "available" && (
        <div className="flex-1">
          {/* Celebration Banner for Users with 100+ Points */}
          {userPoints >= 100 && (
            <div className="px-6 py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-0.5">🎉 You're Eligible!</p>
                    <p className="text-sm text-yellow-50">Start redeeming amazing brand discounts below</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-white" />
              </motion.div>
            </div>
          )}

          {/* How It Works Info Card */}
          <div className="px-6 py-4 bg-gradient-to-br from-blue-50 to-green-50">
            <Card className="border-2 border-blue-200 bg-white/80 backdrop-blur-sm">
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">How Rewards Work</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-start space-x-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <p>Earn points through eco-friendly activities: walking, cycling, recycling, and more</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <p>Redeem points for exclusive discounts from sustainable brands</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <p>Minimum 100 points required to start redeeming rewards</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Filter Categories */}
          <div className="px-6 py-4 bg-white">
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap rounded-full border-[#2E7D32]/30 text-gray-700 hover:bg-[#2E7D32]/10 hover:border-[#2E7D32]"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Section */}
          <div className="px-6 py-4">
            <div className="flex items-center mb-3">
              <Zap className="w-5 h-5 text-yellow-500 mr-2" />
              <h2 className="text-gray-800">Featured Deals</h2>
            </div>
            <div className="space-y-3">
              {brandRewards.filter(r => r.featured).map((reward) => (
                <Card 
                  key={reward.id} 
                  className="relative overflow-hidden border-2 border-[#66BB6A]/30 shadow-md hover:shadow-lg transition-all"
                >
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className="bg-yellow-400 text-gray-900 border-0">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                  
                  <div className="flex space-x-4 p-4">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                      <ImageWithFallback
                        src={reward.image}
                        alt={reward.brand}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="mb-2">
                        <h3 className="text-gray-900 mb-1">{reward.brand}</h3>
                        <p className="text-sm text-gray-600 line-clamp-1">{reward.tagline}</p>
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <div className="space-y-1">
                          <div className="inline-flex items-center bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-1 rounded-lg">
                            <Star className="w-4 h-4 mr-1 fill-[#2E7D32]" />
                            <span className="text-sm">{reward.pointsCost} pts</span>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleRedeemClick(reward)}
                          disabled={!reward.available || userPoints < reward.pointsCost}
                          className={`${
                            reward.available && userPoints >= reward.pointsCost
                              ? 'bg-[#2E7D32] hover:bg-[#1B5E20] text-white'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          } rounded-full shadow-md`}
                          size="sm"
                        >
                          {!reward.available 
                            ? 'Unavailable' 
                            : userPoints >= reward.pointsCost 
                              ? 'Redeem' 
                              : 'Need More'
                          }
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* All Rewards Grid */}
          <div className="px-6 py-4">
            <h2 className="text-gray-800 mb-3 flex items-center">
              <Gift className="w-5 h-5 mr-2 text-[#2E7D32]" />
              All Partner Rewards
            </h2>
            
            <div className="grid grid-cols-1 gap-3">
              {brandRewards.filter(r => !r.featured).map((reward) => (
                <Card 
                  key={reward.id} 
                  className="overflow-hidden border border-gray-200 hover:border-[#66BB6A] hover:shadow-md transition-all"
                >
                  <div className="flex space-x-3 p-3">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={reward.image}
                        alt={reward.brand}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm text-gray-900 mb-0.5">{reward.brand}</h3>
                          <p className="text-xs text-gray-600 line-clamp-2">{reward.tagline}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                          <Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs text-gray-700">{reward.pointsCost}</span>
                        </div>
                        
                        <Button
                          onClick={() => handleRedeemClick(reward)}
                          disabled={!reward.available || userPoints < reward.pointsCost}
                          size="sm"
                          className={`${
                            reward.available && userPoints >= reward.pointsCost
                              ? 'bg-[#66BB6A] hover:bg-[#2E7D32] text-white'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          } rounded-full text-xs h-7 px-3`}
                        >
                          {!reward.available 
                            ? 'Out of Stock' 
                            : userPoints >= reward.pointsCost 
                              ? 'Redeem' 
                              : 'Locked'
                          }
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Ways to Earn More Points */}
          <div className="px-6 py-6 bg-gradient-to-br from-green-50 to-blue-50">
            <h3 className="text-gray-800 mb-3 flex items-center">
              <Zap className="w-5 h-5 text-yellow-500 mr-2" />
              Quick Ways to Earn More Points
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                <div className="p-3 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🚶</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">Walk or Cycle</p>
                    <p className="text-xs text-gray-600">Earn 10 points per km tracked</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
                    +10/km
                  </Badge>
                </div>
              </Card>

              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                <div className="p-3 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📸</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">Upload Eco Proof</p>
                    <p className="text-xs text-gray-600">Get verified for recycling, cleanups, etc.</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
                    +50-150
                  </Badge>
                </div>
              </Card>

              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                <div className="p-3 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🌱</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">Join NGO Events</p>
                    <p className="text-xs text-gray-600">Participate in community events</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
                    +50-200
                  </Badge>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* My Rewards Tab */}
      {activeTab === "myRewards" && (
        <div className="flex-1 px-6 py-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-5 h-5 mr-2 text-[#2E7D32]" />
            <h2 className="text-gray-800">Active Discount Codes</h2>
          </div>
          
          {myRewards.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">No redeemed rewards yet</p>
              <p className="text-sm text-gray-500 mb-4">Start redeeming eco points for amazing discounts!</p>
              <Button 
                onClick={() => setActiveTab("available")}
                className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-full"
              >
                Browse Rewards
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {myRewards.map((reward) => (
                <Card key={reward.id} className="border-2 border-[#2E7D32]/20 bg-gradient-to-br from-white to-green-50/30 shadow-sm">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-gray-900 mb-1">{reward.brand}</h3>
                        <div className="inline-flex items-center bg-[#2E7D32] text-white px-2 py-1 rounded-md text-sm">
                          {reward.discount}
                        </div>
                      </div>
                      <Badge variant="outline" className="border-green-600 text-green-700 bg-green-50">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    
                    {/* Discount Code */}
                    <div className="bg-white border-2 border-dashed border-[#2E7D32]/30 rounded-lg p-3 mb-3">
                      <p className="text-xs text-gray-600 mb-1">Discount Code</p>
                      <div className="flex items-center justify-between">
                        <code className="text-[#2E7D32] tracking-wide">{reward.discountCode}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyDiscountCode(reward.discountCode)}
                          className="text-[#2E7D32] hover:bg-[#2E7D32]/10 h-7"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                    
                    {/* Details */}
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center space-x-3">
                        <div>
                          <span className="text-gray-500">Redeemed:</span> {reward.redeemedDate}
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        <div>
                          <span className="text-gray-500">Expires:</span> {reward.expiresDate}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="flex items-center text-xs text-gray-500">
                        <Star className="w-3 h-3 mr-1 text-gray-400" />
                        <span>Spent {reward.pointsSpent} eco points</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reward Details Modal */}
      <Dialog open={selectedReward !== null} onOpenChange={(open) => !open && setSelectedReward(null)}>
        <DialogContent className="max-w-md mx-4 rounded-2xl">
          {selectedReward && (
            <div>
              <DialogHeader>
                <DialogTitle className="text-left">Redeem Reward</DialogTitle>
              </DialogHeader>
              
              <div className="mt-4">
                {/* Reward Image */}
                <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4 shadow-lg">
                  <ImageWithFallback
                    src={selectedReward.image}
                    alt={selectedReward.brand}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="inline-flex items-center bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full mb-2">
                      <span className="text-[#2E7D32]">{selectedReward.discount}</span>
                    </div>
                    <h3 className="text-white">{selectedReward.brand}</h3>
                  </div>
                </div>
                
                {/* Details */}
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Reward Details</p>
                    <p className="text-gray-800">{selectedReward.description}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Points Required</p>
                        <div className="flex items-center">
                          <Star className="w-5 h-5 mr-1 text-yellow-500 fill-yellow-500" />
                          <span className="text-gray-900">{selectedReward.pointsCost} points</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Your Balance</p>
                        <div className="flex items-center">
                          <Star className="w-5 h-5 mr-1 text-yellow-500 fill-yellow-500" />
                          <span className="text-gray-900">{userPoints} points</span>
                        </div>
                      </div>
                    </div>
                    
                    {userPoints >= selectedReward.pointsCost && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">After redemption:</span>
                          <span className="text-[#2E7D32]">{userPoints - selectedReward.pointsCost} points</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedReward(null)}
                    className="flex-1 rounded-full border-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmRedeem}
                    disabled={userPoints < selectedReward.pointsCost}
                    className={`flex-1 rounded-full ${
                      userPoints >= selectedReward.pointsCost
                        ? 'bg-[#2E7D32] hover:bg-[#1B5E20] text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Redeem
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && redeemedRewardData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              {/* Confetti Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-50" />
              
              <div className="relative z-10 text-center">
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-br from-[#2E7D32] to-[#66BB6A] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-gray-900 mb-2">Reward Redeemed! 🎉</h2>
                  <p className="text-gray-600 mb-6">
                    You successfully redeemed {redeemedRewardData.pointsSpent} Eco Points for a discount from <span className="text-[#2E7D32]">{redeemedRewardData.brand}</span>!
                  </p>
                  
                  {/* Discount Code Display */}
                  <div className="bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] rounded-2xl p-4 mb-4 shadow-md">
                    <p className="text-white text-sm mb-2">Your Discount Code</p>
                    <div className="bg-white rounded-lg py-3 px-4">
                      <code className="text-[#2E7D32] tracking-wider">{redeemedRewardData.discountCode}</code>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-6">
                    Code saved to "My Rewards" • Valid until {redeemedRewardData.expiresDate}
                  </p>
                  
                  <Button
                    onClick={() => {
                      setShowSuccessModal(false);
                      setActiveTab("myRewards");
                    }}
                    className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-full w-full"
                  >
                    View My Rewards
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
