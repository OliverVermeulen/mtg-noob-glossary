document.addEventListener("DOMContentLoaded", () => {
  // Toggle Description
  document.body.addEventListener("click", (event) => {
    const button = event.target.closest(".toggle-btn");
    if (!button) return;

    const item = button.closest(".item");
    const isOpen = item.classList.contains("open");

    item.classList.toggle("open", !isOpen);
    button.classList.toggle("open", !isOpen);
    button.setAttribute("aria-expanded", String(!isOpen));
  });

  // Keywords page
  const keywordsContainer = document.querySelector("#keywords-container");
  if (keywordsContainer) {
    initKeywords(keywordsContainer);
  }

  // Symbols page
  const symbolsContainer = document.querySelector("#symbols-container");
  if (symbolsContainer) {
    initSymbols(symbolsContainer);
  }
});

// KEYWORDS LOGIC
async function initKeywords(container) {
  let keywords = await getKeywordsData();

  // Sort alphabetically
  keywords.sort((a, b) => a.name.localeCompare(b.name));

  // Search bar
  const searchWrapper = document.createElement("div");
  searchWrapper.className = "search-wrapper";
  searchWrapper.innerHTML = `
    <input type="text" id="keyword-search" autocomplete="off" placeholder="Search keywords" />
    <button type="button" id="clear-search" title="Clear search">x</button>
  `;
  container.parentNode.insertBefore(searchWrapper, container);

  const searchInput = document.querySelector("#keyword-search");
  const clearBtn = document.querySelector("#clear-search");

  const renderKeywords = (filteredKeywords) => {
    container.innerHTML = "";

    if (filteredKeywords.length === 0) {
      const noResults = document.createElement("div");
      noResults.className = "no-results";
      noResults.textContent = "No keywords found.";
      container.appendChild(noResults);
      return;
    }

    for (const keyword of filteredKeywords) {
      const item = document.createElement("div");
      item.className = "item";

      item.innerHTML = `
        <div class="item-heading">
          <div class="keyword-name">${keyword.name}</div>
          <button class="toggle-btn" aria-expanded="false" title="View More">
            <span class="arrow"></span>
          </button>
        </div>

        <div class="item-content">
          <p>${keyword.description}</p>
        </div>
      `;

      container.appendChild(item);
    }
  };

  renderKeywords(keywords);

  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    renderKeywords(keywords.filter((k) => k.name.toLowerCase().includes(term)));
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    renderKeywords(keywords);
    searchInput.focus();
  });
}

async function getKeywordsData() {
  const res = await fetch("../json/keywords.json");
  return await res.json();
}

// SYMBOLS LOGIC
async function initSymbols(container) {
  const symbols = await getSymbolsData();

  for (const keyword of symbols) {
    const symbol = document.createElement("div");
    symbol.className = "symbol";

    symbol.innerHTML = `
      <img src="${keyword.url}" alt="${keyword.name}" title="${keyword.name}" />
      <p>${keyword.description}</p>
    `;

    container.appendChild(symbol);
  }
}

async function getSymbolsData() {
  const res = await fetch("../json/images.json");
  return await res.json();
}
