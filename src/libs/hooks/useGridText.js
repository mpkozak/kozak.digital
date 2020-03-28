import { useState, useEffect, useCallback, useRef } from 'react';
import { getContent } from '../../global';





const alpha = ('qwertyuiopasdfghjklzxcvbnm').split('');
const randomLetter = () => alpha[Math.floor(Math.random() * 26)];





export default function({ isMobile = false, rows = 0, cols = 0 } = {}) {
  const [initial, setInitial] = useState(true);
  const gridText = useRef([]);



  const populateGrid = useCallback(() => {
    const dScale = isMobile ? 60 : 100;
    const tScalar = 250 / (rows * cols);

    const calcDelay = (r, c) => {
      return Math.floor(
        dScale * (
          tScalar * ((2 * r) + c)
          + Math.random()
        )
      );
    };

    let id = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        gridText.current.push({
          c,
          r,
          id: `cel${id++}`,
          text: randomLetter(),
          delay: initial
            ? calcDelay(r, c)
            : Math.floor(500 * Math.random()),
          active: true,
        });
      };
    };

    if (initial) {
      setInitial(false);
    };

    return;
  }, [isMobile, rows, cols, initial, setInitial, gridText]);


  useEffect(() => {
    console.log('grid effect')
    if (!gridText.current.length) {
      populateGrid();
    };
    // return () => {
    //   gridText.current = [];
    // }
  }, [gridText, populateGrid]);


  return gridText.current;
};
