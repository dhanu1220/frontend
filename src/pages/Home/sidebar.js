import React from 'react';
import { useNavigate } from 'react-router-dom';
import AssistantIcon from '@mui/icons-material/Assistant';

import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Dashboard,
  Person,
  AccessTime,
  Work,
  Analytics,
  Settings,
  Assignment,
  Group,
  Description,
} from '@mui/icons-material';

const drawerWidth = 260;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    background: 'linear-gradient(180deg, #1e3c72 0%, #2a5298 100%)',
    color: 'white',
    borderRight: 'none',
  },
}));

const NavItem = styled(ListItem)(({ theme, active }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
  '&:hover': {
    background: 'rgba(255,255,255,0.1)',
    transform: 'translateX(4px)',
  },
  '& .MuiListItemIcon-root': {
    color: 'white',
    minWidth: 60,
  },
}));

const Sidebar = ({ mobileOpen, handleDrawerToggle, isMobile, activeNav, setActiveNav }) => {
  const navigate = useNavigate();

  const navItems = [
    { icon: Dashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: Person, label: 'Profile', id: 'profile' },
    { icon: Work, label: 'Projects', id: 'projects' },
    { icon: AccessTime, label: 'Attendance', id: 'attendance' },
    { icon: Analytics, label: 'Analytics', id: 'analytics' },
    { icon: Assignment, label: 'Tasks', id: 'tasks' },
    { icon: Group, label: 'Team', id: 'team' },
    { icon: Description, label: 'Documents', id: 'documents' },
    { icon: AssistantIcon, label: 'Smart Assist', id: 'smartassist', route: '/smartassist' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  const handleNavClick = (item) => {
    setActiveNav(item.id);
    if (item.route) {
      navigate(item.route);
    }
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}></Box>
      </Box>
      
      <List sx={{ pt: 2 }}>
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            active={activeNav === item.id}
            onClick={() => handleNavClick(item)}
          >
            <ListItemIcon>
              <item.icon />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </NavItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      <StyledDrawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </StyledDrawer>
    </Box>
  );
};

export default Sidebar;