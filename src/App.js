import React, { PureComponent } from 'react';
import { d3 } from './_d3.js'
import './App.css';
import { setContent, iframes } from './_data.js';





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
    this.proto = {
      alpha: ('qwertyuiopasdfghjklzxcvbnm').split(''),
      randomLetter: () => this.proto.alpha[Math.floor(Math.random() * 26)],
      randomDelay: () => Math.floor(Math.random() * 250),
      iframes: iframes,
      celRatio: 2 / 3,
      maxCelHeight: 18,
      minGrid: {
        desktop: [56, 32],
        mobileH: [50, 23],
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
    this.handleIframeLoad = this.handleIframeLoad.bind(this);
  };





  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    if (this.props.isMobile) {
      window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    };
    this.config(this.grid.current)
      .then(() => this.draw())
      .catch(err => console.error('componentDidMount()', err));
  };





////////////////////////////////////////////////////////////////////////////////
// ** Layout Configuration ** //
////////////////////////////////////////////////////////////////////////////////


  // async config() {
  //   const params = await this.configContentLayout(this.grid.current);
  //   const content = setContent(params.layout);
  //   await this.configCelSize(params);
  //   await this.configGridSize(params);
  //   this.params = params;
  //   this.content = await this.configGridLayout(params, content);
  //   this.setState({ hasConfig: true });
  // };


  // async configContentLayout({ clientWidth, clientHeight }) {
  //   return {
  //     gridWidth: clientWidth,
  //     gridHeight: clientHeight,
  //     layout: !this.props.isMobile
  //       ? 'desktop'
  //       : clientWidth > clientHeight
  //         ? 'mobileH'
  //         : 'mobileV',
  //   };
  // };


  // async configCelSize(params) {
  //   const { gridWidth, gridHeight, layout } = params;
  //   const { celRatio, maxCelHeight, minGrid } = this.proto;
  //   const [minCols, minRows] = minGrid[layout];

  //   const w = gridWidth / minCols;
  //   const h = gridHeight / minRows;
  //   let celWidth = h * celRatio;
  //   let celHeight = w / celRatio;

  //   if (gridHeight / celHeight < minRows) {
  //     celHeight = h;
  //   } else {
  //     celWidth = w;
  //   };

  //   if (celHeight > maxCelHeight) {
  //     celHeight = maxCelHeight;
  //     celWidth = maxCelHeight * celRatio;
  //   };

  //   return Object.assign(params, { celWidth, celHeight });
  // };


  // async configGridSize(params) {
  //   const { gridWidth, gridHeight, celWidth, celHeight } = params;
  //   const cols = Math.floor(gridWidth / celWidth);
  //   const rows = Math.floor(gridHeight / celHeight);
  //   const marginX = (gridWidth - cols * celWidth) / 2;
  //   const marginY = (gridHeight - rows * celHeight) / 2;

  //   return Object.assign(params, { cols, rows, marginX, marginY });
  // };


  // async configGridLayout(params, content) {
  //   const { cols, rows } = params;
  //   Object.keys(content).forEach(key => {
  //     const { str, onHover, layout } = content[key];
  //     const { posX, posY, offsetX, offsetY, deltaX, deltaY } = layout;

  //     const baseR = Math.round(posY * rows);
  //     const baseC = Math.round(posX * cols - str.length / 2);
  //     content[key].startIndex = cols * baseR + baseC;

  //     if (!onHover) return null;

  //     onHover.total = onHover.data
  //       .map(d => d.str.split('')).flat().length;
  //     onHover.data.forEach((d, i) => {
  //       const r = baseR + (deltaY * i) + offsetY;
  //       const c =
  //         Math.round(baseC + (deltaX * i) - d.str.length / 2) + offsetX;
  //       d.startIndex = cols * r + c;
  //     });
  //   });

  //   return content;
  // };


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

    this.content = setContent(this.params.layout);

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

    this.params.celHeight = Math.round(this.params.celHeight);
    this.params.celWidth = Math.round(this.params.celWidth);
    return;
  };


  async configGridSize({ gridWidth, gridHeight, celWidth, celHeight }) {
    this.params.cols = Math.floor(gridWidth / celWidth);
    this.params.rows = Math.floor(gridHeight / celHeight);
    // this.params.marginX = (gridWidth - this.params.cols * celWidth) / 2;
    // this.params.marginY = (gridHeight - this.params.rows * celHeight) / 2;
    this.params.marginX = Math.round((gridWidth - this.params.cols * celWidth) / 2);
    this.params.marginY = Math.round((gridHeight - this.params.rows * celHeight) / 2);

    return;
  };


  async configGridLayout({ cols, rows }) {
    Object.keys(this.content).forEach(key => {
      const { str, onHover, layout } = this.content[key];
      const { posX, posY, offsetX, offsetY, deltaX, deltaY } = layout;

      const baseR = Math.round(posY * rows);
      const baseC = Math.round(posX * cols - str.length / 2);
      this.content[key].startIndex = cols * baseR + baseC;

      if (!onHover) return null;

      onHover.total = onHover.data
        .map(d => d.str.split('')).flat().length;
      onHover.data.forEach((d, i) => {
        const r = baseR + (deltaY * i) + offsetY;
        const c =
          Math.round(baseC + (deltaX * i) - d.str.length / 2) + offsetX;
        d.startIndex = cols * r + c;
      });
    });

    return;
  };





////////////////////////////////////////////////////////////////////////////////
// ** Grid Text ** //
////////////////////////////////////////////////////////////////////////////////


  async addTextInitial() {
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


  async addTextStatic({ str, color, delay, activeCl, startIndex }) {
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
        cel.delay =
          delay + Math.floor((i / str.length) * 50 + 200 * Math.random());
      };
      if (activeCl) {
        cel.activeCl = activeCl;
      };
      if (cel.hidden) {
        delete cel.hidden;
      };

      queue.push(cel);
    });

    return queue;
  };


  async addTextDynamic({ activeCl, onHover: { color, data, total } }) {
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
        cel.cl = activeCl;
        cel.text = char;
        cel.color = color;
        cel.static = true;
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


  async removeTextDynamic(cl) {
    const cels = this.gridText.filter(a => a.cl === cl);
    return Promise.all(
      cels.map((d, i, a) => {
        d.text = this.proto.randomLetter();
        d.active = true;
        d.delay =
          Math.floor((((a.length - i) / a.length) + Math.random()) * 250);
        ['cl', 'activeCl', 'color', 'static', 'action'].forEach(key => delete d[key]);
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
      .catch(err => console.error('draw()', err));
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
      .catch(err => console.error('drawStackInitial()', err));
  };


  async drawStackHasDrawn() {
    return Promise.all(
      Object.values(this.content)
        .map(d => this.addTextStatic(d))
    )
      .then(() => Promise.all(
        Object.keys(this.state.active).map(cl => {
          if (!this.state.active[cl]) return null;
          return this.addTextDynamic(this.content[cl]);
        })
      ))
      .then(() => this.drawGridFull())
      .catch(err => console.error('drawStackHasDrawn()', err));
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
          .style('color', d => d.color ? d.color : null)
          // .style('line-height', celHeight * .85 + 'px')
          // .style('letter-spacing', celWidth + 'px')
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
            .delay(d => d.delay || this.proto.randomDelay())
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
        .style('opacity', 1);
  };


  async undrawGridFull() {
    return (
      d3.select(this.grid.current)
        .selectAll('div').data(this.gridText, d => d.id)
          .interrupt()
          .transition()
            .duration(100)
            .delay(() => this.proto.randomDelay())
            .style('opacity', 0)
            .remove()
          .end()
    );
  };


  eraseGrid() {
    d3.select(this.grid.current)
      .selectAll('div')
        .remove();
  };





////////////////////////////////////////////////////////////////////////////////
// ** Iframe Methods ** //
////////////////////////////////////////////////////////////////////////////////


  async iframeGetSize(ratio) {
    const { cols, rows } = this.params;
    const { celRatio } = this.proto;

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


  async iframeGetHiddenCels({ startCol, endCol, startRow, endRow }) {
    return Promise.all(this.gridText
      .filter(a =>
        a.c >= startCol && a.c < endCol
        &&
        a.r >= startRow && a.r < endRow
      )
      .map(d => {
        d.active = true;
        d.delay = this.proto.randomDelay() * 3;
        d.hidden = true;
        return d;
      })
    );
  };


  async iframeGetMaskedCels() {
    return Promise.all(this.gridText
      .filter(a => a.static && !a.hidden)
      .map((d, i, a) => {
        d.snapshot = Object.assign({}, d);
        d.masked = true;
        d.active = true;
        d.text = this.proto.randomLetter();
        d.delay = this.proto.randomDelay();
        ['cl', 'color', 'static', 'action'].forEach(key => delete d[key]);
        return d;
      })
    );
  };


  async iframeSetStyle(corners) {
    const c1 = d3.select('#' + corners[0].id).node();
    const c2 = d3.select('#' + corners[1].id).node();

    return {
      left: c1.offsetLeft + this.params.marginX + 'px',
      top: c1.offsetTop + this.params.marginY + 'px',
      width: c2.offsetWidth + c2.offsetLeft - c1.offsetLeft + 'px',
      height: c2.offsetHeight + c2.offsetTop - c1.offsetTop + 'px',
    };
  };


  async iframeAddText() {
    // const { date, git, name, tech, url } = this.proto.iframes[this.state.iframe];

  };


  async helpIframe(value) {
    console.time('help iframe')
    const { ratio } = this.proto.iframes[value];
    const dimen = await this.iframeGetSize(ratio);
    const hidden = await this.iframeGetHiddenCels(dimen);
    const corners = [hidden[0], hidden[hidden.length - 1]];
    this.params.iframeStyle = await this.iframeSetStyle(corners);
    const masked = await this.iframeGetMaskedCels();
    this.queue = [...hidden, ...masked];
    console.timeEnd('help iframe')
    this.setState({ iframe: value });
  };


  async showIframe() {
    await this.drawGridCustom(this.queue);
  };


  async clearIframe() {
    this.setState({ iframeLoaded: false }, async () => {
      // const queue = await Promise.all(this.queue.map(d => {
      //   d.active = true;
      //   d.delay = this.proto.randomDelay() * 3;
      //   if (d.hidden) {
      //     delete d.hidden;
      //   } else if (d.masked) {
      //     Object.assign(d, d.snapshot);
      //     delete d.snapshot;
      //     delete d.masked;
      //   };
      //   return d;
      // }));
      this.queue.forEach(d => {
        d.active = true;
        d.delay = this.proto.randomDelay() * 3;
        if (d.hidden) {
          delete d.hidden;
        } else if (d.masked) {
          Object.assign(d, d.snapshot);
          delete d.snapshot;
          delete d.masked;
        };

      })
      await this.drawGridCustom(this.queue);
      this.setState({ iframe: false });
    });
  };


////////////////////////////////////////////////////////////////////////////////
// ** Handler Helpers ** //
////////////////////////////////////////////////////////////////////////////////


  helpRedraw() {
    return setTimeout(() => {
      const { iframe } = this.state;
      this.setState(
        { isResizing: false, iframe: false, iframeLoaded: false },
        async () => {
          await this.config(this.grid.current);
          await this.draw();
          if (iframe) {
            await this.helpIframe(iframe);
          };
        }
      );
    }, 500);



    // return setTimeout(() => {
    //   this.setState({ isResizing: false, iframeLoaded: false }, () => {
    //     this.config(this.grid.current)
    //       .then(() => this.draw())
    //       .then(async () => {
    //         if (!this.state.iframe) return null;
    //         this.setState({ iframeLoaded: true }, async () => {
    //           await this.helpIframe(this.state.iframe);
    //           return await this.showIframe();
    //         })
    //       })
    //   });
    // }, 500);
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
        () => this.addTextDynamic(this.content[cl])
          .then(queue => this.drawGridCustom(queue))
          .catch(err => console.log('helpToggleDynamicText() caught', err))
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
    const cel = this.gridText[parseInt(id.slice(3))];

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

    const cel = this.gridText[parseInt(id.slice(3))];

    this.helpClick(cel);
  };


  handleIframeLoad(e) {
    if (!this.state.iframe) return null;
    this.setState({ iframeLoaded: true }, () => {
      this.showIframe();
    });
  };





////////////////////////////////////////////////////////////////////////////////
// ** Getters ** //
////////////////////////////////////////////////////////////////////////////////


  get gridStyle() {
    if (!this.state.hasConfig) return null;
    return {
      // fontSize: this.params.celHeight.toFixed(2) + 'px',
      // lineHeight: (this.params.celHeight * .9).toFixed(2) + 'px',
      fontSize: this.params.celHeight + 'px',
      lineHeight: (this.params.celHeight * .9).toFixed(2) + 'px',
      marginLeft: this.params.marginX + 'px',
      marginTop: this.props.isMobile
        ? null
        : this.params.marginY + 'px',
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
    const style = {...this.params.iframeStyle};
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
      transform: `scale(${this.proto.iframes[this.state.iframe].scale})`,
    };
  };


  get iframeUrl() {
    if (!this.state.iframe) return null;
    return this.proto.iframes[this.state.iframe].url;
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
          style={this.mainStyle}
          onMouseMove={this.handleMouseMove}
          onClick={this.handleClick}
        >
          <div id="Grid" ref={this.grid} style={this.gridStyle} />
          <div id="IframeBox" style={this.iframeBoxStyle}>
            <iframe
              src={this.iframeUrl}
              style={this.iframeStyle}
              onLoad={this.handleIframeLoad}
              allow="camera;microphone"
              title="project"
              scrolling="no"
            />
          </div>
        </div>
      </div>
    );
  };
};
