import d3 from './d3';
import { getContent } from '../global';





export default class Grid {
  constructor(gridRef, isMobile) {
    this._isMobile = isMobile;
    this._gridRef = gridRef;
    this._gridNode = d3.select(this._gridRef);
    this._initial = true;
    this._alpha = ('qwertyuiopasdfghjklzxcvbnm').split('');

    this._celRatio = 2 / 3;
    this._maxCelHeight = 18;
    this._minGrid = {
      desktop: [56, 32],
      mobileH: [50, 23],
      mobileV: [31, 30],
    };

    this.displayLayout = 'desktop';
    this.celWidth = 0;
    this.celHeight = 0;
    this.cols = 0;
    this.rows = 0;
    this.marginX = 0;
    this.marginY = 0;
    this.content = {};
    this.gridText = [];

    this.init();
  };



/*
    Getters
*/

  get randomLetter() {
    return this._alpha[Math.floor(Math.random() * 26)];
  };

  get randomDelay() {
    return Math.floor(Math.random() * 250);
  };

  get gridStyle() {
    return {
      fontSize: this.celHeight + 'px',
      lineHeight: (this.celHeight * .9).toFixed(2) + 'px',
      marginLeft: this.marginX + 'px',
      marginTop: this.marginY + 'px',
    };
  };








/*
    Initialization stack
*/

  init() {
    this.gridText = [];
    this.initGrid();
    this.initContent();
    this.initText();
    this.draw();
  };

  reInit() {

  }


  initGrid() {
    Object.keys(this.gridStyle).forEach(key => this._gridRef.style[key] = '');
    const { clientWidth, clientHeight } = this._gridRef;
    this.displayLayout = !this._isMobile
      ? 'desktop'
      : clientWidth > clientHeight
        ? 'mobileH'
        : 'mobileV';

    if (this.displayLayout !== 'desktop') {
      window.scrollTo(0, -5);
    };
    // alert(this.displayLayout)

    const [minCols, minRows] = this._minGrid[this.displayLayout];
    const w = clientWidth / minCols;
    const h = clientHeight / minRows;
    let celWidth = h * this._celRatio;
    let celHeight = w / this._celRatio;

    if (clientHeight / celHeight < minRows) {
      celHeight = h;
    } else {
      celWidth = w;
    };

    if (celHeight > this._maxCelHeight) {
      celHeight = this._maxCelHeight;
      celWidth = this._maxCelHeight * this._celRatio;
    };

    this.celWidth = Math.round(celWidth);
    this.celHeight = Math.round(celHeight);
    this.cols = Math.floor(clientWidth / this.celWidth);
    this.rows = Math.floor(clientHeight / this.celHeight);
    this.marginX = Math.round((clientWidth - this.cols * this.celWidth) / 2);
    this.marginY = Math.round((clientHeight - this.rows * this.celHeight) / 2);

    Object.entries(this.gridStyle).forEach(([key, val]) => this._gridRef.style[key] = val);
    // this._gridRef.style.fontSize = this.celHeight + 'px';
    // this._gridRef.style.lineHeight = (this.celHeight * .9).toFixed(2) + 'px';
    // this._gridRef.style.marginLeft = this.marginX + 'px';
    // this._gridRef.style.marginTop = this.marginY + 'px';
    // console.log(this.gridStyle.toString())
  };


  initContent() {
    const rawContent = getContent(this.displayLayout);

    for (let key in rawContent) {
      const { layout, onHover, str } = rawContent[key];
      const baseR = Math.round(layout.posY * this.rows);
      const baseC = Math.round(layout.posX * this.cols - str.length / 2);
      rawContent[key].startIndex = this.cols * baseR + baseC;

      if (!onHover) continue;

      onHover.total = onHover.data
        .map(d => d.str.split('')).flat().length;
      onHover.data.forEach((d, i) => {
        const r = baseR + (layout.deltaY * i) + layout.offsetY;
        const c =
          Math.round(baseC + (layout.deltaX * i) - d.str.length / 2) + layout.offsetX;
        d.startIndex = this.cols * r + c;
      });
    };

    this.content = rawContent;
  };


  initText() {
    const dScale = this._isMobile ? 60 : 100;
    const tScalar = 250 / (this.rows * this.cols);

    const calcDelay = (r, c) => {
      return Math.floor(
        dScale * (
          tScalar * ((2 * r) + c)
          + Math.random()
        )
      );
    };

    const gridText = [];

    let id = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        gridText.push({
          c,
          r,
          id: `cel${id++}`,
          text: this.randomLetter,
          delay: this._initial
            ? calcDelay(r, c)
            : Math.floor(500 * Math.random()),
          active: true,
        });
      };
    };

   this.gridText = gridText;
  };



/*
    Text stack
*/

  addTextStatic({ str, color, delay, activeCl, startIndex }) {
    const queue = [];

    str.split('').forEach((char, i) => {
      if (char === ' ') return null;

      const cel = this.gridText[startIndex + i];
      cel.active = true;
      cel.static = true;
      cel.text = char;
      cel.color = color;
      if (this._initial) {
        cel.delay =
          delay + Math.floor((i / str.length) * 50 + 200 * Math.random());
      };
      if (activeCl) {
        cel.activeCl = activeCl;
      };

      queue.push(cel);
    });

    return queue;
  };


  addTextStaticAll() {
    return Object.values(this.content)
      .map(d => this.addTextStatic(d));
  };


  addTextDynamic({ activeCl, onHover: { color, data, total } }) {
    const queue = [];

    data.forEach((d, i) => {
      const startIndex = d.startIndex + (
        this._isMobile
          ? Math.round(1 * (Math.random() - .5))
          : Math.round(3 * (Math.random() - .5))
      );

      d.str.split('').forEach((char, j) => {
        if (char === ' ') return null;

        const cel = this.gridText[startIndex + j];
        cel.active = true;
        cel.static = true;
        cel.cl = activeCl;
        cel.text = char;
        cel.color = color;
        cel.delay = Math.floor(((queue.length / total) + Math.random()) * 250);
        if (d.action) {
          cel.action = d.action;
        };

        queue.push(cel);
      });
    });

    return queue;
  };




/*
    Draw stack
*/


  async draw() {
    if (this._initial) {
      return this.drawStackInitial();
    };
    this.drawStack();

    // console.log('drawn', drawn)
  }


  async drawStackInitial() {
    await this.drawGridFull();
    const staticText = this.addTextStaticAll();
    await Promise.all(staticText.map(d => this.drawGridCustom(d)));
    this._initial = false;
  };


  async drawStack() {
    const staticText = this.addTextStaticAll();
    await this.drawGridFull();
  };


  async undraw() {
    try {
      await this.undrawGridFull();
    } catch (err) {
      this.eraseGrid();
    };
  };




  drawGridFull() {
    return this._gridNode
      .selectAll('div')
        .data(this.gridText, d => d.id)
      .enter()
        .append('div')
      .interrupt()
        .attr('id', d => d.id)
        .attr('class', d => 'cel' + (d.cl ? ' ' + d.cl : ''))
        .text(d => d.text)
        .style('left', d => d.c * this.celWidth + 'px')
        .style('top', d => d.r * this.celHeight + 'px')
        .style('width', this.celWidth + 'px')
        .style('height', this.celHeight + 'px')
        .style('color', d => d.color ? d.color : null)
        .style('opacity', 0)
      .transition()
        .delay(d => d.delay)
        .style('opacity', 1)
        .on('end', d => {
          d.active = false;
          delete d.delay;
        })
      .end();
  };


  drawGridCustom(cels) {
    return this._gridNode
      .selectAll('div')
        .data(cels, d => d.id)
      .interrupt()
        .attr('class', d => 'cel' + (d.cl ? ' ' + d.cl : ''))
      .transition()
        .duration(100)
        .delay(d => d.delay || this.randomDelay)
        .style('opacity', 0)
      .transition()
        .duration(100)
        .text(d => d.text)
        .style('color', d => d.color || null)
        .style('opacity', d => d.hidden ? 0 : 1)
        .on('end', d => {
          d.active = false;
          delete d.delay;
        })
      .end();
    };


  drawGridLetterSwap(cel) {
    cel.text = this.randomLetter;
    return this._gridNode
      .select(`#${cel.id}`)
        .datum(cel, d => d.id)
      .interrupt()
        .attr('class', 'cel')
      .transition()
        .style('opacity', 0)
      .transition()
        .delay(100)
        .text(cel.text)
        .style('color', null)
        .style('opacity', 1);
  };


  undrawGridFull() {
    return this._gridNode
      .selectAll('div')
        .data(this.gridText, d => d.id)
      .interrupt()
      .transition()
        .duration(100)
        .delay(() => this.randomDelay)
        .style('opacity', 0)
        .remove()
      .end();
  };


  eraseGrid() {
    this._gridNode
      .selectAll('div')
        .remove();
  };







}
