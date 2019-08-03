




export const content = {
  title: {
    str: 'this is not a website',
    color: '#FFFFFF',
    delay: 0,
  },
  name: {
    str: 'm. parker kozak',
    color: '#D24141',
    delay: 1000,
  },
  skills: {
    str: 'skills',
    color: '#FFAF24',
    delay: 1500,
    activeCl: 'skills',
    onHover: {
      color: '#2BB62B',
      data: [
        { str: 'css' },
        { str: 'html' },
        { str: 'bash' },
        { str: 'sql' },
        { str: 'express' },
        { str: 'node' },
        { str: 'webaudio api' },
        { str: 'd3+svg' },
        { str: 'react' },
        { str: 'javascript' },
      ],
    },
  },
  projects: {
    str: 'projects',
    color: '#FFAF24',
    delay: 1750,
    activeCl: 'projects',
    onHover: {
      color: '#5C98FF',
      data: [
        {
          str: 'drive my car',
          action: {
            iframe: 'drive',
          },
        },
        {
          str: 'sleepy',
          action: {
            iframe: 'sleepy',
          },
        },
        {
          str: 'αdex',
          action: {
            iframe: 'adex',
          },
        },
      ],
    },
  },
  contact: {
    str: 'contact',
    color: '#FFAF24',
    delay: 2000,
    activeCl: 'contact',
    onHover: {
      color: '#2AB2B2',
      data: [
        {
          str: 'mparkerkozak@gmail.com',
          strAlt: 'email',
          action: {
            url: 'mailto:mparkerkozak@gmail.com',
          },
        },
      ],
    },
  },
  links: {
    str: 'links',
    color: '#FFAF24',
    delay: 2250,
    activeCl: 'links',
    onHover: {
      color: '#DD6EDD',
      data: [
        {
          str: 'resume',
          action: {
            url: 'http://kozak.digital/_files/kozak_resume.pdf',
          },
        },
        {
          str: 'imdb',
          action: {
            url: 'https://www.imdb.com/name/nm3362994/',
          },
        },
        {
          str: 'github',
          action: {
            url: 'https://github.com/mpkozak',
          },
        },
        {
          str: 'linkedin',
          action: {
            url: 'https://www.linkedin.com/in/mpkozak/',
          },
        },
        {
          str: 'codepen',
          action: {
            url: 'https://codepen.io/mpkozak/pen/XoWNOQ',
          },
        },
      ],
    },
  },
};





export const layouts = {
  desktop: {
    title: {
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
