(function () {
    function setMenu() {
        var button = document.querySelector('[data-menu-button]');
        var menu = document.querySelector('[data-mobile-menu]');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    function setCarousel() {
        var carousel = document.querySelector('[data-carousel]');
        if (!carousel) {
            return;
        }
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-dot]'));
        var prev = carousel.querySelector('[data-carousel-prev]');
        var next = carousel.querySelector('[data-carousel-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                var active = slideIndex === index;
                slide.classList.toggle('is-active', active);
                slide.setAttribute('aria-hidden', active ? 'false' : 'true');
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function run() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(index + 1);
            }, 5000);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                run();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                run();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-dot')) || 0);
                run();
            });
        });
        show(0);
        run();
    }

    function setFilters() {
        var zones = Array.prototype.slice.call(document.querySelectorAll('[data-search-zone]'));
        zones.forEach(function (zone) {
            var input = zone.querySelector('[data-search-input]');
            var category = zone.querySelector('[data-filter-category]');
            var year = zone.querySelector('[data-filter-year]');
            var sort = zone.querySelector('[data-sort-select]');
            var scope = zone.parentElement || document;
            var grid = scope.querySelector('[data-card-grid]');
            var empty = scope.querySelector('[data-empty-message]');
            if (!grid) {
                return;
            }
            var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));

            function textOf(card) {
                return [
                    card.getAttribute('data-title') || '',
                    card.getAttribute('data-genre') || '',
                    card.getAttribute('data-region') || '',
                    card.getAttribute('data-category') || ''
                ].join(' ').toLowerCase();
            }

            function applySort(visibleCards) {
                var value = sort ? sort.value : 'default';
                var sorted = visibleCards.slice();
                if (value === 'year-desc') {
                    sorted.sort(function (a, b) {
                        return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
                    });
                }
                if (value === 'rating-desc') {
                    sorted.sort(function (a, b) {
                        var ar = Number((a.querySelector('.score') || {}).textContent || 0);
                        var br = Number((b.querySelector('.score') || {}).textContent || 0);
                        return br - ar;
                    });
                }
                if (value === 'title-asc') {
                    sorted.sort(function (a, b) {
                        return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-Hans-CN');
                    });
                }
                sorted.forEach(function (card) {
                    grid.appendChild(card);
                });
            }

            function apply() {
                var query = input ? input.value.trim().toLowerCase() : '';
                var categoryValue = category ? category.value : '';
                var yearValue = year ? year.value : '';
                var visible = [];
                cards.forEach(function (card) {
                    var matchesQuery = !query || textOf(card).indexOf(query) !== -1;
                    var matchesCategory = !categoryValue || card.getAttribute('data-category') === categoryValue;
                    var matchesYear = !yearValue || card.getAttribute('data-year') === yearValue;
                    var show = matchesQuery && matchesCategory && matchesYear;
                    card.style.display = show ? '' : 'none';
                    if (show) {
                        visible.push(card);
                    }
                });
                applySort(visible);
                if (empty) {
                    empty.classList.toggle('is-visible', visible.length === 0);
                }
            }

            [input, category, year, sort].forEach(function (node) {
                if (node) {
                    node.addEventListener('input', apply);
                    node.addEventListener('change', apply);
                }
            });
            apply();
        });
    }

    setMenu();
    setCarousel();
    setFilters();
})();
