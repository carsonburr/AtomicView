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

var atomicNumber = [[1,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,2],
                     [3, 4,null,null,null,null,null,null,null,null,null,null, 5, 6, 7, 8, 9, 10],
                     [11, 12,null,null,null,null,null,null,null,null,null,null,13, 14,15, 16, 17, 18],
                     [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
                     [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
                     [55, 56, 57, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86],
                     [87, 88, 89, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
                     [null,null,null, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70,71,null],
                     [null,null,null,90,91,92,93,94,95,96,97,98,99,100,101,102,103,null]];



//array for the atom color in the 3d display 
var atomColor = [[0xFFFFFF, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0xD9FFFF],
                     [0xCC80FF, 0xC2FF00, null, null, null, null, null, null, null, null, null, null, 0xFFB5B5, 0x909090, 0x3050F8, 0xFF0D0D, 0x90E050, 0xB3E3F5],
                     [0xAB5CF2, 0x8AFF00, null, null, null, null, null, null, null, null, null, null, 0xBFA6A6, 0xF0C8A0, 0xFF8000, 0xFFFF30, 0x1FF01F, 0x80D1E3],
                     [0x8F40D4, 0x3DFF00, 0xE6E6E6, 0xBFC2C7, 0xA6A6AB, 0x8A99C7, 0x9C7AC7, 0xE06633, 0xF090A0, 0x50D050, 0xC88033, 0x7D80B0, 0xC28F8F, 0x668F8F, 0xBD80E3, 0xFFA100, 0xA62929, 0x5CB8D1],
                     [0x702EB0, 0x00FF00, 0x94FFFF, 0x94E0E0, 0x73C2C9, 0x54B5B5, 0x3B9E9E, 0x248F8F, 0x0A7D8C, 0x006985, 0xC0C0C0, 0xFFD98F, 0xA67573, 0x668080, 0x9E63B5, 0xD47A00, 0x940094, 0x429EB0],
                     [0x57178F, 0x00C900, 0x70D4FF, 0x4DC2FF, 0x4DA6FF, 0x2194D6, 0x267DAB, 0x266696, 0x175487, 0xD0D0E0, 0xFFD123, 0xB8B8D0, 0xA6544D, 0x575961, 0x9E4FB5, 0xAB5C00, 0x754F45, 0x428296],
                     [0x42066, 0x007D00, 0x70ABFA, 0xCC0059, 0xD1004F, 0xD90045, 0xE00038, 0xE6002E, 0xEB0026, 0xFF1493, 0xFF1493, 0xFF1493, 0xFF1493, 0xFF1493, 0xFF1493, 0xFF1493, 0xFF1493, 0xFF1493],
                     [null, null, null, 0xFFFFC7, 0xD9FFC7, 0xC7FFC7, 0xA3FFC7, 0x8FFFC7, 0x61FFC7, 0x45FFC7, 0x30FFC7, 0x1FFFC7, 0x00FF9C, 0x00E675, 0x00D452, 0x00BF38, 0x00AB24, null],
                     [null , null, null, 0x00BAFF, 0x00A1FF, 0x008FFF, 0x0080FF, 0x006BFF, 0x545CF2, 0x785CE3, 0x8A4FE3, 0xA136D4, 0xB31FD4, 0xB31FBA, 0xB30DA6, 0xBD0D87, 0xC70066, null]];







export function Coord(x,y,z) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.equals = function(other) {
     return other != null
            && other.x == this.x
            && other.y == this.y
            && other.z == this.z;
  };
}

function buildTable() {
  //periodic table 2d array
  let rows = [];
  
  for(var row=0; row<atomicSymbols.length; row++) {
    let cell = [];
    for(var col=0; col<atomicSymbols[row].length; col++){

      //create new atom
      var atom = {}//new Object();

      //assign physical attributes
      atom.symbol = atomicSymbols[row][col];
      atom.radius = atomicRadii[row][col];
      atom.number = atomicNumber[row][col];
      atom.color3d = atomColor[row][col];

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

export function Atom(location, atomicSymbol, elementName, atomicRadius, atomColor, molecule, bonds){
  this.location = location;
  this.location3D = null;
  this.atomicSymbol = atomicSymbol;
  this.elementName = elementName;
  this.atomicRadius = atomicRadius;
  this.atomColor = atomColor;
  this.isSelected = false;
  this.molecule = molecule;
  this.bonds = bonds;
  this.index = null;
  this.equals = function(other) {
     return    other != null
            && this.location.equals(other.location)
            && this.atomicSymbol == other.atomicSymbol
            && this.elementName  == other.elementName
            && this.atomicRadius == other.atomicRadius
            && this.isSelected   == other.isSelected
            && this.molecule     == other.molecule;
  };
}
