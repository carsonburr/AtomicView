import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom'


class Header extends React.Component {
  /*handleClick = () => {
    this.props.switchCurAction("select");
  };*/  

  render() {
    const headerStyle = {
      backgroundColor:'#433',
      //color:'white',
      width: '100%',
      paddingBottom: '10px'
      //display: 'inline-block',
    };
    const flexStyle = {
      /*display: 'flex',
      flex: '1 100%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch',
      flexWrap: 'nowrap',*/
      //paddingBottom: '10px',
      //background: '#888',
      bottom: '10px',
      color: 'white'
      //width: '100%'

    }
    
    return (
      /*<div className="SelectButton" background="#3d85c6">
          <button style={buttonStyle}
            onClick={this.handleClick.bind(this)} full="true">
            Select On Screen Atom
          </button>
      </div>*/
      <div>
      <div className="flex-container" style={flexStyle}>
        <header style = {headerStyle}>
          <h3 style={{float: 'left', paddingLeft: '5px'}}>Save</h3>
          <Link to="/login">
            <h3 style={{float: 'right', paddingRight: '10px'}}>Sign In</h3>
          </Link>
          <div style={{clear: "both"}}></div>
        </header>
      </div>
      <br />
      </div>
    );
  }
}

/*Header.propTypes = {
  switchCurAction: PropTypes.func.isRequired
};*/

export default Header;
