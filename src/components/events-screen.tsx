import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Clock, Star, Filter, Heart, Share, Loader2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { apiCall } from "../utils/supabase/client";
import { toast } from "sonner@2.0.3";

interface Event {
  id: string;
  title: string;
  organizer?: string;
  ngo?: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  participants: number;
  maxParticipants: number;
  points?: number;
  pointsReward?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  image: string;
  isRSVPed?: boolean;
  isFavorite?: boolean;
  tags?: string[];
}

interface EventsScreenProps {
  userId: string | null;
}

export function EventsScreen({ userId }: EventsScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await apiCall('/events');
        // Map events to add default values
        const mappedEvents = (data.events || []).map((event: any) => ({
          ...event,
          ngo: event.organizer || event.ngo || 'ECO-Tracker',
          pointsReward: event.points || event.pointsReward || 50,
          difficulty: event.difficulty || 'Easy',
          isRSVPed: false,
          isFavorite: false,
          tags: event.tags || [],
        }));
        setEvents(mappedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [userId]);

  const handleRSVP = async (eventId: string) => {
    if (!userId) {
      toast.error('Please log in to RSVP');
      return;
    }

    try {
      await apiCall(`/events/${eventId}/join`, {
        method: 'POST',
      });

      toast.success('RSVP confirmed! See you there! 🎉');
      
      // Update local state
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === eventId ? { ...event, isRSVPed: true } : event
        )
      );
    } catch (error: any) {
      toast.error(error.message || 'Failed to RSVP');
      console.error('RSVP error:', error);
    }
  };



  const categories = [
    { id: "all", label: "All Events", icon: "🌍" },
    { id: "cleanup", label: "Cleanup", icon: "🧹" },
    { id: "planting", label: "Planting", icon: "🌱" },
    { id: "education", label: "Education", icon: "📚" },
    { id: "awareness", label: "Awareness", icon: "📢" },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.ngo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const myEvents = events.filter(event => event.isRSVPed);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--eco-background)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--eco-blue-primary)' }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-20" style={{ backgroundColor: 'var(--eco-background)' }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-6" style={{ backgroundColor: 'var(--eco-blue-primary)' }}>
        <h1 className="text-2xl font-bold text-white mb-2">NGO Events</h1>
        <p className="text-blue-100">Join eco-events and make a real impact!</p>
      </div>

      {/* Search and Filter */}
      <div className="px-6 py-4 bg-white shadow-sm">
        <div className="flex space-x-3 mb-4">
          <Input
            placeholder="Search events, NGOs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`whitespace-nowrap rounded-full ${
                selectedCategory === category.id
                  ? 'text-white shadow-lg'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
              style={{
                backgroundColor: selectedCategory === category.id ? 'var(--eco-blue-primary)' : 'transparent'
              }}
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Event Tabs */}
      <div className="flex-1">
        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mx-6 mt-4">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="my-events">My Events ({myEvents.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="px-6 mt-6">
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden shadow-sm border-0">
                  {/* Event Image */}
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                    <div className="text-center">
                      <Calendar className="w-12 h-12 mx-auto mb-2" style={{ color: 'var(--eco-blue-primary)' }} />
                      <p className="text-sm font-medium" style={{ color: 'var(--eco-blue-primary)' }}>
                        Event Image
                      </p>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
                        <p className="text-sm" style={{ color: 'var(--eco-blue-primary)' }}>
                          by {event.ngo}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`p-1 ${event.isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                        >
                          <Heart className={`w-4 h-4 ${event.isFavorite ? 'fill-current' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 text-gray-400">
                          <Share className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(event.date).toLocaleDateString()} • {event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{event.participants}/{event.maxParticipants} participants</span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center space-x-2 mb-4">
                      <Badge 
                        className={`text-xs ${getDifficultyColor(event.difficulty)}`}
                        variant="outline"
                      >
                        {event.difficulty}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ backgroundColor: 'var(--points-yellow)', color: '#000' }}
                      >
                        <Star className="w-3 h-3 mr-1" />
                        {event.pointsReward} pts
                      </Badge>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            backgroundColor: 'var(--eco-green-light)',
                            width: `${(event.participants / event.maxParticipants) * 100}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleRSVP(event.id)}
                      disabled={event.isRSVPed}
                      className={`w-full ${
                        event.isRSVPed
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'text-white shadow-lg'
                      }`}
                      style={{
                        backgroundColor: event.isRSVPed ? undefined : 'var(--eco-blue-primary)'
                      }}
                    >
                      {event.isRSVPed ? '✓ RSVP Confirmed' : 'RSVP Now'}
                    </Button>
                  </div>
                </Card>
              ))}

              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No events found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-events" className="px-6 mt-6">
            <div className="space-y-4">
              {myEvents.map((event) => (
                <Card key={event.id} className="p-4 shadow-sm border-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-8 h-8" style={{ color: 'var(--eco-blue-primary)' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.ngo}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge 
                      className="text-xs bg-green-100 text-green-800"
                      variant="outline"
                    >
                      Confirmed
                    </Badge>
                  </div>
                </Card>
              ))}

              {myEvents.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No events yet</h3>
                  <p className="text-gray-600 mb-4">RSVP to events to see them here</p>
                  <Button 
                    className="text-white"
                    style={{ backgroundColor: 'var(--eco-blue-primary)' }}
                  >
                    Discover Events
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}