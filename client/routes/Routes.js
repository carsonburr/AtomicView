import React from 'react';
import {  BrowserRouter, Route } from 'react-router-dom';

import SignupPage from '../components/SignupPage';
import LoginPage from '../components/LoginPage';
import CanvasComponent from '../components/CanvasComponent';


export default () => (
  <BrowserRouter>
    <div>
      <Route path="/" exact component={CanvasComponent} />
      <Route path="/login" exact component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
    </div>
  </BrowserRouter>
);
