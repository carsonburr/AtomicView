import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom'
import LoginPage from './LoginPage'

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

  saveAtomsAndBondsForUser = () => {
    this.props.saveAtomsAndBondsForUser("test3");
  };

  loadAtomsAndBondsForUser = () => {
    this.props.loadAtomsAndBondsForUser("test3");
  };

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
    if(this.state.userId!=null) {
      return (
        <div>
        <div className="flex-container" style={flexStyle}>
          <header style = {headerStyle}>
            <h3 style={{float: 'left', paddingLeft: '5px'}}>
              <button onClick={this.saveAtomsAndBondsForUser}>Save</button>
            </h3>
            <h3 style={{float: 'left', paddingLeft: '5px'}}>
              <button onClick={this.loadAtomsAndBondsForUser}>Load</button>
            </h3>
            <button>
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

/*Header.propTypes = {
  switchCurAction: PropTypes.func.isRequired
};*/

export default Header;
