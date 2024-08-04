import React from 'react';
import { Route, Switch } from 'react-router-dom';
import OwnerDashboard from './OwnerDashboard';
import SystemAdminDashboard from './SystemAdminDashboard';
import ClientSite from './ClientSite';

function App() {
  return (
    <Switch>
      <Route path="/owner/dashboard" component={OwnerDashboard} />
      <Route path="/admin/dashboard" component={SystemAdminDashboard} />
      <Route path="/" component={ClientSite} />
    </Switch>
  );
}

export default App;
