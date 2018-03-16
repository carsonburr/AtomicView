import React from 'react';
import PropTypes from 'prop-types';

class DeleteButton extends React.Component {
  clearAll = () => {
    this.props.clearAll();
  };

  render() {
    return (
      <div className="SelectButtonContainer" background="#3d85c6" style={{padding: '6px'}}>
          <button className="ClearAllButton" onClick={this.clearAll}>
            <i className="fa fa-trash"></i>
            </button>
      </div>
    );
  }
}

DeleteButton.propTypes = {
  clearAll: PropTypes.func.isRequired
};

export default DeleteButton;
