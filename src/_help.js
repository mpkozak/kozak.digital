import * as selection from 'd3-selection';
import * as transition from 'd3-transition';

const alpha = ('qwertyuiopasdfghjklzxcvbnm').split('');


export const d3 = Object.assign(selection, transition);

export const randomLetter = () => alpha[Math.floor(Math.random() * 26)];

export const emptyGrid = (cols, rows, delay = 100) => {
  const grid = [];
  const tScalar = 250 / (cols * rows);
  const dScale = (delay / 5);
  let id = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      grid.push({
        c,
        r,
        id: `cel${id++}`,
        delay: dScale * (tScalar * ((2 * r) + c) + Math.random()),
        text: randomLetter()
      });
    };
  };
  return grid;
};


// c, r, id, delay, text, fill, cl, hover, action
// str, fill, cl, hover, action, posX, posY, adjC, adjR, delayIncr

// //white
// '#FFFFFF'
// //red
// '#CB3030'
// //orange
// '#FDA50F'
// //green
// '#20BB20'
// //blue
// '#0089FF'
// //purple
// '#8E00FF'
// //aqua
// '#20A0A1'
