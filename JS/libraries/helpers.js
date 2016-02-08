(function(global) {
  'use strict';

  /**
   * this function help you create and control an animation
   * @param element
   * @param callback(element, index) - when return true stop the animation
   * @param timeout
   * @return global.helper object (for chaining)
   */
  function animate(el, callback, timeout) {
    var time = timeout || 300;

    setTimeout(function t(timeoutEl, i) {
      var ret = callback(timeoutEl, i);
      if(!ret) setTimeout(t, time, timeoutEl, i + 1);
    }, 0, el, 0);

    return global.helper;
  }

  /**
   * this function change the css of an element
   * @param el
   * @param css - string
   * @return global.helper object (for chaining)
   */
  function changeCss(el, css) {
    var prop = dashToCamelcase(css.split(':')[0]);
    var value = css.split(':')[1];

    el.style[prop] = value;

    return global.helper;
  }

  /**
   * this function remove the dash and replace it with upper case
   * @param string (with dashs)
   * @return string (camelcase)
   */
  function dashToCamelcase(string) {
    var words = string.split('-');

    for (var i = 1; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1, words[i].length);
    }

    return words.join('');
  }

  /**
   * this function check if 2 element collide
   * @param element 1
   * @param element 2
   * @return boolean
   */
  function isCollide(el1, el2) {

    var rect1 = el1.getBoundingClientRect();
    var rect2 = el2.getBoundingClientRect();

    return !!(rect1.top >= rect2.top &&
            rect1.top <= rect2.top + rect2.height &&
            rect1.left >= rect2.left &&
            rect1.left <= rect2.left + rect2.width) ||
            (rect1.top + rect1.height >= rect2.top &&
            rect1.top + rect1.height <= rect2.top + rect2.height &&
            rect1.left + rect1.width >= rect2.left &&
            rect1.left + rect1.width <= rect2.left + rect2.width);
  }

/////////////////////////////////////////////////////////

  global.helper = {
    changeCss: changeCss,
    animate: animate,
    isCollide: isCollide
  }

}(window));
