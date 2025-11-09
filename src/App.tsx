import { useState, useEffect } from "react";
import { LoginScreen } from "./components/login-screen";
import { DashboardScreen } from "./components/dashboard-screen";
import { BottomNavigation } from "./components/bottom-navigation";
import { NotificationOverlay } from "./components/notification-overlay";
import { Toaster } from "./components/ui/sonner";
import { createClient } from "./utils/supabase/client";

// Import screens directly to avoid lazy loading issues
import { ActivitiesScreen } from "./components/activities-screen";
import { TrackerScreen } from "./components/tracker-screen";
import { UploadScreen } from "./components/upload-screen";
import { EventsScreen } from "./components/events-screen";
import { CommunityScreen } from "./components/community-screen";
import { BadgesScreen } from "./components/badges-screen";
import { RewardsScreen } from "./components/rewards-screen";
import { LeaderboardScreen } from "./components/leaderboard-screen";
import { ProfileScreen } from "./components/profile-screen";

// Import admin screens
import { AdminLoginScreen } from "./components/admin-login-screen";
import { AdminDashboardScreen } from "./components/admin-dashboard-screen";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentNotification, setCurrentNotification] = useState<any>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  
  // Admin mode states
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createClient();
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
        }
        
        if (session?.user) {
          setIsLoggedIn(true);
          setUserId(session.user.id);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = (uid: string) => {
    setIsLoggedIn(true);
    setUserId(uid);
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUserId(null);
      setActiveTab('dashboard');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
  };

  const handleNotificationAction = () => {
    // Handle notification action (e.g., navigate to rewards)
    if (currentNotification?.type === 'level_up') {
      setActiveTab('rewards');
    } else if (currentNotification?.type === 'badge_earned') {
      setActiveTab('badges');
    }
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen onNavigate={handleNavigate} userId={userId} />;
      case 'tracker':
        return <TrackerScreen userId={userId} />;
      case 'upload':
        return <UploadScreen userId={userId} />;
      case 'leaderboard':
        return <LeaderboardScreen userId={userId} />;
      case 'profile':
        return <ProfileScreen userId={userId} onLogout={handleLogout} />;
      case 'activities':
        return <ActivitiesScreen userId={userId} />;
      case 'events':
        return <EventsScreen userId={userId} />;
      case 'community':
        return <CommunityScreen userId={userId} />;
      case 'badges':
        return <BadgesScreen userId={userId} />;
      case 'rewards':
        return <RewardsScreen userId={userId} />;
      default:
        return <DashboardScreen onNavigate={handleNavigate} userId={userId} />;
    }
  };

  // Admin mode rendering
  if (isAdminMode) {
    if (!isAdminLoggedIn) {
      return (
        <>
          <AdminLoginScreen onLogin={handleAdminLogin} />
          <Toaster />
          {/* Back button to return to user login */}
          <button
            onClick={() => setIsAdminMode(false)}
            className="fixed top-4 left-4 text-sm flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all z-50"
            style={{ color: 'var(--eco-green-primary)' }}
          >
            ← Back to User Login
          </button>
        </>
      );
    }

    return (
      <>
        <AdminDashboardScreen onLogout={handleAdminLogout} />
        <Toaster />
        {/* Back button to return to user app */}
        <button
          onClick={() => {
            setIsAdminMode(false);
            setIsAdminLoggedIn(false);
          }}
          className="fixed top-20 left-4 text-sm flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all z-40"
          style={{ color: 'var(--eco-green-primary)' }}
        >
          ← Exit Admin Panel
        </button>
      </>
    );
  }

  // Regular user mode
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--eco-background)' }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center animate-pulse"
               style={{ backgroundColor: 'var(--eco-green-lighter)' }}>
            <span className="text-2xl">🌱</span>
          </div>
          <p className="text-gray-600">Loading ECO-Tracker...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} onAdminMode={() => setIsAdminMode(true)} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'var(--eco-background)' }}>
      {/* Main Content */}
      <div className="pb-20">
        {renderScreen()}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
      />

      {/* Notification Overlay */}
      <NotificationOverlay
        notification={currentNotification}
        onClose={() => setCurrentNotification(null)}
        onAction={handleNotificationAction}
      />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}