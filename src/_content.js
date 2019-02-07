const content = {
  title: {
    str: 'this is not a website',
    cl: 'fixed',
    t: 1000,
    hover: false
  },
  name: {
    str: 'm. parker kozak',
    cl: 'fixed',
    t: 2000,
    hover: false
  },
  skills: {
    str: 'skills',
    cl: 'fixed',
    t: 2500,
    hover: {
      subset: [
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
    },
  },
  projects: {
    str: 'projects',
    cl: 'fixed',
    t: 2750,
    hover: {
      subset: [
        {
          str: 'drive my car',
          click: 'drive'
        },
        {
          str: 'sleepy',
          click: 'sleepy'
        },
        {
          str: 'αdex',
          click: 'adex'
        },
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
    },
  },
  contact: {
    str: 'contact',
    cl: 'fixed',
    t: 3000,
    hover: {
      subset: [
        {
          str: 'mparkerkozak@gmail.com',
          strAlt: 'email',
          click: 'mailto:mparkerkozak@gmail.com'
        }
      ],
    },
  },
  links: {
    str: 'links',
    cl: 'fixed',
    t: 3250,
    hover: {
      subset: [
        {
          str: 'resume',
          click: 'http://kozak.digital/_files/kozak_resume.pdf'
        },
        {
          str: 'imdb',
          click: 'https://www.imdb.com/name/nm3362994/'
        },
        {
          str: 'github',
          click: 'https://github.com/mpkozak'
        },
        {
          str: 'linkedin',
          click: 'https://www.linkedin.com/in/mpkozak/'
        },
        {
          str: 'codepen',
          click: 'https://codepen.io/mpkozak/pen/XoWNOQ'
        },
      ]
    }
  }
};

const colors = [
  '#FFFFFF',
  '#D24141',
  '#FFAF24',
  '#2BB62B',
  '#2AB2B2',
  '#5C98FF',
  '#DD6EDD'
];

content.title.fill = colors[0];
content.name.fill = colors[1];
content.skills.fill = colors[2];
content.contact.fill = colors[2];
content.projects.fill = colors[2];
content.links.fill = colors[2];
content.skills.hover.fill = colors[3];
content.contact.hover.fill = colors[4];
content.projects.hover.fill = colors[5];
content.links.hover.fill = colors[6];

Object.freeze(content);



export default content;
