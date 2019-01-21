import React, { PureComponent } from 'react';
import * as d3 from 'd3';

export default class Project extends PureComponent {
  constructor(props) {
    super(props);
    // this.state = {
    // };
    this.projects = {
      drive: {
        name: 'drive my car',
        date: 'september 2018',
        tech: 'javascript (vanilla), html, css',
        git: 'https://github.com/mpkozak/drive/',
        // url: 'http://kozak.digital/_proj/drive/'
        url: 'http://kozak.digital/_drivebeta/'
      },
      sleepy: {
        name: 'sleepy',
        date: 'october 2018',
        tech: 'react, d3, sql, node, express',
        git: '#',
        url: 'https://sleepy-kozak.herokuapp.com/'
      },
      adex: {
        name: 'αdex',
        date: 'december 2018',
        tech: 'webaudio api, react, d3',
        git: 'https://github.com/mpkozak/a.dex/',
        url: 'http://kozak-adex.surge.sh/'
      },
    };
    // this.redirect = this.redirect.bind(this);
  };

  componentDidMount() {

  }

  render() {
    const { focus, frame, hide } = this.props;
    const { name, date, tech, git, url } = focus ? this.projects[focus] : false;
    // const { name, date, tech, git, url } = this.projects[focus];
    const { urls } = this;
    return (
      <div className="project" style={focus ? frame : {opacity: 0}}>
        <iframe className="iframe" id={focus} allow="camera;microphone" title="player" src={url} />
        {focus && <React.Fragment>
          <button className="iframe-link" onClick={() => window.location = url}>&rarr;</button>
          <button className="iframe-exit" onClick={hide}>X</button>
        </React.Fragment>}
        <h2>{name}</h2>
      </div>
    );
  };
};
