import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';


/**
* Class with a list of extra resources
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
        <h2 align="center">Extra Resources</h2>
        <hr />
        <p>For users who wish to learn more about the material presented, here is a
        list of helpful, educational, chemistry resources. This is a miniscule list,
        there are tons of resources, both online and in print, out there.</p> <br/>
        <ul>
          <li><a href="https://www.ptable.com">P Table</a>:
           for all the info you could need on each element.</li>
          <li><a href="https://www.ncbi.nlm.nih.gov">NCBI</a>:
           extensive database on chemistry's application to bio.</li>
          <li><a href="https://pubchem.ncbi.nlm.nih.gov/">Pub Chem</a>:
           Large database and publication info</li>
           <li><a href="http://www.chemcollective.org//">Chem Collective</a>:
           High level approach deticated to teaching.</li>
           <li><a href="https://www.youtube.com/user/UCIrvineOCW/playlists">UC Irvine</a>:
           UC Irvine chem lectures are available for free on youtube.</li>
           <li><a href="https://www.khanacademy.org/science/chemistry">Khan Academy</a>:
            A great tool for many subjects and widely beloved.</li>
        </ul>
        </div>

        <Footer/>
      </div>
    );
  }
}

export default About;