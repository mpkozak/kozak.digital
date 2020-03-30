import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import Grid from './libs/Grid';
import './App.css';
// import { setContent, iframes } from './_data.js';

// console.log(d3)









export default memo(({ isMobile }) => {
  const gridRef = useRef(null);
  const gridElRef = useRef(null);

  const [resizing, setResizing] = useState(false);
  const resizeTimeout = useRef(null);





  useEffect(() => {
    const gridEl = gridElRef.current;
    if (gridEl) {
      gridRef.current = new Grid(gridEl, isMobile);
    };
  }, [isMobile, gridRef, gridElRef]);





  useEffect(() => {
    if (resizing && !!resizeTimeout) {
      gridRef.current.undraw();
    };
  }, [gridRef, resizing, resizeTimeout]);


  const resizeCallback = useCallback(() => {
    setResizing(false);
    if (gridRef.current) {
      gridRef.current.init();
    }
    return;
  }, [gridRef, setResizing]);


  const handleResize = useCallback(async e => {
    clearTimeout(resizeTimeout.current);
    resizeTimeout.current = setTimeout(resizeCallback, isMobile ? 25 : 500);
    if (!resizing) {
      setResizing(true);
    };
    return;
  }, [isMobile, resizing, setResizing, resizeTimeout, resizeCallback]);


  useEffect(() => {
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });





  console.log('app render')


  return (
    <div id="App">
      <div id="Main" className={isMobile ? 'mobile' : null}>
        <div id="Grid" ref={gridElRef}>
        </div>
      </div>
    </div>
  );
});













// import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
// import { useLayout, useContent, useGridText } from './libs/hooks';
// import d3 from './libs/d3';
// import Grid from './libs/Grid';
// import './App.css';
// // import { setContent, iframes } from './_data.js';

// // console.log(d3)








// function useInitialize({ isMobile, gridRef = null, hasDrawn = false}) {
//   const { displayLayout, ...params } = useLayout({ gridRef, isMobile });
//   const { cols, rows } = params;
//   const content = useContent({ displayLayout, cols, rows });
//   const gridText = useGridText({ isMobile, hasDrawn, cols, rows });

//   return {
//     isMobile,
//     params,
//     content,
//     gridText,
//   };
// };







// export default memo(({ isMobile }) => {
//   const gridRef = useRef(null);
//   const [hasDrawn, setHasDrawn] = useState(false);

//   const {
//     params,
//     content,
//     gridText,
//   } = useInitialize({ isMobile, gridRef, hasDrawn });




//   const drawGridFull = useCallback(async () => {
//     const { celWidth, celHeight } = params;

//     return (
//       d3.select(gridRef.current)
//         .selectAll('div').data(gridText, d => d.id)
//         .enter().append('div')
//         .interrupt()
//           .attr('id', d => d.id)
//           .attr('class', d => 'cel' + (d.cl ? ' ' + d.cl : ''))
//           .text(d => d.text)
//           .style('left', d => d.c * celWidth + 'px')
//           .style('top', d => d.r * celHeight + 'px')
//           .style('width', celWidth + 'px')
//           .style('height', celHeight + 'px')
//           .style('color', d => d.color ? d.color : null)
//           .style('opacity', 0)
//         .transition()
//           .delay(d => d.delay)
//           .style('opacity', 1)
//           .on('end', d => {
//             d.active = false;
//             delete d.delay;
//           })
//         .end()
//     );
//   }, [gridRef, params, gridText]);





//   // useEffect(() => {
//   //   if (gridRef.current && !hasDrawn && gridText.length) {
//   //     drawGridFull();
//   //   };
//   // }, [gridRef, hasDrawn, gridText, drawGridFull]);




//   useEffect(() => {
//     if (gridRef.current) {
//       const grid = new Grid(gridRef.current, isMobile);
//       console.log('made new grid', grid)
//     };
//   }, [gridRef, isMobile]);





//   const gridStyle = !params ? null : {
//     fontSize: params.celHeight + 'px',
//     lineHeight: (params.celHeight * .9).toFixed(2) + 'px',
//     marginLeft: params.marginX + 'px',
//     marginTop: params.marginY + 'px',
//   };

//   return (
//     <div id="App">
//       <div id="Main" className={isMobile ? 'mobile' : null}>
//         <div id="Grid" ref={gridRef} style={gridStyle}>
//           i am the appman
//         </div>
//       </div>
//     </div>
//   );
// });


