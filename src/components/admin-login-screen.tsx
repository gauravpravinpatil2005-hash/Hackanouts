import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Leaf, Mail, Lock, Eye, EyeOff, Sprout, Loader2 } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner@2.0.3";

interface AdminLoginScreenProps {
  onLogin: () => void;
}

export function AdminLoginScreen({ onLogin }: AdminLoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    // Simulate admin authentication
    setTimeout(() => {
      // For demo purposes, accept any credentials
      // In production, this would connect to your backend
      if (formData.username && formData.password) {
        toast.success('Welcome back, Admin!');
        onLogin();
      } else {
        toast.error('Invalid credentials');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
         style={{ backgroundColor: '#F9F9F9' }}>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top left decoration */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-10"
             style={{ backgroundColor: '#2E7D32' }} />
        
        {/* Bottom right decoration */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10"
             style={{ backgroundColor: '#66BB6A' }} />
        
        {/* Floating leaf icons */}
        <Leaf className="absolute top-20 right-1/4 text-green-200 opacity-30 w-12 h-12" />
        <Sprout className="absolute bottom-32 left-1/4 text-green-300 opacity-20 w-16 h-16" />
        <Leaf className="absolute top-1/3 left-20 text-green-200 opacity-20 w-10 h-10 rotate-45" />
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md p-8 shadow-lg border-0 relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
               style={{ backgroundColor: '#E8F5E9' }}>
            <Leaf className="w-8 h-8" style={{ color: '#2E7D32' }} />
          </div>
          <h1 className="mb-2" style={{ color: '#1F1F1F' }}>Admin Login</h1>
          <p className="text-gray-600">Eco Tracker Administration</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username/Email Input */}
          <div className="space-y-2">
            <label className="block text-sm text-gray-700">
              Email or Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="admin@ecotracker.com"
                className="pl-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-sm text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember" 
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <label
              htmlFor="remember"
              className="text-sm text-gray-700 cursor-pointer select-none"
            >
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full h-12 rounded-full shadow-md hover:shadow-lg transition-all"
            style={{ 
              backgroundColor: '#2E7D32',
              color: 'white'
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>

          {/* Forgot Password Link */}
          <div className="text-center">
            <button
              type="button"
              className="text-sm hover:underline"
              style={{ color: '#2E7D32' }}
              onClick={() => toast.info('Password reset link would be sent to your email')}
            >
              Forgot password?
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Secure admin access for Eco Tracker
          </p>
        </div>
      </Card>
    </div>
  );
}
