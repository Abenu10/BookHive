import React from 'react';
import { Route, Switch } from 'react-router-dom';
import RenterDashboard from './components/RenterDashboard';
import OwnerDashboard from './components/OwnerDashboard';
import SystemAdminDashboard from './components/SystemAdminDashboard';
import ClientSite from './components/ClientSite';

function App() {
  return (
    <Switch>
      <Route path="/renter/dashboard" component={RenterDashboard} />
      <Route path="/owner/dashboard" component={OwnerDashboard} />
      <Route path="/admin/dashboard" component={SystemAdminDashboard} />
      <Route path="/" component={ClientSite} />
    </Switch>
  );
}

export default App;
