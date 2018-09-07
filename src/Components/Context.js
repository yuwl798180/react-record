import React from 'react';

const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  },
};

const ThemeContext = React.createContext(themes.dark);

class MainSection extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {({theme, toggleTheme}) => (
          <div
            style={{
              backgroundColor: theme.background,
              color: theme.foreground,
              minHeight: '200px',
            }}>
            <button onClick={toggleTheme}>toggle theme</button>
            <h3>Hello World</h3>
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}

class MiddleComponent extends React.Component {
  // 16.3 以前的 api 此处若是 false，子组件也不会刷新，context 不能穿透
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return <MainSection />;
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.toggleTheme = () => {
      this.setState(state => ({
        theme: state.theme === themes.dark ? themes.light : themes.dark,
      }));
    };
    // State 包含了 updater 函数 所以它可以传递给底层的 context Provider
    this.state = {
      theme: themes.light,
      toggleTheme: this.toggleTheme,
    };
  }

  render() {
    return (
      <ThemeContext.Provider value={this.state}>
        <MiddleComponent />
      </ThemeContext.Provider>
    );
  }
}
