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
    return (
      <div className="BondButton">
          <button onClick={this.handleClickSingle.bind(this)}>
            Single Bond
          </button>
          <button onClick={this.handleClickDouble.bind(this)}>
            Double Bond
          </button>
          <button onClick={this.handleClickTriple.bind(this)}>
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
