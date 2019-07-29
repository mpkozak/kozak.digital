import React, { PureComponent } from 'react';
import { d3 } from './_d3.js'
import './App2.css';
// import { randomLetter, emptyGrid } from './_help.js';



const alpha = ('qwertyuiopasdfghjklzxcvbnm').split('');
const randomLetter = () => alpha[Math.floor(Math.random() * 26)];

const emptyGrid = (cols, rows) => {
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




const content = {
  title: {
    str: 'this is not a website',
    delay: 1000,
    onHover: false,
    color: '#FFFFFF',
      posX: .5,
      posY: .5
  },
  name: {
    str: 'm. parker kozak',
    delay: 2000,
    onHover: false,
    color: '#D24141',
      posX: .75,
      posY: .6
  },
  skills: {
    str: 'skills',
    delay: 2500,
    onHover: true,
    color: '#FFAF24',
      posX: .7,
      posY: .4,
  },
  projects: {
    str: 'projects',
    delay: 2750,
    onHover: true,
    color: '#FFAF24',
      posX: .22,
      posY: .18,
  },
  contact: {
    str: 'contact',
    delay: 3000,
    onHover: true,
    color: '#FFAF24',
      posX: .85,
      posY: .75,
  },
  links: {
    str: 'links',
    delay: 3250,
    onHover: true,
    color: '#FFAF24',
      posX: .15,
      posY: .9,
  },
}


const layouts = {
  // desktop: {
  //   title: {
  //     posX: .5,
  //     posY: .5
  //   },
  //   name: {
  //     posX: .75,
  //     posY: .6
  //   },
  //   skills: {
  //     posX: .7,
  //     posY: .4,
  //     offsetX: 0,
  //     offsetY: -2,
  //     deltaX: .3,
  //     deltaY: -1
  //   },
  //   projects: {
  //     posX: .22,
  //     posY: .18,
  //     offsetX: 0,
  //     offsetY: 3,
  //     deltaX: .5,
  //     deltaY: 2
  //   },
  //   contact: {
  //     posX: .85,
  //     posY: .75,
  //     offsetX: -16,
  //     offsetY: 2,
  //     deltaX: 0,
  //     deltaY: 1
  //   },
  //   links: {
  //     posX: .15,
  //     posY: .9,
  //     offsetX: 2,
  //     offsetY: -2,
  //     deltaX: .75,
  //     deltaY: -2
  //   }
  // },



};






export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
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

    this.minGrid = {
      desktop: [56, 32],
      mobileH: [50, 21],
      mobileV: [31, 30],
    };
    this.celRatio = 2 / 3;
    this.maxCelHeight = 18;
    this.drawDelay = 1500;

    this.main = React.createRef();
    this.grid = React.createRef();
    this.gridText = [];


    this.resizeTimeout = undefined;
    this.lastMouseEvent = Date.now();
    this.lastHoverEvent = Date.now();


    this.config = this.config.bind(this);
    this.configCels = this.configCels.bind(this);
    this.configGrid = this.configGrid.bind(this);
    // this.makeGrid = this.makeGrid.bind(this);

    this.handleResize = this.handleResize.bind(this);
    this.handleMouse = this.handleMouse.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
  };



  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    if (this.props.isMobile) {
      window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    };

    // this.configLayout();
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

    this.configLayout(params)
      .then(layout => {
        params.layout = layout;
        return this.configCels(params);
      })
      .then(cels => {
        Object.assign(params, cels);
        return this.configGrid(params);
      })
      .then(grid => {
        Object.assign(params, grid);
        return this.makeEmptyGrid(params);
        // this.setState({ params }, this.makeGrid);
      })
      .then(gridText => {
        this.gridText = gridText;
        this.setState({ params }, () => {
          this.drawGrid(this.gridText, params);
        });
        // console.log('text', gridText)

        // return
      })
  };


  async configLayout({ gridWidth, gridHeight }) {
    const layout = !this.props.isMobile
      ? 'desktop'
      : gridWidth > gridHeight
        ? 'mobileH'
        : 'mobileV';

    return layout;
  };


  async configCels({ gridWidth, gridHeight, layout }) {
    const { celRatio, maxCelHeight } = this;
    const [minCols, minRows] = this.minGrid[layout];

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


  async configGrid({ gridWidth, gridHeight, celWidth, celHeight }) {
    const cols = Math.floor(gridWidth / celWidth);
    const rows = Math.floor(gridHeight / celHeight);

    const marginX = (gridWidth - cols * celWidth) / 2;
    const marginY = (gridHeight - rows * celHeight) / 2;

    return { cols, rows, marginX, marginY };
  };


  async makeEmptyGrid({ cols, rows }) {
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




  // makeGrid() {
  //   const { cols, rows, marginX, marginY } = this.state.params;

  //   this.main.current.style.paddingLeft = marginX + 'px';
  //   this.main.current.style.paddingTop = marginY + 'px';

  //   this.gridText = emptyGrid(cols, rows);

  //   this.drawGrid(this.gridText);
  //   setTimeout(() => this.populateGrid(), this.drawDelay);

  //   // setTimeout(() => this.customDraw(content.title), 2000);
  // };





  populateGrid() {
    Object.values(content).forEach(d => {
      setTimeout(() => this.customDraw(d), d.delay - this.drawDelay)
    })
  }



////////////////////////////////////////////////////////////////////////////////
// ** D3 Draw Functions ** //
////////////////////////////////////////////////////////////////////////////////

  async drawGrid(cels) {
    const { celWidth, celHeight, cols, rows } = this.state.params;
    // console.log('draw grid ran', celWidth, celHeight, cols, rows)
    const delayScale = 1 / (2 * rows + cols);
    const delay = this.drawDelay * delayScale;

    const grid = d3.select(this.grid.current);
    grid.selectAll('div').remove();
    this.grid.current.style.opacity = 1;

    grid.selectAll('div').data(cels)
      .enter().append('div')
        .text(d => d.text)
        .attr('id', d => d.id)
        .style('left', d => d.c * celWidth + 'px')
        .style('top', d => d.r * celHeight + 'px')
        .style('width', celWidth + 'px')
        .style('height', celHeight + 'px')
        .style('opacity', 0)
      .transition()
        .delay(d => delay * ((2 * d.r + d.c) * Math.random()))
        .style('opacity', 1)
        .on('end', (d, i) => {
          if (i < cels.length - 1) return null;
          // console.log('past', i)
          this.populateGrid();
        })
  };


  drawGridCustom(cels) {
    cels.forEach((d, i) => {
      // console.log(this.gridText.find(a => a.id === d.id), d)
      d3.select(`#${d.id}`)
        .transition()
          .delay(i * 50 * Math.random())
          .style('opacity', 0)
          .style('color', d.color)
        .transition()
          .text(d.text)
          .style('opacity', 1);
      })
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


  customDraw(content) {
    const { cols, rows } = this.state.params;

    let c = Math.round(content.posX * cols - content.str.length / 2);
    let r = Math.round(content.posY * rows);

    const queue = [];
    content.str.split('').forEach((d, i) => {
      const cel = this.gridText[cols * r + c++];
      if (d !== ' ') {
        queue.push(Object.assign(cel, {
          text: d,
          color: content.color,
          onHover: content.onHover,
          static: true,
        }))
      }
    })

    this.drawGridCustom(queue);
  };























  undrawGrid() {
    const cels = this.gridText;

    cels.forEach(d => {
      d3.select(`#${d.id}`)
        .transition()
        .remove()
    })

  }



  undrawCels(cels) {

    cels.forEach(d => {
      // console.log(d.id)
      if (!d.remove) return null;
      d3.select(`#${d.id}`)
          .attr('class', 'delete')
          .attr('id', null)
          // .on('mouseover', null)
          // .on('click', null)
        .transition()
          .delay(Math.floor(d.delay / 1.5))
          .style('opacity', 0)
          .remove();
    });
  }








  handleResize(e) {
    // if (!this.state.isResizing) {
    //   this.setState({ isResizing: true })
    // };
    this.grid.current.style.opacity = 0;
    this.drawDelay = 500;
    clearTimeout(this.resizeTimeout);



    // this.undrawGrid();
    this.resizeTimeout = setTimeout(this.config, 500);
    // this.configCels();
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



      // console.log('hover', cel)
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
