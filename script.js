(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  // Mobile menu
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  // Scroll fade-in
  var items = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Slider（店内・店外）：data-interval ミリ秒ごとに自動切り替え
  // マウスを乗せている間・キーボード操作中・タブが非表示の間は止める。動きを減らす設定の端末では自動再生しない
  document.querySelectorAll('.slider').forEach(function (slider) {
    var slides = slider.querySelectorAll('.slider__slide');
    var dots = slider.querySelectorAll('.slider__dot');
    if (slides.length < 2) return;
    var interval = parseInt(slider.getAttribute('data-interval'), 10) || 3000;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var current = 0, timer = null, hovering = false, focused = false;

    var show = function (i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        s.classList.toggle('is-active', n === current);
        if (n === current) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true');
      });
      dots.forEach(function (d, n) {
        d.classList.toggle('is-active', n === current);
        if (n === current) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
    };
    var stop = function () { clearInterval(timer); timer = null; };
    var start = function () {
      stop();
      if (reduce || hovering || focused || document.hidden) return;
      timer = setInterval(function () { show(current + 1); }, interval);
    };

    dots.forEach(function (d, n) {
      d.addEventListener('click', function () { show(n); start(); });
    });
    slider.addEventListener('mouseenter', function () { hovering = true; stop(); });
    slider.addEventListener('mouseleave', function () { hovering = false; start(); });
    slider.addEventListener('focusin', function () { focused = true; stop(); });
    slider.addEventListener('focusout', function () { focused = false; start(); });
    document.addEventListener('visibilitychange', start);
    start();
  });

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
