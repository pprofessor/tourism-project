import React from 'react';
import { Menu, MenuItemLink, useSidebarState } from 'react-admin';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import HotelIcon from '@mui/icons-material/Hotel';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import FolderIcon from '@mui/icons-material/Folder';
import StorageIcon from '@mui/icons-material/Storage';
import PaymentIcon from '@mui/icons-material/Payment'; 

const MyMenu = () => {
  const [open] = useSidebarState();

  return (
    <Menu>
      <MenuItemLink
        to="/"
        primaryText="داشبورد"
        leftIcon={<DashboardIcon />}
        sidebarIsOpen={open}
      />
      <MenuItemLink
        to="/database-manager"
        primaryText="مدیریت دیتابیس"
        leftIcon={<StorageIcon />}
        sidebarIsOpen={open}
      />
      <MenuItemLink
        to="/users"
        primaryText="کاربران"
        leftIcon={<PeopleIcon />}
        sidebarIsOpen={open}
      />
      <MenuItemLink
        to="/hotels"
        primaryText="هتل‌ها"
        leftIcon={<HotelIcon />}
        sidebarIsOpen={open}
      />
      <MenuItemLink
        to="/slider-management"
        primaryText="مدیریت اسلایدها"
        leftIcon={<SlideshowIcon />}
        sidebarIsOpen={open}
      />
      <MenuItemLink
        to="/media-management"
        primaryText="مدیریت رسانه"
        leftIcon={<FolderIcon />}
        sidebarIsOpen={open}
      />
      <MenuItemLink
        to="/payment-gateways"
        primaryText="درگاه‌های پرداخت"
        leftIcon={<PaymentIcon />}
        sidebarIsOpen={open}
      />
    </Menu>
  );
};

export default MyMenu;