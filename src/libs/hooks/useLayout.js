import { useState, useEffect, useRef, useCallback } from 'react';
import { useMobileDetect } from './';




const _layout = {
  celRatio: 2 / 3,
  maxCelHeight: 18,
  minGrid: {
    desktop: [56, 32],
    mobileH: [50, 23],
    mobileV: [31, 30],
  },
};





export default function(gridRef = null) {
  const isMobile = useMobileDetect();


  const [params, setParams] = useState(null);


  const [resizing, setResizing] = useState(false);
  const resizeTimeout = useRef(null);




  const configLayout = useCallback(() => {
    const {
      clientWidth: gridWidth,
      clientHeight: gridHeight,
    } = gridRef.current;
    const layout = !isMobile
      ? 'desktop'
      : (gridWidth > gridHeight ? 'mobileH' : 'mobileV');

    return {
      gridWidth,
      gridHeight,
      layout,
    };
  }, [gridRef, isMobile]);



  const configCels = (gridWidth, gridHeight, layout) => {
    const { celRatio, maxCelHeight, minGrid } = _layout;
    const [minCols, minRows] = minGrid[layout];

    const w = gridWidth / minCols;
    const h = gridHeight / minRows;
    let celWidth = h * celRatio;
    let celHeight = w / celRatio;

    if (gridHeight / celHeight < minRows) {
      celHeight = h;
    } else {
      celWidth = w;
    };

    if (celHeight > maxCelHeight) {
      celHeight = maxCelHeight;
      celWidth = maxCelHeight * celRatio;
    };

    return {
      celWidth: Math.round(celWidth),
      celHeight: Math.round(celHeight),
    };
  };


  const configGrid = (gridWidth, gridHeight, celWidth, celHeight) => {
    const cols = Math.floor(gridWidth / celWidth);
    const rows = Math.floor(gridHeight / celHeight);

    return {
      cols,
      rows,
      marginX: Math.round((gridWidth - cols * celWidth) / 2),
      marginY: Math.round((gridHeight - rows * celHeight) / 2),
    };
  };



  const getLayout = useCallback(() => {
    // console.log('getLayout ran')
    const { gridWidth, gridHeight, layout } = configLayout();
    const { celWidth, celHeight } = configCels(gridWidth, gridHeight, layout);
    const { cols, rows, marginX, marginY } = configGrid(gridWidth, gridHeight, celWidth, celHeight);

    const params = {
      gridWidth,
      gridHeight,
      layout,
      celWidth,
      celHeight,
      cols,
      rows,
      marginX,
      marginY,
    };

    setParams(params);
  }, [configLayout, configCels, configGrid, setParams]);







  useEffect(() => {
    if (gridRef.current && !resizing && !params) {
      getLayout();
    };
  }, [params, gridRef, resizing, getLayout]);




  const resizeCallback = useCallback(() => {
    // console.log('resizeCallback ran')
    setResizing(false);
    return;
  }, [setResizing]);


  const handleResize = useCallback(e => {
    // console.log('handleResize ran')
    clearTimeout(resizeTimeout.current);
    if (!resizing) {
      setResizing(true);
    };
    if (!!params) {
      setParams(null);
    };
    resizeTimeout.current = setTimeout(resizeCallback, isMobile ? 0 : 500);
    return;
  }, [isMobile, params, setParams, resizing, setResizing, resizeTimeout, resizeCallback]);


  useEffect(() => {
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });


  // console.log('useLayout', params, resizing)

  return params;



  // console.log('use layout ran', appRef)
};
