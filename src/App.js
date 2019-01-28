import React, { PureComponent } from 'react';
import './App.css';
import { d3 } from './_d3.js'
import { randomLetter, emptyGrid } from './_help.js';
// import { content } from './_content.js';
// import { layout } from './_layout.js'
// import {content} from './_new.js'
import { main, mobileV, mobileH } from './_layout.js';
import { content } from './_content.js';

export default class AppMobile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: props.isMobile,
      isLoaded: false,
      isResizing: false,
      isHorizontal: false,
      iframeFocus: false,
      cols: undefined,
      rows: undefined,
      projects: false,
      skills: false,
      links: false,
      contact: false
    };
    this.content = content;
    this.layout = {};
    this.celRatio = (2 / 3);
    this.celHeight = 18;
    this.celWidth = this.celHeight * this.celRatio;
    this.grid = [];
    this.lastHover = false;
    this.url = '';
    this.containerStyle = {};
    // this.layoutRefresh = this.layoutRefresh.bind(this);
    // this.layoutRefreshMobile = this.layoutRefreshMobile.bind(this);
    // this.handleClick = this.handleClick.bind(this);
    // this.handleHover = this.handleHover.bind(this);
    // this.handleTouchMove = this.handleTouchMove.bind(this);
  };

  componentDidMount() {
    if (this.state.isMobile) {
      this.layoutRefreshMobile();
      this.refs.grid.addEventListener('touchmove', this.handleTouchMove);
      window.addEventListener('resize', this.layoutRefreshMobile);
    } else {
      this.layoutRefresh();
      window.addEventListener('resize', this.layoutRefresh);
    };




    // window.addEventListener('contextmenu', (e) => {
    //   e.preventDefault();
    //   if (e.target.classList[0] === 'contact') console.log(e)
    // })


    // // Object.assign(this, content);

  };


// //////////////////////////
// // LAYOUT BUILD METHODS //
// //////////////////////////

  layoutRefresh() {
    // if (!this.state.isResizing) {
    //   clearTimeout(this.introTimeout);
    //   clearTimeout(this.hoverTimeout);
    //   this.setState(prevState => ({ isResizing: true }));
    //   this.undrawGrid(this.grid);
    // };
    // if (this.state.iframeFocus) {
    //   this.containerStyle = {};
    //   this.setState(prevState => ({ iframeFocus: false }));
    // };
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.celHeight = 14;
      this.celWidth = this.celHeight * this.celRatio;


    // this.content = {
    //   ...Object.keys(content).map(d => {
    //     return Object.assign({}, content[d], main[d]);
    //   })
    // };

      // this.content = Object.keys(content).map(d => {
      //   return {[d]: Object.assign({}, content[d], main[d])};
      // });

      this.content = {...content};
      // const temp = {}
      Object.keys(this.content).forEach(d => {
        Object.assign(this.content[d], main[d]);
      });
      this.content = {};

      Object.keys(content).forEach(d => {
        Object.assign(content[d], mobileV[d]);
      });

  console.log(content.skills, this.content.skills)

// const temp = Object.assign({}, main, content)
// Object.assign(temp, main)



      this.configureCels();
      this.makeGrid();
    }, 500);
  };

  layoutRefreshMobile() {
    clearTimeout(this.introTimeout);
    // this.undrawGrid(this.grid);
    this.celHeight = 18;
    this.celWidth = this.celHeight * this.celRatio;
    const isHorizontal = this.configureCels();
    const layout = isHorizontal ? mobileH : mobileV;
    this.content = {
      ...Object.keys(content).map(d => {
        return Object.assign({}, content[d], layout[d]);
      })
    };
    this.makeGrid(isHorizontal);
  };

  configureCels() {
    const { innerWidth, innerHeight } = window;
    const { isMobile } = this.state;
    const isHorizontal = innerWidth > innerHeight;
    const w = innerWidth / (!isMobile ? 56 : (isHorizontal ? 50 : 31));
    const h = innerHeight / (!isMobile ? 32 : (isHorizontal ? 21 : 30));
    if (w < this.celWidth || h < this.celHeight) {
      if (w < h * this.celRatio) {
        this.celWidth = w;
        this.celHeight = w / this.celRatio;
      } else {
        this.celWidth = h * this.celRatio;
        this.celHeight = h;
      };
    };
    return isHorizontal;
  };




//   // configureTextMobile(isHorizontal) {
//   //   const { text, projects, skills, links, contact } = this;
//   //   if (isHorizontal) {
//   //     text[0].posY = .75;
//   //     text[1].posY = .85;
//   //     text[2].posX = .15;
//   //     text[2].posY = .14;
//   //     text[3].posX = .45;
//   //     text[3].posY = .58;
//   //     text[4].posX = .24;
//   //     text[5].posX = .82;
//   //     text[5].posY = .35;
//   //     projects.offsetX = 6;
//   //     projects.offsetY = 2;
//   //     projects.deltaX = 1;
//   //     skills.offsetX = -2;
//   //     skills.deltaX = 1.2;
//   //     links.offsetX = -3;
//   //     links.deltaX = -1;
//   //     contact.display[0].str = 'mparkerkozak@gmail.com';
//   //     contact.offsetX = -2;
//   //     contact.offsetY = 3;
//   //   } else {
//   //     text[0].posY = .5;
//   //     text[1].posY = .6;
//   //     text[2].posX = .22;
//   //     text[2].posY = .18;
//   //     text[3].posX = .7;
//   //     text[3].posY = .4;
//   //     text[4].posX = .15;
//   //     text[5].posX = .85;
//   //     text[5].posY = .75;
//   //     projects.offsetX = 3;
//   //     projects.offsetY = 3;
//   //     projects.deltaX = 1;
//   //     skills.offsetX = 5;
//   //     skills.deltaX = -.7;
//   //     links.offsetX = 2;
//   //     links.deltaX = .9;
//   //     contact.display[0].str = 'email';
//   //     contact.offsetX = -5;
//   //     contact.offsetY = 3;
//   //   };
//   //   content.inheritPosition();
//   // };

  makeGrid(isHorizontal = false) {
    const { celHeight, celWidth, content } = this;
    const { isMobile, isLoaded } = this.state;
    const { grid } = this.refs;
    const margin = isMobile ? 0 : -2;
    const cols = Math.floor(window.innerWidth / celWidth) + (margin * 2);
    const rows = Math.floor(window.innerHeight / celHeight) + margin;
    const width = cols * celWidth;
    const height = rows * celHeight;

    d3.selectAll('text').remove();
    grid.style.width = width + 'px';
    grid.style.height = height + 'px';

    this.drawGrid(this.grid =
      emptyGrid(cols, rows, isLoaded ? false : (isMobile ? 300 : 500))
    );

    // console.log(content)
    // Object.keys(content).forEach(d => {
    //   this.introTimeout = setTimeout(() => {
    //     console.log('in draw', d)
    //     // const queue = this.populateGrid(content[d]);
    //     // this.undrawGrid(queue);
    //     // this.drawGrid(queue);
    //   }, isLoaded ? (d.t / 4) : d.t);

    // })
    // text.forEach(d => {
    //   this.introTimeout = setTimeout(() => {
    //     const queue = this.populateGrid(d);
    //     this.undrawGrid(queue);
    //     this.drawGrid(queue);
    //   }, isLoaded ? (d.t / 4) : d.t);
    // });

    // this.setState(prevState => ({
    //   isHorizontal,
    //   cols,
    //   rows,
    //   isLoaded: true,
    //   isResizing: false
    // }));
  };


// /////////////////////
// // D3 DRAW METHODS //
// /////////////////////

  drawGrid(cels) {
    const { celHeight, celWidth } = this;
    d3.select(this.refs.grid).selectAll('g').data(cels)
      .enter().append('text')
        .text(d => d.text)
        .attr('id', d => d.id)
        .attr('class', d => d.cl ? d.cl : null)
        .style('position', 'absolute')
        .style('width', celWidth + 'px')
        .style('height', celHeight + 'px')
        .style('left', d => d.c * celWidth + 'px')
        .style('top', d => d.r * celHeight + 'px')
        .style('background-color', 'rgba(0, 0, 0, 0)')
        // .style('color', d => d.fill ? d.fill : '#999999')
        .style('color', d => d.fill ? d.fill : '#4A4B4D')
        .style('font-size', celHeight + 'px')
        .style('text-align', 'center')
        .style('opacity', 0)
        .on('mouseenter', !this.state.isMobile ? this.handleHover : null)
        .on('click', this.handleClick)
      .transition().delay(d => d.delay)
        // .style('opacity', d => d.cl ? 1 : .35);
        .style('opacity', d => 1);
  };

//   undrawGrid(cels) {
//     cels.forEach(d => {
//       d3.select(`#${d.id}`)
//           .attr('class', 'delete')
//           .attr('id', null)
//           .on('mouseover', null)
//           .on('click', null)
//         .transition()
//           .delay(Math.floor(d.delay / 1.5))
//           .style('opacity', 0)
//           .remove();
//     });
//   };

//   letterSwap(cel) {
//     cel.text = randomLetter();
//     // d3.select(`#${cel.id}`)
//     //   .transition()
//     //     .style('opacity', 0)
//     //   .transition()
//     //     .text(cel.text)
//     //     .style('opacity', .35);

//     d3.select(`#${cel.id}`)
//       .transition()
//         .style('opacity', 0)
//       .transition()
//         .duration(cel.delay * 4)
//         .text(cel.text)
//         .style('opacity', .25)
//       .transition()
//         .duration(cel.delay * 10)
//         .delay(cel.delay * 5)
//         .text(cel.text)
//         .style('opacity', 1);
//   };


// //////////////////////////
// // GRID REFRESH METHODS //
// //////////////////////////

  populateGrid({ str, fill, cl, hover, action, posX, posY, adjC, adjR, delayIncr = 1 }) {
    const { isMobile, cols, rows } = this.state;
    const queue = [];
    const r = Math.floor(posY * rows) + (adjR ? adjR : 0);
    const midpoint = (-str.length / 2);
    let c = Math.floor(
      (posX * cols) +
      (adjC ? adjC : (!isMobile ? midpoint : 0)) +
      (isMobile ? midpoint : 0)
    );
    str.split('').forEach((text, i) => {
      const cel = this.grid[cols * r + c++];
      if (text !== ' ') {
        queue.push(Object.assign(cel, {
          text,
          fill,
          cl,
          hover,
          action,
          delay: Math.floor(250 * (((delayIncr + i) / str.length) + Math.random()))
        }));
      };
    });
    return queue;
  };




//   showSubset(cl, { display, fill, posX, posY, offsetX, offsetY, deltaX, deltaY }) {
//     const queue = [];
//     display.forEach((d, i) => {
//       queue.push(...this.populateGrid({
//         fill,
//         cl,
//         posX,
//         posY,
//         str: d.str,
//         action: d.action,
//         adjC: offsetX + (deltaX * i) + (2 * Math.random() - 1),
//         adjR: offsetY + (deltaY * i),
//         delayIncr: ((i + 1) / 2)
//       }));
//     });
//     this.undrawGrid(queue);
//     this.drawGrid(queue);
//   };

//   replaceCels(cels) {
//     let fill, cl, hover, action;
//     const queue = cels.map((cel, i) => {
//       return Object.assign(cel, {
//         fill,
//         cl,
//         hover,
//         action,
//         text: randomLetter()
//       });
//     });
//     this.undrawGrid(queue);
//     this.drawGrid(queue);
//   };

//   hideSubset(cl) {
//     const cels = this.grid.filter(d =>
//       cl ? d.cl === cl : d.cl
//     );
//     this.replaceCels(cels);
//   };


// ////////////////////
// // IFRAME METHODS //
// ////////////////////

//   setIframeSize(iframeFocus) {
//     const { ratio } = this.projects.data[iframeFocus];
//     const { celHeight, celWidth } = this;
//     const { cols, rows } = this.state;

//     let width = cols - 10;
//     let height = Math.round((width * celWidth / ratio) / celHeight);
//     if (height > (rows - 5)) {
//       height = rows - 5;
//       width = Math.round(height * celHeight * ratio / celWidth);
//     };
//     const startCol = Math.floor((cols - width) / 2);
//     const startRow = Math.max(Math.floor((rows - height) / 3), 2);

//     this.containerStyle = {
//       width: (width * celWidth).toFixed(2) + 'px',
//       height: (height * celHeight).toFixed(2) + 'px',
//       left: (startCol * celWidth).toFixed(2) + 'px',
//       top: (startRow * celHeight).toFixed(2) + 'px',
//     };

//     return { width, height, startCol, startRow };
//   };

//   makeIframeText(url, startRow, height) {
//     const queue = this.populateGrid({
//       str: url.substring(8),
//       fill: '#FDA50F',
//       cl: 'info',
//       action: url,
//       posX: .5,
//       posY: (startRow + height) / this.state.rows,
//       adjR: 1,
//     });
//     this.undrawGrid(queue);
//     this.drawGrid(queue);
//   };

//   showIframe(iframeFocus) {
//     const { width, height, startCol, startRow } =
//       this.setIframeSize(iframeFocus);
//     this.url = this.projects.data[iframeFocus].url;
//     this.setState(prevState => ({ iframeFocus }));
//     this.hideSubset();

//     const clear = this.grid.filter(d =>
//       d.c >= startCol &&
//       d.c < (startCol + width) &&
//       d.r >= startRow &&
//       d.r < (startRow + height)
//     );
//     clear.forEach(d => {
//       d.cl = 'hidden';
//       d.delay = Math.floor(1500 * Math.random());
//     });
//     this.undrawGrid(clear);

//     this.makeIframeText(this.url, startRow, height);
//   };

//   hideIframe() {
//     this.replaceCels(this.grid.filter(d =>
//       d.cl === 'hidden' || d.cl === 'info'
//     ));
//     this.text.forEach(d => {
//       const queue = this.populateGrid(d);
//       this.undrawGrid(queue);
//       this.drawGrid(queue);
//     });
//       this.url = false;
//       this.setState(prevState => ({ iframeFocus: false }));
//   };


// /////////////////////
// // EVENT CALLBACKS //
// /////////////////////

//   toggleSubset(hover) {
//     if (this.state[hover]) {
//       this.hideSubset(hover);
//     } else {
//       this.showSubset(hover, this[hover]);
//     };
//     this.setState(prevState => ({ [hover]: !prevState[hover] }));
//   };

//   toggleClickAction(cl, action, isMobile) {
//     switch (cl) {
//       case 'projects' :
//         if (isMobile) {
//           window.open(this.projects.data[action].url, '_blank');
//         } else {
//           this.showIframe(action);
//         };
//         break;
//       case 'links' :
//         window.open(action, '_blank');
//         break;
//       case 'contact' :
//         if (isMobile) {
//           window.location = action;
//         };
//         break;
//       case 'info' :
//         window.open(action, '_blank');
//         break;
//       default : return null;
//     };
//   };


// ////////////////////
// // EVENT HANDLERS //
// ////////////////////

//   handleClick(cel) {
//     const { cl, hover, action } = cel;
//     const { isMobile, iframeFocus } = this.state;
//     if (!isMobile && !action && iframeFocus) {
//       this.hideIframe();
//     } else if (hover) {
//       this.handleHover(cel);
//     } else if (!cl) {
//       this.letterSwap(cel);
//     } else {
//       this.toggleClickAction(cl, action, isMobile);
//     };
//   };

//   handleHover(cel) {
//     if (cel.hover && cel.hover !== this.lastHover) {
//       clearTimeout(this.hoverTimeout);
//       this.lastHover = cel.hover;
//       this.toggleSubset(cel.hover);
//       this.hoverTimeout = setTimeout(() => {
//         this.lastHover = false;
//       }, 1000);
//     } else if (!cel.cl) {
//       this.letterSwap(cel);
//     };
//   };

//   handleTouchMove(e) {
//     e.preventDefault();
//     const { clientX, clientY } = e.changedTouches[0];
//     const el = document.elementFromPoint(clientX, clientY);
//     const cel = el ? this.grid[el.id.substring(3)] : null;
//     if (cel) {
//       this.handleHover(cel);
//     };
//   };


////////////
// RENDER //
////////////

  render() {
    const { isMobile, isHorizontal, iframeFocus } = this.state;
    const appStyle = isMobile
      ? {
          height: isHorizontal ? '100vh' : '100%',
          justifyContent: isHorizontal ? 'flex-end' : 'center'
        }
      : null;
    const mainStyle = isMobile
      ? {
          margin: isHorizontal
            ? 0
            : (window.innerHeight - (this.refs.grid || 0).clientHeight) / 3 +
              'px 0 0 0'
        }
      : null;
    const gridStyle = !isMobile
      ? { margin: this.celHeight / 3 + 'px 0 0 0' }
      : null;
    const toggleHide = iframeFocus ? 'active ' : 'inactive';

    return (
      <div id="App" style={appStyle}>
        <div id="main" style={mainStyle}>
          <div ref="grid" className={iframeFocus ? 'esc' : ''} style={gridStyle} />
          {!isMobile &&
            <div id="container" className={toggleHide} style={this.containerStyle}>
              <iframe
                id="iframe"
                className={toggleHide + (iframeFocus || '')}
                allow="camera;microphone"
                src={this.url || null}
                title="project"
                scrolling="no"
              />
            </div>
          }
        </div>
      </div>
    );
  };


// render() {
//   return <div/>
// }

};
