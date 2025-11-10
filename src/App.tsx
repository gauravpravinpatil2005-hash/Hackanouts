import { useState, useEffect } from "react";
import { StartScreen } from "./components/start-screen";
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
import { GamesScreen } from "./components/games-screen";

// Import admin screens
import { AdminLoginScreen } from "./components/admin-login-screen";
import { AdminDashboardScreen } from "./components/admin-dashboard-screen";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentNotification, setCurrentNotification] = useState<any>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [userPoints, setUserPoints] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginMode, setLoginMode] = useState<'start' | 'user' | 'admin'>('start');

  // Check for existing session on mount and fetch user points
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createClient();
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          // Session error - user will see demo mode
          setUserPoints(2450); // Demo points
        }
        
        if (session?.user) {
          setIsLoggedIn(true);
          setUserId(session.user.id);
          // In a real app, fetch user points from API here
          setUserPoints(2450); // Demo value
        } else {
          // Demo mode
          setUserPoints(2450);
        }
      } catch (error) {
        // Session check failed - continue with demo mode
        setUserPoints(2450);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = (uid: string) => {
    setIsLoggedIn(true);
    setUserId(uid);
    setIsAdmin(false);
  };

  const handleAdminLogin = () => {
    setIsLoggedIn(true);
    setUserId('admin-user');
    setIsAdmin(true);
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUserId(null);
      setIsAdmin(false);
      setLoginMode('start');
      setActiveTab('dashboard');
    } catch (error) {
      // Logout error - continue anyway
    }
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

  const handlePointsEarned = (points: number) => {
    setUserPoints(prev => prev + points);
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
      case 'games':
        return <GamesScreen onPointsEarned={handlePointsEarned} />;
      default:
        return <DashboardScreen onNavigate={handleNavigate} userId={userId} />;
    }
  };

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
    // Show start screen
    if (loginMode === 'start') {
      return (
        <>
          <StartScreen 
            onUserLogin={() => setLoginMode('user')}
            onAdminLogin={() => setLoginMode('admin')}
          />
          <Toaster />
        </>
      );
    }
    
    // Show admin login
    if (loginMode === 'admin') {
      return (
        <>
          <AdminLoginScreen 
            onLogin={handleAdminLogin}
            onBackToStart={() => setLoginMode('start')}
          />
          <Toaster />
        </>
      );
    }
    
    // Show regular user login
    return (
      <>
        <LoginScreen 
          onLogin={handleLogin}
          onBackToStart={() => setLoginMode('start')}
        />
        <Toaster />
      </>
    );
  }

  // Admin users get a completely separate interface - ONLY the admin dashboard
  if (isAdmin) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
        <AdminDashboardScreen onLogout={handleLogout} />
        <Toaster />
      </div>
    );
  }

  // Regular users get the full app experience with bottom navigation
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
        userPoints={userPoints}
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