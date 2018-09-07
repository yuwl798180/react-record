import React from 'react';

export default class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isLoginIn: false};
  }

  handleLoginClick = () => this.setState({isLoginIn: true});
  handleLogoutClick = () => this.setState({isLoginIn: false});

  render() {
    const isLoginIn = this.state.isLoginIn;
    let button = null;
    if (isLoginIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoginIn={isLoginIn} />
        {button}
      </div>
    );
  }
}

const Greeting = props => (
  <p>{props.isLoginIn ? 'Welcome back!' : 'Please sign up.'}</p>
);
const LoginButton = props => <button onClick={props.onClick}>Login</button>;
const LogoutButton = props => <button onClick={props.onClick}>Logout</button>;
