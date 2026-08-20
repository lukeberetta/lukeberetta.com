(function () {
  var fontsReady = Promise.race([
    document.fonts.ready,
    new Promise(function (resolve) { setTimeout(resolve, 2000); })
  ]);
  fontsReady.then(function () {

    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const D = (d) => reduceMotion ? 0 : d;

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

    const allInners = maskContent('.bio p');
    const worksInners = maskContent('.works .works-item');
    const appsInners = maskContent('.apps .works-item');
    const contactInners = maskContent('.contact .works-item');
    const CASE_CONTENT = ':is(p, h2)';

    const journeyEl = document.querySelector('.journey');
    journeyEl.style.cssText = 'display:block;visibility:hidden';
    const journeyOriginals = captureOriginals('.journey ' + CASE_CONTENT);
    const journeyInners = maskContent('.journey ' + CASE_CONTENT);
    const journeyCarouselWraps = Array.from(document.querySelectorAll('.journey .case-carousel-wrap'));
    journeyEl.style.cssText = '';

    const spritzEl = document.querySelector('.spritz');
    spritzEl.style.cssText = 'display:block;visibility:hidden';
    const spritzOriginals = captureOriginals('.spritz ' + CASE_CONTENT);
    const spritzInners = maskContent('.spritz ' + CASE_CONTENT);
    const spritzCarouselWraps = Array.from(document.querySelectorAll('.spritz .case-carousel-wrap'));
    spritzEl.style.cssText = '';

    const kurtosysEl = document.querySelector('.kurtosys');
    kurtosysEl.style.cssText = 'display:block;visibility:hidden';
    const kurtosysOriginals = captureOriginals('.kurtosys ' + CASE_CONTENT);
    const kurtosysInners = maskContent('.kurtosys ' + CASE_CONTENT);
    const kurtosysCarouselWraps = Array.from(document.querySelectorAll('.kurtosys .case-carousel-wrap'));
    kurtosysEl.style.cssText = '';

    const finnEl = document.querySelector('.finn');
    finnEl.style.cssText = 'display:block;visibility:hidden';
    const finnOriginals = captureOriginals('.finn ' + CASE_CONTENT);
    const finnInners = maskContent('.finn ' + CASE_CONTENT);
    const finnCarouselWraps = Array.from(document.querySelectorAll('.finn .case-carousel-wrap'));
    finnEl.style.cssText = '';

    const makereignEl = document.querySelector('.makereign');
    makereignEl.style.cssText = 'display:block;visibility:hidden';
    const makereignOriginals = captureOriginals('.makereign ' + CASE_CONTENT);
    const makereignInners = maskContent('.makereign ' + CASE_CONTENT);
    const makereignCarouselWraps = Array.from(document.querySelectorAll('.makereign .case-carousel-wrap'));
    makereignEl.style.cssText = '';

    const gateEl = document.querySelector('.gate');
    gateEl.style.cssText = 'display:block;visibility:hidden';
    const gateInners = maskContent('.gate > ' + CASE_CONTENT);
    const gateForm = document.querySelector('.gate-form');
    const gateInput = document.querySelector('.gate-input');
    const gateError = document.querySelector('.gate-error');
    gateEl.style.cssText = '';

    const peachEl = document.querySelector('.peach');
    peachEl.style.cssText = 'display:block;visibility:hidden';
    const peachOriginals = captureOriginals('.peach ' + CASE_CONTENT);
    const peachInners = maskContent('.peach ' + CASE_CONTENT);
    const peachCarouselWraps = Array.from(document.querySelectorAll('.peach .case-carousel-wrap'));
    peachEl.style.cssText = '';

    // Wrap nav links in masks
    maskNavLinks();

    const navEl = document.querySelector('.nav');
    let fadeInners = Array.from(document.querySelectorAll('.line-inner')).filter(el => !el.closest('.nav'));

    // Per-element document-top cache: built once per view, invalidated on resize/re-split.
    // offsetTop tree-walking is transform-independent, so y:110% elements don't corrupt it.
    let fadePosCache = null;

    function getNaturalDocTop(el) {
      let top = 0;
      let node = el;
      while (node) { top += node.offsetTop || 0; node = node.offsetParent; }
      return top;
    }

    function buildFadeCache() {
      fadePosCache = fadeInners.map(el => ({ el, docTop: getNaturalDocTop(el) }));
    }

    // On scroll: pure arithmetic against cache — zero DOM reads per frame.
    // Falls back to live getBCR only when cache is stale (during transitions).
    function updateFade() {
      const fadeEnd = window.innerHeight * (window.innerWidth <= 600 ? 0.92 : 0.85);
      const fadeStart = fadeEnd - 200;

      if (fadePosCache) {
        const scrollY = window.scrollY;
        fadePosCache.forEach(({ el, docTop }) => {
          const top = docTop - scrollY;
          el.style.opacity = top <= fadeStart ? 1 : top >= fadeEnd ? 0 : 1 - (top - fadeStart) / (fadeEnd - fadeStart);
        });
      } else {
        const rects = fadeInners.map(el => ({ el, rect: el.getBoundingClientRect() }));
        rects.forEach(({ el, rect }) => {
          const top = rect.top;
          el.style.opacity = top <= fadeStart ? 1 : top >= fadeEnd ? 0 : 1 - (top - fadeStart) / (fadeEnd - fadeStart);
        });
      }
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
            const extras = views[currentView].extras;
            if (extras?.length) gsap.set(extras, { opacity: 1 });
            buildFadeCache();
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

    // Intro animation
    gsap.set(allInners, { y: '110%' });
    gsap.set(navLinks, { y: '110%' });
    gsap.set(backLinkInner, { y: '110%' });
    document.body.classList.remove('loading');

    if (reduceMotion) {
      gsap.set(allInners, { y: '0%' });
      gsap.set(navLinks, { y: '0%' });
      buildFadeCache();
      updateFade();
      requestAnimationFrame(() => document.dispatchEvent(new CustomEvent('intro-complete')));
    } else {
      gsap.timeline({
        onUpdate: updateFade,
        onComplete: () => {
          buildFadeCache();
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
    }

    // ScrollTrigger state per case study
    const csSplitWidths = { journey: window.innerWidth, spritz: window.innerWidth, kurtosys: window.innerWidth, peach: window.innerWidth, makereign: window.innerWidth, finn: window.innerWidth };
    const csScrollTriggers = {};

    function killScrollTriggers(key) {
      (csScrollTriggers[key] || []).forEach(st => st.kill());
      csScrollTriggers[key] = null;
    }

    function setupScrollTriggers(key) {
      const inners = views[key].inners;
      const extras = views[key].extras || [];
      const vh = window.innerHeight;
      const aboveFold = [];
      const belowFold = [];
      inners.forEach(inner => {
        (inner.getBoundingClientRect().top < vh * 0.9 ? aboveFold : belowFold).push(inner);
      });
      if (reduceMotion) {
        gsap.set(inners, { y: '0%' });
        if (extras.length) gsap.set(extras, { opacity: 1 });
        return;
      }
      if (aboveFold.length) {
        gsap.to(aboveFold, { y: '0%', duration: 0.9, ease: 'power4.out', stagger: 0.08 });
      }
      const triggers = [];
      if (belowFold.length) {
        triggers.push(...ScrollTrigger.batch(belowFold, {
          onEnter: batch => gsap.to(batch, { y: '0%', duration: 0.8, ease: 'power4.out', stagger: 0.06 }),
          start: 'top 88%',
        }));
      }
      if (extras.length) {
        triggers.push(...ScrollTrigger.batch(extras, {
          onEnter: batch => gsap.to(batch, { opacity: 1, duration: 0.8, ease: 'power1.inOut', stagger: 0.1 }),
          start: 'top 88%',
        }));
      }
      if (triggers.length) csScrollTriggers[key] = triggers;
    }

    function ensureSplit(key) {
      if (csSplitWidths[key] === window.innerWidth) return;
      const view = views[key];
      view.originals.forEach(({ el, html }) => { el.innerHTML = html; });
      const csEl = document.querySelector(view.el);
      const isHidden = getComputedStyle(csEl).display === 'none';
      if (isHidden) csEl.style.cssText = 'display:block;visibility:hidden';
      view.inners = maskContent(view.el + ' ' + CASE_CONTENT);
      if (isHidden) csEl.style.cssText = '';
      csSplitWidths[key] = window.innerWidth;
      fadeInners = Array.from(document.querySelectorAll('.line-inner')).filter(el => !el.closest('.nav'));
      fadePosCache = null;
    }

    // View registry
    const views = {
      home: { el: '.bio', inners: allInners },
      works: { el: '.works', inners: worksInners },
      apps: { el: '.apps', inners: appsInners },
      contact: { el: '.contact', inners: contactInners },
      gate: { el: '.gate', inners: gateInners, extras: [gateForm] },
      journey: { el: '.journey', inners: journeyInners, extras: journeyCarouselWraps, originals: journeyOriginals },
      spritz: { el: '.spritz', inners: spritzInners, extras: spritzCarouselWraps, originals: spritzOriginals },
      kurtosys: { el: '.kurtosys', inners: kurtosysInners, extras: kurtosysCarouselWraps, originals: kurtosysOriginals },
      peach: { el: '.peach', inners: peachInners, extras: peachCarouselWraps, originals: peachOriginals },
      makereign: { el: '.makereign', inners: makereignInners, extras: makereignCarouselWraps, originals: makereignOriginals },
      finn: { el: '.finn', inners: finnInners, extras: finnCarouselWraps, originals: finnOriginals }
    };

    let currentView = 'home';
    let isAnimating = false;
    let pendingView = null;
    let activeTimeline = null;

    const caseStudyViews = new Set(
      Object.keys(views).filter(k => !['home', 'works', 'apps', 'contact', 'gate'].includes(k))
    );

    // Views that swap the nav links for the back link. The gate is included so
    // the locked screen offers the same way out as the case study behind it.
    const backNavViews = new Set([...caseStudyViews, 'gate']);

    // ── Password gate ────────────────────────────────────────────────────
    // NOTE: this is a client-side speed bump, not access control. The case
    // study markup ships in index.html and is readable via View Source or
    // curl regardless of this check. For real protection, put the content
    // behind Cloudflare Access or a Worker.
    const GATE_HASH = '493cfcb7eb43b2fc07b6de200d7d7df978b4bee4db859e5e7e2e600ca0b54190';
    const GATE_KEY = 'lb_cs_unlocked';

    let unlocked = false;
    try { unlocked = localStorage.getItem(GATE_KEY) === GATE_HASH; } catch (e) { /* private mode */ }

    // Where to send the visitor once they unlock, and whether the gate pushed a
    // history entry that unlocking should overwrite
    let gateTarget = null;
    let gateReplace = true;

    async function sha256(str) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function setGateError(msg) {
      gateError.textContent = msg;
      gateError.classList.toggle('is-error', !!msg);
    }

    gateForm.addEventListener('submit', async e => {
      e.preventDefault();
      const value = gateInput.value.trim();
      if (!value) return;

      let hash;
      try {
        hash = await sha256(value);
      } catch (err) {
        // crypto.subtle is unavailable on insecure origins (plain http)
        setGateError('Unable to verify — try over https.');
        return;
      }

      if (hash !== GATE_HASH) {
        setGateError('Incorrect password.');
        gateInput.select();
        return;
      }

      unlocked = true;
      try { localStorage.setItem(GATE_KEY, GATE_HASH); } catch (err) { /* private mode */ }
      setGateError('');
      gateInput.value = '';
      gateInput.blur();

      // Overwrite the gate's history entry so back from the case study skips it.
      // If the gate never pushed one (deep link / popstate), leave history alone —
      // the URL already points at the right place.
      const target = gateTarget || 'works';
      const replace = gateTarget ? gateReplace : true;
      gateTarget = null;
      transitionTo(target, { pushHistory: false, replaceHistory: replace });
    });

    // Prevent browser from auto-restoring scroll on back/forward — we handle it in transitionTo
    history.scrollRestoration = 'manual';

    // Seed the initial history entry so popstate always has state
    const initialHash = location.hash.slice(1);
    const isValidHash = !!(initialHash && views[initialHash]);
    const initialView = isValidHash ? initialHash : 'home';
    history.replaceState({ view: initialView }, '', isValidHash ? location.href : location.pathname);

    function setActiveNavLink(name) {
      document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.nav a[data-to="${name}"]`);
      if (link) link.classList.add('active');
    }

    function transitionTo(name, { pushHistory = true, replaceHistory = false } = {}) {
      if (isAnimating) {
        if (name !== currentView) pendingView = name;
        return;
      }

      // Locked case study → divert to the gate, remembering the intended target.
      // Runs before the same-view bail-out so re-picking a case study while the
      // gate is open still updates where unlocking sends you.
      if (caseStudyViews.has(name) && !unlocked) {
        gateTarget = name;
        setGateError('');
        gateInput.value = '';

        // Already on the gate: just retarget. Pushing again would stack duplicate
        // gate entries and force multiple back presses to escape.
        if (currentView === 'gate') {
          gateInput.focus();
          return;
        }

        // Give the gate its own history entry at the *current* URL, so browser back
        // returns to the list the visitor came from rather than skipping past it.
        // Unlocking then replaces this entry with the real destination.
        gateReplace = pushHistory;
        if (pushHistory) history.pushState({ view: 'gate' }, '', location.href);
        name = 'gate';
        pushHistory = false;
      }

      if (name === currentView) return;

      // Reconcile nav state whenever we cross the case-study boundary
      const leavingCase = backNavViews.has(currentView);
      const enteringCase = backNavViews.has(name);
      if (!leavingCase && enteringCase) {
        enterCaseStudy();
      } else if (leavingCase && !enteringCase) {
        exitCaseStudy(name);
      } else if (!leavingCase && !enteringCase) {
        setActiveNavLink(name);
      }
      // case-to-case: back link stays visible, no nav-link active state

      const url = name === 'home' ? location.pathname : '#' + name;
      if (replaceHistory) {
        history.replaceState({ view: name }, '', url);
      } else if (pushHistory) {
        history.pushState({ view: name }, '', url);
      }

      isAnimating = true;
      pendingView = null;
      fadePosCache = null;

      const fromKey = currentView;
      const from = views[currentView];
      const to = views[name];
      currentView = name;

      activeTimeline = gsap.timeline({
        onUpdate: updateFade,
        onComplete: () => {
          isAnimating = false;
          activeTimeline = null;
          buildFadeCache();
          updateFade();
          if (pendingView) {
            const next = pendingView;
            pendingView = null;
            transitionTo(next);
          }
        }
      })
        .to(from.el, { opacity: 0, duration: D(0.3), ease: 'power2.in' })
        .to(from.extras || [], { opacity: 0, duration: D(0.3), ease: 'power2.in' }, '<')
        .add(() => {
          document.querySelectorAll(from.el + ' video').forEach(v => { v.pause(); v.currentTime = 0; });
          if (caseStudyViews.has(fromKey)) killScrollTriggers(fromKey);
          gsap.set(from.el, { display: 'none', opacity: 1 });
          if (caseStudyViews.has(name)) ensureSplit(name);
          gsap.set(to.inners, { y: '110%' });
          gsap.set(to.el, { display: 'block' });
          window.scrollTo(0, 0);
          if (to.extras?.length) gsap.set(to.extras, { opacity: 0 });
          if (caseStudyViews.has(name)) setupScrollTriggers(name);
        });

      if (!caseStudyViews.has(name)) {
        activeTimeline.to(to.inners, { y: '0%', duration: D(0.9), ease: 'power4.out', stagger: reduceMotion ? 0 : 0.08 });
        if (to.extras?.length) {
          activeTimeline.fromTo(to.extras, { opacity: 0 }, { opacity: 1, duration: D(0.8), ease: 'power1.inOut' }, '<');
        }
      }

      if (name === 'gate') activeTimeline.add(() => gateInput.focus());
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
        y: '110%', duration: D(0.5), ease: 'power4.in', stagger: reduceMotion ? 0 : 0.04,
        onComplete: () => {
          navLinks.forEach(inner => { inner.closest('.line-mask').style.display = 'none'; });
          backLinkMask.classList.add('visible');
          gsap.fromTo(backLinkInner, { y: '110%' }, { y: '0%', duration: D(0.7), ease: 'power4.out' });
        }
      });
    }

    // Helper: slide back link out and nav links in (called from transitionTo when leaving a case study)
    function exitCaseStudy(activeView) {
      gsap.to(backLinkInner, {
        y: '110%', duration: D(0.5), ease: 'power4.in',
        onComplete: () => {
          backLinkMask.classList.remove('visible');
          navLinks.forEach(inner => { inner.closest('.line-mask').style.display = ''; });
          gsap.fromTo(navLinks, { y: '110%' }, { y: '0%', duration: D(0.7), ease: 'power4.out', stagger: reduceMotion ? 0 : 0.08 });
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
