<!-- TOC -->

- [小知识点](#小知识点)
- [组件生命周期](#组件生命周期)
  - [Mouting](#mouting)
  - [Updating](#updating)
  - [Unmounting](#unmounting)
  - [Error Handling](#error-handling)
  - [Other](#other)
- [HOC 与 Render Props](#hoc-与-render-props)
  - [高阶组件](#高阶组件)
  - [Render Props](#render-props)
- [事件处理](#事件处理)
  - [事件处理函数的要求](#事件处理函数的要求)
  - [事件处理程序传参](#事件处理程序传参)
- [函数定义组件](#函数定义组件)
- [表单元素](#表单元素)
  - [受控组件](#受控组件)
  - [非受控组件](#非受控组件)
- [Refs 与 DOM](#refs-与-dom)
- [Context](#context)
- [代码分割](#代码分割)
- [性能优化](#性能优化)

<!-- /TOC -->

## 小知识点

1.  推荐在 JSX 代码的外面扩上一个小括号，这样可以防止分号自动插入的 bug。

1.  html 属性名有两个修改：`class` 改为 `className`， `for` 改为 `htmlFor`。

1.  没有给属性传值，它默认为 true，但不推荐这么做。

1.  几个组件需要共用状态数据时，最好将这部分共享的状态提升至他们最近的父组件当中进行管理。

1.  用 `{judgement && expression}` 写当判断为真时执行的表达式语句。

1.  用 `{condition ? trueExpression : falseExpression}` 写三目判断。

1.  希望隐藏组件时，可在 `render` 中返回 `null`。

1.  列表渲染时，使用数组的 `map` 方法，切记添加 `key` 属性，并且元素的 `key` 只有在它和它的兄弟节点对比时才有意义。

1.  React 基于两点假设，实现了一个启发的 O(n)算法：两个不同类型的元素将产生不同的树；通过渲染器附带 key 属性，开发者可以示意哪些子元素可能是稳定的。

1.  可以使用点表示法表示子组件，如 `<MyComponents.DatePicker color="blue" />`。但不可以使用表达式作为组件标签， ~~`<components[props.storyType] />`~~，引入一个开头大写的中间变量就可以解决。

1.  使用组合而不是继承来复用组件之间的代码。若需要渲染子组件，可以直接使用 `{props.children}` ，也可以使用约定的属性如 `{props.left}` `{props.right}`。

1.  `props.children(args)` 可以传递任何数据，例如使用自定义组件，则可以调用 `props.children` 来获得传递的子代。

    <details>

    <summary>示例</summary>

    ```jsx
    function Repeat(props) {
      let items = [];
      for (let i = 0; i < props.numTimes; i++) {
        items.push(props.children(i));
      }
      return <div>{items}</div>;
    }

    function ListOfTenThings() {
      return (
        <Repeat numTimes={10}>
          {index => <div key={index}>This is item {index} in the list</div>}
        </Repeat>
      );
    }
    ```

    </details>

1.  `setState()` 更新是异步的，React 可以将多个 `setState()` 调用合并成一个来提高性能。并且在调用 `setState()` 时，React 将你提供的对象合并到当前状态，其他 `state` 完整保留。

1.  使用 `<React.Fragment />` 渲染多个并列的 html 标签。主要用在如 `<tr>` 下返回多个 `<td>` 这种情况。

1.  使用 `ReactDOM.createPortal(child, container)` 可以跳出父系渲染节点。主要用于弹出提示框之类的。

1.  使用生命周期的方法 `componentDidCatch(error, info)` 捕获错误，捕获其子组件树 JavaScript 异常，可用来记录错误并展示一个回退的 UI 的 React 组件。但是不能捕获：事件处理、异步代码、服务端渲染以及自身抛出的错误。

1.  `<React.StrictMode>` 有助于：识别具有不安全生命周期的组件、有关旧式字符串 ref 用法的警告、检测意外的副作用。

1.  creact-react-app 默认不开启 `css module`。 `css module` 的使用和 `antd` 有冲突。

1.  16.3 新增内容

    1.  开始使用 context api。

    1.  Forwarding Refs

## 组件生命周期

> [交互式演示](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

1.  注意当在 `ComponentWillUpdate` 里 setState 就会无限循环，直到死循环。

### Mouting

1.  `constructor(props)`
1.  `static getDerivedStateFromProps(nextProps, prevState)`
1.  ~~`UNSAFE_componentWillMount()`~~
1.  `render()`
1.  `componentDidMount()` 此处进行异步请求

### Updating

1.  ~~`UNSAFE_componentWillReceiveProps()`~~
1.  `static getDerivedStateFromProps(nextProps, prevState)`
1.  `shouldComponentUpdate(nextProps, nextState)`
1.  ~~`UNSAFE_componentWillUpdate()`~~
1.  `render()`
1.  `getSnapshotBeforeUpdate(prevProps, prevState)`
1.  `componentDidUpdate(prevProps, prevState, snapshot)`

### Unmounting

1.  `componentWillUnmount()`

### Error Handling

1.  `componentDidCatch(error, info)`

### Other

1.  `setState(updater[, callback])`
    1.  `setState((prevState, props) => stateChange)`
    1.  `setState(stateChange)`
1.  `forceUpdate()`
1.  `defaultProps`
1.  `displayName`

## HOC 与 Render Props

### 高阶组件

> 本质是接受一个组件作为参数，返回一个新的组件。

<details>

<summary>示例</summary>

```jsx
const HOCFactory = (WrappedComponent option) => {
  return class HOC extends React.Component {
    render() {
      // 过滤掉与高阶函数功能相关的props属性，不再传递
      const {extraProp, ...passThroughProps} = this.props;

      // 向包裹组件注入props属性，一般都是高阶组件的state状态或实例方法
      const injectedProp = someStateOrInstanceMethod;

      // 向包裹组件传递props属性
      return(
        <WrappedComponent
        injectedProp={injectedProp}
        {...passThroughProps} />
      )
    }
  }
}
```

</details>

1.  在组件定义外使用高阶组件，不能在组件的 `render` 函数中调用高阶函数。

1.  使用高阶组件包装组件时，原始组件被容器组件包裹，也就意味着新组件会丢失原始组件的所有静态方法。解决这个问题的方法就是，将原始组件的所有静态方法全部拷贝给新组件。

1.  高阶组件可以传递所有的 props 属性给包裹的组件，但是不能传递 refs 引用。16.3 提供一个名为 `React.forwardRef()` 的 API 来解决这一问题。

### Render Props

1.  `Render Props` 其实和高阶组件 HOC 一样，是为了给纯函数组件加上 state，响应 react 的生命周期。核心思想是：通过一个函数将 class 组件的 state 作为 props 传递给纯函数组件。

1.  相比 HOC 构建模型是动态的，所有改变都在 render 中触发，能更好的利用 react 的生命周期。

<details>

<summary>示例</summary>

```jsx
class Mouse extends React.Component {

   render() {
    return (
       <div>
        {this.props.render(this.state)}
      </div>
    )
}

function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => <Component {...this.props} mouse={mouse} />} />
      );
    }
  };
}
```

</details>

## 事件处理

### 事件处理函数的要求

1.  记得在 `constructor` 里绑定 `this`

1.  或者使用属性初始化器来正确的绑定回调函数

    `handleClick = () => { console.log('this is:', this); }`

1.  不太推荐的方式：回调函数中使用箭头函数，导致重新渲染。

    `<button onClick={ e => this.handleClick(e) }>`

    `<button onClick={ this.handleClick.bind(this) }>`

### 事件处理程序传参

1.  使用 `bind` 绑定 `this`，同时传参；并且监听函数参数 `e` 要在最后。

    `<button onClick={ this.deleteRow.bind(this, id) }>`，

1.  使用箭头函数传参。

    `<button onClick={ e => this.deleteRow(id, e) }>`

## 函数定义组件

> 也称为无状态组件，使用解构赋值直接传参，无实例无 this。

只有 `render` 方法的组件，可以改写成为**函数定义组件**， 这样不用写 `this.props`，直接使用 `props` 即可。

事件处理函数不像 `class` 里的实例不绑定处理函数的 `this`，也可以简化改写为 `props` 的属性。

<details>

<summary>示例</summary>

```jsx
// before
class Square extends React.Component {
  render() {
    return (
      <button onClick={() => this.props.handleClick()}>
        {this.props.value}
      </button>
    );
  }
}

// after
function Square(props) {
  return <button onClick={props.handleClick}>{props.value}</button>;
}

// or
const Square = props => (
  <button onClick={props.handleClick}>{props.value}</button>
);

// or 直接将解构赋值放在参数部分
const Square = ({handleClick, value}) => (
  <button onClick={handleClick}>{value}</button>
);
```

</details>

## 表单元素

表单元素如 `<input>` `<textarea>` `<select>` 可以使用受控组件，也可以使用非受控组件。

### 受控组件

<details>

<summary>示例</summary>

```jsx
class input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bing(this);
  }

  handleChange(e) {
    this.setState({value: e.target.value});
  }

  render() {
    return <input value={this.state.value} onChange={this.handleChange} />;
  }
}
```

</details>

### 非受控组件

> 使用 Refs 取得 DOM 引用

<details>

<summary>示例</summary>

```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    // 直接原生的 dom 操作
    event.preventDefault();
    alert('A name was submitted: ' + this.inputRef.value);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input defaultValue="Leo" ref={e => (this.inputRef = e)} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

// <input type="file" /> 始终是一个非受控组件
class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    alert(`Selected file - ${this.fileInput.files[0].name}`);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Upload file:
          <input type="file" ref={e => (this.fileInput = e)} />
        </label>
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

</details>

## Refs 与 DOM

> 16.3 开始使用 `React.createRef()` API

1.  Refs 使用场合：处理焦点、文本选择或媒体控制；触发强制动画；集成第三方 DOM 库等。

1.  Refs 类型：用于普通的 HTML 元素时，接收底层 DOM 元素作为它的 `current` 属性以创建 ref；用于一个自定义类组件时，将接收被插入组件的实例作为它的 `current` 。

1.  不能在函数式组件上使用 ref 属性,因为它们没有实例。但是函数式组件内部可以使用 ref，只要它指向一个 DOM 元素或者 class 组件。

1.  ref 回调会在 `componentDidMount` 或 `componentDidUpdate` 这些生命周期回调之前执行。

1.  对父组件暴露 DOM 节点：`React.forwardRef()` 方法。

<details>

<summary>示例</summary>

```jsx
// 使用 React.createRef() 创建 refs，通过 ref 属性来获得 React 元素。
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.focutInpout = this.focutInpout.bind(this);
  }

  focutInpout() {
    // 访问 Refs   取 current属性
    const node = this.inputRef.current;
    node.focus();
  }

  render() {
    return (
      <div>
        {/* 自定义组件也可以 CustomTextInput */}
        <input ref={this.inputRef} />
        <button onClick={this.focutInpout} />
      </div>
    );
  }
}

// 函数式组件内部可以使用 ref，只要它指向一个 DOM 元素或者 class 组件
function CustomTextInput(props) {
  // 这里必须声明 textInput，这样 ref 回调才可以引用它
  let textInput = React.creactRef();

  function handleClick() {
    textInput.current.focus()
  }

  return(
    <div>
      <input ref={textInput} />
      <button onClick={handleClick} />
    </div>
  )
}

// Callback Refs
class CustomTextInput extends React.Component {
  focusTextInput = () => {
    this.inputRef.focus()
  }
  render(){
    return(
      <input ref={e=>this.inputRef=e} />
      <button onClick={this.focusTextInput } />

      // 可以往子代回调
      <CustomTextInput inputRef={e=>this.inputRef=e} />
    )
  }
}
// 可以往子代回调
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}
```

</details>

## Context

用 `React.createContext()` 构建组件树全局上下文 Context，用在比如：当前认证的用户、主题或首选语言等情况。

生命周期中使用 Context，最好直接作为 props 的属性来使用。

一些常用的上下文可以使用高阶组件封装。

<details>

<summary>示例</summary>

```jsx
const ThemeContext = React.createContext(themes.light);

export function withTheme(Component){
  return function ThemedComponent(props){
    return(
      <ThemeContext.Consumer>
      {theme => <Component {...props} theme={theme}/>}
      </ThemeContext.Consumer>
    )
}

function Button({theme, ...rest}) {
  return <button className={theme} {...rest} />;
}
const ThemedButton = withTheme(Button);
```

</details>

一个中间件可以使用多个上下文。

<details>

<summary>示例</summary>

```jsx
// 主题上下文, 默认light
const ThemeContext = React.createContext('light');

// 登陆用户上下文
const UserContext = React.createContext();

// 一个依赖于两个上下文的中间组件
function Toolbar(props) {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <UserContext.Consumer>
          {user => <ProfilePage user={user} theme={theme} />}
        </UserContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
}

class App extends React.Component {
  render() {
    const {signedInUser, theme} = this.props;

    // App组件提供上下文的初始值
    return (
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={signedInUser}>
          <Toolbar />
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
  }
}
```

</details>

## 代码分割

1.  使用 `import()` 语法动态的加载需要的内容。

1.  结合使用 `React Router` and `React Loadable` 更方便懒加载不需要的内容。

<details>

<summary>eg: React Router and React Loadable</summary>

```jsx
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Loadable from 'react-loadable';

const Loading = () => <div>Loading...</div>;

const Home = Loadable({
  loader: () => import('./routes/Home'),
  loading: Loading,
});
const About = Loadable({
  loader: () => import('./routes/About'),
  loading: Loading,
});

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
    </Switch>
  </Router>
);
```

</details>

## 性能优化

1.  setState 的调用是异步的，没有导致 state 的值发生变化的 setState 也会导致重渲染。

1.  `render` 里，事件处理函数最好不要使用 `bind`，会导致每次 `render` 都渲染新的函数。应该在 constructor 里绑定 this。

1.  若事件处理函数要传参，可以使用 `data-attr`。

    ```jsx
    handleClick(e) {
      this.setState({
        justClicked: e.target.dataset.letter
      })
    }

    <li data-letter={letter} onClick={this.handleClick}>{letter}</li>
    ```

1.  使用节流函数 `throttle` 避免在给定时间内被多次调用，每个等待时间只执行一次。使用防抖函数 `debounce` 丢弃在给定时间内重复性的函数调用，只执行等待时间里最后一次函数调用。

    ```jsx
    import throttle from 'lodash.throttle';
    import debounce from 'lodash.debounce';

    class ThrottleComponent extends React.Component {
      constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleClickThrottled = throttle(this.handleClick, 1000);

        this.handleChange = this.handleChange.bind(this);
        this.emitChangeDebounced = debounce(this.emitChange, 250);
      }

      componentWillUnmount() {
        this.handleClickThrottled.cancel();
        this.emitChangeDebounced.cancel();
      }

      render() {
        return (
          <>
            <button onClick={this.handleClickThrottled}>Load More</button>
            <input onChange={this.handleChange} />
          </>
        );
      }

      handleClick() {
        this.props.loadMore();
      }

      handleChange(e) {
        this.emitChangeDebounced(e.target.value);
      }

      emitChange(value) {
        this.props.onChange(value);
      }
    }
    ```

1.  使用 `shouldComponentUpdate(nextProps, nextState){}` 自定义不需要 rerender 的组件。

1.  使用 `React.PureComponent` 做浅比较（比较所有 props 和 state ），但是有坑：浅比较是比较指针的异同。比如使用数组时，`arr.push(newItem)` or `arr.splice(0,1)` 直接在原对象修改，不会改变指针，PureComponent 认为对象没有改动，导致错误。

1.  使用如 `options={this.props.options || []}` 初始化时，当未定义时会创建新的数组，要改成 `options={this.props.options || default}`。

1.  数据更新：尽量保证原数据不突变。多使用 `[...arr, newItem]` or `{...obj, [key]:newValue}`方式改动数据。

    <details>

    <summary>示例</summary>

    ```jsx
    // 数组添加
    const arr = [...arr, newItem];

    // 数组修改
    const arr = this.state.arr.slice();
    arr[i] = 'xxx';
    this.setState({arr: arr});

    // 对象添加
    const obj = {...obj, [key]: newValue};

    // 对象修改
    const state = {
      houses: {
        gryffindor: {points: 15},
        ravenclaw: {points: 18},
      },
    };

    const key = 'ravenclaw';
    newState = {
      ...state,
      houses: {
        ...state.houses,
        [key]: {
          ...state.houses[key],
          points: state.houses[key].points + 3,
        },
      },
    };
    ```

    </details>
