import { qs } from '../../utils';

qs('.menu__icon').addEventListener('click', function () {
  qs('.menu').classList.toggle('menu_open');
});
