import React from 'react';

export default class LoadMolItem extends React.Component {

  constructor(props) {
    super(props);

    this.loadMol = this.loadMol.bind(this);
    this.saveMol = this.saveMol.bind(this);
  }

  loadMol() {
    this.props.loadAtomsAndBonds(this.props.savekey);
  }

  saveMol() {
    this.props.saveAtomsAndBonds(this.props.savekey);
  }

  render() {
    const itemStyle = {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: 10,
      maxHeight: 50,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      borderBottomStyle: 'solid',
    }
    const nameStyle = {
      flex: 1,
    }
    return (
      <div style={itemStyle}>
        <span style={nameStyle}>{this.props.savekey}</span>
        <button onClick={this.saveMol}>Save</button>
        <button onClick={this.loadMol}>Load</button>
      </div>
    )
  }
}