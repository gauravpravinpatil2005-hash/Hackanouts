import { useState, useEffect } from "react";
import { Camera, Upload, X, MapPin, Tag, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { apiCall } from "../utils/supabase/client";
import { toast } from "sonner@2.0.3";

interface UploadedProof {
  id: string;
  image: string;
  caption: string;
  category: string;
  location: string;
  status: 'pending' | 'verified' | 'rejected';
  pointsAwarded?: number;
  uploadDate: string;
  verifiedBy?: string;
  createdAt: string;
}

interface UploadScreenProps {
  userId: string | null;
}

export function UploadScreen({ userId }: UploadScreenProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploads, setUploads] = useState<UploadedProof[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUploads = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const data = await apiCall('/uploads');
        setUploads(data.uploads || []);
      } catch (error) {
        console.error('Error fetching uploads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUploads();
  }, [userId]);

  const categories = [
    { id: 'cleanup', label: '🧹 Community Cleanup', points: '50-100' },
    { id: 'planting', label: '🌱 Tree Planting', points: '75-150' },
    { id: 'recycling', label: '♻️ Recycling Drive', points: '25-75' },
    { id: 'transport', label: '🚲 Eco Transport', points: '15-50' },
    { id: 'awareness', label: '📢 Eco Awareness', points: '30-80' },
    { id: 'conservation', label: '💧 Water Conservation', points: '40-90' },
    { id: 'organic', label: '🥬 Organic/Local Food', points: '20-60' },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedFiles.length || !caption || !selectedCategory || !userId) return;
    
    try {
      setIsUploading(true);
      
      // In a real app, you would upload files to storage first
      // For now, we'll just save the metadata
      const categoryLabel = categories.find(c => c.id === selectedCategory)?.label || selectedCategory;
      
      await apiCall('/uploads', {
        method: 'POST',
        body: JSON.stringify({
          caption,
          category: categoryLabel,
          location: location || 'Not specified',
          image: 'placeholder.jpg', // In real app, this would be the uploaded file URL
        }),
      });

      toast.success('Upload submitted for verification! 📤');
      
      // Reset form and refresh uploads
      setSelectedFiles([]);
      setCaption("");
      setSelectedCategory("");
      setLocation("");
      
      await fetchUploads();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit upload');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-20" style={{ backgroundColor: 'var(--eco-background)' }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-6" style={{ backgroundColor: 'var(--eco-green-primary)' }}>
        <h1 className="text-2xl font-bold text-white mb-2">Upload Eco Proof</h1>
        <p className="text-green-100">Share your environmental actions and earn points!</p>
      </div>

      {/* Upload Form */}
      <div className="px-6 py-6">
        <Card className="p-6 shadow-lg border-0">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--eco-green-primary)' }}>
            📸 New Upload
          </h2>

          {/* File Upload Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Photos/Videos</label>
            {selectedFiles.length === 0 ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors"
                     style={{ borderColor: 'var(--eco-green-light)', backgroundColor: 'var(--eco-green-lighter)' }}>
                <Camera className="w-8 h-8 mb-2" style={{ color: 'var(--eco-green-primary)' }} />
                <span className="text-sm text-gray-600">Tap to upload photos or videos</span>
                <span className="text-xs text-gray-500 mt-1">Max 5 files, 10MB each</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      {file.type.startsWith('image/') ? (
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded-lg" 
                        />
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 mx-auto mb-1 text-gray-500" />
                          <span className="text-xs text-gray-500">Video</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {selectedFiles.length < 5 && (
                  <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer"
                         style={{ borderColor: 'var(--eco-green-light)' }}>
                    <Camera className="w-6 h-6 mb-1" style={{ color: 'var(--eco-green-primary)' }} />
                    <span className="text-xs text-gray-600">Add more</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          {/* Category Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select activity category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{category.label}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {category.points} pts
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Caption */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              placeholder="Describe your eco-friendly action..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-20"
            />
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Location (Optional)</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Where did this happen?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!selectedFiles.length || !caption || !selectedCategory || isUploading}
            className="w-full h-12 text-white shadow-lg"
            style={{ backgroundColor: 'var(--eco-green-primary)' }}
          >
            {isUploading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Submit for Verification</span>
              </div>
            )}
          </Button>
        </Card>
      </div>

      {/* Recent Uploads */}
      <div className="px-6 pb-6">
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--eco-green-primary)' }}>
          📋 Recent Uploads
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--eco-green-primary)' }} />
          </div>
        ) : uploads.length > 0 ? (
          <div className="space-y-4">
            {uploads.map((upload) => (
            <Card key={upload.id} className="p-4 shadow-sm border-0">
              <div className="flex space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Camera className="w-6 h-6 text-gray-500" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-800 text-sm leading-tight">{upload.caption}</p>
                      <p className="text-xs text-gray-500 mt-1">{upload.category}</p>
                      {upload.location && (
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {upload.location}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(upload.status)}
                      <Badge variant="outline" className={`text-xs ${getStatusColor(upload.status)}`}>
                        {upload.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{upload.uploadDate || new Date(upload.createdAt).toLocaleDateString()}</span>
                    {upload.pointsAwarded && (
                      <Badge style={{ backgroundColor: 'var(--points-yellow)', color: '#000' }} className="text-xs">
                        +{upload.pointsAwarded} pts
                      </Badge>
                    )}
                  </div>
                  
                  {upload.verifiedBy && (
                    <p className="text-xs text-green-600 mt-1">✓ Verified by {upload.verifiedBy}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
          </div>
        ) : (
          <Card className="p-6 border-0 shadow-sm text-center">
            <Camera className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <h3 className="font-medium text-gray-800 mb-2">No uploads yet</h3>
            <p className="text-sm text-gray-600">Share your eco-friendly actions and earn points!</p>
          </Card>
        )}
      </div>
    </div>
  );
}