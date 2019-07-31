const alpha = ('qwertyuiopasdfghjklzxcvbnm').split('');

export const randomLetter = () => alpha[Math.floor(Math.random() * 26)];

export const emptyGrid = (cols, rows, delay) => {
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
        delay: delay
          ? Math.floor(dScale * (tScalar * ((2 * r) + c) + Math.random()))
          : Math.floor(1000 * Math.random()),
        text: randomLetter()
      });
    };
  };
  return grid;
};



// const delay = isLoaded ? false : (isMobile ? 300 : 500)


// delay === (isMobile ? 300 : 500)

  // const tScalar = 250 / (cols * rows);
  // const dScale = (delay / 5);
  // Math.floor(
  //   dScale * (
  //     tScalar * (
  //       (2 * r) + c
  //     ) + Math.random()
  //   )
  // )

// delay === false
  // Math.floor(1000 * Math.random())

