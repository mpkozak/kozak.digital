import { layouts } from './';





export default function getContent(displayLayout = 'desktop') {
  const content = {
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
            action: displayLayout === 'desktop'
              ? { iframe: 'drive' }
              : { url: 'https://kozak.digital/drive' },
          },
          // {
          //   str: 'sleepy',
          //   action: displayLayout === 'desktop'
          //     ? { iframe: 'sleepy' }
          //     : { url: 'https://kozak.digital/sleepy' },
          // },
          {
            str: 'pxcels',
            action: displayLayout === 'desktop'
              ? { iframe: 'pxcels' }
              : { url: 'https://kozak.digital/pxcels' },
          },
          {
            // str: 'αdex',
            str: `${String.fromCharCode(0x03B1)}dex`,
            action: displayLayout === 'desktop'
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
          displayLayout === 'desktop'
            ? { str: 'mparkerkozak@gmail.com' }
            : {
                str: displayLayout === 'mobileV'
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

  if (displayLayout === 'mobileH') {
    content.skills.onHover.data = content.skills.onHover.data.reverse();
  };

  for (let key in content) {
    content[key].layout = layouts[displayLayout][key];
  };

  return content;
};
