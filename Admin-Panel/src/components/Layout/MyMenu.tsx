import React from 'react';
import { Menu, MenuItemLink, useSidebarState } from 'react-admin';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import HotelIcon from '@mui/icons-material/Hotel';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import FolderIcon from '@mui/icons-material/Folder';
import StorageIcon from '@mui/icons-material/Storage';
import PaymentIcon from '@mui/icons-material/Payment';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import MessageIcon from '@mui/icons-material/Message';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ============ CONSTANTS & TYPES ============
interface MenuItemProps {
  to: string;
  primaryText: string;
  leftIcon: React.ReactElement;
  badgeCount?: number;
}

// ============ CUSTOM MENU ITEM COMPONENT ============
const CustomMenuItemLink: React.FC<MenuItemProps> = ({
  to,
  primaryText,
  leftIcon,
  badgeCount
}) => {
  const [open] = useSidebarState();

  return (
    <MenuItemLink
      to={to}
      primaryText={
        <Box
          component="span"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            pr: 1,
            boxSizing: 'border-box'
          }}
        >
          <Typography
            component="span"
            variant="inherit"
            sx={{
              display: 'inline-block',
              flex: 1
            }}
          >
            {primaryText}
          </Typography>
          {badgeCount && badgeCount > 0 && (
            <Badge
              badgeContent={badgeCount}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.6rem',
                  height: '16px',
                  minWidth: '16px',
                }
              }}
            />
          )}
        </Box>
      }
      leftIcon={leftIcon}
      sidebarIsOpen={open}
      sx={{
        '& .MuiListItemButton-root': {
          paddingTop: '10px',
          paddingBottom: '10px',
          paddingLeft: '16px',
          paddingRight: '8px',
          margin: '4px 12px',
          borderRadius: '10px',
          minHeight: '48px',
        },
        '& .MuiListItemIcon-root': {
          minWidth: '44px',
          marginRight: '12px',
        },
        '& .MuiTypography-root': {
          padding: '4px 0',
          lineHeight: '1.4',
        },
      }}
    />
  );
};

// ============ MAIN MENU COMPONENT ============
const MyMenu = () => {
  // در حالت واقعی این مقادیر از API دریافت می‌شوند
  const pendingAmbassadorRequests = 12; // تعداد درخواست‌های در انتظار بررسی

  return (
    <Menu
      sx={{
        // استایل کلی منو
        padding: '16px 8px 24px',

        // استایل آیتم‌های منو
        '& .RaMenuItemLink-root': {
          margin: '6px 8px',
          borderRadius: '10px',
          transition: 'all 0.2s ease',
          overflow: 'hidden',

          // hover effect
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            transform: 'translateX(4px)',
          },

          // active state
          '&.RaMenuItemLink-active': {
            backgroundColor: 'rgba(59, 130, 246, 0.12)',
            borderRight: '4px solid #3b82f6',
            fontWeight: 600,

            '& .MuiListItemIcon-root': {
              color: '#3b82f6',
            },

            '& .MuiTypography-root': {
              color: '#1f2937',
              fontWeight: 600,
            },
          },
        },

        // استایل آیکون‌ها
        '& .MuiListItemIcon-root': {
          minWidth: '44px',
          color: '#6b7280',
          marginLeft: '4px',
          marginRight: '12px',
        },

        // استایل متن
        '& .MuiTypography-root': {
          fontSize: '0.95rem',
          fontWeight: 500,
          color: '#374151',
          padding: '6px 0',
          lineHeight: '1.5',
        },

        // تم دارک
        '& .MuiTypography-root.dark': {
          color: '#e5e7eb',
        },
      }}
    >
      {/* ============ DASHBOARD ============ */}
      <CustomMenuItemLink
        to="/"
        primaryText="داشبورد"
        leftIcon={<DashboardIcon />}
      />

      {/* ============ AMBASSADOR MANAGEMENT SECTION ============ */}
      <Box sx={{ mt: 3, mb: 2 }}>
        <Box sx={{ px: 3, py: 2 }}>
          <Typography
            component="span"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'block'
            }}
          >
            مدیریت سفیران
          </Typography>
        </Box>

        <Box sx={{ px: 2 }}>
          {/* سفیران تایید شده */}
          <CustomMenuItemLink
            to="/ambassadors"
            primaryText="سفیران تایید شده"
            leftIcon={<VerifiedUserIcon />}
          />

          {/* درخواست‌های جدید (با نشانگر تعداد) */}
          <CustomMenuItemLink
            to="/ambassador-requests"
            primaryText="درخواست‌های جدید"
            leftIcon={<PendingActionsIcon />}
            badgeCount={pendingAmbassadorRequests}
          />

          {/* آمار و گزارشات سفیران */}
          <CustomMenuItemLink
            to="/ambassador-analytics"
            primaryText="آمار و گزارشات"
            leftIcon={<AnalyticsIcon />}
          />

          {/* ارسال پیام به سفیران */}
          <CustomMenuItemLink
            to="/ambassador-messaging"
            primaryText="ارسال پیام"
            leftIcon={<MessageIcon />}
          />
        </Box>
      </Box>

      {/* ============ USER MANAGEMENT ============ */}
      <Box sx={{ mt: 3, mb: 2 }}>
        <Box sx={{ px: 3, py: 2 }}>
          <Typography
            component="span"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'block'
            }}
          >
            مدیریت کاربران
          </Typography>
        </Box>

        <Box sx={{ px: 2 }}>
          <CustomMenuItemLink
            to="/users"
            primaryText="کاربران عادی"
            leftIcon={<PeopleIcon />}
          />
        </Box>
      </Box>

      {/* ============ CONTENT MANAGEMENT SECTION ============ */}
      <Box sx={{ mt: 3, mb: 2 }}>
        <Box sx={{ px: 3, py: 2 }}>
          <Typography
            component="span"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'block'
            }}
          >
            مدیریت محتوا
          </Typography>
        </Box>

        <Box sx={{ px: 2 }}>
          <CustomMenuItemLink
            to="/hotels"
            primaryText="هتل‌ها"
            leftIcon={<HotelIcon />}
          />

          <CustomMenuItemLink
            to="/slider-management"
            primaryText="مدیریت اسلایدها"
            leftIcon={<SlideshowIcon />}
          />

          <CustomMenuItemLink
            to="/media-management"
            primaryText="مدیریت رسانه"
            leftIcon={<FolderIcon />}
          />
        </Box>
      </Box>

      {/* ============ SYSTEM MANAGEMENT SECTION ============ */}
      <Box sx={{ mt: 3, mb: 2 }}>
        <Box sx={{ px: 3, py: 2 }}>
          <Typography
            component="span"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'block'
            }}
          >
            مدیریت سیستم
          </Typography>
        </Box>

        <Box sx={{ px: 2 }}>
          <CustomMenuItemLink
            to="/database-manager"
            primaryText="مدیریت دیتابیس"
            leftIcon={<StorageIcon />}
          />

          <CustomMenuItemLink
            to="/payment-gateways"
            primaryText="درگاه‌های پرداخت"
            leftIcon={<PaymentIcon />}
          />
        </Box>
      </Box>
    </Menu>
  );
};

export default MyMenu;