(function () {
  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function setupMobileMenu() {
    var button = document.querySelector(".menu-toggle");
    var menu = document.getElementById("mobile-menu");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      var opened = menu.classList.toggle("is-open");
      button.setAttribute("aria-expanded", opened ? "true" : "false");
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var current = 0;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(parseInt(dot.getAttribute("data-hero-dot"), 10) || 0);
      });
    });
    window.setInterval(function () {
      show(current + 1);
    }, 5200);
  }

  function setupFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll(".filter-panel"));
    panels.forEach(function (panel) {
      var section = panel.closest("section") || document;
      var input = panel.querySelector(".movie-search-input");
      var selects = Array.prototype.slice.call(panel.querySelectorAll(".movie-filter"));
      var cards = Array.prototype.slice.call(section.querySelectorAll(".searchable-card"));
      function apply() {
        var query = normalize(input ? input.value : "");
        var filters = {};
        selects.forEach(function (select) {
          filters[select.getAttribute("data-filter")] = normalize(select.value);
        });
        cards.forEach(function (card) {
          var text = normalize(card.getAttribute("data-search-text"));
          var matchQuery = !query || text.indexOf(query) !== -1;
          var matchFilters = Object.keys(filters).every(function (key) {
            var value = filters[key];
            return !value || normalize(card.getAttribute("data-" + key)) === value;
          });
          card.classList.toggle("is-hidden", !(matchQuery && matchFilters));
        });
      }
      if (input) {
        input.addEventListener("input", apply);
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");
        if (q) {
          input.value = q;
        }
      }
      selects.forEach(function (select) {
        select.addEventListener("change", apply);
      });
      apply();
    });
  }

  function setupImageFallbacks() {
    var images = Array.prototype.slice.call(document.querySelectorAll("img"));
    images.forEach(function (image) {
      image.addEventListener("error", function () {
        image.style.display = "none";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupMobileMenu();
    setupHero();
    setupFilters();
    setupImageFallbacks();
  });
})();

function initMoviePlayer(playUrl) {
  var video = document.getElementById("movie-player");
  var overlay = document.getElementById("play-overlay");
  if (!video || !playUrl) {
    return;
  }
  var attached = false;
  var hlsInstance = null;

  function attach() {
    if (attached) {
      return;
    }
    attached = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = playUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(playUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = playUrl;
    }
  }

  function start() {
    attach();
    if (overlay) {
      overlay.classList.add("is-hidden");
    }
    var result = video.play();
    if (result && typeof result.catch === "function") {
      result.catch(function () {});
    }
  }

  if (overlay) {
    overlay.addEventListener("click", start);
  }
  video.addEventListener("click", function () {
    if (!attached) {
      start();
    }
  });
  window.addEventListener("beforeunload", function () {
    if (hlsInstance && typeof hlsInstance.destroy === "function") {
      hlsInstance.destroy();
    }
  });
}
