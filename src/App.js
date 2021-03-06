import React from "react";
import { Dashboard, Login, PrivateRoute, AuthWrapper, Error } from "./pages";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <AuthWrapper>
      <Router basename='/'>
        <Switch>
          <PrivateRoute path="/" exact>
            <Dashboard />
          </PrivateRoute>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="*">
            <Error />
          </Route>
        </Switch>
      </Router>
    </AuthWrapper>
  );
}

export default App;
