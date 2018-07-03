import React, { Component } from 'react';
import Main from './components/main';
import ShowSeating from './components/showSeating';
import Transaction from './components/transaction';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';


class App extends Component {
  render() {
    return (
      <Router>
        <div>

          <hr />
          <Route exact path="/" component={Main} />
          <Route path="/showLayout/:showId" exact component={ShowSeating} />
          <Route path="/transaction/:txnId" exact component={Transaction} />
        </div>
      </Router>
    );
  }
}

export default App;
