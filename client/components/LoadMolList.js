import React from 'react';
import {loadList} from '../utils/LoadAtomsAndBonds.js';
import LoadMolItem from './LoadMolItem.js';

export default class LoadMolList extends React.Component {

  constructor(props) {
    super(props)
    this.state = { open: false, ready: false, savedMols: [] }
    this.onOpen = this.onOpen.bind(this);
    this.updateMols = this.updateMols.bind(this);
    this.makeList = this.makeList.bind(this);
    this.saveAtomsAndBonds = this.saveAtomsAndBonds.bind(this);
    this.loadAtomsAndBonds = this.loadAtomsAndBonds.bind(this);
  }

  updateMols(mols) {
    this.setState({ savedMols: mols, open: true});
  }

  onOpen() {
    loadList(this.updateMols);
  }

  makeList() {
    let result = this.state.savedMols.map(
      (mol, i) => {
        return (
          <LoadMolItem key={mol.key} savekey={mol.key} loadAtomsAndBonds={this.loadAtomsAndBonds} saveAtomsAndBonds={this.saveAtomsAndBonds} />
      )
      });
    return result;
  }

  saveAtomsAndBonds = (key) => {
    this.props.saveAtomsAndBonds(key);
  };

  loadAtomsAndBonds = (key) => {
    this.props.loadAtomsAndBonds(key);
  };

  render() {
    if (!this.state.open) {
      return (
        <button onClick={this.onOpen}>Store Molecules</button>
      )
    } else {
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