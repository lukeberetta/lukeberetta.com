if (window.matchMedia('(pointer: fine)').matches) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const cursor = document.createElement('div');
  cursor.id = 'cursor';
  const svgNS = 'http://www.w3.org/2000/svg';
  const dot = document.createElementNS(svgNS, 'svg');
  dot.setAttribute('class', 'cursor-dot');
  dot.setAttribute('width', '20');
  dot.setAttribute('height', '20');
  dot.setAttribute('viewBox', '0 0 20 20');
  const circle = document.createElementNS(svgNS, 'circle');
  circle.setAttribute('cx', '10');
  circle.setAttribute('cy', '10');
  circle.setAttribute('r', '10');
  dot.appendChild(circle);
  cursor.appendChild(dot);
  document.body.appendChild(cursor);

  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  let rafId = null, isVisible = false;

  const setPos = (x, y) => {
    cursor.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
  };

  const tick = () => {
    const dx = targetX - currentX;
    const dy = targetY - currentY;
    if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
      currentX = targetX;
      currentY = targetY;
      setPos(currentX, currentY);
      rafId = null;
      return;
    }
    currentX += dx * 0.18;
    currentY += dy * 0.18;
    setPos(currentX, currentY);
    rafId = requestAnimationFrame(tick);
  };

  document.addEventListener('mousemove', e => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!isVisible) {
      isVisible = true;
      cursor.classList.add('is-visible');
    }
    if (reduceMotion) {
      currentX = targetX;
      currentY = targetY;
      setPos(currentX, currentY);
    } else if (rafId === null) {
      rafId = requestAnimationFrame(tick);
    }
  }, { passive: true });

  document.addEventListener('mousedown', () => cursor.classList.add('is-down'));
  document.addEventListener('mouseup', () => cursor.classList.remove('is-down'));

  document.addEventListener('mouseout', e => {
    if (!e.relatedTarget) {
      isVisible = false;
      cursor.classList.remove('is-visible');
    }
  });

  document.addEventListener('mouseover', e => {
    if (!e.relatedTarget) {
      targetX = e.clientX;
      targetY = e.clientY;
      currentX = targetX;
      currentY = targetY;
      setPos(currentX, currentY);
      if (!isVisible) {
        isVisible = true;
        cursor.classList.add('is-visible');
      }
    }
  });

  document.querySelectorAll('.works-item.unavailable').forEach(item => {
    item.addEventListener('mouseenter', () => cursor.classList.add('is-muted'));
    item.addEventListener('mouseleave', () => cursor.classList.remove('is-muted'));
  });
}
