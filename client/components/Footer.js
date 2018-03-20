import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom'
import LoginPage from './LoginPage'

class Footer extends React.Component {
  render() {
    const footerStyle = {
      backgroundColor: "#1d1e22",
      width: '100%',
      bottom: 0,
      color: '#d4d4dc',
      //marginTop: '10px',
      // position: 'absolute',
       //right: '0',
       //bottom: '0',
       //left: '0',
      // padding: '1rem'
      //clear: 'both', //prevents floating elements from right/left of footer
      position: 'relative', //Positions footer relative to other elements on hte page
      //zIndex: '1', //z-index positions elements in front or behind eachother, most have a //natual z-index of -1
      //height: '3em', //exactly what it says...
      //marginTop: '10em' //moves footer to bottom of all elements
    };
    const flexStyle = {
      top: '10px',
      color: '#d4d4dc',
      backgroundColor: "#1d1e22"
    };

    return (
      <footer style = {footerStyle}>

        <h4 style={{float: 'left', paddingLeft: '50px'}}>
          <a href="/about">
            About Us
          </a>
        </h4>
        <h4 style={{float: 'right', paddingRight: '50px'}}>
          <a href="/resources">
            Extra Resources
          </a>
        </h4>
        <div style={{clear: "both"}}></div>
        <br />
      </footer>
    );
  }
}


export default Footer;
