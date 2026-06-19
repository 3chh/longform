/*
 * artboard.js — giữ bố cục desktop cho các khối visual khi xuống mobile.
 *
 * Cách dùng: gắn [data-artboard] cho khối cần "khoá thành một cục".
 *   - CSS (mobile) khoá khối ở bề rộng thiết kế cố định + dựng lại layout desktop
 *     (xem các @media trong file CSS từng bài).
 *   - JS này thu CẢ CỤM bằng `zoom` cho vừa bề ngang màn hình, nên ảnh/chữ/khoảng
 *     cách co theo nhau như một đơn vị (không reflow rời rạc, không lệch layout).
 *
 * Tuỳ chọn: [data-artboard-gutter] = lề an toàn hai bên (px, mặc định 16).
 * Trên desktop khối đã vừa khung nên zoom = 1 (không đổi).
 */
(function () {
  function fitAll() {
    var blocks = document.querySelectorAll('[data-artboard]');
    for (var i = 0; i < blocks.length; i++) {
      var el = blocks[i];
      el.style.zoom = '';
      var gutterAttr = el.getAttribute('data-artboard-gutter');
      var gutter = gutterAttr === null ? 16 : parseInt(gutterAttr, 10) || 0;
      var parentW = el.parentElement ? el.parentElement.clientWidth : document.documentElement.clientWidth;
      var avail = Math.min(parentW, document.documentElement.clientWidth) - gutter;
      var w = el.offsetWidth; // bề rộng thiết kế (zoom đã reset)
      if (w > avail) el.style.zoom = (avail / w).toFixed(4);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fitAll);
  } else {
    fitAll();
  }
  // Re-fit sau khi web-font tải xong (đổi kích thước chữ) và khi xoay/đổi cỡ màn.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
  addEventListener('load', fitAll);
  addEventListener('resize', fitAll, { passive: true });
  addEventListener('orientationchange', fitAll);
})();
