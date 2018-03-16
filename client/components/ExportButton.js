import React from 'react';
import PropTypes from 'prop-types';

class ExportButton extends React.Component {
  export3dCanvasImage = () => {
    this.props.export3dCanvasImage();
  };

  render() {
    return (
      <div className="exportButtonContainer" background="#3d85c6" style={{padding: '6px'}}>
          <button className="exportButton" onClick={this.export3dCanvasImage}>
            <i>export</i>
            </button>
      </div>
    );
  }
}

ExportButton.propTypes = {
  export3dCanvasImage: PropTypes.func.isRequired
};

export default ExportButton;
