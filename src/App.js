import React, { PureComponent } from 'react';
import * as d3 from 'd3';
import content from './components/_content.js';
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
    this.alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    this.fontHeight = 14;
    this.fontWidth = this.fontHeight * (2 / 3);
    this.grid = [];

    this.setSize = this.setSize.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleClick = this.handleClick.bind(this);
  };

  randomLetter() {
    return this.alpha[Math.floor(Math.random() * 26)];
  };

  emptyGrid(cols, rows, noDelay) {
    const grid = [];
    const tScalar = 250 / (cols * rows);
    let id = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cel = { c, r };
        cel.id = `cel${id++}`;
        cel.text = this.randomLetter();
        // cel.delay = 100 * (((2 * r) + c) * tScalar + Math.random());
        // cel.delay = (noDelay ? 1 : 100) * (((2 * r) + c) * tScalar + Math.random());
        cel.delay = 100 * ((noDelay ? 1 : ((2 * r) + c)) * tScalar + Math.random());
        grid.push(cel);
      };
    };
    return grid;
  };

  componentDidMount() {
    Object.assign(this, content);
    this.setSize();
    window.addEventListener('resize', this.handleResize);
    setTimeout(() => this.setState(prevState => ({ loaded: true })), 3500);
  };

  setSize() {
    const { fontWidth, fontHeight, text } = this;
    const { loaded } = this.state;
    const { svg } = this.refs;
    const cols = Math.floor((d3.max([window.innerWidth, 550]) * .95) / fontWidth);
    const rows = Math.floor((d3.max([window.innerHeight, 450]) * .95) / fontHeight);
    const width = cols * fontWidth;
    const height = rows * fontHeight;

    d3.selectAll('text').remove();
    svg.style.width = width;
    svg.style.height = height;
    svg.setAttribute('viewbox', `0 0 ${width} ${height}`);
    this.grid = this.emptyGrid(cols, rows, loaded);

    text.forEach(d => {
      if (loaded) d.delayIncr = false;
      this.introTimeout = setTimeout(() => {
        const queue = this.populateGrid(d);
        this.undrawGrid(queue);
        this.drawGrid(queue);
      }, loaded ? 0 : d.t);
    });

    this.drawGrid(this.grid);
    this.setState(prevState => ({ cols, rows }));
  };

  drawGrid(cels) {
    const { fontWidth, fontHeight } = this;
    d3.select(this.refs.svg).selectAll('g')
      .data(cels).enter().append('text')
        .text(d => d.text)
        .attr('id', d => d.id)
        .attr('class', d => d.cl ? d.cl : null)
        .attr('x', d => d.c * fontWidth)
        .attr('y', d => d.r * fontHeight)
        .attr('font-size', fontHeight)
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
        .attr('id', null)
        .transition()
          .delay(d.delay / 1.5)
          .attr('opacity', 0)
          .remove();
    });
  };

  letterSwap(cel) {
    cel.text = this.randomLetter();
    d3.select(`#${cel.id}`)
      .transition(250)
        .attr('opacity', 0)
      .transition(500)
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
    const cels = this.grid.filter(d => d.cl === key);
    const queue = [];
    cels.forEach((cel, i) => {
      let fill, cl, hover, action;
      queue.push(Object.assign(cel, {
        text: this.randomLetter(), fill, cl, hover, action
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
      else if (hover) {
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
            this.setState(prevState => ({ showProject: action }));
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


  render() {
    const { showProject } = this.state;
    return (
      <div className="App">
        <svg className="main" ref="svg" onMouseOver={this.handleHover} onClick={this.handleClick} />
      </div>
    );
  };
};




    // const nodes = d3.select(this.refs.svg).selectAll('text')._groups[0];
    // const dom = nodes ? nodes.length : null;
    // const grid = this.grid.length;
    // console.log(dom - grid)




    // console.time('find')
    // const find = this.grid.find(d => d.id === e.target.id);
    // console.log(find)
    // console.timeEnd('find')



    // console.time('direct')
    // const direct = this.grid[e.target.id.substring(3)];
    // console.log(direct)
    // console.timeEnd('direct')


        // (cl === 'links') && window.open(action, '_blank');
        // (cl === 'contact') && window.location = action;


    // const { posX, posY } = this.text.find(d => d.hover === key);
