import React, { Component } from "react";
import { Button, FormGroup, FormControl } from "react-bootstrap";
import { Link } from 'react-router-dom';
import "../css/LoginPage.css";

export default class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
  }

  render() {
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
            />
          </FormGroup>

          <Link to="/login">
            <Button
              block
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              >
              Login
            </Button>
          </ Link>

          <p class="centered-text">
            or
          </p>

          <Link to="/login">
            <Button
              block
              bsSize="large"
              type="submit"
              >
              Continue without logging in
              </Button>
          </ Link>
        </form>

        <p class="centered-text">Dont have an accout? <Link to="/signup">Create one!</Link></p>
      </div>
    );
  }
}
