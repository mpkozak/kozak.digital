import React, { PureComponent } from 'react';
import './AppMobile.css';
import content from './_content.js';

export default class AppMobile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      projects: false,
      skills: false,
      links: false,
      contact: false,
    };
  };

  componentDidMount() {
    Object.assign(this, content);
    this.skills.display.reverse();
    this.projects.display.forEach(d => {
      d.action = this.projects.data[d.action].url;
    });
    this.setState(prevState => ({ isLoaded: true }));
  };

  makeMain() {
    return this.text.filter(d => !d.hover).map(d =>
      <p key={d.str} style={{color: d.fill}}>{d.str}</p>
    );
  };

  makeSub() {
    return this.text.filter(d => d.hover).map(d =>
      <React.Fragment key={d.str}>
        <p style={{color: d.fill}} onClick={() => this.toggleView(d.str)}>{d.str}</p>
        <div className='list'>
          {this.state[d.str] && this.makeList(d.str)}
        </div>
      </React.Fragment>
    );
  };

  makeList(sub) {
    return this[sub].display.map(d => {
      if (!d.action) {
        return <p key={d.str} style={{color: this[sub].fill}}>{d.str}</p>
      };
      return <p key={d.str} style={{color: this[sub].fill}} onClick={() => this.handleClick(d.action)}>{d.str}</p>
    });
  };

  toggleView(key) {
    this.setState(prevState => ({ [key]: !prevState[key] }));
  };

  handleClick(link) {
    window.location = link;
  };


  render() {
    const { isLoaded } = this.state;
    return (
      <div className='App-mobile'>
        {isLoaded &&
          <div className='main'>
            {this.makeMain()}
            <div className='sub'>
              {this.makeSub()}
            </div>
          </div>
        }
      </div>
    );
  };
};
