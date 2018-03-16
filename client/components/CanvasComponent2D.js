import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Atom, Coord, RGBA} from '../../models/Atom.js';
import {Bond} from '../../models/Bond.js';

class CanvasComponent2D extends Component {
  constructor(props) {
    super(props);
    this.curSelected = null;
    this.curMoving = null;
    this.curBond = null;
    this.curMouseOver = null;
    this.tmpBond = null;
    this.panning = false;
    this.prevPanningX = 0;
    this.prevPanningY = 0;
    this.lastEndPanningX = 0;
    this.lastEndPanningY = 0;
  }

  // Calls drawScene2D() with the context as a parameter
  drawCanvas2D(){
    const canvas2d = this.refs.canvas2d;
    const context2d = canvas2d.getContext('2d');
    if(context2d != null && context2d != 'undefined') {
      this.drawScene2D(context2d);
    }
  }

  // Clears the 2d Canvas and calls drawAtoms2D
  drawScene2D(context2d) {
    context2d.clearRect(0, 0, context2d.canvas.width, context2d.canvas.height);
    this.drawAtoms2D(context2d);
    this.drawBonds2D(context2d);
  }

  drawBond2D(context2d, bond) {
    var x1 = bond.atom1.location.x;
    var y1 = bond.atom1.location.y;
    var x2 = bond.atom2.location.x;
    var y2 = bond.atom2.location.y;
    if(bond.bondType == 1) {
      this.drawSingleBond2D(context2d, x1, y1, x2, y2);
    } else {
      this.drawDoubleOrTripleBond2D(context2d, x1, y1, x2, y2, bond);
    }
  }

  drawSingleBond2D(context2d, x1, y1, x2, y2) {
    context2d.beginPath();
    context2d.moveTo(x1, y1);
    context2d.lineTo(x2, y2);
    context2d.stroke();
  }

  drawDoubleOrTripleBond2D(context2d, x1, y1, x2, y2, bond) {
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
        this.drawDoubleBond2D(context2d, x1, y1, x2, y2, displacementX, displacementY);
      } else if (bond.bondType == 3) {
        this.drawTripleBond2D(context2d, x1, y1, x2, y2, displacementX, displacementY)
      }

  }

  drawDoubleBond2D(context2d, x1, y1, x2, y2, displacementX, displacementY) {
    this.drawSingleBond2D(context2d, x1+displacementX, y1+displacementY,
                          x2+displacementX, y2+displacementY);
    this.drawSingleBond2D(context2d, x1-displacementX, y1-displacementY,
                          x2-displacementX, y2-displacementY);
  }

  drawTripleBond2D(context2d, x1, y1, x2, y2, displacementX, displacementY) {
    displacementX *= 5/4;
    displacementY *= 5/4;
    this.drawSingleBond2D(context2d, x1, y1, x2, y2);
    this.drawSingleBond2D(context2d, x1+displacementX, y1+displacementY,
                          x2+displacementX, y2+displacementY);
    this.drawSingleBond2D(context2d, x1-displacementX, y1-displacementY,
                          x2-displacementX, y2-displacementY);
  }

  drawBonds2D(context2d) {
    var bonds = this.props.getBonds();
    for( let bond of bonds ){
      this.drawBond2D(context2d, bond);
    }
    if (this.tmpBond != null) {
      this.drawBond2D(context2d, this.tmpBond);
    }
  }

  setAtomColor2D(context2d, atom) {
    if (atom.equals(this.curSelected) ||
       (atom.equals(this.curMouseOver) && this.curMoving == null && this.props.getCurAction() == "select") ||
       (atom.equals(this.curMouseOver) && this.props.getCurAction() == "bond")) {
      context2d.fillStyle = "lightgreen";
    } else if (this.props.getCurAction() == "atom" && atom.equals(this.curMouseOver)) {
      context2d.fillStyle = "#ff9933";
    } else if (atom.equals(this.curMouseOver)) {
      context2d.fillStyle = "#c82124"; //red
    } else {
      context2d.fillStyle = "lightgrey";
    }
  }

  drawCircleForAtom2D(context2d, atom) {
    this.setAtomColor2D(context2d, atom);
    context2d.beginPath();
    context2d.arc(atom.location.x,atom.location.y,30/2,0,Math.PI*2,true);
    context2d.closePath();
    context2d.fill();
  }

  drawTextForAtom2D(context2d, atom) {
    context2d.fillStyle = "black";
    context2d.font = 'normal bold 20px sans-serif';
    context2d.textAlign = 'center';
    context2d.textBaseline = 'middle';
    context2d.fillText(atom.atomicSymbol, atom.location.x, atom.location.y);
  }

  actuallyDrawAtom2D(context2d, atom) {
    this.drawCircleForAtom2D(context2d, atom);
    this.drawTextForAtom2D(context2d, atom);
  }

  // Draws all the atoms.
  drawAtoms2D(context2d) {
    var atoms = this.props.getAtoms();
    for (let atom of atoms) {
      this.actuallyDrawAtom2D(context2d, atom);
    }
  }

  getAtomAtLocation(x, y) {
    var atoms = this.props.getAtoms();
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

  handleLeftOnMouseDown(x, y) {
    switch (this.props.getCurAction()) {
      case "atom":
        this.handleLeftOnMouseDownAtom(x,y);
        break;
      case "bond":
        this.handleLeftOnMouseDownBond(x,y);
        break;
      case "select":
        this.handleLeftOnMouseDownSelect(x,y);
        break;
      default:
        console.log("Unsupported Action: " + this.props.getCurAction());
    }
    if(this.props.getCurAction() != "select") {
      this.curMoving = null;
    }
  }

  isCurBondOverriding(bond) {
      var atom1 = bond.atom1;
      var atom2 = bond.atom2;
      var curAtom1 = this.curBond.atom1;
      var curAtom2 = this.curBond.atom2;
      return ( atom1.equals(curAtom1) &&
               atom2.equals(curAtom2)) ||
             ( atom2.equals(curAtom1) &&
               atom1.equals(curAtom2));
  }

  addNewBond(atom) {
    var curBond = this.curBond;
    var bonds = this.props.getBonds();
    var changes = this.props.getChanges();
    var notAdded = true;
    this.curSelected = null;
    this.tmpBond = null;
    this.curBond.atom2 = atom;
    for ( let bond of bonds ) {
      if (this.isCurBondOverriding(bond)) {
        changes.push({type:"bond", payLoad:bond, action:"added", overwritten:bond.bondType});
        bond.bondType = curBond.bondType;
        notAdded = false;
        break;
      }
    }
    if (notAdded) {
      bonds.add(curBond);
      curBond.atom1.bonds.add(curBond);
      curBond.atom2.bonds.add(curBond);
      changes.push({type:"bond", payLoad:curBond, action:"added", overwritten:null});
    }
    this.curBond = null;
    this.drawCanvas2D();
  }

  // Handles left click for bonds
  handleLeftOnMouseDownBond(x, y) {
    var atom = this.getAtomAtLocation(x, y);
    // If atom exists at this location
    if(atom != null ) {
      // If this is the first of the two atoms to be bonded
      if(this.curBond == null ){
        this.curBond = new Bond(atom, this.props.getCurBondType());
        this.curSelected = atom;
      }
       else {
        this.addNewBond(atom);
      }
    }
  }

  // Handles left click for selections
  handleLeftOnMouseDownSelect(x, y) {
    var atom = this.getAtomAtLocation(x, y);
    // If atom exists at this location
    if (atom != null) {
      this.curSelected = atom;
      this.curMoving = atom;
    } else {
      // TODO: Implement 2D panning
      // this.curSelected = null;
      // this.panning = true;
      // this.prevPanningX = x - this.lastEndPanningX;
      // this.prevPanningY = x - this.lastEndPanningY;
    }
  }

  // Override an atom with a new atom, maintaining the bonds
  overrideAtom(atom, curAtom, atoms, changes) {
    var newAtom = new Atom(atom.location, curAtom.atom.atomicSymbol,
       curAtom.atom.elementName, curAtom.atom.atomicRadius,
       curAtom.atom.atomColor, null, atom.bonds);
    changes.push({type:"atom", payLoad:newAtom, action:"added", overwritten:atom});

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

  // Adds a new atom
  addNewAtom(curAtom, atoms, changes, x, y) {
    var newAtom = new Atom(new Coord(x, y, 0), curAtom.atom.atomicSymbol,
      curAtom.atom.elementName, curAtom.atom.atomicRadius,
      curAtom.atom.atomColor, null, new Set());
    atoms.add(newAtom);
    changes.push({type:"atom", payLoad:newAtom, action:"added", overwritten:null});
  }

  // Handles left click for atoms
  handleLeftOnMouseDownAtom(x, y) {
    var atoms = this.props.getAtoms();
    var curAtom = this.props.getCurAtom();
    var atom = this.getAtomAtLocation(x, y);
    var changes = this.props.getChanges();
    if (atom != null) {
      this.overrideAtom(atom, curAtom, atoms, changes);
    }
    else {
      this.addNewAtom(curAtom, atoms, changes, x, y)
    }

    this.drawCanvas2D();
  }

  handleOnMouseMoveBond(x, y) {
    if(this.curBond != null) {
      this.tmpBond = new Bond(this.curBond.atom1, this.props.getCurBondType());
      this.tmpBond.atom2 = new Atom(new Coord(x,y,0), null, null, null, null, null);
    }
  }

  handleOnMouseMoveSelect(x, y, atom) {
    if(this.curMoving != null) {
      if (atom == null || atom.equals(this.curMoving)) {
        this.curMoving.location.x = x;
        this.curMoving.location.y = y;
      }
    } else if (this.panning) {
      const canvas2d = this.refs.canvas2d;
      const context2d = canvas2d.getContext('2d');
      context2d.setTransform(1, 0, 0, 1,
                       x - this.prevPanningX,
                       y - this.prevPanningY);
    }
  }

  handleOnMouseMove(ev){
    let boundingRect = ev.target.getBoundingClientRect();
    var x = ev.clientX - boundingRect.left; // x coordinate of a mouse pointer
    var y = ev.clientY - boundingRect.top; // y coordinate of a mouse pointer
    var atom = this.getAtomAtLocation(x, y);
    this.curMouseOver = atom;
    switch (this.props.getCurAction()) {
      case "atom":
        break;
      case "bond":
        this.handleOnMouseMoveBond(x, y);
        break;
      case "select":
        this.handleOnMouseMoveSelect(x, y, atom);
        break;
      default:
        console.log("Unsupported Action: " + this.props.getCurAction());
    }
    this.drawCanvas2D();
  }

  handleOnMouseUpSelect(x, y) {
    this.curMoving = null;
    this.panning = false;
    this.lastEndPanningX = x - this.prevPanningX;
    this.lastEndPanningY = x - this.prevPanningY;
  }

  handleOnMouseUpBond(x, y) {
    var atom = this.getAtomAtLocation(x, y);
    if(atom != null && this.curBond != null && atom != this.curSelected) {
      this.addNewBond(atom);
    }
  }

  handleOnMouseUp(ev){
    let boundingRect = ev.target.getBoundingClientRect();
    var x = ev.clientX - boundingRect.left; // x coordinate of a mouse pointer
    var y = ev.clientY - boundingRect.top; // y coordinate of a mouse pointer
    this.curMouseOver = null;
    switch (this.props.getCurAction()) {
      case "atom":
        break;
      case "bond":
        this.handleOnMouseUpBond(x, y);
        break;
      case "select":
        this.handleOnMouseUpSelect(x, y);
        break;
      default:
        console.log("Unsupported Action: " + this.props.getCurAction());
    }
  }

  // On click handler
  handleOnMouseDown(ev) {
    let boundingRect = ev.target.getBoundingClientRect();
    var x = ev.clientX - boundingRect.left; // x coordinate of a mouse pointer
    var y = ev.clientY - boundingRect.top; // y coordinate of a mouse pointer
    if(ev.button === 2) {
      // Right Click
    } else if(ev.button === 0) {
      // Left Click
      this.handleLeftOnMouseDown(x,y);
    } else if (ev.button === 1){
      ev.preventDefault();
      // Middle Click
    }
  }

  render() {
    return (
      <canvas ref="canvas2d"
                  width={this.props.canvasWidth}
                  height={this.props.canvasHeight}
                  style={{border: '1px solid black', marginLeft: '10px'}}
                  onMouseDown={this.handleOnMouseDown.bind(this)}
                  onMouseMove={this.handleOnMouseMove.bind(this)}
                  onMouseUp={this.handleOnMouseUp.bind(this)}/>
    );
  }
}

CanvasComponent2D.propTypes = {
  getBonds: PropTypes.func.isRequired,
  getAtoms: PropTypes.func.isRequired,
  getCurAtom: PropTypes.func.isRequired,
  getCurAction: PropTypes.func.isRequired,
  getCurBondType: PropTypes.func.isRequired,
  getChanges: PropTypes.func.isRequired,
  canvasWidth: PropTypes.number.isRequired,
  canvasHeight: PropTypes.number.isRequired,
};

export default CanvasComponent2D;
