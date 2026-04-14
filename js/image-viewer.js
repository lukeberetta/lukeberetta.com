(function () {
  const MARGIN = () => window.innerWidth <= 600 ? 16 : 32;

  // ── Elements ────────────────────────────────────────────────────────────────
  const backdrop = document.createElement('div');
  backdrop.id = 'img-viewer-backdrop';
  document.body.appendChild(backdrop);

  const overlay = document.createElement('div');
  overlay.id = 'img-viewer';
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Image viewer');

  const stage = document.createElement('div');
  stage.id = 'img-viewer-stage';

  const viewImg = document.createElement('img');
  viewImg.id = 'img-viewer-img';
  viewImg.draggable = false;

  const viewVideo = document.createElement('video');
  viewVideo.id = 'img-viewer-video';
  viewVideo.autoplay = true;
  viewVideo.loop = true;
  viewVideo.muted = true;
  viewVideo.playsInline = true;
  viewVideo.controls = true;
  gsap.set(viewVideo, { display: 'none' });

  const closeBtn = document.createElement('button');
  closeBtn.id = 'img-viewer-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  stage.appendChild(viewImg);
  stage.appendChild(viewVideo);
  overlay.appendChild(stage);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  // ── State ────────────────────────────────────────────────────────────────────
  let scale = 1;
  let panX = 0;
  let panY = 0;
  let isOpen = false;
  let originEl = null;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let lastTouchDist = 0;
  let lastTap = 0;

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 10;

  // ── Transform ─────────────────────────────────────────────────────────────────
  function applyTransform() {
    gsap.set(viewImg, { x: panX, y: panY, scale });
  }

  function resetTransform(animate) {
    if (animate) {
      gsap.to(viewImg, { x: 0, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' });
    } else {
      gsap.set(viewImg, { x: 0, y: 0, scale: 1 });
    }
    scale = 1;
    panX = 0;
    panY = 0;
  }

  // ── Open / close ──────────────────────────────────────────────────────────────
  let isVideo = false;

  function open(src, alt, el, video) {
    originEl = el;
    isVideo = !!video;

    if (isVideo) {
      overlay.classList.add('is-video');
      gsap.set(viewImg, { display: 'none' });
      viewVideo.src = src;
      gsap.set(viewVideo, { display: 'block' });
    } else {
      overlay.classList.remove('is-video');
      gsap.set(viewVideo, { display: 'none' });
      viewImg.src = src;
      viewImg.alt = alt || '';
      gsap.set(viewImg, { display: 'block' });
    }

    resetTransform(false);

    const customCursor = document.getElementById('cursor');
    if (customCursor) customCursor.style.display = 'none';

    const rect = el.getBoundingClientRect();
    const m = MARGIN();
    const bg = el.style.background || el.style.backgroundColor || '#101010';

    // Backdrop fade in
    gsap.set(backdrop, { display: 'block' });
    gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out' });

    // Start overlay at thumbnail position
    gsap.set(overlay, {
      display: 'flex',
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      borderRadius: 4,
      background: bg,
    });

    // Hide close button until expansion is done
    gsap.set(closeBtn, { opacity: 0 });

    // Expand to full size
    gsap.to(overlay, {
      top: m,
      left: m,
      width: window.innerWidth - m * 2,
      height: window.innerHeight - m * 2,
      borderRadius: 4,
      duration: 0.55,
      ease: 'power3.inOut',
      onComplete: () => {
        gsap.to(closeBtn, { opacity: 1, duration: 0.2, ease: 'power2.out' });
      }
    });

    isOpen = true;
  }

  function close() {
    if (!isOpen || !originEl) return;
    isOpen = false;

    const rect = originEl.getBoundingClientRect();

    // Hide close button immediately
    gsap.to(closeBtn, { opacity: 0, duration: 0.15 });

    // Fade out the media during collapse so there's no size-mismatch snap at the end
    const activeMedia = isVideo ? viewVideo : viewImg;
    gsap.to(activeMedia, { opacity: 0, duration: 0.25, ease: 'power2.in' });

    // Backdrop fade out
    gsap.to(backdrop, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => gsap.set(backdrop, { display: 'none' })
    });

    const customCursor = document.getElementById('cursor');
    if (customCursor) customCursor.style.display = '';

    // Collapse back to thumbnail
    gsap.to(overlay, {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      borderRadius: 4,
      duration: 0.45,
      ease: 'power3.inOut',
      onComplete: () => {
        gsap.set(overlay, { display: 'none', clearProps: 'top,left,width,height' });
        if (isVideo) {
          overlay.classList.remove('is-video');
          viewVideo.pause();
          viewVideo.src = '';
          gsap.set(viewVideo, { opacity: 1, display: 'none' });
          gsap.set(viewImg, { display: 'block' });
        } else {
          gsap.set(viewImg, { opacity: 1 });
          viewImg.src = '';
        }
      }
    });
  }

  // ── Triggers ──────────────────────────────────────────────────────────────────
  document.querySelectorAll('.carousel-slide').forEach(el => {
    // Inject expand button
    const expandBtn = document.createElement('button');
    expandBtn.className = 'carousel-expand';
    expandBtn.setAttribute('aria-label', 'Expand image');
    expandBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><polyline points="9,1 13,1 13,5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="5,13 1,13 1,9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="13" y1="1" x2="8" y2="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="1" y1="13" x2="6" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
    el.appendChild(expandBtn);

    const vid = el.querySelector('video');
    if (vid) {
      el.addEventListener('click', () => {
        if (window.innerWidth <= 600) return;
        open(vid.src, null, el, true);
      });
    } else {
      el.addEventListener('click', () => {
        if (window.innerWidth <= 600) return;
        const img = el.querySelector('img');
        if (img) open(img.src, img.alt, el);
      });
    }
  });


  closeBtn.addEventListener('click', close);

  backdrop.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') close();
    if (e.key === '0') resetTransform(true);
  });

  // ── Scroll to zoom ────────────────────────────────────────────────────────────
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = stage.getBoundingClientRect();
    const mx = e.clientX - rect.left - rect.width / 2;
    const my = e.clientY - rect.top - rect.height / 2;
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = Math.min(Math.max(scale * factor, MIN_SCALE), MAX_SCALE);
    const ratio = newScale / scale;
    panX = mx + (panX - mx) * ratio;
    panY = my + (panY - my) * ratio;
    scale = newScale;
    applyTransform();
  }, { passive: false });

  // ── Mouse pan ─────────────────────────────────────────────────────────────────
  stage.addEventListener('mousedown', (e) => {
    dragging = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    applyTransform();
  });

  window.addEventListener('mouseup', () => {
    dragging = false;
  });

  // ── Touch: pan + pinch zoom ───────────────────────────────────────────────────
  stage.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTap < 300) {
        resetTransform(true);
        lastTap = 0;
        return;
      }
      lastTap = now;
      dragging = true;
      startX = e.touches[0].clientX - panX;
      startY = e.touches[0].clientY - panY;
    } else if (e.touches.length === 2) {
      dragging = false;
      lastTouchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }, { passive: false });

  stage.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && dragging) {
      panX = e.touches[0].clientX - startX;
      panY = e.touches[0].clientY - startY;
      applyTransform();
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / lastTouchDist;
      lastTouchDist = dist;
      scale = Math.min(Math.max(scale * factor, MIN_SCALE), MAX_SCALE);
      applyTransform();
    }
  }, { passive: false });

  stage.addEventListener('touchend', () => {
    dragging = false;
  });
})();
