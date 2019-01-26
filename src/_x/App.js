import React, { PureComponent } from 'react';
import { d3, randomLetter, emptyGrid } from './_help.js';
import content from './_content.js';
import './App.css';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rows: undefined,
      cols: undefined,
      isLoaded: false,
      resize: false,
      skills: false,
      projects: false,
      contact: false,
      links: false,
      focus: false,
    };
    this.celRatio = (2 / 3);
    this.celHeight = 14;
    this.celWidth = this.celHeight * this.celRatio;
    this.grid = [];
    this.url = '';
    this.iframeStyle = {};
    this.handleResize = this.handleResize.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.makeGrid = this.makeGrid.bind(this);
  };

  componentDidMount() {
    Object.assign(this, content);
    window.addEventListener('resize', this.handleResize);
    this.makeGrid();
  };

  makeGrid() {
    const { celHeight, celWidth, text } = this;
    const { minWidth, minHeight } = this.props;
    const { isLoaded } = this.state;
    const { grid } = this.refs;
    const cols = Math.floor((Math.max(window.innerWidth, minWidth) * .95) / celWidth);
    const rows = Math.floor((Math.max(window.innerHeight, minHeight) * .95) / celHeight);
    const width = cols * celWidth;
    const height = rows * celHeight;

    d3.selectAll('text').remove();
    grid.style.width = width + 'px';
    grid.style.height = height + 'px';

    this.drawGrid(this.grid = emptyGrid(cols, rows, isLoaded ? 250 : 500));
    text.forEach(d => {
      d.delayIncr = !isLoaded;
      this.introTimeout = setTimeout(() => {
        const queue = this.populateGrid(d);
        this.undrawGrid(queue);
        this.drawGrid(queue);
      }, isLoaded ? 0 : d.t);
    });

    this.setState(prevState => ({ cols, rows, isLoaded: true, resize: false }));
  };

  drawGrid(cels) {
    const { celHeight, celWidth } = this;
    d3.select(this.refs.grid).selectAll('g')
      .data(cels).enter().append('text')
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
        .on('mouseover', this.handleHover)
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

  replaceCels(cels) {
    let fill, cl, hover, action;
    const queue = cels.map((cel, i) => {
      return Object.assign(cel, {
        text: randomLetter(), fill, cl, hover, action
      });
    });
    this.undrawGrid(queue);
    this.drawGrid(queue);
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

  populateGrid({ str, posX, posY, fill, cl, hover, adjC, adjR, action, delayIncr = 1 }) {
    const { cols, rows } = this.state;
    const queue = [];
    const r = Math.floor(posY * rows) + (adjR ? adjR : 0);
    let c = Math.floor((posX * cols) + (adjC ? adjC : (-str.length / 2)));
    str.split('').forEach((text, i) => {
      const cel = this.grid[cols * r + c++];
      if (text !== ' ') {
        cel.delay = 250 * (((delayIncr + i) / str.length) + Math.random());
        queue.push(Object.assign(cel, {
          text, fill, cl, hover, action
        }));
      };
    });
    return queue;
  };

  showSubset(cl) {
    const { display, fill, posX, posY, offsetX, offsetY, deltaX, deltaY } = this[cl];
    const queue = [];
    display.forEach((d, i) => {
      const { str, action } = d;
      const adjR = offsetY + (deltaY * i);
      const adjC = offsetX + (deltaX * i) + (2 * Math.random() - 1);
      queue.push(...this.populateGrid({
        cl, delayIncr: ((i + 1) / 2), str, posX, posY, fill, adjR, adjC, action
      }));
    });
    this.undrawGrid(queue);
    this.drawGrid(queue);
  };

  hideSubset(cl) {
    const cels = this.grid.filter(d => (cl ? d.cl === cl : d.cl));
    this.replaceCels(cels);
  };

  setIframeDimensions(focus) {
    const { celHeight, celWidth } = this;
    const { rows, cols } = this.state;
    const { ratio } = this.projects.data[focus];
    let width = cols - 10;
    let height = Math.round((width * celWidth / ratio) / celHeight);
    if (height > (rows - 5)) {
      height = rows - 5;
      width = Math.round(height * celHeight * ratio / celWidth);
    };
    const startCol = Math.floor((cols - width) / 2);
    const startRow = Math.max(Math.floor((rows - height) / 3), 2);

    this.iframeStyle = {
      width: (width * celWidth)  + 'px',
      height: (height * celHeight) + 'px',
      left: (startCol * celWidth) + 'px',
      top: (startRow * celHeight) + 'px',
    };
    // const { container } = this.refs;
    // container.style.width = (width * celWidth);
    // container.style.height = (height * celHeight);
    // container.style.left = (startCol * celWidth);
    // container.style.top = (startRow * celHeight);

    return { width, height, startCol, startRow };
  };

  makeIframeText(url, startRow, height) {
    const queue = this.populateGrid({
      str: url.substring(8),
      cl: 'info',
      posX: .5,
      posY: (startRow + height) / this.state.rows,
      fill: '#FDA50F',
      adjR: 1,
      action: url
    });
    this.undrawGrid(queue);
    this.drawGrid(queue);
  };

  showIframe(focus) {
    this.url = this.projects.data[focus].url;
    const { width, height, startCol, startRow } = this.setIframeDimensions(focus);
    this.setState(prevState => ({ focus }));
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
    this.replaceCels(this.grid.filter(d => d.cl === 'hidden' || d.cl === 'info'));
    this.text.forEach(d => {
      const queue = this.populateGrid(d);
      this.undrawGrid(queue);
      this.drawGrid(queue);
    });
      this.url = false;
      this.setState(prevState => ({ focus: false }));
  };

  handleResize() {
    const { focus, resize } = this.state;
    if (focus) {
      this.url = false;
      this.setState(prevState => ({ focus: false }));
    }
    if (!resize) {
      clearTimeout(this.introTimeout);
      clearTimeout(this.hoverTimeout);
      this.setState(prevState => ({ resize: false }));
      this.undrawGrid(this.grid);
    };
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(this.makeGrid, 500);
  };

  handleHover(cel) {
    const { cl, hover } = cel;
    if (hover) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = setTimeout(() => {
        if (this.state[hover]) this.hideSubset(hover);
        else this.showSubset(hover);
        this.setState(prevState => ({ [hover]: !prevState[hover] }));
      }, 200);
    } else if (!cl) {
      this.letterSwap(cel);
    };
  };

  handleClick(cel) {
    const { cl, action } = cel;
    const { focus } = this.state;
    if (!action && focus) {
      this.hideIframe();
    } else {
      switch (cl) {
        case 'projects' :
          this.showIframe(action);
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
  };


  render() {
    const { url, iframeStyle } = this;
    const { minWidth, minHeight } = this.props;
    const { focus } = this.state;
    const style = {
      // minWidth: minWidth + 'px',
      // minHeight: minHeight + 'px'
    };
    const toggleHide = focus ? 'active' : 'hidden';
    return (
      <div className="App" style={style}>
        <div className="main">
          <div ref="grid" className="grid" />
          <div ref="container" id={'iframe-container'} className={toggleHide} style={iframeStyle}>
            <iframe
              id={focus || null}
              className={toggleHide}
              allow="camera;microphone"
              src={url || null}
              title="project"
              scrolling="no"
            />
          </div>
        </div>
      </div>
    );
  };
};
