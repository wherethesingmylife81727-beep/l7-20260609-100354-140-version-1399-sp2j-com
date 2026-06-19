(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let current = 0;
    let timer = null;

    const show = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    };

    const start = function () {
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    };

    const reset = function () {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    };

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        reset();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        reset();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        reset();
      });
    }

    if (slides.length > 1) {
      start();
    }
  }

  document.querySelectorAll('.movie-filter').forEach(function (panel) {
    const input = panel.querySelector('[data-filter-input]');
    const yearSelect = panel.querySelector('[data-filter-year]');
    const regionSelect = panel.querySelector('[data-filter-region]');
    const categorySelect = panel.querySelector('[data-filter-category]');
    const scope = panel.closest('main') || document;
    const items = Array.from(scope.querySelectorAll('.movie-card, .rank-row'));

    const apply = function () {
      const query = input ? input.value.trim().toLowerCase() : '';
      const yearValue = yearSelect ? yearSelect.value : '';
      const regionValue = regionSelect ? regionSelect.value : '';
      const categoryValue = categorySelect ? categorySelect.value : '';

      items.forEach(function (item) {
        const haystack = [
          item.dataset.title,
          item.dataset.region,
          item.dataset.category,
          item.dataset.genre
        ].join(' ').toLowerCase();
        const year = Number(item.dataset.year || 0);
        const matchQuery = !query || haystack.includes(query);
        const matchRegion = !regionValue || haystack.includes(regionValue.toLowerCase());
        const matchCategory = !categoryValue || item.dataset.category === categoryValue;
        let matchYear = true;

        if (yearValue === 'older') {
          matchYear = year < 2020;
        } else if (yearValue) {
          matchYear = String(year) === yearValue;
        }

        item.classList.toggle('is-hidden', !(matchQuery && matchRegion && matchCategory && matchYear));
      });
    };

    [input, yearSelect, regionSelect, categorySelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });
  });

  document.querySelectorAll('.video-player').forEach(function (player) {
    const video = player.querySelector('video');
    const button = player.querySelector('.player-cover');
    const stream = player.dataset.stream;
    let loaded = false;

    const load = function () {
      if (!video || !stream || loaded) {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        player._hls = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else {
        video.src = stream;
      }

      loaded = true;
    };

    const play = function () {
      load();
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {});
      }
    };

    if (button && video) {
      button.addEventListener('click', play);
      video.addEventListener('play', function () {
        player.classList.add('playing');
      });
      video.addEventListener('pause', function () {
        if (video.currentTime === 0 || video.ended) {
          player.classList.remove('playing');
        }
      });
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
    }
  });
})();
