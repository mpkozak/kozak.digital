import { content, layouts } from './_data.js';
import { d3 } from './_help.js'


export default class Grid {
  constructor(domRef, isMobile = false) {
    this.proto = {
      alpha: ('qwertyuiopasdfghjklzxcvbnm').split(''),
      content: content,
      layouts: layouts,
      celRatio: 2 / 3,
      maxCelHeight: 18,
      minGrid: {
        desktop: [56, 32],
        mobileH: [50, 21],
        mobileV: [31, 30],
      },
    };
    this.isMobile = isMobile;

    this.hasConfig = false;
    this.hasDrawn = false;

    // this.isLoaded = false;
    // this.grid = domRef;
    this.grid = domRef;
    this.content = {};
    this.params = undefined;
    this.gridText = [];
    this.active = {
      skills: false,
      projects: false,
      links: false,
      contact: false,
    }
  };



////////////////////////////////////////////////////////////////////////////////
// ** Getters ** //
////////////////////////////////////////////////////////////////////////////////

  get style() {
    if (!this.hasConfig) return null;
    return {
      fontSize: this.params.celHeight.toFixed(2) + 'px',
      marginLeft: this.params.marginX + 'px',
      marginTop: this.params.marginY + 'px',
    };
  };



////////////////////////////////////////////////////////////////////////////////
// ** Parent Stacks ** //
////////////////////////////////////////////////////////////////////////////////

  async config() {
    return this.configContentLayout(this.grid)
      .then(() => this.configCelSize(this.params))
      .then(() => this.configGridSize(this.params))
      .then(() => {
        this.hasConfig = true;
        return this.style;
      })
      .catch(err => console.error('config()', err))
  };

  async draw() {
    return this.addTextInitial()
      .then(() => {
        if (this.hasDrawn) {
          return this.drawStackHasDrawn();
        };
        return this.drawStackInitial();
      })
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
      .then(() => this.hasDrawn = true)
      .catch(err => console.error('drawStackInitial()', err))
  };


  async drawStackHasDrawn() {
    return Promise.all(
      Object.values(this.content)
        .map(d => this.addTextStatic(d))
    )
      .then(() => Promise.all(
        Object.keys(this.active).map(cl => {
          if (!this.active[cl]) return null;
          return this.addTextDynamic(cl);
        })
      ))
      .then(() => this.drawGridFull())
      .catch(err => console.error('drawStackHasDrawn()', err))
  }










////////////////////////////////////////////////////////////////////////////////
// ** Layout Configuration ** //
////////////////////////////////////////////////////////////////////////////////

  async configContentLayout({ clientWidth, clientHeight }) {
    this.params = {
      gridWidth: clientWidth,
      gridHeight: clientHeight,
      layout: !this.isMobile
        ? 'desktop'
        : clientWidth > clientHeight
          ? 'mobileH'
          : 'mobileV',
    };

    Object.keys(this.proto.content)
      .forEach(key => {
        this.content[key] = {
          ...content[key],
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

    // this.grid.style.fontSize = celHeight;
    // this.grid.style.marginLeft = (gridWidth - this.params.cols * celWidth) / 2;
    // this.grid.style.marginTop = (gridHeight - this.params.rows * celHeight) / 2;

    return;
  };



////////////////////////////////////////////////////////////////////////////////
// ** Grid Text ** //
////////////////////////////////////////////////////////////////////////////////

  async addTextInitial() {
    const { cols, rows } = this.params;
    const dScale = this.isMobile ? 60 : 100;
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
          text: this.randomLetter(),
          delay: this.hasDrawn
            ? Math.floor(500 * Math.random())
            : calcDelay(r, c),
          active: true,
        });
      };
    };

    return;
  };


  async addTextStatic(content) {
    const { str, color, delay, activeCl, layout: { posX, posY } } = content;
    const { hasDrawn, params: { cols, rows } } = this;

    const r = Math.round(posY * rows);
    const c = Math.round(posX * cols - str.length / 2);
    const startIndex = cols * r + c;
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
    const { params: { cols, rows } } = this;

    const total = data.map(d => d.str.split('')).flat().length;
    const baseR = Math.round((posY * rows) + offsetY);
    const baseC = Math.round((posX * cols) + offsetX);
    const queue = [];

    data.forEach((d, i) => {
      const r = baseR + (deltaY * i);
      const c = Math.round(baseC + (deltaX * i) + (2 * Math.random() - 1));
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
        d.text = this.randomLetter();
        d.active = true;
        d.delay = Math.floor((((a.length - i) / a.length) + Math.random()) * 250);
        ['cl', 'color', 'static', 'action'].forEach(key => delete d[key]);
        return d;
      })
    );
  };






////////////////////////////////////////////////////////////////////////////////
// ** D3 Draw Functions ** //
////////////////////////////////////////////////////////////////////////////////

  async drawGridFull() {
    const { celWidth, celHeight } = this.params;

    return (
      d3.select(this.grid)
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
      d3.select(this.grid)
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
    cel.text = this.randomLetter();
    d3.select(this.grid)
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
      d3.select(this.grid)
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
    d3.select(this.grid)
      .selectAll('div')
        .remove()
  };






////////////////////////////////////////////////////////////////////////////////
// ** Event Helpers ** //
////////////////////////////////////////////////////////////////////////////////

  helpCombinedHover(cel) {
    if (cel.active) return null;
    const cl = cel.activeCl;

    if (!cel.static) {
      this.drawGridLetterSwap(cel);
    } else if (cl) {
      this.helpToggleDynamicText(cl);
    };
  };







  randomLetter() {
    return this.proto.alpha[Math.floor(Math.random() * 26)];
  };


};
