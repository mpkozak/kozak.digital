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
      fill: '#FFFFFF',
      posX: .5,
      posY: .5,
      hover: true
    },
    {
      str: 'm. parker kozak',
      fill: '#CB3030',
      posX: .8,
      posY: .65,
      hover: true
    },
    {
      str: 'skills',
      fill: '#FDA50F',
      posX: .65,
      posY: .4,
      hover: ['items']
    },
    {
      str: 'projects',
      fill: '#FDA50F',
      posX: .2,
      posY: .15,
      hover: ['items']
    },
    {
      str: 'contact',
      fill: '#FDA50F',
      posX: .75,
      posY: .8,
      hover: ['items']
    },
    {
      str: 'links',
      fill: '#FDA50F',
      posX: .1,
      posY: .9,
      hover: ['items']
    }
    ];


    this.setSize = this.setSize.bind(this);
    // this.animationStack = this.animationStack.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleHover = this.handleHover.bind(this);
  };

  randomLetter() {
    return this.alpha[Math.floor(Math.random() * 26)];
  };

  emptyGrid(cols, rows) {
    const grid = [];
    let id = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        grid.push({
          r,
          c,
          id: `cel${id++}`,
          text: this.randomLetter(),
          opacity: .5,
          delay: 1000 * (r / rows) + c * (Math.random() + 5)
        });
      };
    };
    return grid;
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.setSize();
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
    this.setState(prevState => ({ cols, rows }));
  };








  componentDidUpdate() {
    console.log('update')
    this.draw();
    // const { grid } = this.state;
    // if (grid.length) {
    // }

    // console.log(this.state.grid.length)
    // this.draw();
  }

  // animationStack() {
  //   const { text } = this;
  //   let elem = 0;
  //   this.animation = setInterval(() => {
  //     const el = text[elem];
  //     console.log('animation ran', el)
  //     const grid = this.populateGrid(el);
  //     // this.setState(prevState => ({ grid }), () => this.draw());
  //     this.setState(prevState => ({ grid }));
  //     elem++;
  //     if (elem > text.length - 1) clearInterval(this.animation)
  //   }, 2000);
  // };






  populateGrid(el) {
    const { cols, rows } = this.state;
    const { grid } = this;
    const newGrid = [...grid];
    const arr = el.str.split('');
    let c = Math.floor(el.posX * cols - arr.length / 2);
    let r = Math.floor(el.posY * rows);
    arr.forEach((d, i) => {
      const cel = newGrid[r * cols + c];
      if (d !== ' ') {
        this.undraw(cel.id);
        cel.opacity = 1;
        cel.text = d;
        cel.fill = el.fill;
        cel.hover = el.hover;
        cel.delay = 50 * i + (Math.random() * 50);
      };
      c++;
    });
    return newGrid;
  };



  draw() {
    console.log('draw call')
    const { grid, fontWidth, fontHeight } = this;
    const { cols, rows } = this.state;
    const { svg } = this.refs;

    const text = d3.select(svg).selectAll('text').data(grid);
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
    .transition(500).delay(d => d.delay ? d.delay : 0)
      .attr('opacity', d => d.opacity ? d.opacity : 1)
    text.transition(500).delay(d => d.delay ? d.delay : 0)
      .attr('id', d => d.id)
      .attr('x', d => d.c * fontWidth)
      .attr('y', d => d.r * fontHeight)
      .text(d => d.text)
      .attr('font-size', fontHeight)
      .attr('fill', d => d.fill ? d.fill : '#999999')
      .attr('text-anchor', 'start')
      .attr('alignment-baseline', 'hanging')
      .attr('opacity', d => d.opacity ? d.opacity : 1)
    text.exit().remove()
  };

  undraw(id, duration) {
    const cel = d3.select(`#${id}`);
    duration = duration ? duration : Math.random() * 200;
    cel.transition().duration(duration)
      .attr('opacity', 0)
      .remove();
    return duration;
  };

  letterSwap(id) {
    const grid = [...this.state.grid];

    const index = grid.findIndex(d => d.id === id);
    const cel = grid[index];
    // const cel = {...grid[index]};


    const duration = this.undraw(id, 300);


    cel.text = this.randomLetter();
    cel.delay = duration

    setTimeout(() => {
      this.setState(prevState => ({ grid }));
    }, duration);

    // cel.text = this.randomLetter();

    // console.log(cel.text, grid[index].text)

    // const cel = grid[i];
    // setTimeout(() => cel.text = this.randomLetter())



    // cel.text = this.randomLetter();


  }


  handleResize() {
    const { svg } = this.refs;
    svg.style.width = 0;
    svg.style.height = 0;
    clearTimeout(this.resetSize);
    this.resetSize = setTimeout(this.setSize, 500);
  };

  handleHover(e) {
    const { grid } = this.state;
    const { id } = e.target;

    const index = grid.findIndex(d => d.id === id);
    // const cel = grid[id.substring(3)];
    const cel = {...grid[index]};

    if (~index) {
      if (cel.hover) {
        console.log(cel)
      } else {
        this.letterSwap(id);
      };
    };

    // console.log(index && ~index)
    // console.log(index, cel)
    // if (index && !cel.hover) {
    //   ;
    //   // console.log(grid.length)
    //   // console.log(cel)
    // };
    // if (cel) this.undraw(cel)
    // console.log(cel)
  }

  render() {
    // console.log(this.state.grid)
    return (
      <div className="App">
        <svg className="main" ref="svg" onMouseOver={this.handleHover} />
      </div>
    );
  };
};
