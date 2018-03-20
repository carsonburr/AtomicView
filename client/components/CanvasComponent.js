import React, { Component } from 'react';
import {Atom, Coord, RGBA} from '../../models/Atom.js';
import {Bond} from '../../models/Bond.js';
import WebGLUtils from '../../webgl_lib/webgl-utils.js';
import CuonUtils from '../../webgl_lib/cuon-utils.js';
import CuonMatrix from '../../webgl_lib/cuon-matrix.js';
import PeriodicTablePopup from './PeriodicTablePopup';
import BondButton from './BondButton';
import CanvasComponent3D from './CanvasComponent3D';
import CanvasComponent2D from './CanvasComponent2D';
import SelectButton from './SelectButton';
import Header from './Header';
import Footer from './Footer';
import Toolbox from './Toolbox';
import saveAtomsAndBonds from '../utils/SaveAtomsAndBonds';
import {loadAtomsAndBonds} from '../utils/LoadAtomsAndBonds';
import '../css/buttons.css';
import {Icon} from 'react-fa';

/**
* Class with a 2d and a 3d canvas.
*/
class CanvasComponent extends Component {
  constructor() {

    super();
    this.atoms = new Set();
    this.bonds = new Set();
    this.curAction = {action : "atom"};
    // Current atom to be drawn.
    this.curAtom = {atom : new Atom(
      new Coord(0,0,0), "C", "carbon", 70, 0x909090, null, new Set())};
    this.curBondType = 1;
    this.canvas3d = null;
    this.gl = null;
    // Keeps track of changes for use in reversions
    this.changes = [];
    this.userId = null;

    //initial/default state of canvas size and label info
    this.state = {
      canvasWidth:screen.width,
      canvasHeight: screen.height,
      label: '',
      settingLabel: 0
    }

    this.clearAll = this.clearAll.bind(this);
    this.reversionHandler = this.reversionHandler.bind(this);
    this.export3dCanvasImage = this.export3dCanvasImage.bind(this);
    this.getLabel = this.getLabel.bind(this);
    this.setLabel = this.setLabel.bind(this);
    this.updateLabel = this.updateLabel.bind(this);
    this.showLabel = this.showLabel.bind(this);
  }

  saveAtomsAndBondsForUser = (key) => {
    saveAtomsAndBonds(key, this.atoms, this.bonds);
  }

  loadAtomsAndBondsForUser = (key) => {
    loadAtomsAndBonds(key, this.atoms, this.bonds);
    this.drawCanvas2D();
  }

  setCurAtom = (symbol, name, atomicRadius, color) => {
    this.curAtom.atom = new Atom(
      new Coord(0,0,0), symbol, name, atomicRadius,color,null, new Set());
  }

  setCurBondType = (bondType) => {
    this.curBondType = bondType;
    this.refs.canvas2d.curBond = null;
    this.refs.canvas2d.tmpBond = null;
    this.refs.canvas2d.curSelected = null;
    this.refs.canvas2d.curMoving = null;
  }

  switchCurAction = (action) => {
    this.refs.canvas2d.curBond = null;
    this.refs.canvas2d.tmpBond = null;
    this.curAction.action = action;
    this.refs.canvas2d.curSelected = null;
    this.refs.canvas2d.curMoving = null;
    this.refs.canvas2d.panning = null;
    // this.refs.canvas2d.drawCanvas();
  }

  drawCanvas2D(){
    this.refs.canvas2d.drawCanvas2D();
  }

  reversionHandler(){
    if(this.changes.length != 0){
      var reversion = this.changes.pop();
      switch(reversion.type){
        case "atom":
          if(reversion.action == "added"){
            this.revertAddedAtom(reversion);
          }
          break;
        case "bond":
          if(reversion.action == "added"){
            this.revertAddedBond(reversion);
          }
          break;
      }
      this.drawCanvas2D();
    }
  }

  revertAddedAtom(reversion){
    var atom = reversion.payLoad;
    // Reinsert the old atom if one was overwritten
    if(reversion.overwritten != null){
      var oldAtom = reversion.overwritten;
      // Reconnect the old atom's bonds
      for( let bond of oldAtom.bonds ){
        if(bond.atom1.equals(atom)){
          bond.atom1 = oldAtom;
        }
        else if(bond.atom2.equals(atom)){
          bond.atom2 = oldAtom;
        }
      }
      this.atoms.add(oldAtom);
    }
    this.atoms.delete(atom);
  }

  revertAddedBond(reversion){
    var bond = reversion.payLoad;
    // If bond was overwritten, return to original type
    if(reversion.overwritten != null){
      bond.bondType = reversion.overwritten;
    }
    else{
      bond.atom1.bonds.delete(bond);
      bond.atom2.bonds.delete(bond);
      this.bonds.delete(bond);
    }
  }

  clearAll(){
    this.atoms = new Set();
    this.bonds = new Set();
    this.curAtom = {atom : new Atom(
      new Coord(0,0,0), "C", "carbon", 70, 0x909090, null, new Set())};
    this.changes = [];
    this.drawCanvas2D();
  }

  //update canvas sizes when needed
  updateDimensions(redraw=true) {
    if(window.innerWidth < 690) {
      //TODO fix so doesnt get taller at last fixed size step
      this.setState({
        canvasWidth: 320,
        canvasHeight: 300
      });
    } else {
      let update_width  = (window.innerWidth/2)-30;
      let update_height = Math.round(update_width/1.5);
      this.setState({
        canvasWidth: update_width,
        canvasHeight: update_height
      });
    }
    this.refs.canvas3d.updateCanvas();
    if(redraw) {
      this.drawCanvas2D();
      this.refs.canvas3d.draw3D();
    }
  }
  //event listener for canvas resizing
  componentDidMount() {
    this.updateDimensions(false);
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  //unmounting component canvas
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  setUserId = (userId) => {
    this.userId = userId;
  }

  getCurAtom = () => {
    return this.curAtom;
  }

  getCurAction = () => {
    return this.curAction.action;
  }

  getCurBondType = () => {
    return this.curBondType;
  }

  getChanges = () => {
    return this.changes;
  }

  getUserId = () => {
    return this.userId;
  }

  getAtoms = () => {
    return this.atoms;
  }

  getBonds = () => {
    return this.bonds;
  }

  //-----Functions dedicated to showing and updating the Scene Label----//

  //setLabel just turns a booelan to true that is used to display an input form
  setLabel = () => {
    this.setState({settingLabel: 1});
  }

  //update label takes data from input form and changes the state
  updateLabel = () => {
    const l = this._label.value;
    this.setState({label: l, settingLabel: 0});
  }

  //get Label either shows label scene button or form
  getLabel = () => {
    if(!this.state.settingLabel){
      return(<button className="LabelButton" onClick={this.setLabel}><i className="fa fa-tag"></i></button>);
    } else {
      return(
        <span style={{paddingLeft: '6px'}}>
          <input type="text" ref={input => this._label = input} placeholder="Set Label" />

          <button onClick={this.updateLabel}> Save</button>
        </span>);
    }
  }

  //show Label returns nothing if the label is black or the scene label as a header
  showLabel = () => {
    if(!this.state.label) {
      return null;
    }
    return(<h1 style={{fontFamily: 'Garamond', color:'white', fontSize: '25px', paddingLeft: '15px'}}>&nbsp;Molecule: {this.state.label}</h1>)
  }

  draw = () => {
    this.refs.canvas3d.draw3D()
  }

  export3dCanvasImage = () => {
    this.refs.canvas3d.export3dCanvasImage();
  }

  render() {
    return (
      <div className="CanvasComponent" style={{ paddingTop:'25px', backgroundColor:'#333'  }} tabIndex="0">
        <Header setUserId={this.setUserId}
                getUserId={this.getUserId}
                saveAtomsAndBondsForUser={this.saveAtomsAndBondsForUser}
                loadAtomsAndBondsForUser={this.loadAtomsAndBondsForUser}
                />
        <div>

          <Toolbox setCurAtom={this.setCurAtom}
                  switchCurAction={this.switchCurAction}
                  clearAll={this.clearAll}
                  setCurBondType={this.setCurBondType}
                  draw={this.draw}
                  reversionHandler={this.reversionHandler}
                  export3dCanvasImage={this.export3dCanvasImage}
                  />
          <div style={{paddingLeft: '6px', paddingBottom: '6px'}}>{this.getLabel()}</div>
          <span>{this.showLabel()}</span>
          <CanvasComponent2D ref="canvas2d"
                             getAtoms={this.getAtoms}
                             getBonds={this.getBonds}
                             getCurAtom={this.getCurAtom}
                             getChanges={this.getChanges}
                             getCurAction={this.getCurAction}
                             getCurBondType={this.getCurBondType}
                             canvasWidth={this.state.canvasWidth}
                             canvasHeight={this.state.canvasHeight}
                             />
          <CanvasComponent3D ref="canvas3d"
                             getAtoms={this.getAtoms}
                             getBonds={this.getBonds}
                             canvasWidth={this.state.canvasWidth}
                             canvasHeight={this.state.canvasHeight}
                             label={this.state.label}
                             />
        </div>
        <Footer/>
      </div>
    );
  }
}

export default CanvasComponent;
