import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Auth from './auth';

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    if(!user) {
      return <Redirect to="/auth" />
    }
  }, [user])

  const handleLogin = (result) => {
    const { user, token } = result

    setUser(user)
    window.localStorage.setItem("userToken", token)

    if(window.localStorage.getItem("userToken")) {
      return <Redirect to="/" />
    }
  }

  return (
    <div className="App">

      <Router>
        <Switch>

          <Route exact path="/auth">
            <Auth handleLogin={handleLogin} />
          </Route>

          <Route exact path="/">

          </Route>

        </Switch>
      </Router>

    </div>
  );
}
