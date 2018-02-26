import React, { Component } from "react";
import { Button, FormGroup, FormControl } from "react-bootstrap";
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../css/LoginPage.css";
import qs from 'querystring';
import { Redirect } from 'react-router';

var finishedLoggingIn=false;

export default class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      redirect: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    axios.post('/user',
      qs.stringify({
        email: data.get('email'),
        password: data.get('password')
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        }
      }).then((response)=>{
        this.setState({redirect: true});
        this.render();
      }).catch(function(error) {
        console.log(error);
      });
  }

  render() {
    const { a,b,redirect } = this.state;

    if (redirect) {
      return <Redirect to='/'/>;
    }
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup
            controlId="email"
            bsSize="large"
          >
            <label>Email</label>
            <FormControl
              autoFocus
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>

          <FormGroup controlId="password" bsSize="large">
            <label>Password</label>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
              name="password"
            />
          </FormGroup>

          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            >
            Login
          </Button>

          <p className="centered-text">
            or
          </p>

          <Button
            block
            bsSize="large"
            type="submit"
            >
            Continue without logging in
            </Button>
        </form>

        <p className="centered-text">Dont have an accout? <Link to="/signup">Create one!</Link></p>
      </div>
    );
  }
}
