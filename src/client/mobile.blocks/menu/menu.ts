import { qs } from '../../utils';

qs('.menu__icon').addEventListener('click', () => {
  qs('.menu').classList.toggle('menu_open');
});
