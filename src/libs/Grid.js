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








/*
    Initialization stack
*/

  init() {
    this.initGrid();
    this.initContent();
    this.initText();
    this._initial = false;
    this.drawGridFull();
  };


  initGrid() {
    const { clientWidth, clientHeight } = this._gridRef;
    this.displayLayout = !this._isMobile
      ? 'desktop'
      : clientWidth > clientHeight
        ? 'mobileH'
        : 'mobileV';

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
    Draw stack
*/





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









}
