import React, { Component } from 'react';
import {Atom, Coord, RGBA} from './Atom.js';
import WebGLUtils from './lib/webgl-utils.js';
import PeriodicTablePopup from './PeriodicTablePopup';

/**
* Class with a 2d and a 3d canvas.
*/
class CanvasComponent extends Component {

  constructor() {
    super();
    this.atoms = []; 
    this.bonds = [];
    this.curDrawing = "atom"; // Can currently only be atom or bond
    // Current atom to be drawn.
    this.curAtom = {atom : new Atom(new Coord( 0,0,0), "C", "carbon", 70, null)};
  };

  setCurAtom = (symbol, name, atomicRadius) => {
    this.curAtom.atom = new Atom(new Coord(0,0,0), symbol, name, atomicRadius,null);
  };  

  // Clears the 2d Canvas and calls drawAtoms2D
  drawScene2D(context2d) {
    context2d.clearRect(0, 0, context2d.canvas.width, context2d.canvas.height);
    this.drawAtoms2D(context2d);
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

  // Handles left click for 2d canvas
  handleLeftClick2D(x, y) {
    var atoms = this.atoms;
    var curAtom = this.curAtom;
    // TODO: Check if there is an atom at location x,y already; might want to use a hash
    // map for this.
    // for (var i = 0; i < atoms.length; i++) {
    //     var atom = atoms[i];
    // }
    
    atoms.push(new Atom(new Coord(x, y, 0), curAtom.atom.atomicSymbol,
      curAtom.atom.elementName, curAtom.atom.atomicRadius, null));
    // TODO: Possibly use requestAnimitionFrame. Might not be needed though as we're
    // only drawing 2d stuff.
    // requestAnimationFrame(this.drawCanvas);
    this.drawCanvas2D();
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
                  onClick={this.handleClick2D.bind(this)} />
          <canvas ref="canvas3d"
                  width={640} height={425} style={{border: '1px solid black'}}
                   />
        </div>
        <div>
          <PeriodicTablePopup setCurAtom={this.setCurAtom}/>
        </div>
      </div>
    );
  }
}



export default CanvasComponent;
