// @flow
import test from 'tape';
import {check, gen} from 'tape-check';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

type Action = {
  type: string,
  payload?: any,
};

const inc = {type: 'INCREMENT'};
const dec = {type: 'DECREMENT'};
const reset = {type: 'RESET'};

function asyncDec(dispatch) {
  return new Promise(resolve => setTimeout(() => resolve(dispatch(dec)), 200));
}

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

const configureStore = () => createStore(reducer, applyMiddleware(thunk));

const genActions = gen.oneOf([inc]);

test(
  'Value never smaller than 0',
  check(gen.array(genActions), (t, actions) => {
    console.log(actions);
    const store = configureStore();
    const dispatchedActions = actions.map(action => store.dispatch(action));
    Promise.all(dispatchedActions).then(() => {
      t.true(store.getState().value > 0);
      t.end();
    });
  }),
);
