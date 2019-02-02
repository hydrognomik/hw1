import store from './index';

import { qs } from '../utils';
import { HOME_PAGE, OBSERVE_PAGE } from './constants';
import { IState } from './reducer/reducer';

declare const Templates: any;

const render = () => {
  const { events, page } = store.getState() as IState;
  let context;

  switch (page) {
    case HOME_PAGE:
      context = { events, title: 'Лента событий' };
      break;
    case OBSERVE_PAGE:
      context = { title: 'Видеонаблюдение' };
      break;
    default:
      context = '<h1>Page not found</h1>';
  }

  qs('#root').innerHTML = page && Templates[page](context);

  // Адовый костыль для загрузки скриптов страниц ¯\_(ツ)_/¯
  const script = document.createElement('script');

  script.src = page ? `${page.toLowerCase()}.bundle.js` : '';
  qs('#root').appendChild(script);
};

export default render;
