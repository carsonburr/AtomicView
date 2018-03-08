import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom'
import LoginPage from './LoginPage'

class Footer extends React.Component {
  render() {
    const footerStyle = {
      backgroundColor:'#433',
      width: '100%',
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
      marginTop: '15em' //moves footer to bottom of all elements
    };
    const flexStyle = {
      backgroundColor:'#433',
      top: '10px',
      color: 'white'
    };

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
