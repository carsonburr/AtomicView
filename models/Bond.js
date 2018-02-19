export function Bond(atom1, bondType){
  this.atom1 = atom1;
  this.bondType = bondType;
  this.atom2 = null;
  this.equals = function(other){
    return this.atom1.equals(other.atom1)
           this.atom2.equals(other.atom2)
           this.bondType == other.bondType;
  }
}
