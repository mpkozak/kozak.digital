import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';

const isMobile = () => {
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) return true;
  return false;
};

ReactDOM.render(<App isMobile={isMobile()} />, document.getElementById('root'));



// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import AppMobile from './AppMobile';

// const minWidth = 540;
// const minHeight = 480;

// const isMobile = () => {
//   if (
//     // window.innerWidth < minWidth ||
//     // window.innerHeight < minHeight ||
//     navigator.userAgent.match(/Android/i) ||
//     navigator.userAgent.match(/webOS/i) ||
//     navigator.userAgent.match(/iPhone/i) ||
//     navigator.userAgent.match(/iPad/i) ||
//     navigator.userAgent.match(/iPod/i) ||
//     navigator.userAgent.match(/BlackBerry/i) ||
//     navigator.userAgent.match(/Windows Phone/i)
//   ) return <AppMobile />;
//   return <App minWidth={minWidth} minHeight={minHeight} />;
// };

// ReactDOM.render(isMobile(), document.getElementById('root'));
