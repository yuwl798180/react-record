import React from 'react';

export default class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {seconds: 0};
  }

  tick() {
    this.setState(prevState => ({
      seconds: prevState.seconds + 1,
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const seconds = this.state.seconds;
    return <span>页面停留时间：{seconds} 秒</span>;
  }
}
