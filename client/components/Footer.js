import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom'
import LoginPage from './LoginPage'

class Footer extends React.Component {

  render() {
    const footerStyle = {
      backgroundColor:'#433',
      width: '100%',
      paddingTop: '10px',
      position: 'fixed',
      bottom: '0',
      left: '0'
    };
    const flexStyle = {
      top: '10px',
      color: 'white'

    }

    return (
      <div className="flex-container" style={flexStyle}>
        <footer style = {footerStyle}>
          <h4 style={{float: 'left', paddingLeft: '5px'}}>About Us</h4>
          <h4 style={{float: 'right', paddingRight: '5px'}}>Extra Resources</h4>
          <div style={{clear: "both"}}></div>
        </footer>
      </div>
    );
  }
}


export default Footer;
