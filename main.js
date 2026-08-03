/* ==========================================================================
   MERIDIAN — BEHAVIOUR
   --------------------------------------------------------------------------
   No dependencies. Organised as small independent initialisers called once
   from boot(); each guards its own DOM so a missing section never breaks the
   rest of the page.

   Contents
     00  Helpers and motion preference
     01  Loader
     02  Pointer light
     03  Neural field canvas
     04  Masthead: stuck state, progress, menu, active section
     05  Reveal on scroll
     06  Animated counters
     07  Regulatory Horizon
     08  Jurisdiction map and panel
     09  Ethics cards
     10  Timeline and spine
     11  Comparison, principles, ledger, resources
     12  Accordion
     13  Contact form
     14  Back to top
     15  Boot
   ========================================================================== */
(function () {
  'use strict';

  const D = window.MERIDIAN_DATA || {};

  /* 00  HELPERS
     ---------------------------------------------------------------------- */
  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const SVG_NS = 'http://www.w3.org/2000/svg';

  // Single source of truth for motion. Re-read live so a system change mid-visit
  // is respected without a reload.
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const MOTION = () => !motionQuery.matches;

  /** Build an element with attributes and children in one call. */
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') node.className = attrs[k];
      else if (k === 'html') node.innerHTML = attrs[k];
      else if (k === 'text') node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    }
    if (children) children.forEach(c => node.appendChild(c));
    return node;
  }

  /** Same, for SVG, which needs its own namespace. */
  function svgEl(tag, attrs) {
    const node = document.createElementNS(SVG_NS, tag);
    if (attrs) for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  /** Throttle a scroll or pointer handler to one call per animation frame. */
  function onFrame(fn) {
    let queued = false;
    return function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; fn(); });
    };
  }

  const DAY = 86400000;
  const fmtDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const fmtLong = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });


  /* 01  LOADER
     Dismissed on load, with a hard timeout so a slow font or a blocked
     request can never leave the reader looking at a spinner.
     ---------------------------------------------------------------------- */
  function initLoader() {
    const loader = $('#loader');
    if (!loader) return;

    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      loader.classList.add('is-done');
      document.body.classList.add('is-ready');
      // Remove from the tree so it can never trap focus
      setTimeout(() => loader.remove(), 700);
    };

    if (document.readyState === 'complete') setTimeout(dismiss, 260);
    else window.addEventListener('load', () => setTimeout(dismiss, 260));
    setTimeout(dismiss, 2600);
  }


  /* 02  POINTER LIGHT
     Fine pointers only. Lerped towards the cursor so it trails slightly
     rather than snapping, and driven from a single rAF loop.
     ---------------------------------------------------------------------- */
  function initCursor() {
    const glow = $('#cursorGlow');
    if (!glow || !MOTION()) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let cx = tx, cy = ty, running = false;

    function loop() {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      glow.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      if (Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4) requestAnimationFrame(loop);
      else running = false;
    }

    window.addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
      glow.classList.add('is-on');
      if (!running) { running = true; requestAnimationFrame(loop); }
    }, { passive: true });

    document.addEventListener('pointerleave', () => glow.classList.remove('is-on'));
  }


  /* 03  NEURAL FIELD CANVAS
     A drifting node graph behind the hero. Kept cheap deliberately:
       · node count scales with viewport area and is capped
       · device pixel ratio capped at 2
       · the loop stops entirely once the hero scrolls out of view
       · the loop stops when the tab is hidden
     ---------------------------------------------------------------------- */
  function initField() {
    const canvas = $('#field');
    const hero = $('#hero');
    if (!canvas || !hero || !MOTION()) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let w = 0, h = 0, dpr = 1;
    let nodes = [];
    let mx = 0, my = 0;      // parallax target, -1 … 1
    let px = 0, py = 0;      // parallax current
    let raf = null;
    let visible = true;

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      const target = clamp(Math.round((w * h) / 19000), 26, 88);
      nodes = [];
      for (let i = 0; i < target; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.19,
          vy: (Math.random() - 0.5) * 0.19,
          r: Math.random() * 1.5 + 0.7,
          d: Math.random() * 0.7 + 0.35   // depth, drives parallax strength
        });
      }
    }

    const LINK = 132;          // link distance in CSS pixels
    const LINK_SQ = LINK * LINK;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      px += (mx - px) * 0.05;
      py += (my - py) * 0.05;

      // Edges first so nodes sit on top
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const ax = a.x + px * 26 * a.d;
        const ay = a.y + py * 26 * a.d;

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const bx = b.x + px * 26 * b.d;
          const by = b.y + py * 26 * b.d;
          const dx = ax - bx, dy = ay - by;
          const dsq = dx * dx + dy * dy;
          if (dsq > LINK_SQ) continue;

          const t = 1 - dsq / LINK_SQ;               // 0 … 1 closeness
          ctx.strokeStyle = `rgba(120, 190, 245, ${(t * 0.2).toFixed(3)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }

        ctx.fillStyle = `rgba(150, 215, 250, ${(0.16 + a.d * 0.3).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(ax, ay, a.r, 0, Math.PI * 2);
        ctx.fill();

        // Drift, wrapping at the edges
        a.x += a.vx; a.y += a.vy;
        if (a.x < -20) a.x = w + 20; else if (a.x > w + 20) a.x = -20;
        if (a.y < -20) a.y = h + 20; else if (a.y > h + 20) a.y = -20;
      }
    }

    function tick() {
      if (!visible) { raf = null; return; }
      draw();
      raf = requestAnimationFrame(tick);
    }

    function start() { if (!raf && visible) raf = requestAnimationFrame(tick); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    // Only run while the hero is on screen
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0 }).observe(hero);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { visible = false; stop(); }
      else { visible = true; start(); }
    });

    window.addEventListener('pointermove', (e) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(size, 180);
    });

    size();
    canvas.classList.add('is-on');
    start();
  }


  /* 04  MASTHEAD
     ---------------------------------------------------------------------- */
  function initMasthead() {
    const bar = $('#masthead');
    const progress = $('#readProgress');
    const links = $$('#primaryNav .nav__list a');
    const sections = links
      .map(a => document.getElementById(a.getAttribute('href').slice(1)))
      .filter(Boolean);

    const update = onFrame(() => {
      const y = window.scrollY;
      if (bar) bar.classList.toggle('is-stuck', y > 40);

      if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;
      }

      // Active section: the last one whose top has passed the reading line
      const line = y + window.innerHeight * 0.32;
      let current = -1;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= line) current = i;
      }
      links.forEach((a, i) => a.classList.toggle('is-active', i === current));
    });

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    /* Mobile menu ------------------------------------------------------- */
    const toggle = $('#menuToggle');
    const nav = $('#primaryNav');
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      $('.sr-only', toggle).textContent = open ? 'Close menu' : 'Open menu';
      document.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
    // Reset when the layout returns to desktop
    window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
      if (e.matches) setOpen(false);
    });
  }


  /* 05  REVEAL ON SCROLL
     One observer for every revealable node. data-reveal-delay maps to a CSS
     custom property so the stagger lives in the stylesheet.
     ---------------------------------------------------------------------- */
  let revealObserver = null;

  function initReveal() {
    if (!('IntersectionObserver' in window) || !MOTION()) {
      $$('[data-reveal]').forEach(n => n.classList.add('is-visible'));
      return;
    }

    revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);       // reveal once, then stop watching
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    observeReveals();
  }

  /** Register any not-yet-observed reveal targets. Called again after render. */
  function observeReveals() {
    const targets = $$('[data-reveal], .stat, .ecard, .ccard, .pcard, .jur-card, .rgroup, .tl-item');
    targets.forEach(node => {
      if (node.dataset.revealBound) return;
      node.dataset.revealBound = '1';
      const delay = node.getAttribute('data-reveal-delay');
      if (delay) node.style.setProperty('--rd', delay);
      if (revealObserver) revealObserver.observe(node);
      else node.classList.add('is-visible');
    });
  }


  /* 06  ANIMATED COUNTERS
     ---------------------------------------------------------------------- */
  function initCounters() {
    const counters = $$('[data-count]');
    if (!counters.length) return;

    const run = (node) => {
      const end = parseFloat(node.getAttribute('data-count'));
      if (!MOTION() || end === 0) { node.textContent = end.toLocaleString('en-GB'); return; }

      const dur = 1500;
      const t0 = performance.now();
      const step = (now) => {
        const p = clamp((now - t0) / dur, 0, 1);
        const eased = 1 - Math.pow(2, -10 * p);        // easeOutExpo
        node.textContent = Math.round(end * eased).toLocaleString('en-GB');
        if (p < 1) requestAnimationFrame(step);
        else node.textContent = end.toLocaleString('en-GB');
      };
      requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) { counters.forEach(run); return; }

    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => { if (e.isIntersecting) { run(e.target); o.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(n => obs.observe(n));
  }


  /* 07  REGULATORY HORIZON
     Positions, states and day counts are derived from the clock, so the
     instrument stays correct long after publication.
     ---------------------------------------------------------------------- */
  function initHorizon() {
    const axisBox = $('#horizonAxis');
    const list = $('#horizonList');
    const next = $('#horizonNext');
    if (!axisBox || !list || !D.HORIZON) return;

    const now = Date.now();
    const t0 = new Date(D.HORIZON.axisStart).getTime();
    const t1 = new Date(D.HORIZON.axisEnd).getTime();
    const span = t1 - t0;
    const pct = (t) => clamp(((t - t0) / span) * 100, 0, 100);

    const items = D.HORIZON.milestones.map(m => {
      const t = new Date(m.date).getTime();
      return { ...m, t, past: t <= now };
    });
    const nextIdx = items.findIndex(m => !m.past);

    /* Axis ------------------------------------------------------------- */
    axisBox.appendChild(el('span', { class: 'horizon__track' }));

    const elapsed = el('span', { class: 'horizon__elapsed' });
    elapsed.style.width = pct(now) + '%';
    axisBox.appendChild(elapsed);

    items.forEach((m, i) => {
      const state = i === nextIdx ? 'next' : (m.past ? 'past' : 'future');
      const tick = el('span', { class: 'horizon__tick', 'data-state': state });
      tick.style.left = pct(m.t) + '%';
      tick.title = fmtDate.format(m.t) + ' — ' + m.title;
      axisBox.appendChild(tick);
    });

    // Year labels at each January, plus the axis ends
    [2025, 2026, 2027, 2028].forEach(yr => {
      const t = new Date(yr + '-01-01').getTime();
      if (t < t0 || t > t1) return;
      const lab = el('span', { class: 'horizon__tickYear', text: String(yr) });
      lab.style.left = pct(t) + '%';
      axisBox.appendChild(lab);
    });

    const nowMark = el('span', { class: 'horizon__now' });
    nowMark.style.left = pct(now) + '%';
    nowMark.title = 'Today';
    axisBox.appendChild(nowMark);

    /* List — the most recent milestone already passed, then everything ahead */
    const startIdx = nextIdx === -1 ? Math.max(0, items.length - 4) : Math.max(0, nextIdx - 1);
    items.slice(startIdx).forEach((m, i) => {
      const state = (startIdx + i) === nextIdx ? 'next' : (m.past ? 'past' : 'future');
      const row = el('li', { class: 'horizon__item', 'data-state': state });
      row.appendChild(el('span', { class: 'horizon__date', text: fmtDate.format(m.t) }));
      const what = el('div', { class: 'horizon__what' });
      what.appendChild(document.createTextNode(m.title));
      what.appendChild(el('small', { text: m.note }));
      row.appendChild(what);
      row.appendChild(el('span', { class: 'horizon__flag', text: m.flag }));
      list.appendChild(row);
    });

    /* Next-date readout ------------------------------------------------- */
    if (next) {
      const value = $('.horizon__nextValue', next);
      const meta = $('.horizon__nextMeta', next);
      if (nextIdx === -1) {
        value.textContent = 'All tracked dates have passed';
        meta.textContent = 'Update the milestone list in js/data.js.';
      } else {
        const m = items[nextIdx];
        const days = Math.ceil((m.t - now) / DAY);
        value.textContent = fmtLong.format(m.t);
        meta.innerHTML = '<b>' + days.toLocaleString('en-GB') + ' days</b> — ' + m.title;
      }
    }
  }


  /* 08  JURISDICTION MAP AND PANEL
     The map is a 5° dot matrix drawn from a coarse land mask; markers are
     projected from real latitude and longitude, so they cannot drift out of
     agreement with the text. Cards below are the primary control surface —
     the markers mirror them.
     ---------------------------------------------------------------------- */

  // Land mask: for each 5° latitude row (row 1 = 85–80°N), the inclusive
  // ranges of 5° longitude columns (column 0 = 180–175°W) that contain land.
  const LAND_ROWS = {
    1:  [[14, 25], [27, 32], [38, 39]],
    2:  [[13, 25], [26, 33], [54, 56]],
    3:  [[3, 4], [12, 26], [27, 33], [39, 40], [46, 64]],
    4:  [[2, 26], [28, 33], [38, 71]],
    5:  [[2, 27], [30, 33], [38, 71]],
    6:  [[2, 27], [33, 35], [37, 71]],
    7:  [[8, 27], [33, 34], [36, 71]],
    8:  [[9, 27], [33, 70]],
    9:  [[10, 26], [32, 70]],
    10: [[11, 26], [32, 35], [37, 68]],
    11: [[12, 25], [31, 40], [41, 67]],
    12: [[13, 24], [31, 42], [43, 66]],
    13: [[15, 23], [31, 43], [44, 47], [48, 64]],
    14: [[16, 25], [30, 43], [44, 46], [48, 62]],
    15: [[18, 24], [30, 42], [43, 45], [49, 52], [54, 62]],
    16: [[20, 26], [31, 41], [43, 46], [51, 51], [55, 61]],
    17: [[21, 28], [32, 42], [44, 45], [55, 62]],
    18: [[22, 30], [33, 43], [55, 63]],
    19: [[23, 31], [33, 43], [56, 64]],
    20: [[24, 32], [33, 42], [45, 45], [58, 66]],
    21: [[24, 32], [33, 41], [45, 46], [57, 67]],
    22: [[24, 31], [33, 40], [45, 46], [57, 67]],
    23: [[24, 31], [33, 39], [57, 67]],
    24: [[25, 30], [33, 38], [58, 66]],
    25: [[25, 29], [60, 65], [69, 71]],
    26: [[25, 28], [64, 64], [69, 71]],
    27: [[25, 27]],
    28: [[25, 27]],
    29: [[25, 26]]
  };

  // Equirectangular projection matching the dot grid
  const projX = (lon) => (lon + 180) * 2;
  const projY = (lat) => 177 - lat * 2;

  // Label offsets keep the dense European cluster legible
  const LABEL_OFFSETS = {
    eu:  { dx: 13,  dy: 4,   anchor: 'start' },
    uk:  { dx: -13, dy: -7,  anchor: 'end' },
    who: { dx: 3,   dy: 20,  anchor: 'start' },
    us:  { dx: 0,   dy: 19,  anchor: 'middle' },
    ca:  { dx: 0,   dy: -11, anchor: 'middle' },
    cn:  { dx: 0,   dy: -11, anchor: 'middle' },
    in:  { dx: -2,  dy: 19,  anchor: 'middle' },
    au:  { dx: 0,   dy: 19,  anchor: 'middle' },
    'au-cont': { dx: 12, dy: 4, anchor: 'start' }
  };

  function initAtlas() {
    const landGroup = $('#mapLand');
    const pinGroup = $('#mapPins');
    const panel = $('#jurPanel');
    const cardWrap = $('#jurCards');
    const data = D.JURISDICTIONS;
    if (!panel || !cardWrap || !data) return;

    /* Land dots -------------------------------------------------------- */
    if (landGroup) {
      const frag = document.createDocumentFragment();
      Object.keys(LAND_ROWS).forEach(rowKey => {
        const r = parseInt(rowKey, 10);
        const y = (r - 1) * 10 + 12;
        LAND_ROWS[rowKey].forEach(([from, to]) => {
          for (let c = from; c <= to; c++) {
            frag.appendChild(svgEl('circle', {
              class: 'land-dot', cx: c * 10 + 5, cy: y, r: 1.5
            }));
          }
        });
      });
      landGroup.appendChild(frag);
    }

    /* Markers ---------------------------------------------------------- */
    if (pinGroup) {
      data.forEach(j => {
        const x = projX(j.lon), y = projY(j.lat);
        const off = LABEL_OFFSETS[j.id] || { dx: 0, dy: 18, anchor: 'middle' };

        const g = svgEl('g', {
          class: 'pin', 'data-id': j.id, role: 'button', tabindex: '0',
          'aria-label': j.name + ' — ' + j.posture
        });
        g.appendChild(svgEl('circle', { class: 'pin__halo', cx: x, cy: y, r: 26 }));
        g.appendChild(svgEl('circle', { class: 'pin__ring', cx: x, cy: y, r: 5 }));
        g.appendChild(svgEl('circle', { class: 'pin__core', cx: x, cy: y, r: 3 }));

        const label = svgEl('text', {
          class: 'pin__label', x: x + off.dx, y: y + off.dy, 'text-anchor': off.anchor
        });
        label.textContent = j.code;
        g.appendChild(label);

        g.addEventListener('click', () => select(j.id));
        g.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(j.id); }
        });
        pinGroup.appendChild(g);
      });
    }

    /* Cards ------------------------------------------------------------ */
    data.forEach(j => {
      const card = el('button', { class: 'jur-card', type: 'button', 'data-id': j.id, 'aria-pressed': 'false' }, [
        el('span', { class: 'jur-card__code', text: j.code + ' · ' + j.posture }),
        el('span', { class: 'jur-card__name', text: j.short }),
        el('span', { class: 'jur-card__inst', text: j.instrument })
      ]);
      card.addEventListener('click', () => select(j.id));
      cardWrap.appendChild(card);
    });

    /* Selection -------------------------------------------------------- */
    function select(id) {
      const j = data.find(x => x.id === id);
      if (!j) return;

      $$('.pin', pinGroup).forEach(p => p.classList.toggle('is-selected', p.dataset.id === id));
      $$('.jur-card', cardWrap).forEach(c => {
        const on = c.dataset.id === id;
        c.classList.toggle('is-selected', on);
        c.setAttribute('aria-pressed', String(on));
      });

      const rows = j.rows.map(([k, v]) =>
        `<li><span class="jp__k">${k}</span><span class="jp__v">${v}</span></li>`
      ).join('');

      panel.innerHTML = `
        <div class="jp-anim">
          <div class="jp__top">
            <span class="jp__code">${j.code}</span>
            <span class="jp__posture">${j.posture}</span>
          </div>
          <h3 class="jp__name">${j.name}</h3>
          <p class="jp__thesis">${j.thesis}</p>
          <ul class="jp__rows">${rows}</ul>
          <div class="jp__foot">
            <a class="jp__link" href="${j.link}" target="_blank" rel="noopener noreferrer">
              ${j.linkLabel}
              <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true"><path d="M3 9L9 3M9 3H4.5M9 3v4.5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span class="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>`;
    }

    select('eu');   // open on the most developed framework
  }


  /* 09  ETHICS CARDS
     ---------------------------------------------------------------------- */
  function initEthics() {
    const wrap = $('#ethicsGrid');
    if (!wrap || !D.ETHICS) return;

    D.ETHICS.forEach((e, i) => {
      const card = el('article', { class: 'ecard', 'data-reveal-delay': String(i % 3) });
      card.innerHTML = `
        <span class="ecard__num">0${i + 1}</span>
        <div class="ecard__icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="${e.icon}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 class="ecard__title">${e.title}</h3>
        <p class="ecard__body">${e.body}</p>
        <p class="ecard__fail"><b>Failure mode</b>${e.fail}</p>`;

      // Pointer-tracked highlight; cheap because it only writes two custom props
      if (MOTION()) {
        card.addEventListener('pointermove', (ev) => {
          const r = card.getBoundingClientRect();
          card.style.setProperty('--mx', ((ev.clientX - r.left) / r.width * 100).toFixed(1) + '%');
          card.style.setProperty('--my', ((ev.clientY - r.top) / r.height * 100).toFixed(1) + '%');
        });
      }
      wrap.appendChild(card);
    });
  }


  /* 10  TIMELINE AND SPINE
     ---------------------------------------------------------------------- */
  function initTimeline() {
    const wrap = $('#timeline');
    const fill = $('#timelineFill');
    if (!wrap || !D.TIMELINE) return;

    D.TIMELINE.forEach(item => {
      const li = el('li', { class: 'tl-item', 'data-future': item.future ? 'true' : 'false' });
      li.innerHTML = `
        <span class="tl-item__dot" aria-hidden="true"></span>
        <div class="tl-item__head">
          <span class="tl-item__date">${item.date}</span>
          <span class="tl-item__who">${item.who}</span>
        </div>
        <h3 class="tl-item__title">${item.title}</h3>
        <p class="tl-item__body">${item.body}</p>`;
      wrap.appendChild(li);
    });

    if (!fill || !MOTION()) { if (fill) fill.style.transform = 'scaleY(1)'; return; }

    // The spine fills as the reader moves through the section
    const update = onFrame(() => {
      const r = wrap.getBoundingClientRect();
      const line = window.innerHeight * 0.62;
      const p = clamp((line - r.top) / r.height, 0, 1);
      fill.style.transform = `scaleY(${p})`;
    });
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }


  /* 11  COMPARISON, PRINCIPLES, LEDGER, RESOURCES
     ---------------------------------------------------------------------- */
  function initCompare() {
    const wrap = $('#compare');
    if (!wrap || !D.COMPARE) return;

    D.COMPARE.forEach((c, i) => {
      const dial = Array.from({ length: 5 }, (_, n) =>
        `<i class="${n < c.dial ? 'on' : ''}"></i>`).join('');
      const rows = c.rows.map(([k, v]) => `<li><span>${k}</span><span>${v}</span></li>`).join('');

      const card = el('article', { class: 'ccard', 'data-reveal-delay': String(i) });
      card.innerHTML = `
        <div class="ccard__head">
          <span class="ccard__flag">${c.flag}</span>
          <span class="ccard__dial" role="img" aria-label="Prescriptiveness ${c.dial} of 5">${dial}</span>
        </div>
        <h4 class="ccard__title">${c.title}</h4>
        <p class="ccard__mech">${c.mech}</p>
        <ul class="ccard__rows">${rows}</ul>`;
      wrap.appendChild(card);
    });
  }

  function initPrinciples() {
    const wrap = $('#principles');
    if (!wrap || !D.PRINCIPLES) return;
    D.PRINCIPLES.forEach((p, i) => {
      const card = el('article', { class: 'pcard', 'data-reveal-delay': String(i % 3) });
      card.innerHTML = `
        <p class="pcard__k">${p.k}</p>
        <h4 class="pcard__t">${p.t}</h4>
        <p class="pcard__d">${p.d}</p>`;
      wrap.appendChild(card);
    });
  }

  function initLedger() {
    const pairs = [['#risks', D.RISKS], ['#opps', D.OPPS]];
    pairs.forEach(([sel, items]) => {
      const wrap = $(sel);
      if (!wrap || !items) return;
      items.forEach(it => {
        wrap.appendChild(el('li', { html: `<strong>${it.t}</strong><p>${it.d}</p>` }));
      });
    });
  }

  function initResources() {
    const wrap = $('#resources-grid');
    if (!wrap || !D.RESOURCES) return;

    D.RESOURCES.forEach((group, i) => {
      const items = group.items.map(it => `
        <li>
          <a class="rlink" href="${it.href}" target="_blank" rel="noopener noreferrer">
            <span class="rlink__t">${it.t}
              <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9L9 3M9 3H4.5M9 3v4.5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <span class="rlink__m">${it.m}</span>
          </a>
        </li>`).join('');

      const box = el('div', { class: 'rgroup', 'data-reveal-delay': String(i) });
      box.innerHTML = `<h3 class="rgroup__title">${group.group}</h3><ul class="rgroup__list">${items}</ul>`;
      wrap.appendChild(box);
    });
  }


  /* 12  ACCORDION
     Height is animated from a measured pixel value, then released to auto so
     the panel reflows correctly if the window is resized while open.
     ---------------------------------------------------------------------- */
  function initAccordion() {
    const wrap = $('#accordion');
    if (!wrap || !D.FAQ) return;

    D.FAQ.forEach((item, i) => {
      const id = 'faq-' + i;
      const row = el('div', { class: 'acc' });
      row.innerHTML = `
        <h3 class="acc__h">
          <button class="acc__btn" type="button" aria-expanded="false" aria-controls="${id}">
            <span class="acc__q">${item.q}</span>
            <span class="acc__sign" aria-hidden="true"></span>
          </button>
        </h3>
        <div class="acc__panel" id="${id}" role="region" hidden>
          <div class="acc__inner">${item.a.map(p => `<p>${p}</p>`).join('')}</div>
        </div>`;
      wrap.appendChild(row);
    });

    const panels = $$('.acc__panel', wrap);

    function close(panel) {
      const btn = wrap.querySelector(`[aria-controls="${panel.id}"]`);
      if (!btn || btn.getAttribute('aria-expanded') === 'false') return;
      btn.setAttribute('aria-expanded', 'false');
      panel.style.height = panel.scrollHeight + 'px';   // fix current height
      requestAnimationFrame(() => { panel.style.height = '0px'; });
      const done = () => { panel.hidden = true; panel.removeEventListener('transitionend', done); };
      MOTION() ? panel.addEventListener('transitionend', done) : done();
    }

    function open(panel) {
      const btn = wrap.querySelector(`[aria-controls="${panel.id}"]`);
      btn.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
      panel.style.height = '0px';
      requestAnimationFrame(() => { panel.style.height = panel.scrollHeight + 'px'; });
      const done = (e) => {
        if (e && e.propertyName !== 'height') return;
        panel.style.height = 'auto';
        panel.removeEventListener('transitionend', done);
      };
      MOTION() ? panel.addEventListener('transitionend', done) : done();
    }

    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.acc__btn');
      if (!btn) return;
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      panels.forEach(p => { if (p !== panel) close(p); });   // one at a time
      isOpen ? close(panel) : open(panel);
    });
  }


  /* 13  CONTACT FORM
     No backend is assumed. Set FORM_ENDPOINT to your own URL to POST instead
     of falling back to a composed email.
     ---------------------------------------------------------------------- */
  const FORM_ENDPOINT = null;

  function initForm() {
    const form = $('#contactForm');
    const status = $('#formStatus');
    if (!form) return;

    const rules = {
      fName: (v) => v.trim().length >= 2 || 'Enter your name.',
      fEmail: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Enter an email address we can reply to.',
      fMsg: (v) => v.trim().length >= 20 || 'A sentence or two about the decision helps us route this. 20 characters minimum.'
    };

    function validateField(id) {
      const input = document.getElementById(id);
      const field = input.closest('.field');
      const slot = form.querySelector(`[data-error-for="${id}"]`);
      const result = rules[id](input.value);
      const ok = result === true;
      field.classList.toggle('has-error', !ok);
      input.setAttribute('aria-invalid', String(!ok));
      if (slot) slot.textContent = ok ? '' : result;
      return ok;
    }

    // Validate on blur, and clear the error as soon as it is fixed
    Object.keys(rules).forEach(id => {
      const input = document.getElementById(id);
      if (!input) return;
      input.addEventListener('blur', () => validateField(id));
      input.addEventListener('input', () => {
        if (input.closest('.field').classList.contains('has-error')) validateField(id);
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const ok = Object.keys(rules).map(validateField).every(Boolean);

      if (!ok) {
        status.className = 'form__status';
        status.textContent = 'Three fields need attention before this can go.';
        form.querySelector('.has-error input, .has-error textarea')?.focus();
        return;
      }

      const payload = Object.fromEntries(new FormData(form).entries());

      if (FORM_ENDPOINT) {
        status.className = 'form__status';
        status.textContent = 'Sending…';
        try {
          const res = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error(res.status);
          form.reset();
          status.className = 'form__status is-ok';
          status.textContent = 'Sent. We reply within two working days.';
        } catch (err) {
          status.className = 'form__status';
          status.textContent = 'That did not send. Try again, or email enquiries directly.';
        }
        return;
      }

      // No endpoint configured: hand the reader a composed message instead of
      // pretending to have delivered it.
      const body = `${payload.message}\n\n— ${payload.name}${payload.org ? ', ' + payload.org : ''}\n${payload.email}`;
      const href = 'mailto:enquiries@example.org'
        + '?subject=' + encodeURIComponent('Meridian enquiry — ' + payload.topic)
        + '&body=' + encodeURIComponent(body);
      window.location.href = href;
      status.className = 'form__status is-ok';
      status.textContent = 'Your email client should now be open with this drafted. Nothing has been sent yet.';
    });
  }


  /* 14  BACK TO TOP
     ---------------------------------------------------------------------- */
  function initToTop() {
    const btn = $('#toTop');
    if (!btn) return;

    const update = onFrame(() => {
      btn.classList.toggle('is-on', window.scrollY > window.innerHeight * 0.6);
    });
    window.addEventListener('scroll', update, { passive: true });
    update();

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: MOTION() ? 'smooth' : 'auto' });
      // Return focus to the top of the document for keyboard users
      $('#masthead').querySelector('a')?.focus({ preventScroll: true });
    });
  }


  /* 15  BOOT
     ---------------------------------------------------------------------- */
  function boot() {
    initLoader();

    // Content first, so observers can see everything that was rendered
    initHorizon();
    initAtlas();
    initEthics();
    initTimeline();
    initCompare();
    initPrinciples();
    initLedger();
    initResources();
    initAccordion();

    // Then behaviour
    initMasthead();
    initReveal();
    observeReveals();
    initCounters();
    initCursor();
    initField();
    initForm();
    initToTop();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})();
