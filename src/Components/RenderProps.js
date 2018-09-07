import React from 'react';

class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <div>
        <div
          style={{
            background: '#ccc',
            margin: '0 auto',
            border: '1px solid',
            width: '100%',
            height: '100px',
          }}
        />
        <h1>Move the mouse around!</h1>
        <p>
          The current mouse position is ({mouse.x}, {mouse.y})
        </p>
      </div>
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = {x: 0, y: 0};
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  }

  render() {
    return (
      <div style={{height: '100%'}} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

export default class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.renderTheCat = this.renderTheCat.bind(this);
  }

  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
