import axios from 'axios';
import qs from 'querystring';

export default function saveAtomsAndBonds(key, atoms, bonds) {
  var savedAtoms = [];
  var i = 0;
  atoms.forEach(atom => {
    atom.index = i;
    i++;
    savedAtoms.push(new cleanAtom(atom));
  });
  var savedBonds = [];
  bonds.forEach(bond => {
    bond.atomIndex1 = bond.atom1.index;
    bond.atomIndex2 = bond.atom2.index;
    savedBonds.push(new cleanBond(bond));
  });
  var atomsAndBonds = {
    atoms: savedAtoms,
    bonds: savedBonds
  };
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

function cleanAtom(atom) {
  this.location = atom.location;
  this.atomicSymbol = atom.atomicSymbol;
  this.elementName = atom.elementName;
  this.atomicRadius = atom.atomicRadius;
  this.atomColor = atom.atomColor;
  this.molecule = atom.molecule;
  this.index = atom.index;

}

function cleanBond(bond){
  this.bondType = bond.bondType;
  this.atomIndex1 = bond.atomIndex1;
  this.atomIndex2 = bond.atomIndex2;
}