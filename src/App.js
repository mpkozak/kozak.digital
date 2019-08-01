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
      skills: false,
      projects: false,
      links: false,
      contact: false,
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

    this.grid = React.createRef();


    this.resizeTimeout = undefined;
    this.handleResize = this.handleResize.bind(this);


    this.lastMouseEvent = Date.now();

    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleMouse = this.handleMouse.bind(this);
  };



  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    // if (this.props.isMobile) {
    //   window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    // };
    this.config();


    // const parsed = {};
    // Object.entries(layouts).forEach(d => {
    //   parsed[d[0]] = {};
    //   Object.entries(d[1]).forEach(f => {
    //     parsed[d[0]][f[0]] = f[1]
    //   })
    // })

    // console.log(parsed)

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
        this.addGridTextInitial(Object.assign(params, gridSize))
      )
      .then(gridText => {
        this.gridText = gridText;
        this.setState({ params }, () => {
          if (!this.state.isLoaded) {
            return this.drawStackInitial();
          };
          this.drawStackIsLoaded();
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





////////////////////////////////////////////////////////////////////////////////
// ** Layout Configuration ** //
////////////////////////////////////////////////////////////////////////////////

  async addGridTextInitial({ cols, rows }) {
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

    str.split('').forEach((char, i) => {
      const cel = this.gridText[cols * r + c++];
      if (char === ' ') return null;
      queue.push(Object.assign(cel, {
        text: char,
        color: color,
        onHover: onHover,
        static: true,
        // delay: delay + Math.floor((i / str.length) * 250 * Math.random()),
        delay: delay + Math.floor((i / str.length) * 50 + 200 * Math.random()),
      }));
    });

    return queue;
  };


  async addGridTextDynamic(cl) {
    const { data, posX, posY, offsetX, offsetY, deltaX, deltaY } = this.content[cl];
    const { cols, rows } = this.state.params;

    const baseR = Math.round((posY * rows) + offsetY);
    const baseC = Math.round((posX * cols) + offsetX);

    const queue = [];
    const total = data.map(d => d.str.split('')).flat().length;

    data.forEach((d, i) => {
      const r = baseR + (deltaY * i);
      let c = Math.round(baseC + (deltaX * i) + (2 * Math.random() - 1));

      d.str.split('').forEach(char => {
        const cel = this.gridText[cols * r + c++];
        if (char === ' ') return null;
        queue.push(Object.assign(cel, {
          text: char,
          color: d.color,
          cl: cl,
          static: true,
          // delay: Math.floor((queue.length / total) * 500 * Math.random()),
          // delay: Math.floor((queue.length / total) * 250 + 250 * Math.random()),
          delay: Math.floor(((queue.length / total) + Math.random()) * 250),
        }));
      });
    });

    return queue;
  };


  async removeGridTextDynamic(cl) {
    const cels = this.gridText.filter(a => a.cl === cl);
    return Promise.all(
      cels.map((d, i, a) => {
        d.text = randomLetter();
        // d.delay = Math.floor(((a.length - i) / a.length) * 500 * Math.random());
        // d.delay = Math.floor(((a.length - i) / a.length) * 250 + 250 * Math.random());
        d.delay = Math.floor((((a.length - i) / a.length) + Math.random()) * 250);
        delete d.cl;
        delete d.color;
        return d;
      })
    );
  };





////////////////////////////////////////////////////////////////////////////////
// ** D3 Draw Functions ** //
////////////////////////////////////////////////////////////////////////////////

  async drawStackInitial() {
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


  async drawStackIsLoaded() {
    Promise.all(Object.values(this.content).map(d =>
      this.addGridTextStatic(d)
    ))
      .then(done => Promise.all(
        ['skills', 'projects', 'links', 'contact'].map(cl => {
          if (!this.state[cl]) return null;
          return this.addGridTextDynamic(cl);
        })
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

    return new Promise((res, rej) =>
      d3.select(this.grid.current)
        .selectAll('div').data(this.gridText, d => d.id)
        .enter().append('div')
          .attr('id', d => d.id)
          .text(d => d.text)
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
    return new Promise((res, rej) => {
      d3.select(this.grid.current)
        .selectAll('div').data(cels, d => d.id)
          .transition()
            .duration(100)
            .delay(d => d.delay)
            .style('opacity', 0)
          .transition()
            .duration(100)
            .text(d => d.text)
            .style('color', d => d.color || null)
            .style('opacity', 1)
            .on('end', (d, i, a) => {
              delete d.delay;
              if (i < a.length - 1) return null;
              res();
            });
    });
  };




  async undrawGridFull() {

    // d3.select(this.grid.current)
    //   .selectAll('div').data(this.gridText, d => d.id)
    //     .transition()
    //       .delay(() => Math.random() * 250)
    //       .style('opacity', 0)
    //       .remove();

    return new Promise((res, rej) => {
      let i = 0;
      setTimeout(() => res(false), 400)

      d3.select(this.grid.current)
        .selectAll('div').data(this.gridText, d => d.id)
          .transition()
            .duration(100)
            .delay(() => Math.floor(Math.random() * 250))
            .style('opacity', 0)
            .remove()
            .on('end', () => {
              if (++i < this.gridText.length) return null;
              res(true);
            });
    });
  };







  drawGridLetterSwap(cel) {
    // d3.select(this.grid.current)
    //   .selectAll('div').data([cel], d => d.id)
    //   .each(d => cel.text = randomLetter())
    //     .transition()
    //       .style('opacity', 0)
    //     .transition()
    //       .text(d => d.text)
    //       .style('opacity', 1);

    cel.text = randomLetter();
    d3.select(`#${cel.id}`)
      .transition()
        .style('opacity', 0)
      .transition()
        .text(cel.text)
        .style('opacity', 1);
  };











////////////////////////////////////////////////////////////////////////////////
// ** Event Handler Helpers ** //
////////////////////////////////////////////////////////////////////////////////

  helpRedraw() {
    return setTimeout(() => {
      this.setState({ isResizing: false, isClear: false }, () => {
        this.config();
      });
    }, 400);
  };


  helpCombinedHover(cel) {
    const cl = cel.onHover;

    if (!cel.static) {
      this.drawGridLetterSwap(cel);
    } else if (cl) {
      this.helpToggleDynamicText(cl);
    };
  };


  helpToggleDynamicText(cl) {
    const active = this.state[cl];
    const now = Date.now();

    if (!active) {
      this.setState({ [cl]: now }, () => {
        this.addGridTextDynamic(cl)
          .then(queue => this.drawGridCustom(queue))
          .then(() => this.setState({ [cl]: Date.now() }))
      });
    } else if (now - active > 500) {
      this.removeGridTextDynamic(cl)
        .then(queue => this.drawGridCustom(queue))
        .then(() => this.setState({ [cl]: false }))
    };
  };




  helpClick(cel) {
    console.log('click', cel)
  };








////////////////////////////////////////////////////////////////////////////////
// ** Event Handlers ** //
////////////////////////////////////////////////////////////////////////////////

  handleResize(e) {
    clearTimeout(this.resizeTimeout);

    if (!this.state.isResizing) {
      this.setState({ isResizing: true }, () => {
        this.undrawGridFull()
          .then(done => {
            if (!done) {
              d3.select(this.grid.current).selectAll('div').remove();
            };
            this.setState({ isClear: true }, () => {
              this.resizeTimeout = this.helpRedraw();
            });
          })
      });
    };

    if (this.state.isClear) {
      this.resizeTimeout = this.helpRedraw();
    };
  };


  handleMouse(e) {
    const now = Date.now();
    if (now - this.lastMouseEvent < 16) return null;

    this.lastMouseEvent = now;
    const cel = this.gridText[parseInt(e.target.id.slice(3))];
    if (!cel) return null;

    if (e.type === 'mousemove') {
      this.helpCombinedHover(cel);
    };

    if (e.type === 'click') {
      this.helpClick(cel);
    };
  };


  handleTouchMove(e) {
    e.preventDefault();
    const { clientX, clientY } = e.changedTouches[0];
    const el = document.elementFromPoint(clientX, clientY);
    const cel = el ? this.gridText[el.id.substring(3)] : null;

    if (cel) {
      this.helpCombinedHover(cel);
    };
  };





////////////////////////////////////////////////////////////////////////////////
// ** Render ** //
////////////////////////////////////////////////////////////////////////////////

  render() {
    const { celHeight, marginX, marginY } = this.state.params;

    const gridStyle = {
      fontSize: celHeight,
      marginLeft: marginX,
      marginTop: marginY,
    };

    return (
      <div id="App">
        <div id="Main"
          onMouseMove={this.handleMouse}
          onClick={this.handleMouse}
        >
          <div id="Grid" ref={this.grid} style={gridStyle} />
        </div>
      </div>
    );
  };
};
