import React from 'react';
import PropTypes from 'prop-types';

class RevertButton extends React.Component {
  handleClick = () => {
    this.props.reversionHandler();
  };  

  render() {
    return (
      <div className="SelectButtonContainer" background="#3d85c6" >
          <button className="RevertButton" onClick={this.handleClick}>
            <i className="fa fa-undo"></i>
          </button>
      </div>
    );
  }
}

RevertButton.propTypes = {
  reversionHandler: PropTypes.func.isRequired
};

export default RevertButton;
