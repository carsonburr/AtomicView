import React from 'react';
import PropTypes from 'prop-types';

class BondButton extends React.Component {

  handleClickSingle = () => {
    this.props.switchCurAction("bond");
    this.props.setCurBondType(1);
  };

  handleClickDouble = () => {
    this.props.switchCurAction("bond");
    this.props.setCurBondType(2);
  };

  handleClickTriple = () => {
    this.props.switchCurAction("bond");
    this.props.setCurBondType(3);
  };

  render() {
    const buttonStyle = {
      background:    '#ea9999',
      background:    '-webkit-linear-gradient(#ea9999, #660000)',
      background:    'linear-gradient(#ea9999, #660000)',
      borderRadius: '6px',
      boxShadow:    '3px 3px #ea9999',
      padding:       '8px 20px',
      color:         '#ffffff',
      display:       'inline-block',
      font:          'normal 700 20px/1 "Calibri", sans-serif',
      textAlign:    'center',
      textShadow:   '1px 1px #000000',
      border: 'none'
    }
    const singleButtonStyle = {
      background:    '#9999ea',
      background:    '-webkit-linear-gradient(#9999ea, #000066)',
      background:    'linear-gradient(#9999ea, #000066)',
      borderRadius: '6px',
      boxShadow:    '3px 3px #9999ea',
      padding:       '8px 20px',
      color:         '#ffffff',
      display:       'inline-block',
      font:          'normal 700 20px/1 "Calibri", sans-serif',
      textAlign:    'center',
      textShadow:   '1px 1px #000000',
      border: 'none',
      marginRight: '6px'

    };
    const doubleButtonStyle = {
      background:    '#9999ea',
      background:    '-webkit-linear-gradient(#9999ea, #000066)',
      background:    'linear-gradient(#9999ea, #000066)',
      borderRadius: '6px',
      boxShadow:    '3px 3px #9999ea',
      padding:       '8px 20px',
      color:         '#ffffff',
      display:       'inline-block',
      font:          'normal 700 20px/1 "Calibri", sans-serif',
      textAlign:    'center',
      textShadow:   '1px 1px #000000',
      border: 'none',
      marginRight: '6px'
    };
    const tripleButtonStyle = {
      background:    '#9999ea',
      background:    '-webkit-linear-gradient(#9999ea, #000066)',
      background:    'linear-gradient(#9999ea, #000066)',
      borderRadius: '6px',
      boxShadow:    '3px 3px #9999ea',
      padding:       '8px 20px',
      color:         '#ffffff',
      display:       'inline-block',
      font:          'normal 700 20px/1 "Calibri", sans-serif',
      textAlign:    'center',
      textShadow:   '1px 1px #000000',
      border: 'none',
      marginRight: '6px'    
    };
    return (
      <div className="BondButton" style ={{padding:'6px'}}>
          <button style={singleButtonStyle} onClick={this.handleClickSingle.bind(this)}>
            Single Bond
          </button>
          <button style={doubleButtonStyle} onClick={this.handleClickDouble.bind(this)}>
            Double Bond
          </button>
          <button style={tripleButtonStyle}onClick={this.handleClickTriple.bind(this)}>
            Triple Bond
          </button>
      </div>
    );
  }
}

BondButton.propTypes = {
  switchCurAction : PropTypes.func.isRequired,
  setCurBondType  : PropTypes.func.isRequired
};

export default BondButton;
