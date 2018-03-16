import React, { Component } from "react";
import { Button, FormGroup, FormControl } from "react-bootstrap";
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../css/LoginPage.css";
import qs from 'querystring';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import onClickOutside from "react-onclickoutside";

var finishedLoggingIn=false;

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      redirect: false,
      isOpen: false
    };

    this.setWrapperRef = this.setWrapperRef.bind(this); 
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClickOutside = evt => {
    //catches clicks in other components, header, etc
    if(this.state.isOpen) {
      this.setState({isOpen: false});
    }
  }

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = (event) => {
    event.stopPropagation();
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    var test = axios.post('/user',
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
        this.toggleModal();
        console.log(response.data)
        this.props.setUserId(response.data);
      }).catch(function(error) {
        console.log(error);
      });
    console.log(test)
  }

  setWrapperRef(node) {
        this.wrapperRef = node;
    }
  /*handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.toggleModal();
        }
    }*/


  render() {
    if(!this.state.isOpen) {
      return (
        <div className="LoginPageButton">
          <button onClick = {this.toggleModal}>
            Login
          </button>
        </div>
      )
    }
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 50
    };
    const modalStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      border: '1px solid #ccc',
      maxWidth: 700,
      minHeight: 400,
      padding: 30,
      position: 'absolute',
      top: '215%',
      right: '35%',
      margin: '0 auto', 
    };
    return (
      <div>
        <div className="LoginPageButton">
          <button onClick = {this.toggleModal}>
            Login
          </button>
        </div>
      <div stye={backdropStyle}>
        <div className="Login"
           ref={this.setWrapperRef}
           style={modalStyle}>
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
      </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  setUserId: PropTypes.func.isRequired,
};

export default onClickOutside(LoginPage);