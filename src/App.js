import React, { PureComponent } from 'react';
import * as d3 from 'd3';
import { randomLetter, emptyGrid } from './components/_help.js';
import content from './components/_content.js';
import Project from './components/Project.js';
import './App.css';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rows: undefined,
      cols: undefined,
      loaded: false,
      skills: false,
      projects: false,
      contact: false,
      links: false,
      showProject: false
    };
    this.fontSize = 14;
    this.fontWidth = this.fontSize * (2 / 3);
    this.grid = [];

    this.setSize = this.setSize.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleClick = this.handleClick.bind(this);
  };

  componentDidMount() {
    Object.assign(this, content);
    window.addEventListener('resize', this.handleResize);
    this.setSize();
    setTimeout(() => this.setState(prevState => ({ loaded: true })), 3500);
  };

  setSize() {
    const { fontSize, fontWidth, text } = this;
    const { loaded } = this.state;
    const { svg } = this.refs;
    const cols = Math.floor((Math.max(window.innerWidth, 550) * .95) / fontWidth);
    const rows = Math.floor((Math.max(window.innerHeight, 450) * .95) / fontSize);
    const width = cols * fontWidth;
    const height = rows * fontSize;

    d3.selectAll('text').remove();
    svg.style.width = width;
    svg.style.height = height;
    svg.setAttribute('viewbox', `0 0 ${width} ${height}`);

    this.drawGrid(this.grid = emptyGrid(cols, rows, loaded));
    text.forEach(d => {
      d.delayIncr = !loaded;
      this.introTimeout = setTimeout(() => {
        const queue = this.populateGrid(d);
        this.undrawGrid(queue);
        this.drawGrid(queue);
      }, loaded ? 0 : d.t);
    });

    this.setState(prevState => ({ cols, rows }));
  };

  drawGrid(cels) {
    const { fontSize, fontWidth } = this;
    d3.select(this.refs.svg).selectAll('g')
      .data(cels).enter().append('text')
        .text(d => d.text)
        .attr('id', d => d.id)
        .attr('class', d => d.cl ? d.cl : undefined)
        .attr('x', d => d.c * fontWidth)
        .attr('y', d => d.r * fontSize)
        .attr('font-size', fontSize)
        .attr('fill', d => d.fill ? d.fill : '#999999')
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'hanging')
        .attr('opacity', 0)
      .transition().delay(d => d.delay)
        .attr('opacity', d => d.cl ? 1 : .5);
  };

  undrawGrid(cels) {
    d3.selectAll('.delete').remove();
    cels.forEach(d => {
      d3.select(`#${d.id}`)
        .attr('class', 'delete')
        .attr('id', undefined)
        .transition()
          .delay(d.delay / 1.5)
          .attr('opacity', 0)
          .remove();
    });
  };

  hideGrid(cels) {
    cels.forEach(d => {
      d3.select(`#${d.id}`)
        .attr('class', 'hidden')
        .transition()
          .delay(d.delay / 1.5)
          .attr('opacity', 0)
    });
  };

  showGrid(cels) {
    // setTimeout(() => this.setState(prevState => ({ showProject: false, hidden: undefined })), 1000)
    this.setState(prevState => ({ showProject: false, hidden: undefined }));
    cels.forEach(d => {
      d3.select(`#${d.id}`)
        .attr('class', d.cl)
        .transition()
          .delay(d.delay / 1.5)
          .attr('opacity', d.cl ? 1 : .5);
    });
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

  // letterSwap(cel) {
  //   const { fontSize, fontWidth } = this;
  //   cel.text = randomLetter();
  //   d3.select(`#${cel.id}`)
  //     .transition().duration(100)
  //       .attr('x', (cel.c + .5) * fontWidth)
  //       .attr('y', (cel.r + .5) * fontSize)
  //       .attr('font-size', 0)
  //       .attr('opacity', 0)
  //     .transition().duration(250)
  //       .attr('x', cel.c * fontWidth)
  //       .attr('y', cel.r * fontSize)
  //       .attr('font-size', fontSize)
  //       .attr('opacity', .5);
  // };

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
    const cels = this.grid.filter(d => d.cl === key);
    const queue = [];
    cels.forEach((cel, i) => {
      let fill, cl, hover, action;
      queue.push(Object.assign(cel, {
        text: randomLetter(), fill, cl, hover, action
      }));
    });
    this.undrawGrid(queue);
    this.drawGrid(queue);
  };

  handleResize() {
    const { svg } = this.refs;
    svg.style.width = 0;
    svg.style.height = 0;
    clearTimeout(this.introTimeout);
    clearTimeout(this.hoverTimeout);
    this.hoverTimeout = setTimeout(this.setSize, 500);
  };

  handleHover(e) {
    // const cel = this.grid.find(d => d.id === e.target.id);
    const cel = this.grid[e.target.id.substring(3)];
    if (cel) {
      const { cl, hover } = cel;
      if (!cl) this.letterSwap(cel);
      if (hover) {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = setTimeout(() => {
          if (this.state[hover]) this.hideSubset(hover);
          else this.showSubset(hover);
          this.setState(prevState => ({ [hover]: !prevState[hover] }));
        }, 250);
      };
    };
  };

  handleClick(e) {
    const cel = this.grid[e.target.id.substring(3)];
    if (cel) {
      const { cl, action } = cel;
      if (action) {
        switch (cl) {
          case 'projects' :
            console.log('open project ', action);
            this.showFrame(action);
            break;
          case 'links' :
            window.open(action, '_blank')
            break;
          case 'contact' :
            window.location = action;
            break;
          default : return null
        };
      };
    };
  };

  showFrame(proj) {
    const { rows, cols } = this.state;
    const { fontSize, fontWidth } = this;
    const marginY = 4;
    const marginX = 20;

    const queue = this.grid.filter(d => {
      const x = marginX / 2;
      const y = marginY / 2;
      return (d.c >= x && d.c < (cols - x) && d.r >= y && d.r < (rows - y));
    });


    const frame = {
      left: fontWidth * (marginX / 2) + 'px',
      top: fontSize * (marginY / 2) + 'px',
      width: (cols - marginX) * fontWidth + 'px',
      height: (rows - marginY) * fontSize + 'px',
      opacity: 1,
    }

    this.hideGrid(queue);
    this.setState(prevState => ({ frame, showProject: proj, hidden: queue }));


            // this.setState(prevState => ({  }));




    // const { fontSize, fontWidth, grid } = this;

    // const frameHeight = (rows * fontSize) * .8;
    // const frameWidth = frameHeight * (16 / 9);

    // const frameCols = Math.ceil(frameWidth / fontWidth);
    // const frameRows = Math.ceil(frameHeight / fontSize);

    // const startCol = (cols - frameCols) / 2;
    // const endCol = startCol + frameCols;
    // const startRow = (rows - frameRows) / 2;
    // const endRow = startRow + frameRows;

    // const queue = this.grid.filter(d => {
    //   if (d.c >= startCol && d.c <= endCol && d.r >= startRow && d.r <= endRow)
    //   return d;
    // })

    // this.undrawGrid(queue)


    // const height = rows - 4;
    // const width = Math.ceil(height * (16 / 9));
    // const marginX = cols - Math.ceil((rows - marginY) * (fontSize / fontWidth));




    // console.log(this.grid.length, queue.length)

    // console.log(frameCols, frameRows)

  }


  render() {
    const { showProject, hidden, frame } = this.state;
    return (
      <div className="App">
        <div className="main">
          <svg ref="svg" onMouseOver={this.handleHover} onClick={this.handleClick} />
          <Project proj={showProject} frame={frame} hide={() => this.showGrid(hidden)} />
        </div>
      </div>
    );
  };
};
