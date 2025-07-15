import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Menu, NotificationsActive, ExitToApp } from '@mui/icons-material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  zIndex: theme.zIndex.drawer + 1,
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

const Navbar = ({ attendanceStatus, handleAttendance, currentTime, handleDrawerToggle, isMobile, handleLogout }) => {
  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <Menu />
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Employee Dashboard
        </Typography>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Typography variant="body2">
            {currentTime.toLocaleTimeString()}
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <NotificationsActive />
            </Badge>
          </IconButton>
          <StyledButton
            variant="contained"
            size="small"
            onClick={handleAttendance}
            sx={{
              bgcolor: attendanceStatus === 'checked-out' ? '#4caf50' : '#ff9800',
              '&:hover': {
                bgcolor: attendanceStatus === 'checked-out' ? '#45a049' : '#f57c00',
              },
              mr: 1,
            }}
          >
            {attendanceStatus === 'checked-out' ? 'Check In' : 'Check Out'}
          </StyledButton>
          <StyledButton
            variant="contained"
            size="small"
            onClick={handleLogout}
            sx={{
              bgcolor: '#f44336',
              '&:hover': {
                bgcolor: '#da190b',
              },
            }}
          >
            Logout
          </StyledButton>
        </div>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;