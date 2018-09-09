import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';

// actions
const ADD_NUMBER = {
  type: 'ADD_NUMBER',
};

const MINUS_NUMBER = {
  type: 'MINUS_NUMBER',
};

// reducers
const counter = (state = {count: 0}, action) => {
  const count = state.count;

  switch (action.type) {
    case 'ADD_NUMBER':
      return {count: count + 1};
    case 'MINUS_NUMBER':
      return {count: count - 1};
    default:
      return state;
  }
};

// conponent
const Counter = ({value, handleAdd, handleMinus}) => (
  <div>
    <span>{value}</span>
    <button onClick={handleAdd}>add</button>
    <button onClick={handleMinus}>minus</button>
  </div>
);

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleMinus: PropTypes.func.isRequired,
};

// container
const mapStateToProps = (state, ownProps) => ({
  value: state.count,
});

const mapDisPatchToProps = (dispatch, ownProps) => ({
  handleAdd: () => dispatch(ADD_NUMBER),
  handleMinus: () => dispatch(MINUS_NUMBER),
});

const CounterWithRedux = connect(
  mapStateToProps,
  mapDisPatchToProps
)(Counter);

// entry App
const App = () => (
  <React.Fragment>
    <CounterWithRedux />
  </React.Fragment>
);

const store = createStore(counter);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
