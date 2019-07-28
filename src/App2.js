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








export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      celWidth: 12,
      celHeight: 18,
      cols: 0,
      rows: 0,
    };

    this.minGrid = {
      desktop: [56, 32],
      mobileH: [50, 21],
      mobileV: [31, 30],
    };
    this.celRatio = 2 / 3;
    this.maxCelHeight = 21;

    this.main = React.createRef();
    this.grid = React.createRef();
    this.gridText = [];

    this.resizeTimeout = undefined;
    this.lastMouseEvent = Date.now();



    this.configCels = this.configCels.bind(this);
    this.configGrid = this.configGrid.bind(this);
    this.fillGrid = this.fillGrid.bind(this);

    this.handleResize = this.handleResize.bind(this);
    this.handleMouse = this.handleMouse.bind(this);
  };



  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.configCels();
  };

  componentDidUpdate() {
    console.log('update', this.state)
    // const { celWidth, celHeight } = this.state;
    // console.log('w:', celWidth, 'h:', celHeight);/
    // this.drawCels(this.gridText)
  };



////////////////////////////////////////////////////////////////////////////////
// ** Layout Configuration ** //
////////////////////////////////////////////////////////////////////////////////

  getLayout(w, h) {
    const layout = !this.props.isMobile
      ? 'desktop'
      : w > h
        ? 'mobileH'
        : 'mobileV';
    return this.minGrid[layout];
  };


  configCels() {
    const { clientWidth, clientHeight } = this.grid.current;
    const [minCols, minRows] = this.getLayout(clientWidth, clientHeight);

    const w = clientWidth / minCols;
    const h = clientHeight / minRows;
    let celWidth = h * this.celRatio;
    let celHeight = w / this.celRatio;

    if (clientHeight / celHeight < minRows) {
      celHeight = h;
    } else {
      celWidth = w;
    };

    if (celHeight > this.maxCelHeight) {
      celHeight = this.maxCelHeight;
      celWidth = this.maxCelHeight * this.celRatio;
    };

    this.configGrid(clientWidth, clientHeight, celWidth, celHeight);
  };


  configGrid(clientWidth, clientHeight, celWidth, celHeight) {
    const cols = Math.floor(clientWidth / celWidth);
    const rows = Math.floor(clientHeight / celHeight);

    const marginX = (clientWidth - cols * celWidth) / 2;
    const marginY = (clientHeight - rows * celHeight) / 2;
    // this.grid.current.style.marginLeft = marginX + 'px';
    // this.grid.current.style.marginTop = marginY + 'px';
    this.main.current.style.paddingLeft = marginX + 'px';
    this.main.current.style.paddingTop = marginY + 'px';

    this.setState({
      celWidth,
      celHeight,
      cols,
      rows,
    }, this.fillGrid);

  };


  fillGrid() {
    const { cols, rows } = this.state;
    this.gridText = emptyGrid(cols, rows);
    this.drawCels(this.gridText)
  };



////////////////////////////////////////////////////////////////////////////////
// ** D3 Draw Functions ** //
////////////////////////////////////////////////////////////////////////////////

  drawCels(cels) {
    const { celWidth, celHeight, cols, rows } = this.state;
    const delayScale = 1 / (2 * rows + cols);
    const delay = 2000


    this.grid.current.style.opacity = 1;
    const grid = d3.select(this.grid.current)

    // grid.selectAll('div').remove()

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
        .delay(d => delay * delayScale * ((2 * d.r + d.c) * Math.random()))
        .style('opacity', 1);
  };


  undrawGrid() {
    const grid = d3.select(this.grid.current);
    const cels = this.gridText;

    cels.forEach(d => {
      d3.select(`#${d.id}`)
        .transition()
        .remove()
    })

  }







  undrawCels(cels) {
    // const grid = d3.select(this.grid.current);
    // // const undraw = grid.selectAll(d => d.remove)

    // const targets = cels.filter(d => d.remove);

    // targets.forEach(d => {
    //   const tar =
    //   d3.select(d.id)
    //   tar
    //     .style('opacity', 0)
    //     .remove()
    //   // console.log(tar)
    // })

    // console.log(targets)

    // console.log('und', undraw)

    // grid.selectAll()
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
    clearTimeout(this.resizeTimeout);
    this.undrawGrid();
    this.resizeTimeout = setTimeout(this.configCels, 500);
    // this.configCels();
  };




  handleMouse(e) {
    e.stopPropagation();
    const now = Date.now();
    if (now - this.lastMouseEvent < 16) return null;
    this.lastMouseEvent = now;

    const cel = this.gridText[parseInt(e.target.id.slice(3))];
    if (!cel) return null;
    if (e.type === "mousemove") {
      this.handleHover(cel);
    };
    if (e.type === "click") {
      // this.handleClick(cel);
    };
  };


  handleHover(cel) {
    cel.text = randomLetter();
    // this.gridText[i].text = randomLetter();

    // cel.text="hello";

    // console.log(cel.text, this.gridText[i].text)


    d3.select(`#${cel.id}`)
      .transition()
        .style('opacity', 0)
      .transition()
        .text(cel.text)
        .style('opacity', 1)
  };












  render() {
    // const { isMobile } = this.props;

    const { celWidth, celHeight, gridText } = this.state;

    const gridStyle = {
      fontSize: celHeight,
    };

    return (
      <div id="App">
        <div id="Main"
          ref={this.main}
          onMouseMove={this.handleMouse}
          onClick={this.handleMouse}
          // onTouchMove={isMobile ? }
        >
          <div id="Grid" ref={this.grid} style={gridStyle} />
        </div>
      </div>
    );
  };
};
