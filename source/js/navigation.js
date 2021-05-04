'use strict';

(function () {
  var HIDDEN = 'visually-hidden';
  var SUBMENU = '.catalog-list__submenu';
  var catalog = document.querySelector('.site-list__item--catalog a');
  var catalogList = document.querySelector('.catalog-list');
  catalogList.classList.add(HIDDEN);
  var onCatalogListClick = function (evt) {
    evt.preventDefault();
    var target = evt.target;
    var targetParent = target.parentNode;
    var findProducts = function () {
      for (var i = 0; i < window.data.length; i++) {
        if (target.className.indexOf(window.data[i].type) !== -1) {
          return window.data[i];
        }
      }
    };
    var currentSubmenu = targetParent.querySelector(SUBMENU);
    if (currentSubmenu) {
      window.submenu.remove(currentSubmenu);
    } else {
      var products = findProducts();
      if(products) {
        console.log(window.submenu)
        window.submenu.render(targetParent, products)
      }
    }
  };
  var removeListeners = function () {
    catalogList.removeEventListener('click', onCatalogListClick);
  };
  var addListeners = function () {
    catalogList.addEventListener('click', onCatalogListClick);
  };
  var isCatalogHidden = function () {
    return catalogList.classList.contains(HIDDEN);
  };
  var removeCatalogList = function () {
    document.querySelectorAll(SUBMENU).forEach(window.submenu.remove);
  };
  var toggleEventListener = function () {
    isCatalogHidden() ? removeListeners() : addListeners();
  };
  catalog.addEventListener('click', function (evt) {
    evt.preventDefault();
    catalogList.classList.toggle(HIDDEN);
    toggleEventListener();
    if (isCatalogHidden()) {
      removeCatalogList();
    }
  });
})();
