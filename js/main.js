/* ==========================================================================
   SHELDON — MAIS QUE DJ
   Interações: header adaptativo, reveal, counters, transição white→black,
   drawer mobile.
   ========================================================================== */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;
  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  /* ------------------------------------------------------------------
     Inicialização: hero + fonte do ano + estado do header
     ------------------------------------------------------------------ */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const header = document.getElementById("header");

  /* ------------------------------------------------------------------
     Cursor personalizado — bolinha amarela com gradiente
     (somente em dispositivos com mouse/desktop)
     ------------------------------------------------------------------ */
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (finePointer && !prefersReducedMotion) {
    document.documentElement.classList.add("has-custom-cursor");

    const cursorEl = document.createElement("div");
    cursorEl.className = "cursor";
    cursorEl.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursorEl);

    let tx = -100, ty = -100;
    let cx = -100, cy = -100;

    document.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });

    document.addEventListener("mousedown", () => cursorEl.classList.add("is-down"));
    document.addEventListener("mouseup", () => cursorEl.classList.remove("is-down"));
    document.addEventListener("mouseleave", () => cursorEl.classList.add("is-hidden"));
    document.addEventListener("mouseenter", () => cursorEl.classList.remove("is-hidden"));

    const hoverables = 'a, button, [role="button"], .p-item, .service, .case-media, .feature-media, input, select, textarea';
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverables)) cursorEl.classList.add("is-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverables)) cursorEl.classList.remove("is-hover");
    });

    (function follow() {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      cursorEl.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(follow);
    })();
  }

  /* ------------------------------------------------------------------
     GSAP — scroll suave (ScrollSmoother)
     ------------------------------------------------------------------ */
  let smoother = null;

  if (window.gsap && window.ScrollTrigger) {
    try {
      window.gsap.registerPlugin(window.ScrollTrigger);
    } catch (error) {
      console.warn("ScrollTrigger indisponível; usando animações padrão.", error);
    }
  }

  if (window.gsap && window.ScrollTrigger && window.ScrollSmoother && !prefersReducedMotion) {
    try {
      const plugins = [window.ScrollTrigger, window.ScrollSmoother, window.ScrollToPlugin].filter(Boolean);
      window.gsap.registerPlugin(...plugins);

      smoother = window.ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.2,
        effects: false,
        smoothTouch: false
      });

      document.documentElement.style.scrollBehavior = "auto";
    } catch (error) {
      smoother = null;
      console.warn("Scroll suave indisponível; usando rolagem nativa.", error);
    }
  }

  if (window.ScrollTrigger) {
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }

  // Links de âncora com scroll suave via GSAP
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href.length < 2) return;

      const target = document.querySelector(href);
      if (!target) return;

      const headerH = header.offsetHeight + 12;

      if (smoother) {
        e.preventDefault();
        const y = smoother.offset(target, true) - headerH;
        smoother.scrollTo(y, true, "top");
      } else if (!prefersReducedMotion) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.pageYOffset - headerH;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      }
    });
  });

  // Stagger das linhas do título do hero e dos elementos do hero
  document.querySelectorAll(".hero-title .hl-line").forEach((line, idx) => {
    line.querySelector(".hl-in").style.transitionDelay = `${120 + idx * 110}ms`;
  });

  {
    let j = 0;
    document.querySelectorAll(".reveal-hero").forEach((el) => {
      el.style.setProperty("--d", `${j++ * 120}ms`);
    });
  }

  // Ativa a animação de entrada do hero logo após o primeiro paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      body.classList.add("ready");

      const heroEls = document.querySelectorAll(".hero .reveal-hero, .hero .m-reveal");
      heroEls.forEach((el, idx) => {
        el.style.transitionDelay = `${180 + idx * 100}ms`;
        el.classList.add("is-in");
      });
    });
  });

  /* ------------------------------------------------------------------
     Header — estado após scroll
     ------------------------------------------------------------------ */
  function updateHeaderScrolled() {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }

  const sectionIds = ["inicio", "sobre", "servicos", "eventos", "orcamento"];
  const sectionLinks = Array.from(document.querySelectorAll(".nav a, .drawer-nav a"));

  function updateActiveNav() {
    const marker = window.innerHeight * 0.32;
    let activeId = sectionIds[0];

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top <= marker) activeId = id;
    });

    sectionLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${activeId}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  /* ------------------------------------------------------------------
     Transição White → Black
     ------------------------------------------------------------------ */
  const transition = document.getElementById("transicao");
  const overlay = transition ? transition.querySelector(".transition-overlay") : null;
  const mediaImg = transition ? transition.querySelector(".transition-media") : null;
  const transitionLines = transition ? Array.from(transition.querySelectorAll(".tli")) : [];
  let usesGsapTransition = Boolean(
    transition && transitionLines.length && window.gsap && window.ScrollTrigger && !prefersReducedMotion
  );

  if (usesGsapTransition) {
    try {
      document.documentElement.classList.add("has-gsap-transition");
      window.gsap.set(transitionLines, { yPercent: 115 });
      if (mediaImg) window.gsap.set(mediaImg, { scale: 1.08, yPercent: 0 });

      const transitionTimeline = window.gsap.timeline({
        scrollTrigger: {
          trigger: transition,
          start: "top 70%",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      if (overlay) {
        transitionTimeline.to(overlay, { opacity: 0.68, duration: 4.5, ease: "none" }, 0);
      }

      if (mediaImg) {
        transitionTimeline.to(
          mediaImg,
          { scale: 1, yPercent: 4, duration: 4.5, ease: "none" },
          0
        );
      }

      transitionLines.forEach((line, idx) => {
        transitionTimeline.to(
          line,
          { yPercent: 0, duration: 0.7, ease: "power3.out" },
          0.45 + idx
        );
      });
    } catch (error) {
      usesGsapTransition = false;
      document.documentElement.classList.remove("has-gsap-transition");
      transitionLines.forEach((line) => line.style.removeProperty("transform"));
      console.warn("Transição GSAP indisponível; usando animação padrão.", error);
    }
  }

  function updateTransition() {
    if (!transition) return;

    const rect = transition.getBoundingClientRect();
    const vh = window.innerHeight;
    const dist = Math.max(1, transition.offsetHeight - vh);
    const p = clamp01((vh - rect.top) / dist);

    if (overlay && !usesGsapTransition) overlay.style.opacity = String(p * 0.68);

    if (mediaImg && !prefersReducedMotion && !usesGsapTransition) {
      const t = 1.08 - p * 0.08;
      const ty = p * 4;
      mediaImg.style.transform = `translate3d(0, ${ty}%, 0) scale(${t})`;
    }

    // Revela o texto linha a linha conforme o scroll avança
    if (!usesGsapTransition) {
      transitionLines.forEach((line, idx) => {
        const at = 0.12 + idx * 0.075;
        line.classList.toggle("is-in", p >= at);
      });
    }

    // Vira o tema da interface (header/drawer) ao entrar na área escura
    if (p > 0.16) body.classList.add("is-dark");
    else if (p < 0.04) body.classList.remove("is-dark");
  }

  /* ------------------------------------------------------------------
     Reveal on scroll (fade + translateY / imagem por máscara)
     ------------------------------------------------------------------ */
  const ioTargets = Array.from(
    document.querySelectorAll(".reveal, .reveal-hero, .m-reveal")
  );

  // Stagger leve entre irmãos com .reveal dentro de um mesmo contêiner
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("is-in");

        if (el.classList.contains("reveal")) {
          const parent = el.parentElement;
          if (parent) {
            const siblings = Array.from(parent.querySelectorAll(":scope > .reveal"));
            const idx = siblings.indexOf(el);
            if (siblings.length > 1) {
              el.style.transitionDelay = `${idx * 90}ms`;
            }
          }
        }

        revealObserver.unobserve(el);
      });
    },
    {
      threshold: prefersReducedMotion ? 1 : 0.14,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  ioTargets.forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------------------------------
     Vídeos: autoplay mudo ao revelar e reels carregados sob demanda
     ------------------------------------------------------------------ */
  const autoplayVideos = document.querySelectorAll("[data-autoplay-on-reveal]");

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          video.muted = true;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.25 }
  );

  autoplayVideos.forEach((video) => videoObserver.observe(video));

  document.querySelectorAll(".service-reel-media").forEach((media) => {
    const video = media.querySelector("video");
    const button = media.querySelector(".reel-play");
    const source = video ? video.querySelector("source[data-src]") : null;
    if (!video || !button || !source) return;

    button.addEventListener("click", () => {
      if (!source.hasAttribute("src")) {
        source.src = source.dataset.src;
        video.load();
      }

      media.classList.add("is-loading");
      button.disabled = true;
      button.setAttribute("aria-label", "Carregando vídeo");
      video.controls = true;

      video.play().then(() => {
        media.classList.remove("is-loading");
        media.classList.add("is-started");
      }).catch(() => {
        media.classList.remove("is-loading");
        button.disabled = false;
        button.setAttribute("aria-label", "Tentar reproduzir o vídeo novamente");
      });
    });
  });

  /* ------------------------------------------------------------------
     Contadores da barra de autoridade
     ------------------------------------------------------------------ */
  function animateCount(el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    if (prefersReducedMotion) {
      el.textContent = String(target);
      return;
    }

    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const t = clamp01((now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        animateCount(el);
        countObserver.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );

  document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

  /* ------------------------------------------------------------------
     Drawer mobile
     ------------------------------------------------------------------ */
  const toggle = document.getElementById("navToggle");
  const drawer = document.getElementById("drawer");

  function setMenu(open) {
    body.classList.toggle("menu-open", open);
    body.classList.toggle("no-scroll", open);
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
    if (drawer) drawer.setAttribute("aria-hidden", String(!open));
  }

  if (toggle && drawer) {
    toggle.addEventListener("click", () => {
      setMenu(!body.classList.contains("menu-open"));
    });

    drawer.addEventListener("click", (e) => {
      if (e.target.closest("a")) setMenu(false);
    });

    const headerLogo = header.querySelector(".logo");
    if (headerLogo) {
      headerLogo.addEventListener("click", () => setMenu(false));
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && body.classList.contains("menu-open")) setMenu(false);
    });
  }

  /* ------------------------------------------------------------------
     Scroll handler (raf throttled)
     ------------------------------------------------------------------ */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        updateHeaderScrolled();
        updateTransition();
        updateActiveNav();
        ticking = false;
      });
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  // Estado inicial
  updateHeaderScrolled();
  updateTransition();
  updateActiveNav();
})();
