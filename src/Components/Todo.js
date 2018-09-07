import React from 'react';

export default class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {items: [], text: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({text: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.text.length) {
      return;
    }

    const newItem = {
      text: this.state.text,
      id: Date.now(),
    };

    this.setState(prevState => ({
      items: [...prevState.items, newItem],
      text: '',
    }));
  }

  render() {
    const {items, text} = {...this.state};

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={text}
            onChange={this.handleChange}
            placeholder="please input todo item"
          />
          <button type="submit">Add #{items.length + 1}</button>
        </form>
        <ul style={{listStyle:"none"}}>{items.map(item => <li key={item.id}>{item.text}</li>)}</ul>
      </div>
    );
  }
}
