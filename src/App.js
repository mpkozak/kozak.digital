import React, { PureComponent } from 'react';
import * as d3 from 'd3';
import { randomLetter, emptyGrid } from './components/_help.js';
import content from './components/_content.js';
import './App.css';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rows: undefined,
      cols: undefined,
      // isLoaded: false,
      isLoaded: true,

      skills: false,
      projects: false,
      contact: false,
      links: false,

      iframe: null,
      url: null,
    };
    this.fontSize = 14;
    this.fontWidth = this.fontSize * (2 / 3);
    this.grid = [];

    this.setSize = this.setSize.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.randomPop = this.randomPop.bind(this);
  };

  componentDidMount() {
    Object.assign(this, content);
    window.addEventListener('resize', this.handleResize);
    this.setSize();
    setTimeout(() => this.setState(prevState => ({ isLoaded: true })), 3500);
    this.randomPop();
  };

  componentDidUpdate() {
  };

  randomPop() {
    const { grid } = this;
    const cel = grid[Math.floor(Math.random() * grid.length)];
    if (!cel.cl) this.letterPop(cel);
    setTimeout(this.randomPop, 500 + (Math.random() * 2000));
  };

  setSize() {
    const { fontSize, fontWidth, text } = this;
    const { isLoaded } = this.state;
    const { svg } = this.refs;
    const cols = Math.floor((Math.max(window.innerWidth, 550) * .95) / fontWidth);
    const rows = Math.floor((Math.max(window.innerHeight, 450) * .95) / fontSize);
    const width = cols * fontWidth;
    const height = rows * fontSize;

    d3.selectAll('text').remove();
    svg.style.width = width;
    svg.style.height = height;
    svg.setAttribute('viewbox', `0 0 ${width} ${height}`);

    this.drawGrid(this.grid = emptyGrid(cols, rows, isLoaded));
    text.forEach(d => {
      d.delayIncr = !isLoaded;
      this.introTimeout = setTimeout(() => {
        const queue = this.populateGrid(d);
        this.undrawGrid(queue);
        this.drawGrid(queue);
      }, isLoaded ? 0 : d.t);
    });

    this.setState(prevState => ({ cols, rows }));
  };

  drawGrid(cels) {
    const { fontSize, fontWidth } = this;
    d3.select(this.refs.svg).selectAll('g')
      .data(cels).enter().append('text')
        .text(d => d.text)
        .attr('id', d => d.id)
        .attr('class', d => d.cl ? d.cl : undefined)
        .attr('x', d => d.c * fontWidth)
        .attr('y', d => d.r * fontSize)
        .attr('font-size', fontSize)
        .attr('fill', d => d.fill ? d.fill : '#999999')
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'hanging')
        .attr('opacity', 0)
      .transition().delay(d => d.delay)
        .attr('opacity', d => d.cl ? 1 : .5);
  };

  undrawGrid(cels) {
    d3.selectAll('.delete').remove();
    cels.forEach(d => {
      d3.select(`#${d.id}`)
        .attr('class', 'delete')
        .attr('id', undefined)
        .transition()
          .delay(d.delay / 1.5)
          .attr('opacity', 0)
          .remove();
    });
  };

  letterSwap(cel) {
    cel.text = randomLetter();
    d3.select(`#${cel.id}`)
      .transition()
        .attr('opacity', 0)
      .transition()
        .text(cel.text)
        .attr('opacity', .5);
  };

  letterPop(cel, type) {
    const { fontSize, fontWidth } = this;
    cel.text = randomLetter();
    const speed = 100 + (Math.random() * 1000);
    const scalars = [[.5, -1.75], [0, 5]];
    if (Math.random() < 0.5) scalars.forEach(d => d.reverse());
    d3.select(`#${cel.id}`)
      .transition().duration(speed)
        .attr('x', (cel.c + scalars[0][0]) * fontWidth)
        .attr('y', (cel.r + scalars[0][0]) * fontSize)
        .attr('font-size', scalars[1][0] * fontSize)
        .attr('opacity', 0)
      .transition().duration(0)
        .text(cel.text)
        .attr('x', (cel.c + scalars[0][1]) * fontWidth)
        .attr('y', (cel.r + scalars[0][1]) * fontSize)
        .attr('font-size', scalars[1][1] * fontSize)
      .transition().duration(speed / 2)
        .attr('x', cel.c * fontWidth)
        .attr('y', cel.r * fontSize)
        .attr('font-size', fontSize)
        .attr('opacity', .5);
  };



  populateGrid(entry) {
    const { str, posX, posY, fill, cl, hover, adjC, adjR, action, delayIncr = 1 } = entry;
    const { cols, rows } = this.state;
    const queue = [];
    const r = Math.floor(posY * rows) + (adjR ? adjR : 0);
    let c = Math.floor((posX * cols) + (adjC ? adjC : (-str.length / 2)));
    str.split('').forEach((text, i) => {
      const cel = this.grid[cols * r + c++];
      if (text !== ' ') {
        if (delayIncr) cel.delay = 250 * (((delayIncr + i) / str.length) + Math.random());
        queue.push(Object.assign(cel, {
          text, fill, cl, hover, action
        }));
      };
    });
    return queue;
  };

  showSubset(key) {
    const { display, fill, posX, posY, offsetX, offsetY, deltaX, deltaY } = this[key];
    const queue = [];
    display.forEach((d, i) => {
      const { str, action } = d;
      const adjR = offsetY + (deltaY * i);
      const adjC = offsetX + (deltaX * i) + (2 * Math.random() - 1);
      queue.push(...this.populateGrid({
        cl: key, delayIncr: ((i + 1) / 2), str, posX, posY, fill, adjR, adjC, action
      }));
    });
    this.undrawGrid(queue);
    this.drawGrid(queue);
  };

  hideSubset(key) {
    const cels = this.grid.filter(d => (key ? d.cl === key : d.cl));
    this.replaceCels(cels);
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



  handleResize() {
    const { svg } = this.refs;
    svg.style.width = 0;
    svg.style.height = 0;
    clearTimeout(this.introTimeout);
    clearTimeout(this.hoverTimeout);
    this.hoverTimeout = setTimeout(this.setSize, 500);
  };

  handleHover(e) {
    // const cel = this.grid.find(d => d.id === e.target.id);
    const cel = this.grid[e.target.id.substring(3)];
    if (cel) {
      const { cl, hover } = cel;
      if (!cl) this.letterSwap(cel);
      if (hover) {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = setTimeout(() => {
          if (this.state[hover]) this.hideSubset(hover);
          else this.showSubset(hover);
          this.setState(prevState => ({ [hover]: !prevState[hover] }));
        }, 250);
      };
    };
  };

  handleClick(e) {
    const cel = this.grid[e.target.id.substring(3)];
    if (cel) {
      const { cl, action } = cel;
      if (action) {
        switch (cl) {
          case 'projects' :
            console.log('open project ', action);
            this.showIframe(action);
            break;
          case 'links' :
            window.open(action, '_blank')
            break;
          case 'contact' :
            window.location = action;
            break;
          // default : return null
          default : console.log('default')
        };
      } else if (this.state.iframe) {
        this.hideIframe();
        // console.log('exit')
      }
    };
  };


  hideIframe() {
    this.setState(prevState => ({ iframe: false }))
    this.replaceCels(this.grid.filter(d => d.cl === 'hidden' || d.cl === 'info'));
    this.text.forEach(d => {
      const queue = this.populateGrid(d);
      this.undrawGrid(queue);
      this.drawGrid(queue);
    });
  };






  showIframe(focus) {
    const { projects, fontSize, fontWidth } = this;
    const { name, date, tech, git, url, ratio } = projects.data[focus];
    const { rows, cols } = this.state;

    this.hideSubset();


// clear space for iframe based on aspect
    const celRatio = (fontSize / fontWidth);
    const frameRows = rows - 10;
    const frameCols = Math.ceil((frameRows * celRatio * ratio) / 2) * 2;
    // const frameCols = Math.ceil(frameRows * celRatio * ratio);
    const startRow = 2;
    const startCol = Math.floor((cols - frameCols) / 2);
    // const startCol = (cols - frameCols) / 2;
    const clear = this.grid.filter(d =>
      d.c >= startCol &&
      d.c < (cols - startCol) &&
      d.r >= startRow &&
      d.r < (startRow + frameRows)
    );
    clear.forEach(d => {
      d.cl = 'hidden';
    });

    // this.hideSubset();

    this.undrawGrid(clear);


// symmetrical around x axis
    this.showStyle = {
      width: (frameCols * fontWidth) + 'px',
      height: (frameRows * fontSize) + 'px',
      left: ((cols - frameCols) / 2) * fontWidth + 'px',
      top: (startRow * fontSize) + 'px',
      opacity: 1,
      // transition: 'opacity 5s',
      // zIndex: 2
    };




// add text to grid baced on project info
    const posX = startCol / cols;
    const posY = (startRow + frameRows) / rows;
    const fill = '#0089FF';
    const adjC = 5;
    const queue = [name, date, tech].map((d, i) => (
      { str: d, posX, posY, fill, cl: 'info', adjC, adjR: (i + 1), action: true }
    ))
    queue.forEach(d => {
      const grid = this.populateGrid(d)
      this.undrawGrid(grid);
      this.drawGrid(grid);
    });



    this.setState(prevState => ({ iframe: focus, url }));

// 2 line margin above iframe
// 1 line margin below iframe
// 4 lines info
    // name
    // date
    // tech
    // github
// 2 line margin below info
// 1 lone for overflow

// iframe height = rows - 10



  }




  // hideGrid(cels) {
  //   cels.forEach(d => {
  //     d3.select(`#${d.id}`)
  //       // .attr('class', 'hidden')
  //       .transition()
  //         .delay(d.delay / 1.5)
  //         .attr('opacity', 0)
  //   });
  // };


  // showGrid(cels) {
  //   // setTimeout(() => this.setState(prevState => ({ showProject: false, hidden: undefined })), 1000)
  //   // this.setState(prevState => ({ showProject: false, hidden: undefined }));
  //   cels.forEach(d => {
  //     d3.select(`#${d.id}`)
  //       .attr('class', d.cl)
  //       .transition()
  //         .delay(d.delay / 1.5)
  //         .attr('opacity', d.cl ? 1 : .5);
  //   });
  // };



// makeIframe(url, tag) {
//   if (url)
//     return <iframe ref="iframe" allow="camera;microphone" src={url} title="display" />
//   else return null;
// }



  render() {
    const { iframe, url } = this.state;
    const { showStyle } = this;
    return (
      <div className="App">
        <div className="main">
          <svg ref="svg" onMouseOver={this.handleHover} onClick={this.handleClick} />

          <div className="iframe-container" style={iframe ? showStyle : null}>
            {iframe &&
              <iframe className={iframe} ref="iframe" allow="camera;microphone" src={url} title="display" scrolling="no" />
            }
          </div>

        </div>
      </div>
    );
  };
};


          // <button onClick={() => this.showIframe('sleepy')}>show</button>
          // <button onClick={() => this.hideIframe()}>hide</button>




            // {iframe && <iframe ref="iframe" src={iframe} allow="camera;microphone" title="display" />}


          // <Project focus={showProject} frame={frame} hide={() => this.showGrid(hidden)} />
