import axios from 'axios';
import qs from 'querystring';
import {Atom, Coord} from '../../models/Atom.js';
import {Bond} from '../../models/Bond.js';

export default function loadAtomsAndBonds(key, atoms, bonds) {
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
        console.log(response.data)
        console.log(response.data.jsonAtomsAndBondsArray[0].jsonAtomsAndBonds)
        atoms.clear();
        bonds.clear();
        var jsonAtomsAndBonds = JSON.parse(response.data.jsonAtomsAndBondsArray[0].jsonAtomsAndBonds);
        console.log("jsonAtomsAndBonds.jsonAtoms: " + jsonAtomsAndBonds.jsonAtoms)
        var jsonAtoms = JSON.parse(jsonAtomsAndBonds.jsonAtoms);
        console.log(jsonAtoms);
        var jsonBonds = JSON.parse(jsonAtomsAndBonds.jsonBonds);
        console.log(jsonBonds);
        var atomsArray = [];
        for (var i = 0; i < jsonAtoms.length; i ++){
          var jsonAtom = JSON.parse(jsonAtoms[i]);
          console.log(jsonAtom)
          atomsArray.push(JSONAtomToAtom(jsonAtom));
          atoms.add(atomsArray[i]);
        }
        for (var i = 0; i < jsonBonds.length; i++){
          console.log("jsonBond" + " " + i +": "+jsonBonds[i])
          var jsonBond = JSON.parse(jsonBonds[i]);
          console.log("jsonBond.atomIndex1:" + jsonBond.atomIndex1)
          console.log("jsonBond.atomIndex2:" + jsonBond.atomIndex2)
          console.log("jsonBond.bondType:" + jsonBond.bondType)
          var bond = new Bond(atomsArray[jsonBond.atomIndex1], jsonBond.bondType);
          console.log("bond " + i + ": " +bond)
          bond.atom2 = atomsArray[jsonBond.atomIndex2];
          bonds.add(bond);
        }
      }).catch(function(error) {
        console.log(error);
      });
}

function JSONAtomToAtom(jsonAtom){
  console.log(jsonAtom.location)
  var location = new Coord(jsonAtom.location.x, jsonAtom.location.y, jsonAtom.location.z);
  // var location = jsonAtom.location;
  var tmpAtom = new Atom(location, jsonAtom.atomicSymbol, 
    jsonAtom.elementName, jsonAtom.atomicRadius, jsonAtom.atomColor, jsonAtom.molecule, null);
  tmpAtom.location3D = JSON.parse(jsonAtom.location3D);
  return tmpAtom;
}

function JSONCoord(location){
  this.x = location.x;
  this.y = location.y;
  this.z = location.z;
}

function JSONAtom(atom) {
  this.location =  JSON.stringify(new JSONCoord(atom.location));
  this.location3D = JSON.stringify(new JSONCoord(atom.location3D));
  this.atomicSymbol = atom.atomicSymbol;
  this.elementName = atom.elementName;
  this.atomicRadius = atom.atomicRadius;
  this.atomColor = atom.atomColor;
  this.molecule = atom.molecule;
  this.index = atom.index;

}

function JSONBond(bond){
  this.bondType = bondType;
  this.atomIndex1 = bond.atomIndex1;
  this.atomIndex2 = bond.atomIndex2;
}

function JSONAtomsAndBonds(jsonAtoms, jsonBonds){
  this.jsonAtoms = JSON.stringify(jsonAtoms);
  this.jsonBonds = JSON.stringify(jsonBonds);
}