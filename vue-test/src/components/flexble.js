!(function (doc, win) {
  let docEl = doc.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function () {
          var clientWidth = docEl.clientWidth;
          if (!clientWidth) return;
          docEl.style.fontSize = '100px';
          if (200 * (clientWidth / 750) <= 100) {
              docEl.style.fontSize = 200 * (clientWidth / 750) + 'px';
          }
      };
  recalc();
  if (!doc.addEventListener) return;

  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);