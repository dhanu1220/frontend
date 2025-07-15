import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
  Badge,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Announcement,
  Work,
  Assignment,
  Group,
  CheckCircle,
  Schedule,
  TrendingUp,
  CalendarToday,
  FolderOpen,
  Timeline,
  Analytics,
} from '@mui/icons-material';
import Navbar from './navbar';
import Sidebar from './sidebar';

const drawerWidth = 260;

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(30, 60, 114, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  padding: '10px 24px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
  },
}));

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState('checked-out');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [userData, setUserData] = useState({
    name: 'Loading...',
    employeeId: '',
    department: 'Engineering',
    avatar: '/api/placeholder/56/56',
  });
  const [loading, setLoading] = useState(true);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const attendanceData = {
    checkInTime: '09:15 AM',
    checkOutTime: attendanceStatus === 'checked-in' ? null : '06:30 PM',
    workingHours: '8h 15m',
    status: attendanceStatus,
    weeklyHours: '38h 45m',
    monthlyHours: '156h 30m',
  };

  const companyNews = [
    {
      id: 1,
      title: 'Q3 Results Exceed Expectations',
      summary: 'Company achieves 15% growth in revenue this quarter',
      date: '2 hours ago',
      priority: 'high',
    },
    {
      id: 2,
      title: 'New Office Opening in Mumbai',
      summary: 'Expansion plans include hiring 200+ employees',
      date: '1 day ago',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Employee Wellness Program Launch',
      summary: 'New health and wellness benefits now available',
      date: '3 days ago',
      priority: 'low',
    },
  ];

  const projects = [
    {
      id: 1,
      name: 'Recipe Management System',
      status: 'In Progress',
      progress: 75,
      deadline: 'Dec 15, 2024',
      team: 5,
      priority: 'high',
    },
    {
      id: 2,
      name: 'Employee Portal Redesign',
      status: 'Review',
      progress: 90,
      deadline: 'Dec 10, 2024',
      team: 3,
      priority: 'medium',
    },
    {
      id: 3,
      name: 'Data Analytics Dashboard',
      status: 'Planning',
      progress: 25,
      deadline: 'Jan 20, 2025',
      team: 4,
      priority: 'low',
    },
  ];

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: Assignment, color: '#1e3c72' },
    { label: 'Completed Tasks', value: 24, icon: CheckCircle, color: '#2a5298' },
    { label: 'Team Members', value: 12, icon: Group, color: '#3d6bb3' },
    { label: 'Productivity', value: '94%', icon: Timeline, color: '#5088d1' },
  ];

  const quickActions = [
    { icon: Schedule, label: 'Schedule', color: '#1e3c72' },
    { icon: TrendingUp, label: 'Performance', color: '#2a5298' },
    { icon: FolderOpen, label: 'Documents', color: '#3d6bb3' },
    { icon: Analytics, label: 'Analytics', color: '#5088d1' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const sessionId = localStorage.getItem('session_id');
      
      if (!sessionId) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/user-info/${sessionId}`);
        
        if (response.ok) {
          const data = await response.json();
          setUserData({
            name: data.name,
            employeeId: data.employeeid,
            department: 'Engineering', // You can add this to your database if needed
            avatar: '/api/placeholder/56/56',
          });
        } else {
          // Session invalid, redirect to login
          localStorage.removeItem('session_id');
          localStorage.removeItem('employeeid');
          localStorage.removeItem('name');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAttendance = () => {
    setAttendanceStatus(attendanceStatus === 'checked-out' ? 'checked-in' : 'checked-out');
  };

  const handleLogout = async () => {
    const sessionId = localStorage.getItem('session_id');
    
    if (sessionId) {
      try {
        await fetch('http://localhost:8000/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: sessionId })
        });
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
    
    localStorage.removeItem('session_id');
    localStorage.removeItem('employeeid');
    localStorage.removeItem('name');
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return '#1e3c72';
      case 'Review':
        return '#ff9800';
      case 'Planning':
        return '#2196f3';
      case 'Completed':
        return '#4caf50';
      default:
        return 'gray';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Navbar
        attendanceStatus={attendanceStatus}
        handleAttendance={handleAttendance}
        currentTime={currentTime}
        handleDrawerToggle={handleDrawerToggle}
        isMobile={isMobile}
        userData={userData}
        handleLogout={handleLogout}
      />
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        isMobile={isMobile}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, sm: 8 },
        }}
      >
        <Container maxWidth="xl">
          {/* Welcome Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" color="#1e3c72" gutterBottom>
              Welcome back, {userData.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Employee ID: {userData.employeeId} | {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={13} sx={{ mb: 10 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StyledCard sx={{ width: '100%', padding: '20px' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" color="text.secondary">
                          {stat.label}
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>
                          {stat.value}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: stat.color, width: 65, height: 65 }}>
                        <stat.icon sx={{ fontSize: 28 }} />
                      </Avatar>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>

          {/* Company News and Projects */}
          <Grid container spacing={13} sx={{ mt: 4 }}>
            {/* Company News */}
            <Grid item xs={12} md={6}>
              <Box sx={{ bgcolor: '#fff', borderRadius: 10, p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '90px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Badge badgeContent={companyNews.length} color="error">
                    <Announcement sx={{ fontSize: 32, color: '#1e3c72' }} />
                  </Badge>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="#1e3c72">
                      Company News
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      Stay updated with the latest
                    </Typography>
                  </Box>
                </Box>
                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {companyNews.map((news, index) => (
                    <React.Fragment key={news.id}>
                      <ListItem sx={{ px: 0, py: 2 }}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Typography variant="h5" fontWeight="bold" sx={{ color: '#1e3c72' }}>
                                {news.title}
                              </Typography>
                              <Chip
                                label={news.priority}
                                size="small"
                                color={getPriorityColor(news.priority)}
                                sx={{ fontSize: '0.75rem' }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body1" color="text.secondary">
                                {news.summary}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                {news.date}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < companyNews.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            </Grid>

            {/* Projects */}
            <Grid item xs={12} md={6}>
              <StyledCard sx={{ height: '100%', borderRadius: 10 }}>
                <CardContent sx={{ paddingRight: 15, paddingLeft: 15, paddingTop: 10, paddingBottom: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Work sx={{ fontSize: 32, color: '#1e3c72' }} />
                    <Box>
                      <Typography variant="h4" fontWeight="bold" color="#1e3c72">
                        My Projects
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        Current Assignments
                      </Typography>
                    </Box>
                  </Box>
                  <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {projects.map((project, index) => (
                      <React.Fragment key={project.id}>
                        <ListItem sx={{ px: 0, py: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="h5" fontWeight="bold" sx={{ color: '#1e3c72' }}>
                              {project.name}
                            </Typography>
                            <Chip
                              label={project.status}
                              size="small"
                              sx={{
                                bgcolor: getStatusColor(project.status),
                                color: 'white',
                                fontSize: '0.75rem',
                                margin: '4px 8px',
                              }}
                            />
                          </Box>
                          <Box sx={{ width: '100%', mb: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                Progress
                              </Typography>
                              <Typography variant="caption" fontWeight="bold">
                                {project.progress}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={project.progress}
                              sx={{
                                height: 6,
                                borderRadius: 4,
                                bgcolor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 4,
                                  bgcolor: '#1e3c72',
                                },
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Typography variant="caption" color="text.secondary">
                              Due: {project.deadline}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {project.team} members
                            </Typography>
                          </Box>
                        </ListItem>
                        {index < projects.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Box sx={{ mt: 8 }}>
            <StyledCard>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight="bold" color="#1e3c72" gutterBottom>
                  Quick Actions
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Frequently used features
                </Typography>
                <Grid container spacing={13}>
                  {quickActions.map((action, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <StyledButton
                        fullWidth
                        variant="contained"
                        startIcon={<action.icon />}
                        sx={{
                          bgcolor: action.color,
                          px: 10,
                          py: 3,
                          '&:hover': {
                            bgcolor: action.color,
                            filter: 'brightness(1.1)',
                          },
                        }}
                      >
                        {action.label}
                      </StyledButton>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </StyledCard>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;