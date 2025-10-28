import React from 'react';
import { Layout, Sidebar } from 'react-admin';
import MyMenu from './MyMenu';

const MyLayout = (props: any) => (
  <Layout
    {...props}
    sidebar={Sidebar}
    menu={MyMenu}
    appBar={() => null} 
  />
);

export default MyLayout;