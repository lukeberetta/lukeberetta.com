(function () {
  document.fonts.ready.then(function () {

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

  const allInners     = maskContent('.bio p');
  const worksInners   = maskContent('.works .works-item');
  const appsInners    = maskContent('.apps .works-item');
  const contactInners = maskContent('.contact .works-item');
  const journeyEl = document.querySelector('.journey');
  journeyEl.style.cssText = 'display:block;visibility:hidden';
  const journeyInners = maskContent('.journey p');
  const journeyCarouselWraps = Array.from(document.querySelectorAll('.journey .case-carousel-wrap'));
  journeyEl.style.cssText = '';

  const spritzEl = document.querySelector('.spritz');
  spritzEl.style.cssText = 'display:block;visibility:hidden';
  const spritzInners = maskContent('.spritz p');
  const spritzCarouselWraps = Array.from(document.querySelectorAll('.spritz .case-carousel-wrap'));
  spritzEl.style.cssText = '';

  // Wrap nav links in masks
  maskNavLinks();

  // Cache nav element and non-nav inners once — avoids DOM queries on every frame
  const navEl = document.querySelector('.nav');
  const fadeInners = Array.from(document.querySelectorAll('.line-inner'))
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

  window.addEventListener('scroll', updateFade, { passive: true });
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateFade, 100);
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

  // View registry
  const views = {
    home:    { el: '.bio',      inners: allInners     },
    works:   { el: '.works',    inners: worksInners   },
    apps:    { el: '.apps',     inners: appsInners    },
    contact: { el: '.contact',  inners: contactInners },
    journey: { el: '.journey',  inners: journeyInners, extras: journeyCarouselWraps },
    spritz:  { el: '.spritz',   inners: spritzInners,  extras: spritzCarouselWraps }
  };

  let currentView = 'home';
  let isAnimating = false;
  let pendingView = null;
  let activeTimeline = null;

  function transitionTo(name) {
    if (isAnimating) {
      if (name !== currentView) pendingView = name;
      return;
    }
    if (name === currentView) return;
    isAnimating = true;
    pendingView = null;

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
        gsap.set(from.el, { display: 'none', opacity: 1 });
        gsap.set(to.inners, { y: '110%' });
        gsap.set(to.el, { display: 'block' });
        window.scrollTo(0, 0);
        if (to.extras?.length) gsap.set(to.extras, { opacity: 0 });
        document.querySelectorAll(to.el + ' video').forEach(v => v.play().catch(() => {}));
      })
      .to(to.inners, { y: '0%', duration: 0.9, ease: 'power4.out', stagger: 0.08 })
      .fromTo(to.extras || [], { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power1.inOut' }, '<');
  }

  // Nav active state + click handlers
  const toHomeLink = document.querySelector('[data-to="home"]');
  toHomeLink.classList.add('active');

  document.querySelectorAll('.nav a[data-to]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
      transitionTo(link.dataset.to);
    });
  });

  // Works item click handlers (case study navigation)
  document.querySelectorAll('.works-item[data-to]').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
      gsap.to(navLinks, {
        y: '110%', duration: 0.5, ease: 'power4.in', stagger: 0.04,
        onComplete: () => {
          // Hide nav masks so Back anchors to the same bottom-left position
          navLinks.forEach(inner => { inner.closest('.line-mask').style.display = 'none'; });
          backLinkMask.classList.add('visible');
          gsap.fromTo(backLinkInner, { y: '110%' }, { y: '0%', duration: 0.7, ease: 'power4.out' });
        }
      });
      transitionTo(item.dataset.to);
    });
  });

  // Back link handler
  backLinkEl.addEventListener('click', e => {
    e.preventDefault();
    // If still mid-entrance animation, kill it so Back responds immediately
    if (isAnimating && activeTimeline) {
      activeTimeline.kill();
      activeTimeline = null;
      gsap.set(views[currentView].el, { display: 'block', opacity: 1 });
      isAnimating = false;
      pendingView = null;
    }
    gsap.to(backLinkInner, {
      y: '110%', duration: 0.5, ease: 'power4.in',
      onComplete: () => {
        backLinkMask.classList.remove('visible');
        // Restore nav masks before animating them back in
        navLinks.forEach(inner => { inner.closest('.line-mask').style.display = ''; });
        gsap.fromTo(navLinks, { y: '110%' }, { y: '0%', duration: 0.7, ease: 'power4.out', stagger: 0.08 });
      }
    });
    document.querySelector('[data-to="works"]').classList.add('active');
    transitionTo('works');
  });

  }); // document.fonts.ready
})();
