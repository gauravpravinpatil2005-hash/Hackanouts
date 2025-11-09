import { Home, MapPin, Camera, Trophy, User } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'tracker', icon: MapPin, label: 'Track' },
    { id: 'upload', icon: Camera, label: 'Upload' },
    { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
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
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all min-w-0 ${
                isActive 
                  ? 'text-white shadow-lg' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{
                backgroundColor: isActive ? 'var(--eco-green-primary)' : 'transparent'
              }}
            >
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