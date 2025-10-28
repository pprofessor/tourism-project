import React from 'react';
import { Admin, Resource, List, Datagrid, TextField, Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput } from 'react-admin';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { dataProvider } from './dataProvider';
import Dashboard from './Dashboard';
import Login from './Login';

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <Admin dashboard={Dashboard} dataProvider={dataProvider}>
        <Resource name="hotels" list={HotelList} edit={HotelEdit} create={HotelCreate} />
        <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate} />
      </Admin>
    </QueryClientProvider>
  );
}

export default App;