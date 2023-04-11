import React from 'react';

const buttonStyle = {
  margin: '10px 0',
  padding: '15px 50px',
  backgroundColor: '#da8627',
  color: 'white',
};

const Button = ({ label, handleClick }) => (
  <button className="btn btn-default" style={buttonStyle} onClick={handleClick}>
    + RENT YOUR SPACE
  </button>
);

export default Button;
