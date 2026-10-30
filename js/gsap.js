document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, TextPlugin);

  // --- PRELOADER LOGIC ---
  const preloader = document.getElementById("preloader");
  const preloaderContent = document.querySelector(".preloader-content");

  if (preloader) {
    let preloaderDismissed = false;

    const dismissPreloader = () => {
      if (preloaderDismissed) return;
      preloaderDismissed = true;

      const tl = gsap.timeline();

      tl.to(preloaderContent || ".preloader-content", {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.in"
      })
      .to(preloader, {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut"
      }, "-=0.15")
      .from("#smooth-wrapper", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.5")
      .set(preloader, { display: "none" });
    };

    if (document.readyState === "complete") {
      setTimeout(dismissPreloader, 350);
    } else {
      window.addEventListener("load", () => {
        setTimeout(dismissPreloader, 350);
      });
      // Fallback timer (max 2.8s) so preloader never hangs if assets delay
      setTimeout(dismissPreloader, 2800);
    }
  }

  const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 2,
    smoothTouch: false,
    normalizeScroll: true,
    ignoreMobileResize: true,
    effects: true,
    preventDefault: true,
  });

  /* ðŸ”¹ Hero image zoom + fade */
  if (document.querySelector(".hero_section") && document.querySelector(".hero-bg")) {
    ScrollTrigger.create({
      trigger: ".hero_section",
      start: "top top",
      end: "bottom top",
      pin: ".hero-bg",
      pinSpacing: false
    });

    gsap.to(".hero-bg", {
      scale: 1.3,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero_section",
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });
  }

  /* ðŸ”¹ Text color change */
  const textElements = document.querySelectorAll(".color_change");
  textElements.forEach((textElement) => {
    const text = textElement.innerHTML;
    textElement.innerHTML = text
      .replace(/\n/g, "<br>")
      .split(/(<br\s*\/?>)/g)
      .map((part) => {
        if (part.match(/<br\s*\/?>/i)) return part;
        return part.split(/( )/g).map((char) => {
          if (char === " ") return `<span class="space">&nbsp;</span>`;
          return `<span>${char}</span>`;
        }).join("");
      }).join("");

    const chars = textElement.querySelectorAll("span");
    if (chars.length > 0) {
      gsap.fromTo(chars, 
        { color: "#747474" }, 
        {
          color: "#ffffff",
          scrollTrigger: {
            trigger: textElement,
            start: "top 70%",
            end: "bottom 50%",
            scrub: true,
          },
          stagger: 0.05,
        }
      );
    }
  });

  /* ðŸ”¹ Image Reveal */
  gsap.utils.toArray(".square-box-content").forEach((box) => {
    gsap.fromTo(box, { opacity: 0, y: 50 }, {
      opacity: 1, y: 0, duration: 1.5, ease: "power2.out",
      scrollTrigger: { trigger: box, start: "top 80%", toggleActions: "play none none reverse" }
    });
  });

/* ðŸ”¹ Multiple Parallax Sections Logic */
gsap.utils.toArray(".clusterBurrowing").forEach((container) => {
  const innerElement = container.querySelector(".paralax_eff");

  if (innerElement) {
    // Set initial position
    gsap.set(innerElement, { yPercent: -50 });

    // Create animation for THIS specific container
    gsap.to(innerElement, {
      yPercent: 50, // Reduced from 100 for a smoother feel across multiple sections
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top bottom", // Starts when container enters bottom of screen
        end: "bottom top",   // Ends when container leaves top of screen
        scrub: true
      }
    });
  }
});

  /* ðŸ”¹ Horizontal Scroll for Services */
  const servicesWrapper = document.querySelector(".services_wrapper");
  const servicesRow = document.querySelector(".services_scroll_row");

  if (servicesWrapper && servicesRow) {
    function getScrollAmount() {
      let wrapperWidth = servicesRow.scrollWidth;
      return -(wrapperWidth - window.innerWidth);
    }
    
    gsap.to(servicesRow, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: servicesWrapper,
        start: "top top",
        pin: true,
        scrub: 1,
        end: () => `+=${servicesRow.scrollWidth - window.innerWidth}`,
        invalidateOnRefresh: true
      }
    });
  }

  /* 🔹 Services Accordion Click / Tap Toggle */
  const serviceCards = document.querySelectorAll(".services_div:not(.link_div)");
  serviceCards.forEach(card => {
    card.addEventListener("click", () => {
      const isAlreadyActive = card.classList.contains("active");
      serviceCards.forEach(c => c.classList.remove("active"));
      if (!isAlreadyActive) {
        card.classList.add("active");
      }
    });
  });

  /* 🔹 Circle Text Logic */
  const circleText = document.querySelector('.circle_text .text p');
  if (circleText) {
    // Get the text, trim whitespace, and replace multiple spaces/newlines with a single space
    const textStr = circleText.textContent.trim().replace(/\s+/g, ' ');
    circleText.innerHTML = textStr.split('').map(
      (char, i) => `<span style="transform:rotate(${i * (360 / textStr.length)}deg)">${char}</span>`
    ).join('');
  }

  // Register the TextPlugin for the typewriter effect
gsap.registerPlugin(TextPlugin);

const words = ["FLUTIST", "MUSICIAN", "COMPOSER", "ARTIST"];
let mainTimeline = gsap.timeline({ repeat: -1 });

words.forEach(word => {
  let textTimeline = gsap.timeline({
    repeat: 1, 
    yoyo: true, 
    repeatDelay: 4 // This holds the word for 4 seconds before it starts to disappear
  });
  
  textTimeline.to("#typewriter", {
    duration: 1, 
    text: word,
    ease: "none"
  });
  
  mainTimeline.add(textTimeline);
});

  /* ðŸ”¹ Marquee Logic */
  const marquee = document.querySelector('.marquee');
  if (marquee) {
    const marqueeContent = marquee.innerHTML;
    // Create a track and duplicate content for seamless looping
    marquee.innerHTML = `<div class="marquee-track">${marqueeContent}${marqueeContent}${marqueeContent}</div>`;
  }


// --- CUSTOM CURSOR TRACKING (SMOOTH VERSION) ---
const cursor = document.getElementById("custom-cursor");

// Set initial positions
let mouseX = 0;
let mouseY = 0;

// Update mouse coordinates on move
window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// GSAP Ticker: This runs every frame (60fps+)
// '0.15' is the delay/inertia. Increase it for a "heavier" feel.
gsap.ticker.add(() => {
    const dt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio()); 
    
    gsap.set(cursor, {
        x: gsap.utils.interpolate(gsap.getProperty(cursor, "x"), mouseX, dt),
        y: gsap.utils.interpolate(gsap.getProperty(cursor, "y"), mouseY, dt)
    });
});

// Cursor hover effect for elements with .cursor-scale class
const cursorScaleElements = document.querySelectorAll('.cursor-scale');
cursorScaleElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

// Cursor text invert effect for elements with .cursor-invert class
const cursorInvertElements = document.querySelectorAll('.cursor-invert');
cursorInvertElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        // Calculate mouse position relative to the element
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--x', (e.clientX - rect.left) + 'px');
        el.style.setProperty('--y', (e.clientY - rect.top) + 'px');
    });

    el.addEventListener('mouseenter', () => {
        // Hide the real custom cursor
        cursor.style.opacity = '0';
        
        // Simple logic to detect if text is light or dark
        const color = window.getComputedStyle(el).color;
        const rgb = color.match(/\d+/g);
        if (rgb) {
            const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
            if (brightness > 125) {
                // Light text -> Dark cursor
                el.style.setProperty('--cursor-bg', '#000000');
            } else {
                // Dark text -> Light cursor
                el.style.setProperty('--cursor-bg', '#ffffff');
            }
        }
    });
    
    el.addEventListener('mouseleave', () => {
        // Show the real custom cursor again
        cursor.style.opacity = '';
    });
});

  /* 🔹 Played Tracks Hover & Interactive Switcher */
  const trackItems = document.querySelectorAll(".played_tracks_section .track_item");
  const posterLayers = document.querySelectorAll(".tracks_showcase_card .tracks_poster_layer");
  const posterTitle = document.getElementById("posterTitle");
  const posterBadge = document.getElementById("posterBadge");
  const posterDesc = document.getElementById("posterDesc");
  const posterCaptionWrap = document.querySelector(".poster_caption_content");

  if (trackItems.length > 0 && posterLayers.length > 0) {
    let currentActiveIndex = 0;

    function switchTrack(index, item) {
      if (currentActiveIndex === index) return;
      currentActiveIndex = index;

      // Update active track row
      trackItems.forEach(t => t.classList.remove("active"));
      item.classList.add("active");

      // Cross-fade image layers
      posterLayers.forEach(layer => {
        if (parseInt(layer.getAttribute("data-track-index"), 10) === index) {
          layer.classList.add("active");
        } else {
          layer.classList.remove("active");
        }
      });

      // Smooth text transition
      if (posterCaptionWrap && typeof gsap !== "undefined") {
        gsap.to(posterCaptionWrap, {
          opacity: 0,
          y: 8,
          duration: 0.18,
          ease: "power2.in",
          onComplete: () => {
            if (posterTitle) posterTitle.textContent = item.getAttribute("data-title") || "";
            if (posterDesc) posterDesc.textContent = item.getAttribute("data-desc") || "";
            
            gsap.to(posterCaptionWrap, {
              opacity: 1,
              y: 0,
              duration: 0.25,
              ease: "power2.out"
            });
          }
        });
      } else {
        if (posterTitle) posterTitle.textContent = item.getAttribute("data-title") || "";
        if (posterDesc) posterDesc.textContent = item.getAttribute("data-desc") || "";
      }
    }

    trackItems.forEach(item => {
      const idx = parseInt(item.getAttribute("data-index") || "0", 10);
      
      item.addEventListener("mouseenter", () => {
        switchTrack(idx, item);
      });

      item.addEventListener("click", (e) => {
        if (!e.target.closest(".track_link_btn") && !e.target.closest(".red_arrow_btn")) {
          switchTrack(idx, item);
        }
      });
    });
  }

  /* 🔹 Red Arrow Button Hover & GSAP Text Roll Animation */
  const redArrowButtons = document.querySelectorAll(".red_arrow_btn");
  redArrowButtons.forEach((btn) => {
    if (btn.querySelector(".btn-text-roll")) return;

    // Extract text content from button (ignoring SVG icon)
    let text = "";
    btn.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;
      }
    });
    text = text.trim();
    if (!text) return;

    // Remove existing text nodes from button
    const textNodes = [];
    btn.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        textNodes.push(node);
      }
    });
    textNodes.forEach((node) => node.remove());

    // Helper to wrap characters into animated spans
    const buildCharSpans = (str) => {
      return str
        .split("")
        .map((char) => {
          if (char === " ") {
            return `<span class="btn-char space">&nbsp;</span>`;
          }
          return `<span class="btn-char">${char}</span>`;
        })
        .join("");
    };

    // Container for the rolling text
    const rollWrapper = document.createElement("span");
    rollWrapper.className = "btn-text-roll";
    rollWrapper.setAttribute("aria-label", text);

    // Primary layer (white by default, rolls up out of view on hover)
    const primarySpan = document.createElement("span");
    primarySpan.className = "btn-text-primary";
    primarySpan.innerHTML = buildCharSpans(text);

    // Clone layer (red #ff3d00, rolls in from bottom on hover)
    const cloneSpan = document.createElement("span");
    cloneSpan.className = "btn-text-clone";
    cloneSpan.setAttribute("aria-hidden", "true");
    cloneSpan.innerHTML = buildCharSpans(text);

    rollWrapper.appendChild(primarySpan);
    rollWrapper.appendChild(cloneSpan);

    const svgIcon = btn.querySelector("svg, .button__icon-svg");
    if (svgIcon) {
      btn.insertBefore(rollWrapper, svgIcon);
    } else {
      btn.appendChild(rollWrapper);
    }

    const primaryChars = primarySpan.querySelectorAll(".btn-char");
    const cloneChars = cloneSpan.querySelectorAll(".btn-char");

    // Set initial character positions: primary visible (0), clone hidden below (100%)
    gsap.set(primaryChars, { yPercent: 0 });
    gsap.set(cloneChars, { yPercent: 100 });

    // GSAP timeline for the hover roll animation
    const rollTimeline = gsap.timeline({
      paused: true,
      defaults: { duration: 0.32, ease: "power2.inOut" }
    });

    rollTimeline
      .to(primaryChars, {
        yPercent: -100,
        stagger: 0.018
      }, 0)
      .to(cloneChars, {
        yPercent: 0,
        stagger: 0.018
      }, 0);

    const hoverTarget = btn.closest("a") || btn;

    hoverTarget.addEventListener("mouseenter", () => {
      rollTimeline.play();
      if (cursor) cursor.classList.add("cursor-hover");
    });

    hoverTarget.addEventListener("mouseleave", () => {
      rollTimeline.reverse();
      if (cursor) cursor.classList.remove("cursor-hover");
    });
  });

  // Services Showcase Nav Interaction
  const serviceNavItems = document.querySelectorAll(".services_nav_item");
  serviceNavItems.forEach((item) => {
    item.addEventListener("click", () => {
      serviceNavItems.forEach((el) => el.classList.remove("active"));
      item.classList.add("active");
    });
  });

  /* 🔹 GSAP Reveal Animation for Services Showcase Images */
  gsap.utils.toArray(".showcase_card").forEach((card) => {
    const img = card.querySelector(".showcase_img");
    if (img) {
      gsap.fromTo(img, 
        {
          scale: 1.25,
          opacity: 0,
          y: 40
        }, 
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  });

  /* 🔹 Testimonial Swiper Slider Initialization */
  if (document.querySelector(".testimonialSwiper")) {
    const testimonialSwiper = new Swiper(".testimonialSwiper", {
      slidesPerView: 1.1,
      spaceBetween: 24,
      grabCursor: true,
      speed: 700,
      loop: true,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: false,
      pagination: false,

      breakpoints: {
        576: {
          slidesPerView: 1.5,
          spaceBetween: 24,
        },
        768: {
          slidesPerView: 2.2,
          spaceBetween: 28,
        },
        1200: {
          slidesPerView: 3.4,
          spaceBetween: 30,
        },
        1600: {
          slidesPerView: 3.4,
          spaceBetween: 32,
        }
      }
    });
  }

  /* 🔹 YouTube Video Popup Modal */
  const videoCard = document.querySelector(".video_thumbnail_card");
  const videoModal = document.getElementById("videoModal");
  const videoModalIframe = document.getElementById("videoModalIframe");
  const videoModalClose = document.getElementById("videoModalClose");
  const videoModalBackdrop = document.getElementById("videoModalBackdrop");

  const openVideoModal = () => {
    if (!videoCard || !videoModal || !videoModalIframe) return;
    const videoId = videoCard.getAttribute("data-video-id") || "rK6t5K0wOnQ";
    videoModalIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    videoModal.classList.add("active");
    videoModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeVideoModal = () => {
    if (!videoModal || !videoModalIframe) return;
    videoModal.classList.remove("active");
    videoModal.setAttribute("aria-hidden", "true");
    videoModalIframe.src = "";
    document.body.style.overflow = "";
  };

  if (videoCard) {
    videoCard.addEventListener("click", openVideoModal);
    videoCard.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openVideoModal();
      }
    });
  }

  if (videoModalClose) {
    videoModalClose.addEventListener("click", closeVideoModal);
  }

  if (videoModalBackdrop) {
    videoModalBackdrop.addEventListener("click", closeVideoModal);
  }

  // --- Ambient Red Gradient Glows: Smooth Scroll Parallax (With Scroll) ---
  const contactSec = document.querySelector(".contact_footer_section");
  const glowRT = document.querySelector(".glow_right_top");
  const glowLM = document.querySelector(".glow_left_middle");
  const glowBR = document.querySelector(".glow_bottom_right");

  if (contactSec && (glowRT || glowLM || glowBR)) {
    if (glowRT) {
      gsap.to(glowRT, {
        y: 110,
        x: -45,
        scale: 1.18,
        ease: "none",
        scrollTrigger: {
          trigger: contactSec,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5
        }
      });
    }

    if (glowLM) {
      gsap.to(glowLM, {
        y: -120,
        x: 60,
        scale: 1.25,
        ease: "none",
        scrollTrigger: {
          trigger: contactSec,
          start: "top bottom",
          end: "bottom top",
          scrub: 2
        }
      });
    }

    if (glowBR) {
      gsap.to(glowBR, {
        y: -95,
        x: -50,
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: contactSec,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.8
        }
      });
    }
  }

  // --- BOTTOM FOOTER CURSOR JELLY BACKGROUND CIRCLE ---
  const footerBlock = document.querySelector(".bottom_footer_block");
  const footerJelly = document.querySelector(".footer_cursor_jelly");

  if (footerBlock && footerJelly) {
    let isHovering = false;
    let clientX = -9999;
    let clientY = -9999;

    const updateJelly = () => {
      const rect = footerBlock.getBoundingClientRect();
      const inBounds = (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );

      if (inBounds) {
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        if (!isHovering) {
          isHovering = true;
          gsap.to(footerJelly, {
            opacity: 0.8,
            duration: 1.0,
            ease: "power2.out",
            overwrite: "auto"
          });
        }

        // Much slower, fluid jelly cursor follow
        gsap.to(footerJelly, {
          x: x,
          y: y,
          duration: 2.0,
          ease: "power2.out",
          overwrite: "auto"
        });
      } else if (isHovering) {
        isHovering = false;
        // Slow, gradual fade out when cursor leaves footer
        gsap.to(footerJelly, {
          opacity: 0,
          duration: 1.6,
          ease: "power2.out",
          overwrite: "auto"
        });
      }
    };

    window.addEventListener("pointermove", (e) => {
      clientX = e.clientX;
      clientY = e.clientY;
      updateJelly();
    });

    window.addEventListener("scroll", () => {
      if (clientX !== -9999) {
        updateJelly();
      }
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
      if (isHovering) {
        isHovering = false;
        gsap.to(footerJelly, {
          opacity: 0,
          duration: 1.6,
          ease: "power2.out",
          overwrite: "auto"
        });
      }
    });
  }
});




