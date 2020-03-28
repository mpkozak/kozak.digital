import { useState, useEffect, useRef, useCallback } from 'react';
import { gridRules } from '../../global';





export default function({ gridRef = null, isMobile = false} = {}) {
  const [params, setParams] = useState(null);
  const [resizing, setResizing] = useState(false);
  const resizeTimeout = useRef(null);



  const configParams = useCallback(() => {
    const { clientWidth, clientHeight } = gridRef.current;
    const displayLayout = !isMobile
      ? 'desktop'
      : clientWidth > clientHeight
        ? 'mobileH'
        : 'mobileV';

    const { celRatio, maxCelHeight, minGrid } = gridRules;
    const [minCols, minRows] = minGrid[displayLayout];

    const w = clientWidth / minCols;
    const h = clientHeight / minRows;
    let celWidth = h * celRatio;
    let celHeight = w / celRatio;

    if (clientHeight / celHeight < minRows) {
      celHeight = h;
    } else {
      celWidth = w;
    };

    if (celHeight > maxCelHeight) {
      celHeight = maxCelHeight;
      celWidth = maxCelHeight * celRatio;
    };

    celHeight = Math.round(celHeight);
    celWidth = Math.round(celWidth);

    const cols = Math.floor(clientWidth / celWidth);
    const rows = Math.floor(clientHeight / celHeight);
    const marginX = Math.round((clientWidth - cols * celWidth) / 2);
    const marginY = Math.round((clientHeight - rows * celHeight) / 2);

    setParams({
      displayLayout,
      celWidth,
      celHeight,
      cols,
      rows,
      marginX,
      marginY,
    });
  }, [gridRef, isMobile]);


  useEffect(() => {
    if (gridRef.current && !resizing && !params) {
      configParams();
    };
  }, [params, gridRef, resizing, configParams]);



  const resizeCallback = useCallback(() => {
    setResizing(false);
    return;
  }, [setResizing]);


  const handleResize = useCallback(e => {
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



  return params || {};
};
