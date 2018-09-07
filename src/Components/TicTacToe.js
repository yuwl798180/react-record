import React from 'react';
import PropTypes from 'prop-types';
import './TicTacToe.css';

const Square = props => {
  const bc = props.highlight ? 'red' : 'black';
  const fw = props.highlight ? 'bold' : 'normal';
  return (
    <button
      className="square"
      style={{color: bc, fontWeight: fw}}
      onClick={props.onClick}>
      {props.value}
    </button>
  );
};

Square.PropTypes = {
  value: PropTypes.tring,
  onClick: PropTypes.func,
  highlight: PropTypes.bool,
};

class Board extends React.Component {
  renderSquare(i) {
    const {squares, onClick, winnerLine} = this.props;
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={onClick.bind(this, i)}
        highlight={winnerLine.includes(i)}
      />
    );
  }

  render() {
    const rows = [];
    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = 3 * i; j < 3 * i + 3; j++) {
        row.push(this.renderSquare(j));
      }
      rows.push(<div key={i}>{row}</div>);
    }
    return <div>{rows}</div>;
  }
}

Board.PropTypes = {
  squares: PropTypes.arrayOf(PropTypes.number),
  onClick: PropTypes.func.isRequired,
  winnerLine: PropTypes.arrayOf(PropTypes.number),
};

export default class TicTacToe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          lastStep: 'Game Start',
        },
      ],
      xIsNext: true,
      stepNumber: 0,
      isReverse: false,
    };
  }

  handleClick = e => {
    const {history, stepNumber, xIsNext} = this.state;
    const current = history[stepNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[e]) {
      return;
    }

    squares[e] = xIsNext ? 'X' : 'O';
    const location = `(${Math.floor(e / 3) + 1}, ${e % 3 + 1})`;
    const desc = squares[e] + ' move to ' + location;
    const newHistory = {
      squares: squares,
      lastStep: desc,
    };
    this.setState({
      history: [...history, newHistory],
      xIsNext: !xIsNext,
      stepNumber: history.length,
    });
  };

  jumpTo(move) {
    this.setState({
      stepNumber: move,
      xIsNext: move % 2 ? false : true,
    });
  }

  toggleSort = () => {
    this.setState({
      isReverse: !this.state.isReverse,
    });
  };

  render() {
    let {history, xIsNext, stepNumber, isReverse} = this.state;
    const current = history[stepNumber];
    const {winner, winnerLine} = calculateWinner(current.squares);
    const status = winner
      ? `Winner: ${winner}`
      : `next player: ${xIsNext ? 'X' : 'O'}`;
    isReverse && (history = history.slice().reverse());
    const moves = history.map((step, move) => {
      const fw = stepNumber === move ? 'bold' : 'normal';
      return (
        <li key={move}>
          <button onClick={this.jumpTo.bind(this, move)}>
            <span style={{fontWeight: fw}}> {step.lastStep}</span>
          </button>
        </li>
      );
    });

    return (
      <div className="game">
        <Board
          squares={current.squares}
          onClick={this.handleClick}
          winnerLine={winnerLine}
        />
        <div>
          <div>{status}</div>
          <button onClick={this.toggleSort}>Reverse</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], winnerLine: [a, b, c]};
    }
  }
  return {winner: null, winnerLine: []};
}
