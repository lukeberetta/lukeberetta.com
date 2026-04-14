if (window.matchMedia('(pointer: fine)').matches) {
  const cursor = document.createElement('div');
  cursor.id = 'cursor';
  document.body.appendChild(cursor);

  const styles = getComputedStyle(document.documentElement);
  const colorAccent = styles.getPropertyValue('--color-accent').trim();
  const colorMuted = styles.getPropertyValue('--color-text-muted').trim();

  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.4, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.4, ease: 'power3' });

  document.addEventListener('mousemove', e => {
    xTo(e.clientX - 10);
    yTo(e.clientY - 10);
    gsap.to(cursor, { opacity: 1, duration: 0.15, overwrite: 'auto' });
  }, { passive: true });

  document.addEventListener('mouseout', e => {
    if (!e.relatedTarget) {
      gsap.to(cursor, { opacity: 0, duration: 0.3, overwrite: 'auto' });
    }
  });

  document.addEventListener('mouseover', e => {
    if (!e.relatedTarget) {
      gsap.set(cursor, { x: e.clientX - 10, y: e.clientY - 10 });
      gsap.to(cursor, { opacity: 1, duration: 0.15, overwrite: 'auto' });
    }
  });

  document.querySelectorAll('.works .works-item:not([data-to])').forEach(item => {
    item.addEventListener('mouseenter', () => {
      gsap.to(cursor, { backgroundColor: colorMuted, duration: 0.2, overwrite: 'auto' });
    });
    item.addEventListener('mouseleave', () => {
      gsap.to(cursor, { backgroundColor: colorAccent, duration: 0.2, overwrite: 'auto' });
    });
  });
}
