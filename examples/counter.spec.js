import test from 'ava';
import {jsc, check} from '../ava-verify';
import {inspect} from 'util';

type Action = {
  type: string,
  payload?: any,
};

const inc = {type: 'INCREMENT'};
const dec = {type: 'DECREMENT'};
const reset = {type: 'RESET'};

type State = {
  value: number,
};

const initialState = {
  value: 0,
};

const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case 'INCREMENT': {
      return {...state, value: state.value + 1};
    }
    case 'DECREMENT': {
      return {...state, value: state.value - 1};
    }
    case 'RESET': {
      return initialState;
    }
    default:
      return state;
  }
};

const genActions = jsc.oneof([
  jsc.constant(inc),
  jsc.constant(dec),
  // jsc.constant(reset)
]);

test(
  'Value should never be smaller than 0',
  check(jsc.sequence(genActions), (t, actions) => {
    const state = actions.reduce(reducer, initialState);
    t.true(state.value >= -5);
  }, {size: 200})
);

test(
  'Value should never be greater than 50',
  check(jsc.sequence(genActions), (t, actions) => {
    const state = actions.reduce(reducer, initialState);
    t.true(state.value <= 50);
  }, {size: 200})
);
