import { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, MapPin, Timer, TrendingUp, Star, Sparkles, Navigation, Footprints, Bike, Activity, Mountain, Zap, Wind, Thermometer, Droplets, Cloud, X } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { apiCall } from "../utils/supabase/client";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";

interface TrackerScreenProps {
  userId: string | null;
}

type ActivityType = 'walking' | 'running' | 'cycling' | 'hiking' | 'skating' | 'scooter';

export function TrackerScreen({ userId }: TrackerScreenProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [distance, setDistance] = useState(0);
  const [co2Saved, setCo2Saved] = useState(0);
  const [calories, setCalories] = useState(0);
  const [showPointsCelebration, setShowPointsCelebration] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [activityType, setActivityType] = useState<ActivityType>('walking');
  const [steps, setSteps] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [pathPoints, setPathPoints] = useState<Array<{x: number, y: number}>>([]);
  const pathAnimationRef = useRef<number>(0);
  const [showClimateWidget, setShowClimateWidget] = useState(false);
  const [environmentalData, setEnvironmentalData] = useState({
    aqi: 42,
    aqiLevel: 'Good',
    aqiColor: '#2E7D32',
    temperature: 24,
    humidity: 65,
    windSpeed: 12
  });

  // Simulate real-time environmental data updates
  useEffect(() => {
    const updateEnvironmentalData = () => {
      const newAqi = Math.floor(35 + Math.random() * 50);
      let aqiLevel = 'Good';
      let aqiColor = '#2E7D32';
      
      if (newAqi <= 50) {
        aqiLevel = 'Good';
        aqiColor = '#2E7D32';
      } else if (newAqi <= 100) {
        aqiLevel = 'Moderate';
        aqiColor = '#F97316';
      } else {
        aqiLevel = 'Unhealthy';
        aqiColor = '#DC2626';
      }
      
      setEnvironmentalData({
        aqi: newAqi,
        aqiLevel,
        aqiColor,
        temperature: Math.floor(22 + Math.random() * 6),
        humidity: Math.floor(60 + Math.random() * 15),
        windSpeed: Math.floor(8 + Math.random() * 10)
      });
    };

    const interval = setInterval(updateEnvironmentalData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Activity configuration with speed, calories, CO2 impact
  const getActivityConfig = (type: ActivityType) => {
    const configs = {
      walking: { speed: 5, caloriesPerKm: 50, co2Factor: 0.3, hasSteps: true, color: '#2E7D32', icon: Footprints, label: 'Walk' },
      running: { speed: 10, caloriesPerKm: 80, co2Factor: 0.35, hasSteps: true, color: '#F97316', icon: Activity, label: 'Run' },
      cycling: { speed: 18, caloriesPerKm: 40, co2Factor: 0.4, hasSteps: false, color: '#1565C0', icon: Bike, label: 'Cycle' },
      hiking: { speed: 4, caloriesPerKm: 70, co2Factor: 0.35, hasSteps: true, color: '#7C3AED', icon: Mountain, label: 'Hike' },
      skating: { speed: 12, caloriesPerKm: 55, co2Factor: 0.38, hasSteps: false, color: '#EC4899', icon: Zap, label: 'Skate' },
      scooter: { speed: 15, caloriesPerKm: 35, co2Factor: 0.42, hasSteps: false, color: '#14B8A6', icon: Zap, label: 'Scooter' }
    };
    return configs[type];
  };

  useEffect(() => {
    let interval: any = null;
    
    if (isTracking && !isPaused) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const newSeconds = prev + 1;
          
          // Get activity config
          const config = getActivityConfig(activityType);
          const currentSpeed = config.speed;
          
          // Update distance based on activity type
          const distancePerSecond = currentSpeed / 3600; // km per second
          const newDistance = parseFloat((distance + distancePerSecond).toFixed(3));
          setDistance(newDistance);
          
          // Update speed (km/h)
          setSpeed(currentSpeed);
          
          // CO2 saved
          const co2Impact = newDistance * config.co2Factor;
          setCo2Saved(parseFloat(co2Impact.toFixed(2)));
          
          // Calories based on activity type
          setCalories(Math.floor(newDistance * config.caloriesPerKm));
          
          // Steps (only for activities with steps)
          if (config.hasSteps) {
            const stepsPerKm = activityType === 'running' ? 1100 : activityType === 'hiking' ? 1400 : 1300;
            setSteps(Math.floor(newDistance * stepsPerKm));
          }
          
          return newSeconds;
        });
        
        // Add new path point for animation
        if (isTracking && !isPaused) {
          pathAnimationRef.current += 1;
          const angle = pathAnimationRef.current * 0.1;
          const radius = 50 + Math.sin(pathAnimationRef.current * 0.05) * 30;
          
          setPathPoints(prev => {
            const newPoints = [...prev, {
              x: 150 + Math.cos(angle) * radius,
              y: 180 + Math.sin(angle) * radius
            }];
            // Keep only last 50 points for performance
            return newPoints.slice(-50);
          });
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, isPaused, activityType, distance]);

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
      // Initialize path at center
      setPathPoints([{ x: 150, y: 180 }]);
      pathAnimationRef.current = 0;
      toast.success(`${getActivityConfig(activityType).label} tracking started! 🏃`);
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
          type: activityType,
          title: `${activityType.charAt(0).toUpperCase() + activityType.slice(1)} Activity`,
          distance: `${distance.toFixed(2)} km`,
          duration: formatTime(seconds),
          co2Saved: co2Saved.toString(),
          points: points,
          date: new Date().toISOString(),
        }),
      });

      // Show animated points celebration
      setEarnedPoints(points);
      setShowPointsCelebration(true);
      
      toast.success(`Activity saved! +${points} eco points earned! 🎉`);
      
      // Hide celebration after 3 seconds
      setTimeout(() => {
        setShowPointsCelebration(false);
      }, 3000);
      
      // Reset tracking
      setIsTracking(false);
      setIsPaused(false);
      setSeconds(0);
      setDistance(0);
      setCo2Saved(0);
      setCalories(0);
      setSteps(0);
      setSpeed(0);
      setPathPoints([]);
      pathAnimationRef.current = 0;
    } catch (error: any) {
      toast.error(error.message || 'Failed to save activity');
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? 'Resumed tracking' : 'Tracking paused');
  };

  const activities: ActivityType[] = ['walking', 'running', 'cycling', 'hiking', 'skating', 'scooter'];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pb-20 overflow-hidden">
      {/* Activity Selection Bar */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {activities.map((activity) => {
            const config = getActivityConfig(activity);
            const Icon = config.icon;
            const isActive = activityType === activity;
            
            return (
              <motion.button
                key={activity}
                onClick={() => !isTracking && setActivityType(activity)}
                disabled={isTracking}
                className={`flex flex-col items-center justify-center min-w-[64px] px-3 py-2 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-gradient-to-br shadow-md' 
                    : 'bg-gray-50 hover:bg-gray-100'
                } ${isTracking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{
                  background: isActive ? `linear-gradient(135deg, ${config.color}15, ${config.color}25)` : undefined,
                  borderWidth: isActive ? '2px' : '1px',
                  borderColor: isActive ? config.color : '#E5E7EB',
                }}
                whileTap={!isTracking ? { scale: 0.95 } : {}}
              >
                <Icon 
                  className="w-5 h-5 mb-1" 
                  style={{ color: isActive ? config.color : '#6B7280' }}
                />
                <span 
                  className="text-xs font-medium"
                  style={{ color: isActive ? config.color : '#6B7280' }}
                >
                  {config.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Live Map */}
        <div className="absolute inset-4 bg-gradient-to-br from-green-100 via-blue-50 to-green-100 rounded-3xl overflow-hidden shadow-xl">
          {/* Grid background */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-green-300" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Animated path trail */}
          {pathPoints.length > 1 && (
            <motion.svg
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.path
                d={`M ${pathPoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
                fill="none"
                stroke={getActivityConfig(activityType).color}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  filter: `drop-shadow(0 0 10px ${getActivityConfig(activityType).color}60)`
                }}
              />
              {/* Dotted trail */}
              <motion.path
                d={`M ${pathPoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
                fill="none"
                stroke={getActivityConfig(activityType).color}
                strokeWidth="2"
                strokeDasharray="6,6"
                strokeLinecap="round"
                opacity="0.4"
              />
            </motion.svg>
          )}

          {/* Start marker */}
          {pathPoints.length > 0 && (
            <motion.div
              className="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"
              style={{
                left: pathPoints[0].x - 8,
                top: pathPoints[0].y - 8
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            />
          )}

          {/* Animated current location marker */}
          {isTracking && pathPoints.length > 0 && (
            <motion.div
              className="absolute"
              style={{
                left: pathPoints[pathPoints.length - 1].x - 20,
                top: pathPoints[pathPoints.length - 1].y - 20
              }}
            >
              {/* Pulsing rings */}
              <motion.div
                className="absolute w-16 h-16 rounded-full -left-4 -top-4"
                style={{ backgroundColor: getActivityConfig(activityType).color }}
                animate={{ 
                  scale: [1, 2.5, 2.5],
                  opacity: [0.5, 0.2, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute w-16 h-16 rounded-full -left-4 -top-4"
                style={{ backgroundColor: getActivityConfig(activityType).color }}
                animate={{ 
                  scale: [1, 2, 2],
                  opacity: [0.6, 0.3, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
              {/* Activity icon marker */}
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl border-4 border-white"
                style={{ backgroundColor: getActivityConfig(activityType).color }}
              >
                {(() => {
                  const Icon = getActivityConfig(activityType).icon;
                  return <Icon className="w-8 h-8" />;
                })()}
              </div>
              {/* Direction indicator */}
              <motion.div
                className="absolute -top-3 left-1/2 -translate-x-1/2"
                animate={{ y: [-6, 0, -6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Navigation className="w-5 h-5" style={{ color: getActivityConfig(activityType).color }} />
              </motion.div>
            </motion.div>
          )}

          {/* Placeholder when not tracking */}
          {!isTracking && (
            <div className="absolute inset-0 flex items-center justify-center pb-28">
              <div className="text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MapPin className="w-16 h-16 text-green-600 mx-auto mb-3" />
                </motion.div>
                <p className="text-gray-700 font-semibold text-lg">Ready to Track</p>
                <p className="text-sm text-gray-500 mt-1 px-4">Press Start to begin your journey</p>
              </div>
            </div>
          )}
        </div>

        {/* Cloud Icon Button - Top Right Corner */}
        <motion.button
          onClick={() => setShowClimateWidget(!showClimateWidget)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-8 right-8 w-12 h-12 bg-white/95 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center border border-gray-100 hover:bg-white transition-colors"
        >
          <Cloud className="w-5 h-5 text-blue-600" />
        </motion.button>

        {/* Compact Climate Widget - Toggleable Pop-up */}
        <AnimatePresence>
          {showClimateWidget && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20, y: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20, y: -20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="absolute top-8 right-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-3 border border-gray-100"
            >
              {/* Close button */}
              <button
                onClick={() => setShowClimateWidget(false)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-md transition-colors"
              >
                <X className="w-3 h-3 text-white" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <Cloud className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-gray-700">Climate</span>
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-500 rounded-full"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {/* AQI */}
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center gap-1 mb-1">
                    <Wind className="w-3 h-3" style={{ color: environmentalData.aqiColor }} />
                    <span className="text-xs text-gray-500">AQI</span>
                  </div>
                  <p className="text-sm font-bold" style={{ color: environmentalData.aqiColor }}>
                    {environmentalData.aqi}
                  </p>
                  <p className="text-xs text-gray-400">{environmentalData.aqiLevel}</p>
                </div>
                
                {/* Temperature */}
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center gap-1 mb-1">
                    <Thermometer className="w-3 h-3 text-orange-500" />
                    <span className="text-xs text-gray-500">Temp</span>
                  </div>
                  <p className="text-sm font-bold text-orange-600">{environmentalData.temperature}°C</p>
                </div>
                
                {/* Humidity */}
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center gap-1 mb-1">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-gray-500">Humid</span>
                  </div>
                  <p className="text-sm font-bold text-blue-600">{environmentalData.humidity}%</p>
                </div>
                
                {/* Wind */}
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center gap-1 mb-1">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <Wind className="w-3 h-3 text-teal-500" />
                    </motion.div>
                    <span className="text-xs text-gray-500">Wind</span>
                  </div>
                  <p className="text-sm font-bold text-teal-600">{environmentalData.windSpeed} km/h</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Control Buttons - Bottom Center */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
          {/* Pause Button */}
          {isTracking && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Button
                onClick={handlePause}
                size="lg"
                className={`w-14 h-14 rounded-full shadow-xl border-4 border-white ${
                  isPaused 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
              >
                {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
              </Button>
            </motion.div>
          )}

          {/* Start/Stop Button */}
          <Button
            onClick={handleStartStop}
            size="lg"
            className={`w-20 h-20 rounded-full shadow-2xl border-4 border-white ${
              isTracking 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
            }`}
          >
            {isTracking ? (
              <Square className="w-9 h-9" />
            ) : (
              <Play className="w-9 h-9 ml-1" />
            )}
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white px-4 py-4 border-t border-gray-100 shadow-lg">
        <div className="grid grid-cols-3 gap-3 mb-3">
          {/* Distance */}
          <motion.div
            key={`distance-${distance}`}
            initial={{ scale: 1 }}
            animate={{ scale: isTracking && !isPaused ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-3 border border-green-100"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-gray-600 font-medium">Distance</span>
            </div>
            <p className="text-xl font-bold text-green-700">{distance.toFixed(2)}</p>
            <p className="text-xs text-gray-500">kilometers</p>
          </motion.div>

          {/* Duration */}
          <motion.div
            key={`time-${seconds}`}
            initial={{ scale: 1 }}
            animate={{ scale: seconds % 60 === 0 && isTracking && !isPaused ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-3 border border-blue-100"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Timer className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-gray-600 font-medium">Time</span>
            </div>
            <p className="text-xl font-bold text-blue-700">{formatTime(seconds)}</p>
            <p className="text-xs text-gray-500">duration</p>
          </motion.div>

          {/* Eco Points */}
          <motion.div
            key={`points-${Math.floor(distance * 10)}`}
            initial={{ scale: 1 }}
            animate={{ scale: isTracking && !isPaused ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-3 border-2 border-yellow-300"
          >
            <div className="flex items-center gap-2 mb-1">
              <motion.div 
                className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                animate={{ rotate: isTracking && !isPaused ? [0, 10, -10, 0] : 0 }}
                transition={{ duration: 2, repeat: isTracking && !isPaused ? Infinity : 0 }}
              >
                <Star className="w-4 h-4 text-yellow-900 fill-yellow-900" />
              </motion.div>
              <span className="text-xs text-yellow-800 font-medium">Points</span>
            </div>
            <p className="text-xl font-bold text-yellow-900">+{Math.floor(distance * 10)}</p>
            <p className="text-xs text-yellow-700">eco points</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Steps (conditional) */}
          {getActivityConfig(activityType).hasSteps && (
            <motion.div
              key={`steps-${steps}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-3 border border-purple-100"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Footprints className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs text-gray-600 font-medium">Steps</span>
              </div>
              <motion.p 
                className="text-xl font-bold text-purple-700"
                key={steps}
                animate={{ scale: isTracking && !isPaused ? [1, 1.08, 1] : 1 }}
                transition={{ duration: 0.5 }}
              >
                {steps.toLocaleString()}
              </motion.p>
              <p className="text-xs text-gray-500">total steps</p>
            </motion.div>
          )}

          {/* Calories */}
          <motion.div
            className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-3 border border-orange-100"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs text-gray-600 font-medium">Calories</span>
            </div>
            <motion.p 
              className="text-xl font-bold text-orange-700"
              key={calories}
              animate={{ scale: isTracking && !isPaused && calories > 0 ? [1, 1.08, 1] : 1 }}
              transition={{ duration: 0.5 }}
            >
              {calories}
            </motion.p>
            <p className="text-xs text-gray-500">kcal burned</p>
          </motion.div>

          {/* CO2 Saved */}
          <motion.div
            className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-3 border border-emerald-100"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                CO₂
              </div>
              <span className="text-xs text-gray-600 font-medium">Saved</span>
            </div>
            <motion.p 
              className="text-xl font-bold text-emerald-700"
              key={co2Saved}
              animate={{ scale: isTracking && !isPaused && co2Saved > 0 ? [1, 1.08, 1] : 1 }}
              transition={{ duration: 0.5 }}
            >
              {co2Saved.toFixed(2)}
            </motion.p>
            <p className="text-xs text-gray-500">kg CO₂</p>
          </motion.div>
        </div>
      </div>

      {/* Points Celebration Animation */}
      <AnimatePresence>
        {showPointsCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: -50 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              {/* Animated background stars */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      scale: [0, 1.5, 0],
                      rotate: [0, 180, 360],
                      x: [0, (i % 2 ? 1 : -1) * 50],
                      y: [0, -80]
                    }}
                    transition={{ 
                      duration: 2, 
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                    className="absolute"
                    style={{
                      left: `${20 + (i * 10)}%`,
                      top: '50%'
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                ))}
              </div>

              <div className="relative z-10 text-center">
                {/* Trophy/Star Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
                >
                  <Star className="w-14 h-14 text-white fill-white" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-gray-900 mb-2">Points Earned! 🎉</h2>
                  <motion.div 
                    className="text-6xl font-bold mb-4"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: [0.5, 1.2, 1] }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    style={{
                      background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    +{earnedPoints}
                  </motion.div>
                  <p className="text-gray-600 mb-4">
                    Eco Points added to your account
                  </p>
                  
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                    <p className="text-sm text-green-800">
                      Keep earning points to unlock exclusive brand discounts! 🌿
                    </p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <Button
                      onClick={() => setShowPointsCelebration(false)}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8"
                    >
                      Awesome!
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
