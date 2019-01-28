const layout = {};

layout.main = {
  text: [
    {
      posX: .5,
      posY: .5,
    },
    {
      posX: .75,
      posY: .6,
    },
    {
      hover: 'projects',
      posX: .22,
      posY: .18,
    },
    {
      hover: 'skills',
      posX: .7,
      posY: .4,
    },
    {
      hover: 'links',
      posX: .15,
      posY: .9,
    },
    {
      hover: 'contact',
      posX: .85,
      posY: .75,
    }
  ],
  projects: {
    offsetX: 0,
    offsetY: 3,
    deltaX: .5,
    deltaY: 2
  },
  skills: {
    offsetX: 0,
    offsetY: -2,
    deltaX: .3,
    deltaY: -1
  },
  links: {
    offsetX: 2,
    offsetY: -2,
    deltaX: .75,
    deltaY: -2
  },
  contact: {
    offsetX: -16,
    offsetY: 2,
    deltaX: 0,
    deltaY: 1
  }
};


layout.mobileV = {
  text: [
    {
      posX: .5,
      posY: .5,
    },
    {
      posX: .75,
      posY: .6,
    },
    {
      hover: 'projects',
      posX: .22,
      posY: .18,
    },
    {
      hover: 'skills',
      posX: .7,
      posY: .4,
    },
    {
      hover: 'links',
      posX: .15,
      posY: .9,
    },
    {
      hover: 'contact',
      posX: .85,
      posY: .75,
    }
  ],
  projects: {
    offsetX: 3,
    offsetY: 3,
    deltaX: 1,
    deltaY: 2
  },
  skills: {
    offsetX: 5,
    offsetY: -2,
    deltaX: -.7,
    deltaY: -1
  },
  links: {
    offsetX: 2,
    offsetY: -2,
    deltaX: .9,
    deltaY: -2
  },
  contact: {
    offsetX: -5,
    offsetY: 3,
    deltaX: 0,
    deltaY: 1
  }
};


layout.mobileH = {
  text: [
    {
      posX: .5,
      posY: .75,
    },
    {
      posX: .75,
      posY: .85,
    },
    {
      hover: 'projects',
      posX: .15,
      posY: .14,
    },
    {
      hover: 'skills',
      posX: .45,
      posY: .58,
    },
    {
      hover: 'links',
      posX: .24,
      posY: .9,
    },
    {
      hover: 'contact',
      posX: .82,
      posY: .35,
    }
  ],
  projects: {
    offsetX: 6,
    offsetY: 2,
    deltaX: 1,
    deltaY: 2
  },
  skills: {
    offsetX: -2,
    offsetY: -2,
    deltaX: -1,
    deltaY: -1
  },
  links: {
    offsetX: -3,
    offsetY: -2,
    deltaX: .75,
    deltaY: -2
  },
  contact: {
    offsetX: -2,
    offsetY: 3,
    deltaX: 0,
    deltaY: 1
  }
};



(() => {
  Object.keys(layout).forEach(d => {
    const par = layout[d]
    par.text.forEach(f => {
      if (f.hover) {
        const { posX, posY } = f;
        Object.assign(par[f.hover], { posX, posY });
      };
    });
  })
})()




// Object.values(layout).forEach(d => append(d))


// console.log('layout', layout)
// console.log('output', output)
// console.log('entries', Object.values(layout))
module.exports = { layout };




// contact.display[0].str = 'email';

// content.inheritPosition = () => {
//   content.text.forEach(d => {
//     if (d.hover) {
//       const { posX, posY } = d;
//       Object.assign(content[d.hover], { posX, posY });
//     };
//   });
// };


// content.inheritPosition();


// module.exports = content;
