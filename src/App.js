import React, { PureComponent } from 'react';
import * as d3 from 'd3';
import { randomLetter, emptyGrid } from './components/_help.js';
import content from './components/_content.js';
import './App.css';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rows: undefined,
      cols: undefined,
      isLoaded: false,
      // isLoaded: true,

      skills: false,
      projects: false,
      contact: false,
      links: false,

      iframe: null,
      url: null,
    };

    this.celRatio = (2 / 3);
    this.celHeight = 14;
    this.celWidth = this.celHeight * this.celRatio;
    this.grid = [];
    this.iframeStyle = {};

    this.makeGrid = this.makeGrid.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleClick = this.handleClick.bind(this);

    // this.randomPop = this.randomPop.bind(this);
  };


// OLD EVENT LISTENERS
  // handleHover(e) {
  //   // const cel = this.grid.find(d => d.id === e.target.id);
  //   const cel = this.grid[e.target.id.substring(3)];
  //   if (cel) {
  //     const { cl, hover } = cel;
  //     if (!cl) this.letterSwap(cel);
  //     if (hover) {
  //       clearTimeout(this.hoverTimeout);
  //       this.hoverTimeout = setTimeout(() => {
  //         if (this.state[hover]) this.hideSubset(hover);
  //         else this.showSubset(hover);
  //         this.setState(prevState => ({ [hover]: !prevState[hover] }));
  //       }, 150);
  //     };
  //   };
  // };

  // handleClick(e) {
  //   const cel = this.grid[e.target.id.substring(3)];
  //   // const cel = this.grid[e.substring(3)];

  //   if (cel) {
  //     const { cl, action } = cel;
  //     if (action) {
  //       switch (cl) {
  //         case 'projects' :
  //           console.log('open project ', action);
  //           this.showIframe(action);
  //           break;
  //         case 'links' :
  //           window.open(action, '_blank')
  //           break;
  //         case 'contact' :
  //           window.location = action;
  //           break;
  //         // default : return null
  //         default : console.log('default')
  //       };
  //     } else if (this.state.iframe) {
  //       this.hideIframe();
  //       // console.log('exit')
  //     }
  //   };
  // };
//



  handleResize() {
    clearTimeout(this.resizeTimeout);
    const { svg } = this.refs;
    svg.style.width = 0;
    svg.style.height = 0;
    clearTimeout(this.introTimeout);
    clearTimeout(this.hoverTimeout);
    this.resizeTimeout = setTimeout(this.makeGrid, 100);
  };

  handleHover(cel) {
    const { cl, hover } = cel;
    if (!cl) {
      this.letterSwap(cel);
    } else if (hover) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = setTimeout(() => {
        if (this.state[hover]) this.hideSubset(hover);
        else this.showSubset(hover);
        this.setState(prevState => ({ [hover]: !prevState[hover] }));
      }, 200);
    };
  };

  handleClick(cel) {
    const { cl, action } = cel;
    const { iframe } = this.state;
    if (iframe) {
      this.hideIframe();
    } else if (action) {
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
        default : return null;
      };
    };
  };

  componentDidMount() {
    Object.assign(this, content);
    window.addEventListener('resize', this.handleResize);
    this.makeGrid();
  };

  makeGrid() {
    const { celHeight, celWidth, text } = this;
    const { isLoaded } = this.state;
    const { svg } = this.refs;
    const cols = Math.floor((Math.max(window.innerWidth, 550) * .95) / celWidth);
    const rows = Math.floor((Math.max(window.innerHeight, 450) * .95) / celHeight);
    const width = cols * celWidth;
    const height = rows * celHeight;

    d3.selectAll('text').remove();
    svg.style.width = width;
    svg.style.height = height;
    svg.setAttribute('viewbox', `0 0 ${width} ${height}`);

    this.drawGrid(this.grid = emptyGrid(cols, rows, isLoaded ? 100 : 500));
    text.forEach(d => {
      d.delayIncr = !isLoaded;
      this.introTimeout = setTimeout(() => {
        const queue = this.populateGrid(d);
        this.undrawGrid(queue);
        this.drawGrid(queue);
      }, isLoaded ? 0 : d.t);
    });

    this.setState(prevState => ({ cols, rows, isLoaded: true }));
  };

  drawGrid(cels) {
    const { celHeight, celWidth } = this;
    d3.select(this.refs.svg).selectAll('g')
      .data(cels).enter().append('text')
        .text(d => d.text)
        .attr('id', d => d.id)
        .attr('class', d => d.cl ? d.cl : undefined)
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

    // d3.select(this.refs.svg).selectAll('g')
    //   .data(cels).enter().append('rect')
    //     .attr('id', d => d.id)
    //     .attr('class', d => d.cl ? d.cl : undefined)
    //     .attr('x', d => d.c * celWidth)
    //     .attr('y', d => d.r * celHeight)
    //     .attr('width', celWidth)
    //     .attr('height', celHeight)
    //     .attr('fill', d => d.fill ? d.fill : '#999999')
    //     .attr('stroke', 'white')
    //     .attr('stroke-width', '.1px')
    //     .attr('opacity', 0)
    //   .transition().delay(d => d.delay)
    //     .attr('opacity', d => d.cl ? 1 : .5);
  };

  undrawGrid(cels) {
    // d3.selectAll('.delete').remove();
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

  populateGrid(entry) {
    const { str, posX, posY, fill, cl, hover, adjC, adjR, action, delayIncr = 1 } = entry;
    const { cols, rows } = this.state;
    const queue = [];
    const r = Math.floor(posY * rows) + (adjR ? adjR : 0);
    let c = Math.floor((posX * cols) + (adjC ? adjC : (-str.length / 2)));
    str.split('').forEach((text, i) => {
      const cel = this.grid[cols * r + c++];
      if (text !== ' ') {
        if (delayIncr) cel.delay = 250 * (((delayIncr + i) / str.length) + Math.random());
        queue.push(Object.assign(cel, {
          text, fill, cl, hover, action
        }));
      };
    });
    return queue;
  };

  showSubset(key) {
    const { display, fill, posX, posY, offsetX, offsetY, deltaX, deltaY } = this[key];
    const queue = [];
    display.forEach((d, i) => {
      const { str, action } = d;
      const adjR = offsetY + (deltaY * i);
      const adjC = offsetX + (deltaX * i) + (2 * Math.random() - 1);
      queue.push(...this.populateGrid({
        cl: key, delayIncr: ((i + 1) / 2), str, posX, posY, fill, adjR, adjC, action
      }));
    });
    this.undrawGrid(queue);
    this.drawGrid(queue);
  };

  hideSubset(key) {
    const cels = this.grid.filter(d => (key ? d.cl === key : d.cl));
    this.replaceCels(cels);
  };







  setIframeDimensions(ratio) {
    const { celHeight, celWidth, celRatio } = this;
    const { rows, cols } = this.state;
    let height = rows - 5;
    let width = Math.round((height * ratio) / celRatio);
    if (width > (cols - 20)) {
      width = Math.round(cols * .8);
      height = Math.round((width * celRatio) / ratio);
    };
    const startCol = Math.floor((cols - width) / 2);
    const startRow = Math.floor((rows - height) / 2);
    width = cols - (startCol * 2);
    this.iframeStyle = {
      width: ((width - .5) * celWidth)  + 'px',
      height: ((height - .2) * celHeight) + 'px',
      left: ((startCol + .25) * celWidth) + 'px',
      top: ((startRow + .1) * celHeight) + 'px',
    };
    return { width, height, startCol, startRow };
  };

// add text to grid baced on project info
    // const { name, date, tech, git }
    // const posX = startCol / cols;
    // const posY = (startRow + frameRows) / rows;
    // const fill = '#0089FF';
    // const adjC = 5;
    // const queue = [name, date, tech].map((d, i) => (
    //   { str: d, posX, posY, fill, cl: 'info', adjC, adjR: (i + 1), action: true }
    // ))
    // queue.forEach(d => {
    //   const grid = this.populateGrid(d)
    //   this.undrawGrid(grid);
    //   this.drawGrid(grid);
    // });

  showIframe(focus) {
    const { url, ratio } = this.projects.data[focus];
    const { width, height, startCol, startRow } = this.setIframeDimensions(ratio);
    const clear = this.grid.filter(d =>
      d.c >= startCol &&
      d.c < (startCol + width) &&
      d.r >= startRow &&
      d.r < (startRow + height)
    );
    this.hideSubset();
    clear.forEach(d => {
      d.cl = 'hidden';
      d.delay = 1000 * Math.random();
    });
    this.undrawGrid(clear);
    this.setState(prevState => ({ iframe: focus, url }));
  };

  hideIframe() {
    this.replaceCels(this.grid.filter(d => d.cl === 'hidden' || d.cl === 'info'));
    this.text.forEach(d => {
      const queue = this.populateGrid(d);
      this.undrawGrid(queue);
      this.drawGrid(queue);
    });
    this.setState(prevState => ({ iframe: false, url: '#' }));
  };








// POP
  randomPop() {
    const { grid } = this;
    const cel = grid[Math.floor(Math.random() * grid.length)];
    if (!cel.cl) this.letterPop(cel);
    // setTimeout(this.randomPop, 500 + (Math.random() * 2000));
  };

  letterPop(cel, type) {
    const { celHeight, celWidth } = this;
    cel.text = randomLetter();
    const speed = 1000;
    const scalars = [[.5, 0], [-1.75, 5]];
    if (Math.random() < 0.5) scalars.reverse();
    d3.select(`#${cel.id}`)
      .transition().ease(d3.easeCircle).duration(speed)
        .attr('x', (cel.c + scalars[0][0]) * celWidth)
        .attr('y', (cel.r + scalars[0][0]) * celHeight)
        .attr('font-size', scalars[0][1] * celHeight)
        .attr('opacity', 0)
      .transition().duration(100)
        .attr('x', (cel.c + scalars[1][0]) * celWidth)
        .attr('y', (cel.r + scalars[1][0]) * celHeight)
        .attr('font-size', scalars[1][1] * celHeight)
        .text(cel.text)
      .transition().ease(d3.easeElastic).duration(speed)
        .attr('x', cel.c * celWidth)
        .attr('y', cel.r * celHeight)
        .attr('font-size', celHeight)
        .attr('opacity', .5);
    // d3.select(`#${cel.id}`)
    //   .transition().ease(d3.easeExp).duration(speed / 2)
    //     .attr('opacity', 1)
    //   .transition().ease(d3.easeCircle).duration(speed)
    //     .attr('x', (cel.c + scalars[0][0]) * celWidth)
    //     .attr('y', (cel.r + scalars[0][0]) * celHeight)
    //     .attr('width', scalars[0][1] * celWidth)
    //     .attr('height', scalars[0][1] * celHeight)
    //     .attr('opacity', 0)
    //   .transition().duration(0)
    //     .text(cel.text)
    //     .attr('x', (cel.c + scalars[1][0]) * celWidth)
    //     .attr('y', (cel.r + scalars[1][0]) * celHeight)
    //     .attr('width', scalars[1][1] * celWidth)
    //     .attr('height', scalars[1][1] * celHeight)
    //   .transition().ease(d3.easeElastic).duration(speed / 2)
    //     .attr('x', cel.c * celWidth)
    //     .attr('y', cel.r * celHeight)
    //     .attr('width', celWidth)
    //     .attr('height', celHeight)
    //     .attr('opacity', .5);
  };
//






  render() {
    const { iframe, url } = this.state;
    const toggleHide = iframe ? 'active' : 'hidden'
    const { iframeStyle } = this;
    return (
      <div className="App">
        <div className="main">
          <svg ref="svg" />
          <div id={'iframe-container'} className={toggleHide} style={iframeStyle}>
            <iframe
              id={iframe ? iframe : null}
              className={toggleHide}
              allow="camera;microphone"
              src={url}
              title="project"
              scrolling="no"
            />
          </div>
        </div>
      </div>
    );
  };
};


{/*
            <iframe id={iframe ? iframe : null} className={iframe ? 'active' : 'hidden'} ref="iframe" allow="camera;microphone" src={url} title="display" scrolling="no" />

          <svg ref="svg" onMouseOver={this.handleHover} onClick={this.handleClick} />
          <div id={'iframe-container'} className={iframe ? 'active' : 'hidden'} style={iframe ? iframeStyle : null}>

*/}

