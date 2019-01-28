
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

const color0 = '#FFFFFF';
const color1 = '#D24141';
const color2 = '#FFAF24';
const color3 = '#2BB62B';
const color4 = '#2AB2B2';
const color5 = '#5C98FF';
const color6 = '#DD6EDD';

content.title.fill = color0;
content.name.fill = color1;
content.skills.fill = color2;
content.contact.fill = color2;
content.projects.fill = color2;
content.links.fill = color2;
content.skills.hover.fill = color3;
content.contact.hover.fill = color4;
content.projects.hover.fill = color5;
content.links.hover.fill = color6;



Object.freeze(content);

export default content;


// content.title.fill = '#FFFFFF'
// content.name.fill = '#CB3030'
// const staticFill = '#FDA50F';

// content.skills.hover.fill = '#2BB62B';
// content.projects.hover.fill = '#5CA0FF';
// content.contact.hover.fill = '#29AEAE';
// content.links.hover.fill = '#CB70FF';

// content.skills.fill = staticFill;
// content.projects.fill = staticFill;
// content.contact.fill = staticFill;
// content.links.fill = staticFill;





// content.title.fill = '#FFFFFF'
// content.name.fill = '#CB3030'

// const staticFill = '#FDA50F';
// content.skills.fill = staticFill;
// content.projects.fill = staticFill;
// content.contact.fill = staticFill;
// content.links.fill = staticFill;

// content.skills.hover.fill = '#24C324';
// content.projects.hover.fill = '#00A2FF';
// content.contact.hover.fill = '#2AA7A7';
// content.links.hover.fill = '#AF57E4';
