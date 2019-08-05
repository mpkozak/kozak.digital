import React, { PureComponent } from 'react';
// import { d3, randomLetter } from './_help.js'
import './App.css';
// import { content, layouts } from './_data.js';




import Grid from './Grid.js'






export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gridStyle: {},
      isResizing: false,
      skills: false,
      projects: false,
      links: false,
      contact: false,
    };
    this.Grid = {};
    this.GridDom = React.createRef();


    this.resizeTimeout = undefined;
    this.handleResize = this.handleResize.bind(this);


    // this.lastMouseEvent = 0;

    // this.handleTouchMove = this.handleTouchMove.bind(this);
    // this.handleMouseMove = this.handleMouseMove.bind(this);
    // this.handleClick = this.handleClick.bind(this);



  };



  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    // if (this.props.isMobile) {
    //   window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    // };
    // this.config();

    this.Grid = new Grid(this.GridDom.current, this.props.isMobile)
    this.Grid.config()
      .then(gridStyle =>
        this.setState({ gridStyle }, () => this.Grid.draw())
      );



  };

  componentDidUpdate() {

  };





























////////////////////////////////////////////////////////////////////////////////
// ** Event Handler Helpers ** //
////////////////////////////////////////////////////////////////////////////////

  helpRedraw() {
    return setTimeout(() => {
      this.setState({ isResizing: false, isClear: false }, () => {
        this.Grid.config()
          .then(gridStyle =>
            this.setState({ gridStyle }, () => this.Grid.draw())
          );
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
    if (cel.action) {
      console.log(cel.action, cel)
    }
    if (this.props.isMobile) {
      this.helpCombinedHover(cel);
    };




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
        this.Grid.undrawGridFull()
          .catch(notDone => this.Grid.eraseGrid())
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
    console.log('render')
    const { gridStyle } = this.state;


    return (
      <div id="App">
        <div id="Main"
          // onMouseMove={this.handleMouseMove}
          // onClick={this.handleClick}
        >
          <div id="Grid" ref={this.GridDom} style={gridStyle} />
        </div>
      </div>
    );
  };
};
