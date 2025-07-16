import "/src/style.css";

// Initialize all functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeCarousel();
  initializeSmoothScrolling();
  initializeMapFunctions();
  initializeHeaderScrollEffect();
  initializeImageLoading();
});

// Carousel functionality
function initializeCarousel() {
  const carousel = document.querySelector(".carousel");

  if (!carousel) {
    console.warn("Carousel not found");
    return;
  }

  // Create container for slides
  const container = document.createElement("div");
  container.className = "carousel-container";

  // Get all slides
  const originalSlides = document.querySelectorAll(".carousel-item");

  if (originalSlides.length === 0) {
    console.warn("No slides found");
    return;
  }

  // Clone all slides to the container
  originalSlides.forEach((slide) => {
    const clone = slide.cloneNode(true);
    container.appendChild(clone);
  });

  // Clear the carousel and add the container
  carousel.innerHTML = "";
  carousel.appendChild(container);

  // Get the slides again after they've been added to the container
  const slides = container.querySelectorAll(".carousel-item");

  // Create navigation elements
  const { dotsContainer, leftArrow, rightArrow } = createCarouselNavigation(carousel, slides.length);

  // Carousel state
  let currentSlide = 0;
  let intervalId = null;
  let isTransitioning = false;

  // Navigation functions
  function goToSlide(index) {
    if (isTransitioning) return;

    isTransitioning = true;
    currentSlide = index;

    // Move container to show current slide
    container.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update active dot
    updateActiveDot(dotsContainer, currentSlide);

    // Reset transition flag
    setTimeout(() => {
      isTransitioning = false;
    }, 800);
  }

  function nextSlide() {
    if (!isTransitioning) {
      currentSlide = (currentSlide + 1) % slides.length;
      goToSlide(currentSlide);
    }
  }

  function prevSlide() {
    if (!isTransitioning) {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      goToSlide(currentSlide);
    }
  }

  // Auto-scroll functionality
  function startAutoScroll() {
    stopAutoScroll();
    intervalId = setInterval(nextSlide, 5000);
  }

  function stopAutoScroll() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Event listeners
  setupCarouselEventListeners(carousel, leftArrow, rightArrow, dotsContainer, {
    nextSlide,
    prevSlide,
    goToSlide,
    startAutoScroll,
    stopAutoScroll
  });

  // Initialize carousel
  goToSlide(0);
  startAutoScroll();

  console.log("Carousel initialized with", slides.length, "slides");
}

// Create carousel navigation elements
function createCarouselNavigation(carousel, slideCount) {
  // Create navigation dots
  const dotsContainer = document.createElement("div");
  dotsContainer.className = "carousel-nav";

  for (let i = 0; i < slideCount; i++) {
    const dot = document.createElement("div");
    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("data-slide", i);
    dotsContainer.appendChild(dot);
  }

  // Create navigation arrows
  const leftArrow = document.createElement("div");
  leftArrow.className = "carousel-arrow carousel-arrow-left";
  leftArrow.innerHTML = "&#10094;";

  const rightArrow = document.createElement("div");
  rightArrow.className = "carousel-arrow carousel-arrow-right";
  rightArrow.innerHTML = "&#10095;";

  // Add elements to carousel
  carousel.appendChild(dotsContainer);
  carousel.appendChild(leftArrow);
  carousel.appendChild(rightArrow);

  return { dotsContainer, leftArrow, rightArrow };
}

// Update active dot indicator
function updateActiveDot(dotsContainer, currentSlide) {
  const dots = dotsContainer.querySelectorAll(".carousel-dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
}

// Setup all carousel event listeners
function setupCarouselEventListeners(carousel, leftArrow, rightArrow, dotsContainer, actions) {
  const { nextSlide, prevSlide, goToSlide, startAutoScroll, stopAutoScroll } = actions;

  // Arrow click events
  leftArrow.addEventListener("click", (e) => {
    e.preventDefault();
    prevSlide();
  });

  rightArrow.addEventListener("click", (e) => {
    e.preventDefault();
    nextSlide();
  });

  // Dot click events
  dotsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("carousel-dot")) {
      const slideIndex = parseInt(e.target.getAttribute("data-slide"));
      goToSlide(slideIndex);
    }
  });

  // Hover events for auto-scroll
  carousel.addEventListener("mouseenter", stopAutoScroll);
  carousel.addEventListener("mouseleave", startAutoScroll);

  // Visibility change event
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
  });
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Google Maps functions
function initializeMapFunctions() {
  const mapAddress = "123+Main+Street+Your+City";

  window.openGoogleMaps = () => {
    window.open(`https://maps.google.com/?q=${mapAddress}`, "_blank");
  };

  window.getDirections = () => {
    window.open(`https://maps.google.com/maps/dir//${mapAddress}`, "_blank");
  };
}

// Header scroll effect
function initializeHeaderScrollEffect() {
  let ticking = false;

  function updateHeaderShadow() {
    const header = document.querySelector(".hero-header");
    if (header) {
      const scrolled = window.scrollY > 100;
      header.style.boxShadow = scrolled 
        ? "0 4px 20px rgba(0,0,0,0.15)" 
        : "0 2px 10px rgba(0,0,0,0.1)";
    }
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateHeaderShadow);
      ticking = true;
    }
  });
}

// Image loading animation
function initializeImageLoading() {
  const images = document.querySelectorAll("img");
  
  images.forEach((img) => {
    img.style.opacity = "0";
    img.style.transition = "opacity 0.3s ease";

    const handleLoad = () => {
      img.style.opacity = "1";
    };

    img.addEventListener("load", handleLoad);

    if (img.complete && img.naturalHeight !== 0) {
      handleLoad();
    }
  });
}