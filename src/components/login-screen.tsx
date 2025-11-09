import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Leaf, Mail, Lock, Eye, EyeOff, TreePine, Recycle, Loader2 } from "lucide-react";
import { createClient, apiCall } from "../utils/supabase/client";
import { toast } from "sonner@2.0.3";

interface LoginScreenProps {
  onLogin: (userId: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(false); // Default to Register tab
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // Sign in existing user
        const result = await apiCall('/auth/signin', {
          method: 'POST',
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (result.success && result.session) {
          // Set the session in Supabase client
          const supabase = createClient();
          await supabase.auth.setSession({
            access_token: result.session.access_token,
            refresh_token: result.session.refresh_token,
          });
          
          toast.success('Welcome back! 🌱');
          onLogin(result.user.id);
        }
      } else {
        // Sign up new user
        const result = await apiCall('/auth/signup', {
          method: 'POST',
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (result.success) {
          toast.success('Account created successfully! 🎉');
          // Auto sign in after signup
          const signInResult = await apiCall('/auth/signin', {
            method: 'POST',
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          });
          if (signInResult.success && signInResult.session) {
            // Set the session in Supabase client
            const supabase = createClient();
            await supabase.auth.setSession({
              access_token: signInResult.session.access_token,
              refresh_token: signInResult.session.refresh_token,
            });
            
            onLogin(signInResult.user.id);
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const supabase = createClient();
      // Note: Google OAuth requires setup at https://supabase.com/docs/guides/auth/social-login/auth-google
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      
      if (error) {
        toast.error('Google sign-in not configured. Please use email/password.');
      }
    } catch (error) {
      toast.error('Google sign-in failed');
    }
  };

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

      {/* Main Card */}
      <Card className="w-full max-w-sm mx-auto p-6 shadow-2xl border-0 bg-white/90 backdrop-blur-sm relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tab Switcher */}
          <div className="flex rounded-full p-1" style={{ backgroundColor: 'var(--eco-green-lighter)' }}>
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-full transition-all font-medium ${
                isLogin 
                  ? 'bg-white shadow-md text-white' 
                  : 'text-gray-600'
              }`}
              style={{
                backgroundColor: isLogin ? 'var(--eco-green-primary)' : 'transparent',
                color: isLogin ? 'white' : 'var(--eco-green-primary)'
              }}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-full transition-all font-medium ${
                !isLogin 
                  ? 'bg-white shadow-md text-white' 
                  : 'text-gray-600'
              }`}
              style={{
                backgroundColor: !isLogin ? 'var(--eco-green-primary)' : 'transparent',
                color: !isLogin ? 'white' : 'var(--eco-green-primary)'
              }}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <Input 
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!isLogin}
                  disabled={isLoading}
                  className="h-12 border-gray-200 focus:border-green-500 rounded-xl"
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <Input 
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
                className="h-12 pl-10 border-gray-200 focus:border-green-500 rounded-xl"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <Input 
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
                className="h-12 pl-10 pr-10 border-gray-200 focus:border-green-500 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <Input 
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required={!isLogin}
                  disabled={isLoading}
                  className="h-12 pl-10 border-gray-200 focus:border-green-500 rounded-xl"
                />
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-white rounded-xl shadow-lg font-medium"
            style={{ background: 'linear-gradient(135deg, var(--eco-green-primary) 0%, var(--eco-green-light) 100%)' }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {isLogin ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              <>{isLogin ? "Login" : "Create Account"}</>
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Social Login */}
          <Button 
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-12 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl"
          >
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
              <span>Continue with Google</span>
            </div>
          </Button>

          {/* Footer */}
          {isLogin && (
            <div className="text-center">
              <button type="button" className="text-sm hover:underline" style={{ color: 'var(--eco-green-primary)' }}>
                Forgot password?
              </button>
            </div>
          )}
        </form>
      </Card>

      {/* Terms */}
      <p className="text-xs text-gray-500 text-center mt-6 px-4 relative z-10">
        By continuing, you agree to our Terms of Service and Privacy Policy.<br/>
        Join 10,000+ eco-warriors making a difference! 🌱
      </p>

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
    </div>
  );
}