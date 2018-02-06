import React from 'react';
import {  BrowserRouter, Route } from 'react-router-dom';

import SignupPage from '../components/SignupPage';
import LoginPage from '../components/LoginPage';



export default () => (
  <BrowserRouter>
    <div>
      <Route path="/" exact component={LoginPage} />
      <Route path="/login" exact component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
    </div>
  </BrowserRouter>
);
