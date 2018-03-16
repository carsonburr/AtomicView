import React from 'react';
import PropTypes from 'prop-types';

class DrawButton extends React.Component {
  handleClick = () => {
    this.props.draw();
  };

  render() {
    return (
      <div className="SelectButtonContainer" background="#3d85c6">
          <button className="DrawButton"
            onClick={this.handleClick} full="true">
            <i>Draw</i>
          </button>
      </div>
    );
  }
}

DrawButton.propTypes = {
  draw: PropTypes.func.isRequired
};

export default DrawButton;
