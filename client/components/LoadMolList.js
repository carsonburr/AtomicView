import React from 'react';
import {loadList} from '../utils/LoadAtomsAndBonds.js';
import LoadMolItem from './LoadMolItem.js';
import onClickOutside from "react-onclickoutside";

class LoadMolList extends React.Component {

  constructor(props) {
    super(props)
    this.state = { open: false, ready: false, savedMols: [], saveVal: '', }

    this.onOpen = this.onOpen.bind(this);
    this.updateMols = this.updateMols.bind(this);
    this.makeList = this.makeList.bind(this);

    this.saveAtomsAndBonds = this.saveAtomsAndBonds.bind(this);
    this.loadAtomsAndBonds = this.loadAtomsAndBonds.bind(this);

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClickOutside = (event) => {
    this.setState({open: false});
  }

  handleChange = (event) => {
    this.setState({saveVal: event.target.value});
  }

  handleSave = (event) => {
    this.props.saveAtomsAndBonds(this.state.saveVal);
    let saveVal = this.state.saveVal;
    let foundMol = this.state.savedMols.find(
      function (mol) {
        return mol.key === saveVal;
      }
    )
    if (!foundMol) {
      this.state.savedMols.push({ key: this.state.saveVal })
      this.setState({savedMols:  this.state.savedMols });
    }
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
    const popupStyle = {
      position: 'absolute',
      display: 'grid',
      grid: '330px / auto',
      backgroundColor: '#fff',
      borderRadius: 5,
      border: '1px solid #ccc',
      width: 400,
      height: 400,
      margin: '0 auto',
      padding: 10,
      top: '370%',
      right: '-10%',
      transform: 'translate(-50%, -50%)'
    };
    const listStyle = {
      border: '1px solid #cdf',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      overflowY: 'scroll',
    }
    const controlBarStyle = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 50,
      width: 'auto',
    }
    const nameField = {
      flex: 1,
    }
    const saveButton = {
    }
    if (!this.state.open) {
      return (
        <div>
          <button onClick={this.onOpen}>Store Molecules</button>
        </div>
      )
    } else {
      return (
        <div>
        <div>
          <button onClick={this.onOpen}>Store Molecules</button>
        </div>
        <div style={popupStyle}>
          <div style={listStyle}>
            {this.makeList()}
          </div>
          <div style={controlBarStyle}>
            <input type="text" style={nameField} value={this.state.saveVal} onChange={this.handleChange} />
            <button onClick={this.handleSave} style={saveButton}><i className="fa fa-save"></i></button>
          </div>
        </div>
        </div>
      )
    }
    return (<div></div>)
  }
}

export default onClickOutside(LoadMolList);
