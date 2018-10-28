import store from './index';

import { SET_PAGE } from './constants';

document.querySelectorAll('a[data-page]').forEach((element) => {
  element.addEventListener('click', (event) => {
    event.preventDefault();
    const { page } = event && (event.target as HTMLElement).dataset;

    store.dispatch({ type: SET_PAGE, data: { page } });
  });
});
