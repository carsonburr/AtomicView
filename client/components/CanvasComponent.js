import React, { Component } from 'react';
import {Atom, Coord, RGBA} from '../../models/Atom.js';
import {Bond} from '../../models/Bond.js';
import WebGLUtils from '../../webgl_lib/webgl-utils.js';
import PeriodicTablePopup from './PeriodicTablePopup';
import BondButton from './BondButton';
import SelectButton from './SelectButton';

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
    this.curAtom = {atom : new Atom(new Coord(0,0,0), "C", "carbon", 70, null, new Set())};
    this.curBond = null;
    this.curBondType = 1;
    this.curSelected = null;
    this.curMoving = null;
    this.curMouseOver = null;
    // Keeps track of changes for use in reversions
    this.changes = [];

    //initial/default state of canvas size
    this.state = {
      width:640,
      height: 425
    }

    this.revertChangein2D = this.revertChangein2D.bind(this);
  };


  setCurAtom = (symbol, name, atomicRadius) => {
    this.curAtom.atom = new Atom(new Coord(0,0,0), symbol, name, atomicRadius,null, new Set());
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
    this.curBond.atom1.bonds.add(this.curBond);
    this.curBond.atom2.bonds.add(this.curBond);
    for ( let bond of bonds ) {
      var atom1 = bond.atom1;
      var atom2 = bond.atom2;
      var curAtom1 = this.curBond.atom1;
      var curAtom2 = this.curBond.atom2;
      if ( (atom1.equals(curAtom1) &&
            atom2.equals(curAtom2)) ||
           (atom2.equals(curAtom1) &&
            atom1.equals(curAtom2)) ) {
        bond.bondType = this.curBond.bondType;
        notAdded = false;
        break;
      }
    }
    if(notAdded){
      this.bonds.add(this.curBond);
      this.changes.push({type:"bond", payLoad:this.curBond, atomOverwritten:null});
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
             curAtom.atom.elementName, curAtom.atom.atomicRadius, null, atom.bonds);
          this.changes.push({type:"atom", payLoad:newAtom, atomOverwritten:atom});

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
        curAtom.atom.elementName, curAtom.atom.atomicRadius, null, new Set())
      atoms.add(newAtom);
      this.changes.push({type:"atom", payLoad:newAtom, atomOverwritten:null});
    }

    // TODO: Possibly use requestAnimitionFrame. Might not be needed though as we're
    // only drawing 2d stuff.
    // requestAnimationFrame(this.drawCanvas);
    this.drawCanvas2D();
  }

  handleOnMouseMoveBond(x, y) {
    if(this.curBond != null) {
      this.tmpBond = new Bond(this.curBond.atom1, this.curBondType);
      this.tmpBond.atom2 = new Atom(new Coord(x,y,0),null,null,null,null);
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
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
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

  revertChangein2D(){
    if(this.changes.length != 0){
      var reversion = this.changes.pop();
      switch(reversion.type){
        case "atom":
          var atom = reversion.payLoad;

          // Reinsert the old atom if one was overwritten
          if(reversion.atomOverwritten != null){
            var oldAtom = reversion.atomOverwritten;
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
          break;

        case "bond":
          var bond = reversion.payLoad;
          bond.atom1.bonds.delete(bond);
          bond.atom2.bonds.delete(bond);
          this.bonds.delete(bond);
          break;
      }
      this.drawCanvas2D();
    }
  }


  // Only sets up webgl right now.
  updateCanvas() {
    const canvas3d = this.refs.canvas3d;
    const gl = WebGLUtils.setupWebGL(canvas3d,{preserveDrawingBuffer: true});
    // Specify the color for clearing <canvas>
    gl.clearColor(255.0, 255.0, 255.0, 1.0);
    gl.enable(gl.DEPTH_TEST | gl.DEPTH_BUFFER_BIT);
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

  }

  componentDidMount() {
    this.updateCanvas();
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
      this.setState({ width: 320, height: 300 });
    } else {
      let update_width  = (window.innerWidth/2)-30;
      let update_height = Math.round(update_width/1.5);
      this.setState({ width: update_width, height: update_height });
    }
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

  // TODO: Need to change the size of the canvases dynamically to fit half the screen.
  render() {
    return (
      <div className="CanvasComponent">
        <div>
          <canvas ref="canvas2d"
                  width={this.state.width} height={this.state.height} style={{border: '1px solid black'}}
                  //width={640} height=425 style={{border: '1px solid black'}}
                  onMouseDown={this.handleOnMouseDown2D.bind(this)}
                  onMouseMove={this.handleOnMouseMove.bind(this)}
                  onMouseUp={this.handleOnMouseUp.bind(this)}/>
          <canvas ref="canvas3d"
                  width={this.state.width} height={this.state.height} style={{border: '1px solid black'}}
                   />
        </div>
        <div>
          <PeriodicTablePopup setCurAtom={this.setCurAtom}
                              switchCurAction={this.switchCurAction}/>
          <BondButton switchCurAction={this.switchCurAction}
                      setCurBondType={this.setCurBondType}/>
          <SelectButton switchCurAction={this.switchCurAction}/>
          <button onClick={this.revertChangein2D}>revert</button>
        </div>
      </div>
    );
  }
}



export default CanvasComponent;
