(function () {
  var fontsReady = Promise.race([
    document.fonts.ready,
    new Promise(function (resolve) { setTimeout(resolve, 2000); })
  ]);
  fontsReady.then(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const orangeSpans = document.querySelectorAll('.bio .orange');
  if (!orangeSpans.length) return;

  // Split each word-span into individual character spans
  const allChars = [];
  orangeSpans.forEach(span => {
    const text = span.textContent;
    span.textContent = '';
    Array.from(text).forEach(char => {
      const s = document.createElement('span');
      s.textContent = char;
      s.style.display = 'inline-block';
      span.appendChild(s);
      allChars.push(s);
    });
  });
  if (!allChars.length) return;

  // Collect the .line-mask ancestors so we can unclip during animation
  const masks = new Set();
  orangeSpans.forEach(span => {
    let el = span.parentElement;
    while (el) {
      if (el.classList.contains('line-mask')) { masks.add(el); break; }
      el = el.parentElement;
    }
  });

  let isAnimating = false;

  function wave() {
    if (isAnimating) return;
    isAnimating = true;
    masks.forEach(m => m.style.overflow = 'visible');
    gsap.to(allChars, {
      keyframes: [
        { y: -10, duration: 0.22, ease: 'power2.out' },
        { y: 0,   duration: 0.28, ease: 'power2.in'  }
      ],
      stagger: { each: 0.04, from: 'start' }
    });
    // delayedCall fires once after the last char finishes, avoiding per-element onComplete issues
    const totalDuration = (allChars.length - 1) * 0.04 + 0.22 + 0.28;
    gsap.delayedCall(totalDuration, () => {
      masks.forEach(m => m.style.overflow = '');
      isAnimating = false;
    });
  }

  orangeSpans.forEach(span => {
    span.addEventListener('click', wave);
  });

  document.addEventListener('intro-complete', wave, { once: true });
  }); // document.fonts.ready
})();
