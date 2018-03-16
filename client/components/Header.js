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
      backgroundColor:'#d4d4dcaa',
      width: '100%',
      paddingBottom: '0px',
      marginBottom: '20px',
      position: 'fixed',
      //position: 'relative',
      top: '0',
      left: '0',
      zIndex: '999'
    };
    const flexStyle = {
      //bottom: '10px',
      color: '#393f4d;',
      backgroundColor: "#1d1e2200"
    }
    if(this.state.userId!=null) {
      return (
        <div>
        <div className="flex-container">
          <header style = {headerStyle}>
            <h3 style={{float: 'left', paddingLeft: '15px'}}>
              <LoadMolList style={{float: 'right'}} loadAtomsAndBonds={this.loadAtomsAndBondsForUser} saveAtomsAndBonds={this.saveAtomsAndBondsForUser}/>
            </h3>
            <h3 style={{float: 'right', paddingRight: '15px'}}>
              <button onClick={this.logout}><i class="fa fa-sign-out"></i></button>
            </h3>
            <div style={{clear: "both"}}></div>
          </header>
        </div>
        <br />
        <div align="center" style={flexStyle} overflow="hidden"  >
          <br />
          <br />
          <br />
        </div>
        </div>

      );
    }

    return (
      <div>
      <div className="flex-container" style={flexStyle}>
        <header style = {headerStyle}>
          <h3 style={{float: 'right', paddingRight: 15}}>
            <LoginPage style={{float: 'right'}} setUserId={this.setUserId}/>
          </h3>
          <h3 style={{float: 'left', paddingLeft: 15}}>
            <h2 style={{fontFamily: 'Garamond'}}><img src="../images/icon36.png" alt="../images/logo.png" align="center"/>
            &nbsp;AtomicView</h2>
          </h3>
          <div style={{clear: "both"}}></div>
        </header>
      </div>
        <div align="center" style={flexStyle} overflow="hidden"  >
          <br />
          <br />
          <br />
        </div>
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