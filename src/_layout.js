const layout = {};


layout.main = {
  title: {
    posX: .5,
    posY: .5
  },
  name: {
    posX: .75,
    posY: .6
  },
  skills: {
    posX: .7,
    posY: .4,
    offsetX: 0,
    offsetY: -2,
    deltaX: .3,
    deltaY: -1
  },
  projects: {
    posX: .22,
    posY: .18,
    offsetX: 0,
    offsetY: 3,
    deltaX: .5,
    deltaY: 2
  },
  contact: {
    posX: .85,
    posY: .75,
    offsetX: -16,
    offsetY: 2,
    deltaX: 0,
    deltaY: 1
  },
  links: {
    posX: .15,
    posY: .9,
    offsetX: 2,
    offsetY: -2,
    deltaX: .75,
    deltaY: -2
  }
};

layout.mobileV = {
  title: {
    posX: .5,
    posY: .5
  },
  name: {
    posX: .75,
    posY: .6
  },
  skills: {
    posX: .7,
    posY: .4,
    offsetX: 5,
    offsetY: -2,
    deltaX: -.7,
    deltaY: -1
  },
  projects: {
    posX: .22,
    posY: .18,
    offsetX: 3,
    offsetY: 3,
    deltaX: 1,
    deltaY: 2
  },
  contact: {
    posX: .85,
    posY: .75,
    offsetX: -5,
    offsetY: 3,
    deltaX: 0,
    deltaY: 1
  },
  links: {
    posX: .15,
    posY: .9,
    offsetX: 2,
    offsetY: -2,
    deltaX: .9,
    deltaY: -2
  }
};

layout.mobileH = {
  title: {
    posX: .5,
    posY: .75
  },
  name: {
    posX: .75,
    posY: .85
  },
  skills: {
    posX: .45,
    posY: .58,
    offsetX: -2,
    offsetY: -2,
    deltaX: -1,
    deltaY: -1
  },
  projects: {
    posX: .15,
    posY: .14,
    offsetX: 6,
    offsetY: 2,
    deltaX: 1,
    deltaY: 2
  },
  contact: {
    posX: .82,
    posY: .35,
    offsetX: -2,
    offsetY: 3,
    deltaX: 0,
    deltaY: 1
  },
  links: {
    posX: .24,
    posY: .9,
    offsetX: -3,
    offsetY: -2,
    deltaX: .75,
    deltaY: -2
  }
};


module.exports = layout;
