import React, { PureComponent } from 'react';
import { d3 } from './_help.js'
import './App.css';
import { content, layouts } from './_data.js';


export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasConfig: false,
      hasDrawn: false,
      isResizing: false,
      active: {
        skills: false,
        projects: false,
        links: false,
        contact: false,
      },
    };
    this.proto = {
      alpha: ('qwertyuiopasdfghjklzxcvbnm').split(''),
      randomLetter: () => this.proto.alpha[Math.floor(Math.random() * 26)],
      content: content(props.isMobile),
      layouts: layouts,
      celRatio: 2 / 3,
      maxCelHeight: 18,
      minGrid: {
        desktop: [56, 32],
        mobileH: [50, 21],
        mobileV: [31, 30],
      },
    };
    this.grid = React.createRef();
    this.params = {};
    this.content = {};
    this.gridText = [];

    this.resizeTimeout = undefined;
    this.lastMouseEvent = 0;

    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
  };





  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    if (this.props.isMobile) {
      window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    };
    this.config(this.grid.current)
      .then(() => this.draw())
      .catch(err => console.error('componentDidMount()', err))
  };


  // componentDidUpdate() {
  //   console.log('st', this.state, this.params)
  // }



////////////////////////////////////////////////////////////////////////////////
// ** Getters ** //
////////////////////////////////////////////////////////////////////////////////

  get style() {
    if (!this.state.hasConfig) return null;
    return {
      fontSize: this.params.celHeight.toFixed(2) + 'px',
      marginLeft: this.params.marginX + 'px',
      marginTop: this.params.marginY + 'px',
    };
  };





////////////////////////////////////////////////////////////////////////////////
// ** Layout Configuration ** //
////////////////////////////////////////////////////////////////////////////////

  async config() {
    return this.configContentLayout(this.grid.current)
      .then(() => this.configCelSize(this.params))
      .then(() => this.configGridSize(this.params))
      .then(() => this.configGridLayout(this.params))
      .then(() => this.setState({ hasConfig: true }))
      .catch(err => console.error('config()', err))
  };


  async configContentLayout({ clientWidth, clientHeight }) {
    this.params = {
      gridWidth: clientWidth,
      gridHeight: clientHeight,
      layout: !this.props.isMobile
        ? 'desktop'
        : clientWidth > clientHeight
          ? 'mobileH'
          : 'mobileV',
    };

    Object.keys(this.proto.content)
      .forEach(key => {
        this.content[key] = {
          ...this.proto.content[key],
          layout: this.proto.layouts[this.params.layout][key],
        };
      });

    return;
  };


  async configCelSize({ gridWidth, gridHeight, layout }) {
    const { celRatio, maxCelHeight, minGrid } = this.proto;
    const [minCols, minRows] = minGrid[layout];

    const w = gridWidth / minCols;
    const h = gridHeight / minRows;
    this.params.celWidth = h * celRatio;
    this.params.celHeight = w / celRatio;

    if (gridHeight / this.params.celHeight < minRows) {
      this.params.celHeight = h;
    } else {
      this.params.celWidth = w;
    };

    if (this.params.celHeight > maxCelHeight) {
      this.params.celHeight = maxCelHeight;
      this.params.celWidth = maxCelHeight * celRatio;
    };

    return;
  };


  async configGridSize({ gridWidth, gridHeight, celWidth, celHeight }) {
    this.params.cols = Math.floor(gridWidth / celWidth);
    this.params.rows = Math.floor(gridHeight / celHeight);
    this.params.marginX = (gridWidth - this.params.cols * celWidth) / 2;
    this.params.marginY = (gridHeight - this.params.rows * celHeight) / 2;

    return;
  };


  async configGridLayout({ cols, rows }) {
    Object.keys(this.content).forEach(key => {
      const { str, layout, onHover } = this.content[key];
      const { posX, posY, offsetX, offsetY, deltaX, deltaY } = layout;

      const baseR = Math.round(posY * rows);
      const baseC = Math.round(posX * cols - str.length / 2);
      this.content[key].startIndex = cols * baseR + baseC;

      if (!onHover) return null;

      onHover.total = onHover.data
        .map(d => d.str.split('')).flat().length;
      onHover.data.forEach((d, i) => {
        const r = baseR + (deltaY * i) + offsetY;
        const c = Math.round(baseC + (deltaX * i) - d.str.length / 2)
          + offsetX;
        d.startIndex = cols * r + c;
      });
    });

    console.log(this.content)

    // const { str, color, delay, activeCl, layout: { posX, posY } } = content;
    // const { hasDrawn } = this.state;
    // const { cols, rows } = this.params;

    // const r = Math.round(posY * rows);
    // const c = Math.round(posX * cols - str.length / 2);
    // const startIndex = cols * r + c;


    return;
  };





////////////////////////////////////////////////////////////////////////////////
// ** Grid Text ** //
////////////////////////////////////////////////////////////////////////////////

  async addTextInitial() {
    const { cols, rows } = this.params;
    const dScale = this.props.isMobile ? 60 : 100;
    const tScalar = 250 / (cols * rows);

    const calcDelay = (r, c) => {
      return Math.floor(
        dScale * (
          tScalar * ((2 * r) + c)
          + Math.random()
        )
      );
    };

    this.gridText = [];
    let id = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.gridText.push({
          c,
          r,
          id: `cel${id++}`,
          text: this.proto.randomLetter(),
          delay: this.state.hasDrawn
            ? Math.floor(500 * Math.random())
            : calcDelay(r, c),
          active: true,
        });
      };
    };

    return;
  };


  async addTextStatic(content) {
    // const { str, color, delay, activeCl, layout: { posX, posY } } = content;
    // const { hasDrawn } = this.state;
    // const { cols, rows } = this.params;

    // const r = Math.round(posY * rows);
    // const c = Math.round(posX * cols - str.length / 2);
    // const startIndex = cols * r + c;
    // const queue = [];

    const { str, color, delay, activeCl, startIndex } = content;
    const { hasDrawn } = this.state;

    const queue = [];


    str.split('').forEach((char, i) => {
      if (char === ' ') return null;
      const cel = this.gridText[startIndex + i];

      cel.active = true;
      cel.text = char;
      cel.color = color;
      cel.static = true;
      if (!hasDrawn) {
        cel.delay = delay + Math.floor((i / str.length) * 50 + 200 * Math.random());
      };
      if (activeCl) {
        cel.activeCl = activeCl;
      };

      queue.push(cel);
    });

    return queue;
  };


  async addTextDynamic(cl) {
    const { onHover: { color, data }, layout } = this.content[cl];
    const { posX, posY, offsetX, offsetY, deltaX, deltaY } = layout;
    const { cols, rows } = this.params;

    const total = data.map(d => d.str.split('')).flat().length;
    const baseR = Math.round((posY * rows) + offsetY);
    const baseC = Math.round((posX * cols) + offsetX);
    const queue = [];

    data.forEach((d, i) => {
      const r = baseR + (deltaY * i);
      // const c = Math.round(baseC + (deltaX * i) + (2 * Math.random() - 1));
      const c = Math.round(
        baseC +
        (deltaX * i) +
        (2 * Math.random() - 1)
      );
      const startIndex = cols * r + c;

      d.str.split('').forEach((char, j) => {
        if (char === ' ') return null;
        const cel = this.gridText[startIndex + j];

        cel.active = true;
        cel.cl = cl;
        cel.text = char;
        cel.color = color;
        cel.static = true;
        cel.delay = Math.floor(((queue.length / total) + Math.random()) * 250);
        if (d.action) {
          cel.action = d.action;
        };

        queue.push(cel);
      });
    });

    return queue;
  };


  async removeTextDynamic(cl) {
    const cels = this.gridText.filter(a => a.cl === cl);
    return Promise.all(
      cels.map((d, i, a) => {
        d.text = this.proto.randomLetter();
        d.active = true;
        d.delay = Math.floor((((a.length - i) / a.length) + Math.random()) * 250);
        ['cl', 'color', 'static', 'action'].forEach(key => delete d[key]);
        return d;
      })
    );
  };





////////////////////////////////////////////////////////////////////////////////
// ** Draw Functions ** //
////////////////////////////////////////////////////////////////////////////////

  async draw() {
    return this.addTextInitial()
      .then(() => this.state.hasDrawn
        ? this.drawStackHasDrawn()
        : this.drawStackInitial()
      )
      .catch(err => console.error('draw()', err))
  };


  async drawStackInitial() {
    return this.drawGridFull()
      .then(() => Promise.all(
        Object.values(this.content)
          .map(d => this.addTextStatic(d))
      ))
      .then(cels => Promise.all(
        cels.map(d => this.drawGridCustom(d))
      ))
      .then(() => this.setState({ hasDrawn: true }))
      .catch(err => console.error('drawStackInitial()', err))
  };


  async drawStackHasDrawn() {
    return Promise.all(
      Object.values(this.content)
        .map(d => this.addTextStatic(d))
    )
      .then(() => Promise.all(
        Object.keys(this.state.active).map(cl => {
          if (!this.state.active[cl]) return null;
          return this.addTextDynamic(cl);
        })
      ))
      .then(() => this.drawGridFull())
      .catch(err => console.error('drawStackHasDrawn()', err))
  };





////////////////////////////////////////////////////////////////////////////////
// ** D3 ** //
////////////////////////////////////////////////////////////////////////////////

  async drawGridFull() {
    const { celWidth, celHeight } = this.params;

    return (
      d3.select(this.grid.current)
        .selectAll('div').data(this.gridText, d => d.id)
        .enter().append('div')
        .interrupt()
          .attr('id', d => d.id)
          .attr('class', d => 'cel' + (d.cl ? ' ' + d.cl : ''))
          .text(d => d.text)
          .style('left', d => d.c * celWidth + 'px')
          .style('top', d => d.r * celHeight + 'px')
          .style('width', celWidth + 'px')
          .style('height', celHeight + 'px')
          .style('font-size', celHeight + 'px')
          .style('color', d => d.color ? d.color : null)
          .style('opacity', 0)
        .transition()
          .delay(d => d.delay)
          .style('opacity', 1)
          .on('end', d => {
            d.active = false;
            delete d.delay;
          })
        .end()
    );
  };


  async drawGridCustom(cels) {
    return (
      d3.select(this.grid.current)
        .selectAll('div').data(cels, d => d.id)
          .interrupt()
            .attr('class', d => 'cel' + (d.cl ? ' ' + d.cl : ''))
          .transition()
            .duration(100)
            .delay(d => d.delay)
            .style('opacity', 0)
          .transition()
            .duration(100)
            .text(d => d.text)
            .style('color', d => d.color || null)
            .style('opacity', 1)
            .on('end', d => {
              d.active = false;
              delete d.delay;
            })
          .end()
      );
  };


  drawGridLetterSwap(cel) {
    cel.text = this.proto.randomLetter();
    d3.select(this.grid.current)
      .select(`#${cel.id}`).datum(cel, d => d.id)
      .interrupt()
        .attr('class', 'cel')
      .transition()
        .style('opacity', 0)
      .transition()
        .delay(100)
        .text(cel.text)
        .style('color', null)
        .style('opacity', 1)
  };


  async undrawGridFull() {
    return (
      d3.select(this.grid.current)
        .selectAll('div').data(this.gridText, d => d.id)
          .interrupt()
          .transition()
            .duration(100)
            .delay(() => Math.floor(Math.random() * 250))
            .style('opacity', 0)
            .remove()
          .end()
    );
  };


  eraseGrid() {
    d3.select(this.grid.current)
      .selectAll('div')
        .remove()
  };





////////////////////////////////////////////////////////////////////////////////
// ** Handler Helpers ** //
////////////////////////////////////////////////////////////////////////////////

  helpRedraw() {
    return setTimeout(() => {
      this.setState({ isResizing: false }, () => {
        this.config(this.grid.current)
          .then(() => this.draw())
      });
    }, 500);
  };


  helpCombinedHover(cel) {
    if (cel.active) return null;

    if (!cel.static) {
      this.drawGridLetterSwap(cel);
    } else if (cel.activeCl) {
      this.helpToggleDynamicText(cel.activeCl);
    };
  };


  helpToggleDynamicText(cl) {
    const active = this.state.active[cl];
    const now = Date.now();

    if (!active) {
      this.setState(prevState =>
        ({ active: { ...prevState.active, [cl]: now } }),
        () => this.addTextDynamic(cl)
          .then(queue => this.drawGridCustom(queue))
          .catch(err => console.log('helpToggleDynamicText(cl) caught', err))

      );
    } else if (now - active > 500) {
      this.removeTextDynamic(cl)
        .then(queue => this.drawGridCustom(queue))
        .catch(err => this.drawGridLetterSwap(err))
        .then(() => this.setState(prevState =>
          ({ active: { ...prevState.active, [cl]: false } }),
          () => {
            if (cl === 'contact') {
              window.getSelection().removeAllRanges();
            };
          }
        ))
    };
  };


  helpClick(cel) {
    if (cel.action) {
      return this.helpClickAction(cel)
    };
    if (this.props.isMobile) {
      this.helpCombinedHover(cel);
    };
  };



  helpClickAction(cel) {
    const [action, value] = Object.entries(cel.action)[0];
    if (action === 'url') {
      window.open(value, '_blank');
    };

    // switch (cl) {
    //   case 'projects' :
    //     if (isMobile) {
    //       window.open(click, '_blank');
    //     } else {
    //       this.showIframe(click);
    //     };
    //     break;
    //   case 'links' :
    //     window.open(click, '_blank');
    //     break;
    //   case 'contact' :
    //     if (isMobile) {
    //       window.location = click;
    //     };
    //     break;
    //   case 'info' :
    //     window.open(click, '_blank');
    //     break;
    //   default : return null;
    // };


  };









////////////////////////////////////////////////////////////////////////////////
// ** Event Handlers ** //
////////////////////////////////////////////////////////////////////////////////

  handleResize() {
    clearTimeout(this.resizeTimeout);

    if (!this.state.isResizing) {
      this.setState({ isResizing: true }, () => {
        this.undrawGridFull()
          .catch(() => this.eraseGrid())
          .then(() => {
            this.setState({ hasConfig: false }, () => {
              this.resizeTimeout = this.helpRedraw();
            });
          })
      });
    };
    if (!this.state.hasConfig) {
      this.resizeTimeout = this.helpRedraw();
    };
  };


  handleMouseMove({ target: { id }, timeStamp }) {
    if (!id.includes('cel') || (timeStamp - this.lastMouseEvent < 16)) return null;

    this.lastMouseEvent = timeStamp;
    const cel = this.gridText[parseInt(id.slice(3))];
    // const cel = d3.select(`#${id}`).datum();

    this.helpCombinedHover(cel);
  };


  handleTouchMove(e) {
    e.preventDefault();
    const { clientX, clientY } = e.changedTouches[0];
    const el = document.elementFromPoint(clientX, clientY);
    const cel = el ? this.gridText[parseInt(el.id.slice(3))] : null;

    if (!cel) return null;

    this.helpCombinedHover(cel);
  };


  handleClick({ target: { id } }) {
    if (!id.includes('cel')) return null;
    // console.log(id.slice(3), this.gridText[id.slice(3)])

    const cel = this.gridText[parseInt(id.slice(3))];

    this.helpClick(cel);
  };



////////////////////////////////////////////////////////////////////////////////
// ** Render ** //
////////////////////////////////////////////////////////////////////////////////

  render() {
    // console.log('render')

    // const gridStyle = !this.state.hasConfig
    //   ? null
    //   : {
    //       fontSize: this.params.celHeight.toFixed(2) + 'px',
    //       marginLeft: this.params.marginX + 'px',
    //       marginTop: this.params.marginY + 'px',
    //     };

    // console.log('render', gridStyle)

    return (
      <div id="App">
        <div id="Main"
          onMouseMove={this.handleMouseMove}
          onClick={this.handleClick}
        >
          <div id="Grid" ref={this.grid} style={this.style} />
        </div>
      </div>
    );
  };
};
