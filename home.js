/* ═══════════════════════════════════════════════════════════
   COG KERALA — script.js  (refreshed)
═══════════════════════════════════════════════════════════ */

/* ─── CURSOR ─────────────────────────────────────────────── */
const cur = document.getElementById('cur');
document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top  = e.clientY + 'px';
});
const hoverSels = 'a,button,.dt-row,.tl-row,.mrow,.st-box,.bel-card,.zcard,.lcard,.vis-col,.hrm-scroll,.council-card,.pie-slice-group';
document.querySelectorAll(hoverSels).forEach(el => {
  el.addEventListener('mouseenter', () => cur.classList.add('big'));
  el.addEventListener('mouseleave', () => cur.classList.remove('big'));
});

/* ─── NAV SCROLL SHADOW ─────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () =>
  nav.classList.toggle('scrolled', scrollY > 30), {passive:true});

/* ─── HAMBURGER ─────────────────────────────────────────── */
const hbg = document.getElementById('hbg');
const mob = document.getElementById('mob');
hbg.addEventListener('click', () => {
  hbg.classList.toggle('open');
  mob.classList.toggle('open');
});
mob.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    hbg.classList.remove('open');
    mob.classList.remove('open');
  })
);

/* ─── SCROLL REVEAL ─────────────────────────────────────── */
const revIO = new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('on');
      revIO.unobserve(e.target);
    }
  });
}, { threshold:.07, rootMargin:'0px 0px -44px 0px' });
document.querySelectorAll('.rv,.rv2,.rv3,.rvl,.rvr').forEach(el => revIO.observe(el));

/* ─── COUNT-UP ──────────────────────────────────────────── */
const cntIO = new IntersectionObserver(es => {
  es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.count);
    if (isNaN(target)) { cntIO.unobserve(el); return; }
    const dur = 1300, start = performance.now();
    const step = t => {
      const p = Math.min((t - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(ease * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    cntIO.unobserve(el);
  });
}, { threshold:.5 });
document.querySelectorAll('[data-count]').forEach(el => cntIO.observe(el));


/* ─── DEPT ROW NUMBER BOUNCE ────────────────────────────── */
document.querySelectorAll('.dt-row').forEach(row => {
  const n = row.querySelector('.dt-n');
  if (!n) return;
  row.addEventListener('mouseenter', () => {
    n.style.transition = 'transform .3s cubic-bezier(.16,1,.3,1),color .22s';
    n.style.transform = 'scale(1.15) translateX(4px)';
  });
  row.addEventListener('mouseleave', () => { n.style.transform = '' });
});

/* ─── STAGGER: BELIEFS ──────────────────────────────────── */
document.querySelectorAll('.bel-card').forEach((c, i) => {
  c.style.cssText += `opacity:0;transform:translateY(22px);
    transition:opacity .7s ${i*.06}s cubic-bezier(.16,1,.3,1),
    transform .7s ${i*.06}s cubic-bezier(.16,1,.3,1)`;
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { c.style.opacity='1'; c.style.transform='none'; io.unobserve(c); }
  }, { threshold:.12 });
  io.observe(c);
});

/* ─── STAGGER: ZONES ────────────────────────────────────── */
document.querySelectorAll('.zcard').forEach((z, i) => {
  z.style.cssText += `opacity:0;transform:translateY(18px);
    transition:opacity .6s ${i*.04}s cubic-bezier(.16,1,.3,1),
    transform .6s ${i*.04}s cubic-bezier(.16,1,.3,1),
    background .25s,border-color .25s`;
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { z.style.opacity='1'; z.style.transform='none'; io.unobserve(z); }
  }, { threshold:.08 });
  io.observe(z);
});

/* ─── STAGGER: DEPT ROWS ────────────────────────────────── */
document.querySelectorAll('.dt-row').forEach((r, i) => {
  r.style.cssText += `opacity:0;transform:translateX(-14px);
    transition:opacity .6s ${i*.05}s cubic-bezier(.16,1,.3,1),
    transform .6s ${i*.05}s cubic-bezier(.16,1,.3,1),all .22s`;
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { r.style.opacity='1'; r.style.transform=''; io.unobserve(r); }
  }, { threshold:.08 });
  io.observe(r);
});

/* ─── STAGGER: COUNCIL CARDS ────────────────────────────── */
document.querySelectorAll('.council-card').forEach((c, i) => {
  c.style.cssText += `opacity:0;transform:translateY(20px);
    transition:opacity .65s ${i*.05}s cubic-bezier(.16,1,.3,1),
    transform .65s ${i*.05}s cubic-bezier(.16,1,.3,1)`;
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { c.style.opacity='1'; c.style.transform=''; io.unobserve(c); }
  }, { threshold:.1 });
  io.observe(c);
});

/* ─── VIDEO PLACEHOLDER ─────────────────────────────────── */
const hrVidPh = document.getElementById('hrVidPh');
if (hrVidPh) {
  hrVidPh.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=0';
    iframe.setAttribute('allowfullscreen', '');
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none';
    hrVidPh.parentElement.appendChild(iframe);
    hrVidPh.style.display = 'none';
  });
}

/* ─── SMOOTH ANCHOR SCROLL ──────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - 72, behavior:'smooth' });
  });
});

/* ─── HERO IMAGE SLIDESHOW (UPDATED) ─── */
(function initImageSlideshow() {
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) return;

  let current = 0;

  function showSlide(index) {
    slides.forEach(slide => slide.style.display = "none");
    slides[index].style.display = "block";
  }

  function autoSlide() {
    current++;
    if (current >= slides.length) current = 0;
    showSlide(current);
  }

  // first slide
  showSlide(current);

  // auto change every 4 sec
  setInterval(autoSlide, 4000);
})();

/* ═══════════════════════════════════════════════════════════
   PIE CHART — Enhanced: bigger, opacity-dim non-hovered slices,
   animated build-in, bold info card (light theme)
═══════════════════════════════════════════════════════════ */
(function initPieChart() {

  const DATA = [
    {
      id: 'kerala-churches',
      label: 'Churches in Kerala',
      value: '1,200+',
      raw: 1200,
      color: '#C8006A',
      description: 'The Church of God in Kerala State has over <strong>1,200 local churches</strong> spread across all 14 revenue districts. These congregations serve communities from the coast to the high ranges, holding regular services, Bible study groups, and outreach programs. Each church is governed locally and connected to the Kerala State organization headquartered at Zion Hills, Chengannur.'
    },
    {
      id: 'ministers',
      label: 'Ministers in Kerala',
      value: '1,500+',
      raw: 1500,
      color: '#E5007A',
      description: 'Over <strong>1,500 ordained, licensed, and exhorter ministers</strong> serve under the Church of God Kerala State. These include fully ordained ministers who perform all sacraments, licensed ministers in active training, and exhorters serving their local churches. Three Bible seminaries — Mount Zion, Kumbanad, and Kannur — train and credential new ministers every year.'
    },
    {
      id: 'nations',
      label: 'Nations Worldwide',
      value: '194',
      raw: 194,
      color: '#A0005A',
      description: 'The Church of God International, headquartered in Cleveland, Tennessee, USA, is present in <strong>194 nations</strong> worldwide. With over 9.2 million members globally, it is one of the oldest and largest Pentecostal denominations. Kerala State is an integral part of this global fellowship, participating in the FINISH Commission — the international missionary mandate to reach every person on earth.'
    },
    {
      id: 'kerala-population',
      label: 'Kerala Population',
      value: '337 Lakh',
      raw: 337,
      color: '#7B1A50',
      description: 'Kerala has a total population of approximately <strong>337 lakh (33.7 million)</strong> people spread across 14 revenue districts, 63 taluks, and 1,479 revenue villages, with 6 corporations and 87 municipalities. The Church of God Kerala State carries the burden of the FINISH Commission — to reach every unreached person in this blessed land with the full Gospel of Jesus Christ.'
    },
    {
      id: 'seminaries',
      label: 'Bible Seminaries',
      value: '3',
      raw: 3,
      color: '#D4408A',
      description: 'Three Bible seminaries train the next generation of Spirit-filled leaders: <strong>Mount Zion Bible Seminary</strong> in Chengannur, <strong>Kumbanad Bible College</strong>, and <strong>Kannur Bible College</strong>. These institutions offer theological education, ministerial training, and credentialing programs aligned with Church of God International standards.'
    },
    {
      id: 'founded',
      label: 'Years of Heritage',
      value: '139',
      raw: 139,
      color: '#B53075',
      description: 'The Church of God was founded in <strong>1886</strong> by R.G. Spurling in Monroe County, Tennessee — making it one of the oldest Pentecostal movements in the world. The Full Gospel Church in India was established in the early 1900s. In 2025 the Kerala State celebrated its <strong>102nd State Convention</strong>, continuing a rich heritage of holiness and Spirit-filled worship.'
    }
  ];

  const container = document.getElementById('pieChart');
  if (!container) return;

  const SIZE   = 400;
  const CX     = SIZE / 2;
  const CY     = SIZE / 2;
  const R      = 158;    // bigger outer radius
  const R_IN   = 60;     // inner hole
  const BULGE  = 18;     // pop-out on hover
  const total  = DATA.reduce((s, d) => s + d.raw, 0);

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${SIZE} ${SIZE}`);
  svg.setAttribute('class', 'pie-svg');
  svg.setAttribute('aria-label', 'Church of God Kerala — Statistics Pie Chart');

  function polar(cx, cy, r, angleDeg) {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function arcPath(cx, cy, rOuter, rInner, startDeg, endDeg) {
    const o1 = polar(cx, cy, rOuter, startDeg);
    const o2 = polar(cx, cy, rOuter, endDeg);
    const i1 = polar(cx, cy, rInner, endDeg);
    const i2 = polar(cx, cy, rInner, startDeg);
    const large = (endDeg - startDeg) > 180 ? 1 : 0;
    return [
      `M ${o1.x} ${o1.y}`,
      `A ${rOuter} ${rOuter} 0 ${large} 1 ${o2.x} ${o2.y}`,
      `L ${i1.x} ${i1.y}`,
      `A ${rInner} ${rInner} 0 ${large} 0 ${i2.x} ${i2.y}`,
      'Z'
    ].join(' ');
  }

  let startAngle = 0;

  DATA.forEach((d, i) => {
    const slice = (d.raw / total) * 360;
    const endAngle = startAngle + slice;
    const mid = (startAngle + endAngle) / 2;

    const midRad = (mid - 90) * Math.PI / 180;
    const bx = Math.cos(midRad) * BULGE;
    const by = Math.sin(midRad) * BULGE;

    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', 'pie-slice-group');
    g.dataset.index = i;

    /* Path */
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', arcPath(CX, CY, R, R_IN, startAngle, endAngle));
    path.setAttribute('fill', d.color);
    path.setAttribute('stroke', 'rgba(255,255,255,.18)');
    path.setAttribute('stroke-width', '2');

    /* Animated build: start collapsed to center, expand outward */
    path.style.transformOrigin = `${CX}px ${CY}px`;
    path.style.transformBox = 'fill-box';
    path.style.opacity = '0';
    path.style.transform = 'scale(0.4)';

    /* Label */
    const labelR = (R + R_IN) / 2 + 2;
    const lp = polar(CX, CY, labelR, mid);
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', lp.x);
    text.setAttribute('y', lp.y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('fill', 'rgba(255,255,255,.92)');
    text.setAttribute('font-size', '9.5');
    text.setAttribute('font-family', 'Syne, sans-serif');
    text.setAttribute('font-weight', '700');
    text.setAttribute('pointer-events', 'none');
    text.setAttribute('letter-spacing', '0.5');
    const short = d.label.split(' ').slice(0,2).join(' ');
    text.textContent = short;
    text.style.transition = 'opacity .3s ease';

    g.appendChild(path);
    g.appendChild(text);
    svg.appendChild(g);

    /* Animate in with stagger */
    setTimeout(() => {
      path.style.transition = `transform .7s ${i * .08}s cubic-bezier(.34,1.26,.64,1), opacity .5s ${i * .08}s ease`;
      path.style.opacity = '0.85';
      path.style.transform = 'scale(1)';
    }, 200);

    /* Hover: bulge + dim siblings */
    let isActive = false;

    function activate() {
      if (isActive) return;
      isActive = true;
      g.classList.add('touch-active');
      svg.classList.add('has-active');
      /* Bulge this slice */
      path.style.transition = 'transform .35s cubic-bezier(.34,1.56,.64,1), opacity .25s ease, filter .3s ease';
      path.style.transform = `translate(${bx}px, ${by}px) scale(1.04)`;
      path.style.opacity = '1';
      text.style.transform = `translate(${bx}px, ${by}px)`;
      text.style.fontSize = '11';
      /* Dim all other slices */
      svg.querySelectorAll('.pie-slice-group').forEach((sg, si) => {
        if (si !== i) {
          const sp = sg.querySelector('path');
          const st = sg.querySelector('text');
          sp.style.transition = 'opacity .25s ease, filter .25s ease';
          sp.style.opacity = '0.28';
          if (st) st.style.opacity = '0.25';
        }
      });
      showInfo(d);
    }

    function deactivate() {
      if (!isActive) return;
      isActive = false;
      g.classList.remove('touch-active');
      svg.classList.remove('has-active');
      path.style.transform = 'scale(1)';
      path.style.opacity = '0.85';
      text.style.transform = '';
      text.style.fontSize = '9.5';
      /* Restore all slices */
      svg.querySelectorAll('.pie-slice-group').forEach(sg => {
        const sp = sg.querySelector('path');
        const st = sg.querySelector('text');
        sp.style.transition = 'opacity .35s ease, transform .35s cubic-bezier(.34,1.56,.64,1), filter .3s ease';
        sp.style.opacity = '0.85';
        if (st) st.style.opacity = '1';
      });
      infoCard.classList.remove('visible');
    }

    g.addEventListener('mouseenter', activate);
    g.addEventListener('mouseleave', deactivate);
    g.addEventListener('touchstart', e => { e.preventDefault(); activate(); }, { passive:false });
    g.addEventListener('touchend', e => { e.preventDefault(); deactivate(); }, { passive:false });
    g.addEventListener('click', () => openModal(d));

    startAngle = endAngle;
  });

  /* Center circle */
  const centerCircle = document.createElementNS(svgNS, 'circle');
  centerCircle.setAttribute('cx', CX);
  centerCircle.setAttribute('cy', CY);
  centerCircle.setAttribute('r', R_IN - 3);
  centerCircle.setAttribute('fill', '#FFFFFF');
  centerCircle.setAttribute('stroke', 'rgba(200,0,106,.35)');
  centerCircle.setAttribute('stroke-width', '2');
  svg.appendChild(centerCircle);

  const centerText1 = document.createElementNS(svgNS, 'text');
  centerText1.setAttribute('x', CX);
  centerText1.setAttribute('y', CY - 8);
  centerText1.setAttribute('text-anchor', 'middle');
  centerText1.setAttribute('fill', '#C8006A');
  centerText1.setAttribute('font-size', '12');
  centerText1.setAttribute('font-family', 'Syne, sans-serif');
  centerText1.setAttribute('font-weight', '800');
  centerText1.setAttribute('letter-spacing', '2');
  centerText1.textContent = 'COG';
  svg.appendChild(centerText1);

  const centerText2 = document.createElementNS(svgNS, 'text');
  centerText2.setAttribute('x', CX);
  centerText2.setAttribute('y', CY + 9);
  centerText2.setAttribute('text-anchor', 'middle');
  centerText2.setAttribute('fill', 'rgba(45,10,30,.4)');
  centerText2.setAttribute('font-size', '8');
  centerText2.setAttribute('font-family', 'Syne, sans-serif');
  centerText2.setAttribute('font-weight', '600');
  centerText2.setAttribute('letter-spacing', '2');
  centerText2.textContent = 'KERALA';
  svg.appendChild(centerText2);

  container.querySelector('.pie-container').appendChild(svg);

  /* ── Info card (hover) ─────────────────────────────────── */
  const infoCard = container.querySelector('.pie-info-card');

  function showInfo(d) {
    infoCard.querySelector('.pic-label').textContent = d.label;
    infoCard.querySelector('.pic-value').textContent = d.value;
    infoCard.querySelector('.pic-desc').textContent = d.description.replace(/<[^>]*>/g, '');
    infoCard.classList.add('visible');
  }

  /* ── Modal (click) ─────────────────────────────────────── */
  const overlay = document.getElementById('pieModalOverlay');
  const pmClose = document.getElementById('pmClose');

  function openModal(d) {
    overlay.querySelector('.pm-tag').textContent = d.label;
    overlay.querySelector('.pm-value').textContent = d.value;
    overlay.querySelector('.pm-title').textContent = d.label;
    overlay.querySelector('.pm-body').innerHTML = d.description;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  pmClose?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

})();