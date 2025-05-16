import React, { useState, useMemo } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText, useTheme, ThemeProvider, createTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { logoutUser } from '../services/api';
import { blue, grey, common } from '@mui/material/colors';

const drawerWidth = 220;

export default function AppLayout({ children, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // WCAG AA contrast: use blue[800] for primary, white for text, grey[900] for dark bg
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: blue[800], contrastText: common.white },
      background: {
        default: darkMode ? grey[900] : '#f4f6fa',
        paper: darkMode ? grey[800] : common.white,
      },
      text: {
        primary: darkMode ? common.white : grey[900],
        secondary: darkMode ? grey[300] : grey[700],
      },
    },
  }), [darkMode]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleThemeToggle = () => {
    setDarkMode((prev) => {
      localStorage.setItem('theme', !prev ? 'dark' : 'light');
      return !prev;
    });
  };

  const handleLogout = () => {
    logoutUser();
    if (onLogout) onLogout();
  };

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Toolbar />
      <List>
        <ListItem button component="a" href="#/dashboard">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component="a" href="#/upload">
          <ListItemText primary="Upload" />
        </ListItem>
        <ListItem button component="a" href="#/results">
          <ListItemText primary="Results" />
        </ListItem>
        <ListItem button component="a" href="#/settings">
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              AI Note Assistant
            </Typography>
            <IconButton color="inherit" onClick={handleThemeToggle}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 8 }}>
          {children}
        </Box>
        <Box component="footer" sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2">&copy; {new Date().getFullYear()} AI Note Assistant</Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
