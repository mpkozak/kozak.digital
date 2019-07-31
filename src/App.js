import React, { PureComponent } from 'react';
import { d3 } from './_d3.js'
import './App.css';
// import { randomLetter, emptyGrid } from './_help.js';
import { content, layouts } from './_data.js';



const alpha = ('qwertyuiopasdfghjklzxcvbnm').split('');
const randomLetter = () => alpha[Math.floor(Math.random() * 26)];










export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isResizing: false,
      params: {
        gridWidth: 0,
        gridHeight: 0,
        layout: undefined,
        celWidth: 0,
        celHeight: 0,
        cols: 0,
        rows: 0,
        marginX: 0,
        marginY:0,
      },
    };

    this.content = {};
    this.gridText = [];

    this.celRatio = 2 / 3;
    this.maxCelHeight = 18;
    this.minGrid = {
      desktop: [56, 32],
      mobileH: [50, 21],
      mobileV: [31, 30],
    };


    this.main = React.createRef();
    this.grid = React.createRef();



    this.config = this.config.bind(this);
    this.undrawGridFull = this.undrawGridFull.bind(this);




    this.resizeTimeout = undefined;

    this.handleResize = this.handleResize.bind(this);


    // this.drawDelay = 1500;




    this.lastMouseEvent = Date.now();
    this.lastHoverEvent = Date.now();



    // this.configCelSize = this.configCelSize.bind(this);
    // this.configGrid = this.configGrid.bind(this);
    // this.makeGrid = this.makeGrid.bind(this);

    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleMouse = this.handleMouse.bind(this);
  };



  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    // if (this.props.isMobile) {
    //   window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    // };
    this.config();
  };

  componentDidUpdate() {

  };



////////////////////////////////////////////////////////////////////////////////
// ** Layout Configuration ** //
////////////////////////////////////////////////////////////////////////////////

  async config() {
    const { clientWidth, clientHeight } = this.grid.current;
    const params = {
      gridWidth: clientWidth,
      gridHeight: clientHeight,
    };

    this.configContentLayout(params)
      .then(layout =>
        this.configCelSize(Object.assign(params, layout))
      )
      .then(celSize =>
        this.configGridSize(Object.assign(params, celSize))
      )
      .then(gridSize =>
        this.populateGridText(Object.assign(params, gridSize))
      )
      .then(gridText => {
        this.gridText = gridText;
        this.setState({ params }, () => {
          if (!this.state.isLoaded) {
            return this.initialDrawStack();
          };
          this.isLoadedDrawStack();
        })
      })
      .catch(err => console.log(err));
  };


  async configContentLayout({ gridWidth, gridHeight }) {
    const layout = !this.props.isMobile
      ? 'desktop'
      : gridWidth > gridHeight
        ? 'mobileH'
        : 'mobileV';

    Object.keys(content).forEach(key => {
      this.content[key] = {
        ...content[key],
        ...layouts[layout][key]
      };
    });

    return { layout };
  };


  async configCelSize({ gridWidth, gridHeight, layout }) {
    const { celRatio, maxCelHeight, minGrid } = this;
    const [minCols, minRows] = minGrid[layout];

    const w = gridWidth / minCols;
    const h = gridHeight / minRows;
    let celWidth = h * celRatio;
    let celHeight = w / celRatio;

    if (gridHeight / celHeight < minRows) {
      celHeight = h;
    } else {
      celWidth = w;
    };

    if (celHeight > maxCelHeight) {
      celHeight = maxCelHeight;
      celWidth = maxCelHeight * celRatio;
    };

    return { celWidth, celHeight };
  };


  async configGridSize({ gridWidth, gridHeight, celWidth, celHeight }) {
    const cols = Math.floor(gridWidth / celWidth);
    const rows = Math.floor(gridHeight / celHeight);
    const marginX = (gridWidth - cols * celWidth) / 2;
    const marginY = (gridHeight - rows * celHeight) / 2;

    return { cols, rows, marginX, marginY };
  };


  async populateGridText({ cols, rows }) {
    const grid = [];
    let id = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        grid.push({
          c,
          r,
          id: `cel${id++}`,
          text: randomLetter(),
        });
      };
    };
    return grid;
  };


  async addGridTextStatic(content) {
    const { str, posX, posY, color, onHover, delay } = content;
    const { cols, rows } = this.state.params;

    const queue = [];
    const r = Math.round(posY * rows);
    let c = Math.round(posX * cols - str.length / 2);

    str.split('').forEach(char => {
      const cel = this.gridText[cols * r + c++];
      if (char === ' ') return null;
      queue.push(Object.assign(cel, {
        text: char,
        color: color,
        onHover: onHover,
        static: true,
        delay: delay
      }));
    });

    return queue;
  };






////////////////////////////////////////////////////////////////////////////////
// ** D3 Draw Functions ** //
////////////////////////////////////////////////////////////////////////////////

  async initialDrawStack() {
    this.drawGridFull()
      .then(done =>
        Promise.all(Object.values(this.content).map(d =>
          this.addGridTextStatic(d)
        ))
      )
      .then(cels =>
        Promise.all(cels.map(d =>
          this.drawGridCustom(d)
        ))
      )
      .then(done =>
        this.setState({ isLoaded: true })
      )
      .catch(err => console.log(err))
  };


  async isLoadedDrawStack() {
    Promise.all(Object.values(this.content).map(d =>
      this.addGridTextStatic(d)
    ))
      .then(done => this.drawGridFull())
      .catch(err => console.log(err))
  };


  async drawGridFull() {
    const { isLoaded, params } = this.state;
    const { celWidth, celHeight, cols, rows } = params;

    const calcDelay = d => {
      if (isLoaded) return Math.floor(500 * Math.random());
      const delay = this.props.isMobile ? 300 : 500;
      const tScalar = 250 / (cols * rows);
      const dScale = (delay / 5);
      return Math.floor(
        dScale * (
          tScalar * (
            (2 * d.r) + d.c
          ) + Math.random()
        )
      );
    };

    const grid = d3.select(this.grid.current);
    grid.selectAll('div').remove();
    this.grid.current.style.opacity = 1;

    return new Promise((res, rej) =>
      grid.selectAll('div').data(this.gridText)
        .enter().append('div')
          .text(d => d.text)
          .attr('id', d => d.id)
          .style('left', d => d.c * celWidth + 'px')
          .style('top', d => d.r * celHeight + 'px')
          .style('width', celWidth + 'px')
          .style('height', celHeight + 'px')
          .style('color', d => d.color ? d.color : null)
          .style('opacity', 0)
        .transition()
          .delay(d => calcDelay(d))
          .style('opacity', 1)
          .on('end', (d, i, a) => {
            if (i < a.length - 1) return null;
            res();
          })
    );
  };






  async drawGridCustom(cels) {
    return new Promise((res, rej) =>
      cels.forEach((d, i, a) => {
        d3.select(`#${d.id}`)
          .transition()
            .delay((d.delay - 1000) + i * 50 * Math.random())
            .style('opacity', 0)
            .style('color', d.color)
          .transition()
            .text(d.text)
            .style('opacity', 1)
            // .on('end', () => res());
            .on('end', () => {
              // if (i < a.length - 1) return null;
              res();
            });
      })
    );
  };

  undrawGridFull() {
    d3.select(this.grid.current).selectAll('div')
      .transition()
        .delay(() => Math.random() * 250)
        .style('opacity', 0)
        .remove()
  };







  letterSwap(cel) {
    cel.text = randomLetter();
    d3.select(`#${cel.id}`)
      .transition()
        .style('opacity', 0)
      .transition()
        .text(cel.text)
        .style('opacity', 1);
  };
























  // undrawCels(cels) {

  //   cels.forEach(d => {
  //     // console.log(d.id)
  //     if (!d.remove) return null;
  //     d3.select(`#${d.id}`)
  //         .attr('class', 'delete')
  //         .attr('id', null)
  //         // .on('mouseover', null)
  //         // .on('click', null)
  //       .transition()
  //         .delay(Math.floor(d.delay / 1.5))
  //         .style('opacity', 0)
  //         .remove();
  //   });
  // }





////////////////////////////////////////////////////////////////////////////////
// ** Event Handlers ** //
////////////////////////////////////////////////////////////////////////////////

  handleResize(e) {
    clearTimeout(this.resizeTimeout);
    if (!this.state.isResizing) {
      this.setState({ isResizing: true }, this.undrawGridFull);
    };
    this.resizeTimeout = setTimeout(() => {
      this.setState({ isResizing: false }, this.config);
    }, 500);
  };














  handleMouse(e) {
    // e.stopPropagation();
    const now = Date.now();
    if (now - this.lastMouseEvent < 16) return null;
    this.lastMouseEvent = now;


    const cel = this.gridText[parseInt(e.target.id.slice(3))];
    if (!cel) return null;
    if (e.type === 'mousemove') {
      this.handleHover(cel)
    };
    if (e.type === 'click') {
      this.handleClick(cel);
    };
  };



  handleTouchMove(e) {
    e.preventDefault();
    const { clientX, clientY } = e.changedTouches[0];
    const el = document.elementFromPoint(clientX, clientY);
    const cel = el ? this.gridText[el.id.substring(3)] : null;
    if (cel) {
      this.handleHover(cel);
    };
  };




  handleClick(cel) {
    console.log(cel)
  };


  handleHover(cel) {
    if (!cel.static) {
      this.letterSwap(cel);
    } else if (cel.onHover) {
      const now = Date.now();
      if (now - this.lastHoverEvent < 1000) return null;
      this.lastHoverEvent = now;



      console.log('hover', cel)
    };
  };




  render() {
    // const { isMobile } = this.props;

    const { celHeight } = this.state.params;

    const gridStyle = {
      fontSize: celHeight,
    };

    return (
      <div id="App">
        <div id="Main"
          ref={this.main}
          onMouseMove={this.handleMouse}
          onClick={this.handleMouse}
        >
          <div id="Grid" ref={this.grid} style={gridStyle} />
        </div>
      </div>
    );
  };
};
