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
    return (
      <li>
        <button onClick={this.loadMol}>{this.props.savekey}</button>
      </li>
    )
  }
}