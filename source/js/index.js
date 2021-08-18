const page = document.querySelector('html');
const menu = page.querySelector('.menu');
// const filter = page.querySelector('.filter');
const menuToggleButton = menu.querySelector('.menu__toggle');
// const filterToggleButton = filter.querySelector('.filter__toggle');

page.classList.remove('no-js');
menu.classList.add('menu--closed');
// filter.classList.add('filter--closed');

menuToggleButton.addEventListener('click', () => {
  menu.classList.toggle('menu--closed')
});

// filterToggleButton.addEventListener('click', () => {
//   filter.classList.toggle('filter--closed')
// });
