import React from 'react';

export default class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {num: 0};
  }

  focusInputRef = () => {
    let {num} = this.state;
    this.inputRef.current.focus();
    this.inputRef.current.value = `have focused ${num + 1} times`;
    this.setState({num: num + 1});
  };

  render() {
    return (
      <React.Fragment>
        <p>1. 使用 React.createRef() 方法</p>
        <input type="text" ref={this.inputRef} />
        <button onClick={this.focusInputRef}>focus input</button>
        <FunEle />
        <CallRefs />
        <ParenttoChild />
      </React.Fragment>
    );
  }
}

const FunEle = () => {
  let inputRef = React.createRef();
  function handleClick() {
    inputRef.current.focus();
    inputRef.current.value = `have focused`;
  }
  return (
    <React.Fragment>
      <p>2. 纯函数组件内部也可以使用 Refs</p>
      <input type="text" ref={inputRef} />
      <button onClick={handleClick}>focus input</button>
    </React.Fragment>
  );
};

class CallRefs extends React.Component {
  handleClick = () => {
    this.domRef.focus();
    this.domRef.value = 'have focused';
  };

  render() {
    const des = `3. 回调写法：ref={e => this.domRef = e}`;
    return (
      <React.Fragment>
        <p>{des}</p>
        <input type="text" ref={e => (this.domRef = e)} />
        <button onClick={this.handleClick}>focus input</button>
      </React.Fragment>
    );
  }
}

class ParenttoChild extends React.Component {
  handleClick = () => {
    this.inputEle.focus();
    this.inputEle.value = 'have focused';
  };

  render() {
    return (
      <div>
        <p>4. 通过层层传递 refs 可以调用子代 dom</p>
        <button onClick={this.handleClick}>focus child input</button>
        <Child inputRef={e => (this.inputEle = e)} />
      </div>
    );
  }
}

const Child = ({inputRef}) => {
  const child = {
    width: '100px',
    height: '100px',
    margin: '10px auto',
    border: '1px solid black',
  };
  return (
    <div style={child}>
      <input type="text" size="8" ref={inputRef} style={{marginTop: '25px'}} />
    </div>
  );
};
