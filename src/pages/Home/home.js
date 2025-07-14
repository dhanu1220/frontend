import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Bell, 
  User, 
  Calendar, 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  Settings,
  ChevronRight,
  Users,
  Target,
  Award,
  Activity,
  Briefcase,
  Home,
  MessageSquare,
  BarChart3,
  BookOpen,
  Coffee,
  Star,
  Zap,
  Heart
} from 'lucide-react';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState('checked-out');
  
  const userData = {
    name: "John Doe",
    employeeId: "EMP001",
    department: "Engineering",
    position: "Senior Developer",
    avatar: "JD"
  };

  const attendanceData = {
    checkInTime: "09:15 AM",
    checkOutTime: attendanceStatus === 'checked-in' ? null : "06:30 PM",
    workingHours: "8h 15m",
    status: attendanceStatus,
    weeklyHours: "38h 45m",
    monthlyHours: "156h 30m"
  };

  const companyNews = [
    {
      id: 1,
      title: "Q3 Results Exceed Expectations",
      summary: "Company achieves 15% growth in revenue this quarter with record-breaking performance",
      date: "2 hours ago",
      priority: "high",
      category: "Financial"
    },
    {
      id: 2,
      title: "New Office Opening in Mumbai",
      summary: "Expansion plans include hiring 200+ employees across multiple departments",
      date: "1 day ago",
      priority: "medium",
      category: "Expansion"
    },
    {
      id: 3,
      title: "Employee Wellness Program Launch",
      summary: "New health and wellness benefits now available including gym memberships",
      date: "3 days ago",
      priority: "low",
      category: "Benefits"
    },
    {
      id: 4,
      title: "Tech Innovation Summit 2024",
      summary: "Annual summit scheduled for December with industry leaders and keynote speakers",
      date: "5 days ago",
      priority: "medium",
      category: "Events"
    }
  ];

  const projects = [
    {
      id: 1,
      name: "Recipe Management System",
      status: "In Progress",
      progress: 75,
      deadline: "Dec 15, 2024",
      team: 5,
      priority: "high",
      description: "Complete recipe database with search and categorization"
    },
    {
      id: 2,
      name: "Employee Portal Redesign",
      status: "Review",
      progress: 90,
      deadline: "Dec 10, 2024",
      team: 3,
      priority: "medium",
      description: "Modern UI/UX redesign for better user experience"
    },
    {
      id: 3,
      name: "Data Analytics Dashboard",
      status: "Planning",
      progress: 25,
      deadline: "Jan 20, 2025",
      team: 4,
      priority: "low",
      description: "Real-time analytics and reporting system"
    }
  ];

  const recentActivities = [
    { id: 1, action: "Completed code review", time: "30 min ago", type: "work" },
    { id: 2, action: "Attended team standup", time: "2 hours ago", type: "meeting" },
    { id: 3, action: "Updated project documentation", time: "4 hours ago", type: "documentation" },
    { id: 4, action: "Merged feature branch", time: "Yesterday", type: "development" }
  ];

  const quickStats = [
    { label: "Tasks Completed", value: "24", change: "+12%", icon: CheckCircle, color: "text-green-500" },
    { label: "Projects Active", value: "3", change: "+1", icon: Briefcase, color: "text-blue-500" },
    { label: "Team Members", value: "12", change: "+2", icon: Users, color: "text-purple-500" },
    { label: "This Month", value: "156h", change: "+8%", icon: Clock, color: "text-orange-500" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAttendance = () => {
    setAttendanceStatus(attendanceStatus === 'checked-out' ? 'checked-in' : 'checked-out');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Review': return 'bg-yellow-100 text-yellow-800';
      case 'Planning': return 'bg-gray-100 text-gray-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{userData.avatar}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Welcome back, {userData.name}!</h1>
                <p className="text-sm text-gray-600">{userData.department} • {userData.employeeId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-sm text-gray-600">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Attendance Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Attendance</h3>
                    <p className="text-sm text-gray-600">Today's Status</p>
                  </div>
                </div>
                <button
                  onClick={handleAttendance}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    attendanceStatus === 'checked-out'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {attendanceStatus === 'checked-out' ? 'Check In' : 'Check Out'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Check In</p>
                  <p className="text-lg font-semibold text-gray-900">{attendanceData.checkInTime}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Check Out</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {attendanceData.checkOutTime || 'Not checked out'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Working Hours</p>
                  <p className="text-lg font-semibold text-blue-600">{attendanceData.workingHours}</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between text-sm text-gray-600">
                <span>Weekly: {attendanceData.weeklyHours}</span>
                <span>Monthly: {attendanceData.monthlyHours}</span>
              </div>
            </div>

            {/* Projects Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">My Projects</h3>
                    <p className="text-sm text-gray-600">Current Assignments</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Due: {project.deadline}</span>
                      <span>{project.team} members</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <p className="text-sm text-gray-600">Your latest actions</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Company News */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg relative">
                    <Bell className="w-5 h-5 text-orange-600" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Company News</h3>
                    <p className="text-sm text-gray-600">Latest Updates</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {companyNews.map((news) => (
                  <div key={news.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{news.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(news.priority)}`}>
                        {news.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{news.summary}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{news.date}</span>
                      <span className="bg-gray-200 px-2 py-1 rounded">{news.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Calendar, label: 'Schedule', color: 'bg-blue-50 text-blue-600' },
                  { icon: TrendingUp, label: 'Performance', color: 'bg-green-50 text-green-600' },
                  { icon: FileText, label: 'Documents', color: 'bg-purple-50 text-purple-600' },
                  { icon: User, label: 'Profile', color: 'bg-orange-50 text-orange-600' },
                  { icon: MessageSquare, label: 'Messages', color: 'bg-pink-50 text-pink-600' },
                  { icon: Settings, label: 'Settings', color: 'bg-gray-50 text-gray-600' }
                ].map((action, index) => (
                  <button
                    key={index}
                    className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Award className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
                  <p className="text-sm text-gray-600">This Month</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Productivity</span>
                  <span className="text-sm font-medium text-gray-900">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Goals Met</span>
                  <span className="text-sm font-medium text-gray-900">8/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Team Rating</span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;