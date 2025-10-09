window.addEventListener("load", () => {
  const nav = document.querySelector(".nav__container");
  const mobileMenuContainer = document.querySelector(".nav_menu__mobile");
  const headerContent = document.querySelector("header > div:first-child");
  const navBtn = document.querySelector(".nav__btn");

  let navOriginalParent = headerContent;
  let isMobile = false;

  function handleNavPlacement() {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 767 && !isMobile) {
      // Move nav to mobile menu
      if (nav && mobileMenuContainer) {
        mobileMenuContainer.appendChild(nav);
        isMobile = true;
      }
    } else if (screenWidth > 767 && isMobile) {
      // Move nav back to original position
      if (nav && navOriginalParent) {
        const container = navOriginalParent.querySelector(".mx-auto");
        if (container) {
          container.appendChild(nav);
          isMobile = false;
        }
      }
    }
  }

  function toggleMobileMenu() {
    // Toggle mobile menu visibility
    if (navBtn && mobileMenuContainer) {
      navBtn.addEventListener("click", () => {
        mobileMenuContainer.classList.toggle("hidden");
      });
    }

    // Handle dropdown menu on mobile (click instead of hover)
    const dropdownLink = document.querySelector(".nav__link");
    const dropdownMenu = document.querySelector(".group-hover\\:block");

    if (dropdownLink && dropdownMenu) {
      dropdownLink.addEventListener("click", (e) => {
        const screenWidth = window.innerWidth;

        if (screenWidth <= 767) {
          e.preventDefault();
          dropdownMenu.classList.toggle("!block");
          dropdownMenu.classList.toggle("!static");
          dropdownMenu.classList.toggle("hidden");
        }
      });
    }
  }

  // Run on page load
  handleNavPlacement();
  toggleMobileMenu();

  // Run on window resize
  window.addEventListener("resize", handleNavPlacement);
});
