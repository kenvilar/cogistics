window.addEventListener("load", () => {
  const nav = document.querySelector(".nav__container");
  const mobileMenuContainer = document.querySelector(".nav_menu__mobile");
  const headerContent = document.querySelector("header > div:first-child");
  const navBtn = document.querySelector(".nav__btn");
  console.log(nav);
  console.log(mobileMenuContainer);

  let navOriginalParent = headerContent;
  let isMobile = false;

  function handleNavPlacement() {
    const screenWidth = window.innerWidth;
    console.log(screenWidth);

    if (screenWidth <= 767 && !isMobile) {
      console.log("mobile");
      // Move nav to mobile menu
      if (nav && mobileMenuContainer) {
        console.log("navOriginalParent");
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

  // Toggle mobile menu visibility
  if (navBtn && mobileMenuContainer) {
    navBtn.addEventListener("click", () => {
      mobileMenuContainer.classList.toggle("hidden");
    });
  }

  // Run on page load
  handleNavPlacement();

  // Run on window resize
  window.addEventListener("resize", handleNavPlacement);
});
