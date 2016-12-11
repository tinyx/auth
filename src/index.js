import React from 'react';
import ReactDOM from 'react-dom';
import Login from './views/Login';
import Register from './views/Register';
import { Router, Route, browserHistory } from 'react-router'
import './index.css';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="/" component={Login} />
  </Router>,
  document.getElementById('root')
);
