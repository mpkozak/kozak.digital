import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';



const isMobile = (() => {
  if (navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i)) {
    return true;
  };
  return false;
})();





ReactDOM.render(<App isMobile={isMobile} />, document.getElementById('root'));
