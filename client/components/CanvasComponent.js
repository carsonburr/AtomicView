import React, { Component } from 'react';
import {Atom, Coord, RGBA} from '../../models/Atom.js';
import {Bond} from '../../models/Bond.js';
import WebGLUtils from '../../webgl_lib/webgl-utils.js';
import CuonUtils from '../../webgl_lib/cuon-utils.js';
import CuonMatrix from '../../webgl_lib/cuon-matrix.js';
import PeriodicTablePopup from './PeriodicTablePopup';
import BondButton from './BondButton';
import CanvasComponent3D from './CanvasComponent3D';
import SelectButton from './SelectButton';
import Header from './Header';
import Footer from './Footer';
import saveAtomsAndBonds from '../utils/SaveAtomsAndBonds'
import loadAtomsAndBonds from '../utils/LoadAtomsAndBonds'
import '../css/buttons.css'

/**
* Class with a 2d and a 3d canvas.
*/
class CanvasComponent extends Component {
  constructor() {

    super();
    this.atoms = new Set();
    this.bonds = new Set();
    this.curAction = {action : "atom"}; // Can currently only be atom or bond
    // Current atom to be drawn.
    this.curAtom = {atom : new Atom(new Coord(0,0,0), "C", "carbon", 70, 0x909090, null, new Set())};
    this.curBond = null;
    this.curBondType = 1;
    this.curSelected = null;
    this.curMoving = null;
    this.curMouseOver = null;
    this.canvas3d = null;
    this.gl = null;
    // Keeps track of changes for use in reversions
    this.changes = [];
    this.userId = null;

    //initial/default state of canvas size and label info
    this.state = {
      width:640,
      height: 425,
      label: '',
      settingLabel: 0
    }

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.reversionHandler = this.reversionHandler.bind(this);
    // this.draw3D = this.refs.canvas3d.draw3D.bind(this);

  }

  saveAtomsAndBondsForUser = (key) => {
    saveAtomsAndBonds(key, this.atoms, this.bonds);
  }

  loadAtomsAndBondsForUser = (key) => {
    loadAtomsAndBonds(key, this.atoms, this.bonds);
    this.drawCanvas2D();
  }

  setCurAtom = (symbol, name, atomicRadius, color) => {
    this.curAtom.atom = new Atom(new Coord(0,0,0), symbol, name, atomicRadius,color,null, new Set());
  }

  setCurBondType = (bondType) => {
    this.curBondType = bondType;
  }

  switchCurAction = (action) => {
    switch (action) {
      case "select": this.curSelected = null; break;
      case "bond": this.curBond = null; break;
      default: ;
    }
    this.curAction.action = action;
    this.curSelected = null;
    this.curMoving = null;
  }

  // Calls drawScene2D() with the context as a parameter
  drawCanvas2D(){
    const canvas2d = this.refs.canvas2d;
    const context2d = canvas2d.getContext('2d');
    this.drawScene2D(context2d);

  }

  // Clears the 2d Canvas and calls drawAtoms2D
  drawScene2D(context2d) {
    context2d.clearRect(0, 0, context2d.canvas.width, context2d.canvas.height);
    this.drawAtoms2D(context2d);
    this.drawBonds2D(context2d);
  }

  drawBond2D(context2d, bond) {
    if(bond.bondType == 1) {
      context2d.beginPath();
      context2d.moveTo(bond.atom1.location.x, bond.atom1.location.y);
      context2d.lineTo(bond.atom2.location.x, bond.atom2.location.y);
      context2d.stroke();
    } else {
      var x1 = bond.atom1.location.x;
      var y1 = bond.atom1.location.y;
      var x2 = bond.atom2.location.x;
      var y2 = bond.atom2.location.y;
      var slope = - 1.0/(1.0 * (y1 - y2)/(x1 - x2));
      var displacementX, displacementY;
      if (x1-x2 == 0) {
        displacementX = 4;
        displacementY = 0;
      } else {
        var angle = Math.atan2(y1-y2, x1-x2) + Math.PI / 2;
        displacementX = Math.cos(angle) * 4;
        displacementY = Math.sin(angle) * 4;
      }
      if (bond.bondType == 2) {
        context2d.beginPath();
        context2d.moveTo(x1+displacementX, y1+displacementY);
        context2d.lineTo(x2+displacementX, y2+displacementY);
        context2d.stroke();
        context2d.beginPath();
        context2d.moveTo(x1-displacementX, y1-displacementY);
        context2d.lineTo(x2-displacementX, y2-displacementY);
        context2d.stroke();
      } else if (bond.bondType == 3) {
        displacementX *= 5/4;
        displacementY *= 5/4;
        context2d.beginPath();
        context2d.moveTo(bond.atom1.location.x, bond.atom1.location.y);
        context2d.lineTo(bond.atom2.location.x, bond.atom2.location.y);
        context2d.stroke();
        context2d.beginPath();
        context2d.moveTo(x1+displacementX, y1+displacementY);
        context2d.lineTo(x2+displacementX, y2+displacementY);
        context2d.stroke();
        context2d.beginPath();
        context2d.moveTo(x1-displacementX, y1-displacementY);
        context2d.lineTo(x2-displacementX, y2-displacementY);
        context2d.stroke();
      }
    }
  }

  drawBonds2D(context2d) {
    var bonds = this.bonds;
    for( let bond of bonds ){
      this.drawBond2D(context2d, bond);
    }
    if (this.tmpBond != null) {
      this.drawBond2D(context2d, this.tmpBond);
    }
  }

  // Draws all the atoms.
  drawAtoms2D(context2d) {
    var atoms = this.atoms;
    for (let atom of atoms) {

        if (atom.equals(this.curSelected) ||
           (atom.equals(this.curMouseOver) && this.curMoving == null && this.curAction.action == "select") ||
           (atom.equals(this.curMouseOver) && this.curAction.action == "bond")) {
          context2d.fillStyle = "lightgreen";
        } else if (this.curAction.action == "atom" && atom.equals(this.curMouseOver)) {
          context2d.fillStyle = "#ff9933";
        } else if (atom.equals(this.curMouseOver)) {
          context2d.fillStyle = "#c82124"; //red
        } else {
          context2d.fillStyle = "lightgrey";
        }
        context2d.beginPath();
        context2d.arc(atom.location.x,atom.location.y,30/2,0,Math.PI*2,true);
        context2d.closePath();
        context2d.fill();
        context2d.fillStyle = "black";
        context2d.font = 'normal bold 20px sans-serif';
        context2d.textAlign = 'center';
        context2d.textBaseline = 'middle';
        context2d.fillText(atom.atomicSymbol, atom.location.x, atom.location.y);
    }
  }

  handleLeftOnMouseDown2D(x, y) {
    switch (this.curAction.action) {
      case "atom":
        this.handleLeftOnMouseDown2DAtom(x,y);
        break;
      case "bond":
        this.handleLeftOnMouseDown2dBond(x,y);
        break;
      case "select":
        this.handleLeftOnMouseDown2DSelect(x,y);
        break;
      default:
        console.log("Unsupported Action: " + this.curAction.action);
    }
    if(this.curAction.action != "select") {
      this.curMoving = null;
    }
  }

  getAtomAtLocation(x, y) {
    var atoms = this.atoms;
    // TODO: Might want to use a hash map for this.
    for (let atom of atoms) {
        if(atom.equals(this.curMoving)) {
          continue;
        }
        if( (Math.abs(atom.location.x - x) < 30) && (Math.abs(atom.location.y - y) < 30) ) {
          return atom;
        }
    }
    return null;
  }

  addNewBond(atom) {
    var bonds = this.bonds;
    var notAdded = true;
    this.curSelected = null;
    this.tmpBond = null;
    this.curBond.atom2 = atom;
    for ( let bond of bonds ) {
      var atom1 = bond.atom1;
      var atom2 = bond.atom2;
      var curAtom1 = this.curBond.atom1;
      var curAtom2 = this.curBond.atom2;
      if ( (atom1.equals(curAtom1) &&
            atom2.equals(curAtom2)) ||
           (atom2.equals(curAtom1) &&
            atom1.equals(curAtom2)) ) {
        this.changes.push({type:"bond", payLoad:bond, action:"added", overwritten:bond.bondType});
        bond.bondType = this.curBond.bondType;
        notAdded = false;
        break;
      }
    }
    if(notAdded){
      this.bonds.add(this.curBond);
      this.curBond.atom1.bonds.add(this.curBond);
      this.curBond.atom2.bonds.add(this.curBond);
      this.changes.push({type:"bond", payLoad:this.curBond, action:"added", overwritten:null});
    }

    this.curBond = null;
    this.drawCanvas2D();
  }

  // Handles left click for bonds
  handleLeftOnMouseDown2dBond(x, y) {
    var atom = this.getAtomAtLocation(x, y);
    // If atom exists at this location
    if(atom != null ) {
      // If this is the first of the two atoms to be bonded
      if(this.curBond == null ){
        this.curBond = new Bond(atom, this.curBondType);
        this.curSelected = atom;
      }
       else {
        this.addNewBond(atom);
      }
    }
  }

  // Handles left click for selections
  handleLeftOnMouseDown2DSelect(x, y) {
    var atom = this.getAtomAtLocation(x, y);
    // If atom exists at this location
    if (atom != null) {
      this.curSelected = atom;
      this.curMoving = atom;
    } else {
      this.curSelected = null;
    }
  }

  // Handles left click for atoms
  handleLeftOnMouseDown2DAtom(x, y) {
    var atoms = this.atoms;
    var curAtom = this.curAtom;
    var atom = this.getAtomAtLocation(x, y);
    // if atom already exists in this spot then overwrite it (and maintain bonds)
        if (atom != null) {
          var newAtom = new Atom(atom.location, curAtom.atom.atomicSymbol,
             curAtom.atom.elementName, curAtom.atom.atomicRadius, curAtom.atom.atomColor, null, atom.bonds);
          this.changes.push({type:"atom", payLoad:newAtom, action:"added", overwritten:atom});

          // Change the overwritten atoms bonds to be to the new atom instead
          for( let bond of atom.bonds ){
            if(bond.atom1.equals(atom)){
              bond.atom1 = newAtom;
            }
            else if(bond.atom2.equals(atom)){
              bond.atom2 = newAtom;
            }
          }
          atoms.delete(atom);
          atoms.add(newAtom);
    }
    // If atom does not exist in this spot then create a new one
    else {
      var newAtom = new Atom(new Coord(x, y, 0), curAtom.atom.atomicSymbol,
        curAtom.atom.elementName, curAtom.atom.atomicRadius, curAtom.atom.atomColor, null, new Set())
      atoms.add(newAtom);
      this.changes.push({type:"atom", payLoad:newAtom, action:"added", overwritten:null});
    }

    // TODO: Possibly use requestAnimitionFrame. Might not be needed though as we're
    // only drawing 2d stuff.
    // requestAnimationFrame(this.drawCanvas);
    this.drawCanvas2D();
  }

  handleOnMouseMoveBond(x, y) {
    if(this.curBond != null) {
      this.tmpBond = new Bond(this.curBond.atom1, this.curBondType);
      this.tmpBond.atom2 = new Atom(new Coord(x,y,0), null, null, null, null, null);
    }
  }

  handleOnMouseMoveSelect(x, y, atom) {
    if(this.curMoving != null) {
      if (atom == null || atom.equals(this.curMoving)) {
        this.curMoving.location.x = x;
        this.curMoving.location.y = y;
      }
    }
  }

  handleOnMouseMove(ev){
    let boundingRect = ev.target.getBoundingClientRect();
    var x = ev.clientX - boundingRect.left; // x coordinate of a mouse pointer
    var y = ev.clientY - boundingRect.top; // y coordinate of a mouse pointer
    var atom = this.getAtomAtLocation(x, y);
    this.curMouseOver = atom;
    switch (this.curAction.action) {
      case "atom":
        break;
      case "bond":
        this.handleOnMouseMoveBond(x, y);
        break;
      case "select":
        this.handleOnMouseMoveSelect(x, y, atom);
        break;
      default:
        console.log("Unsupported Action: " + this.curAction.action);
    }
    this.drawCanvas2D();
  }

  handleOnMouseUpSelect(x, y) {
    this.curMoving = null;
  }

  handleOnMouseUpBond(x, y) {
    var atom = this.getAtomAtLocation(x, y);
    if(atom != null && this.curBond != null && atom != this.curSelected) {
      this.addNewBond(atom);
    }
  }

  handleOnMouseUp(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    this.curMouseOver = null;
    switch (this.curAction.action) {
      case "atom":
        break;
      case "bond":
        this.handleOnMouseUpBond(x, y);
        break;
      case "select":
        this.handleOnMouseUpSelect(x, y);
        break;
      default:
        console.log("Unsupported Action: " + this.curAction.action);
    }
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
    if(this.curSelected != null){
      var atom = this.curSelected
      this.changes.push({type:"atom", payLoad:this.curSelected, action:"deleted", overwritten:null})
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
      this.atoms.delete(this.curSelected);
      this.drawCanvas2D();
    }
  }

  // On click handler
  handleOnMouseDown2D(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect() ;

    x = (x - rect.left);
    y = (y - rect.top);
    if(ev.button === 2) {
      // Right Click
    } else if(ev.button === 0) {
      // Left Click
      this.handleLeftOnMouseDown2D(x,y);
    } else if (ev.button === 1){
      ev.preventDefault();
      // Middle Click
    }
  }

  //update canvas sizes when needed
  updateDimensions() {
    if(window.innerWidth < 690) {
      //TODO fix so doesnt get taller at last fixed size step
      this.setState({ width: 320, height: 300 });
    } else {
      let update_width  = (window.innerWidth/2)-30;
      let update_height = Math.round(update_width/1.5);
      this.setState({ width: update_width, height: update_height });
    }
    this.drawCanvas2D();
    this.refs.canvas3d.draw3D();
  }
  //event listener for canvas resizing
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  //unmounting component canvas
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  setUserId = (userId) => {
    this.userId = userId;
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

  getCanvasWidth = () => {
    return this.state.width;
  }

  getCanvasHeight = () => {
    return this.state.height;
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
      return(<button className="LabelButton" onClick={this.setLabel}>Label Scene</button>);
    } else {
      return(<span><input type="text" ref={input => this._label = input} placeholder="Set Label" /><input type="submit" onClick={this.updateLabel} value="Save"/></span>);
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

  // TODO: Need to change the size of the canvases dynamically to fit half the screen.
  render() {

    return (
      <div className="CanvasComponent" style={{marginBottom: '50px'}} tabIndex="0" onKeyDown={this.handleKeyDown}>
        <Header setUserId={this.setUserId}
                getUserId={this.getUserId}
                saveAtomsAndBondsForUser={this.saveAtomsAndBondsForUser}
                loadAtomsAndBondsForUser={this.loadAtomsAndBondsForUser}
                />
        <span>{this.showLabel()}</span>
        <div>
          <canvas ref="canvas2d"
                  width={this.state.width} height={this.state.height} style={{border: '1px solid black', marginLeft: '10px'}}
                  onMouseDown={this.handleOnMouseDown2D.bind(this)}
                  onMouseMove={this.handleOnMouseMove.bind(this)}
                  onMouseUp={this.handleOnMouseUp.bind(this)}/>
          <CanvasComponent3D ref="canvas3d"
                             getAtoms={this.getAtoms}
                             getBonds={this.getBonds}
                             getCanvasHeight={this.getCanvasHeight}
                             getCanvasWidth={this.getCanvasWidth}
                             canvasWidth={this.state.width}
                             canvasHeight={this.state.height}
                             />
        </div>
        <div>
          <PeriodicTablePopup setCurAtom={this.setCurAtom}
                              switchCurAction={this.switchCurAction}/>
          <BondButton switchCurAction={this.switchCurAction}
                      setCurBondType={this.setCurBondType}/>
          <SelectButton switchCurAction={this.switchCurAction}/>
          <button className="RevertButton" onClick={this.reversionHandler}>Revert</button>
          <button className="DrawButton" onClick={() => this.refs.canvas3d.draw3D()}>Draw</button>
          <button className="DeleteSelectedButton" onClick={this.deleteHandler}>delete selected</button>
          <span>{this.getLabel()}</span>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default CanvasComponent;
