import React from 'react';
import PropTypes from 'prop-types';


class SelectButton extends React.Component {
  handleClick = () => {
    this.props.switchCurAction("select");
  };  

  render() {
    const buttonStyle = {
      background:    '#9999ea',
      background:    '-webkit-linear-gradient(#99ea99, #006666)',
      background:    'linear-gradient(#99ea99, #006666)',
      borderRadius: '6px',
      boxShadow:    '3px 3px #99ea99',
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
      <div className="SelectButtonContainer" background="#3d85c6" style={{padding: '6px'}}>
          <button className="SelectButton"
            onClick={this.handleClick.bind(this)} full="true">
            Select On Screen Atom
          </button>
      </div>
    );
  }
}

SelectButton.propTypes = {
  switchCurAction: PropTypes.func.isRequired
};

export default SelectButton;
