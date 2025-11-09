import { useState, useEffect } from "react";
import { Plus, Filter, Search, Footprints, Bike, Car, Recycle, TreePine, Droplets, Loader2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { apiCall } from "../utils/supabase/client";

interface Activity {
  id: string;
  type: string;
  title: string;
  distance?: string;
  duration?: string;
  co2Saved: string;
  points: number;
  date: string;
  createdAt: string;
  icon: any;
  color: string;
}

interface ActivitiesScreenProps {
  userId: string | null;
}

export function ActivitiesScreen({ userId }: ActivitiesScreenProps) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
    
    try {
      setIsLoading(true);
      const data = await apiCall('/activities');
      
      // Map activities with icons
      const mappedActivities = data.activities.map((activity: any) => ({
        ...activity,
        icon: getActivityIcon(activity.type),
        color: getActivityColor(activity.type),
      }));
      
      setActivities(mappedActivities);
    } catch (error) {
      // API error - using demo data fallback
      
      // Use demo data if API fails
      const demoActivities = [
        {
          id: '1',
          type: 'cycling',
          title: 'Morning Commute by Bike',
          distance: '5.2 km',
          duration: '25 min',
          co2Saved: '4.2',
          points: 30,
          date: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'recycling',
          title: 'Recycled Plastic Bottles',
          co2Saved: '2.5',
          points: 50,
          date: new Date(Date.now() - 86400000).toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          type: 'tree_planting',
          title: 'Community Tree Planting',
          co2Saved: '8.0',
          points: 100,
          date: new Date(Date.now() - 172800000).toISOString(),
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: '4',
          type: 'walking',
          title: 'Walk to Local Store',
          distance: '1.5 km',
          duration: '20 min',
          co2Saved: '1.2',
          points: 15,
          date: new Date(Date.now() - 259200000).toISOString(),
          createdAt: new Date(Date.now() - 259200000).toISOString(),
        },
        {
          id: '5',
          type: 'water_conservation',
          title: 'Collected Rainwater',
          co2Saved: '0.5',
          points: 20,
          date: new Date(Date.now() - 345600000).toISOString(),
          createdAt: new Date(Date.now() - 345600000).toISOString(),
        },
      ];
      
      const mappedActivities = demoActivities.map((activity: any) => ({
        ...activity,
        icon: getActivityIcon(activity.type),
        color: getActivityColor(activity.type),
      }));
      
      setActivities(mappedActivities);
    } finally {
      setIsLoading(false);
    }
  };

    fetchActivities();
  }, [userId]);

  const getActivityIcon = (type: string) => {
    const icons: any = {
      walking: Footprints,
      cycling: Bike,
      public_transport: Car,
      recycling: Recycle,
      tree_planting: TreePine,
      water_conservation: Droplets,
    };
    return icons[type] || Footprints;
  };

  const getActivityColor = (type: string) => {
    const colors: any = {
      walking: 'text-green-600',
      cycling: 'text-blue-600',
      public_transport: 'text-orange-600',
      recycling: 'text-emerald-600',
      tree_planting: 'text-green-700',
      water_conservation: 'text-blue-500',
    };
    return colors[type] || 'text-gray-600';
  };

  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'walking', label: 'Walking' },
    { id: 'cycling', label: 'Cycling' },
    { id: 'recycling', label: 'Recycling' },
    { id: 'public_transport', label: 'Transport' },
    { id: 'tree_planting', label: 'Plants' },
    { id: 'water_conservation', label: 'Water' }
  ];

  const filteredActivities = activities.filter(activity => 
    (filter === 'all' || activity.type === filter) &&
    (activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     activity.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalCO2 = activities.reduce((sum, act) => sum + parseFloat(act.co2Saved), 0);
  const totalPoints = activities.reduce((sum, act) => sum + act.points, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--eco-green-primary)' }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Activities</h1>
          <Button 
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white rounded-full"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 border-gray-200 focus:border-green-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filterOptions.map((option) => (
            <Button
              key={option.id}
              variant={filter === option.id ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(option.id)}
              className={`whitespace-nowrap rounded-full ${
                filter === option.id 
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">{activities.length}</p>
            <p className="text-sm text-gray-600">Total Activities</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">{totalCO2.toFixed(1)}kg</p>
            <p className="text-sm text-gray-600">CO₂ Saved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">{totalPoints}</p>
            <p className="text-sm text-gray-600">Points Earned</p>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="flex-1 px-6 py-4">
        <div className="space-y-3">
          {filteredActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <Card key={activity.id} className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{activity.title}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        {activity.distance && (
                          <span className="text-sm text-gray-600">{activity.distance}</span>
                        )}
                        {activity.duration && (
                          <span className="text-sm text-gray-600">• {activity.duration}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{activity.date || new Date(activity.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 mb-1">
                      +{activity.points} pts
                    </Badge>
                    <p className="text-sm text-green-600 font-medium">-{activity.co2Saved} CO₂</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No activities found</h3>
            <p className="text-gray-600 mb-4">
              {activities.length === 0 
                ? 'Start tracking your eco-friendly activities!' 
                : 'Try adjusting your search or filter criteria'}
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add New Activity
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
