import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import SignIn from "pages/login";
import SignUp from "pages/signup";
import Dashboard from "pages/dashboard";
import { useSelector } from "react-redux";

const Routes = () => {
  const isAuthenticated = useSelector(state => !!state.auth.token);
  console.log(isAuthenticated);

  return (
    <Switch>
      <Route
        exact
        path="/"
        render={() => {
          if (isAuthenticated) {
            return <Redirect to="/dashboard" />;
          }
          return <Redirect to="/login" />;
        }}
      />
      {!isAuthenticated && (
        <Switch>
          <Route path="/login" component={SignIn} />
          <Route path="/signup" component={SignUp} />
        </Switch>
      )}
      {isAuthenticated && (
        <Switch>
          <Route exact path="/dashboard" component={Dashboard} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      )}
    </Switch>
  );
};

export default Routes;
