import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Auth from './auth';
import decodeToken from './decode-token';
import Home from './home';

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = window.localStorage.getItem("userToken")
    const user = token
      ? decodeToken(token)
      : null;

    setUser(user)

  }, [])

  const handleLogin = (result) => {
    const { user, token } = result

    setUser(user)
    window.localStorage.setItem("userToken", token)

    if (window.localStorage.getItem("userToken")) {
      <Router>
        <Redirect to="/" />
      </Router>
    }
  }

  if (!user) {
    <Router>
      <Redirect to="/auth" />
    </Router>
  }

  return (
    <div className="App">

      <Router>
        <Switch>

          <Route exact path="/auth">
            <Auth handleLogin={handleLogin} />
          </Route>

          <Route exact path="/">
            <Home />
          </Route>

        </Switch>
      </Router>

    </div>
  );
}
