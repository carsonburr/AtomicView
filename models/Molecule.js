var mongoose = require('mongoose');

// Atom and Bond Schema are not used for a collection
// rather MoleculeSchema contains 2 arrays of type Atom and Bond Schema
var AtomSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  row: {
    type: Number,
    required: true,
  },
  col: {
    type: Number,
    required: true,
  },
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
  z: {
    type: Number,
    required: true,
  },
  bonds: {
    type: [Number],
    required: true,
  }
});

var BondSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  atom1: {
    type: Number,
    required: true,
  },
  atom2: {
    type: Number,
    required: true,
  },
  bondType: {
    type: Number,
    required: true,
  },
});

// define what will actually go in the collection
var MoleculeSchema = new mongoose.Schema({
  atoms: {
    type: [AtomSchema],
    required: true,
  },
  bonds: {
    type: [BondSchema],
    required: true,
  }
});

var Molecule = mongoose.model('molecule', MoleculeSchema);
module.exports = Molecule;