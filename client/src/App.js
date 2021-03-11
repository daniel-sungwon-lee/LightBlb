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

  return (
    <div className="App">

      <Router>
        <Switch>

          <Route exact path="/auth">
            <Auth />
          </Route>

        </Switch>
      </Router>

    </div>
  );
}
