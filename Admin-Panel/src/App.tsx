import React from 'react';
import { Admin, Resource, List, Datagrid, TextField, Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { dataProvider } from './dataProvider';
import Dashboard from './Dashboard';
import Login from './Login';
import DatabaseManager from './components/DatabaseManager/DatabaseManager';
import { AuthProvider } from './contexts/AuthContext';
import SliderManagement from './components/DatabaseManager/SliderManagement';
import MediaManager from './components/DatabaseManager/MediaManager';
import MyLayout from './components/Layout/MyLayout';
import SimpleLayout from './components/Layout/SimpleLayout';
import PaymentGatewayManagement from './components/DatabaseManager/PaymentGatewayManagement';

const queryClient = new QueryClient();

// کامپوننت‌های wrapper با Layout ساده
const DatabaseManagerWithSimpleLayout = () => (
  <SimpleLayout>
    <DatabaseManager />
  </SimpleLayout>
);

const SliderManagementWithSimpleLayout = () => (
  <SimpleLayout>
    <SliderManagement />
  </SimpleLayout>
);

const MediaManagerWithSimpleLayout = () => (
  <SimpleLayout>
    <MediaManager />
  </SimpleLayout>
);

const PaymentGatewayManagementWithSimpleLayout = () => (
  <SimpleLayout>
    <PaymentGatewayManagement />
  </SimpleLayout>
);

// کامپوننت‌های Hotel
const HotelList = (props: any) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="location" />
      <TextField source="price" />
    </Datagrid>
  </List>
);

const HotelEdit = (props: any) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="location" />
      <NumberInput source="price" />
    </SimpleForm>
  </Edit>
);

const HotelCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="location" />
      <NumberInput source="price" />
    </SimpleForm>
  </Create>
);

// کامپوننت‌های User
const UserList = (props: any) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="username" />
      <TextField source="email" />
      <TextField source="userType" />
    </Datagrid>
  </List>
);

const UserEdit = (props: any) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="username" />
      <TextInput source="email" />
      <SelectInput source="userType" choices={[
        { id: 'REGISTERED_TOURIST', name: 'Tourist' },
        { id: 'VERIFIED_TOURIST', name: 'Verified' },
        { id: 'AMBASSADOR', name: 'Ambassador' }
      ]} />
    </SimpleForm>
  </Edit>
);

const UserCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="username" />
      <TextInput source="email" />
      <TextInput source="password" type="password" />
      <SelectInput source="userType" choices={[
        { id: 'REGISTERED_TOURIST', name: 'Tourist' },
        { id: 'VERIFIED_TOURIST', name: 'Verified' },
        { id: 'AMBASSADOR', name: 'Ambassador' }
      ]} />
    </SimpleForm>
  </Create>
);

function App() {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Login />;
  }

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Admin 
          dashboard={Dashboard}
          dataProvider={dataProvider}
          layout={MyLayout}
          disableTelemetry 
        >
          <CustomRoutes>
            {/* فقط از Layoutهای ساده استفاده کن - بدون منوی بالایی */}
            <Route path="/database-manager" element={<DatabaseManagerWithSimpleLayout />} />
            <Route path="/slider-management" element={<SliderManagementWithSimpleLayout />} />
            <Route path="/media-management" element={<MediaManagerWithSimpleLayout />} />
            <Route path="/payment-gateways" element={<PaymentGatewayManagementWithSimpleLayout />} />
          </CustomRoutes>
          <Resource name="hotels" list={HotelList} edit={HotelEdit} create={HotelCreate} />
          <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} />
        </Admin>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;