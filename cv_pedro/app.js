/* Interactive CV dashboard — Pedro Varela Pinto. Content comes from data.js (built from Notion). */
(() => {
  'use strict';
  const D = window.CV_DATA;
  const P = D.profile;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- icons (stroke paths, 24px grid) ---------- */
  const ICONS = {
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
    graduation: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',
    sparkles: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    blocks: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M10 6.5h4M6.5 10v4M17.5 10v4l-3.5 3.5"/>',
    coins: '<circle cx="9" cy="9" r="6"/><path d="M15.5 9.5a6 6 0 1 1-6 6"/><path d="M9 6v6M7 8h3"/>',
    code: '<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16"/>',
    megaphone: '<path d="M3 11v2a1 1 0 0 0 1 1h3l8 5V5L7 10H4a1 1 0 0 0-1 1zM18 8a5 5 0 0 1 0 8"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    rocket: '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M14 4c4-1 6 1 6 1s2 2 1 6l-7 7-7-7z"/><circle cx="15" cy="9" r="1.5"/><path d="M7 11H4l3-4h4M13 17v3l4-3v-4"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4M10 10h4v4h-4z"/>',
    tool: '<path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 6.5-6.5M9.3 17.7 3 11.4l2.4-2.4"/><path d="M14.7 6.3 12 3.6 9.6 6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    plane: '<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
    cake: '<path d="M4 21h16v-7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2zM4 16c2 1 4-1 4-1s2 2 4 0 4 0 4 0 2 2 4 1M12 12V8M12 5v.01"/>',
    id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.5-1.5 5.5-1.5 6 0M15 10h3M15 13h3"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>',
    music: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    chev: '<path d="m9 6 6 6-6 6"/>',
    arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    home: '<path d="m3 11 9-8 9 8M5 9v11h14V9"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    collapse: '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>',
    notion: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 16V8l6 8V8"/>',
    sunTheme: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  };
  const icon = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ICONS.star}</svg>`;

  /* ---------- section registry ---------- */
  const HUES = ['#36e2c4', '#6f7dff', '#ff7ab6', '#ffc65c', '#4fc3ff', '#b78cff', '#7ee07a', '#ff8f6b'];
  const short = {
    ai_training: 'AI Training', ai_skills: 'AI Skills', crypto_training: 'Crypto & Blockchain Training',
    crypto_skills: 'Crypto & Blockchain Skills', it_training: 'IT, Web & Programming Training',
    marketing_training: 'Marketing Training', renewables_training: 'Renewable Energy Training',
    entrepreneurship: 'Entrepreneurship Training', softskills_training: 'Soft Skills Training',
  };
  const SECS = [
    { id: 'summary', title: 'Summary Presentation of Pedro', icon: 'star', lede: 'Who Pedro is, in one screen: profile, strengths, education and a short video.', special: true },
    ...D.sections,
    { id: 'contacts', title: 'Contacts', icon: 'mail', lede: 'Get in touch — phone, e-mail, LinkedIn and address.', special: true },
  ];
  SECS.forEach((s, i) => { s.hue = HUES[i % HUES.length]; s.idx = i; s.short = short[s.id] || s.title; });
  const byId = Object.fromEntries(SECS.map((s) => [s.id, s]));

  /* ---------- helpers ---------- */
  const fmtSize = (b) => (b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' KB');
  function countDeep(nodes) {
    const c = { docs: 0, images: 0, videos: 0, audio: 0, links: 0 };
    (function w(ns) { ns.forEach((n) => {
      if (n.t === 'file') c.docs++; else if (n.t === 'img') c.images++; else if (n.t === 'video' || n.t === 'yt') c.videos++;
      else if (n.t === 'audio') c.audio++; else if (n.t === 'link') c.links++;
      if (n.children) w(n.children);
    }); })(nodes);
    return c;
  }
  function statChips(st, extra = '') {
    if (!st) return '';
    const names = [['courses', 'course'], ['docs', 'document'], ['images', 'image'], ['videos', 'video'], ['audio', 'audio'], ['links', 'link']];
    return names.filter(([k]) => st[k]).map(([k, w]) => `<span class="chip"><b>${st[k]}</b> ${w}${st[k] > 1 && w !== 'audio' ? 's' : ''}</span>`).join('') + extra;
  }
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 1800);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast('Copied: ' + text); } catch { toast(text); }
  }
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver((ents) => {
    ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -6% 0px' }) : null;
  function reveal(root) {
    $$('.reveal, .tile, .kpi, [data-w]', root).forEach((el, i) => {
      if (el.classList.contains('tile')) el.style.transitionDelay = Math.min(i * 40, 600) + 'ms';
      if (observer && !reduced) observer.observe(el); else el.classList.add('in');
    });
  }
  // width animation for bars/meters once visible
  const barObs = 'IntersectionObserver' in window ? new IntersectionObserver((ents) => {
    ents.forEach((e) => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.w; barObs.unobserve(e.target); } });
  }) : null;
  function animateBars(root) { $$('[data-w]', root).forEach((el) => (barObs ? barObs.observe(el) : (el.style.width = el.dataset.w))); }

  /* ---------- content renderer ---------- */
  let gallery = []; // media items of the current view, for modal navigation

  function renderNodes(nodes, depth = 0) {
    let html = '';
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (n.t === 'li') {
        let items = '';
        while (i < nodes.length && nodes[i].t === 'li') { items += `<li class="d${Math.min(nodes[i].d, 1)}">${nodes[i].html}</li>`; i++; }
        i--;
        const many = (items.match(/<li/g) || []).length > 6 && depth === 0;
        html += `<ul class="list${many ? ' cols' : ''} reveal">${items}</ul>`;
      } else if (n.t === 'file' || n.t === 'link') {
        let items = '';
        while (i < nodes.length && (nodes[i].t === 'file' || nodes[i].t === 'link')) { items += fileChip(nodes[i]); i++; }
        i--;
        html += `<div class="files">${items}</div>`;
      } else if (n.t === 'img') {
        const run = [];
        while (i < nodes.length && nodes[i].t === 'img') { run.push(nodes[i]); i++; }
        i--;
        html += `<div class="gallery">${run.map((m) => thumb(m, run.length === 1)).join('')}</div>`;
      } else if (n.t === 'acc') {
        html += accordion(n, depth);
      } else if (n.t === 'p') {
        html += `<p class="p reveal">${n.html}</p>`;
      } else if (n.t === 'h') {
        html += `<h3 class="h reveal">${n.html}</h3>`;
      } else if (n.t === 'hr') {
        html += '<hr class="sep">';
      } else if (n.t === 'video') {
        html += `<div class="vid"><video controls preload="metadata" playsinline src="${esc(n.src)}"></video></div>`;
      } else if (n.t === 'audio') {
        html += `<audio controls preload="none" src="${esc(n.src)}"></audio>`;
      } else if (n.t === 'yt') {
        html += `<div class="yt"><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/${esc(n.id)}" title="YouTube video" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`;
      }
    }
    return html;
  }
  function fileChip(n) {
    if (n.t === 'link') {
      return `<a class="file link" href="${esc(n.url)}" target="_blank" rel="noopener" title="${esc(n.url)}">${icon('link')}<span>${esc(n.label)}</span><i class="ext">link</i></a>`;
    }
    const gi = gallery.push(n) - 1;
    return `<button class="file" data-media="${gi}" title="${esc(n.label)} · ${fmtSize(n.size)}">${icon('doc')}<span>${esc(n.label)}</span><i class="ext">${esc(n.ext)}</i></button>`;
  }
  function thumb(n, wide) {
    const gi = gallery.push(n) - 1;
    return `<button class="thumb${wide ? ' wide' : ''}" data-media="${gi}" aria-label="Open image ${esc(n.label)}"><img loading="lazy" src="${esc(n.src)}" alt="${esc(n.label)}"></button>`;
  }
  function accordion(n, depth) {
    const c = countDeep(n.children);
    const badges = [c.docs && `<span class="chip">${c.docs} doc</span>`, c.images && `<span class="chip">${c.images} img</span>`,
      (c.videos || c.audio) && `<span class="chip">${c.videos + c.audio} media</span>`, c.links && `<span class="chip">${c.links} link</span>`].filter(Boolean).join('');
    const empty = !n.children.length;
    return `<div class="acc reveal${empty ? ' empty' : ''}" data-depth="${depth}">
      <button class="acc-h" aria-expanded="false"${empty ? ' tabindex="-1"' : ''}><i class="dot"></i><span class="t">${n.title || 'Details'}</span><span class="badges">${badges}</span><span class="chev">${icon('chev')}</span></button>
      <div class="acc-b"><div><div class="acc-in">${empty ? '' : renderNodes(n.children, depth + 1)}</div></div></div></div>`;
  }

  /* ---------- views ---------- */
  function secHead(s, extra = '') {
    const st = s.stats || null;
    return `<div class="sec-head" style="--hue:${s.hue}">
      <div class="crumbs"><button data-go="home">Dashboard</button>${icon('chev')}<span>${s.idx + 1} / ${SECS.length}</span></div>
      <div class="ico">${icon(s.icon)}</div>
      <h2>${esc(s.title)}</h2>
      ${s.lede ? `<p class="lede">${esc(s.lede)}</p>` : ''}
      <div class="sec-stats">${statChips(st)}${extra}</div>
    </div>`;
  }
  function secNav(s) {
    const prev = SECS[s.idx - 1], next = SECS[s.idx + 1];
    return `<div class="sec-nav">
      ${prev ? `<button class="btn ghost" data-go="${prev.id}">${icon('arrowL')}<span>${esc(prev.short)}</span></button>` : '<span></span>'}
      ${next ? `<button class="btn primary" data-go="${next.id}"><span>${esc(next.short)}</span>${icon('arrowR')}</button>` : `<button class="btn primary" data-go="home">${icon('home')}<span>Back to dashboard</span></button>`}
    </div>`;
  }
  const toolbar = (n) => `<div class="toolbar">
      <button class="btn" data-act="expand">${icon('expand')}Expand all</button>
      <button class="btn" data-act="collapse">${icon('collapse')}Collapse all</button>
      <button class="btn on" data-filter="all">All</button>
      <button class="btn" data-filter="docs">${icon('doc')}With documents</button>
      <button class="btn" data-filter="media">${icon('image')}With images / video</button>
      <span class="count">${n} entries</span></div>`;

  function viewSummary(s) {
    const pillars = [
      ['sparkles', '#36e2c4', P.summary[0]],
      ['coins', '#ffc65c', P.summary[1]],
      ['graduation', '#6f7dff', P.summary[2]],
      ['cpu', '#ff7ab6', P.summary[3]],
    ];
    const max = Math.max(...D.tracks.map((t) => t.courses));
    const bars = D.tracks.slice().sort((a, b) => b.courses - a.courses).map((t) => `
      <button class="bar" data-go="${t.id}"><span class="lbl"><span>${esc(byId[t.id].short)}</span><b>${t.courses}</b></span>
      <span class="track"><span class="fill" data-w="${(t.courses / max) * 100}%"></span></span></button>`).join('');
    return secHead(s) + `
      <div class="summary-grid">
        <div class="card reveal"><h3>Profile highlights</h3><div class="pillars">
          ${pillars.map(([ic, hue, txt]) => `<div class="pillar" style="--hue:${hue}"><span class="ico">${icon(ic)}</span><p>${esc(txt)}</p></div>`).join('')}
        </div></div>
        <div class="card reveal"><h3>“From AI to Human” — video</h3>
          <video controls preload="metadata" playsinline poster="${esc(P.cover)}" src="${esc(P.video)}"></video>
          <p class="p" style="color:var(--muted);margin-top:10px;font-size:13px">AI-generated video created by Pedro.</p>
        </div>
        <div class="card reveal"><h3>Training footprint — ${D.totals.courses} courses</h3><div class="bars">${bars}</div></div>
        <div class="card reveal"><h3>At a glance</h3>
          <ul class="list">
            <li>Founder of <strong>five companies</strong> across different sectors</li>
            <li>Board member at <strong>Atlantic Premium Capital Partners</strong> (crypto, renewables, equity)</li>
            <li>Trading and investing in crypto-assets <strong>since 2015</strong></li>
            <li>Builds AI agents, chatbots, avatars, web apps and dashboards</li>
            <li>Languages: Portuguese (native), English (excellent), Spanish (good)</li>
          </ul>
          <div class="hero-cta" style="margin-top:14px"><button class="btn primary" data-go="experience">Experience ${icon('arrowR')}</button><button class="btn ghost" data-go="portfolio">Portfolio</button></div>
        </div>
      </div>` + secNav(s);
  }

  function viewExperience(s) {
    const items = s.nodes.filter((n) => n.t === 'acc').map((n) => {
      const txt = n.title.replace(/<[^>]+>/g, '');
      const m = txt.match(/^\s*(\d{4}\s*\/\s*(?:\d{4}|Present))\s*[-–]?\s*(.*)$/i);
      const when = m ? m[1].replace(/\s+/g, ' ') : 'Earlier';
      const role = m ? m[2] : txt;
      return `<div class="tl reveal"><span class="when">${esc(when)}</span>${accordion({ ...n, title: `<strong>${esc(role)}</strong>` }, 0)}</div>`;
    }).join('');
    return secHead(s) + `<div class="toolbar"><button class="btn" data-act="expand">${icon('expand')}Expand all</button><button class="btn" data-act="collapse">${icon('collapse')}Collapse all</button></div>
      <div class="timeline">${items}</div>` + secNav(s);
  }

  function viewTraining(s) {
    const cards = s.tracks.map((id) => {
      const t = byId[id];
      return `<button class="tile in" style="--hue:${t.hue};opacity:1;transform:none" data-go="${id}">
        <span class="ico">${icon(t.icon)}</span><h3>${esc(t.title)}</h3>
        ${t.lede ? `<p>${esc(t.lede.slice(0, 110))}${t.lede.length > 110 ? '…' : ''}</p>` : ''}
        <span class="meta">${statChips({ courses: t.stats.courses, docs: t.stats.docs, images: t.stats.images })}</span></button>`;
    }).join('');
    const total = s.tracks.reduce((a, id) => a + byId[id].stats.courses, 0);
    return secHead(s, `<span class="chip"><b>${total}</b> courses in ${s.tracks.length} tracks</span>`) + `<div class="tracks">${cards}</div>` + secNav(s);
  }

  function viewLanguages(s) {
    const lvl = { Excellent: 100, Good: 70, Average: 50, Bad: 18 };
    const cards = P.languages.map((l) => `<div class="card lang reveal"><h3>${esc(l.name)}</h3>${l.native ? '<p class="native">Mother tongue</p><div class="meter"><i data-w="100%"></i></div>' :
      ['reading', 'writing', 'speaking'].map((k) => `<div class="row"><span>${k[0].toUpperCase() + k.slice(1)}</span><div title="${l[k]}"><div class="meter"><i data-w="${lvl[l[k]]}%"></i></div></div></div>`).join('') +
      `<p class="p" style="font-size:12px;color:var(--muted);margin-top:8px">Reading ${l.reading} · Writing ${l.writing} · Speaking ${l.speaking}</p>`}</div>`).join('');
    return secHead(s) + `<div class="lang-grid" style="margin-top:18px">${cards}</div><div class="content" style="margin-top:16px">${renderNodes(s.nodes)}</div>` + secNav(s);
  }

  function viewPortfolio(s) {
    const cats = [];
    s.nodes.filter((n) => n.t === 'acc').forEach((cat) => {
      const catName = cat.title.replace(/<[^>]+>/g, '').trim();
      const subs = cat.children.filter((c) => c.t === 'acc');
      const entries = subs.length ? subs : [cat];
      const cards = entries.map((e) => {
        const all = []; (function w(ns) { ns.forEach((x) => { all.push(x); if (x.children) w(x.children); }); })(e.children);
        const img = all.find((x) => x.t === 'img');
        const vid = all.find((x) => x.t === 'video');
        const links = all.filter((x) => x.t === 'link' || (x.t === 'p' && /href=/.test(x.html)));
        const texts = all.filter((x) => x.t === 'p' && !/href=/.test(x.html)).map((x) => x.html);
        const extraImgs = all.filter((x) => x.t === 'img').slice(1);
        const subAccs = e === cat ? [] : e.children.filter((c) => c.t === 'acc');
        let shot;
        if (img) { const gi = gallery.push(img) - 1; shot = `<button class="shot" data-media="${gi}" aria-label="Open screenshot"><img loading="lazy" src="${esc(img.src)}" alt=""></button>`; }
        else if (vid) shot = `<div class="shot" style="cursor:auto"><video controls preload="metadata" playsinline src="${esc(vid.src)}" style="height:100%;border-radius:0"></video></div>`;
        else shot = `<div class="shot" style="cursor:auto">${icon(byId.portfolio.icon)}</div>`;
        const linkHtml = links.map((l) => l.t === 'link' ? fileChip(l) : l.html.replace(/<a /g, '<a class="file link" ')).join(' ');
        return `<article class="pcard reveal" data-cat="${esc(catName)}">${shot}<div class="body"><span class="cat">${esc(catName)}</span>
          <h3>${e === cat ? esc(catName) : e.title}</h3>${texts.map((t) => `<p>${t}</p>`).join('')}
          ${extraImgs.length ? `<div class="gallery">${extraImgs.map((m) => thumb(m)).join('')}</div>` : ''}
          ${subAccs.length ? renderNodes(subAccs, 1) : ''}
          ${linkHtml ? `<div class="files">${linkHtml}</div>` : ''}</div></article>`;
      });
      cats.push({ name: catName, html: cards.join('') });
    });
    const tabs = `<div class="port-tabs"><button class="btn on" data-cat="*">All</button>${cats.map((c) => `<button class="btn" data-cat="${esc(c.name)}">${esc(c.name.replace(/ - With.*$/, ' (Power BI)'))}</button>`).join('')}</div>`;
    return secHead(s) + tabs + `<div class="port-grid">${cats.map((c) => c.html).join('')}</div>` + secNav(s);
  }

  function viewContacts(s) {
    const c = P.contacts;
    const items = [
      ['phone', 'Mobile', `<a href="tel:${c.mobile.replace(/\s/g, '')}">${esc(c.mobile)}</a>`, c.mobile],
      ['mail', 'E-mail', `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`, c.email],
      ['linkedin', 'LinkedIn', `<a href="${esc(c.linkedin)}" target="_blank" rel="noopener">linkedin.com/in/pedrodinisvarelapinto</a>`, c.linkedin],
      ['pin', 'Address', `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}" target="_blank" rel="noopener">${esc(c.address)}</a>`, c.address],
      ['cake', 'Born', esc(c.born), null],
      ['flag', 'Nationality', esc(c.nationality), null],
      ['id', 'Professional registrations', esc(c.registrations), null],
      ['notion', 'Full CV on Notion', `<a href="${esc(P.notion)}" target="_blank" rel="noopener">Open Notion page</a>`, null],
    ];
    return secHead(s) + `<div class="contact-grid">
      <div class="contact-photo reveal"><img src="${esc(P.photo)}" alt="Pedro Varela Pinto"></div>
      <div class="contact-list">${items.map(([ic, k, v, cp]) => `<div class="citem reveal"><span class="ico">${icon(ic)}</span><div><small>${k}</small><b>${v}</b></div>${cp ? `<button class="icon-btn copy" data-copy="${esc(cp)}" aria-label="Copy ${k}">${icon('copy')}</button>` : ''}</div>`).join('')}
        <div class="contact-actions">
          <a class="btn primary" href="mailto:${esc(c.email)}?subject=${encodeURIComponent('Hello Pedro')}">${icon('mail')}Send an e-mail</a>
          <button class="btn ghost" data-act="vcard">${icon('download')}Save contact (vCard)</button>
          <a class="btn ghost" href="${esc(c.linkedin)}" target="_blank" rel="noopener">${icon('linkedin')}Connect on LinkedIn</a>
        </div>
      </div></div>` + secNav(s);
  }

  function viewGeneric(s) {
    const n = s.nodes.filter((x) => x.t === 'acc' || x.t === 'li').length;
    const hasAcc = s.nodes.some((x) => x.t === 'acc');
    return secHead(s) + (hasAcc ? toolbar(n) : '') + `<div class="content" style="margin-top:${hasAcc ? 0 : 18}px">${renderNodes(s.nodes)}</div>` + secNav(s);
  }

  function viewSearch(q) {
    const ql = q.toLowerCase();
    const hits = [];
    D.sections.forEach((s) => {
      (function w(ns, trail) {
        ns.forEach((n) => {
          const text = (n.title || n.html || n.label || '').replace(/<[^>]+>/g, '');
          if ((n.t === 'acc' || n.t === 'li' || n.t === 'p' || n.t === 'file') && text.toLowerCase().includes(ql)) hits.push({ s, n, text, trail });
          if (n.children) w(n.children, n.t === 'acc' ? [...trail, n.title.replace(/<[^>]+>/g, '')] : trail);
        });
      })(s.nodes, []);
    });
    const mark = (t) => esc(t).replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), (m) => `<mark>${m}</mark>`);
    const groups = {};
    hits.slice(0, 300).forEach((h) => { (groups[h.s.id] = groups[h.s.id] || []).push(h); });
    const body = Object.keys(groups).length ? Object.entries(groups).map(([id, hs]) => {
      const s = byId[id];
      return `<div class="acc open reveal" style="--hue:${s.hue}"><button class="acc-h" aria-expanded="true"><i class="dot"></i><span class="t"><strong>${esc(s.title)}</strong></span><span class="badges"><span class="chip">${hs.length} match${hs.length > 1 ? 'es' : ''}</span></span><span class="chev">${icon('chev')}</span></button>
        <div class="acc-b"><div><div class="acc-in"><ul class="list">${hs.map((h) => `<li><a href="#${id}" data-find="${esc(h.text.slice(0, 80))}">${mark(h.text)}</a>${h.trail.length ? `<br><small style="color:var(--muted)">${esc(h.trail.join(' › '))}</small>` : ''}</li>`).join('')}</ul></div></div></div></div>`;
    }).join('') : `<div class="empty-state">No results for “${esc(q)}”.</div>`;
    return `<div class="sec-head"><div class="crumbs"><button data-go="home">Dashboard</button>${icon('chev')}<span>Search</span></div>
      <h2>Results for “${esc(q)}”</h2><p class="lede">${hits.length} matches across the curriculum.</p></div><div class="content" style="margin-top:18px">${body}</div>`;
  }

  /* ---------- home ---------- */
  function buildHome() {
    const yrs = new Date().getFullYear() - 1992;
    const kpis = [
      [yrs, '+', 'years of career'],
      [D.totals.courses, '', 'courses & certifications'],
      [5, '', 'companies founded'],
      [D.totals.docs, '', 'documents & certificates'],
      [D.totals.images + D.totals.videos + D.totals.audio, '', 'images, videos & audio'],
      [3, '', 'working languages'],
    ];
    $('#kpis').innerHTML = kpis.map(([v, suf, l]) => `<div class="kpi"><b data-count="${v}" data-suf="${suf}">0</b><span>${l}</span></div>`).join('');
    $('#tiles').innerHTML = SECS.map((s) => {
      const st = s.stats;
      const meta = st ? statChips({ courses: st.courses, docs: st.docs, images: st.images, videos: st.videos }) :
        s.id === 'training' ? `<span class="chip">${s.tracks.length} tracks</span>` : s.id === 'summary' ? '<span class="chip">profile</span><span class="chip">video</span>' : '<span class="chip">phone · e-mail · LinkedIn</span>';
      const feature = s.id === 'summary' || s.id === 'portfolio';
      return `<button class="tile${feature ? ' feature' : ''}" style="--hue:${s.hue}" data-go="${s.id}">
        <span class="num">${String(s.idx + 1).padStart(2, '0')}</span>
        <span class="ico">${icon(s.icon)}</span><h3>${esc(s.title)}</h3>
        ${s.lede && feature ? `<p>${esc(s.lede)}</p>` : ''}<span class="meta">${meta}</span></button>`;
    }).join('');
    $('#dock').innerHTML = `<button data-go="home" data-tip="Dashboard">${icon('home')}</button>` +
      SECS.map((s) => `<button data-go="${s.id}" data-tip="${esc(s.short)}" style="--hue:${s.hue}">${icon(s.icon)}</button>`).join('');

    // name split animation + typing
    const nameEl = $('.split');
    if (!reduced) nameEl.innerHTML = [...nameEl.textContent].map((ch, i) => `<span class="ch" style="animation-delay:${200 + i * 45}ms;background-position:${i * 6}% 0">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`).join('');
    const phrases = ['Full-stack builder with Artificial Intelligence', 'Investment analyst — real estate, renewables & crypto-assets',
      'Electrical & Computer Engineer (I.S.T.) · Master in Energy Management', 'Founder of five companies · Board member at Atlantic Premium', 'AI agents, chatbots, avatars, dashboards & web apps'];
    const el = $('#typed');
    if (reduced) { el.textContent = phrases[0]; return; }
    let pi = 0, ci = 0, del = false;
    (function tick() {
      const p = phrases[pi];
      el.textContent = p.slice(0, ci);
      if (!del && ci === p.length) { del = true; return setTimeout(tick, 2200); }
      if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
      ci += del ? -1 : 1;
      setTimeout(tick, del ? 22 : 45);
    })();
  }
  function runCounters() {
    $$('[data-count]').forEach((el) => {
      const target = +el.dataset.count, suf = el.dataset.suf;
      if (reduced) { el.textContent = target + suf; return; }
      const t0 = performance.now(), dur = 1600;
      (function step(t) {
        const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(target * e) + suf;
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    });
  }

  /* ---------- router ---------- */
  let current = null;
  function go(id, opts = {}) {
    if (id === 'home') { if (location.hash) history.pushState(null, '', location.pathname); show('home'); return; }
    if (location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    show(id, opts);
  }
  function show(id, opts = {}) {
    gallery = [];
    const home = $('#home'), sec = $('#section');
    $$('#dock button').forEach((b) => b.classList.toggle('on', b.dataset.go === id));
    if (id === 'home' || (!byId[id] && !id.startsWith('search='))) {
      current = null; sec.classList.remove('active'); home.classList.add('active'); $('#dock').classList.remove('show');
      window.scrollTo({ top: 0 }); return;
    }
    let html;
    if (id.startsWith('search=')) html = viewSearch(decodeURIComponent(id.slice(7)));
    else {
      const s = byId[id];
      html = s.id === 'summary' ? viewSummary(s) : s.id === 'contacts' ? viewContacts(s) : s.id === 'experience' ? viewExperience(s) :
        s.id === 'training' ? viewTraining(s) : s.id === 'languages' ? viewLanguages(s) : s.id === 'portfolio' ? viewPortfolio(s) : viewGeneric(s);
      sec.style.setProperty('--hue', s.hue);
    }
    current = id;
    home.classList.remove('active');
    sec.classList.remove('active'); void sec.offsetWidth; // restart entrance animation
    sec.innerHTML = html; sec.classList.add('active');
    $('#dock').classList.add('show');
    reveal(sec); animateBars(sec);
    if (!opts.keepScroll) window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    if (opts.find) setTimeout(() => findAndOpen(opts.find), 120);
  }
  function findAndOpen(text) {
    const t = text.toLowerCase();
    const el = $$('#section .acc-h .t, #section .list li, #section .p, #section .file span').find((e) => e.textContent.toLowerCase().includes(t));
    if (!el) return;
    let acc = el.closest('.acc');
    while (acc) { setOpen(acc, true); acc = acc.parentElement.closest('.acc'); }
    $$('#section .reveal').forEach((r) => r.classList.add('in'));
    setTimeout(() => { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.animate([{ background: 'rgba(255,198,92,.5)' }, { background: 'transparent' }], { duration: 2200 }); }, 300);
  }
  const route = () => show(decodeURIComponent(location.hash.slice(1)) || 'home');
  window.addEventListener('popstate', route);

  /* ---------- interactions ---------- */
  function setOpen(acc, open) {
    if (acc.classList.contains('empty')) return;
    acc.classList.toggle('open', open);
    $('.acc-h', acc).setAttribute('aria-expanded', open);
    if (open) $$('.reveal', acc).forEach((r) => r.classList.add('in'));
  }
  document.addEventListener('click', (e) => {
    const g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); go(g.dataset.go); return; }
    const f = e.target.closest('[data-find]');
    if (f) { e.preventDefault(); const id = f.getAttribute('href').slice(1); history.pushState(null, '', '#' + id); show(id, { find: f.dataset.find }); return; }
    const h = e.target.closest('.acc-h');
    if (h) { const acc = h.parentElement; setOpen(acc, !acc.classList.contains('open')); return; }
    const m = e.target.closest('[data-media]');
    if (m) { openModal(+m.dataset.media); return; }
    const cp = e.target.closest('[data-copy]');
    if (cp) { copy(cp.dataset.copy); return; }
    const a = e.target.closest('[data-act]');
    if (a) {
      const act = a.dataset.act;
      if (act === 'expand' || act === 'collapse') $$('#section .acc').forEach((x) => setOpen(x, act === 'expand'));
      if (act === 'vcard') downloadVcard();
      return;
    }
    const fl = e.target.closest('[data-filter]');
    if (fl) {
      $$('[data-filter]').forEach((b) => b.classList.toggle('on', b === fl));
      const mode = fl.dataset.filter;
      $$('#section .content > .acc').forEach((acc) => {
        const has = mode === 'all' || (mode === 'docs' ? $('.file:not(.link)', acc) : $('img, video, audio, iframe', acc));
        acc.style.display = has ? '' : 'none';
      });
      $$('#section .content > .list').forEach((l) => (l.style.display = mode === 'all' ? '' : 'none'));
      return;
    }
    const pc = e.target.closest('[data-cat]');
    if (pc && pc.classList.contains('btn')) {
      $$('.port-tabs .btn').forEach((b) => b.classList.toggle('on', b === pc));
      $$('.pcard').forEach((card) => {
        const show = pc.dataset.cat === '*' || card.dataset.cat === pc.dataset.cat;
        card.style.display = show ? '' : 'none';
        if (show && !reduced) card.animate([{ opacity: 0, transform: 'translateY(14px) scale(.98)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.2,.8,.2,1)' });
      });
    }
  });

  // tile spotlight + tilt
  document.addEventListener('pointermove', (e) => {
    const glow = $('.cursor-glow'); glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px';
    const t = e.target.closest && e.target.closest('.tile');
    if (!t || reduced) return;
    const r = t.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    t.style.setProperty('--mx', x + 'px'); t.style.setProperty('--my', y + 'px');
    t.style.transform = `rotateX(${((y / r.height) - .5) * -7}deg) rotateY(${((x / r.width) - .5) * 9}deg) translateY(-4px)`;
  });
  document.addEventListener('pointerout', (e) => { const t = e.target.closest && e.target.closest('.tile'); if (t && !t.contains(e.relatedTarget)) t.style.transform = ''; });

  // search
  const search = $('#search');
  let st;
  search.addEventListener('input', () => {
    clearTimeout(st);
    const q = search.value.trim();
    st = setTimeout(() => {
      if (q.length >= 2) { history.replaceState(null, '', '#search=' + encodeURIComponent(q)); show('search=' + encodeURIComponent(q), { keepScroll: true }); }
      else if (!q && current && current.startsWith('search=')) go('home');
    }, 220);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== search) { e.preventDefault(); search.focus(); }
    if ($('#modal').classList.contains('open')) {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') stepModal(1);
      if (e.key === 'ArrowLeft') stepModal(-1);
    } else if (e.key === 'Escape' && current) go('home');
  });

  /* ---------- modal viewer ---------- */
  let mIdx = -1;
  function openModal(i) {
    const n = gallery[i]; if (!n) return;
    mIdx = i;
    const body = $('#modalBody');
    $('#modalTitle').textContent = n.label;
    $('#modalOpen').href = n.src;
    const ext = (n.ext || '').toLowerCase();
    if (n.t === 'img') body.innerHTML = `<img src="${esc(n.src)}" alt="${esc(n.label)}">`;
    else if (ext === 'pdf') body.innerHTML = `<iframe src="${esc(n.src)}#view=FitH" title="${esc(n.label)}"></iframe>`;
    else if (ext === 'txt') body.innerHTML = `<iframe src="${esc(n.src)}" title="${esc(n.label)}"></iframe>`;
    else body.innerHTML = `<div class="dl">${icon('doc')}<p>${esc(n.label)} · ${esc(ext.toUpperCase())} · ${fmtSize(n.size)}</p><a class="btn primary" href="${esc(n.src)}" download>${icon('download')}Download file</a></div>`;
    $('#modal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() { $('#modal').classList.remove('open'); $('#modalBody').innerHTML = ''; document.body.style.overflow = ''; }
  function stepModal(d) { if (gallery.length) openModal((mIdx + d + gallery.length) % gallery.length); }
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalNext').addEventListener('click', () => stepModal(1));
  $('#modalPrev').addEventListener('click', () => stepModal(-1));
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });

  function downloadVcard() {
    const c = P.contacts;
    const v = ['BEGIN:VCARD', 'VERSION:3.0', 'N:Varela Pinto;Pedro Dinis;;;', 'FN:Pedro Varela Pinto', `TEL;TYPE=CELL:${c.mobile.replace(/\s/g, '')}`,
      `EMAIL:${c.email}`, `URL:${c.linkedin}`, 'ADR;TYPE=HOME:;;Rua Rodrigo Reinel nº4 4ºEsq;Lisboa;;1400-320;Portugal', 'BDAY:1968-03-03', 'END:VCARD'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([v], { type: 'text/vcard' }));
    a.download = 'Pedro_Varela_Pinto.vcf'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  /* ---------- theme ---------- */
  const themeBtn = $('#themeBtn');
  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    themeBtn.innerHTML = icon(t === 'light' ? 'moon' : 'sunTheme');
    try { localStorage.setItem('cv-theme', t); } catch { /* storage unavailable */ }
  }
  let saved = null;
  try { saved = localStorage.getItem('cv-theme'); } catch { /* storage unavailable */ }
  setTheme(saved || 'dark');
  themeBtn.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'));

  /* ---------- animated background: neural network ---------- */
  (function network() {
    const cv = $('#bg'); const ctx = cv.getContext('2d');
    if (reduced || !ctx) return;
    let w, h, pts, mouse = { x: -999, y: -999 };
    const dpr = Math.min(devicePixelRatio || 1, 2);
    function size() {
      w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr;
      cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';
      const n = Math.min(90, Math.round((innerWidth * innerHeight) / 16000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35 * dpr, vy: (Math.random() - .5) * .35 * dpr }));
    }
    size(); addEventListener('resize', size);
    addEventListener('pointermove', (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });
    const link = 140 * dpr;
    (function frame() {
      ctx.clearRect(0, 0, w, h);
      const light = document.documentElement.dataset.theme === 'light';
      const col = light ? '69,82,230' : '54,226,196';
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, dm = Math.hypot(dx, dy);
        if (dm < 120 * dpr) { p.x += dx / dm; p.y += dy / dm; }
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < link) { ctx.strokeStyle = `rgba(${col},${(1 - d / link) * .35})`; ctx.lineWidth = dpr * .8; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        ctx.fillStyle = `rgba(${col},.8)`; ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 1.6 * dpr, 0, 7); ctx.fill();
      }
      if (!document.hidden) requestAnimationFrame(frame); else setTimeout(() => requestAnimationFrame(frame), 500);
    })();
  })();

  /* ---------- boot ---------- */
  buildHome();
  reveal($('#home'));
  const kObs = 'IntersectionObserver' in window ? new IntersectionObserver((ents, o) => { if (ents.some((e) => e.isIntersecting)) { runCounters(); o.disconnect(); } }) : null;
  kObs ? kObs.observe($('#kpis')) : runCounters();
  route();
})();
