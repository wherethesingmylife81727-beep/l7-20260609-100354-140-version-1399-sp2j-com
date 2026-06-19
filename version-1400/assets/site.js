(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    initImages();
    initNavigation();
    initHero();
    initFilters();
    initPlayers();
  });

  function initImages() {
    document.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('error', function () {
        img.classList.add('image-error');
      }, { once: true });
    });
  }

  function initNavigation() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-main-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  function initHero() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    if (slides.length <= 1) {
      return;
    }
    var active = 0;
    var timer = null;

    function setSlide(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, pos) {
        slide.classList.toggle('is-active', pos === active);
      });
      dots.forEach(function (dot, pos) {
        dot.classList.toggle('is-active', pos === active);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        setSlide(active + 1);
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        setSlide(index);
        start();
      });
    });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    setSlide(0);
    start();
  }

  function initFilters() {
    document.querySelectorAll('[data-filter-area]').forEach(function (area) {
      var input = area.querySelector('[data-search]');
      var buttons = Array.prototype.slice.call(area.querySelectorAll('[data-filter]'));
      var cards = Array.prototype.slice.call(area.querySelectorAll('[data-card]'));
      var empty = area.querySelector('[data-empty]');
      var current = 'all';

      function apply() {
        var query = input ? input.value.trim().toLowerCase() : '';
        var shown = 0;
        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute('data-title') || '',
            card.getAttribute('data-tags') || '',
            card.getAttribute('data-type') || '',
            card.getAttribute('data-region') || '',
            card.getAttribute('data-year') || ''
          ].join(' ').toLowerCase();
          var matchText = !query || haystack.indexOf(query) !== -1;
          var matchFilter = current === 'all' || haystack.indexOf(current.toLowerCase()) !== -1;
          var visible = matchText && matchFilter;
          card.style.display = visible ? '' : 'none';
          if (visible) {
            shown += 1;
          }
        });
        if (empty) {
          empty.classList.toggle('show', shown === 0);
        }
      }

      if (input) {
        input.addEventListener('input', apply);
      }
      buttons.forEach(function (button) {
        button.addEventListener('click', function () {
          current = button.getAttribute('data-filter') || 'all';
          buttons.forEach(function (item) {
            item.classList.toggle('active', item === button);
          });
          apply();
        });
      });
      apply();
    });
  }

  function initPlayers() {
    document.querySelectorAll('[data-player]').forEach(function (box) {
      var video = box.querySelector('video');
      var cover = box.querySelector('.player-cover');
      var status = box.querySelector('.player-status');
      var hls = null;
      var loaded = false;

      if (!video) {
        return;
      }

      function load() {
        if (loaded) {
          return;
        }
        loaded = true;
        var url = video.getAttribute('data-play');
        if (!url) {
          if (status) {
            status.textContent = '暂时无法播放，请稍后再试';
          }
          return;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(url);
          hls.attachMedia(video);
        } else {
          video.src = url;
        }
      }

      function start() {
        load();
        box.classList.add('is-playing');
        video.controls = true;
        var playTask = video.play();
        if (playTask && typeof playTask.catch === 'function') {
          playTask.catch(function () {
            box.classList.remove('is-playing');
            if (status) {
              status.textContent = '点击画面继续播放';
            }
          });
        }
      }

      if (cover) {
        cover.addEventListener('click', start);
      }
      video.addEventListener('click', function () {
        if (!loaded || video.paused) {
          start();
        }
      });
      video.addEventListener('play', function () {
        box.classList.add('is-playing');
      });
      video.addEventListener('ended', function () {
        if (hls) {
          hls.stopLoad();
        }
      });
    });
  }
})();
