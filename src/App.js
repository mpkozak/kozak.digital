import React, { PureComponent } from 'react';
import * as d3 from 'd3';
import './App.css';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rows: undefined,
      cols: undefined,
      showProject: false
    };
    this.grid = [];
    this.fontHeight = 14;
    this.fontWidth = this.fontHeight * (2 / 3);
    this.alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    this.text = [
      {
        str: 'this is not a website',
        t: 1000,
        fill: '#FFFFFF',
        posX: .5,
        posY: .5,
      },
      {
        str: 'm. parker kozak',
        t: 2000,
        fill: '#CB3030',
        posX: .75,
        posY: .6,
      },
      {
        str: 'skills',
        t: 2500,
        fill: '#FDA50F',
        posX: .7,
        posY: .4,
        subset: true
      },
      {
        str: 'projects',
        t: 2750,
        fill: '#FDA50F',
        posX: .22,
        posY: .18,
        subset: true
      },
      {
        str: 'contact',
        t: 3000,
        fill: '#FDA50F',
        posX: .85,
        posY: .75,
        subset: true
      },
      {
        str: 'links',
        t: 3250,
        fill: '#FDA50F',
        posX: .15,
        posY: .9,
        subset: true
      }
    ];
    this.skills = {
      els: ['css', 'html', 'bash', 'sql', 'express', 'node', 'd3+svg', 'react', 'webaudio api', 'javascript'],
      fill: '#20BB20',
      offsetX: 1,
      offsetY: -2,
      deltaX: .3,
      deltaY: -1
    };
    this.projects = {
      els: {
        'drive my car': { url: 'http://kozak.digital/_drivebeta/' },
        'sleepy': { url: 'https://sleepy-kozak.herokuapp.com/' },
        'αdex': { url: 'https://kozak-adex.surge.sh/' }
      },
      fill: '#0089FF',
      offsetX: 0,
      offsetY: 2,
      deltaX: .5,
      deltaY: 2
    };
    this.contact = {
      els: {
        'mparkerkozak@gmail.com': { url: 'mailto:mparkerkozak@gmail.com' }
      },
      fill: '#20A0A1',
      offsetX: -15,
      offsetY: 2,
      deltaX: 0,
      deltaY: 1
    };
    this.links = {
      els: {
        resume: {  url: 'http://kozak.digital/_files/kozak_resume.pdf' },
        imdb: { url: 'https://www.imdb.com/name/nm3362994/' },
        github: { url: 'https://github.com/mpkozak' },
        linkedin: { url: 'https://www.linkedin.com/in/mpkozak/' },
        codepen: { url: 'https://codepen.io/mpkozak/pen/XoWNOQ' }
      },
      fill: '#8E00FF',
      offsetX: 2,
      offsetY: -2,
      deltaX: .75,
      deltaY: -2
    };

    this.setSize = this.setSize.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleClick = this.handleClick.bind(this);
  };

  randomLetter() {
    return this.alpha[Math.floor(Math.random() * 26)];
  };

  emptyGrid(cols, rows) {
    const grid = [];
    const tScalar = 250 / (cols * rows)
    let id = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        grid.push({
          c,
          r,
          id: `cel${id++}`,
          text: this.randomLetter(),
          delay: 100 * (((2 * r) + c) * tScalar + Math.random())
        });
      };
    };
    return grid;
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.setSize();
  };

  componentDidUpdate() {
    // console.log('componentDidUpdate')
  };

  setSize() {
    const { fontWidth, fontHeight } = this;
    const { svg } = this.refs;
    const cols = Math.floor((Math.max(window.innerWidth, 550) * .95) / fontWidth);
    const rows = Math.floor((Math.max(window.innerHeight, 450) * .95) / fontHeight);
    const width = cols * fontWidth;
    const height = rows * fontHeight;
    svg.style.width = width;
    svg.style.height = height;
    d3.select(svg).selectAll('text').remove();
    svg.setAttribute('viewbox', `0 0 ${width} ${height}`);
    this.grid = this.emptyGrid(cols, rows);
    this.drawGrid(this.grid);
    this.text.forEach(d => {
      setTimeout(() => {
        this.populateGrid(d);
      }, d.t);
    });
    this.setState(prevState => ({ cols, rows }));
  };

  drawGrid(cels) {
    const { fontWidth, fontHeight } = this;
    const { svg } = this.refs;
    const text = d3.select(svg).selectAll('g').data(cels);
    text.enter().append('text')
      .attr('id', d => d.id)
      .attr('class', d => d.class ? d.class : null)
      .attr('x', d => d.c * fontWidth)
      .attr('y', d => d.r * fontHeight)
      .text(d => d.text)
      .attr('font-size', fontHeight)
      .attr('fill', d => d.fill ? d.fill : '#999999')
      .attr('text-anchor', 'start')
      .attr('alignment-baseline', 'hanging')
      .attr('opacity', 0)
    .transition().delay(d => d.delay)
      .attr('opacity', d => d.opacity ? d.opacity : .5);
  };

  undrawGrid(cels) {
    d3.selectAll('.delete').remove();
    cels.forEach(d => {
      const cel = d3.select(`#${d.id}`);
      cel.attr('class', 'delete').attr('id', null)
        .transition().delay(d.delay / 2)
        .attr('opacity', 0)
        .remove();
    });
  };

  populateGrid(el) {
    const { cols, rows } = this.state;
    const arr = el.str.split('');
    let c = Math.floor(el.posX * cols - arr.length / 2);
    let r = Math.floor(el.posY * rows);
    const queue = [];
    arr.forEach((d, i) => {
      const cel = this.grid[r * cols + c];
      if (d !== ' ') {
        cel.text = d;
        cel.fill = el.fill;
        cel.opacity = 1;
        cel.delay = 500 * ((i / arr.length) + Math.random());
        cel.static = true;
        cel.subset = el.subset ? el.str : false;
        queue.push(cel);
      };
      c++;
    });
    this.undrawGrid(queue);
    this.drawGrid(queue);
  };

  letterSwap(cel) {
    cel.text = this.randomLetter();
    const el = d3.select(`#${cel.id}`)
    el.transition(250)
      .attr('opacity', 0)
    .transition(500)
      .text(cel.text)
      .attr('opacity', .5);
  };

  showSubset(key) {
    const { cols, rows } = this.state;
    const { posX, posY } = this.text.filter(d => d.str === key)[0];
    const subset = this[key];
    const { els, fill, offsetX, offsetY, deltaX, deltaY } = subset;
    let r = Math.floor(posY * rows) + offsetY;
    const queue = [];
    Object.keys(els).forEach((d, i) => {
      const url = els[d].url;
      const text = url ? d : els[d];
      const arr = text.split('');
      let c = Math.floor(posX * cols + offsetX + i * deltaX + 2 * (Math.random() -.5));
      arr.forEach((f, j) => {
        const cel = this.grid[r * cols + c];
        if (f !== ' ') {
          cel.class = key;
          cel.url = url;
          cel.text = f;
          cel.fill = fill;
          cel.opacity = 1;
          cel.delay = 250 * ((((i / 2) + j) / arr.length) + Math.random());
          cel.static = true;
          cel.subset = false;
          queue.push(cel);
        };
        c++;
      })
      r += deltaY;
    });
    this.undrawGrid(queue);
    this.drawGrid(queue);
  };

  hideSubset(key) {
    const cels = this.grid.filter(d => d.class === key);
    const queue = [];
    cels.forEach((cel, i) => {
      cel.class = false;
      cel.url = false;
      cel.text = this.randomLetter();
      cel.fill = false;
      cel.opacity = false;
      cel.static = false;
      queue.push(cel);
    });
    this.undrawGrid(queue);
    this.drawGrid(queue);
  };

  handleResize() {
    const { svg } = this.refs;
    svg.style.width = 0;
    svg.style.height = 0;
    clearTimeout(this.resetSize);
    this.resetSize = setTimeout(this.setSize, 500);
  };

  handleHover(e) {
    const { grid } = this;
    const index = grid.findIndex(d => d.id === e.target.id);
    if (~index) {
      const cel = grid[index];
      const { subset } = cel;
      if (!cel.static && !cel.class) {
        this.letterSwap(cel);
      } else if (subset) {
        clearTimeout(this.toggleSubset);
        this.toggleSubset = setTimeout(() => {
          const active = this.state[subset];
          if (active) {
            this.setState(
              prevState => ({ [subset]: false }),
              () => this.hideSubset(subset)
            );
          } else {
            this.setState(
              prevState => ({ [subset]: true }),
              () => this.showSubset(subset)
            );
          };
        }, 250);
      };
    };
  };

  handleClick(e) {
    const cel = this.grid[e.target.id.substring(3)];
    if (cel && cel.class && cel.url) {
      if (cel.class === 'projects') {
        console.log(cel.class && cel.url)
      } else {
        window.location = cel.url;
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
