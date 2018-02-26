import React, { Component } from 'react';
import {Atom, Coord, RGBA} from '../../models/Atom.js';
import {Bond} from '../../models/Bond.js';
import WebGLUtils from '../../webgl_lib/webgl-utils.js';
import CuonUtils from '../../webgl_lib/cuon-utils.js';
import CuonMatrix from '../../webgl_lib/cuon-matrix.js';
import PeriodicTablePopup from './PeriodicTablePopup';
import BondButton from './BondButton';
import SelectButton from './SelectButton';
import Header from './Header';

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
    this.canvas3d = null;
    this.gl = null;
    // Keeps track of changes for use in reversions
    this.changes = [];

    //initial/default state of canvas size
    this.state = {
      width:640,
      height: 425
    }

    this.revertChangein2D = this.revertChangein2D.bind(this);
    this.draw3D = this.draw3D.bind(this);
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
    this.canvas3d = this.refs.canvas3d;
    this.gl = WebGLUtils.setupWebGL(this.canvas3d,{preserveDrawingBuffer: true});
    // Initialize shaders
    if (!CuonUtils.initShaders(this.gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
    }
    // Specify the color for clearing <canvas>
    this.gl.clearColor(255.0, 255.0, 255.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST | this.gl.DEPTH_BUFFER_BIT);
    // Clear <canvas>
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );

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


  initArrayBuffer(gl, attribute, data, type, num) {
     // Create a buffer object
     var buffer = gl.createBuffer();
     if (!buffer) {
       console.log('Failed to create the buffer object');
       return false;
     }
     // Write date into the buffer object
     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
     gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
     // Assign the buffer object to the attribute variable
     var a_attribute = gl.getAttribLocation(gl.program, attribute);
     if (a_attribute < 0) {
       console.log('Failed to get the storage location of ' + attribute);
       return false;
     }
     gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
     // Enable the assignment of the buffer object to the attribute variable
     gl.enableVertexAttribArray(a_attribute);
     gl.bindBuffer(gl.ARRAY_BUFFER, null);
     return true;
  }   

  
  draw3D() {
    var canvas = this.canvas3d;
    var atoms = this.atoms;
    var gl = this.gl;
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }
    var SPHERE_DIV = 13;
    var positions = [];
    var indices = [];
    var colors = [];
    var unitcircles = [];
    var unitpolygons = [];
    var viewMatrix; //The view matrix for projection view
    var projMatrix; //The projection matrix
    var Ntransform = new CuonMatrix.Matrix4();
    // Get the storage locations of uniform variables
	  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
	  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    var u_ViewVector = gl.getUniformLocation(gl.program, 'u_ViewVector');
  	var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    var	u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
	  var u_SpecularLight = gl.getUniformLocation(gl.program, 'u_SpecularLight');
	  var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
	  var u_N = gl.getUniformLocation(gl.program, 'u_N');
	  if (!u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightDirection || !u_AmbientLight || !u_ViewVector || !u_SpecularLight || !u_N) { 
		console.log('Failed to get the storage location');
		return;
	  }
	  // Set the light colors
	  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
  	// Set the light direction (in the world coordinate)
    var lightDirection = new CuonMatrix.Vector3([1.0, 0.8, -0.5]);
    gl.uniform3fv(u_LightDirection, lightDirection.elements);
  	// Set the ambient light
  	gl.uniform3f(u_AmbientLight, 0.1, 0.1, 0.1);
  	// Set the view vector
  	gl.uniform3f(u_ViewVector, 0.0, 0.0, 1.0);
  	//Initialize glossiness
  	gl.uniform1f(u_N, 70.0);
  	//Initialize specluar light
  	gl.uniform3f(u_SpecularLight, 1.0, 1.0, 1.0);
  	//Set initial orthographic view
  	projMatrix = new CuonMatrix.Matrix4();
  	projMatrix.setOrtho(0, 640, 425, 0, -100, 100);
  	viewMatrix = new CuonMatrix.Matrix4();
  	viewMatrix.setIdentity();
  	gl.uniformMatrix4fv(u_MvpMatrix, false, projMatrix.elements);
  	Ntransform.setIdentity();
  	gl.uniformMatrix4fv(u_NormalMatrix, false, Ntransform.elements);
    //Generate unit circles and polygons for bonds
    var radius = 20;
    var deg = 0;
    for(var i = 0; i <= 11; i++){ //First circle
      unitcircles.push(new Coord(0,radius*Math.cos(deg * (Math.PI / 180)),radius*Math.sin(deg * (Math.PI / 180))));
      deg += 30;
    }
    deg = 0;
    for(var i = 12; i <= 23; i++){ //Second circle
      unitcircles.push(new Coord(1,radius*Math.cos(deg * (Math.PI / 180)),radius*Math.sin(deg * (Math.PI / 180))));
      deg += 30;
    }
    //Generate polygon array
    for(var i = 0; i <= 10; i++){
      unitpolygons.push([i, i+1, i+13]);
		  unitpolygons.push([i, i+13, i+12]);
    }
    unitpolygons.push([11, 0, 12]);
	  unitpolygons.push([11, 12, 23]);
    // Register function (event handler) to be called on a mouse press
    //canvas.onmousedown = function(ev){ click(ev, gl, canvas, a_Position); };
    // Register function (event handler) to be called on a mouse move
    //canvas.onmousemove = function(ev){ move(ev, gl, canvas, a_Position); };
    // Clearing canvas
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    // Generate spheres for each atom
    var n = 0;
    for (let atom of atoms) {
      var i, ai, si, ci;
      var j, aj, sj, cj;
      var p1, p2;
      // Generate coordinates
      for (j = 0; j <= SPHERE_DIV; j++) {
        aj = j * Math.PI / SPHERE_DIV;
        sj = Math.sin(aj);
        cj = Math.cos(aj);
        for (i = 0; i <= SPHERE_DIV; i++) {
          ai = i * 2 * Math.PI / SPHERE_DIV;
          si = Math.sin(ai);
          ci = Math.cos(ai);
          positions.push((si * sj*30)+atom.location.x);  // X
          positions.push(cj*30+atom.location.y);       // Y
          positions.push(ci * sj*30);  // Z
        }
      }
      // Generate indices
      for (j = 0; j < SPHERE_DIV; j++) {
        for (i = 0; i < SPHERE_DIV; i++) {
          p1 = j * (SPHERE_DIV+1) + i;
          p2 = p1 + (SPHERE_DIV+1);
          indices.push(p1+n);
          indices.push(p2+n);
          indices.push(p1 + 1 + n);
          indices.push(p1 + 1 + n);
          indices.push(p2 + n);
          indices.push(p2 + 1 + n);
        }
      }
      n = positions.length/3
      // Generate colors
      for (j = 0; j <= SPHERE_DIV; j++) {
        for (i = 0; i <= SPHERE_DIV; i++) {
          colors.push(1.0);
          colors.push(0.0);
          colors.push(0.0);
          colors.push(1.0);
        }
      }
    }
    if (!this.initArrayBuffer(gl, 'a_Position', new Float32Array(positions), gl.FLOAT, 3)) return -1;
    if (!this.initArrayBuffer(gl, 'a_Normal', new Float32Array(positions), gl.FLOAT, 3))  return -1;
    if (!this.initArrayBuffer(gl, 'a_Color', new Float32Array(colors),  gl.FLOAT, 4)) return -1;  
    // Unbind the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // Write the indices to the buffer object
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    //Draw Spheres
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    
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
    this.updateCanvas();
    this.drawCanvas2D();
    this.draw3D();
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
        <Header />
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
          <button onClick={this.revertChangein2D}>Revert</button>
          <button onClick={this.draw3D}>Draw</button>
        </div>
      </div>
    );
  }
}

 // Vertex shader program
var VSHADER_SOURCE =
  'attribute vec3 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec3 a_Normal;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'varying vec4 v_Normal;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * vec4(a_Position, 1.0);\n' +
  '  v_Normal = u_NormalMatrix * vec4(a_Normal, 1.0);\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform vec3 u_ViewVector;\n' +
  'uniform vec3 u_SpecularLight;\n' +
  'uniform vec3 u_LightColor;\n' +
  'uniform vec3 u_LightDirection;\n' +
  'uniform vec3 u_AmbientLight;\n' +
  'uniform float u_N;\n' +
  'varying vec4 v_Color;\n' +
  'varying vec4 v_Normal;\n' +
  'void main() {\n' +
  '  vec3 normal = normalize(v_Normal.xyz);\n' +
  '  vec3 diffuse = vec3(0.0, 0.0, 0.0);\n' +
  '  vec3 specular = vec3(0.0, 0.0, 0.0);\n' +
  '  float nDotL = max(dot(normalize(u_LightDirection), normal), 0.0);\n' +
  '  diffuse = u_LightColor * v_Color.rgb * nDotL;\n' +
  '  vec3 halfway = normalize(u_LightDirection + u_ViewVector);\n' +
  '  specular = u_SpecularLight * u_LightColor * pow(max(dot(normal, halfway), 0.0), u_N);\n' + 
  '  vec3 ambient = u_AmbientLight * u_LightColor;\n' +
  '  gl_FragColor.rgb = clamp(diffuse + ambient + specular, 0.0, 0.8);\n' +
  '  gl_FragColor.a = clamp(v_Color.a, 0.0, 1.0);\n' +
  '}\n';



export default CanvasComponent;
