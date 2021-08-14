const menu = document.querySelector('.menu');
const menuToggleButton = menu.querySelector('.menu__toggle');

menu.classList.remove('menu--no-js');
menu.classList.add('menu--closed');

menuToggleButton.addEventListener('click', function () {
  menu.classList.toggle('menu--closed')
});
