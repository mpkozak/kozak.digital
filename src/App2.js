import React, { PureComponent } from 'react';
import { d3, randomLetter, emptyGrid } from './_help.js';
import content from './_content.js';
import './App.css';

export default class AppMobile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rows: undefined,
      cols: undefined,
      horizontal: false,
      isLoaded: false,
      resize: false,
      skills: false,
      projects: false,
      contact: false,
      links: false,
    };
    this.celRatio = (2 / 3);
    this.celHeight = 18;
    this.celWidth = this.celHeight * this.celRatio;
    this.grid = [];
    this.makeGrid = this.makeGrid.bind(this);
    this.handleRotate = this.handleRotate.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
  };

  componentDidMount() {
    Object.assign(this, content);
    const horizontal = this.configureCels();
    this.configureText(horizontal);
    this.makeGrid(horizontal);
    this.refs.grid.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('resize', this.handleRotate);
  };

  configureCels() {
    const { innerWidth, innerHeight } = window;
    const horizontal = innerWidth > innerHeight;
    const w = (innerWidth / (horizontal ? 50 : 31));
    const h = (innerHeight / (horizontal ? 21 : 30));
    if (w < this.celWidth || h < this.celHeight) {
      if (w < h * this.celRatio) {
        this.celWidth = w;
        this.celHeight = w / this.celRatio;
      } else {
        this.celWidth = h * this.celRatio;
        this.celHeight = h;
      };
    };
    return horizontal;
  };

  configureText(horizontal) {
    const { text, projects, skills, links, contact } = this;
    if (!horizontal) {
      text[0].posY = .5;
      text[1].posY = .6;
      text[2].posX = .22;
      text[2].posY = .18;
      text[3].posX = .7;
      text[3].posY = .4;
      text[4].posX = .15;
      text[5].posX = .85;
      text[5].posY = .75;
      projects.offsetX = 3;
      projects.offsetY = 3;
      projects.deltaX = 1;
      skills.offsetX = 5;
      skills.deltaX = -.7;
      links.offsetX = 2;
      links.deltaX = .9;
      contact.display[0].str = 'email';
      contact.offsetX = -5;
      contact.offsetY = 3;
    } else {
      text[0].posY = .75;
      text[1].posY = .85;
      text[2].posX = .15;
      text[2].posY = .14;
      text[3].posX = .45;
      text[3].posY = .58;
      text[4].posX = .24;
      text[5].posX = .82;
      text[5].posY = .35;
      projects.offsetX = 6;
      projects.offsetY = 2;
      projects.deltaX = 1;
      skills.offsetX = -2;
      skills.deltaX = 1.2;
      links.offsetX = -3;
      links.deltaX = -1;
      contact.display[0].str = 'mparkerkozak@gmail.com';
      contact.offsetX = -2;
      contact.offsetY = 3;
    };
    content.inheritPosition();
  };

  makeGrid(horizontal) {
    const { innerWidth, innerHeight } = window;
    const { celHeight, celWidth, text } = this;
    const { isLoaded } = this.state;
    const { grid } = this.refs;
    const cols = Math.floor(innerWidth / celWidth);
    const rows = Math.floor(innerHeight / celHeight);
    const width = cols * celWidth;
    const height = rows * celHeight;
    console.log('make grid', cols, rows)

    d3.selectAll('text').remove();
    grid.style.width = width + 'px';
    grid.style.height = height + 'px';

    this.drawGrid(this.grid = emptyGrid(cols, rows, isLoaded ? 250 : 300));
    text.forEach(d => {
      d.delayIncr = !isLoaded;
      this.introTimeout = setTimeout(() => {
        const queue = this.populateGrid(d);
        this.undrawGrid(queue);
        this.drawGrid(queue);
      }, isLoaded ? 0 : d.t);
    });

    this.setState(prevState => ({ cols, rows, horizontal, isLoaded: true, resize: false }));
  };

  drawGrid(cels) {
    const { celHeight, celWidth } = this;
    d3.select(this.refs.grid).selectAll('g')
      .data(cels).enter().append('text')
        .text(d => d.text)
        .attr('id', d => d.id)
        .attr('class', d => d.cl ? d.cl : null)
        .style('position', 'absolute')
        .style('width', celWidth + 'px')
        .style('height', celHeight + 'px')
        .style('left', d => d.c * celWidth + 'px')
        .style('top', d => d.r * celHeight + 'px')
        .style('background-color', 'rgba(0, 0, 0, 0)')
        .style('color', d => d.fill ? d.fill : '#999999')
        .style('font-size', celHeight + 'px')
        .style('text-align', 'center')
        .style('opacity', 0)
        .on('click', this.handleClick)
      .transition().delay(d => d.delay)
        .style('opacity', d => d.cl ? 1 : .5);
  };

  undrawGrid(cels) {
    d3.selectAll('.delete').remove();
    cels.forEach(d => {
      d3.select(`#${d.id}`)
        .attr('class', 'delete')
        .attr('id', null)
        .on('click', null)
        .transition()
          .delay(d.delay / 1.5)
          .style('opacity', 0)
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
        .style('opacity', 0)
      .transition()
        .text(cel.text)
        .style('opacity', .5);
  };

  populateGrid({ str, posX, posY, fill, cl, hover, adjC, adjR, action, delayIncr = 1 }) {
    const { cols, rows } = this.state;
    const queue = [];
    const r = Math.floor(posY * rows) + (adjR ? adjR : 0);
    let c = Math.floor((posX * cols) + (adjC ? adjC : 0) + (-str.length / 2));
    str.split('').forEach((text, i) => {
      const cel = this.grid[cols * r + c++];
      if (text !== ' ') {
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

  hideSubset(cl) {
    const cels = this.grid.filter(d => (cl ? d.cl === cl : d.cl));
    this.replaceCels(cels);
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

  handleRotate() {
    clearTimeout(this.introTimeout);
    this.undrawGrid(this.grid);
    this.celHeight = 18;
    this.celWidth = this.celHeight * this.celRatio;
    const horizontal = this.configureCels();
    this.configureText(horizontal);
    this.makeGrid(horizontal);
  };

  handleTouchMove(e) {
    e.preventDefault();
    const { clientX, clientY } = e.changedTouches[0];
    const el = document.elementFromPoint(clientX, clientY);
    const cel = el ? this.grid[el.id.substring(3)] : null;
    if (cel) this.handleHover(cel);
  };

  handleClick(cel) {
    const { cl, hover, action } = cel;
    if (hover) {
      if (this.state[hover]) this.hideSubset(hover);
      else this.showSubset(hover);
      this.setState(prevState => ({ [hover]: !prevState[hover] }));
    } else if (!cl) {
      this.letterSwap(cel);
    } else {
      switch (cl) {
        case 'projects' :
          window.open(this.projects.data[action].url, '_blank');
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


  render() {
    const { horizontal } = this.state;
    const appStyle = {
      height: horizontal ? '100vh' : '100%',
      justifyContent: horizontal ? 'flex-end' : 'center'
    };
    const mainStyle = {
      margin: horizontal ? '0' : '1vh 0'
    };
    return (
      <div className="App" style={appStyle}>
        <div className="main" style={mainStyle}>
          <div ref="grid" className="grid" />
        </div>
      </div>
    );
  };
};
