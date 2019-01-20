import React, { PureComponent } from 'react';
import * as d3 from 'd3';

export default class Project extends PureComponent {
  constructor(props) {
    super(props);
    // this.state = {
    // };
    this.urls = {
      drive: 'http://kozak.digital/_drivebeta/',
      sleepy: 'https://sleepy-kozak.herokuapp.com/',
      adex: 'https://kozak-adex.surge.sh/'
    };
  };

  componentDidMount() {

  }

  render() {
    const { proj, frame } = this.props;
    const { urls } = this;
    return (
      <div className="project" style={proj ? frame : {opacity: 0}}>
        <iframe className="iframe" allow="camera;microphone" title="player" src={urls[proj]} />
        {proj && <React.Fragment>
          <button className="iframe-link" onClick={() => window.location = urls[proj]}>&rarr;</button>
          <button className="iframe-exit" onClick={this.props.hide}>X</button>
        </React.Fragment>}
      </div>
    );
  };
};
