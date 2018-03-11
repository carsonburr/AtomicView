//base template for modal used from https://github.com/dceddia/modal-in-react

import React from 'react';
import PropTypes from 'prop-types';
import {getTable} from '../../models/Atom.js';
import '../css/buttons.css';
//import 'font-awesome/css/font-awesome.min.css';
var FontAwesome = require('react-fontawesome');
class PeriodicTablePopup extends React.Component {
  constructor() {
    super();
    this.state = {isOpen: false}; //start table closed
  }

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  handleClick = (atom) => {
    this.toggleModal();
    this.props.setCurAtom(atom.symbol, atom.name, atom.radius, atom.color3d);
    this.props.switchCurAction("atom");
  };

  render() {
    const selectButtonStyle = {
      background:    '#ea9999',
      background:    '-webkit-linear-gradient(#ea9999, #660000)',
      background:    'linear-gradient(#ea9999, #660000)',
      borderRadius: '6px',
      boxShadow:    '3px 3px #ea9999',
      padding:       '8px 20px',
      color:         '#ffffff',
      display:       'inline-block',
      font:          'normal 700 20px/1 "Calibri", sans-serif',
      textAlign:    'center',
      textShadow:   '1px 1px #000000',
      border: 'none'
    };
    const divStyle = {
      padding:'6px'
    }

    if(!this.state.isOpen) {
      return (
        <div style={divStyle} >
          <button className="PeriodicTableButton" onClick = {this.toggleModal}>
            <i className="fa fa-plus"></i>
          </button>
        </div>
      )
    }

    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 50
    };

    const modalStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      maxWidth: 700,
      minHeight: 400,
      margin: '0 auto',
      padding: 30
    };

    let table = getTable();
    let rows = [];
    for (var i=0; i < 9; i++) {
      let rowID = `row${i}`;
      let cell = [];
      for(var j=0; j<18; j++){
        let cellID = `cell${i}-${j}`;
        let atom = table[i][j];
        cell.push(<td key={cellID} id={cellID} align="center" bgcolor={atom.color} 
                  onClick={this.handleClick.bind(this, atom)} width="100">
                  <sup>{atom.number}</sup><br />{atom.symbol}</td>);
                  
      }
      rows.push(<tr key={i} id={rowID}>{cell}</tr>);
    } 

    return (
      <div className="PeriodicTablePopup">
        <div style={backdropStyle}>
          <div style={modalStyle}>
            <div>
              <table id="periodic table">
                <tbody>
                  {rows}
                </tbody>
              </table>
              <div>
                <button onClick={this.toggleModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PeriodicTablePopup.propTypes = {
  setCurAtom: PropTypes.func.isRequired,
  switchCurAction: PropTypes.func.isRequired
};


export default PeriodicTablePopup;
