import * as selection from 'd3-selection';
import * as transition from 'd3-transition';

export const d3 = Object.assign(selection, transition);


const alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

export const randomLetter = () => alpha[Math.floor(Math.random() * 26)];

export const emptyGrid = (cols, rows, delay = 100) => {
  const grid = [];
  const tScalar = 250 / (cols * rows);
  const dScale = (delay / 5);
  let id = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cel = { c, r };
      cel.id = `cel${id++}`;
      cel.text = randomLetter();
      cel.delay = dScale * (tScalar * ((2 * r) + c) + Math.random());
      grid.push(cel);
    };
  };
  return grid;
};


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
