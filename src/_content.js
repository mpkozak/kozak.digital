

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
          strMobileV: 'email',
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
}



content.title.fill = '#FFFFFF'
content.name.fill = '#CB3030'

const staticFill = '#FDA50F';
content.skills.fill = staticFill;
content.projects.fill = staticFill;
content.contact.fill = staticFill;
content.links.fill = staticFill;

content.skills.hover.fill = '#24C324';
content.projects.hover.fill = '#00A2FF';
content.contact.hover.fill = '#AF57E4';
content.links.hover.fill = '#2AA7A7';

Object.freeze(content)


export default content;




// console.log(main)


// module.exports = { content };


// export default Object.assign(...content, ...main);
// module.exports = content







//   {

//     // fill: '#FFFFFF',    // posX: undefined,
//     // posY: undefined,
//     t: 1000,
//   },
//   {
//     str: 'm. parker kozak',
//     // fill: '#CB3030',
//     cl: 'fixed',
//     posX: undefined,
//     posY: undefined,
//     t: 2000,
//   },
//   {
//     str: 'projects',
//     // fill: '#FDA50F',
//     cl: 'static',
//     // hover: 'projects',
//     posX: undefined,
//     posY: undefined,
//     t: 2750,
//   },
//   {
//     str: 'skills',
//     // fill: '#FDA50F',
//     cl: 'static',
//     // hover: 'skills',
//     t: 2500,
//   },
//   {
//     str: 'links',
//     // fill: '#FDA50F',
//     cl: 'static',
//     // hover: 'links',
//     posX: undefined,
//     posY: undefined,
//     t: 3250,
//   },
//   {
//     str: 'contact',
//     // fill: '#FDA50F',
//     cl: 'static',
//     // hover: 'contact',
//     posX: undefined,
//     posY: undefined,
//     t: 3000,
//   }
// ];


// content.projects = {
//   display: [
//     {
//       str: 'drive my car',
//       action: 'drive'
//     },
//     {
//       str: 'sleepy',
//       action: 'sleepy'
//     },
//     {
//       str: 'αdex',
//       action: 'adex'
//     }
//   ],
//   data: {
//     drive: {
//       name: 'drive my car',
//       date: 'sep 2018',
//       tech: ['javascript', 'html', 'css'],
//       git: 'https://github.com/mpkozak/drive/',
//       url: 'https://kozak.digital/drive',
//       ratio: (16 / 9)
//     },
//     sleepy: {
//       name: 'sleepy',
//       date: 'oct 2018',
//       tech: ['react', 'd3', 'sql', 'node', 'express'],
//       git: '#',
//       url: 'https://kozak.digital/sleepy',
//       ratio: (9 / 16)
//     },
//     adex: {
//       name: 'αdex',
//       date: 'dec 2018',
//       tech: ['webaudio api', 'react', 'd3'],
//       git: 'https://github.com/mpkozak/a.dex/',
//       url: 'https://kozak.digital/adex',
//       ratio: (17 / 15)
//     },
//   },
// // orig
//   // fill: '#0089FF',
// // scaled
//   // fill: '#0077DD',
//   offsetX: 0,
//   offsetY: 3,
//   deltaX: .5,
//   deltaY: 2
// };

// content.skills = {
//   display: [
//     { str: 'css' },
//     { str: 'html' },
//     { str: 'bash' },
//     { str: 'sql' },
//     { str: 'express' },
//     { str: 'node' },
//     { str: 'webaudio api' },
//     { str: 'd3+svg' },
//     { str: 'react' },
//     { str: 'javascript' }
//   ],
// // orig
//   // fill: '#20BB20',
// // new
//   // fill: '#20AA20',
// // scaled
//   // fill: '#1C981C',
//   offsetX: 0,
//   offsetY: -2,
//   deltaX: .3,
//   deltaY: -1
// };

// content.links = {
//   display: [
//     {
//       str: 'resume',
//       action: 'http://kozak.digital/_files/kozak_resume.pdf'
//     },
//     {
//       str: 'imdb',
//       action: 'https://www.imdb.com/name/nm3362994/'
//     },
//     {
//       str: 'github',
//       action: 'https://github.com/mpkozak'
//     },
//     {
//       str: 'linkedin',
//       action: 'https://www.linkedin.com/in/mpkozak/'
//     },
//     {
//       str: 'codepen',
//       action: 'https://codepen.io/mpkozak/pen/XoWNOQ'
//     },
//   ],
// // orig
//   // fill: '#8E00FF',
// // new
//   // fill: '#AA55DD',
// // scaled
//   // fill: '#A954DC',
//   offsetX: 2,
//   offsetY: -2,
//   deltaX: .75,
//   deltaY: -2
// };

// content.contact = {
//   display: [
//     {
//       str: 'mparkerkozak@gmail.com',
//       action: 'mailto:mparkerkozak@gmail.com'
//     }
//   ],
// // orig
//   // fill: '#20A0A1',
// // new
//   // fill: '#33AAAA',
// //scaled
//   // fill: '#36B5B5',
//   offsetX: -16,
//   offsetY: 2,
//   deltaX: 0,
//   deltaY: 1
// };


// // content.projects.fill = '#00A2FF';
// // content.skills.fill = '#24C324';
// // content.links.fill = '#AF57E4';
// // content.contact.fill = '#2AA7A7';

// // name =/= contact
//   content.text[1].fill = 'hsl(0, 70%, 50%)';
//   content.contact.fill = 'hsl(180, 70%, 50%)';

// // skills =/= links
//   content.skills.fill = 'hsl(120, 70%, 50%)';
//   content.links.fill = 'hsl(300, 70%, 50%)';

// // projects =/= static
//   content.projects.fill = 'hsl(218, 100%, 80%)';
//   content.text.forEach((d, i) => {
//     if (i >= 2) {
//       d.fill = 'hsl(38, 100%, 50%)'
//     };
//   });





// // console.log('content initial ', content)

// // console.log('layouts in content ', main, mobileV, mobileH )

// // const styledContent = [main, mobileV, mobileH].map(d => {
// //   // return Object.assign(content, d);
// //   return Object.assign(d, {...content});
// // })


// // // console.log('styled content ', styledContent )
// // console.log('styled content ', styledContent )
// // // console.log('layouts after assign ', main, mobileV, mobileH )





// const assignStyle = (style) => {
//   Object.keys(content).forEach(d => {
//     // Object.keys(d)
//     const out = Object.assign(content[d], style[d])
//     console.log('out', out)
//   })
// }

// assignStyle(main)


// console.log(content)



// // content.inheritPosition = () => {
// //   content.text.forEach(d => {
// //     // d.cl = 'static';
// //     if (d.hover) {
// //       const { posX, posY } = d;
// //       Object.assign(content[d.hover], { posX, posY });
// //     };
// //   });
// // };


// // content.inheritPosition();

// module.exports = { content };
