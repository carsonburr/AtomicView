import React from 'react';
import PropTypes from 'prop-types';
import SelectButton from './SelectButton'
import PeriodicTablePopup from './PeriodicTablePopup'
import BondButton from  './BondButton'
import RevertButton from  './RevertButton'
import DrawButton from  './DrawButton'
import DeleteButton from  './DeleteButton'
import LabelButton from  './LabelButton'
import ExportButton from './ExportButton'
import {Atom, Coord, RGBA} from '../../models/Atom.js';

class Toolbox extends React.Component {

    selectAtom = (symbol, name, atomicRadius, color) => {
      this.props.setCurAtom(symbol, name, atomicRadius, color, null, new Set());
  	}

  	switchAction = (action) => {
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

    export3dCanvasImage = () => {
      this.props.export3dCanvasImage();
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
      				<td><DeleteButton clearAll={this.clearAll} /></td>
      				<td><DrawButton draw={this.draw}/></td>
              <td><ExportButton export3dCanvasImage={this.export3dCanvasImage} /></td>
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
  export3dCanvasImage: PropTypes.func.isRequired,
};

export default Toolbox;
