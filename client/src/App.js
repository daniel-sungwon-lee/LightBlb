import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Spinner from './components/spinner';
import Auth from './auth';
import decodeToken from './decode-token';
import Nav from './components/nav';
import Home from './home';

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = window.localStorage.getItem("userToken")
    const user = token
      ? decodeToken(token)
      : null;

    setUser(user)
    setLoading(false)

  }, [])

  const handleLogin = (result) => {
    setLoading(true)
    const { user, token } = result

    setUser(user)
    window.localStorage.setItem("userToken", token)

    if (window.localStorage.getItem("userToken")) {
      window.location.pathname="/"
    }
  }

  const handleSignOut = () => {
    window.localStorage.removeItem("userToken")
    setUser(null)
  }

  if (loading) {
    return <Spinner />
  }

  if (!user) {
    return <Auth handleLogin={handleLogin} />
  }

  if (window.location.pathname === "/auth" && user) {
    window.location.pathname = "/"
  }

  return (
    <div className="App">

      <Router>
        <Nav handleSignOut={handleSignOut} />
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
