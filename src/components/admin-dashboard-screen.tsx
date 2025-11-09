import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { 
  Leaf, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MapPin, 
  Calendar,
  Settings,
  BarChart3,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Users,
  AlertCircle,
  TrendingUp,
  Activity,
  FileText,
  ChevronDown,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AdminDashboardScreenProps {
  onLogout: () => void;
}

interface Upload {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  activityType: string;
  description: string;
  imageUrl: string;
  location: string;
  date: string;
  submittedAt: string;
  status: 'pending' | 'in-review' | 'approved' | 'rejected' | 'flagged';
  points: number;
  assignedTo: string | null;
  priority: 'low' | 'medium' | 'high';
  notes: string;
}

interface Admin {
  id: string;
  name: string;
  email: string;
  tasksAssigned: number;
  tasksCompleted: number;
}

export function AdminDashboardScreen({ onLogout }: AdminDashboardScreenProps) {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [activeTab, setActiveTab] = useState("all-tasks");
  const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [reviewNotes, setReviewNotes] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("unassigned");

  // Current admin (mock)
  const currentAdmin = {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@ecotracker.com'
  };

  // Mock data for demonstration
  useEffect(() => {
    const mockAdmins: Admin[] = [
      { id: 'admin1', name: 'Admin User', email: 'admin@ecotracker.com', tasksAssigned: 5, tasksCompleted: 12 },
      { id: 'admin2', name: 'Sarah Admin', email: 'sarah@ecotracker.com', tasksAssigned: 3, tasksCompleted: 8 },
      { id: 'admin3', name: 'Mike Reviewer', email: 'mike@ecotracker.com', tasksAssigned: 2, tasksCompleted: 15 }
    ];

    const mockUploads: Upload[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'Sarah Green',
        userEmail: 'sarah@example.com',
        activityType: 'Recycling',
        description: 'Recycled 5kg of plastic bottles at local recycling center. Properly sorted and cleaned all materials before submission.',
        imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
        location: 'Downtown Recycling Center, Main St',
        date: '2025-11-09',
        submittedAt: '2025-11-09T08:30:00',
        status: 'pending',
        points: 50,
        assignedTo: null,
        priority: 'high',
        notes: ''
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Mike Thompson',
        userEmail: 'mike@example.com',
        activityType: 'Tree Planting',
        description: 'Planted 3 oak trees in community park with local environmental group',
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
        location: 'Central Park, North Section',
        date: '2025-11-08',
        submittedAt: '2025-11-08T14:20:00',
        status: 'in-review',
        points: 100,
        assignedTo: 'admin1',
        priority: 'medium',
        notes: ''
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Emma Wilson',
        userEmail: 'emma@example.com',
        activityType: 'Beach Cleanup',
        description: 'Collected 15kg of trash from beach cleanup event organized by Ocean Warriors NGO',
        imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400',
        location: 'Sunset Beach',
        date: '2025-11-07',
        submittedAt: '2025-11-07T16:45:00',
        status: 'approved',
        points: 75,
        assignedTo: 'admin2',
        priority: 'medium',
        notes: 'Verified with NGO coordinator. Great work!'
      },
      {
        id: '4',
        userId: 'user4',
        userName: 'John Davis',
        userEmail: 'john@example.com',
        activityType: 'Composting',
        description: 'Started home composting system for organic waste management',
        imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
        location: 'Home Garden, 123 Green Ave',
        date: '2025-11-06',
        submittedAt: '2025-11-06T10:15:00',
        status: 'approved',
        points: 30,
        assignedTo: 'admin1',
        priority: 'low',
        notes: 'Setup verified. Encouraged to submit monthly updates.'
      },
      {
        id: '5',
        userId: 'user5',
        userName: 'Lisa Martinez',
        userEmail: 'lisa@example.com',
        activityType: 'Public Transport',
        description: 'Used public transport instead of car for a week',
        imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
        location: 'City Transit',
        date: '2025-11-05',
        submittedAt: '2025-11-05T18:30:00',
        status: 'rejected',
        points: 0,
        assignedTo: 'admin3',
        priority: 'low',
        notes: 'Insufficient proof provided. Need transit pass or ticket evidence.'
      },
      {
        id: '6',
        userId: 'user6',
        userName: 'Alex Brown',
        userEmail: 'alex@example.com',
        activityType: 'Energy Saving',
        description: 'Installed solar panels on rooftop - 5kW system',
        imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400',
        location: 'Residential Area, 456 Solar St',
        date: '2025-11-09',
        submittedAt: '2025-11-09T11:00:00',
        status: 'pending',
        points: 200,
        assignedTo: null,
        priority: 'high',
        notes: ''
      },
      {
        id: '7',
        userId: 'user7',
        userName: 'Rachel Kim',
        userEmail: 'rachel@example.com',
        activityType: 'Water Conservation',
        description: 'Collected rainwater - installed 500L rainwater harvesting system',
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
        location: 'Suburban Home',
        date: '2025-11-08',
        submittedAt: '2025-11-08T09:45:00',
        status: 'flagged',
        points: 80,
        assignedTo: 'admin2',
        priority: 'high',
        notes: 'Need verification of installation permit'
      },
      {
        id: '8',
        userId: 'user8',
        userName: 'Tom Wilson',
        userEmail: 'tom@example.com',
        activityType: 'Cycling',
        description: 'Cycled to work every day this week instead of driving',
        imageUrl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400',
        location: 'City Center',
        date: '2025-11-07',
        submittedAt: '2025-11-07T17:20:00',
        status: 'in-review',
        points: 40,
        assignedTo: 'admin1',
        priority: 'low',
        notes: ''
      }
    ];
    
    setUploads(mockUploads);
    setAdmins(mockAdmins);
  }, []);

  // Filter uploads
  const filteredUploads = uploads.filter(upload => {
    const matchesSearch = upload.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         upload.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         upload.activityType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || upload.status === statusFilter;
    const matchesActivity = activityTypeFilter === 'all' || upload.activityType === activityTypeFilter;
    const matchesAssignee = assigneeFilter === 'all' || 
                           (assigneeFilter === 'unassigned' && !upload.assignedTo) ||
                           upload.assignedTo === assigneeFilter;
    const matchesPriority = priorityFilter === 'all' || upload.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesActivity && matchesAssignee && matchesPriority;
  });

  // Calculate statistics
  const stats = {
    total: uploads.length,
    pending: uploads.filter(u => u.status === 'pending').length,
    inReview: uploads.filter(u => u.status === 'in-review').length,
    approved: uploads.filter(u => u.status === 'approved').length,
    rejected: uploads.filter(u => u.status === 'rejected').length,
    flagged: uploads.filter(u => u.status === 'flagged').length,
    myTasks: uploads.filter(u => u.assignedTo === currentAdmin.id).length,
    unassigned: uploads.filter(u => !u.assignedTo && u.status === 'pending').length,
    totalPoints: uploads.filter(u => u.status === 'approved').reduce((sum, u) => sum + u.points, 0)
  };

  const handleStatusChange = (id: string, newStatus: 'approved' | 'rejected' | 'flagged' | 'in-review', notes?: string) => {
    setUploads(uploads.map(upload => 
      upload.id === id 
        ? { 
            ...upload, 
            status: newStatus,
            points: newStatus === 'approved' ? upload.points : 0,
            notes: notes || upload.notes,
            assignedTo: upload.assignedTo || currentAdmin.id
          } 
        : upload
    ));
    
    const statusMessages = {
      'approved': 'Upload approved successfully! ✅',
      'rejected': 'Upload rejected.',
      'flagged': 'Upload flagged for review.',
      'in-review': 'Upload moved to in-review.'
    };
    
    toast.success(statusMessages[newStatus]);
    setIsDetailModalOpen(false);
    setReviewNotes("");
  };

  const handleAssignTask = (uploadId: string, adminId: string) => {
    setUploads(uploads.map(upload => 
      upload.id === uploadId 
        ? { ...upload, assignedTo: adminId === 'unassigned' ? null : adminId, status: adminId === 'unassigned' ? 'pending' : 'in-review' }
        : upload
    ));
    
    const admin = admins.find(a => a.id === adminId);
    toast.success(adminId === 'unassigned' ? 'Task unassigned' : `Task assigned to ${admin?.name}`);
  };

  const handleBulkAssign = () => {
    const selectedIds = filteredUploads
      .filter(u => u.status === 'pending' && !u.assignedTo)
      .slice(0, 5)
      .map(u => u.id);
    
    setUploads(uploads.map(upload => 
      selectedIds.includes(upload.id)
        ? { ...upload, assignedTo: currentAdmin.id, status: 'in-review' }
        : upload
    ));
    
    toast.success(`${selectedIds.length} tasks assigned to you`);
  };

  const openDetailModal = (upload: Upload) => {
    setSelectedUpload(upload);
    setReviewNotes(upload.notes || "");
    setSelectedAssignee(upload.assignedTo || 'unassigned');
    setIsDetailModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      'pending': { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock },
      'in-review': { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Eye },
      'approved': { color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
      'rejected': { color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
      'flagged': { color: 'bg-orange-50 text-orange-700 border-orange-200', icon: AlertCircle }
    };
    
    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      'low': 'bg-gray-100 text-gray-700',
      'medium': 'bg-blue-100 text-blue-700',
      'high': 'bg-red-100 text-red-700'
    };
    
    return (
      <Badge variant="secondary" className={colors[priority as keyof typeof colors]}>
        {priority}
      </Badge>
    );
  };

  const activityTypes = [...new Set(uploads.map(u => u.activityType))];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F9F9' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b shadow-sm bg-white">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
                 style={{ backgroundColor: '#E8F5E9' }}>
              <Leaf className="w-5 h-5" style={{ color: '#2E7D32' }} />
            </div>
            <div>
              <h2 className="leading-none">ECO-Tracker Admin</h2>
              <p className="text-xs text-gray-500">Verification Dashboard</p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => toast.info('Refreshing data...')}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">Pending</p>
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <p className="text-2xl" style={{ color: '#2E7D32' }}>{stats.pending}</p>
            </div>
          </Card>

          <Card className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">In Review</p>
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl" style={{ color: '#2E7D32' }}>{stats.inReview}</p>
            </div>
          </Card>

          <Card className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">Approved</p>
                <CheckCircle className="w-4 h-4" style={{ color: '#2E7D32' }} />
              </div>
              <p className="text-2xl" style={{ color: '#2E7D32' }}>{stats.approved}</p>
            </div>
          </Card>

          <Card className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">My Tasks</p>
                <User className="w-4 h-4" style={{ color: '#1565C0' }} />
              </div>
              <p className="text-2xl" style={{ color: '#2E7D32' }}>{stats.myTasks}</p>
            </div>
          </Card>

          <Card className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">Unassigned</p>
                <AlertCircle className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-2xl" style={{ color: '#2E7D32' }}>{stats.unassigned}</p>
            </div>
          </Card>
        </div>

        {/* Filters and Actions Bar */}
        <Card className="p-4 border-0 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, activity, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>

              <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  {activityTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {admins.map(admin => (
                    <SelectItem key={admin.id} value={admin.id}>{admin.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkAssign}
                className="rounded-full"
              >
                Assign to Me
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full md:w-auto grid grid-cols-4 gap-2 mb-6">
            <TabsTrigger 
              value="all-tasks" 
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
            >
              <Activity className="w-4 h-4 mr-2" />
              All Tasks ({filteredUploads.length})
            </TabsTrigger>
            <TabsTrigger 
              value="my-tasks" 
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
            >
              <User className="w-4 h-4 mr-2" />
              My Tasks ({stats.myTasks})
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="team" 
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
            >
              <Users className="w-4 h-4 mr-2" />
              Team
            </TabsTrigger>
          </TabsList>

          {/* All Tasks Tab */}
          <TabsContent value="all-tasks">
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUploads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                          No tasks found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUploads.map((upload) => (
                        <TableRow key={upload.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <p className="font-medium">{upload.userName}</p>
                              <p className="text-xs text-gray-500">{upload.userEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{upload.activityType}</p>
                              <p className="text-xs text-gray-500 line-clamp-1">{upload.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">{upload.location}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{new Date(upload.date).toLocaleDateString()}</span>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(upload.status)}
                          </TableCell>
                          <TableCell>
                            {getPriorityBadge(upload.priority)}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={upload.assignedTo || 'unassigned'}
                              onValueChange={(value) => handleAssignTask(upload.id, value)}
                            >
                              <SelectTrigger className="w-[130px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unassigned">Unassigned</SelectItem>
                                {admins.map(admin => (
                                  <SelectItem key={admin.id} value={admin.id}>
                                    {admin.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium" style={{ color: '#2E7D32' }}>
                              {upload.points}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDetailModal(upload)}
                              className="rounded-full"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* My Tasks Tab */}
          <TabsContent value="my-tasks">
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploads.filter(u => u.assignedTo === currentAdmin.id).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No tasks assigned to you yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      uploads.filter(u => u.assignedTo === currentAdmin.id).map((upload) => (
                        <TableRow key={upload.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <p className="font-medium">{upload.userName}</p>
                              <p className="text-xs text-gray-500">{upload.userEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{upload.activityType}</p>
                              <p className="text-xs text-gray-500 line-clamp-2">{upload.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(upload.status)}
                          </TableCell>
                          <TableCell>
                            {getPriorityBadge(upload.priority)}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium" style={{ color: '#2E7D32' }}>
                              {upload.points}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDetailModal(upload)}
                              className="rounded-full"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 border-0 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" style={{ color: '#2E7D32' }} />
                  Status Overview
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span>Pending</span>
                    </div>
                    <span className="font-medium">{stats.pending}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-600" />
                      <span>In Review</span>
                    </div>
                    <span className="font-medium">{stats.inReview}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Approved</span>
                    </div>
                    <span className="font-medium">{stats.approved}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>Rejected</span>
                    </div>
                    <span className="font-medium">{stats.rejected}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <span>Flagged</span>
                    </div>
                    <span className="font-medium">{stats.flagged}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-0 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" style={{ color: '#2E7D32' }} />
                  Activity Distribution
                </h3>
                <div className="space-y-3">
                  {activityTypes.map(type => {
                    const count = uploads.filter(u => u.activityType === type).length;
                    const percentage = (count / uploads.length * 100).toFixed(0);
                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{type}</span>
                          <span className="text-sm font-medium">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: '#2E7D32'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6 border-0 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2">
                  <Leaf className="w-5 h-5" style={{ color: '#2E7D32' }} />
                  Points Summary
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#E8F5E9' }}>
                    <p className="text-sm text-gray-600 mb-1">Total Points Awarded</p>
                    <p className="text-3xl" style={{ color: '#2E7D32' }}>{stats.totalPoints}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white border rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Avg per Activity</p>
                      <p className="text-xl" style={{ color: '#2E7D32' }}>
                        {stats.approved > 0 ? Math.round(stats.totalPoints / stats.approved) : 0}
                      </p>
                    </div>
                    <div className="p-3 bg-white border rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Total Activities</p>
                      <p className="text-xl" style={{ color: '#2E7D32' }}>{stats.total}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-0 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" style={{ color: '#2E7D32' }} />
                  Priority Distribution
                </h3>
                <div className="space-y-3">
                  {['high', 'medium', 'low'].map(priority => {
                    const count = uploads.filter(u => u.priority === priority).length;
                    const percentage = (count / uploads.length * 100).toFixed(0);
                    return (
                      <div key={priority}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm capitalize">{priority} Priority</span>
                          <span className="text-sm font-medium">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: priority === 'high' ? '#DC2626' : priority === 'medium' ? '#2563EB' : '#6B7280'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card className="border-0 shadow-sm">
              <div className="p-6">
                <h3 className="mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: '#2E7D32' }} />
                  Admin Team Performance
                </h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Admin Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Tasks Assigned</TableHead>
                        <TableHead>Tasks Completed</TableHead>
                        <TableHead>Completion Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {admins.map(admin => {
                        const completionRate = admin.tasksCompleted > 0 
                          ? ((admin.tasksCompleted / (admin.tasksCompleted + admin.tasksAssigned)) * 100).toFixed(0)
                          : 0;
                        return (
                          <TableRow key={admin.id}>
                            <TableCell className="font-medium">{admin.name}</TableCell>
                            <TableCell className="text-gray-600">{admin.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                {admin.tasksAssigned} active
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                {admin.tasksCompleted} done
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                                  <div 
                                    className="h-2 rounded-full" 
                                    style={{ 
                                      width: `${completionRate}%`,
                                      backgroundColor: '#2E7D32'
                                    }}
                                  />
                                </div>
                                <span className="text-sm">{completionRate}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedUpload && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Review Submission
                  {getStatusBadge(selectedUpload.status)}
                </DialogTitle>
                <DialogDescription>
                  Submitted by {selectedUpload.userName} on {new Date(selectedUpload.submittedAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Image */}
                <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                  <ImageWithFallback
                    src={selectedUpload.imageUrl}
                    alt={selectedUpload.activityType}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Activity Type</p>
                    <p className="font-medium">{selectedUpload.activityType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Points</p>
                    <p className="font-medium" style={{ color: '#2E7D32' }}>{selectedUpload.points}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {selectedUpload.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(selectedUpload.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Priority</p>
                    {getPriorityBadge(selectedUpload.priority)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Assigned To</p>
                    <Select
                      value={selectedAssignee}
                      onValueChange={(value) => {
                        setSelectedAssignee(value);
                        handleAssignTask(selectedUpload.id, value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {admins.map(admin => (
                          <SelectItem key={admin.id} value={admin.id}>
                            {admin.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="text-gray-800 p-3 bg-gray-50 rounded-lg">{selectedUpload.description}</p>
                </div>

                {/* Review Notes */}
                <div>
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    Review Notes
                  </p>
                  <Textarea
                    placeholder="Add notes about this verification..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {selectedUpload.notes && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Previous Notes:</strong> {selectedUpload.notes}
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2">
                {selectedUpload.status !== 'approved' && (
                  <Button
                    onClick={() => handleStatusChange(selectedUpload.id, 'approved', reviewNotes)}
                    className="rounded-full"
                    style={{ backgroundColor: '#2E7D32', color: 'white' }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                )}
                {selectedUpload.status !== 'rejected' && (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange(selectedUpload.id, 'rejected', reviewNotes)}
                    className="rounded-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                )}
                {selectedUpload.status !== 'flagged' && (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange(selectedUpload.id, 'flagged', reviewNotes)}
                    className="rounded-full border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Flag for Review
                  </Button>
                )}
                {selectedUpload.status === 'pending' && (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange(selectedUpload.id, 'in-review', reviewNotes)}
                    className="rounded-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Move to In-Review
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
