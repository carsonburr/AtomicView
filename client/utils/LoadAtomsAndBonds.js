import axios from 'axios';
import qs from 'querystring';
import {Atom, Coord} from '../../models/Atom.js';
import {Bond} from '../../models/Bond.js';

export function loadList() {
  axios.post(
    '/molList'
  ).then((response) => {
    console.log(response.data);
  }).catch(
    function(err) {
      console.log(err);
    }
  );
}

export function loadAtomsAndBonds(key, atoms, bonds) {
  axios.post('/retrieve',
      qs.stringify({
        key: key,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        }
      }).then((response)=>{
        atoms.clear();
        bonds.clear();
        console.log(response.data);
        let atomsAndBonds = JSON.parse(response.data.jsonAtomsAndBondsArray[0].jsonAtomsAndBonds);
        let loadedAtoms = atomsAndBonds.atoms;
        let loadedBonds = atomsAndBonds.bonds;

        let atomsArray = [];
        for (let i = 0; i < loadedAtoms.length; i ++){

          let loadedAtom = loadedAtoms[i];
          loadedAtom.location3D = null;
          loadedAtom.isSelected = false;
          loadedAtom.bonds = new Set();
          loadedAtom.location.equals = function(other) {
            return other != null
              && other.x == this.x
              && other.y == this.y
              && other.z == this.z;
          }
          loadedAtom.equals = function(other) {
            return    other != null
              && this.location.equals(other.location)
              && this.atomicSymbol == other.atomicSymbol
              && this.elementName  == other.elementName
              && this.atomicRadius == other.atomicRadius
              && this.isSelected   == other.isSelected
              && this.molecule     == other.molecule;
          }

          atomsArray.push(loadedAtom);
          atoms.add(loadedAtom);
        }

        for (let i = 0; i < loadedBonds.length; i++){
          let loadedBond = loadedBonds[i];
          let atom1 = atomsArray[loadedBond.atomIndex1];
          let atom2 = atomsArray[loadedBond.atomIndex2]

          let bond = new Bond(atom1, loadedBond.bondType);
          bond.atom2 = atom2;
          bonds.add(bond);

          atom1.bonds.add(bond);
          atom2.bonds.add(bond);
        }
      }).catch(function(error) {
        console.log(error);
      });
}
