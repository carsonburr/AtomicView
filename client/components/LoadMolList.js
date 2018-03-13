import React from 'react';
import loadList from '../utils/LoadAtomsAndBonds.js';

class LoadMolList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false }
    this.savedMols = [];
  }

  onOpen() {
    loadList(this.savedMols);
    this.state.open = true;
  }

  makeList() {
    return this.savedMols.map(
      function(mol) {
        return (
        <li>
          <button onClick={this.loadAtomsAndBondsForUser(mol.key)}>{mol.key}</button>
        </li>
      )
      });
  }

  saveAtomsAndBondsForUser = (key) => {
    this.props.saveAtomsAndBondsForUser(key);
  };

  loadAtomsAndBondsForUser = (key) => {
    this.props.loadAtomsAndBondsForUser(key);
  };

  render() {
    if (!this.state.open) {
      return (
        <button onClick={this.onOpen}></button>
      )
    } else {
      <div>
        
      </div>
    }
  }
}