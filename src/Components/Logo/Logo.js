import React from 'react'
import Tilt from 'react-tilt';
import './Logo.css';
import brain from './Brain.png';

//pure function
const Navigation = () => {
  return (
    <div className = ' center ma4 mt0'>
      <Tilt className="Tilt br2 shadow-2" options={{ max : 25 }} style={{ height: 150, width: 150 }} >
        <div className="Tilt-inner">
          <img style={{paddingTop: '40px'}} alt ='logo' src={brain}/> 
        </div>
      </Tilt>
    </div>

  );
}

export default Navigation;