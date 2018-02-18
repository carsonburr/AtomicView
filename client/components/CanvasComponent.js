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
    this.atoms = []; 
    this.bonds = [];
    this.curAction = {action : "atom"}; // Can currently only be atom or bond
    // Current atom to be drawn.
    this.curAtom = {atom : new Atom(new Coord(0,0,0), "C", "carbon", 70, null)};
    this.curBond = null;
    this.curBondType = 1;
    this.curSelected = null;
    this.curMoving = null;
    this.curMouseOver = null;

    //initial/default state of canvas size
    this.state = {
      width:640,
      height: 425
    }
  };


  setCurAtom = (symbol, name, atomicRadius) => {
    this.curAtom.atom = new Atom(new Coord(0,0,0), symbol, name, atomicRadius,null);
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
    for( var i = 0; i < bonds.length; i++){
      this.drawBond2D(context2d, bonds[i]);
    }
    if (this.tmpBond != null) {
      this.drawBond2D(context2d, this.tmpBond);
    }
  }

  // Draws all the atoms.
  drawAtoms2D(context2d) {
    var atoms = this.atoms;
    for (var i = 0; i < atoms.length; i++) {
        var atom = atoms[i];
        if (this.curSelected == i || 
           (this.curMouseOver == i && this.curMoving == null && this.curAction.action == "select") || 
           (this.curMouseOver == i && this.curAction.action == "bond")) {
          context2d.fillStyle = "lightgreen";
        } else if (this.curAction.action == "atom" && this.curMouseOver == i) {
          context2d.fillStyle = "#ff9933";
        } else if (this.curMouseOver == i) {
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

  getIndexOfAtomAtLocation(x, y) {
    var atoms = this.atoms;
    // TODO: Might want to use a hash map for this.
    for (var i = 0; i < atoms.length; i++) {
        if(i == this.curMoving) {
          continue;
        }
        var atom = atoms[i];
        if( (Math.abs(atom.location.x - x) < 30) && (Math.abs(atom.location.y - y) < 30) ) {
          return i;
        }
    }
    return -1;
  }

  addNewBond(index) {
    var bonds = this.bonds;
    var notAdded = true;
    this.curSelected = null;
    this.tmpBond = null;
    this.curBond.atom2 = this.atoms[index];
    this.curBond.atom1.bonds.push(this.curBond);
    this.curBond.atom2.bonds.push(this.curBond);
    for (var i = 0; i<bonds.length; i++) {
      var atom1 = bonds[i].atom1;
      var atom2 = bonds[i].atom2;
      var curAtom1 = this.curBond.atom1;
      var curAtom2 = this.curBond.atom2;
      if ( (atom1 == curAtom1 && 
            atom2 == curAtom2) ||
           (atom2 == curAtom1 &&
            atom1 == curAtom2) ) {
        bonds[i].bondType = this.curBond.bondType;
        notAdded = false;
        break;
      }
    }
    if(notAdded){
      this.bonds.push(this.curBond);
    }
    this.curBond = null;
    this.drawCanvas2D();

  }

  // Handles left click for bonds
  handleLeftOnMouseDown2dBond(x, y) {
    var index = this.getIndexOfAtomAtLocation(x, y);
    var atoms = this.atoms;
    if(index != -1 ) {
      if(this.curBond == null ){
        this.curBond = new Bond(atoms[index], this.curBondType);
        this.curSelected = index;
      } else {
        this.addNewBond(index);
      }
    }
  }

  // Handles left click for selections
  handleLeftOnMouseDown2DSelect(x, y) {
    var index = this.getIndexOfAtomAtLocation(x, y);
    if (index != -1) {
      this.curSelected = index;
      this.curMoving = index;
    } else {
      this.curSelected = null;
    }
  }

  // Handles left click for atoms
  handleLeftOnMouseDown2DAtom(x, y) {
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
    }
  }

  handleOnMouseMoveSelect(x, y, index) {
    if(this.curMoving != null) {
      if (index == -1 || index == this.curMoving) {
        this.atoms[this.curMoving].location.x = x;
        this.atoms[this.curMoving].location.y = y;
      }
    }
  }

  handleOnMouseMove(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var index = this.getIndexOfAtomAtLocation(x, y);
    this.curMouseOver = index;
    switch (this.curAction.action) {
      case "atom":
        break;
      case "bond":
        this.handleOnMouseMoveBond(x, y);
        break;
      case "select":
        this.handleOnMouseMoveSelect(x, y, index);
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
    var index = this.getIndexOfAtomAtLocation(x, y);
    if(index != -1 && this.curBond != null && index != this.curSelected) {
      this.addNewBond(index);
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
        </div>
      </div>
    );
  }
}



export default CanvasComponent;
