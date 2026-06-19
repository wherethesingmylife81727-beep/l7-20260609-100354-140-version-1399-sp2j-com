(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");
        if (toggle && mobileNav) {
            toggle.addEventListener("click", function () {
                mobileNav.classList.toggle("open");
            });
        }

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var current = 0;
            var timer = null;

            function show(index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("active", dotIndex === current);
                });
            }

            function start() {
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5600);
            }

            dots.forEach(function (dot) {
                dot.addEventListener("click", function () {
                    window.clearInterval(timer);
                    show(Number(dot.getAttribute("data-hero-dot")) || 0);
                    start();
                });
            });

            if (slides.length > 1) {
                start();
            }
        }

        var searchInput = document.querySelector("[data-search-input]");
        var yearFilter = document.querySelector("[data-filter-year]");
        var regionFilter = document.querySelector("[data-filter-region]");
        var typeFilter = document.querySelector("[data-filter-type]");
        var categoryFilter = document.querySelector("[data-filter-category]");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".searchable-grid .movie-card"));

        if (searchInput && cards.length) {
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q") || "";
            if (query) {
                searchInput.value = query;
            }

            function applyFilters() {
                var q = normalize(searchInput.value);
                var year = yearFilter ? normalize(yearFilter.value) : "";
                var region = regionFilter ? normalize(regionFilter.value) : "";
                var type = typeFilter ? normalize(typeFilter.value) : "";
                var category = categoryFilter ? normalize(categoryFilter.value) : "";

                cards.forEach(function (card) {
                    var text = normalize(card.textContent);
                    var pass = true;
                    if (q && text.indexOf(q) === -1) {
                        pass = false;
                    }
                    if (year && normalize(card.getAttribute("data-year")) !== year) {
                        pass = false;
                    }
                    if (region && normalize(card.getAttribute("data-region")) !== region) {
                        pass = false;
                    }
                    if (type && normalize(card.getAttribute("data-type")) !== type) {
                        pass = false;
                    }
                    if (category && normalize(card.getAttribute("data-category")) !== category) {
                        pass = false;
                    }
                    card.classList.toggle("search-hidden", !pass);
                });
            }

            [searchInput, yearFilter, regionFilter, typeFilter, categoryFilter].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", applyFilters);
                    control.addEventListener("change", applyFilters);
                }
            });

            applyFilters();
        }

        Array.prototype.slice.call(document.querySelectorAll("[data-detail-play]")).forEach(function (button) {
            button.addEventListener("click", function () {
                var targetId = button.getAttribute("data-detail-play");
                var target = document.getElementById(targetId);
                if (target) {
                    target.click();
                }
            });
        });
    });
}());
