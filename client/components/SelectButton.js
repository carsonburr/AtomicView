import React from 'react';
import PropTypes from 'prop-types';

class SelectButton extends React.Component {

  handleClick = () => {
    this.props.switchCurAction("select");
  };  

  render() {
    return (
      <div className="SelectButton">
          <button onClick={this.handleClick.bind(this)}>
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
