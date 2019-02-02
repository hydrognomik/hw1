import createStore, { IStore } from './create-store';
import reducer from './reducer/reducer';
import render from './render';

import {
  HOME_PAGE,
  SET_EVENTS,
  SET_PAGE,
} from './constants';

const store: IStore = createStore(reducer);

const init = () => {
  store.subscribe(render);

  const page = window.localStorage.getItem('SH_Page') || HOME_PAGE;

  fetch('http://localhost:8000/api/events/')
    .then((res) => res.json())
    .then(({ events }) => {
      store.dispatch({ type: SET_PAGE, data: { page } });
      store.dispatch({ type: SET_EVENTS, data: { events } });
    })
    .catch((err: Error) => {
      const event = {
        description: err,
        icon: 'stats',
        size: 'm',
        source: 'hub',
        title: 'Ошибка',
        type: 'critical',
      };

      store.dispatch({ type: SET_EVENTS, data: { events: [event] } });
    });
};

window.onload = () => init();

export default store;
