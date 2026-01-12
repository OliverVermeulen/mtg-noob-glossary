document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".toggle-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const step = button.closest(".item");
      const isOpen = step.classList.contains("open");

      step.classList.toggle("open", !isOpen);
      button.classList.toggle("open", !isOpen);
      button.setAttribute("aria-expanded", String(!isOpen));
    });
  });
});
