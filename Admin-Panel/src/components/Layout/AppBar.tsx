import React from 'react';
import { AppBar as RaAppBar, UserMenu, Logout } from 'react-admin';
import { styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';

const AppBarStyled = styled(RaAppBar)(({ theme }) => ({
  '& .RaAppBar-toolbar': {
    backgroundColor: '#1e293b',
    backgroundImage: 'linear-gradient(90deg, #1e293b 0%, #334155 100%)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    minHeight: '64px',
    position: 'fixed',
    width: '100%',
    zIndex: 1300,
  },
  '& .RaAppBar-menuButton': {
    color: 'white',
  },
  '& .RaAppBar-title': {
    color: 'white',
    fontSize: '1.25rem',
    fontWeight: 600,
    flexGrow: 1,
  },
}));

const CustomUserMenu = (props: any) => (
  <UserMenu {...props}>
    <Logout />
  </UserMenu>
);

const AppBar = (props: any) => (
  <AppBarStyled 
    {...props} 
    userMenu={<CustomUserMenu />}
  >
    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="h6" sx={{ ml: 2 }}>
        🚀 پنل مدیریت تورینو
      </Typography>
    </Box>
  </AppBarStyled>
);

export default AppBar;