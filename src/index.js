import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App2.js';



const isMobile = (() => {
  const ua = navigator.userAgent;
  if (
    ua.match(/Android/i) ||
    ua.match(/webOS/i) ||
    ua.match(/iPhone/i) ||
    ua.match(/iPad/i) ||
    ua.match(/iPod/i) ||
    ua.match(/BlackBerry/i) ||
    ua.match(/Windows Phone/i)
  ) return true;
  return false;
})();





ReactDOM.render(<App isMobile={isMobile} />, document.getElementById('root'));
