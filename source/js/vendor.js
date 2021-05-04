(function() {
  var support = ("content" in document.createElement("template"));

  // Set the content property if missing
  if (!support) {
    var
      /**
       * Prefer an array to a NodeList
       * Otherwise, updating the content property of a node
       * will update the NodeList and we'll loose the nested <template>
       */
      templates = Array.prototype.slice.call(document.getElementsByTagName("template")),
      template, content, fragment, node, i = 0, j;

    // For each <template> element get its content and wrap it in a document fragment
    while ((template = templates[i++])) {
      content  = template.children;
      fragment = document.createDocumentFragment();

      for (j = 0; node = content[j]; j++) {
        fragment.appendChild(node);
      }

      template.content = fragment;
    }
  }

  // Prepare a clone function to allow nested <template> elements
  function clone() {
    var
      templates = this.querySelectorAll("template"),
      fragments = [],
      template,
      i = 0;

    // If the support is OK simply clone and return
    if (support) {
      template  = this.cloneNode(true);
      templates = template.content.querySelectorAll("template");

      // Set the clone method for each nested <template> element
      for (; templates[i]; i++) {
        templates[i].clone = clone;
      }

      return template;
    }

    // Loop through nested <template> to retrieve the content property
    for (; templates[i]; i++) {
      fragments.push(templates[i].content);
    }

    // Now, clone the document fragment
    template = this.cloneNode(true);

    // Makes sure the clone have a "content" and "clone" properties
    template.content = this.content;
    template.clone   = clone;

    /**
     * Retrieve the nested <template> once again
     * Since we just cloned the document fragment,
     * the content's property of the nested <template> might be undefined
     * We have to re-set it using the fragment array we previously got
     */
    templates = template.querySelectorAll("template");

    // Loop to set the content property of each nested template
    for (i = 0; templates[i]; i++) {
      templates[i].content = fragments[i];
      templates[i].clone   = clone; // Makes sure to set the clone method as well
    }

    return template;
  }

  var
    templates = document.querySelectorAll("template"),
    template, i = 0;

  // Pollute the DOM with a "clone" method on each <template> element
  while ((template = templates[i++])) {
    template.clone = clone;
  }
}());

/**
 * ChildNode.append() polyfill
 * https://gomakethings.com/adding-an-element-to-the-end-of-a-set-of-elements-with-vanilla-javascript/
 * @author Chris Ferdinandi
 * @license MIT
 */
(function (elem) {

  // Check if element is a node
  // https://github.com/Financial-Times/polyfill-service
  var isNode = function (object) {

    // DOM, Level2
    if (typeof Node === 'function') {
      return object instanceof Node;
    }

    // Older browsers, check if it looks like a Node instance)
    return object &&
      typeof object === "object" &&
      object.nodeName &&
      object.nodeType >= 1 &&
      object.nodeType <= 12;

  };

  // Add append() method to prototype
  for (var i = 0; i < elem.length; i++) {
    if (!window[elem[i]] || 'append' in window[elem[i]].prototype) continue;
    window[elem[i]].prototype.append = function () {
      var argArr = Array.prototype.slice.call(arguments);
      var docFrag = document.createDocumentFragment();

      for (var n = 0; n < argArr.length; n++) {
        docFrag.appendChild(isNode(argArr[n]) ? argArr[n] : document.createTextNode(String(argArr[n])));
      }

      this.appendChild(docFrag);
    };
  }

})(['Element', 'CharacterData', 'DocumentType']);

(function() {
  var arr = [window.Element, window.CharacterData, window.DocumentType];
  var args = [];

  arr.forEach(function (item) {
    if (item) {
      args.push(item.prototype);
    }
  });

  // from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
  (function (arr) {
    arr.forEach(function (item) {
      if (item.hasOwnProperty('remove')) {
        return;
      }
      Object.defineProperty(item, 'remove', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function remove() {
          this.parentNode.removeChild(this);
        }
      });
    });
  })(args);
})();
