import React from 'react';
import {loadList} from '../utils/LoadAtomsAndBonds.js';

export default class LoadMolList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false, ready: false }
    this.savedMols = [];
    this.onOpen = this.onOpen.bind(this);
  }

  updateMols(mols) {
    
  }

  onOpen() {
    loadList(this.savedMols, this.state.ready);
    this.state.open = true;
    console.log(this.state.open);
  }

  makeList() {
    let result = this.savedMols.map(
      function(mol) {
        return (
        <li>
          <button onClick={this.loadAtomsAndBondsForUser(mol.key)}>{mol.key}</button>
        </li>
      )
      });
    console.log("in makeList");
    console.log(result);
    return result;
  }

  saveAtomsAndBondsForUser = (key) => {
    return function() {
      this.props.saveAtomsAndBondsForUser(key);
    }
  };

  loadAtomsAndBondsForUser = (key) => {
    return function() {
      this.props.loadAtomsAndBondsForUser(key);
    }
  };

  render() {
    console.log(this.state.open);
    if (!this.state.open) {
      return (
        <button onClick={this.onOpen}>Not Open</button>
      )
    } else if (this.state.ready) {
      return (
        <div>
          <ul>
            {this.makeList()}
          </ul>
        </div>
      )
    }
    return (<div></div>)
  }
}