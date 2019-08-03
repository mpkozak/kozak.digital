import React, { PureComponent } from 'react';
import { d3, randomLetter, createCSSSelector } from './_help.js'
import './App.css';
import { content, layouts } from './_data.js';











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


    this.lastMouseEvent = 0;

    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
  };



  componentDidMount() {
    console.log(document.styleSheets)
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
          return this.drawStackIsLoaded();
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
        layout: layouts[layout][key]
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

    createCSSSelector('.cel', {
      width: celWidth,
      height: celHeight,
    });

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
          active: true,
          text: randomLetter(),
        });
      };
    };
    return grid;
  };


  async addGridTextStatic(content) {
    const { str, color, delay, activeCl, layout } = content;
    const { posX, posY } = layout;
    const { cols, rows } = this.state.params;

    const queue = [];
    const r = Math.round(posY * rows);
    let c = Math.round(posX * cols - str.length / 2);

    str.split('').forEach((char, i) => {
      const cel = this.gridText[cols * r + c++];
      if (char === ' ') return null;
      queue.push(Object.assign(
        cel,
        {
          active: true,
          text: char,
          color: color,
          static: true,
          delay: delay + Math.floor((i / str.length) * 50 + 200 * Math.random()),
        },
        activeCl ? { activeCl } : {}
      ));
    });

    return queue;
  };


  async addGridTextDynamic(cl) {
    const { onHover: { color, data }, layout } = this.content[cl];
    const { posX, posY, offsetX, offsetY, deltaX, deltaY } = layout;
    const { cols, rows } = this.state.params;

    const queue = [];
    const total = data.map(d => d.str.split('')).flat().length;
    const baseR = Math.round((posY * rows) + offsetY);
    const baseC = Math.round((posX * cols) + offsetX);

    data.forEach((d, i) => {
      const r = baseR + (deltaY * i);
      let c = Math.round(baseC + (deltaX * i) + (2 * Math.random() - 1));

      d.str.split('').forEach(char => {
        const cel = this.gridText[cols * r + c++];
        if (char === ' ') return null;
        queue.push(Object.assign(
          cel,
          {
            active: true,
            text: char,
            color: color,
            cl: cl,
            delay: Math.floor(((queue.length / total) + Math.random()) * 250),
            static: true,
          },
          d.action ? { action: d.action } : {},
        ));
      });
    });

    return queue;
  };


  async removeGridTextDynamic(cl) {
    const cels = this.gridText.filter(a => a.cl === cl);
    return Promise.all(
      cels.map((d, i, a) => {
        d.text = randomLetter();
        d.active = true
        // d.delay = Math.floor(((a.length - i) / a.length) * 500 * Math.random());
        // d.delay = Math.floor(((a.length - i) / a.length) * 250 + 250 * Math.random());
        d.delay = Math.floor((((a.length - i) / a.length) + Math.random()) * 250);
        // delete d.cl;
        // delete d.color;
        // delete d.static;
        ['cl', 'color', 'static', 'action'].forEach(key => delete d[key]);
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
      .catch(err => console.log('drawStackInitial() caught', err))

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
      .catch(err => console.log('drawStackIsLoaded() caught', err))
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

    return (
      d3.select(this.grid.current)
        .selectAll('div').data(this.gridText, d => d.id)
        .enter().append('div')
        // .interrupt()
          .attr('id', d => d.id)
          .attr('class', d => 'cel' + (d.cl ? ' ' + d.cl : ''))
          .text(d => d.text)
          .style('left', d => d.c * celWidth + 'px')
          .style('top', d => d.r * celHeight + 'px')
          // .style('width', celWidth + 'px')
          // .style('height', celHeight + 'px')
          .style('color', d => d.color ? d.color : null)
          .style('opacity', 0)
        .transition()
          .delay(d => calcDelay(d))
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
        // .each(d => d.active = true)
          // .interrupt()
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




  async undrawGridFull() {

      const test = d3.select(this.grid.current)
        .selectAll('div').data(this.gridText, d => d.id)
        .interrupt()


        console.log(test)


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







  drawGridLetterSwap(cel) {
    cel.text = randomLetter();

    d3.select(this.grid.current)
      .select(`#${cel.id}`).datum(cel, d => d.id)
        .attr('class', 'cel')
      .transition()
        .style('opacity', 0)
      .transition()
        .delay(100)
        .text(cel.text)
        .style('color', null)
        .style('opacity', 1)







    // d3.select(this.grid.current)
    //   .selectAll('div').data([cel], d => d.id)
    //   .each(d => cel.text = randomLetter())
    //     .transition()
    //       .style('opacity', 0)
    //     .transition()
    //       .text(d => d.text)
    //       .style('color', null)
    //       .style('opacity', 1);

    // cel.text = randomLetter();
    // d3.select(this.grid.current).select(`#${cel.id}`)
    //     .attr('class', 'cel')
    //   .transition()
    //     .style('opacity', 0)
    //   .transition()
    //     .delay(100)
    //     .text(cel.text)
    //     .style('color', null)
    //     .style('opacity', 1)
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
    if (cel.active) return null;
    const cl = cel.activeCl;

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
          .catch(err => console.log('helpToggleDynamicText(cl) caught', err))
          .then(() => this.setState({ [cl]: Date.now() }))
      });
    } else if (now - active > 500) {
      this.removeGridTextDynamic(cl)
        .then(queue => this.drawGridCustom(queue))
        .catch(err => {
          console.log('helpToggleDynamicText(cl) caught', err);
          this.drawGridLetterSwap(err)
        })
        .then(() => this.setState({ [cl]: false }))
    };
  };




  helpClick(cel) {
    // if (this.state.isMobile) {
    //   this.helpCombinedHover(cel);
    // };
    console.log('click', cel)
  };

  toggleClickAction(cl, click, isMobile) {
    switch (cl) {
      case 'projects' :
        if (isMobile) {
          window.open(click, '_blank');
        } else {
          this.showIframe(click);
        };
        break;
      case 'links' :
        window.open(click, '_blank');
        break;
      case 'contact' :
        if (isMobile) {
          window.location = click;
        };
        break;
      case 'info' :
        window.open(click, '_blank');
        break;
      default : return null;
    };
  };






////////////////////////////////////////////////////////////////////////////////
// ** Event Handlers ** //
////////////////////////////////////////////////////////////////////////////////

  handleResize() {
    clearTimeout(this.resizeTimeout);

    if (!this.state.isResizing) {
      this.setState({ isResizing: true }, () => {
        this.undrawGridFull()
          // .catch(not => console.log('undraw incomplete', not))
          .catch(notDone => d3.select(this.grid.current).selectAll('div').remove())
          .then(done => {
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
    const cel = el ? this.gridText[el.id.substring(3)] : null;

    if (cel) {
      this.helpCombinedHover(cel);
    };
  };


  handleClick({ target: { id } }) {
    if (!id.includes('cel')) return null;

    const cel = this.gridText[parseInt(id.slice(3))];

    this.helpClick(cel);
  };


  test(e) {
    // console.log(e)
  }



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
          onMouseMove={this.handleMouseMove}
          onClick={this.handleClick}
        >
          <div id="Grid" ref={this.grid} style={gridStyle} />
        </div>
      </div>
    );
  };
};
