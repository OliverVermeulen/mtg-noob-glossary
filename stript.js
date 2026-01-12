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

  // Only run main() on pages with #keywords-container
  const container = document.querySelector("#keywords-container");
  if (container) {
    main(container);
  }
});

// Loop through JSON to make keywords
async function main(container) {
  let keywords = await getData();

  // Sort keywords alphabetically by name
  keywords.sort((a, b) => a.name.localeCompare(b.name));

  // Create search bar with clear button
  const searchWrapper = document.createElement("div");
  searchWrapper.className = "search-wrapper";
  searchWrapper.innerHTML = `
    <input type="text" id="keyword-search" autocomplete="off" placeholder="Search keywords" />
    <button type="button" id="clear-search" title="Clear search">x</button>
  `;
  container.parentNode.insertBefore(searchWrapper, container);

  const searchInput = document.querySelector("#keyword-search");
  const clearBtn = document.querySelector("#clear-search");

  // Function to render filtered keywords
  const renderKeywords = (filteredKeywords) => {
    container.innerHTML = ""; // Clear previous items

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

  // Initial render of all keywords
  renderKeywords(keywords);

  // Search input event
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = keywords.filter((k) =>
      k.name.toLowerCase().includes(searchTerm)
    );
    renderKeywords(filtered);
  });

  // Clear button event
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    renderKeywords(keywords);
    searchInput.focus();
  });
}

async function getData() {
  const res = await fetch("../keywords.json");
  return await res.json();
}
