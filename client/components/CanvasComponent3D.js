import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Atom, Coord, RGBA} from '../../models/Atom.js';
import {Bond} from '../../models/Bond.js';
import WebGLUtils from '../../webgl_lib/webgl-utils.js';
import CuonUtils from '../../webgl_lib/cuon-utils.js';
import CuonMatrix from '../../webgl_lib/cuon-matrix.js';

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
  '  gl_FragColor.rgb = clamp(diffuse + ambient + specular, 0.0, 1.0);\n' +
  '  gl_FragColor.a = clamp(v_Color.a, 0.0, 1.0);\n' +
  '}\n';

/**
* 3d canvas class.
*/
class CanvasComponent3D extends Component {
  constructor(props) {
    super(props);
  }

  // Sets up webgl right now.
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

  draw3D() {
    var canvas = this.canvas3d;
    var atoms = this.props.getAtoms();
    var gl = this.gl;
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }
    var SPHERE_DIV = 13;
    var positions = [];
    var sphereNormals = [];
    var indices = [];
    var colors = [];
    var unitcircles = [];
    var unitpolygons = [];
    var vertices = [];
    var s_normals = [];
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
	  if (!u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightDirection || 
        !u_AmbientLight || !u_ViewVector || !u_SpecularLight || !u_N) {
		console.log('Failed to get the storage location');
		return;
	  }
	  // Set the light colors
	  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
  	// Set the light direction (in the world coordinate)
    var lightDirection = new CuonMatrix.Vector3([1.0, -1.0, 1.0]);
    gl.uniform3fv(u_LightDirection, lightDirection.elements);
  	// Set the ambient light
  	gl.uniform3f(u_AmbientLight, 0.0, 0.0, 0.0);
  	// Set the view vector
  	gl.uniform3f(u_ViewVector, 0.0, 0.0, 1.0);
  	//Initialize glossiness
  	gl.uniform1f(u_N, 10.0);
  	//Initialize specluar light
  	gl.uniform3f(u_SpecularLight, 0.7, 0.7, 0.7);
  	//Set initial orthographic view
  	projMatrix = new CuonMatrix.Matrix4();
  	projMatrix.setOrtho(0, 640, 425, 0, -100, 100);
  	viewMatrix = new CuonMatrix.Matrix4();
  	viewMatrix.setIdentity();
  	gl.uniformMatrix4fv(u_MvpMatrix, false, projMatrix.elements);
  	Ntransform.setIdentity();
  	gl.uniformMatrix4fv(u_NormalMatrix, false, Ntransform.elements);
    //Generate unit circles and polygons for bonds
    var radius = 5;
    var deg = 0;
    for(var i = 0; i <= 11; i++){ //First circle
      unitcircles.push(new Coord(0, radius*Math.cos(deg * (Math.PI / 180)),
                                 radius*Math.sin(deg * (Math.PI / 180))));
      deg += 30;
    }
    deg = 0;
    for(var i = 12; i <= 23; i++){ //Second circle
      unitcircles.push(new Coord(1, radius*Math.cos(deg * (Math.PI / 180)),
                                 radius*Math.sin(deg * (Math.PI / 180))));
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
      var r = atom.atomicRadius
      if (r == 0) r = 300;
      var rscale = (10+r/5)
      console.log(r);
      // Generate coordinates
      for (j = 0; j <= SPHERE_DIV; j++) {
        aj = j * Math.PI / SPHERE_DIV;
        sj = Math.sin(aj);
        cj = Math.cos(aj);
        for (i = 0; i <= SPHERE_DIV; i++) {
          ai = i * 2 * Math.PI / SPHERE_DIV;
          si = Math.sin(ai);
          ci = Math.cos(ai);
          positions.push((si * sj*rscale)+atom.location.x);  // X
          positions.push(cj*rscale+atom.location.y);       // Y
          positions.push(ci * sj*rscale);  // Z
          sphereNormals.push(si * sj);  // X
          sphereNormals.push(cj);       // Y
          sphereNormals.push(ci * sj);  // Z
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
          var color = hexToRgb(atom.atomColor.toString(16));
          colors.push(color.r/255);
          colors.push(color.g/255);
          colors.push(color.b/255);
          colors.push(1.0);
        }
      }
    }
    if (!initArrayBuffer(gl, 'a_Position', new Float32Array(positions), gl.FLOAT, 3)) return -1;
    if (!initArrayBuffer(gl, 'a_Normal', new Float32Array(sphereNormals), gl.FLOAT, 3))  return -1;
    if (!initArrayBuffer(gl, 'a_Color', new Float32Array(colors),  gl.FLOAT, 4)) return -1;
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
    //Draw Bonds
    var bonds = this.props.getBonds();
    for( let bond of bonds ){
      drawCylinder(bond.atom1.location.x, bond.atom1.location.y, bond.atom2.location.x, 
                   bond.atom2.location.y, bond.bondType);
    }

    //----------------------------------------------------------------------------------------------
    // Begin Inner Functions
    //----------------------------------------------------------------------------------------------

    //translates unit cylinder coordinates
    function translateCoords(x1, y1, x2, y2){
      var theta = Math.atan2(y2 - y1, x2 - x1);
      var l = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
      for(var i = 0; i < unitcircles.length; i++){
        vertices.push(new Coord(unitcircles[i].x *l* Math.cos(theta) - unitcircles[i].y *
                                  Math.sin(theta) + x1, 
                                unitcircles[i].x *l* Math.sin(theta) + unitcircles[i].y *
                                  Math.cos(theta) + y1, 
                                unitcircles[i].z));
      }
    }

    //returns the cross product of two vectors
    function crossp (vec1, vec2){
	    return new Coord(vec1.y*vec2.z - vec1.z*vec2.y,
                       vec1.z*vec2.x - vec1.x*vec2.z,
                       vec1.x*vec2.y - vec1.y*vec2.x);
    }

    //returns the length of a vector
    function vlength (vec){
	    return Math.sqrt(vec.x*vec.x + vec.y*vec.y + vec.z*vec.z);
    }

    //returns a normalized vector
    function normalize (vec){
    	var l = vlength(vec);
    	vec.x = vec.x/l;
	    vec.y = vec.y/l;
	    vec.z = vec.z/l;
	    return vec;
    }


    function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }


    function drawCylinder(x1, y1, x2, y2, type){
      vertices.length = 0;
      indices.length = 0;
      s_normals.length = 0;
      translateCoords(x1, y1, x2, y2); //vertex array
      for(var j = 0; j < unitpolygons.length; j++){ //index array
        indices.push([unitpolygons[j][0], unitpolygons[j][1], unitpolygons[j][2]]);
      }
      //Generate surface normals
      for(var j = 0; j < 12; j++){
			  var vertex = vertices[j];
			  var vertex1 = vertices[j+1];
			  var vertex2 = vertices[j+12];
			  var vec1 = new Coord(vertex1.x - vertex.x, vertex1.y - vertex.y, vertex1.z - vertex.z);
			  var vec2 = new Coord(vertex2.x - vertex.x, vertex2.y - vertex.y, vertex2.z - vertex.z);
			  var normal = normalize(crossp(vec1, vec2));
			  s_normals.push(normal);
		  }
		  var indices_e = new Uint16Array(indices.length*3);
      var vertices_e = new Float32Array(vertices.length*3);
      //Generate vertex array for buffer
      var j = 0;
      for(var i = 0; i < vertices_e.length; i += 3){
        vertices_e[i] = vertices[j].x + 0.0;
        vertices_e[i+1] = vertices[j].y + 0.0;
        vertices_e[i+2] = vertices[j].z + 0.0;
	      j++;
      }
      j = 0;
      //Generate index array for buffer
      for(var i = 0; i < indices_e.length; i += 3){
        indices_e[i] = indices[j][0];
        indices_e[i+1] = indices[j][1];
        indices_e[i+2] = indices[j][2];
        j++;
      }
      //Generate vertex normals
      var vertex_normals = new Float32Array(vertices.length*3);
		  for (var i = 0; i < indices_e.length; i++){
			  var n = s_normals[Math.floor(i/6)];
			  var pos = indices_e[i];
			  vertex_normals[3*pos] += n.x;
			  vertex_normals[3*pos+1] += n.y;
			  vertex_normals[3*pos+2] += n.z;
		  }
		  var colors = new Float32Array(vertices.length*3)
		  for(var i = 0; i < colors.length; i+=3){
			  colors[i] = 0.5;
			  colors[i+1] = 0.5;
			  colors[i+2] = 0.5;
		  }
		  //Create index buffer
      var indBuffer = gl.createBuffer();
	    var FSIZE = indices_e.BYTES_PER_ELEMENT;
	    //Create buffers
	    if(!initArrayBuffer(gl,'a_Position', vertices_e, gl.FLOAT, 3))return -1;
	    if (!initArrayBuffer(gl, 'a_Color', colors, gl.FLOAT, 3)) return -1;
	    if (!initArrayBuffer(gl, 'a_Normal', vertex_normals, gl.FLOAT, 3)) return -1;
      //Write polygon indices to index buffer
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices_e, gl.STATIC_DRAW);
      //Draw cylinders
     switch (type) {
        case 1://Single bond
          for(var i = 0; i < indices_e.length; i+=3){
            gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, i*FSIZE);
          }
          break;
        case 3://Triple bond
          for(var i = 0; i < indices_e.length; i+=3){
            gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, i*FSIZE);
          }
          var vertices_e = new Float32Array(vertices.length*3);
          //Generate vertex array for buffer
          var j = 0;
          var dx = Math.abs(x2-x1);
          var dy = Math.abs(y2-y1);
          var sg = Math.sign(y2-y1);
          for(var i = 0; i < vertices_e.length; i += 3){
            vertices_e[i] = vertices[j].x + ((-dy)*2.5*radius)/Math.sqrt(dx*dx+dy*dy);
            vertices_e[i+1] = vertices[j].y + (sg*dx*2.5*radius)/Math.sqrt(dx*dx+dy*dy);
            vertices_e[i+2] = vertices[j].z + 0.0;
	          j++;
          }
          if(!initArrayBuffer(gl,'a_Position', vertices_e, gl.FLOAT, 3))return -1;
          for(var i = 0; i < indices_e.length; i+=3){
            gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, i*FSIZE);
          }
          var vertices_e = new Float32Array(vertices.length*3);
          //Generate vertex array for buffer
          var j = 0;
          for(var i = 0; i < vertices_e.length; i += 3){
            vertices_e[i] = vertices[j].x + (dy*2.5*radius)/Math.sqrt(dx*dx+dy*dy);
            vertices_e[i+1] = vertices[j].y + (sg*(-dx)*2.5*radius)/Math.sqrt(dx*dx+dy*dy);;
            vertices_e[i+2] = vertices[j].z + 0.0;
	          j++;
          }
          if(!initArrayBuffer(gl,'a_Position', vertices_e, gl.FLOAT, 3))return -1;
          for(var i = 0; i < indices_e.length; i+=3){
            gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, i*FSIZE);
          }
          break;
        case 2: //Double bond
          var vertices_e = new Float32Array(vertices.length*3);
          //Generate vertex array for buffer
          var j = 0;
          var dx = Math.abs(x2-x1);
          var dy = Math.abs(y2-y1);
          var sg = Math.sign(y2-y1);
          for(var i = 0; i < vertices_e.length; i += 3){
            vertices_e[i] = vertices[j].x + ((-dy)*1.5*radius)/Math.sqrt(dx*dx+dy*dy);
            vertices_e[i+1] = vertices[j].y + (sg*dx*1.5*radius)/Math.sqrt(dx*dx+dy*dy);
            vertices_e[i+2] = vertices[j].z + 0.0;
	          j++;
          }
          if(!initArrayBuffer(gl,'a_Position', vertices_e, gl.FLOAT, 3))return -1;
          for(var i = 0; i < indices_e.length; i+=3){
            gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, i*FSIZE);
          }
          var vertices_e = new Float32Array(vertices.length*3);
          //Generate vertex array for buffer
          var j = 0;
          for(var i = 0; i < vertices_e.length; i += 3){
            vertices_e[i] = vertices[j].x + (dy*1.5*radius)/Math.sqrt(dx*dx+dy*dy);
            vertices_e[i+1] = vertices[j].y + (sg*(-dx)*1.5*radius)/Math.sqrt(dx*dx+dy*dy);
            vertices_e[i+2] = vertices[j].z + 0.0;
	          j++;
          }
          if(!initArrayBuffer(gl,'a_Position', vertices_e, gl.FLOAT, 3))return -1;
          for(var i = 0; i < indices_e.length; i+=3){
            gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, i*FSIZE);
          }
          break;
      }
    }


    function initArrayBuffer(gl, attribute, data, type, num) {
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
  }

  render() {
    return (
      <canvas ref="canvas3d"
              width={this.props.canvasWidth} height={this.props.canvasHeight}
              style={{border: '1px solid black', marginLeft: '10px'}}
              />
    );
  }
}

CanvasComponent3D.propTypes = {
  getBonds: PropTypes.func.isRequired,
  getAtoms: PropTypes.func.isRequired,
  canvasWidth: PropTypes.number.isRequired,
  canvasHeight: PropTypes.number.isRequired,
};

export default CanvasComponent3D;
