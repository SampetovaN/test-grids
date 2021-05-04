'use strict';

(function () {
  var submenu = document.querySelector('#submenu')
    .content
    .querySelector('.catalog-list__submenu');

  var createItem = function (item) {
    var newItem = document.createElement('li');
    newItem.className = 'catalog-list__submenu-link';
    newItem.innerHTML = '<a href="#">' + item + '</a>';
    return newItem;
  };
  var generateItem = function (items) {
    var fragment = document.createDocumentFragment();
    items.forEach(function (item) {
      fragment.appendChild(createItem(item));
    });
    return fragment;
  };
  var createSubmenu = function (product) {
    var submenuClone = submenu.cloneNode(true);
    submenuClone.innerHTML = '';
    submenuClone.appendChild(generateItem(product.clothes));
    return submenuClone;
  };
  var removeElement = function (element) {
    element.remove();
  };
  var renderSubmenu = function (container, products) {
    container.append(createSubmenu(products));
  };
  window.submenu = {
    render: renderSubmenu,
    remove: removeElement
  };
})();
