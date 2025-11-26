function updateHeaderHeight() {
  const header = document.querySelector('header');
  if (header) {
    const headerHeight = header.offsetHeight;
    // Update CSS variable with actual header height
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
  }
}

document.addEventListener('DOMContentLoaded', updateHeaderHeight);

let resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(updateHeaderHeight, 100);
});

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('active');
}
  document.addEventListener('click', function (e) {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
      sidebar.classList.remove('active');
      document.querySelector('.main-content').classList.remove('shifted');
    }
  });
document.addEventListener("DOMContentLoaded", function () {
    if (window.innerWidth < 768) {
      const tables = document.querySelectorAll("table");

      tables.forEach((table) => {
        if (table.parentElement.classList.contains("table-wrapper")) return;

        const clone = table.cloneNode(true);
        clone.style.visibility = "hidden";
        clone.style.position = "absolute";
        clone.style.width = "auto";
        clone.style.maxWidth = "none";
        document.body.appendChild(clone);

        const isWide = clone.offsetWidth > window.innerWidth;
        document.body.removeChild(clone);

        if (isWide) {
          const wrapper = document.createElement("div");
          wrapper.className = "table-wrapper";
          table.parentNode.insertBefore(wrapper, table);
          wrapper.appendChild(table);
        }
      });
    }
  });