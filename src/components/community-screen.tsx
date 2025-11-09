import { useState } from "react";
import { Heart, MessageCircle, Share, MoreHorizontal, Flame, Award, MapPin, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface CommunityPost {
  id: number;
  user: {
    name: string;
    avatar: string;
    level: number;
    ecoScore: number;
  };
  content: {
    text: string;
    images: string[];
    activity: {
      type: string;
      details: string;
      pointsEarned: number;
      location?: string;
    };
  };
  engagement: {
    likes: number;
    comments: number;
    cheers: number;
    isLiked: boolean;
    isCheered: boolean;
  };
  timestamp: string;
  badges?: string[];
}

interface CommunityScreenProps {
  userId: string | null;
}

export function CommunityScreen({ userId }: CommunityScreenProps) {
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: 1,
      user: {
        name: "Emma Green",
        avatar: "https://images.unsplash.com/photo-1617441356293-de82acf3552f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBwcm9maWxlJTIwcGVyc29ufGVufDF8fHx8MTc1NzU5Nzc4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        level: 8,
        ecoScore: 1247
      },
      content: {
        text: "Amazing beach cleanup session today! Our team removed 50kg of plastic waste. Every piece counts! 🌊♻️",
        images: ["/placeholder-post.jpg"],
        activity: {
          type: "Beach Cleanup",
          details: "3 hours, 15 volunteers",
          pointsEarned: 95,
          location: "Santa Monica Beach"
        }
      },
      engagement: {
        likes: 23,
        comments: 8,
        cheers: 15,
        isLiked: false,
        isCheered: true
      },
      timestamp: "2 hours ago",
      badges: ["ocean-guardian", "cleanup-hero"]
    },
    {
      id: 2,
      user: {
        name: "David Earth",
        avatar: "https://images.unsplash.com/photo-1617441356293-de82acf3552f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBwcm9maWxlJTIwcGVyc29ufGVufDF8fHx8MTc1NzU5Nzc4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        level: 6,
        ecoScore: 892
      },
      content: {
        text: "Just completed my 30-day cycling streak! 🚴‍♂️ Saved 45kg of CO₂ by choosing bike over car. Feeling amazing!",
        images: [],
        activity: {
          type: "Cycling Streak",
          details: "30 days, 240km total",
          pointsEarned: 120
        }
      },
      engagement: {
        likes: 34,
        comments: 12,
        cheers: 28,
        isLiked: true,
        isCheered: false
      },
      timestamp: "5 hours ago",
      badges: ["streak-master"]
    },
    {
      id: 3,
      user: {
        name: "Sarah Nature",
        avatar: "https://images.unsplash.com/photo-1617441356293-de82acf3552f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBwcm9maWxlJTIwcGVyc29ufGVufDF8fHx8MTc1NzU5Nzc4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        level: 9,
        ecoScore: 1456
      },
      content: {
        text: "Planted 10 native trees in the community garden today! 🌳 These will provide shade and clean air for future generations.",
        images: ["/placeholder-post.jpg", "/placeholder-post.jpg"],
        activity: {
          type: "Tree Planting",
          details: "10 trees planted",
          pointsEarned: 150,
          location: "Community Garden"
        }
      },
      engagement: {
        likes: 67,
        comments: 21,
        cheers: 43,
        isLiked: true,
        isCheered: true
      },
      timestamp: "1 day ago",
      badges: ["forest-guardian", "green-thumb"]
    }
  ]);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? {
            ...post,
            engagement: {
              ...post.engagement,
              likes: post.engagement.isLiked ? post.engagement.likes - 1 : post.engagement.likes + 1,
              isLiked: !post.engagement.isLiked
            }
          }
        : post
    ));
  };

  const handleCheer = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? {
            ...post,
            engagement: {
              ...post.engagement,
              cheers: post.engagement.isCheered ? post.engagement.cheers - 1 : post.engagement.cheers + 1,
              isCheered: !post.engagement.isCheered
            }
          }
        : post
    ));
  };

  const getBadgeEmoji = (badge: string) => {
    const badgeMap: { [key: string]: string } = {
      'ocean-guardian': '🌊',
      'cleanup-hero': '🧹',
      'streak-master': '🔥',
      'forest-guardian': '🌲',
      'green-thumb': '🌱'
    };
    return badgeMap[badge] || '🏆';
  };

  return (
    <div className="flex flex-col min-h-screen pb-20" style={{ backgroundColor: 'var(--eco-background)' }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-6" style={{ backgroundColor: 'var(--eco-green-primary)' }}>
        <h1 className="text-2xl font-bold text-white mb-2">Community Feed</h1>
        <p className="text-green-100">See what eco-warriors are up to!</p>
      </div>

      {/* Community Stats */}
      <div className="px-6 py-4 bg-white shadow-sm">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-bold" style={{ color: 'var(--eco-green-primary)' }}>2.4k</p>
            <p className="text-xs text-gray-600">Active Users</p>
          </div>
          <div>
            <p className="text-xl font-bold" style={{ color: 'var(--eco-green-primary)' }}>156</p>
            <p className="text-xs text-gray-600">Posts Today</p>
          </div>
          <div>
            <p className="text-xl font-bold" style={{ color: 'var(--eco-green-primary)' }}>12.5k</p>
            <p className="text-xs text-gray-600">Total Impact</p>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 px-6 py-4">
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden shadow-sm border-0">
              {/* User Header */}
              <div className="p-4 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={post.user.avatar} />
                      <AvatarFallback>{post.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-800">{post.user.name}</h3>
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{ backgroundColor: 'var(--eco-green-lighter)', color: 'var(--eco-green-primary)' }}
                        >
                          Lv.{post.user.level}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{post.timestamp}</span>
                        {post.content.activity.location && (
                          <>
                            <span>•</span>
                            <MapPin className="w-3 h-3" />
                            <span>{post.content.activity.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="p-1">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Activity Badge */}
              <div className="px-4 pb-3">
                <div className="flex items-center space-x-2">
                  <Badge 
                    className="text-xs font-medium"
                    style={{ backgroundColor: 'var(--eco-blue-light)', color: 'var(--eco-blue-primary)' }}
                  >
                    <Award className="w-3 h-3 mr-1" />
                    {post.content.activity.type}
                  </Badge>
                  <span className="text-sm text-gray-500">{post.content.activity.details}</span>
                  <Badge 
                    variant="outline" 
                    className="text-xs ml-auto"
                    style={{ backgroundColor: 'var(--points-yellow)', color: '#000' }}
                  >
                    +{post.content.activity.pointsEarned} pts
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="px-4 pb-3">
                <p className="text-gray-800 leading-relaxed">{post.content.text}</p>
              </div>

              {/* Images */}
              {post.content.images.length > 0 && (
                <div className={`grid gap-2 px-4 pb-3 ${
                  post.content.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                }`}>
                  {post.content.images.map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Image {index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Badges */}
              {post.badges && post.badges.length > 0 && (
                <div className="px-4 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Earned:</span>
                    {post.badges.map((badge, index) => (
                      <span key={index} className="text-lg">
                        {getBadgeEmoji(badge)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Engagement */}
              <div className="px-4 py-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{post.engagement.likes} likes</span>
                    <span>{post.engagement.comments} comments</span>
                    <span>{post.engagement.cheers} cheers</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={`flex-1 ${post.engagement.isLiked ? 'text-red-600' : 'text-gray-600'}`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${post.engagement.isLiked ? 'fill-current' : ''}`} />
                    Like
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex-1 text-gray-600">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Comment
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCheer(post.id)}
                    className={`flex-1 ${post.engagement.isCheered ? 'text-orange-600' : 'text-gray-600'}`}
                  >
                    <Flame className={`w-4 h-4 mr-2 ${post.engagement.isCheered ? 'fill-current' : ''}`} />
                    Cheer
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex-1 text-gray-600">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-6">
          <Button 
            variant="outline" 
            className="px-8"
            style={{ borderColor: 'var(--eco-green-primary)', color: 'var(--eco-green-primary)' }}
          >
            Load More Posts
          </Button>
        </div>
      </div>
    </div>
  );
}