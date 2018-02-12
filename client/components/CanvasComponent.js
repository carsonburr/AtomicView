import React, { Component } from 'react';
import {Atom, Coord, RGBA} from '../../models/Atom.js';
import {Bond} from '../../models/Bond.js';
import WebGLUtils from '../../webgl_lib/webgl-utils.js';
import PeriodicTablePopup from './PeriodicTablePopup';
import BondButton from './BondButton';

/**
* Class with a 2d and a 3d canvas.
*/
class CanvasComponent extends Component {

  constructor() {
    super();
    this.atoms = []; 
    this.bonds = [];
    this.curAction = {action : "atom"}; // Can currently only be atom or bond
    // Current atom to be drawn.
    this.curAtom = {atom : new Atom(new Coord(0,0,0), "C", "carbon", 70, null)};
    this.curBond = null;
    this.curBondType = 1;
  };

  setCurAtom = (symbol, name, atomicRadius) => {
    this.curAtom.atom = new Atom(new Coord(0,0,0), symbol, name, atomicRadius,null);
  };

  switchCurAction = (action) => {
    switch (action) {
      case "select": this.curSelected = null; break;
      case "bond": this.curBond = null; break;
      default: ;
    }
    this.curAction.action = action;
  };

  // Clears the 2d Canvas and calls drawAtoms2D
  drawScene2D(context2d) {
    context2d.clearRect(0, 0, context2d.canvas.width, context2d.canvas.height);
    this.drawAtoms2D(context2d);
    this.drawBonds2D(context2d);
  }

  drawBonds2D(context2d) {
    var bonds = this.bonds;
    for( var i = 0; i < bonds.length; i++){
      var bond = bonds[i];
      context2d.beginPath();
      context2d.moveTo(bond.atom1.location.x, bond.atom1.location.y);
      context2d.lineTo(bond.atom2.location.x, bond.atom2.location.y);
      context2d.stroke();
    }
    if (this.tmpBond != null) {
      var bond = this.tmpBond;
      context2d.beginPath();
      context2d.moveTo(bond.atom1.location.x, bond.atom1.location.y);
      context2d.lineTo(bond.atom2.location.x, bond.atom2.location.y);
      context2d.stroke();
    }
  }

  // Draws all the atoms.
  drawAtoms2D(context2d) {
    var atoms = this.atoms;
    for (var i = 0; i < atoms.length; i++) {
        var atom = atoms[i];
        context2d.font = 'normal bold 20px sans-serif'; 
        context2d.textAlign = 'center';
        context2d.textBaseline = 'middle';
        context2d.fillText(atom.atomicSymbol, atom.location.x, atom.location.y);

    }
  }

  handleLeftClick2D(x, y) {
    switch (this.curAction.action) {
      case "atom":
        this.handleLeftClick2DAtom(x,y);
        break;
      case "bond":
        this.handleLeftClick2dBond(x,y);
        break;
      case "select":
        this.handleLeftClick2DSelect(x,y);
        break;
      default:
        console.log("Unsupported Action: " + this.curAction.action);
    }
    console.log("Action: " + this.curAction.action);
  }

  getIndexOfAtomAtLocation(x, y) {
    var atoms = this.atoms;
    // TODO: Might want to use a hash map for this.
    for (var i = 0; i < atoms.length; i++) {
        var atom = atoms[i];
        if( (Math.abs(atom.location.x - x) < 30) && (Math.abs(atom.location.y - y) < 30) ) {
          return i;
        }
    }
    return -1;
  }

  // Handles left click for bonds
  handleLeftClick2dBond(x, y) {
    var index = this.getIndexOfAtomAtLocation(x, y);
    var atoms = this.atoms;
    if(index != -1 ) {
      if(this.curBond == null ){
        this.curBond = new Bond(atoms[index], this.curBondType);
      } else {
        this.tmpBond = null;
        this.curBond.atom2 = atoms[index];
        this.curBond.atom1.bonds.push(this.curBond);
        this.curBond.atom2.bonds.push(this.curBond);
        this.bonds.push(this.curBond);
        this.curBond = null;
        this.drawCanvas2D();
      }
    }
  }

  // Handles left click for selections
  handleLeftClick2DSelect(x, y) {

  }

  // Handles left click for atoms
  handleLeftClick2DAtom(x, y) {
    var atoms = this.atoms;
    var curAtom = this.curAtom;
    var index = this.getIndexOfAtomAtLocation(x, y);
    if (index !== -1) {
          atoms[index] = new Atom(atoms[index].location, curAtom.atom.atomicSymbol,
            curAtom.atom.elementName, curAtom.atom.atomicRadius, null);
    } else {
      atoms.push(new Atom(new Coord(x, y, 0), curAtom.atom.atomicSymbol,
        curAtom.atom.elementName, curAtom.atom.atomicRadius, null));
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
      this.drawCanvas2D();
    }
  }

  handleOnMouseMove(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    switch (this.curAction.action) {
      case "atom":
        break;
      case "bond":
        this.handleOnMouseMoveBond(x,y);
        break;
      case "select":
        break;
      default:
        console.log("Unsupported Action: " + this.curAction.action);
    }
  }

  // Calls drawScene2D() with the context as a parameter
  drawCanvas2D(){ 
    const canvas2d = this.refs.canvas2d;
    const context2d = canvas2d.getContext('2d');
    this.drawScene2D(context2d);

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
  handleClick2D(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect() ;

    x = (x - rect.left);
    y = (y - rect.top);
    if(ev.button === 2) {
      // Right Click
    } else if(ev.button === 0) {
      // Left Click
      this.handleLeftClick2D(x,y);
    } else if (ev.button === 1){
      ev.preventDefault();
      // Middle Click
    }
  }

  // TODO: Need to change the size of the canvases dynamically to fit half the screen.
  render() {
    return (
      <div className="CanvasComponent">
        <div>
          <canvas ref="canvas2d"
                  width={640} height={425} style={{border: '1px solid black'}}
                  onClick={this.handleClick2D.bind(this)} 
                  onMouseMove={this.handleOnMouseMove.bind(this)}/>
          <canvas ref="canvas3d"
                  width={640} height={425} style={{border: '1px solid black'}}
                   />
        </div>
        <div>
          <BondButton switchCurAction={this.switchCurAction}/>
          <PeriodicTablePopup setCurAtom={this.setCurAtom}
                              switchCurAction={this.switchCurAction}/>
        </div>
      </div>
    );
  }
}



export default CanvasComponent;
