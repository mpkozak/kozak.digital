import React, { PureComponent } from 'react';
import * as d3 from 'd3';
import './App.css';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rows: undefined,
      cols: undefined,
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
        static: true
      },
      {
        str: 'm. parker kozak',
        t: 2000,
        fill: '#CB3030',
        posX: .8,
        posY: .65,
        static: true
      },
      {
        str: 'skills',
        t: 2500,
        fill: '#FDA50F',
        posX: .7,
        posY: .4,
        static: true,
        subset: {
          els: ['css', 'html', 'svg', 'bash', 'sql', 'express', 'node', 'd3', 'react', 'javascript'],
          fill: '#20BB20',
          deltaX: .8,
          deltaY: -1
        },
      },
      {
        str: 'projects',
        t: 2750,
        fill: '#FDA50F',
        posX: .22,
        posY: .15,
        static: true,
        subset: []
      },
      {
        str: 'contact',
        t: 3000,
        fill: '#FDA50F',
        posX: .8,
        posY: .8,
        static: true,
        subset: []
      },
      {
        str: 'links',
        t: 3250,
        fill: '#FDA50F',
        posX: .15,
        posY: .88,
        static: true,
        subset: []
      }
    ];


    this.setSize = this.setSize.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleHover = this.handleHover.bind(this);




    // this.animationStack = this.animationStack.bind(this);
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
          opacity: .5,
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
    console.log('componentDidUpdate')
  };

  setSize() {
    const { fontWidth, fontHeight } = this;
    const { svg } = this.refs;
    const cols = Math.floor((window.innerWidth * .95) / fontWidth);
    const rows = Math.floor((window.innerHeight * .95) / fontHeight);
    const width = cols * fontWidth;
    const height = rows * fontHeight;

    svg.style.width = width;
    svg.style.height = height;
    d3.select(svg).selectAll('text').remove();
    svg.setAttribute('viewbox', `0 0 ${width} ${height}`);

    this.grid = this.emptyGrid(cols, rows);
    this.drawGrid(this.grid);
    this.text.forEach((d, i) => {
      setTimeout(() => {
        this.populateGrid(d, i);
      }, d.t)
    });

    this.setState(prevState => ({ cols, rows }));
  };

  drawGrid(cels) {
    const { fontWidth, fontHeight } = this;
    const { svg } = this.refs;
    const text = d3.select(svg).selectAll('g').data(cels);
    text.enter().append('text')
      .attr('id', d => d.id)
      .attr('x', d => d.c * fontWidth)
      .attr('y', d => d.r * fontHeight)
      .text(d => d.text)
      .attr('font-size', fontHeight)
      .attr('fill', d => d.fill ? d.fill : '#999999')
      .attr('text-anchor', 'start')
      .attr('alignment-baseline', 'hanging')
      .attr('opacity', 0)
    .transition().delay(d => d.delay)
      .attr('opacity', d => d.opacity);
  };

  undrawGrid(cels) {
    cels.forEach(d => {
      const cel = d3.select(`#${d.id}`);
      cel.transition().delay(d.delay / 2)
        .attr('opacity', 0)
        .remove();
    });
  };

  populateGrid(el, ind) {
    const { cols, rows } = this.state;
    const { grid } = this;
    const arr = el.str.split('');
    let c = Math.floor(el.posX * cols - arr.length / 2);
    let r = Math.floor(el.posY * rows);
    const queue = [];
    arr.forEach((d, i) => {
      const cel = grid[r * cols + c];
      if (d !== ' ') {
        cel.text = d;
        cel.fill = el.fill;
        cel.opacity = 1;
        cel.delay = 500 * ((i / arr.length) + Math.random());
        cel.static = el.static;
        cel.subset = ind;
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



  showSubset(ind) {
    const { grid } = this;
    const { cols, rows } = this.state;
    const parent = this.text[ind];
    const { subset } = parent;
    const cOrigin = Math.floor(parent.posX * cols)

    let r = Math.floor(parent.posY * rows) + (subset.deltaY * 2);
    const queue = [];
    subset.els.forEach((d, i) => {
      let c = Math.floor(cOrigin + (subset.deltaX * i) + Math.random() - d.length / 2);
      const arr = d.split('');
      arr.forEach((f, j) => {
        const cel = grid[r * cols + c];
        cel.text = f;
        cel.fill = subset.fill;
        cel.opacity = 1;
        cel.delay = 250 * ((((i / 2) + j) / arr.length) + Math.random());
        cel.static = true;
        queue.push(cel);
        c++;
      });
      r += subset.deltaY;
    });

    this.undrawGrid(queue);
    this.drawGrid(queue);
    this.setState(prevState => ({ [this.text[ind].str] : queue }));

    // console.log(el.subset)
    // console.log(text[ind])

    // console.log(r, c)
    // const queue = [];

  }


  clearSubset(category) {
    const { grid } = this;
    const subset = this.state[category];
    const queue = [];
    subset.forEach((d, i) => {
      const cel = grid[grid.findIndex(f => f.id === d.id)];
      cel.text = this.randomLetter();
      cel.fill = false;
      cel.opacity = .5;
      // cel.delay = 250 * ((((i / 2) + j) / arr.length) + Math.random());
      cel.static = false;
      cel.subset = false;
      queue.push(cel);
    });



            // active.forEach(d => {
            //   d.text = this.randomLetter();
            //   d.fill = false;
            //   d.opacity = .5;
            //   this.drawGrid([d])
            // });
            // this.setState(prevState => ({ [this.text[cel.subset].str]: false }));
    this.undrawGrid(queue)
    this.drawGrid(queue)
    this.setState(prevState => ({ [category]: false}));
  }

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
      console.log(index)
    if (~index) {
      const cel = grid[index];
      if (!cel.static) {
        this.letterSwap(cel);
      } else if (cel.subset) {
        clearTimeout(this.toggleCategory);
        this.toggleCategory = setTimeout(() => {
          const category = this.text[cel.subset].str;
          const active = this.state[category];
          if (active) {
            this.clearSubset(category);
          } else {
            this.showSubset(cel.subset);
          };
        }, 200);
      };
    };
  };


  render() {
    // console.log(this.grid)
    return (
      <div className="App">
        <svg className="main" ref="svg" onMouseOver={this.handleHover} />
      </div>
    );
  };
};
