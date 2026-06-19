(function () {
    function onReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var button = document.querySelector('[data-menu-button]');
        var nav = document.querySelector('[data-site-nav]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, current) {
                slide.classList.toggle('is-active', current === index);
            });
            dots.forEach(function (dot, current) {
                dot.classList.toggle('is-active', current === index);
            });
        }
        function play() {
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }
        dots.forEach(function (dot, current) {
            dot.addEventListener('click', function () {
                if (timer) {
                    window.clearInterval(timer);
                }
                show(current);
                play();
            });
        });
        show(0);
        play();
    }

    function setupFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll('[data-search-scope]'));
        panels.forEach(function (scope) {
            var input = scope.querySelector('[data-search-input]');
            var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
            if (!input || !cards.length) {
                return;
            }
            input.addEventListener('input', function () {
                var value = input.value.trim().toLowerCase();
                cards.forEach(function (card) {
                    var source = ((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-meta') || '')).toLowerCase();
                    card.classList.toggle('filter-hidden', value && source.indexOf(value) === -1);
                });
            });
        });
    }

    window.initMoviePlayer = function (url) {
        var shell = document.querySelector('[data-player-shell]');
        var video = document.querySelector('[data-player-video]');
        var trigger = document.querySelector('[data-player-trigger]');
        if (!shell || !video || !trigger || !url) {
            return;
        }
        var attached = false;
        var hls = null;
        function attach() {
            if (attached) {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(url);
                hls.attachMedia(video);
            } else {
                video.src = url;
            }
            attached = true;
        }
        function start() {
            attach();
            shell.classList.add('is-playing');
            var result = video.play();
            if (result && typeof result.catch === 'function') {
                result.catch(function () {});
            }
        }
        trigger.addEventListener('click', start);
        shell.addEventListener('click', function (event) {
            if (event.target === shell) {
                start();
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    };

    onReady(function () {
        setupMenu();
        setupHero();
        setupFilters();
    });
}());
