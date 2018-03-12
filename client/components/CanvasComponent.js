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
import saveAtomsAndBonds from '../utils/SaveAtomsAndBonds'
import loadAtomsAndBonds from '../utils/LoadAtomsAndBonds'
import '../css/buttons.css'
import '../../node_modules/font-awesome/css/font-awesome.css'

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
      canvasWidth:640,
      canvasHeight: 425,
      label: '',
      settingLabel: 0
    }

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.reversionHandler = this.reversionHandler.bind(this);

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
  }

  switchCurAction = (action) => {
    switch (action) {
      case "bond": this.refs.canvas2d.curBond = null; break;
      default: ;
    }
    this.curAction.action = action;
    this.refs.canvas2d.curSelected = null;
    this.refs.canvas2d.curMoving = null;
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
          else if (reversion.action == "deleted"){
            this.revertDeletedAtom(reversion);
          }
          break;
        case "bond":
          if(reversion.action == "added"){
            this.revertAddedBond(reversion);
          }
          else if(reversion.action == "deleted"){
            alert("Reverting a bond deletion not implemented");
          }
          break;
      }
      this.drawCanvas2D();
    }
  }

  revertDeletedAtom(reversion){
    var atom = reversion.payLoad;
    this.atoms.add(atom)
    for(let bond of atom.bonds){
      if(!bond.atom1.equals(atom)){
        bond.atom1.bonds.add(bond);
      }
      else{
        bond.atom2.bonds.add(bond);
      }
      this.bonds.add(bond)
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

  deleteHandler(){
    if(this.refs.canvas2d.curSelected != null){
      var atom = this.refs.canvas2d.curSelected;
      this.changes.push({
        type:    "atom",
        payLoad: this.refs.canvas2dcurSelected,
        action:  "deleted", overwritten:null
      });
      // Remove all references to bonds
      for(let bond of atom.bonds){
        if(bond.atom1 != atom){
          bond.atom1.bonds.delete(bond);
        }
        else{
          bond.atom2.bonds.delete(bond);
        }
        this.bonds.delete(bond)
      }
      this.atoms.delete(this.refs.canvas2d.curSelected);
      this.drawCanvas2D();
    }
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
        <span>
          <input type="text" ref={input => this._label = input} placeholder="Set Label" />
          <input type="submit" onClick={this.updateLabel} value="Save"/>
        </span>);
    }
  }

  //show Label returns nothing if the label is black or the scene label as a header
  showLabel = () => {
    if(!this.state.label) {
      return null;
    }
    return(<h1>&nbsp;Molecule: {this.state.label}</h1>)
  }

  handleKeyDown(event) {
    switch(event.key){
      // Testing key
      case 'Enter':
        console.log(event.key);
        break;
      // Pull up element table
      case 'e':
        console.log(event.key);
        break;
      // Enter bond mode / iterate bond type
      case 'b':
        console.log(event.key);
        break;
      // Enter atom Selection mode
      case 's':
        console.log(event.key);
        break;
      // Enter delete mode
      case 'd':
        this.deleteHandler();
        break;
      // Render 3d model
      case 'r':
        this.refs.canvas3d.draw3D();
        break;
      // Revert change
      case 'z':
        this.reversionHandler();
        break;
    }
  }

  render() {
    return (
      <div className="CanvasComponent" style={{ paddingTop:'50px'  }} tabIndex="0" onKeyDown={this.handleKeyDown}>
        <Header setUserId={this.setUserId}
                getUserId={this.getUserId}
                saveAtomsAndBondsForUser={this.saveAtomsAndBondsForUser}
                loadAtomsAndBondsForUser={this.loadAtomsAndBondsForUser}
                />
        <span>{this.showLabel()}</span>
        <div>
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
                             />
        </div>
        <div>
          <PeriodicTablePopup setCurAtom={this.setCurAtom}
                              switchCurAction={this.switchCurAction}/>
          <BondButton switchCurAction={this.switchCurAction}
                      setCurBondType={this.setCurBondType}/>
          <SelectButton switchCurAction={this.switchCurAction}/>
          <button className="RevertButton" onClick={this.reversionHandler}>
            <i className="fa fa-undo"></i>
          </button>
          <button className="DrawButton" onClick={() => this.refs.canvas3d.draw3D()}>
            <i className="fa fa-pencil"></i>
          </button>
          <button className="DeleteSelectedButton" onClick={this.deleteHandler}>
            <i className="fa fa-trash"></i>
            </button>
          <span>{this.getLabel()}</span>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default CanvasComponent;
