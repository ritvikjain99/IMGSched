import React, {Component} from 'react';

import Home from './components/home';
import Timeline from './components/timeline';
import Signup from './components/signup';

import { BrowserRouter as Router, Route, Link} from 'react-router-dom';


class  App  extends  Component {

  render() {
      return (
        <Router>
           <Route exact path="/" component={Home} />
           <Route path="/timeline" component={Timeline} />
           <Route path="/signup" component={Signup} />
        </Router>
      );
  }
  }
  export  default  App;
  