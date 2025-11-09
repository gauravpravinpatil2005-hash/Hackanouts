import { Home, MapPin, Camera, Trophy, User, Gift, Sparkles } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userPoints?: number;
}

export function BottomNavigation({ activeTab, onTabChange, userPoints = 0 }: BottomNavigationProps) {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'tracker', icon: MapPin, label: 'Track' },
    { id: 'rewards', icon: Gift, label: 'Rewards' },
    { id: 'leaderboard', icon: Trophy, label: 'Ranks' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50" style={{ borderColor: 'var(--eco-green-lighter)' }}>
      <div className="flex justify-around items-center max-w-md mx-auto px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center py-2 px-3 rounded-xl transition-all min-w-0 ${
                isActive 
                  ? 'text-white shadow-lg' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{
                backgroundColor: isActive ? 'var(--eco-green-primary)' : 'transparent'
              }}
            >
              {/* Notification Badge for Rewards */}
              {tab.id === 'rewards' && userPoints >= 100 && !isActive && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  <Sparkles className="w-2.5 h-2.5 text-yellow-900" />
                </div>
              )}
              
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-2' : 'stroke-1.5'}`} />
              <span className={`text-xs mt-1 ${isActive ? 'font-medium' : 'font-normal'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}