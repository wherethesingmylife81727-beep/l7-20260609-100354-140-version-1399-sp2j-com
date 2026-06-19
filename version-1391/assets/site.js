(function() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-main-nav]");

    if (toggle && nav) {
        toggle.addEventListener("click", function() {
            nav.classList.toggle("open");
        });
    }

    var coverImages = document.querySelectorAll("[data-cover-img]");
    coverImages.forEach(function(image) {
        image.addEventListener("error", function() {
            image.style.opacity = "0";
        });
    });

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function(slide, slideIndex) {
            slide.classList.toggle("active", slideIndex === current);
        });
        dots.forEach(function(dot, dotIndex) {
            dot.classList.toggle("active", dotIndex === current);
        });
    }

    dots.forEach(function(dot) {
        dot.addEventListener("click", function() {
            showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function() {
            showSlide(current + 1);
        }, 5200);
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    var searchInput = document.querySelector("[data-search-input]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    var cardList = document.querySelector("[data-card-list]");

    if (searchInput && query) {
        searchInput.value = query;
    }

    if (query && cards.length) {
        var normalized = query.trim().toLowerCase();
        var visibleCount = 0;
        cards.forEach(function(card) {
            var value = (card.getAttribute("data-search") || "").toLowerCase();
            var matched = value.indexOf(normalized) !== -1;
            card.style.display = matched ? "" : "none";
            if (matched) {
                visibleCount += 1;
            }
        });
        if (cardList && visibleCount === 0) {
            var empty = document.createElement("div");
            empty.className = "no-result";
            empty.textContent = "未找到匹配影片，请尝试其他关键词。";
            cardList.appendChild(empty);
        }
    }
}());
