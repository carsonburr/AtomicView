import React from 'react';
import PropTypes from 'prop-types';
import SelectButton from './SelectButton'
import PeriodicTablePopup from './PeriodicTablePopup'
import BondButton from  './BondButton'
import RevertButton from  './RevertButton'
import DrawButton from  './DrawButton'
import DeleteButton from  './DeleteButton'
import LabelButton from  './LabelButton'
import {Atom, Coord, RGBA} from '../../models/Atom.js';

class Toolbox extends React.Component {

    selectAtom = (symbol, name, atomicRadius, color) => {
    	//this.curAtom.atom = new Atom(
      	//new Coord(0,0,0), symbol, name, atomicRadius,color,null, new Set());
      	//console.log("sa");
      	this.props.setCurAtom(symbol, name, atomicRadius, color, null, new Set());
  	}

  	switchAction = (action) => {
  		//console.log("sw");
	    this.props.switchCurAction(action);
  	}

  	clearAll = () => {
  		this.props.clearAll();
  	}

  	selectBond = (bondType) => {
  		this.props.setCurBondType(bondType);
  	}

  	draw = () => {
  		this.props.draw();
  	}

  	reversionHandler = () => {
  		this.props.reversionHandler();
  	}


  	//can add styling to table if wanted
    render() {
    return (
    	<div>
    		<table>
    			<tbody>
    			<tr>
      				<td><SelectButton switchCurAction={this.switchAction}/></td>
      				<td><PeriodicTablePopup setCurAtom={this.selectAtom} 
      					switchCurAction={this.switchAction}/></td>
      				<td><BondButton setCurBondType={this.selectBond}
      					switchCurAction={this.switchAction}/></td>
      				<td><RevertButton reversionHandler={this.reversionHandler}/></td>
      				<td><DrawButton draw={this.draw}/></td>
      				<td><DeleteButton clearAll={this.clearAll} /></td>
      			</tr>
      			</tbody>
      		</table>
      	</div>
    );
  }
}

SelectButton.propTypes = {
  callbackFromParent: PropTypes.func.isRequired,
  setCurAtom: PropTypes.func.isRequired,
  switchCurAction: PropTypes.func.isRequired,
  setCurBondType: PropTypes.func.isRequired,
  clearAll: PropTypes.func.isRequired,
  draw: PropTypes.func.isRequired,
  reversionHandler: PropTypes.func.isRequired,
};

export default Toolbox;