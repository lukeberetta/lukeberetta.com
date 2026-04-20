(function () {
  var fontsReady = Promise.race([
    document.fonts.ready,
    new Promise(function (resolve) { setTimeout(resolve, 2000); })
  ]);
  fontsReady.then(function () {

  gsap.registerPlugin(ScrollTrigger);

  function maskContent(selector) {
    const inners = [];
    document.querySelectorAll(selector).forEach(el => {
      if (el.tagName === 'P') {
        // Paragraphs: flatten words, measure line breaks, wrap each line
        const words = [];
        Array.from(el.childNodes).forEach(node => {
          const cls = node.nodeType === Node.ELEMENT_NODE ? node.className : null;
          node.textContent.trim().split(/\s+/).filter(Boolean).forEach(token => {
            const span = document.createElement('span');
            if (cls) span.className = cls;
            span.textContent = token;
            words.push(span);
          });
        });
        el.innerHTML = '';
        words.forEach((w, i) => {
          if (i > 0) el.appendChild(document.createTextNode(' '));
          el.appendChild(w);
        });
        el.getBoundingClientRect(); // force reflow
        const lineGroups = [];
        words.forEach(span => {
          const top = Math.round(span.getBoundingClientRect().top);
          const last = lineGroups[lineGroups.length - 1];
          if (!last || last.top !== top) lineGroups.push({ top, words: [span] });
          else last.words.push(span);
        });
        el.innerHTML = '';
        lineGroups.forEach(group => {
          const mask = document.createElement('span');
          mask.className = 'line-mask';
          const inner = document.createElement('span');
          inner.className = 'line-inner';
          group.words.forEach((span, i) => {
            if (i > 0) inner.appendChild(document.createTextNode(' '));
            inner.appendChild(span);
          });
          mask.appendChild(inner);
          el.appendChild(mask);
          inners.push(inner);
        });
      } else {
        // Block elements: wrap the whole element as one unit
        const mask = document.createElement('div');
        mask.className = 'line-mask';
        const inner = document.createElement('div');
        inner.className = 'line-inner';
        el.parentNode.insertBefore(mask, el);
        mask.appendChild(inner);
        inner.appendChild(el);
        inners.push(inner);
      }
    });
    return inners;
  }

  function maskNavLinks() {
    document.querySelectorAll('.nav a').forEach(a => {
      const mask = document.createElement('div');
      mask.className = 'line-mask';
      const inner = document.createElement('div');
      inner.className = 'line-inner';
      a.parentNode.insertBefore(mask, a);
      inner.appendChild(a);
      mask.appendChild(inner);
    });
  }

  function captureOriginals(selector) {
    return Array.from(document.querySelectorAll(selector)).map(el => ({ el, html: el.innerHTML }));
  }

  const allInners     = maskContent('.bio p');
  const worksInners   = maskContent('.works .works-item');
  const appsInners    = maskContent('.apps .works-item');
  const contactInners = maskContent('.contact .works-item');
  const journeyEl = document.querySelector('.journey');
  journeyEl.style.cssText = 'display:block;visibility:hidden';
  const journeyOriginals = captureOriginals('.journey p');
  const journeyInners = maskContent('.journey p');
  const journeyCarouselWraps = Array.from(document.querySelectorAll('.journey .case-carousel-wrap'));
  journeyEl.style.cssText = '';

  const spritzEl = document.querySelector('.spritz');
  spritzEl.style.cssText = 'display:block;visibility:hidden';
  const spritzOriginals = captureOriginals('.spritz p');
  const spritzInners = maskContent('.spritz p');
  const spritzCarouselWraps = Array.from(document.querySelectorAll('.spritz .case-carousel-wrap'));
  spritzEl.style.cssText = '';

  const kurtosysEl = document.querySelector('.kurtosys');
  kurtosysEl.style.cssText = 'display:block;visibility:hidden';
  const kurtosysOriginals = captureOriginals('.kurtosys p');
  const kurtosysInners = maskContent('.kurtosys p');
  const kurtosysCarouselWraps = Array.from(document.querySelectorAll('.kurtosys .case-carousel-wrap'));
  kurtosysEl.style.cssText = '';

  // Wrap nav links in masks
  maskNavLinks();

  // Cache nav element and non-nav inners once — avoids DOM queries on every frame
  const navEl = document.querySelector('.nav');
  let fadeInners = Array.from(document.querySelectorAll('.line-inner'))
    .filter(el => !el.closest('.nav'));

  // Fade content elements as they approach the nav (replaces gradient overlay)
  // Reads all rects first, then writes opacity — avoids layout thrashing
  function updateFade() {
    const navTop = navEl.getBoundingClientRect().top;
    const fadeEnd = navTop;
    const fadeStart = fadeEnd - 140;

    const tops = fadeInners.map(el => ({ el, top: el.getBoundingClientRect().top }));
    tops.forEach(({ el, top }) => {
      let opacity;
      if (top <= fadeStart) {
        opacity = 1;
      } else if (top >= fadeEnd) {
        opacity = 0;
      } else {
        opacity = 1 - (top - fadeStart) / (fadeEnd - fadeStart);
      }
      el.style.opacity = opacity;
    });
  }

  let fadeTicking = false;
  window.addEventListener('scroll', () => {
    if (!fadeTicking) {
      requestAnimationFrame(() => { updateFade(); fadeTicking = false; });
      fadeTicking = true;
    }
  }, { passive: true });
  let resizeTimer;
  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateFade();
      const newWidth = window.innerWidth;
      if (newWidth !== lastWidth) {
        lastWidth = newWidth;
        // Invalidate cached split widths so case studies re-split on next entry
        Object.keys(csSplitWidths).forEach(k => delete csSplitWidths[k]);
        // If currently viewing a case study, re-split and show all content immediately
        if (caseStudyViews?.has(currentView)) {
          killScrollTriggers(currentView);
          ensureSplit(currentView);
          updateFade();
        }
      }
    }, 150);
  }, { passive: true });

  // Identify back link and separate it from regular nav links
  const backLinkEl = document.querySelector('[data-back]');
  const backLinkInner = backLinkEl.closest('.line-inner');
  const backLinkMask = backLinkInner.closest('.line-mask');
  backLinkMask.classList.add('back-mask');

  const allNavInners = Array.from(document.querySelectorAll('.nav .line-inner'));
  const navLinks = allNavInners.filter(inner => inner !== backLinkInner);

  // Set initial aria-hidden state — home view is visible, all others are hidden
  document.querySelector('.bio').setAttribute('aria-hidden', 'false');

  // Intro animation
  gsap.set(allInners, { y: '110%' });
  gsap.set(navLinks, { y: '110%' });
  gsap.set(backLinkInner, { y: '110%' });
  document.body.classList.remove('loading');

  gsap.timeline({
    onUpdate: updateFade,
    onComplete: () => {
      updateFade();
      document.dispatchEvent(new CustomEvent('intro-complete'));
    }
  })
    .to(allInners, {
      y: '0%',
      duration: 0.9,
      ease: 'power4.out',
      stagger: 0.08
    })
    .to(navLinks, {
      y: '0%',
      stagger: 0.08,
      duration: 0.7,
      ease: 'power4.out'
    }, '-=0.3');

  // ScrollTrigger state per case study
  const csSplitWidths = { journey: window.innerWidth, spritz: window.innerWidth, kurtosys: window.innerWidth };
  const csScrollTriggers = {};

  function killScrollTriggers(key) {
    (csScrollTriggers[key] || []).forEach(st => st.kill());
    csScrollTriggers[key] = null;
  }

  function setupScrollTriggers(key) {
    const inners = views[key].inners;
    const vh = window.innerHeight;
    const aboveFold = [];
    const belowFold = [];
    inners.forEach(inner => {
      (inner.getBoundingClientRect().top < vh * 0.9 ? aboveFold : belowFold).push(inner);
    });
    if (aboveFold.length) {
      gsap.to(aboveFold, { y: '0%', duration: 0.9, ease: 'power4.out', stagger: 0.08 });
    }
    if (belowFold.length) {
      csScrollTriggers[key] = ScrollTrigger.batch(belowFold, {
        onEnter: batch => gsap.to(batch, { y: '0%', duration: 0.8, ease: 'power4.out', stagger: 0.06 }),
        start: 'top 88%',
      });
    }
  }

  function ensureSplit(key) {
    if (csSplitWidths[key] === window.innerWidth) return;
    const view = views[key];
    view.originals.forEach(({ el, html }) => { el.innerHTML = html; });
    const csEl = document.querySelector(view.el);
    const isHidden = getComputedStyle(csEl).display === 'none';
    if (isHidden) csEl.style.cssText = 'display:block;visibility:hidden';
    view.inners = maskContent(view.el + ' p');
    if (isHidden) csEl.style.cssText = '';
    csSplitWidths[key] = window.innerWidth;
    // Refresh fadeInners to include new line-inner elements
    fadeInners = Array.from(document.querySelectorAll('.line-inner'))
      .filter(el => !el.closest('.nav'));
  }

  // View registry
  const views = {
    home:    { el: '.bio',      inners: allInners     },
    works:   { el: '.works',    inners: worksInners   },
    apps:    { el: '.apps',     inners: appsInners    },
    contact: { el: '.contact',  inners: contactInners },
    journey:  { el: '.journey',   inners: journeyInners,  extras: journeyCarouselWraps,  originals: journeyOriginals  },
    spritz:   { el: '.spritz',    inners: spritzInners,   extras: spritzCarouselWraps,   originals: spritzOriginals   },
    kurtosys: { el: '.kurtosys',  inners: kurtosysInners, extras: kurtosysCarouselWraps, originals: kurtosysOriginals }
  };

  let currentView = 'home';
  let isAnimating = false;
  let pendingView = null;
  let activeTimeline = null;

  const caseStudyViews = new Set(
    Object.keys(views).filter(k => !['home','works','apps','contact'].includes(k))
  );

  // Prevent browser from auto-restoring scroll on back/forward — we handle it in transitionTo
  history.scrollRestoration = 'manual';

  // Seed the initial history entry so popstate always has state
  const initialHash = location.hash.slice(1);
  const initialView = (initialHash && views[initialHash]) ? initialHash : 'home';
  history.replaceState({ view: initialView }, '', location.href);

  function setActiveNavLink(name) {
    document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
    const link = document.querySelector(`.nav a[data-to="${name}"]`);
    if (link) link.classList.add('active');
  }

  function transitionTo(name, { pushHistory = true } = {}) {
    if (isAnimating) {
      if (name !== currentView) pendingView = name;
      return;
    }
    if (name === currentView) return;

    // Reconcile nav state whenever we cross the case-study boundary
    const leavingCase = caseStudyViews.has(currentView);
    const enteringCase = caseStudyViews.has(name);
    if (!leavingCase && enteringCase) {
      enterCaseStudy();
    } else if (leavingCase && !enteringCase) {
      exitCaseStudy(name);
    } else if (!leavingCase && !enteringCase) {
      setActiveNavLink(name);
    }
    // case-to-case: back link stays visible, no nav-link active state

    if (pushHistory) {
      history.pushState({ view: name }, '', name === 'home' ? location.pathname : '#' + name);
    }

    isAnimating = true;
    pendingView = null;

    const fromKey = currentView;
    const from = views[currentView];
    const to = views[name];
    currentView = name;

    activeTimeline = gsap.timeline({
      onUpdate: updateFade,
      onComplete: () => {
        isAnimating = false;
        activeTimeline = null;
        updateFade();
        if (pendingView) {
          const next = pendingView;
          pendingView = null;
          transitionTo(next);
        }
      }
    })
      .to(from.el, { opacity: 0, duration: 0.3, ease: 'power2.in' })
      .to(from.extras || [], { opacity: 0, duration: 0.3, ease: 'power2.in' }, '<')
      .add(() => {
        document.querySelectorAll(from.el + ' video').forEach(v => { v.pause(); v.currentTime = 0; });
        if (caseStudyViews.has(fromKey)) killScrollTriggers(fromKey);
        gsap.set(from.el, { display: 'none', opacity: 1 });
        document.querySelector(from.el).setAttribute('aria-hidden', 'true');
        if (caseStudyViews.has(name)) ensureSplit(name);
        gsap.set(to.inners, { y: '110%' });
        gsap.set(to.el, { display: 'block' });
        document.querySelector(to.el).setAttribute('aria-hidden', 'false');
        window.scrollTo(0, 0);
        if (to.extras?.length) gsap.set(to.extras, { opacity: 0 });
        if (caseStudyViews.has(name)) setupScrollTriggers(name);
      });

    if (!caseStudyViews.has(name)) {
      activeTimeline.to(to.inners, { y: '0%', duration: 0.9, ease: 'power4.out', stagger: 0.08 });
    }

    activeTimeline.fromTo(
      to.extras || [],
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power1.inOut' },
      caseStudyViews.has(name) ? '+=0' : '<'
    );
  }

  // Nav active state + click handlers
  const toHomeLink = document.querySelector('[data-to="home"]');
  toHomeLink.classList.add('active');

  document.querySelectorAll('.nav a[data-to]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      transitionTo(link.dataset.to);
    });
  });

  // Works item click handlers (case study navigation)
  document.querySelectorAll('.works-item[data-to]').forEach(item => {
    item.addEventListener('click', () => transitionTo(item.dataset.to));
  });

  // Back link handler
  backLinkEl.addEventListener('click', e => {
    e.preventDefault();
    transitionTo('works');
  });

  // Helper: slide nav links out and back link in (used by works-item clicks and popstate)
  function enterCaseStudy() {
    document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
    gsap.to(navLinks, {
      y: '110%', duration: 0.5, ease: 'power4.in', stagger: 0.04,
      onComplete: () => {
        navLinks.forEach(inner => { inner.closest('.line-mask').style.display = 'none'; });
        backLinkMask.classList.add('visible');
        gsap.fromTo(backLinkInner, { y: '110%' }, { y: '0%', duration: 0.7, ease: 'power4.out' });
      }
    });
  }

  // Helper: slide back link out and nav links in (called from transitionTo when leaving a case study)
  function exitCaseStudy(activeView) {
    gsap.to(backLinkInner, {
      y: '110%', duration: 0.5, ease: 'power4.in',
      onComplete: () => {
        backLinkMask.classList.remove('visible');
        navLinks.forEach(inner => { inner.closest('.line-mask').style.display = ''; });
        gsap.fromTo(navLinks, { y: '110%' }, { y: '0%', duration: 0.7, ease: 'power4.out', stagger: 0.08 });
      }
    });
    setActiveNavLink(activeView);
  }

  // Browser back/forward
  window.addEventListener('popstate', e => {
    const target = (e.state?.view && views[e.state.view]) ? e.state.view : 'home';
    transitionTo(target, { pushHistory: false });
  });

  // Deep-link: if the page loaded with a hash, navigate there after the intro
  if (initialView !== 'home') {
    document.addEventListener('intro-complete', () => {
      transitionTo(initialView, { pushHistory: false });
    }, { once: true });
  }

  }); // document.fonts.ready
})();
