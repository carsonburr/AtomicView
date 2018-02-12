import React from 'react';
import PropTypes from 'prop-types';

class BondButton extends React.Component {

  handleClick = () => {
    this.props.switchCurAction("bond");
  };  

  render() {
    return (
      <div className="BondButton">
          <button onClick={this.handleClick.bind(this)}>
            Bond
          </button>
      </div>
    );
  }
}

BondButton.propTypes = {
  switchCurAction: PropTypes.func.isRequired
};

export default BondButton;
