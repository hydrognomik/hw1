import { IReducer } from './reducer/reducer';

export interface IAction {
  type: string;
  data?: any;
}

export interface IStore {
  getState: () => any;
  dispatch: (action: IAction) => void;
  subscribe: (listener: () => void) => void;
}

/**
 * Function that creates store
 * @param reducer function that gets prev state and action and returns new state
 * @returns new state
 */
const createStore = (reducer: IReducer): IStore => {
  let listeners: Array<() => void> = [];
  let state: object;

  const getState = () => state;

  const dispatch = (action: IAction) => {
    state = reducer(state, action);
    listeners.forEach((listener: () => void) => listener());
  };

  const subscribe = (listener: () => void) => {
    listeners.push(listener);

    return () => {
      listeners = listeners.filter((l: () => void) => l !== listener);
    };
  };

  return { getState, dispatch, subscribe };
};

export default createStore;
