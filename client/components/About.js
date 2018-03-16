import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';


/**
* Class for about us page
*/
class About extends React.Component {
  constructor() {

    super();
    this.userId = null;


  }

  // Should have a way of not offering to save for users in this page
  saveAtomsAndBondsForUser = (key) => {
    //saveAtomsAndBonds(key, this.atoms, this.bonds);
    console.log("Can't save Atoms in about page");
  }

  loadAtomsAndBondsForUser = (key) => {
    console.log("Can't save Atoms in about page");
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
