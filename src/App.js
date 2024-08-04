import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import OwnerDashboard from './components/OwnerDashboard';
import SystemAdminDashboard from './components/SystemAdminDashboard';
import ClientSite from './components/ClientSite';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/owner" component={OwnerDashboard} />
        <Route path="/system-admin" component={SystemAdminDashboard} />
        <Route path="/" component={ClientSite} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
