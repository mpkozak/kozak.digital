




export const content = {
  title: {
    str: 'this is not a website',
    delay: 0,
    onHover: false,
    color: '#FFFFFF',
  },
  name: {
    str: 'm. parker kozak',
    delay: 1000,
    onHover: false,
    color: '#D24141',
  },
  skills: {
    str: 'skills',
    delay: 1500,
    onHover: 'skills',
    color: '#FFAF24',
    data: [
      { str: 'css', color: '#2BB62B' },
      { str: 'html', color: '#2BB62B' },
      { str: 'bash', color: '#2BB62B' },
      { str: 'sql', color: '#2BB62B' },
      { str: 'express', color: '#2BB62B' },
      { str: 'node', color: '#2BB62B' },
      { str: 'webaudio api', color: '#2BB62B' },
      { str: 'd3+svg', color: '#2BB62B' },
      { str: 'react', color: '#2BB62B' },
      { str: 'javascript', color: '#2BB62B' },
    ],
  },
  projects: {
    str: 'projects',
    delay: 1750,
    onHover: 'projects',
    color: '#FFAF24',
    data: [
      {
        str: 'drive my car',
        click: 'drive',
        color: '#5C98FF',
      },
      {
        str: 'sleepy',
        click: 'sleepy',
        color: '#5C98FF',
      },
      {
        str: 'αdex',
        click: 'adex',
        color: '#5C98FF',
      },
    ],
  },
  contact: {
    str: 'contact',
    delay: 2000,
    onHover: 'contact',
    color: '#FFAF24',
    data: [
      {
        str: 'mparkerkozak@gmail.com',
        strAlt: 'email',
        click: 'mailto:mparkerkozak@gmail.com',
        color: '#2AB2B2',
      },
    ],
  },
  links: {
    str: 'links',
    delay: 2250,
    onHover: 'links',
    color: '#FFAF24',
    data: [
      {
        str: 'resume',
        click: 'http://kozak.digital/_files/kozak_resume.pdf',
        color: '#DD6EDD',
      },
      {
        str: 'imdb',
        click: 'https://www.imdb.com/name/nm3362994/',
        color: '#DD6EDD',
      },
      {
        str: 'github',
        click: 'https://github.com/mpkozak',
        color: '#DD6EDD',
      },
      {
        str: 'linkedin',
        click: 'https://www.linkedin.com/in/mpkozak/',
        color: '#DD6EDD',
      },
      {
        str: 'codepen',
        click: 'https://codepen.io/mpkozak/pen/XoWNOQ',
        color: '#DD6EDD',
      },
    ],
  },
};





export const layouts = {
  desktop: {
    title: {
      // pos: [.5, .5],
      posX: .5,
      posY: .5,
    },
    name: {
      posX: .75,
      posY: .6,
    },
    skills: {
      posX: .7,
      posY: .4,
      offsetX: 0,
      offsetY: -2,
      deltaX: .3,
      deltaY: -1,
    },
    projects: {
      posX: .22,
      posY: .18,
      offsetX: 0,
      offsetY: 3,
      deltaX: .5,
      deltaY: 2,
    },
    contact: {
      posX: .85,
      posY: .75,
      offsetX: -16,
      offsetY: 2,
      deltaX: 0,
      deltaY: 1,
    },
    links: {
      posX: .15,
      posY: .9,
      offsetX: 2,
      offsetY: -2,
      deltaX: .75,
      deltaY: -2,
    },
  },
  mobileV: {
    title: {
      posX: .5,
      posY: .5,
    },
    name: {
      posX: .72,
      posY: .6,
    },
    skills: {
      posX: .7,
      posY: .4,
      offsetX: 5,
      offsetY: -2,
      deltaX: -.7,
      deltaY: -1,
    },
    projects: {
      posX: .22,
      posY: .18,
      offsetX: 3,
      offsetY: 3,
      deltaX: 1,
      deltaY: 2,
    },
    contact: {
      posX: .85,
      posY: .75,
      offsetX: -5,
      offsetY: 3,
      deltaX: 0,
      deltaY: 1,
    },
    links: {
      posX: .15,
      posY: .9,
      offsetX: 2,
      offsetY: -2,
      deltaX: .9,
      deltaY: -2,
    },
  },
  mobileH: {
    title: {
      posX: .5,
      posY: .75,
    },
    name: {
      posX: .75,
      posY: .85,
    },
    skills: {
      posX: .45,
      posY: .58,
      offsetX: -2,
      offsetY: -2,
      deltaX: 1.2,
      deltaY: -1,
    },
    projects: {
      posX: .15,
      posY: .14,
      offsetX: 6,
      offsetY: 2,
      deltaX: 1,
      deltaY: 2,
    },
    contact: {
      posX: .82,
      posY: .35,
      offsetX: -2,
      offsetY: 3,
      deltaX: 0,
      deltaY: 1,
    },
    links: {
      posX: .24,
      posY: .9,
      offsetX: -3,
      offsetY: -2,
      deltaX: -1,
      deltaY: -2,
    },
  },
};
