//'' used to delineate gap in table
var atomicSymbols = [['H','','','','','','','','','','','','','','','','','He'],
                     ['Li', 'Be','','','','','','','','','','', 'B', 'C', 'N', 'O', 'F', 'Ne'],
                     ['Na', 'Mg','','','','','','','','','','', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'],
                     ['K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'],
                     ['Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe'],
                     ['Cs', 'Ba', 'La', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn'],
                     ['Fr', 'Ra', 'Ac', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'],
                     ['','','','Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu',''],
                     ['','','','Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr','']];

//arrays to delineate various categories of elements
//could turn to integer operations based on atomic number for speed
var alkaliMetals = ['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr'];
var alkalineEarthMetals = ['Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra'];
var otherNonmetals = ['H', 'C', 'N', 'O', 'F', 'P', 'S', 'Cl', 'Se', 'Br', 'I'];
var metalloids = ['B', 'Si', 'Ge', 'As', 'Sb', 'Te', 'At'];
var nobleGasses = ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn'];
var postTransitionMetals = ['Al', 'Ga', 'In', 'Sn', 'Tl', 'Pb', 'Bi', 'Po', 'Fl'];
var transitionMetals = ['Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu',
                        'Zn', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd',
                        'Ag', 'Cd', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt',
                        'Au', 'Hg', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Cn'];
var lanthanoids = ['La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy',
                   'Ho', 'Er', 'Tm', 'Yb', 'Lu'];
var actinoids = ['Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 
                 'Es', 'Fm', 'Md', 'No', 'Lr'];

//array for atomic radii in pico meters, some do not have data, 0
//null delineates gap in table 0 is radius size unknown
var atomicRadii = [[53,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,31],
                     [167, 112,null,null,null,null,null,null,null,null,null,null, 87, 67, 56, 48, 42, 38],
                     [190, 145,null,null,null,null,null,null,null,null,null,null,118, 111,98, 88, 79, 71],
                     [243, 194, 184, 176, 171, 166, 161, 156, 152, 149, 145, 142, 136, 125, 114, 103, 94, 88],
                     [265, 219, 212, 206, 198, 190, 183, 178, 173, 169, 165, 161, 156, 145, 133, 123, 115, 108],
                     [298, 253, 0, 208, 200, 193, 188, 185, 180, 177, 174, 171, 156, 154, 143, 135, 127, 120],
                     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                     [null,null,null,0, 247, 206, 205, 238, 231, 233, 225, 228, 226, 226, 222, 222, 217,null],
                     [null,null,null,0,0,0,0,0,0,0,0,0,0,0,0,0,0,null]];

 






export function Coord(x,y,z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

function buildTable() {
  //periodic table 2d array
  let rows = [];

  //Atomic number currently screwed up due to weird thing
  var atomicNumber = 1;
  for(var row=0; row<atomicSymbols.length; row++) {
    let cell = [];
    for(var col=0; col<atomicSymbols[row].length; col++){

      //create new atom
      var atom = {}//new Object();
      atom.symbol = atomicSymbols[row][col];
      atom.radius = atomicRadii[row][col];
      if(atom.symbol !== '') {
        atom.number = atomicNumber;
        atomicNumber++;
      } else {
        atom.number = '';
      }
      //TODO add atomic weight, atomic category
      if(atom.number === '') {
        atom.color = "#FFFFFF";
      } else if(nobleGasses.includes(atom.symbol)) {
        atom.color = "#81BEF7"
      } else if(otherNonmetals.includes(atom.symbol)) {
        atom.color = "#22FF22"
      } else if (metalloids.includes(atom.symbol)) {
        atom.color = "#77DD88"
      } else if (postTransitionMetals.includes(atom.symbol)) {
        atom.color = "#99DDCC"
      } else if (transitionMetals.includes(atom.symbol)) {
        atom.color = "#DDBBBB"
      } else if (lanthanoids.includes(atom.symbol)) { 
        atom.color = "#FFBB99"
      } else if (actinoids.includes(atom.symbol)) {
        atom.color = "#EEBBDD"
      } else if(alkaliMetals.includes(atom.symbol)) {
        atom.color = "#FFCC33"
      } else if(alkalineEarthMetals.includes(atom.symbol)) {
        atom.color = "#FFFF44"
      } else {
        atom.color = "#FFFFFF";
      }

      //define the radius
      //if(atom.symbol = '') {
      //    atom.radius = ''
      //} else {
       //   atom.radius = radii[0]
      //}

      cell.push(atom);
    }
    rows.push(cell);
  }
  //let table = rows;
  return(rows);
}

export function getTable() {
  let t = buildTable();
  return t;
}

export function RGBA(r,g,b,a) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
}

export function Atom(location, atomicSymbol, elementName, atomicRadius, molecule){
  this.location = location;
  this.location3D = null;
  this.atomicSymbol = atomicSymbol;
  this.elementName = elementName;
  this.atomicRadius = atomicRadius;
  this.isSelected = false;
  this.molecule = molecule;
  this.bonds = [];
}
