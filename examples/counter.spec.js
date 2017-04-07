// @flow
import test from 'ava';
import {check, gen} from 'ava-testcheck';

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

const genActions = gen.oneOf([inc, dec, reset]);

test(
  'Value never smaller than 0',
  check(gen.array(genActions), (t, actions) => {
    const state = actions.reduce(reducer, initialState);
    t.true(state.value >= 0);
  }),
);
