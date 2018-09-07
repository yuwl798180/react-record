import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {error: null, errorInfo: null};
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{whiteSpace: 'pre-wrap'}}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

class BuggyCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {counter: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(({counter}) => ({
      counter: counter + 1,
    }));
  }

  render() {
    if (this.state.counter === 5) {
      // Simulate a JS error
      throw new Error('I crashed!');
    }
    return <h1 onClick={this.handleClick}>{this.state.counter}</h1>;
  }
}

export default () => (
  <div>
    <p>点击数字，增加数值</p>
    <p>当增加到5时，会模拟错误。</p>
    <hr />
    <ErrorBoundary>
      <p>
        以下2个累加器在同一个错误边界下，其中一个出错，两者一起返回错误信息。
      </p>
      <BuggyCounter />
      <BuggyCounter />
    </ErrorBoundary>
    <hr />
    <p>
      以下2个累加器不在同一个错误边界下，其中一个出错，不影响另一个累加器工作。
    </p>
    <ErrorBoundary>
      <BuggyCounter />
    </ErrorBoundary>
    <ErrorBoundary>
      <BuggyCounter />
    </ErrorBoundary>
  </div>
);
