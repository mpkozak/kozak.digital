import React, { PureComponent } from 'react';
import './App.css';
import { getContent, gridRules, iframes } from './global';
import d3 from './libs/d3';





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
      iframe: false,
      iframeLoaded: false,
    };

    this._alpha = ('qwertyuiopasdfghjklzxcvbnm').split('');

    this._gridRef = React.createRef();
    this._gridNode = undefined;

    this.params = {};
    this.content = {};
    this.gridText = [];

    this.iframeBoxLayout = {};
    this.iframeQueue = [];

    this.resizeTimeout = undefined;
    this.lastMouseEvent = 0;

    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleIframeLoad = this.handleIframeLoad.bind(this);
  };





////////////////////////////////////////////////////////////////////////////////
// ** Getters ** //
////////////////////////////////////////////////////////////////////////////////

  get gridStyle() {
    if (!this.state.hasConfig) return null;
    return {
      fontSize: this.params.celHeight + 'px',
      lineHeight: (this.params.celHeight * .9).toFixed(2) + 'px',
      marginLeft: this.params.marginX + 'px',
      marginTop: this.params.marginY + 'px',
      cursor: this.state.iframeLoaded ? 'zoom-out' : 'default',
    };
  };

  get mainStyle() {
    if (!this.props.isMobile) return null;
    return {
      width: '100%',
      height: '100%',
      userSelect: 'none !important',
    };
  };

  get iframeBoxStyle() {
    const { iframe, iframeLoaded, isResizing } = this.state;
    if (!iframe) return null;
    const style = {...this.iframeBoxLayout};
    if (isResizing) {
      return style;
    };
    if (iframeLoaded) {
      return Object.assign(style, {
        transform: 'scale(.99)',
        opacity: 1,
        pointerEvents: 'auto',
        zIndex: 300,
      });
    };
    return style;
  };

  get iframeStyle() {
    if (!this.state.iframe) return null;
    return {
      transform: `scale(${iframes[this.state.iframe].scale})`,
    };
  };

  get iframeUrl() {
    if (!this.state.iframe) return null;
    return iframes[this.state.iframe].url;
  };

  get randomLetter() {
    return this._alpha[Math.floor(Math.random() * 26)];
  };

  get randomDelay() {
    return Math.floor(Math.random() * 250);
  };






////////////////////////////////////////////////////////////////////////////////
// ** Lifecycle Methods ** //
////////////////////////////////////////////////////////////////////////////////

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    if (this.props.isMobile) {
      window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    };
    this._gridNode = d3.select(this._gridRef.current);
    this.config();
    this.draw();
  };





////////////////////////////////////////////////////////////////////////////////
// ** Layout Configuration ** //
////////////////////////////////////////////////////////////////////////////////

  config() {
    const { displayLayout, ...params } = this.configParams(this._gridRef.current);
    this.params = params;
    if (displayLayout === 'mobileV') {
      window.scrollTo(0, -5);
    };
    this.content = this.configContent(displayLayout);
    this.setState({ hasConfig: true });
  };


  configParams(gridRef) {
    const { clientWidth, clientHeight } = gridRef;
    const displayLayout = !this.props.isMobile
      ? 'desktop'
      : clientWidth > clientHeight
        ? 'mobileH'
        : 'mobileV';

    const { celRatio, maxCelHeight, minGrid } = gridRules;
    const [minCols, minRows] = minGrid[displayLayout];

    const w = clientWidth / minCols;
    const h = clientHeight / minRows;
    let celWidth = h * celRatio;
    let celHeight = w / celRatio;

    if (clientHeight / celHeight < minRows) {
      celHeight = h;
    } else {
      celWidth = w;
    };

    if (celHeight > maxCelHeight) {
      celHeight = maxCelHeight;
      celWidth = maxCelHeight * celRatio;
    };

    celHeight = Math.round(celHeight);
    celWidth = Math.round(celWidth);
    // document.documentElement.style.setProperty('--cel-width', celWidth + 'px');
    // document.documentElement.style.setProperty('--cel-height', celHeight + 'px');

    const cols = Math.floor(clientWidth / celWidth);
    const rows = Math.floor(clientHeight / celHeight);
    const marginX = Math.round((clientWidth - cols * celWidth) / 2);
    const marginY = Math.round((clientHeight - rows * celHeight) / 2);

    return {
      displayLayout,
      celWidth,
      celHeight,
      cols,
      rows,
      marginX,
      marginY,
    };
  };


  configContent(displayLayout) {
    const { rows, cols } = this.params;
    const content = getContent(displayLayout);

    for (let key in content) {
      const { layout, onHover, str } = content[key];
      const baseR = Math.round(layout.posY * rows);
      const baseC = Math.round(layout.posX * cols - str.length / 2);
      content[key].startIndex = cols * baseR + baseC;

      if (!onHover) continue;

      onHover.total = onHover.data
        .map(d => d.str.split('')).flat().length;
      onHover.data.forEach((d, i) => {
        const r = baseR + (layout.deltaY * i) + layout.offsetY;
        const c =
          Math.round(baseC + (layout.deltaX * i) - d.str.length / 2) + layout.offsetX;
        d.startIndex = cols * r + c;
      });
    };

    return content;
  };





////////////////////////////////////////////////////////////////////////////////
// ** Grid Text ** //
////////////////////////////////////////////////////////////////////////////////

  addTextInitial() {
    const { cols, rows } = this.params;
    const dScale = this.props.isMobile ? 60 : 100;
    const tScalar = 250 / (rows * cols);

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
          text: this.randomLetter,
          delay: this.state.hasDrawn
            ? Math.floor(500 * Math.random())
            : calcDelay(r, c),
          active: true,
        });
      };
    };

    return;
  };


  addTextStatic({ str, color, delay, activeCl, startIndex }) {
    const { hasDrawn } = this.state;

    const queue = [];

    str.split('').forEach((char, i) => {
      if (char === ' ') return null;

      const cel = this.gridText[startIndex + i];
      cel.active = true;
      cel.static = true;
      cel.text = char;
      cel.color = color;
      if (!hasDrawn) {
        cel.delay = delay + Math.floor((i / str.length) * 50 + 200 * Math.random());
      };
      if (activeCl) {
        cel.cl = 'menu';
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
        this.props.isMobile
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
        cel.delay =
          Math.floor(((queue.length / total) + Math.random()) * 250);
        if (d.action) {
          cel.action = d.action;
        };

        queue.push(cel);
      });
    });

    return queue;
  };


  addTextDynamicAll() {
    return Object.keys(this.state.active)
      .map(cl => {
        if (!this.state.active[cl]) return null;
        return this.addTextDynamic(this.content[cl]);
      });
  };


  removeTextDynamic(cl) {
    const cels = this.gridText.filter(a => a.cl === cl);
    return cels.map((d, i, a) => {
      d.text = this.randomLetter;
      d.active = true;
      d.delay =
        Math.floor((((a.length - i) / a.length) + Math.random()) * 250);
      ['cl', 'activeCl', 'color', 'static', 'action'].forEach(key => delete d[key]);
      return d;
    });
  };






////////////////////////////////////////////////////////////////////////////////
// ** Draw Functions ** //
////////////////////////////////////////////////////////////////////////////////

  async draw() {
    this.addTextInitial();
    try {
      if (this.state.hasDrawn) {
        await this.drawStackHasDrawn();
        return;
      };
      await this.drawStackInitial();
      return;
    } catch (err) {
      // console.error('draw()', err);
      return null;
    };
  };


  async drawStackInitial() {
    try {
      await this.drawGridFull();
      const staticText = this.addTextStaticAll();
      await Promise.all(staticText.map(d => this.drawGridCustom(d)));
      this.setState({ hasDrawn: true });
    } catch (err) {
      // console.error('drawStackInitial()', err);
      return null;
    };
  };


  async drawStackHasDrawn() {
    try {
      this.addTextStaticAll();
      this.addTextDynamicAll();
      await this.drawGridFull();
    } catch (err) {
      // console.error('drawStackHasDrawn()', err);
      return null;
    };
  };





////////////////////////////////////////////////////////////////////////////////
// ** D3 Methods ** //
////////////////////////////////////////////////////////////////////////////////

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
        .style('left', d => d.c * this.params.celWidth + 'px')
        .style('top', d => d.r * this.params.celHeight + 'px')
        .style('width', this.params.celWidth + 'px')
        .style('height', this.params.celHeight + 'px')
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





////////////////////////////////////////////////////////////////////////////////
// ** Iframe Methods ** //
////////////////////////////////////////////////////////////////////////////////

  iframeGetSize(ratio) {
    const { cols, rows } = this.params;
    const { celRatio } = gridRules;

    const maxW = cols - 8;
    const maxH = rows - 8;

    let h = maxH;
    let w = (maxH / celRatio) * ratio;

    if (w > maxW) {
      w = maxW;
      h = (maxW * celRatio) / ratio;
    };

    const gridW = Math.round(w);
    const gridH = Math.round(h);

    const startCol = Math.round((cols - gridW) / 2);
    const endCol = startCol + gridW;
    const startRow = 3;
    const endRow = startRow + gridH;

    return { startCol, endCol, startRow, endRow };
  };


  iframeGetHiddenCels({ startCol, endCol, startRow, endRow }) {
    const len = (endCol - startCol) * (endRow - startRow);
    const cels = [];
    let i = 0

    while (cels.length < len) {
      const cel = this.gridText[i++];
      if (
        cel.c >= startCol && cel.c < endCol
        &&
        cel.r >= startRow && cel.r < endRow
      ) {
        cel.active = true;
        cel.hidden = true;
        cel.delay = this.randomDelay * 3;
        cels.push(cel);
      };
    };

    return cels;
  };


  iframeGetMaskedCels() {
    return this.gridText
      .filter(a => a.static && !a.hidden)
      .map((d, i, a) => {
        d.snapshot = Object.assign({}, d);
        d.masked = true;
        d.active = true;
        d.text = this.randomLetter;
        d.delay = this.randomDelay;
        ['cl', 'color', 'static', 'action'].forEach(key => delete d[key]);
        return d;
      });
  };


  iframeSetStyle(corners) {
    const c1 = d3.select('#' + corners[0].id).node();
    const c2 = d3.select('#' + corners[1].id).node();

    return {
      left: c1.offsetLeft + this.params.marginX + 'px',
      top: c1.offsetTop + this.params.marginY + 'px',
      width: c2.offsetWidth + c2.offsetLeft - c1.offsetLeft + 'px',
      height: c2.offsetHeight + c2.offsetTop - c1.offsetTop + 'px',
    };
  };



  iframeAddText(value, bottomRow) {
    const { rows, cols } = this.params;
    const availRows = rows - (bottomRow + 1);
    // const { date, git, name, tech, url } = iframes[value];
    const { url } = iframes[value];

    const centerRow = Math.round(availRows / 2) + bottomRow;
    const linkText = url.split('//')[1];
    const linkStartCol = Math.round((cols - linkText.length) / 2);
    const linkStartIndex = this.gridText.findIndex(a => a.r === centerRow && a.c === linkStartCol);

    const queue = [];

    linkText.split('').forEach((char, i) => {
      if (char === ' ') return null;

      const cel = this.gridText[linkStartIndex + i];
      cel.active = true;
      cel.static = true;
      cel.text = char;
      cel.color = '#FFAF24';
      cel.action = { url: url };
      cel.cl = 'iframe';

      queue.push(cel);
    });

    return queue;
  };



  helpIframe(value) {
    const { ratio } = iframes[value];
    const dimen = this.iframeGetSize(ratio);
    const masked = this.iframeGetMaskedCels();
    const hidden = this.iframeGetHiddenCels(dimen);
    const corners = [hidden[0], hidden[hidden.length - 1]];
    const text = this.iframeAddText(value, corners[1].r);
    this.iframeBoxLayout = this.iframeSetStyle(corners);
    this.iframeQueue = [...hidden, ...masked, ...text];
    this.setState({ iframe: value });
  };


  async showIframe() {
    await this.drawGridCustom(this.iframeQueue);
  };


  async clearIframe() {
    this.setState({ iframeLoaded: false }, async () => {
      this.removeTextDynamic('iframe');
      const queue = this.iframeQueue.map(d => {
        d.active = true;
        d.delay = this.randomDelay * 3;
        if (d.hidden) {
          delete d.hidden;
        } else if (d.masked) {
          Object.assign(d, d.snapshot);
          delete d.snapshot;
          delete d.masked;
        };
        return d;
      });

      await this.drawGridCustom(queue);
      this.setState({ iframe: false });
    });
  };





////////////////////////////////////////////////////////////////////////////////
// ** Handler Helpers ** //
////////////////////////////////////////////////////////////////////////////////

  getCelById(id) {
    if (!id) return null;
    return this.gridText[parseInt(id.slice(3), 10)];
  };


  helpRedraw() {
    return setTimeout(() => {
      this.setState(
        { isResizing: false, iframe: false, iframeLoaded: false },
        async () => {
          this.config();
          await this.draw();
        }
      );
    }, this.props.isMobile ? 0 : 500);
  };


  helpCombinedHover(cel) {
    if (cel.active || cel.hidden) return null;

    if (!cel.static || cel.masked) {
      return this.drawGridLetterSwap(cel);
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
        async () => {
          try {
            const queue = this.addTextDynamic(this.content[cl]);
            await this.drawGridCustom(queue);
            return;
          } catch (err) {
            // console.error('helpToggleDynamicText()', err);
            return null;
          };
        }
      );
    } else if (now - active > 500) {
      const queue = this.removeTextDynamic(cl)
      this.drawGridCustom(queue)
        .catch(err => this.drawGridLetterSwap(err))
        .then(() => this.setState(prevState =>
          ({ active: { ...prevState.active, [cl]: false } }),
          () => {
            if (cl === 'contact') {
              window.getSelection().removeAllRanges();
            };
          }
        ));
    };
  };


  helpClick(cel) {
    if (cel.action) {
      return this.helpClickAction(cel)
    };
    if (this.state.iframe) {
      return this.clearIframe();
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
    if (action === 'mail') {
      window.location.href = value;
    };
    if (action === 'iframe') {
      this.helpIframe(value);
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
    const cel = this.getCelById(id);

    this.helpCombinedHover(cel);
  };


  handleTouchMove(e) {
    e.preventDefault();
    const { clientX, clientY } = e.changedTouches[0];
    const el = document.elementFromPoint(clientX, clientY);
    const cel = this.getCelById(el.id);

    if (!cel) return null;

    this.helpCombinedHover(cel);
  };


  handleClick({ target: { id } }) {
    if (!id.includes('cel')) return null;

    const cel = this.getCelById(id);

    this.helpClick(cel);
  };


  handleIframeLoad(e) {
    if (!this.state.iframe) return null;
    this.setState({ iframeLoaded: true }, () => {
      this.showIframe();
    });
  };





////////////////////////////////////////////////////////////////////////////////
// ** Render ** //
////////////////////////////////////////////////////////////////////////////////

  render() {
    const { iframe } = this.state;

    return (
      <div id="App">
        <div
          id="Main"
          className={this.props.isMobile ? 'mobile' : null}
          style={this.mainStyle}
          onMouseMove={this.handleMouseMove}
          onClick={this.handleClick}
        >
          <div id="Grid" ref={this._gridRef} style={this.gridStyle} />
          <div id="IframeBox" style={this.iframeBoxStyle}>
            <iframe
              src={this.iframeUrl}
              style={this.iframeStyle}
              allow="camera;microphone"
              title="project"
              scrolling="no"
              onLoad={this.handleIframeLoad}
            />
          </div>
        </div>
      </div>
    );
  };
};
