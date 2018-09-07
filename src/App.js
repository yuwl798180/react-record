import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Timer from './Components/Timer';
import Todo from './Components/Todo';
import ReactMarkdown from './Components/ReactMarkdown';
import ConditionalRendering from './Components/ConditionalRendering';
import StateLifting from './Components/StateLifting';
import ThinkInReact from './Components/ThinkInReact';
import TicTacToe from './Components/TicTacToe';
import Refs from './Components/Refs';
import Context from './Components/Context';
import CreatePortal from './Components/CreatePortal';
import ComponentDidCatch from './Components/ComponentDidCatch';
import PropsChildren from './Components/PropsChildren';
import RenderProps from './Components/RenderProps';


class App extends Component {
  render() {
    // use fieldset surround commponent for beauty
    const filedsetSurround = (component, description) => (
      <fieldset>
        <legend>{description}</legend>
        {component}
      </fieldset>
    );

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
          <Timer />
        </header>
        <section className="Component">
          {filedsetSurround(<Todo />, 'Todo')}
          {filedsetSurround(<ReactMarkdown />, 'Render Markdown')}
          {filedsetSurround(<PropsChildren />, 'props.children(args)')}
          {filedsetSurround(<ConditionalRendering />, 'Conditional Rendering')}
          {filedsetSurround(<ComponentDidCatch />, 'Error Boundary')}
          {filedsetSurround(<RenderProps />, 'Render Props')}
          {filedsetSurround(<StateLifting />, 'Lifting State Up')}
          {filedsetSurround(<Refs />, 'Refs and DOM')}
          {filedsetSurround(<Context />, 'Context API')}
          {filedsetSurround(<CreatePortal />, `ReactDOM.createPortal(child, container)`)}
          {filedsetSurround(<ThinkInReact />, 'Thinking in React')}
          {filedsetSurround(<TicTacToe />, 'Tic Tac Toe')}
        </section>
      </div>
    );
  }
}

export default App;
