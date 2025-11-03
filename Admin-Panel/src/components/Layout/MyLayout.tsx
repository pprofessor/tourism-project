import React from 'react';
import { Layout } from 'react-admin';
import MyMenu from './MyMenu';
import { styled } from '@mui/material/styles';

// استایل برای Layout با ظاهر مدرن
const StyledLayout = styled(Layout)(({ theme }) => ({
  '& .RaLayout-appFrame': {
    fontFamily: '"Vazirmatn", sans-serif',
  },
  '& .RaLayout-content': {
    backgroundColor: '#f8fafc',
    fontFamily: '"Vazirmatn", sans-serif',
  },
  '& .RaSidebar-drawerPaper': {
    backgroundColor: '#1e293b',
    backgroundImage: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
    fontFamily: '"Vazirmatn", sans-serif',
  },
  '& .MuiListItemButton-root': {
    fontFamily: '"Vazirmatn", sans-serif',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  '& .Mui-selected': {
    backgroundColor: 'rgba(59, 130, 246, 0.2) !important',
    borderRight: '3px solid #3b82f6',
  },
  '& .MuiListItemIcon-root': {
    color: '#94a3b8',
    minWidth: 40,
  },
  '& .Mui-selected .MuiListItemIcon-root': {
    color: '#3b82f6',
  },
}));

const MyLayout = (props: any) => (
  <StyledLayout {...props} menu={MyMenu} />
);

export default MyLayout;