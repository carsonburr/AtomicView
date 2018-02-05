import React, { Component } from "react";
import { Button, FormGroup, FormControl } from "react-bootstrap";
import { Link } from 'react-router-dom';
import "../css/LoginPage.css";

export default class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      verifyPassword: "",
    };
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
     //alert(this.state.email+" | "+this.state.password+" | "+this.state.verifyPassword);
    event.preventDefault();
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

          <Link to="/login">
            <Button
                block
                bsSize="large"
                disabled={!this.validateForm()}
                type="submit"
                >
                Signup
              </Button>
          </Link>

          <p class="centered-text">Return to the <Link to="/login">login page?</Link></p>

        </form>
      </div>
    );
  }
}
