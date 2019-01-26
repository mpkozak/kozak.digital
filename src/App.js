import React, { PureComponent } from 'react';
import './App.css';
import { d3, randomLetter, emptyGrid } from './_help.js';
import content from './_content.js';

export default class AppMobile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: props.isMobile,
      isLoaded: false,
      isResizing: false,
      isHorizontal: false,
      iframeFocus: false,
      cols: undefined,
      rows: undefined,
      projects: false,
      skills: false,
      links: false,
      contact: false
    };
    this.celRatio = (2 / 3);
    this.celHeight = 18;
    this.celWidth = this.celHeight * this.celRatio;
    this.grid = [];
    this.containerStyle = {};
    this.url = '';
    this.layoutRefresh = this.layoutRefresh.bind(this);
    this.layoutRefreshMobile = this.layoutRefreshMobile.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
  };

  componentDidMount() {
    Object.assign(this, content);
    if (this.state.isMobile) {
      this.layoutRefreshMobile();
      this.refs.grid.addEventListener('touchmove', this.handleTouchMove);
      window.addEventListener('resize', this.layoutRefreshMobile);
    } else {
      this.layoutRefresh();
      window.addEventListener('resize', this.layoutRefresh);
    };
  };

  componentDidUpdate() {
    console.log(this.state.cols, this.state.rows)
  }


//////////////////////////
// LAYOUT BUILD METHODS //
//////////////////////////

  layoutRefresh() {
    if (!this.state.isResizing) {
      clearTimeout(this.introTimeout);
      clearTimeout(this.hoverTimeout);
      this.setState(prevState => ({ isResizing: false }));
      this.undrawGrid(this.grid);
    };
    if (this.state.iframeFocus) {
      this.url = false;
      this.setState(prevState => ({ iframeFocus: false }));
    };
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.celHeight = 14;
      this.celWidth = this.celHeight * this.celRatio;
      const isHorizontal = this.configureCels();
      this.makeGrid(isHorizontal);
    }, 500);
  };

  layoutRefreshMobile() {
    clearTimeout(this.introTimeout);
    this.undrawGrid(this.grid);
    this.celHeight = 18;
    this.celWidth = this.celHeight * this.celRatio;
    const isHorizontal = this.configureCels();
    this.configureTextMobile(isHorizontal);
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

  configureTextMobile(isHorizontal) {
    const { text, projects, skills, links, contact } = this;
    if (isHorizontal) {
      text[0].posY = .75;
      text[1].posY = .85;
      text[2].posX = .15;
      text[2].posY = .14;
      text[3].posX = .45;
      text[3].posY = .58;
      text[4].posX = .24;
      text[5].posX = .82;
      text[5].posY = .35;
      projects.offsetX = 6;
      projects.offsetY = 2;
      projects.deltaX = 1;
      skills.offsetX = -2;
      skills.deltaX = 1.2;
      links.offsetX = -3;
      links.deltaX = -1;
      contact.display[0].str = 'mparkerkozak@gmail.com';
      contact.offsetX = -2;
      contact.offsetY = 3;
    } else {
      text[0].posY = .5;
      text[1].posY = .6;
      text[2].posX = .22;
      text[2].posY = .18;
      text[3].posX = .7;
      text[3].posY = .4;
      text[4].posX = .15;
      text[5].posX = .85;
      text[5].posY = .75;
      projects.offsetX = 3;
      projects.offsetY = 3;
      projects.deltaX = 1;
      skills.offsetX = 5;
      skills.deltaX = -.7;
      links.offsetX = 2;
      links.deltaX = .9;
      contact.display[0].str = 'email';
      contact.offsetX = -5;
      contact.offsetY = 3;
    };
    content.inheritPosition();
  };

  makeGrid(isHorizontal) {
    const { celHeight, celWidth, text } = this;
    const { isMobile, isLoaded } = this.state;
    const { grid } = this.refs;
    // const scalar = isMobile ? 1 : .95;
    // const cols = Math.floor((window.innerWidth * scalar) / celWidth);
    // const rows = Math.floor((window.innerHeight * scalar) / celHeight);
    const margin = isMobile ? 0 : -2;
    const cols = Math.floor(window.innerWidth / celWidth) + (margin * 2);
    const rows = Math.floor(window.innerHeight / celHeight) + margin;
    const width = cols * celWidth;
    const height = rows * celHeight;

    d3.selectAll('text').remove();
    grid.style.width = width + 'px';
    grid.style.height = height + 'px';

    this.drawGrid(
      this.grid = emptyGrid(cols, rows, isLoaded ? 250 : 400)
    );
    text.forEach(d => {
      d.delayIncr = !isLoaded;
      this.introTimeout = setTimeout(() => {
        const queue = this.populateGrid(d);
        this.undrawGrid(queue);
        this.drawGrid(queue);
      }, isLoaded ? d.t / 2 : d.t);
    });

    this.setState(prevState => ({
      isLoaded: true, isResizing: false, isHorizontal, cols, rows
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
        .style('color', d => d.fill ? d.fill : '#999999')
        .style('font-size', celHeight + 'px')
        .style('text-align', 'center')
        .style('opacity', 0)
        .on('mouseover', !this.state.isMobile ? this.handleHover : null)
        .on('click', this.handleClick)
      .transition().delay(d => d.delay)
        .style('opacity', d => d.cl ? 1 : .5);
  };

  undrawGrid(cels) {
    cels.forEach(d => {
      d3.select(`#${d.id}`)
          .attr('class', 'delete')
          .attr('id', null)
          .on('mouseover', null)
          .on('click', null)
        .transition()
          .delay(d.delay / 1.5)
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
        .style('opacity', .5);
  };


//////////////////////////
// GRID REFRESH METHODS //
//////////////////////////

  populateGrid({ str, fill, cl, hover, action, posX, posY, adjC, adjR, delayIncr = 1 }) {
    const { isMobile, cols, rows } = this.state;
    const queue = [];
    const r = Math.floor(posY * rows) + (adjR ? adjR : 0);
    const midpoint = (-str.length / 2);
    let c = Math.floor(
      (posX * cols) +
      (adjC ? adjC : (!isMobile ? midpoint : 0)) +
      (isMobile ? midpoint : 0)
    );

//mobile
    // (posX * cols) + (adjC ? adjC : 0) + midpoint
//desktop
    // (posX * cols) + (adjC ? adjC : midpoint)

//adjC + mobile
    // (posX * cols) + adjC + midpoint
//adjC + desktop
    // (posX * cols) + adjC

//no adjC + mobile
    // (posX * cols) + midpoint
//no adjC + desktop
    // (posX * cols) + midpoint





    str.split('').forEach((text, i) => {
      const cel = this.grid[cols * r + c++];
      if (text !== ' ') {
        queue.push(Object.assign(cel, {
          delay: 250 * (((delayIncr + i) / str.length) + Math.random()),
          text,
          fill,
          cl,
          hover,
          action
        }));
      };
    });
    return queue;
  };

  showSubset(cl, { display, fill, posX, posY, offsetX, offsetY, deltaX, deltaY }) {
    const queue = [];
    display.forEach((d, i) => {
      queue.push(...this.populateGrid({
        str: d.str,
        action: d.action,
        adjC: offsetX + (deltaX * i) + (2 * Math.random() - 1),
        adjR: offsetY + (deltaY * i),
        delayIncr: ((i + 1) / 2),
        fill,
        cl,
        posX,
        posY
      }));
    });
    this.undrawGrid(queue);
    this.drawGrid(queue);
  };

  replaceCels(cels) {
    let fill, cl, hover, action;
    const queue = cels.map((cel, i) => {
      return Object.assign(cel, {
        text: randomLetter(),
        fill,
        cl,
        hover,
        action
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


/////////////////////
// EVENT CALLBACKS //
/////////////////////

  toggleSubset(hover) {
    if (this.state[hover]) {
      this.hideSubset(hover);
    } else {
      this.showSubset(hover, this[hover]);
    };
    this.setState(prevState => ({ [hover]: !prevState[hover] }));
  };

  toggleClickAction(cl, action, isMobile) {
    switch (cl) {
      case 'projects' :
        if (isMobile) {
          window.open(this.projects.data[action].url, '_blank');
        } else {
          this.showIframe(action);
        };
        break;
      case 'links' :
        window.open(action, '_blank');
        break;
      case 'contact' :
        window.location = action;
        break;
      case 'info' :
        window.open(action, '_blank');
        break;
      default : return null;
    };
  };


////////////////////
// EVENT HANDLERS //
////////////////////

  handleClick(cel) {
    const { cl, hover, action } = cel;
    const { isMobile, iframeFocus } = this.state;
    if (!isMobile && !action && iframeFocus) {
      this.hideIframe();
    } else if (isMobile && hover) {
      this.toggleSubset(hover);
    } else if (!cl) {
      this.letterSwap(cel);
    } else {
      this.toggleClickAction(cl, action, isMobile);
    };

    // if (!isMobile && !action && iframeFocus) {
    //   this.hideIframe();
    // } else {
    //   this.toggleClickAction(cl, action, isMobile);
    // };
    // if (isMobile && hover) {
    //   this.toggleSubset(hover);
    // } else if (!cl) {
    //   this.letterSwap(cel);
    // } else {
    //   this.toggleClickAction(cl, action, isMobile);
    // };
  };

  handleHover(cel) {
    if (cel.hover) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = setTimeout(() => {
        this.toggleSubset(cel.hover);
      }, 200);
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


////////////////////
// IFRAME METHODS //
////////////////////

  setIframeDimensions(iframeFocus) {
    const { ratio } = this.projects.data[iframeFocus];
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
      width: (width * celWidth)  + 'px',
      height: (height * celHeight) + 'px',
      left: (startCol * celWidth) + 'px',
      top: (startRow * celHeight) + 'px',
    };
    return { width, height, startCol, startRow };
  };

  makeIframeText(url, startRow, height) {
    const queue = this.populateGrid({
      str: url.substring(8),
      fill: '#FDA50F',
      cl: 'info',
      action: url,
      posX: .5,
      posY: (startRow + height) / this.state.rows,
      adjR: 1,
    });
    this.undrawGrid(queue);
    this.drawGrid(queue);
  };

  showIframe(iframeFocus) {
    const {
      width, height, startCol, startRow
    } = this.setIframeDimensions(iframeFocus);

    this.url = this.projects.data[iframeFocus].url;
    this.setState(prevState => ({ iframeFocus }));
    this.hideSubset();

    const clear = this.grid.filter(d =>
      d.c >= startCol &&
      d.c < (startCol + width) &&
      d.r >= startRow &&
      d.r < (startRow + height)
    );
    clear.forEach(d => {
      d.cl = 'hidden';
      d.delay = 1500 * Math.random();
    });
    this.undrawGrid(clear);

    this.makeIframeText(this.url, startRow, height);
  };

  hideIframe() {
    this.replaceCels(this.grid.filter(d =>
      d.cl === 'hidden' || d.cl === 'info'
    ));
    this.text.forEach(d => {
      const queue = this.populateGrid(d);
      this.undrawGrid(queue);
      this.drawGrid(queue);
    });
      this.url = false;
      this.setState(prevState => ({ iframeFocus: false }));
  };


////////////
// RENDER //
////////////

  render() {
    const { isMobile, isHorizontal, iframeFocus } = this.state;
    const toggleHide = iframeFocus ? 'active' : 'hidden';
    const gridStyle = {
      margin: (this.celHeight / 3) + 'px 0 0 0'
    };
    const appStyleMobile = {
      height: isHorizontal ? '100vh' : '100%',
      justifyContent: isHorizontal ? 'flex-end' : 'center'
    };
    const mainStyleMobile = {
      margin: isHorizontal ? '0' : '1vh 0'
    };

    return (
      <div className="App" style={isMobile ? appStyleMobile : null}>
        <div className="main" style={isMobile ? mainStyleMobile : null}>
          <div ref="grid" className="grid" style={!isMobile ? gridStyle: null} />
          {!isMobile &&
            <div id="container" className={toggleHide} style={this.containerStyle}>
              <iframe
                id={iframeFocus || null}
                className={toggleHide}
                allow="camera;microphone"
                src={this.url || null}
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
