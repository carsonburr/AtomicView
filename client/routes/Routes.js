import React from 'react';
import {  BrowserRouter, Route } from 'react-router-dom';
import { hashHistory } from 'react-router';

import SignupPage from '../components/SignupPage';
import LoginPage from '../components/LoginPage';
import CanvasComponent from '../components/CanvasComponent';
import About from '../components/About';
import Resources from '../components/Resources';


export default () => (
  <BrowserRouter history={hashHistory}>
    <div>
      <Route path="/" exact component={CanvasComponent} />
      <Route path="/login" exact component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/about" component={About} />
      <Route path="/resources" component={Resources} />
    </div>
  </BrowserRouter>
);
