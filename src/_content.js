const content = {};

content.text = [
  {
    str: 'this is not a website',
    fill: '#FFFFFF',
    cl: 'fixed',
    posX: .5,
    posY: .5,
    t: 1000,
  },
  {
    str: 'm. parker kozak',
    fill: '#CB3030',
    cl: 'fixed',
    posX: .75,
    posY: .6,
    t: 2000,
  },
  {
    str: 'projects',
    fill: '#FDA50F',
    cl: 'static',
    hover: 'projects',
    posX: .22,
    posY: .18,
    t: 2750,
  },
  {
    str: 'skills',
    fill: '#FDA50F',
    cl: 'static',
    hover: 'skills',
    posX: .7,
    posY: .4,
    t: 2500,
  },
  {
    str: 'links',
    fill: '#FDA50F',
    cl: 'static',
    hover: 'links',
    posX: .15,
    posY: .9,
    t: 3250,
  },
  {
    str: 'contact',
    fill: '#FDA50F',
    cl: 'static',
    hover: 'contact',
    posX: .85,
    posY: .75,
    t: 3000,
  }
];

content.projects = {
  display: [
    {
      str: 'drive my car',
      action: 'drive'
    },
    {
      str: 'sleepy',
      action: 'sleepy'
    },
    {
      str: 'αdex',
      action: 'adex'
    }
  ],
  data: {
    drive: {
      name: 'drive my car',
      date: 'sep 2018',
      tech: ['javascript', 'html', 'css'],
      git: 'https://github.com/mpkozak/drive/',
      url: 'https://kozak.digital/drive',
      ratio: (16 / 9)
    },
    sleepy: {
      name: 'sleepy',
      date: 'oct 2018',
      tech: ['react', 'd3', 'sql', 'node', 'express'],
      git: '#',
      url: 'https://kozak.digital/sleepy',
      ratio: (9 / 16)
    },
    adex: {
      name: 'αdex',
      date: 'dec 2018',
      tech: ['webaudio api', 'react', 'd3'],
      git: 'https://github.com/mpkozak/a.dex/',
      url: 'https://kozak.digital/adex',
      ratio: (17 / 15)
    },
  },
  fill: '#0089FF',
  offsetX: 0,
  offsetY: 3,
  deltaX: .5,
  deltaY: 2
};

content.skills = {
  display: [
    { str: 'css' },
    { str: 'html' },
    { str: 'bash' },
    { str: 'sql' },
    { str: 'express' },
    { str: 'node' },
    { str: 'webaudio api' },
    { str: 'd3+svg' },
    { str: 'react' },
    { str: 'javascript' }
  ],
  fill: '#20BB20',
  offsetX: 0,
  offsetY: -2,
  deltaX: .3,
  deltaY: -1
};

content.links = {
  display: [
    {
      str: 'resume',
      action: 'http://kozak.digital/_files/kozak_resume.pdf'
    },
    {
      str: 'imdb',
      action: 'https://www.imdb.com/name/nm3362994/'
    },
    {
      str: 'github',
      action: 'https://github.com/mpkozak'
    },
    {
      str: 'linkedin',
      action: 'https://www.linkedin.com/in/mpkozak/'
    },
    {
      str: 'codepen',
      action: 'https://codepen.io/mpkozak/pen/XoWNOQ'
    },
  ],
  fill: '#8E00FF',
  offsetX: 2,
  offsetY: -2,
  deltaX: .75,
  deltaY: -2
};

content.contact = {
  display: [
    {
      str: 'mparkerkozak@gmail.com',
      action: 'mailto:mparkerkozak@gmail.com'
    }
  ],
  fill: '#20A0A1',
  offsetX: -16,
  offsetY: 2,
  deltaX: 0,
  deltaY: 1
};

content.inheritPosition = () => {
  content.text.forEach(d => {
    // d.cl = 'static';
    if (d.hover) {
      const { posX, posY } = d;
      Object.assign(content[d.hover], { posX, posY });
    };
  });
};


content.inheritPosition();


module.exports = content;
