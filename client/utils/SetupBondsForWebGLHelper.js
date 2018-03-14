
import {Coord} from '../../models/Atom.js';

//----------------------------------------------------------------------------------------------
// Helper functions for setting up bonds.
//----------------------------------------------------------------------------------------------
var SetupBondsForWebGLHelper = function(){
  //returns the cross product of two vectors
  function crossProduct (vec1, vec2){
    return new Coord(vec1.y*vec2.z - vec1.z*vec2.y,
                     vec1.z*vec2.x - vec1.x*vec2.z,
                     vec1.x*vec2.y - vec1.y*vec2.x);
  }

  //returns the length of a vector
  function getVectorLength (vec){
    return Math.sqrt(vec.x*vec.x + vec.y*vec.y + vec.z*vec.z);
  }

  //returns a normalized vector
  function normalize (vec){
    var l = getVectorLength(vec);
    vec.x = vec.x/l;
    vec.y = vec.y/l;
    vec.z = vec.z/l;
    return vec;
  }

  //translates unit cylinder coordinates
  function translateCoordsAndStoreInVertexArray(vertices, unitCircles, x1, y1, x2, y2){
    var theta = Math.atan2(y2 - y1, x2 - x1);
    var l = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
    for(var i = 0; i < unitCircles.length; i++){
      vertices.push(new Coord(unitCircles[i].x *l* Math.cos(theta) - unitCircles[i].y *
                                Math.sin(theta) + x1, 
                              unitCircles[i].x *l* Math.sin(theta) + unitCircles[i].y *
                                Math.cos(theta) + y1, 
                              unitCircles[i].z));
    }
  }

  function generateColors(colors){
    for(var i = 0; i < colors.length; i+=3){
      colors[i] = 0.5;
      colors[i+1] = 0.5;
      colors[i+2] = 0.5;
    }     
  }

  function generateSurfaceNormals(s_normals, vertices) {
    for(var j = 0; j < 12; j++){
      var vertex = vertices[j];
      var vertex1 = vertices[j+1];
      var vertex2 = vertices[j+12];
      var vec1 = new Coord(vertex1.x - vertex.x, vertex1.y - vertex.y, vertex1.z - vertex.z);
      var vec2 = new Coord(vertex2.x - vertex.x, vertex2.y - vertex.y, vertex2.z - vertex.z);
      var normal = normalize(crossProduct(vec1, vec2));
      s_normals.push(normal);
    }

  }

  function generateIndices(indices, bondIndices, indicesLength) {
    var j = 0;
    var offset = 0;
    //Generate index array for buffer
    for(var i = 0; i < indicesLength; i += 3){
      indices[i] = bondIndices[j][0] + offset;
      indices[i+1] = bondIndices[j][1] + offset;
      indices[i+2] = bondIndices[j][2] + offset;
      j++;
      if (j==bondIndices.length) {
        j = 0;
        offset += bondIndices.length;
      }
    }

  }

  function generateVertexNormals(vertexNormals, indices, s_normals, bondIndices) {
    var j = 0;
    for (var i = 0; i < indices.length; i++){
      var n = s_normals[Math.floor(j/6)];
      j++;
      if(j==bondIndices.length) {
        j = 0;
      }
      var pos = indices[i];
      vertexNormals[3*pos] += n.x;
      vertexNormals[3*pos+1] += n.y;
      vertexNormals[3*pos+2] += n.z;
    }
  }

  function generateVertexArray(vertices_e, vertices, type, verticesLength, x1, y1, x2, y2, radius) {
    if (type == 1 || type == 3) {
      createMiddleBondVertices(vertices_e, vertices);
      if(type == 3) {
        createSideTripleBondVertices(vertices_e, vertices, verticesLength, x1, y1, x2, y2, radius);
      }
    } else {
      createDoubleBondVertices(vertices_e, vertices, verticesLength, x1, y1, x2, y2, radius);
    }
  }

  // The middle bond (only used for single and triple bonds)
  function createMiddleBondVertices(vertices_e, vertices) {
      var j = 0;
      for(var i = 0; i < vertices_e.length; i += 3){
        vertices_e[i] = vertices[j].x + 0.0;
        vertices_e[i+1] = vertices[j].y + 0.0;
        vertices_e[i+2] = vertices[j].z + 0.0;
        j++;
        if (j==vertices.length) {
          j = 0;
        }
      }
  }

  function createDoubleBondVertices(vertices_e, vertices, verticesLength, x1, y1, x2, y2, radius) {
    var j = 0;
    var dx = Math.abs(x2-x1);
    var dy = Math.abs(y2-y1);
    var sg = Math.sign(y2-y1);
    for(var i = 0; i < verticesLength/2; i += 3){
      vertices_e[i] = vertices[j].x + ((-dy)*1.5*radius)/Math.sqrt(dx*dx+dy*dy);
      vertices_e[i+1] = vertices[j].y + (sg*dx*1.5*radius)/Math.sqrt(dx*dx+dy*dy);
      vertices_e[i+2] = vertices[j].z + 0.0;
      j++;
    }
    j = 0;
    for(var i = vertices_e.length/2; i < verticesLength; i += 3){
      vertices_e[i] = vertices[j].x + (dy*1.5*radius)/Math.sqrt(dx*dx+dy*dy);
      vertices_e[i+1] = vertices[j].y + (sg*(-dx)*1.5*radius)/Math.sqrt(dx*dx+dy*dy);
      vertices_e[i+2] = vertices[j].z + 0.0;
      j++;
      if (j==vertices.length) {
        j = 0;
      }
    }      
  }

  function createSideTripleBondVertices(vertices_e, vertices, verticesLength, x1, y1, x2, y2, radius) {
    var j = 0;
    var dx = Math.abs(x2-x1);
    var dy = Math.abs(y2-y1);
    var sg = Math.sign(y2-y1);
    for(var i = verticesLength/3; i < 2*verticesLength/3; i += 3){
      vertices_e[i] = vertices[j].x + ((-dy)*2.5*radius)/Math.sqrt(dx*dx+dy*dy);
      vertices_e[i+1] = vertices[j].y + (sg*dx*2.5*radius)/Math.sqrt(dx*dx+dy*dy);
      vertices_e[i+2] = vertices[j].z + 0.0;
      j++;
      if (j==vertices.length) {
        j = 0;
      }            
    }
    var j = 0;
    for(var i = 2*verticesLength/3; i < verticesLength; i += 3){
      vertices_e[i] = vertices[j].x + (dy*2.5*radius)/Math.sqrt(dx*dx+dy*dy);
      vertices_e[i+1] = vertices[j].y + (sg*(-dx)*2.5*radius)/Math.sqrt(dx*dx+dy*dy);;
      vertices_e[i+2] = vertices[j].z + 0.0;
      j++;
      if (j==vertices.length) {
        j = 0;
      }
    }
  }
  
  return {
    translateCoordsAndStoreInVertexArray: translateCoordsAndStoreInVertexArray,
    generateSurfaceNormals :generateSurfaceNormals,
    generateIndices:generateIndices,
    generateVertexNormals: generateVertexNormals,
    generateColors: generateColors,
    generateVertexArray: generateVertexArray,
  };
}();

export default SetupBondsForWebGLHelper;