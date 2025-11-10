import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Leaf, User, Shield, TreePine, Recycle } from "lucide-react";

interface StartScreenProps {
  onUserLogin: () => void;
  onAdminLogin: () => void;
}

export function StartScreen({ onUserLogin, onAdminLogin }: StartScreenProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center p-6" 
         style={{ background: 'linear-gradient(135deg, var(--eco-background) 0%, var(--eco-green-lighter) 100%)' }}>
      
      {/* Eco Graphics */}
      <div className="absolute top-20 left-8 opacity-10">
        <TreePine className="w-16 h-16" style={{ color: 'var(--eco-green-primary)' }} />
      </div>
      <div className="absolute top-32 right-12 opacity-10">
        <Recycle className="w-12 h-12" style={{ color: 'var(--eco-green-light)' }} />
      </div>
      <div className="absolute bottom-32 left-12 opacity-10">
        <Leaf className="w-20 h-20" style={{ color: 'var(--eco-green-primary)' }} />
      </div>

      {/* Logo and Welcome */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6 shadow-xl"
             style={{ background: 'linear-gradient(135deg, var(--eco-green-primary) 0%, var(--eco-green-light) 100%)' }}>
          <Leaf className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-3">ECO-Tracker</h1>
        <p className="text-xl font-medium mb-2" style={{ color: 'var(--eco-green-primary)' }}>
          Track. Save. Reward.
        </p>
        <p className="text-gray-600">Join the movement for a sustainable future 🌍</p>
      </div>

      {/* Login Options Card */}
      <Card className="w-full max-w-sm mx-auto p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm relative z-10">
        <h2 className="text-center mb-6 text-gray-800">Choose Login Type</h2>
        
        <div className="space-y-4">
          {/* User Login Button */}
          <Button 
            onClick={onUserLogin}
            className="w-full h-16 text-white rounded-xl shadow-lg font-medium flex items-center justify-center space-x-3 hover:scale-105 transition-transform"
            style={{ background: 'linear-gradient(135deg, var(--eco-green-primary) 0%, var(--eco-green-light) 100%)' }}
          >
            <User className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">User Login</div>
              <div className="text-xs opacity-90">Track your eco journey</div>
            </div>
          </Button>

          {/* Admin Login Button */}
          <Button 
            onClick={onAdminLogin}
            variant="outline"
            className="w-full h-16 rounded-xl border-2 font-medium flex items-center justify-center space-x-3 hover:scale-105 transition-transform"
            style={{
              borderColor: '#1565C0',
              color: '#1565C0',
            }}
          >
            <Shield className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">Admin Login</div>
              <div className="text-xs opacity-75">Manage verifications</div>
            </div>
          </Button>
        </div>

        {/* Info Note */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            New to ECO-Tracker? Start with User Login and try Demo Mode!
          </p>
        </div>
      </Card>

      {/* Feature Preview */}
      <div className="mt-8 relative z-10">
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center"
                 style={{ backgroundColor: 'var(--eco-green-lighter)' }}>
              <span className="text-lg">📊</span>
            </div>
            <p className="text-xs text-gray-600">Track Impact</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center"
                 style={{ backgroundColor: 'var(--eco-blue-light)' }}>
              <span className="text-lg">🏆</span>
            </div>
            <p className="text-xs text-gray-600">Earn Rewards</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center"
                 style={{ backgroundColor: 'var(--eco-green-lighter)' }}>
              <span className="text-lg">🌍</span>
            </div>
            <p className="text-xs text-gray-600">Save Planet</p>
          </div>
        </div>
      </div>

      {/* Terms */}
      <p className="text-xs text-gray-500 text-center mt-6 px-4 relative z-10">
        By continuing, you agree to our Terms of Service and Privacy Policy.<br/>
        Join 10,000+ eco-warriors making a difference! 🌱
      </p>
    </div>
  );
}
