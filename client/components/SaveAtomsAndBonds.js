import axios from 'axios';
import qs from 'querystring';

export default function saveAtomsAndBonds(key, atoms, bonds) {
  console.log("In saveAtomsAndBonds")
  var jsonAtoms = [];
  var i = 0;
  atoms.forEach(atom => {
    atom.index = i;
    i++;
    var jsonAtom = new JSONAtom(atom);
    jsonAtoms.push(JSON.stringify(jsonAtom));
  });
  var jsonBonds = [];
  bonds.forEach(bond => {
    console.log(bond.atom1.index)
    console.log(bond.atom2.index)
    bond.atomIndex1 = bond.atom1.index;
    bond.atomIndex2 = bond.atom2.index;
    var jsonBond = new JSONBond(bond);
    jsonBonds.push(JSON.stringify(jsonBond));
  });
  var atomsAndBonds = new JSONAtomsAndBonds(jsonAtoms, jsonBonds);
  var jsonAtomsAndBonds = JSON.stringify(atomsAndBonds);
  axios.post('/save',
      qs.stringify({
        key: key,
        jsonAtomsAndBonds: jsonAtomsAndBonds
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        }
      }).then((response)=>{
      }).catch(function(error) {
        console.log(error);
      });
}

function JSONAtom(atom) {
  this.location = atom.location;
  this.location3D = atom.location3D;
  this.atomicSymbol = atom.atomicSymbol;
  this.elementName = atom.elementName;
  this.atomicRadius = atom.atomicRadius;
  this.atomColor = atom.atomColor;
  this.molecule = atom.molecule;
  this.index = atom.index;

}

function JSONBond(bond){
  this.bondType = bond.bondType;
  this.atomIndex1 = bond.atomIndex1;
  this.atomIndex2 = bond.atomIndex2;
}

function JSONAtomsAndBonds(jsonAtoms, jsonBonds){
  this.jsonAtoms = JSON.stringify(jsonAtoms);
  this.jsonBonds = JSON.stringify(jsonBonds);
}

// function JSONAtomsAndBonds(jsonAtoms, jsonBonds){
//   this.jsonAtoms = [];
//   this.jsonBonds = [];
//   for (var i = 0; i < jsonAtoms.length; i++){
//     this.jsonAtoms.push(JSON.stringify(jsonAtoms[i]));
//   }
//   for (var i = 0; i < jsonBonds.length; i++){
//     this.jsonBonds.push(JSON.stringify(jsonBonds[i]));
//   }
// }