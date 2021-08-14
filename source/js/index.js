const page = document.querySelector('html');
const menu = document.querySelector('.menu');
const menuToggleButton = menu.querySelector('.menu__toggle');

page.classList.remove('no-js');
menu.classList.add('menu--closed');

menuToggleButton.addEventListener('click', () => {
  menu.classList.toggle('menu--closed')
});
