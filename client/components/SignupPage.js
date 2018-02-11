import React, { Component } from "react";
import { Button, FormGroup, FormControl } from "react-bootstrap";
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../css/LoginPage.css";
import qs from 'querystring';

export default class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      verifyPassword: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getValidationState() {
    const length = this.state.password.length;
    if (length > 10) return 'success';
    else if (length > 7) return 'warning';
    else if (length > 0) return 'error';
    return null;
  }

  validateForm() {
    return (this.state.email.length > 0 || this.state.password.length > 7
           || this.state.verifyPassword.length > 7)
           && (this.state.password.length === this.state.verifyPassword.length);
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    const data = new FormData(event.target);
    axios.post('/api/insertUser',
      qs.stringify({
        email: data.get('email'),
        password: data.get('password')
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).catch(function(error) {
        debugger;
      });
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <label>Email</label>
            <FormControl
              autoFocus
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>

          <FormGroup controlId="password" bsSize="large"
                     validationState={ this.getValidationState() }
          >
            <label>Password</label>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
              name="password"
            />
          </FormGroup>

          <FormGroup controlId="verifyPassword" bsSize="large">
            <label>Verify Password</label>
            <FormControl
              value={this.state.verifyPassword}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>

          <Button
              block
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              >
              Signup
            </Button>

          <p className="centered-text">Return to the <Link to="/login">login page?</Link></p>

        </form>
      </div>
    );
  }
}
