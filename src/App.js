import React, { memo, useRef } from 'react';
import { useLayout } from './libs/hooks';
// import { d3 } from './libs/d3';
import './App.css';
// import { setContent, iframes } from './_data.js';

// console.log(d3)







const Grid = memo(({ params = null, gridRef = null } = {}) => {
  console.log('in Grid', params)

  return (
    <div id="Grid" ref={gridRef}>
      i am the appman
    </div>
  );
});


// , (prevProps, nextProps) => {
//   if (prevProps.params !== nextProps.params) {
//     return false;
//   };
//   return true;
// }


export default memo(() => {
  const gridRef = useRef(null);

  const params = useLayout(gridRef);

  // console.log('app render', params)


  return (
    <div id="App">
      <div id="Main">
        <Grid
          params={params}
          gridRef={gridRef}
        />
      </div>
    </div>
  );
});


