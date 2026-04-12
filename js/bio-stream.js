(function () {
  function splitLines(p) {
    // Flatten all child nodes into individual word spans, preserving classes (e.g. .orange, .muted)
    const words = [];

    Array.from(p.childNodes).forEach(node => {
      const cls = node.nodeType === Node.ELEMENT_NODE ? node.className : null;
      const tokens = node.textContent.trim().split(/\s+/).filter(Boolean);
      tokens.forEach(token => {
        const span = document.createElement('span');
        if (cls) span.className = cls;
        span.textContent = token;
        words.push(span);
      });
    });

    // Render words inline so the browser can lay them out
    p.innerHTML = '';
    words.forEach((w, i) => {
      if (i > 0) p.appendChild(document.createTextNode(' '));
      p.appendChild(w);
    });

    // Measure: group words that share the same top into a line
    p.getBoundingClientRect(); // force reflow
    const lineGroups = [];
    words.forEach(span => {
      const top = Math.round(span.getBoundingClientRect().top);
      const last = lineGroups[lineGroups.length - 1];
      if (!last || last.top !== top) {
        lineGroups.push({ top, words: [span] });
      } else {
        last.words.push(span);
      }
    });

    // Rebuild: each line → .line-mask > .line-inner
    p.innerHTML = '';
    return lineGroups.map(group => {
      const mask = document.createElement('span');
      mask.className = 'line-mask';

      const inner = document.createElement('span');
      inner.className = 'line-inner';

      group.words.forEach((span, i) => {
        if (i > 0) inner.appendChild(document.createTextNode(' '));
        inner.appendChild(span);
      });

      mask.appendChild(inner);
      p.appendChild(mask);
      return inner;
    });
  }

  function maskItems(selector) {
    const inners = [];
    document.querySelectorAll(selector).forEach(item => {
      const mask = document.createElement('div');
      mask.className = 'line-mask';
      const inner = document.createElement('div');
      inner.className = 'line-inner';
      item.parentNode.insertBefore(mask, item);
      mask.appendChild(inner);
      inner.appendChild(item);
      inners.push(inner);
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

  // Split bio paragraphs into per-line masks
  const allInners = [];
  document.querySelectorAll('.bio p').forEach(p => {
    allInners.push(...splitLines(p));
  });

  // Wrap each list row in a line-mask > line-inner for the reveal animation
  const worksInners = maskItems('.works .works-item');
  const appsInners = maskItems('.apps .works-item');
  const contactInners = maskItems('.contact .works-item');

  // Wrap nav links in masks
  maskNavLinks();
  const navLinks = document.querySelectorAll('.nav .line-inner');

  // Intro animation
  gsap.set(allInners, { y: '110%' });
  gsap.set(navLinks, { y: '110%' });

  gsap.timeline({
    onComplete: () => document.dispatchEvent(new CustomEvent('intro-complete'))
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
    contact: { el: '.contact',  inners: contactInners }
  };

  let currentView = 'home';
  let isAnimating = false;
  let pendingView = null;

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

    gsap.timeline({
      onComplete: () => {
        isAnimating = false;
        if (pendingView) {
          const next = pendingView;
          pendingView = null;
          transitionTo(next);
        }
      }
    })
      .to(from.inners, { y: '110%', duration: 0.6, ease: 'power4.in', stagger: 0.04 })
      .add(() => {
        gsap.set(from.el, { display: 'none' });
        gsap.set(to.inners, { y: '110%' });
        gsap.set(to.el, { display: 'block' });
      })
      .to(to.inners, { y: '0%', duration: 0.9, ease: 'power4.out', stagger: 0.08 });
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
})();
