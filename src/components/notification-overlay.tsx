import { useState, useEffect } from "react";
import { X, Star, Award, Gift, TrendingUp } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface NotificationData {
  id: string;
  type: 'level_up' | 'badge_earned' | 'reward_available' | 'milestone';
  title: string;
  message: string;
  icon: any;
  color: string;
  actionText?: string;
  points?: number;
}

interface NotificationOverlayProps {
  notification: NotificationData | null;
  onClose: () => void;
  onAction?: () => void;
}

export function NotificationOverlay({ notification, onClose, onAction }: NotificationOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
    }
  }, [notification]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  if (!notification) return null;

  const Icon = notification.icon;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Notification Card */}
      <div className="fixed inset-0 flex items-center justify-center p-6 z-50">
        <Card className={`w-full max-w-sm mx-auto shadow-2xl border-0 transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}>
          <div className={`p-6 rounded-t-lg ${notification.color}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClose}
                className="text-white hover:bg-white/20 w-8 h-8 p-0 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">{notification.title}</h2>
            <p className="text-white/90 mb-4">{notification.message}</p>
            
            {notification.points && (
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                +{notification.points} points
              </Badge>
            )}
          </div>
          
          <div className="p-6 bg-white">
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="flex-1"
              >
                Later
              </Button>
              {notification.actionText && onAction && (
                <Button 
                  onClick={() => {
                    onAction();
                    handleClose();
                  }}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  {notification.actionText}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

// Example notifications data
export const sampleNotifications: NotificationData[] = [
  {
    id: 'level_up_1',
    type: 'level_up',
    title: 'Level Up!',
    message: 'Congratulations! You\'ve reached Level 8 and unlocked new rewards.',
    icon: Star,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    actionText: 'View Rewards',
    points: 50
  },
  {
    id: 'badge_earned_1',
    type: 'badge_earned',
    title: 'New Badge Earned!',
    message: 'You\'ve earned the "Streak Keeper" badge for maintaining a 7-day activity streak.',
    icon: Award,
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    actionText: 'View Badge',
    points: 25
  },
  {
    id: 'reward_available_1',
    type: 'reward_available',
    title: 'Reward Redeemed!',
    message: 'Your 10% off organic coffee coupon is ready to use. Check your email for details.',
    icon: Gift,
    color: 'bg-gradient-to-r from-green-500 to-emerald-600',
    actionText: 'View Coupon'
  },
  {
    id: 'milestone_1',
    type: 'milestone',
    title: 'Milestone Reached!',
    message: 'Amazing! You\'ve saved 250kg of CO₂. You\'re making a real difference!',
    icon: TrendingUp,
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    actionText: 'Share Achievement',
    points: 100
  }
];