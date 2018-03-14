import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom'
import LoginPage from './LoginPage'
import axios from 'axios';
import qs from 'querystring';
import LoadMolList from './LoadMolList.js';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {userId: this.props.getUserId()}; //start table closed
  }
  /*handleClick = () => {
    this.props.switchCurAction("select");
  };*/  

  setUserId = (userId) => {
    this.setState({
      userId: userId
    });
    this.props.setUserId(userId);
  };

  saveAtomsAndBondsForUser = (key) => {
    this.props.saveAtomsAndBondsForUser(key);
  };

  loadAtomsAndBondsForUser = (key) => {
    this.props.loadAtomsAndBondsForUser(key);
  };

  logout = () => {
    axios.post('/logout',
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        }
      }).then((response)=>{
        console.log("Finished logging out. Changing userId")
        this.setState({
          userId: null
        });
        this.props.setUserId(null);
      }).catch(function(error) {
        console.log(error);
      });
  }

  render() {
    const headerStyle = {
      backgroundColor:'#433',
      width: '100%',
      paddingBottom: '10px',
      marginBottom: '10px',
      position: 'fixed',
      //position: 'relative',
      top: '0',
      left: '0',
      zIndex: '999'
    };
    const flexStyle = {
      bottom: '10px',
      color: 'white'
    }
    if(this.state.userId!=null) {
      return (
        <div>
        <div className="flex-container" style={flexStyle}>
          <header style = {headerStyle}>
            <LoadMolList loadAtomsAndBondsForUser={this.loadAtomsAndBondsForUser} saveAtomsAndBondsForUser={this.saveAtomsAndBondsForUser}/>
            <button onClick={this.logout}>
              <h3 style={{float: 'right', paddingRight: '10px'}}>Logout</h3>
            </button>
            <div style={{clear: "both"}}></div>
          </header>
        </div>
        <br />
        </div>
      );
    }

    return (
      <div>
      <div className="flex-container" style={flexStyle}>
        <header style = {headerStyle}>
          <LoginPage style={{float: 'right', paddingRight: '10px'}} setUserId={this.setUserId}/>
          <div style={{clear: "both"}}></div>
        </header>
      </div>
      <br />
      </div>
    );
  }
}

LoginPage.propTypes = {
  saveAtomsAndBondsForUser: PropTypes.func.isRequired,
  loadAtomsAndBondsForUser: PropTypes.func.isRequired,
  setUserId: PropTypes.func.isRequired,
  getUserId: PropTypes.func.isRequired,
};

export default Header;
