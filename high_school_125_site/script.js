        const menuToggle = document.getElementById("menuToggle");
        const mainNav = document.getElementById("mainNav");

        menuToggle.addEventListener("click", function () {
            const isOpen = mainNav.classList.toggle("active");
            menuToggle.setAttribute("aria-expanded", isOpen);
            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        document.querySelectorAll("#mainNav a").forEach(function (link) {
            link.addEventListener("click", function () {
                mainNav.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.textContent = "☰";
            });
        });

        document.getElementById("year").textContent = new Date().getFullYear();
        const revealElements = document.querySelectorAll(".reveal");

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12 });

            revealElements.forEach(function (element) { observer.observe(element); });
        } else {
            revealElements.forEach(function (element) { element.classList.add("visible"); });
        }


        const searchToggle = document.getElementById("searchToggle");
        const searchPanel = document.getElementById("searchPanel");
        const siteSearch = document.getElementById("siteSearch");
        const searchResults = document.getElementById("searchResults");
        const searchHint = document.getElementById("searchHint");
        const clearSearch = document.getElementById("clearSearch");
        const searchableSections = Array.from(document.querySelectorAll("main section[id]")).map(function(section) {
            const heading = section.querySelector("h1, h2, h3");
            return { id: section.id, title: heading ? heading.textContent.trim().replace(/\s+/g, " ") : section.id, text: section.innerText.toLowerCase() };
        });

        function closeSearch() {
            searchPanel.hidden = true;
            searchToggle.setAttribute("aria-expanded", "false");
        }
        searchToggle.addEventListener("click", function() {
            const shouldOpen = searchPanel.hidden;
            searchPanel.hidden = !shouldOpen;
            searchToggle.setAttribute("aria-expanded", String(shouldOpen));
            if (shouldOpen) { siteSearch.focus(); renderSearchResults(); }
        });
        function renderSearchResults() {
            const query = siteSearch.value.trim().toLowerCase();
            searchResults.replaceChildren();
            if (!query) { searchHint.textContent = "Введите слово или тему — покажем подходящие разделы сайта."; return; }
            const matches = searchableSections.filter(function(section) { return section.title.toLowerCase().includes(query) || section.text.includes(query); }).slice(0, 8);
            searchHint.textContent = matches.length ? "Найдено разделов: " + matches.length : "";
            if (!matches.length) {
                const empty = document.createElement("div"); empty.className = "search-empty"; empty.textContent = "Ничего не найдено. Попробуйте другое слово."; searchResults.appendChild(empty); return;
            }
            matches.forEach(function(section) {
                const button = document.createElement("button"); button.type = "button"; button.className = "search-result";
                const title = document.createElement("span"); title.textContent = section.title;
                const hint = document.createElement("small"); hint.textContent = "Перейти →";
                button.append(title, hint);
                button.addEventListener("click", function() { closeSearch(); document.getElementById(section.id).scrollIntoView({behavior:"smooth"}); });
                searchResults.appendChild(button);
            });
        }
        siteSearch.addEventListener("input", renderSearchResults);
        clearSearch.addEventListener("click", function() { siteSearch.value = ""; renderSearchResults(); siteSearch.focus(); });
        document.addEventListener("keydown", function(event) { if (event.key === "Escape") closeSearch(); });
        document.addEventListener("click", function(event) { if (!searchPanel.hidden && !searchPanel.contains(event.target) && !searchToggle.contains(event.target)) closeSearch(); });

        // Фильтр карточек новостей
        document.querySelectorAll(".filter-chip").forEach(function(button) {
            button.addEventListener("click", function() {
                document.querySelectorAll(".filter-chip").forEach(function(chip) { chip.classList.toggle("active", chip === button); });
                const filter = button.dataset.filter;
                document.querySelectorAll(".news-card[data-category]").forEach(function(card) { card.hidden = filter !== "all" && card.dataset.category !== filter; });
            });
        });

        const scrollProgress = document.getElementById("scrollProgress");
        const backToTop = document.getElementById("backToTop");
        function updateScrollUI() {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
            scrollProgress.style.width = progress + "%";
            backToTop.classList.toggle("visible", window.scrollY > 500);
        }
        window.addEventListener("scroll", updateScrollUI, {passive:true});
        window.addEventListener("resize", updateScrollUI);
        updateScrollUI();
        backToTop.addEventListener("click", function() { window.scrollTo({top:0, behavior:"smooth"}); });

    
