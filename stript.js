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
  const keywords = await getData();

  for (const keyword of keywords) {
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
}

async function getData() {
  const res = await fetch("../keywords.json");
  return await res.json();
}
