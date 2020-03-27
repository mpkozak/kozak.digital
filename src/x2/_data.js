

const layouts = {
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
      offsetX: 4,
      offsetY: -2,
      deltaX: .7,
      deltaY: -1,
    },
    projects: {
      posX: .22,
      posY: .18,
      offsetX: 9,
      offsetY: 3,
      deltaX: -1,
      deltaY: 2,
    },
    contact: {
      posX: .85,
      posY: .75,
      offsetX: -4,
      offsetY: 3,
      deltaX: 0,
      deltaY: 1,
    },
    links: {
      posX: .15,
      posY: .9,
      offsetX: 5,
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
      posX: .7,
      posY: .6,
    },
    skills: {
      posX: .7,
      posY: .4,
      offsetX: 6,
      offsetY: -2,
      deltaX: -.65,
      deltaY: -1,
    },
    projects: {
      posX: .22,
      posY: .18,
      offsetX: 8,
      offsetY: 3,
      deltaX: -1.5,
      deltaY: 2,
    },
    contact: {
      posX: .82,
      posY: .75,
      offsetX: -2,
      offsetY: 3,
      deltaX: 0,
      deltaY: 1,
    },
    links: {
      posX: .2,
      posY: .9,
      offsetX: 6,
      offsetY: -2,
      deltaX: -1,
      deltaY: -2,
    },
  },
  mobileH: {
    title: {
      posX: .5,
      posY: .5,
    },
    name: {
      posX: .75,
      posY: .65,
    },
    skills: {
      posX: .65,
      posY: .1,
      offsetX: 7,
      offsetY: 2,
      deltaX: 1.2,
      deltaY: 1,
    },
    projects: {
      posX: .2,
      posY: .14,
      offsetX: 9,
      offsetY: 2,
      deltaX: 2,
      deltaY: 2,
    },
    contact: {
      posX: .82,
      posY: .75,
      offsetX: -2,
      offsetY: 2,
      deltaX: 0,
      deltaY: 1,
    },
    links: {
      posX: .24,
      posY: .85,
      offsetX: 0,
      offsetY: -2,
      deltaX: -1,
      deltaY: -2,
    },
  },
};





export const setContent = (layout = 'desktop') => {
  const data = {
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
            action: layout === 'desktop'
              ? { iframe: 'drive' }
              : { url: 'https://kozak.digital/drive' },
          },
          {
            str: 'sleepy',
            action: layout === 'desktop'
              ? { iframe: 'sleepy' }
              : { url: 'https://kozak.digital/sleepy' },
          },
          {
            str: 'αdex',
            action: layout === 'desktop'
              ? { iframe: 'adex' }
              : { url: 'https://kozak.digital/adex' },
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
          layout === 'desktop'
            ? { str: 'mparkerkozak@gmail.com' }
            : {
                str: layout === 'mobileV'
                  ? 'email'
                  : 'mparkerkozak@gmail.com',
                action: { mail: 'mailto:mparkerkozak@gmail.com' }
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

  if (layout === 'mobileH') {
    data.skills.onHover.data = data.skills.onHover.data.reverse();
  };

  Object.keys(layouts[layout]).forEach(key => {
    data[key].layout = layouts[layout][key];
  });

  return data;
};





export const iframes = {
  drive: {
    name: 'drive my car',
    date: 'sep 2018',
    tech: ['javascript', 'html', 'css'],
    git: 'https://github.com/mpkozak/drive/',
    url: 'https://kozak.digital/drive',
    ratio: (16 / 9),
    scale: 1.26,
  },
  sleepy: {
    name: 'sleepy',
    date: 'oct 2018',
    tech: ['react', 'd3', 'sql', 'node', 'express'],
    git: '#',
    url: 'https://kozak.digital/sleepy',
    ratio: (9 / 16),
    scale: 1,
  },
  adex: {
    name: 'αdex',
    date: 'dec 2018',
    tech: ['webaudio api', 'react', 'svg', 'd3'],
    git: 'https://github.com/mpkozak/a.dex/',
    url: 'https://kozak.digital/adex',
    ratio: (17 / 15),
    scale: 1.04,
  },
};
