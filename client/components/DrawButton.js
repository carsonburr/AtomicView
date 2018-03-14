import React from 'react';
import PropTypes from 'prop-types';

class DrawButton extends React.Component {
  handleClick = () => {
    this.props.draw();
  };  

  render() {
    return (
      <div className="SelectButtonContainer" background="#3d85c6" style={{padding: '6px'}}>
          <button className="DrawButton" 
            onClick={this.handleClick} full="true">
            <i className="fa fa-pencil"></i>
          </button>
      </div>
    );
  }
}

DrawButton.propTypes = {
  draw: PropTypes.func.isRequired
};

export default DrawButton;
