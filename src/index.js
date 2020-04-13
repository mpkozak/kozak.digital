import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
// import * as serviceWorker from './serviceWorker';





const isMobile = (() => {
  if (navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i)) {
    return true;
  };
  return false;
})();





ReactDOM.render(<App isMobile={isMobile}/>, document.getElementById('root'));





// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
// serviceWorker.register();
