import React, { PureComponent } from 'react';
import { d3, randomLetter, emptyGrid } from './_help.js';
import content from './_content.js';
import './App.css';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rows: undefined,
      cols: undefined,
      isLoaded: false,
      resize: false,

      skills: false,
      projects: false,
      contact: false,
      links: false,

      focus: false,
    };

    this.celRatio = (2 / 3);
    this.celHeight = 14;
    this.celWidth = this.celHeight * this.celRatio;
    this.grid = [];
    this.url = '';
    this.iframeStyle = {};

    this.handleResize = this.handleResize.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.makeGrid = this.makeGrid.bind(this);
  };


  componentDidMount() {
    Object.assign(this, content);
    window.addEventListener('resize', this.handleResize);
    this.makeGrid();
  };

  makeGrid() {
    const { celHeight, celWidth, text } = this;
    const { minWidth, minHeight } = this.props;
    const { isLoaded } = this.state;
    const { svg } = this.refs;
    const cols = Math.floor((Math.max(window.innerWidth, minWidth) * .95) / celWidth);
    const rows = Math.floor((Math.max(window.innerHeight, minHeight) * .95) / celHeight);
    const width = cols * celWidth;
    const height = rows * celHeight;

    d3.selectAll('text').remove();
    svg.style.width = width;
    svg.style.height = height;
    svg.setAttribute('viewbox', `0 0 ${width} ${height}`);

    this.drawGrid(this.grid = emptyGrid(cols, rows, isLoaded ? 250 : 500));
    text.forEach(d => {
      d.delayIncr = !isLoaded;
      this.introTimeout = setTimeout(() => {
        const queue = this.populateGrid(d);
        this.undrawGrid(queue);
        this.drawGrid(queue);
      }, isLoaded ? 0 : d.t);
    });

    this.setState(prevState => ({ cols, rows, isLoaded: true, resize: false }));
  };


  handleResize() {
    const { focus, resize } = this.state;
    if (focus) {
      this.url = false;
      this.setState(prevState => ({ focus: false }));
    }
    if (!resize) {
      clearTimeout(this.introTimeout);
      clearTimeout(this.hoverTimeout);
      this.setState(prevState => ({ resize: false }));
      this.undrawGrid(this.grid);
    };
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(this.makeGrid, 500);
  };

  handleHover(cel) {
    const { cl, hover } = cel;
    if (hover) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = setTimeout(() => {
        if (this.state[hover]) this.hideSubset(hover);
        else this.showSubset(hover);
        this.setState(prevState => ({ [hover]: !prevState[hover] }));
      }, 200);
    } else if (!cl) {
      this.letterSwap(cel);
    };
  };

  handleClick(cel) {
    const { cl, action } = cel;
    const { focus } = this.state;
    if (!action && focus) {
      this.hideIframe();
    } else {
      switch (cl) {
        case 'projects' :
          this.showIframe(action);
          break;
        case 'links' :
          window.open(action, '_blank');
          break;
        case 'contact' :
          window.location = action;
          break;
        case 'info' :
          window.open(action, '_blank');
          break;
        default : return null;
      };
    };
  };


  drawGrid(cels) {
    const { celHeight, celWidth } = this;
    d3.select(this.refs.svg).selectAll('g')
      .data(cels).enter().append('text')
        .text(d => d.text)
        .attr('id', d => d.id)
        .attr('class', d => d.cl ? d.cl : null)
        .attr('x', d => d.c * celWidth)
        .attr('y', d => d.r * celHeight)
        .attr('font-size', celHeight)
        .attr('fill', d => d.fill ? d.fill : '#999999')
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'hanging')
        .attr('opacity', 0)
        .on('mouseover', this.handleHover)
        .on('click', this.handleClick)
      .transition().delay(d => d.delay)
        .attr('opacity', d => d.cl ? 1 : .5);
  };

  undrawGrid(cels) {
    d3.selectAll('.delete').remove();
    cels.forEach(d => {
      d3.select(`#${d.id}`)
        .attr('class', 'delete')
        .attr('id', null)
        .on('mouseover', null)
        .on('click', null)
        .transition()
          .delay(d.delay / 1.5)
          .attr('opacity', 0)
          .remove();
    });
  };

  replaceCels(cels) {
    let fill, cl, hover, action;
    const queue = cels.map((cel, i) => {
      return Object.assign(cel, {
        text: randomLetter(), fill, cl, hover, action
      });
    });
    this.undrawGrid(queue);
    this.drawGrid(queue);
  };

  letterSwap(cel) {
    cel.text = randomLetter();
    d3.select(`#${cel.id}`)
      .transition()
        .attr('opacity', 0)
      .transition()
        .text(cel.text)
        .attr('opacity', .5);
  };

  populateGrid({ str, posX, posY, fill, cl, hover, adjC, adjR, action, delayIncr = 1}) {
    // const { str, posX, posY, fill, cl, hover, adjC, adjR, action, delayIncr = 1 } = entry;
    const { cols, rows } = this.state;
    const queue = [];
    const r = Math.floor(posY * rows) + (adjR ? adjR : 0);
    let c = Math.floor((posX * cols) + (adjC ? adjC : (-str.length / 2)));
    str.split('').forEach((text, i) => {
      const cel = this.grid[cols * r + c++];
      if (text !== ' ') {
        // if (delayIncr) cel.delay = 250 * (((delayIncr + i) / str.length) + Math.random());
        cel.delay = 250 * (((delayIncr + i) / str.length) + Math.random());
        queue.push(Object.assign(cel, {
          text, fill, cl, hover, action
        }));
      };
    });
    return queue;
  };

  showSubset(cl) {
    const { display, fill, posX, posY, offsetX, offsetY, deltaX, deltaY } = this[cl];
    const queue = [];
    display.forEach((d, i) => {
      const { str, action } = d;
      const adjR = offsetY + (deltaY * i);
      const adjC = offsetX + (deltaX * i) + (2 * Math.random() - 1);
      queue.push(...this.populateGrid({
        cl, delayIncr: ((i + 1) / 2), str, posX, posY, fill, adjR, adjC, action
      }));
    });
    this.undrawGrid(queue);
    this.drawGrid(queue);
  };

  hideSubset(key) {
    const cels = this.grid.filter(d => (key ? d.cl === key : d.cl));
    this.replaceCels(cels);
  };


  setIframeDimensions(focus) {
    const { celHeight, celWidth } = this;
    const { rows, cols } = this.state;
    const { ratio } = this.projects.data[focus];
    let width = cols - 10;
    let height = Math.round((width * celWidth / ratio) / celHeight);
    if (height > (rows - 5)) {
      height = rows - 5;
      width = Math.round(height * celHeight * ratio / celWidth);
    };
    const startCol = Math.floor((cols - width) / 2);
    const startRow = Math.max(Math.floor((rows - height) / 3), 2);
    this.iframeStyle = {
      width: ((width - .5) * celWidth)  + 'px',
      height: ((height - .2) * celHeight) + 'px',
      left: ((startCol + .25) * celWidth) + 'px',
      top: ((startRow + .1) * celHeight) + 'px',
    };
    return { width, height, startCol, startRow };
  };

  showIframe(focus) {
    this.url = this.projects.data[focus].url;
    const { width, height, startCol, startRow } = this.setIframeDimensions(focus);
    this.setState(prevState => ({ focus }));
    const clear = this.grid.filter(d =>
      d.c >= startCol &&
      d.c < (startCol + width) &&
      d.r >= startRow &&
      d.r < (startRow + height)
    );
    this.hideSubset();
    clear.forEach(d => {
      d.cl = 'hidden';
      d.delay = 1500 * Math.random();
    });
    this.undrawGrid(clear);
    this.makeIframeText(focus, width, height, startCol, startRow);
  };

  hideIframe() {
    this.replaceCels(this.grid.filter(d => d.cl === 'hidden' || d.cl === 'info'));
    this.replaceCels(this.grid.filter(d => d.cl === 'hidden'));
    this.text.forEach(d => {
      const queue = this.populateGrid(d);
      this.undrawGrid(queue);
      this.drawGrid(queue);
    });
      this.url = false;
      this.setState(prevState => ({ focus: false }));
  };



// //white
// '#FFFFFF'
// //red
// '#CB3030'
// //orange
// '#FDA50F'
// //green
// '#20BB20'
// //blue
// '#0089FF'
// //purple
// '#8E00FF'
// //aqua
// '#20A0A1'





  makeIframeText(focus, width, height, startCol, startRow) {
    const { name, date, tech, url, git } = this.projects.data[focus];
    const { rows, cols } = this.state;
    const endCol = startCol + width;
    const endRow = startRow + height;
    const cl = 'info';

    const queue = [];
    queue.push(...this.populateGrid({
      cl, posX: .5, posY: 1, str: url.substring(8), fill: '#FDA50F', adjR: -2, action: url
    }));

    // queue.push(...this.populateGrid({
    //   cl, posX: .8, posY: 1, str: 'github', fill: '#8E00FF', adjR: -2, action: git
    // }));



    if ((cols - endCol) > (rows - endRow) * 2) {
      console.log('text on right')
      // const marginX = (cols - width) / 2;
      // const marginY = (height - (tech.length + 3)) / 4;
      // const posX = (endCol + (marginX / 2)) / cols;
      // const posY = (startRow + marginY) / rows;
      // // const posX = (endCol) / cols;
      // // const posY = (startRow) / rows;

      // queue.push(...this.populateGrid({
      //   posX, posY, cl, str: name, fill: '#FFFFFF', adjC: -name.length, adjR: 0
      // }));
      // queue.push(...this.populateGrid({
      //   posX, posY, cl, str: date, fill: '#CB3030', adjC: 0, adjR: 1
      // }));

      // tech.forEach((d, i) => {
      //   const fill = '#0089FF';
      //   const adjC = 4 * (Math.random() - .5) - 2;
      //   const adjR = 2 + marginY + i
      //   queue.push(...this.populateGrid({
      //     posX, posY, cl, str: d, fill, adjC, adjR
      //   }));
      // });

    } else {
      console.log('text on bottom')


    // const posY = ((endRow + 1) / rows);
    // const margin = (1 - posY) / 5;

    //   queue.push(...this.populateGrid({
    //     cl, posX: .15, posY: (posY + margin), str: name, fill: '#FFFFFF'
    //   }));

    //   let techStr = '';
    //   tech.forEach(d => techStr += d + '  ');
    //   queue.push(...this.populateGrid({
    //     cl, posX: .7, posY: (posY + (2 * margin)), str: techStr, fill: '#0089FF'
    //   }));

    //   queue.push(...this.populateGrid({
    //     cl, posX: .3, posY: (posY + (3 * margin)), str: date, fill: '#CB3030'
    //   }));

    //   queue.push(...this.populateGrid({
    //     cl, posX: .85, posY: (posY + (4 * margin)), str: 'github', fill: '#8E00FF', action: git
    //   }));
    };
    this.undrawGrid(queue);
    this.drawGrid(queue);
  };


  render() {
    const { url, iframeStyle } = this;
    const { minWidth, minHeight } = this.props;
    const { focus } = this.state;
    const style = {
      minWidth: minWidth + 'px',
      minHeight: minHeight + 'px'
    };
    const toggleHide = focus ? 'active' : 'hidden';
    return (
      <div className="App" style={style}>
        <div className="main">
          <svg ref="svg" />
          <div id={'iframe-container'} className={toggleHide} style={iframeStyle}>
            <iframe
              id={focus || null}
              className={toggleHide}
              allow="camera;microphone"
              src={url || null}
              title="project"
              scrolling="no"
            />
          </div>
        </div>
      </div>
    );
  };
};




          // <div id="button-box" className={toggleHide} style={iframeStyle}>
          //   <button id="iframe-exit">X</button>
          //   <button id="iframe-link">&rarr;</button>
          // </div>
          // {focus ? <button className='iframe-exit' onClick={this.iframeExit}>X</button> : null}
          // {focus ? <button className='iframe-link' onClick={this.iframeLink}>&rarr;</button> : null}

// old, works


//
  // setIframeDimensions(focus) {
  //   const { celHeight, celWidth } = this;
  //   const { rows, cols } = this.state;
  //   const { ratio } = this.projects.data[focus];
  //   const maxWidth = (cols - (ratio > 1 ? 10 : 20)) * celWidth;
  //   const maxHeight = (rows - (ratio < 1 ? 4 : 10)) * celHeight;
  //   // const maxWidth = (cols - 40) * celWidth;
  //   // const maxHeight = (rows - 4) * celHeight;

  //   let width, height;
  //   if ((maxWidth / ratio) > maxHeight) {
  //     width = Math.round((maxHeight * ratio) / celWidth);
  //     height = Math.round(maxHeight / celHeight);
  //   } else if ((maxHeight * ratio) > maxWidth) {
  //     width = Math.round(maxWidth / celWidth);
  //     height = Math.round((maxWidth / ratio) / celHeight);
  //   };

  //   const startCol = Math.floor((cols - width) / 2);
  //   const startRow = Math.floor((rows - height) / 3);
  //   this.iframeStyle = {
  //     width: ((width - .5) * celWidth)  + 'px',
  //     height: ((height - .2) * celHeight) + 'px',
  //     left: ((startCol + .25) * celWidth) + 'px',
  //     top: ((startRow + .1) * celHeight) + 'px',
  //   };
  //   return { width, height, startCol, startRow };
  // };
//



  // setIframeDimensions(focus) {
  //   const { celHeight, celWidth, celRatio } = this;
  //   const { rows, cols } = this.state;
  //   const { ratio } = this.projects.data[focus];
  //   let height = rows - 5;
  //   let width = Math.round((height * ratio) / celRatio);
  //   if (width > (cols - 40)) {
  //     width = Math.round(cols * .8);
  //     height = Math.round((width * celRatio) / ratio);
  //   };
  //   const startCol = Math.floor((cols - width) / 2);
  //   const startRow = Math.floor((rows - height) / 2);
  //   width = cols - (startCol * 2);
  //   this.iframeStyle = {
  //     width: ((width - .5) * celWidth)  + 'px',
  //     height: ((height - .2) * celHeight) + 'px',
  //     left: ((startCol + .25) * celWidth) + 'px',
  //     top: ((startRow + .1) * celHeight) + 'px',
  //   };
  //   return { width, height, startCol, startRow };
  // };
//
