import React, { PureComponent } from 'react';
import './App.css';
import { d3 } from './_d3.js'
import { randomLetter, emptyGrid } from './_help.js';
import { main, mobileV, mobileH } from './_layout.js';
import content from './_content.js';

export default class AppMobile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: props.isMobile,
      isLoaded: false,
      isResizing: false,
      isHorizontal: false,
      cols: 0,
      rows: 0,
      iframe: false,
      url: '',
      projects: false,
      skills: false,
      links: false,
      contact: false
    };
    this.layout = {};
    this.celRatio = (2 / 3);
    this.celHeight = 18;
    this.celWidth = this.celHeight * this.celRatio;
    this.grid = [];
    this.lastHover = false;
    this.containerStyle = {};
    this.layoutRefresh = this.layoutRefresh.bind(this);
    this.layoutRefreshMobile = this.layoutRefreshMobile.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
  };

  componentDidMount() {
    if (this.state.isMobile) {
      this.layoutRefreshMobile();
      this.refs.grid.addEventListener('touchmove', this.handleTouchMove);
      window.addEventListener('resize', this.layoutRefreshMobile);
    } else {
      this.layoutRefresh();
      window.addEventListener('resize', this.layoutRefresh);
    };

    // window.addEventListener('contextmenu', (e) => {
    //   e.preventDefault();
    //   if (e.target.classList[0] === 'contact') console.log(e)
    // })
  };


//////////////////////////
// LAYOUT BUILD METHODS //
//////////////////////////

  layoutRefresh() {
    if (!this.state.isResizing) {
      clearTimeout(this.introTimeout);
      clearTimeout(this.hoverTimeout);
      this.setState(prevState => ({ isResizing: true }));
      this.undrawGrid(this.grid);
    };
    if (this.state.iframe) {
      // this.containerStyle = {};
      this.setState(prevState => ({ iframe: false }));
    };
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.celHeight = 14;
      this.celWidth = this.celHeight * this.celRatio;
      this.layout = main;
      this.configureCels();
      this.makeGrid();
    }, 500);
  };

  layoutRefreshMobile() {
    clearTimeout(this.introTimeout);
    this.undrawGrid(this.grid);
    this.celHeight = 18;
    this.celWidth = this.celHeight * this.celRatio;
    const isHorizontal = this.configureCels();
    this.layout = isHorizontal ? mobileH : mobileV;
    this.makeGrid(isHorizontal);
  };

  configureCels() {
    const { innerWidth, innerHeight } = window;
    const { isMobile } = this.state;
    const isHorizontal = innerWidth > innerHeight;
    const w = innerWidth / (!isMobile ? 56 : (isHorizontal ? 50 : 31));
    const h = innerHeight / (!isMobile ? 32 : (isHorizontal ? 21 : 30));
    if (w < this.celWidth || h < this.celHeight) {
      if (w < h * this.celRatio) {
        this.celWidth = w;
        this.celHeight = w / this.celRatio;
      } else {
        this.celWidth = h * this.celRatio;
        this.celHeight = h;
      };
    };
    return isHorizontal;
  };

  makeGrid(isHorizontal = false) {
    const { celHeight, celWidth } = this;
    const { isMobile, isLoaded } = this.state;
    const { grid } = this.refs;
    const margin = isMobile ? 0 : -2;
    const cols = Math.floor(window.innerWidth / celWidth) + (margin * 2);
    const rows = Math.floor(window.innerHeight / celHeight) + margin;
    const width = cols * celWidth;
    const height = rows * celHeight;

    d3.selectAll('text').remove();
    grid.style.width = width + 'px';
    grid.style.height = height + 'px';

    this.drawGrid(this.grid =
      emptyGrid(cols, rows, isLoaded ? false : (isMobile ? 300 : 500))
    );

    Object.keys(content).forEach(d => {
      this.introTimeout = setTimeout(() => {
        const { posX, posY } = this.layout[d];
        const queue = this.populateGrid({ ...content[d], posX, posY });
        this.undrawGrid(queue);
        this.drawGrid(queue);
      }, isLoaded ? (content[d].t / 4) : content[d].t);
    });

    this.setState(prevState => ({
      isHorizontal,
      cols,
      rows,
      isLoaded: true,
      isResizing: false
    }));
  };


/////////////////////
// D3 DRAW METHODS //
/////////////////////

  drawGrid(cels) {
    const { celHeight, celWidth } = this;
    d3.select(this.refs.grid).selectAll('g').data(cels)
      .enter().append('text')
        .text(d => d.text)
        .attr('id', d => d.id)
        .attr('class', d => d.cl ? d.cl : null)
        .style('position', 'absolute')
        .style('width', celWidth + 'px')
        .style('height', celHeight + 'px')
        .style('left', d => d.c * celWidth + 'px')
        .style('top', d => d.r * celHeight + 'px')
        .style('background-color', 'rgba(0, 0, 0, 0)')
        // .style('color', d => d.fill ? d.fill : '#999999')
        .style('color', d => d.fill ? d.fill : '#4A4B4D')
        .style('font-size', celHeight + 'px')
        .style('text-align', 'center')
        .style('opacity', 0)
        .on('mouseenter', !this.state.isMobile ? this.handleHover : null)
        .on('click', this.handleClick)
      .transition().delay(d => d.delay)
        // .style('opacity', d => d.cl ? 1 : .35);
        .style('opacity', d => 1);
  };

  undrawGrid(cels) {
    cels.forEach(d => {
      d3.select(`#${d.id}`)
          .attr('class', 'delete')
          .attr('id', null)
          .on('mouseover', null)
          .on('click', null)
        .transition()
          .delay(Math.floor(d.delay / 1.5))
          .style('opacity', 0)
          .remove();
    });
  };

  letterSwap(cel) {
    cel.text = randomLetter();
    d3.select(`#${cel.id}`)
      .transition()
        .style('opacity', 0)
      .transition()
        .text(cel.text)
        .style('opacity', 1);
    // d3.select(`#${cel.id}`)
    //   .transition()
    //     .style('opacity', 0)
    //   .transition()
    //     .duration(1000)
    //     .text(cel.text)
    //     .style('opacity', .25)
    //   .transition()
    //     .duration(3000)
    //     .style('opacity', 1);
  };


//////////////////////////
// GRID REFRESH METHODS //
//////////////////////////

  populateGrid({ str, fill, cl, hover, click, posX, posY, adjC = 0, adjR = 0, delayIncr = 1 }) {
    const { isMobile, cols, rows } = this.state;
    const queue = [];
    const r = Math.floor(posY * rows) + adjR;
    const midpoint = (-str.length / 2);
    let c = Math.floor(
      (posX * cols) +
      (adjC ? adjC : (!isMobile ? midpoint : 0)) +
      (isMobile ? midpoint : 0)
    );
    str.split('').forEach((text, i) => {
      const cel = this.grid[cols * r + c++];
      if (text !== ' ') {
        queue.push(Object.assign(cel, {
          text,
          fill,
          cl,
          click,
          hover: hover ? str : false,
          delay: Math.floor(250 * (((delayIncr + i) / str.length) + Math.random()))
        }));
      };
    });
    return queue;
  };

  showSubset(group) {
    const { posX, posY, offsetX, offsetY, deltaX, deltaY } = this.layout[group];
    const { subset, fill } = content[group].hover;
    const useAlt = this.state.isMobile && !this.state.isHorizontal;
    const queue = [];
    subset.forEach((d, i) => {
      queue.push(...this.populateGrid({
        fill,
        posX,
        posY,
        cl: group,
        str: (useAlt && d.strAlt) ? d.strAlt : d.str,
        click: d.click,
        adjC: offsetX + (deltaX * i) + (2 * Math.random() - 1),
        adjR: offsetY + (deltaY * i),
        delayIncr: ((i + 1) / 2)
      }));
    });
    this.undrawGrid(queue);
    this.drawGrid(queue);
  };

  replaceCels(cels) {
    let fill, cl, hover, click;
    const queue = cels.map((cel, i) => {
      return Object.assign(cel, {
        fill,
        cl,
        hover,
        click,
        text: randomLetter()
      });
    });
    this.undrawGrid(queue);
    this.drawGrid(queue);
  };

  hideSubset(cl) {
    const cels = this.grid.filter(d =>
      cl ? d.cl === cl : d.cl
    );
    this.replaceCels(cels);
  };


////////////////////
// IFRAME METHODS //
////////////////////

  setIframeSize(ratio) {
    const { celHeight, celWidth } = this;
    const { cols, rows } = this.state;

    let width = cols - 10;
    let height = Math.round((width * celWidth / ratio) / celHeight);
    if (height > (rows - 5)) {
      height = rows - 5;
      width = Math.round(height * celHeight * ratio / celWidth);
    };
    const startCol = Math.floor((cols - width) / 2);
    const startRow = Math.max(Math.floor((rows - height) / 3), 2);

    this.containerStyle = {
      width: (width * celWidth).toFixed(2) + 'px',
      height: (height * celHeight).toFixed(2) + 'px',
      left: (startCol * celWidth).toFixed(2) + 'px',
      top: (startRow * celHeight).toFixed(2) + 'px',
    };

    return { width, height, startCol, startRow };
  };

  makeIframeText(url, startRow, height) {
    const queue = this.populateGrid({
      str: url.substring(8),
      fill: '#FDA50F',
      cl: 'info',
      click: url,
      posX: .5,
      posY: (startRow + height) / this.state.rows,
      adjR: 1
    });
    this.undrawGrid(queue);
    this.drawGrid(queue);
  };

  showIframe(iframe) {
    const { url, ratio } = content.projects.hover.data[iframe];
    const { width, height, startCol, startRow } =
      this.setIframeSize(ratio);
    this.setState(prevState => ({ iframe, url }));
    this.hideSubset();

    const clear = this.grid.filter(d =>
      d.c >= startCol &&
      d.c < (startCol + width) &&
      d.r >= startRow &&
      d.r < (startRow + height)
    );
    clear.forEach(d => {
      d.cl = 'hidden';
      d.delay = Math.floor(1500 * Math.random());
    });
    this.undrawGrid(clear);

    this.makeIframeText(url, startRow, height);
  };

  hideIframe() {
    this.replaceCels(this.grid.filter(d =>
      d.cl === 'hidden' || d.cl === 'info'
    ));
    Object.keys(content).forEach(d => {
      const { posX, posY } = this.layout[d];
      const queue = this.populateGrid({ ...content[d], posX, posY });
      this.undrawGrid(queue);
      this.drawGrid(queue);
    });
      this.setState(prevState => ({ iframe: false, url: false }));
  };


/////////////////////
// EVENT CALLBACKS //
/////////////////////

  toggleSubset(group) {
    if (this.state[group]) {
      this.hideSubset(group);
    } else {
      this.showSubset(group);
    };
    this.setState(prevState => ({ [group]: !prevState[group] }));
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


////////////////////
// EVENT HANDLERS //
////////////////////

  handleClick(cel) {
    const { cl, hover, click } = cel;
    const { isMobile, iframe } = this.state;
    if (!isMobile && !click && iframe) {
      this.hideIframe();
    } else if (hover) {
      this.handleHover(cel);
    } else if (!cl) {
      this.letterSwap(cel);
    } else {
      this.toggleClickAction(cl, click, isMobile);
    };
  };

  handleHover(cel) {
    if (cel.hover && cel.hover !== this.lastHover) {
      clearTimeout(this.hoverTimeout);
      this.lastHover = cel.hover;
      this.toggleSubset(cel.hover);
      this.hoverTimeout = setTimeout(() => {
        this.lastHover = false;
      }, 1000);
    } else if (!cel.cl) {
      this.letterSwap(cel);
    };
  };

  handleTouchMove(e) {
    e.preventDefault();
    const { clientX, clientY } = e.changedTouches[0];
    const el = document.elementFromPoint(clientX, clientY);
    const cel = el ? this.grid[el.id.substring(3)] : null;
    if (cel) {
      this.handleHover(cel);
    };
  };


////////////
// RENDER //
////////////

  render() {
    const { isMobile, isHorizontal, iframe, url } = this.state;
    const appStyle = isMobile
      ? {
          height: isHorizontal ? '100vh' : '100%',
          justifyContent: isHorizontal ? 'flex-end' : 'center'
        }
      : null;
    const mainStyle = isMobile
      ? {
          margin: isHorizontal
            ? 0
            : (window.innerHeight - (this.refs.grid || 0).clientHeight) / 3 +
              'px 0 0 0'
        }
      : null;
    const gridStyle = !isMobile
      ? { margin: this.celHeight / 3 + 'px 0 0 0' }
      : null;
    const toggleHide = iframe ? 'active ' : 'inactive';

    return (
      <div id="App" style={appStyle}>
        <div id="main" style={mainStyle}>
          <div ref="grid" className={(iframe && 'esc') || ''} style={gridStyle} />
          {!isMobile &&
            <div id="container" className={toggleHide} style={this.containerStyle}>
              <iframe
                id="iframe"
                className={toggleHide + (iframe || '')}
                allow="camera;microphone"
                src={url || null}
                title="project"
                scrolling="no"
              />
            </div>
          }
        </div>
      </div>
    );
  };
};
