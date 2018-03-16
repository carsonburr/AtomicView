import React, { Component } from 'react';
import {Atom, Coord, RGBA} from '../../models/Atom.js';
import {Bond} from '../../models/Bond.js';
import WebGLUtils from '../../webgl_lib/webgl-utils.js';
import CuonUtils from '../../webgl_lib/cuon-utils.js';
import CuonMatrix from '../../webgl_lib/cuon-matrix.js';
import PeriodicTablePopup from './PeriodicTablePopup';
import BondButton from './BondButton';
import CanvasComponent3D from './CanvasComponent3D';
import CanvasComponent2D from './CanvasComponent2D';
import SelectButton from './SelectButton';
import Header from './Header';
import Footer from './Footer';
import Toolbox from './Toolbox';
import saveAtomsAndBonds from '../utils/SaveAtomsAndBonds';
import {loadAtomsAndBonds} from '../utils/LoadAtomsAndBonds';
import '../css/buttons.css';
import {Icon} from 'react-fa';

/**
* Class with a 2d and a 3d canvas.
*/
class About extends React.Component {
  constructor() {

    super();
    this.userId = null;


  }

  // Should have a way of not offering to save for users in this page
  saveAtomsAndBondsForUser = (key) => {
    //saveAtomsAndBonds(key, this.atoms, this.bonds);
    console.log("Can't save Atoms in about page you fool");
  }

  loadAtomsAndBondsForUser = (key) => {
    console.log("Can't save Atoms in about page you fool");
  }

  setUserId = (userId) => {
    this.userId = userId;
  }

  getUserId = () => {
    return this.userId;
  }



  render() {
    return (
      <div className="CanvasComponent" style={{ paddingTop:'50px'  }} tabIndex="0" onKeyDown={this.handleKeyDown}>
        <Header setUserId={this.setUserId}
                getUserId={this.getUserId}
                saveAtomsAndBondsForUser={this.saveAtomsAndBondsForUser}
                loadAtomsAndBondsForUser={this.loadAtomsAndBondsForUser}
                />
        <div style={{paddingLeft: '8%', color: '#393f4d', width: '92%'}} >
        <h2 align="center">About Us</h2>
        <hr />
        <p align="center">We are a team of Computer Scientists with an interest in making Chemistry easier
        and more accessible to all. Our web app serves to allow users to visualize the 
        molecules that they so often read about. Though are audience is primarily Chemistry
        students who wish to see what is in their textbooks, we believe people from any
        academic background, and of any age, will enjoy using our web app.</p> <br />
        <p align="center">If you set foot into any Chemistry student's room, you are likely
        to see a "Molecular Model Kit". While these kits are fun to play with, they have
        some severe limitations. The biggest of which, is that not every molecule is
        creatable with these physical kits. By bringing software into the mix, we allow
        for an enormous range of possibilities: "No molecule left unseen". As our codebase
        grows we will be able to verify users molecules as they create them, provide info about common
        molecules, show attributes like atom size, bond length, electron cloud density, etc.,
        all of which are impossible with a physical kit. In this way our web app will
        actively provide the user with important data about a molecule; facilitating those who use it, 
        in their quest for a deeper understanding. As anyone who knows chem will tell you, understanding
        the actual, physicl shape of molecules is vital in hypothesizing about their interactions. 
        We aim to help with that.</p> <br />
        <p align="center">You need not look any farther than our logo to understand our mission. Based off
         the chemical formula of silicon dioxide, the main ingredient in computer chips, it 
         embodies our dedication to bringing the power of 21st century computing, to the visualization,
         and understanding, of the chemical world. </p> <br />
         <hr />
         <p align="center">But enough about us, click <a href="/">here</a> or our logo to start drawing atoms and
         learning about the physical form of the world around you.</p>
        </div>

        <Footer/>
      </div>
    );
  }
}

export default About;