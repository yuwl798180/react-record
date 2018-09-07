import React from 'react';
import ReactDOM from 'react-dom';
import './CreatePortal.css';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // 让 modal 挂载在任何想挂在的地方
    document.body.appendChild(this.el);
  }
  componentWillUnmount() {
    document.body.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

export default class Portal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showModal: false};
    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);
  }

  handleShow() {
    this.setState({showModal: true});
  }
  handleHide() {
    this.setState({showModal: false});
  }

  render() {
    const {showModal} = this.state;
    const modal = showModal ? (
      <Modal>
        <div className="modal">
          <button onClick={this.handleHide}>点击隐藏 modal </button>
        </div>
      </Modal>
    ) : null;

    return (
      <div>
        <p>Modal has overflow: {showModal ? 'show' : 'hidden'}.</p>
        <button onClick={this.handleShow}>Show modal</button>
        {modal}
      </div>
    );
  }
}
