import { useState, useEffect } from "react";
import { Play, Pause, Square, MapPin, Timer, TrendingUp, Zap } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { apiCall } from "../utils/supabase/client";
import { toast } from "sonner@2.0.3";

interface TrackerScreenProps {
  userId: string | null;
}

export function TrackerScreen({ userId }: TrackerScreenProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [distance, setDistance] = useState(0);
  const [co2Saved, setCo2Saved] = useState(0);
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    let interval: any = null;
    
    if (isTracking && !isPaused) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const newSeconds = prev + 1;
          // Simulate distance increase (roughly 5km/h walking speed)
          setDistance(parseFloat((newSeconds / 720).toFixed(2))); // km
          // CO2 saved: ~0.3kg per km walked
          setCo2Saved(parseFloat((newSeconds / 720 * 0.3).toFixed(2)));
          // Calories: ~50 cal per km
          setCalories(Math.floor(newSeconds / 720 * 50));
          return newSeconds;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, isPaused]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (!isTracking) {
      setIsTracking(true);
      setIsPaused(false);
      toast.success('Activity tracking started! 🏃');
    } else {
      saveActivity();
    }
  };

  const saveActivity = async () => {
    if (distance === 0) {
      toast.error('No activity to save');
      setIsTracking(false);
      return;
    }

    try {
      const points = Math.floor(distance * 10); // 10 points per km
      
      await apiCall('/activities', {
        method: 'POST',
        body: JSON.stringify({
          type: 'walking',
          title: 'Walking Activity',
          distance: `${distance} km`,
          duration: formatTime(seconds),
          co2Saved: co2Saved.toString(),
          points: points,
          date: new Date().toISOString(),
        }),
      });

      toast.success(`Activity saved! +${points} points 🎉`);
      
      // Reset tracking
      setIsTracking(false);
      setIsPaused(false);
      setSeconds(0);
      setDistance(0);
      setCo2Saved(0);
      setCalories(0);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save activity');
      console.error('Save activity error:', error);
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? 'Resumed tracking' : 'Tracking paused');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Live Tracker</h1>
        <p className="text-gray-600">Track your eco-friendly activities in real-time</p>
      </div>

      {/* Map Area */}
      <div className="relative h-64 bg-gradient-to-br from-green-100 to-blue-100 mx-6 mt-6 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <p className="text-gray-600 font-medium">Interactive Map</p>
            <p className="text-sm text-gray-500">Real-time route tracking</p>
          </div>
        </div>
        
        {/* Mock route path */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Walking Route</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Active
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mt-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 border-0 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Timer className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-xl font-bold text-gray-800">{formatTime(seconds)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-0 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Distance</p>
                <p className="text-xl font-bold text-gray-800">{distance.toFixed(2)} km</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="p-4 border-0 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 font-bold text-sm">CO₂</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">CO₂ Saved</p>
                <p className="text-xl font-bold text-green-600">{co2Saved.toFixed(2)} kg</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-0 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Calories</p>
                <p className="text-xl font-bold text-gray-800">{calories}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Control Panel */}
      <div className="px-6 mt-auto">
        <Card className="p-6 border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {isTracking ? (isPaused ? 'Paused' : 'Tracking Active') : 'Ready to Start'}
            </h3>
            <p className="text-sm text-gray-600">
              {isTracking 
                ? 'Keep going! Every step makes a difference.' 
                : 'Choose your activity and start tracking your eco-impact.'}
            </p>
          </div>

          {/* Activity Type Selector */}
          {!isTracking && (
            <div className="grid grid-cols-3 gap-2 mb-6">
              <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                🚶 Walk
              </Button>
              <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                🚴 Bike
              </Button>
              <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50">
                🚌 Transit
              </Button>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-4">
            {isTracking && !isPaused && (
              <Button 
                onClick={handlePause}
                variant="outline"
                size="lg"
                className="w-14 h-14 rounded-full border-yellow-200 text-yellow-600 hover:bg-yellow-50"
              >
                <Pause className="w-6 h-6" />
              </Button>
            )}

            {isTracking && isPaused && (
              <Button 
                onClick={handlePause}
                size="lg"
                className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="w-6 h-6" />
              </Button>
            )}

            <Button 
              onClick={handleStartStop}
              size="lg"
              className={`w-20 h-20 rounded-full ${
                isTracking 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white shadow-lg`}
            >
              {isTracking ? (
                <Square className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8" />
              )}
            </Button>

            {isTracking && (
              <div className="w-14 h-14 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs text-gray-500">Points</div>
                  <div className="text-lg font-bold text-green-600">+{Math.floor(parseFloat(distance) * 10)}</div>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              {isTracking 
                ? (isPaused ? 'Tap play to resume' : 'Tap square to stop tracking')
                : 'Tap play to start tracking your activity'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}