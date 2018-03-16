import React from 'react';
import PropTypes from 'prop-types';

class SelectButton extends React.Component {
  handleClick = () => {
    this.props.switchCurAction("select");
  };  

  render() {
    return (
      <div className="SelectButtonContainer" background="#3d85c6" style={{paddingLeft: '6px'}}>
          <button className="SelectButton"
            onClick={this.handleClick.bind(this)} full="true">
            <i className="fa fa-hand-o-up"></i>
          </button>
      </div>
    );
  }
}

SelectButton.propTypes = {
  switchCurAction: PropTypes.func.isRequired
};

export default SelectButton;
