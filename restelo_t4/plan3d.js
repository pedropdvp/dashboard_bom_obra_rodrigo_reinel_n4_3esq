/* Isometric 3D floor plan of the Restelo T4 (layout from Planta_Casa_1), drawn as SVG.
   Coordinates are in pixels of the original 2D plan; the 7 intervened divisions are raised in navy
   and each one gets a callout with an arrow. */
(function () {
  const ROOMS = [
    // id, label, area, polygon, zone (null = not intervened)
    { id: 'sala', name: 'Sala Estar + Jantar', area: '45,06', zone: null, pts: [[105, 100], [158, 100], [158, 42], [275, 42], [275, 232], [105, 232]] },
    { id: 'core', name: 'Escadas', area: '', zone: null, core: true, pts: [[275, 42], [395, 42], [395, 105], [275, 105]] },
    { id: 'hall', name: 'Hall', area: '12,07', zone: 'entrada', pts: [[275, 105], [395, 105], [395, 165], [377, 165], [377, 200], [342, 200], [342, 240], [275, 240]] },
    { id: 'is_sq', name: 'IS', area: '2,60', zone: 'wc', pts: [[395, 42], [462, 42], [462, 80], [395, 80]] },
    { id: 'salaquarto', name: 'Sala-Quarto', area: '11,60', zone: null, pts: [[462, 42], [515, 42], [515, 125], [395, 125], [395, 80], [462, 80]] },
    { id: 'zcirc', name: 'Zona Circ.', area: '4,40', zone: null, pts: [[395, 125], [462, 125], [462, 165], [395, 165]] },
    { id: 'lav', name: 'Lavandaria', area: '2,98', zone: 'lavandaria', pts: [[462, 125], [515, 125], [515, 165], [462, 165]] },
    { id: 'coz', name: 'Cozinha', area: '13,35', zone: 'cozinha', pts: [[377, 165], [515, 165], [515, 240], [377, 240]] },
    { id: 'is_soc', name: 'IS', area: '1,96', zone: 'wc', pts: [[342, 200], [377, 200], [377, 240], [342, 240]] },
    { id: 'piano', name: 'Sala Piano', area: '15,19', zone: null, pts: [[155, 232], [275, 232], [275, 330], [155, 330]] },
    { id: 'is1', name: 'IS 1', area: '3,40', zone: 'wc', pts: [[317, 240], [377, 240], [377, 290], [317, 290]] },
    { id: 'zc', name: 'ZC', area: '9,78', zone: null, pts: [[275, 240], [317, 240], [317, 290], [377, 290], [377, 365], [340, 365], [340, 330], [275, 330]] },
    { id: 'q2', name: 'Quarto 2', area: '17,18', zone: null, pts: [[377, 240], [520, 240], [520, 327], [377, 327]] },
    { id: 'q1', name: 'Quarto 1', area: '21,78', zone: null, pts: [[182, 330], [340, 330], [340, 430], [182, 430]] },
    { id: 'is_suite', name: 'IS Suite', area: '3,90', zone: 'wc', pts: [[340, 365], [380, 365], [380, 430], [340, 430]] },
    { id: 'suite', name: 'Suite', area: '13,64', zone: null, pts: [[377, 327], [480, 327], [480, 430], [380, 430], [380, 365], [377, 365]] }
  ];

  // callouts: room id, title, subtitle, side, vertical slot (0..1), card style
  const CALLOUTS = [
    { room: 'hall', title: 'Entrada', sub: 'Hall · 12,07 m² · Nova volumetria', side: 'L', y: 0.16, style: 'steel' },
    { room: 'is_soc', title: 'Casa de Banho Social', sub: 'IS · 1,96 m² · Renovação integral', side: 'L', y: 0.40, style: 'marble' },
    { room: 'is1', title: 'Casa de Banho 1', sub: 'IS 1 · 3,40 m² · Renovação integral', side: 'L', y: 0.64, style: 'marble' },
    { room: 'is_suite', title: 'Casa de Banho Suite', sub: 'IS Suite · 3,90 m² · Renovação integral', side: 'L', y: 0.88, style: 'marble' },
    { room: 'is_sq', title: 'Casa de Banho Sala-Quarto', sub: 'IS · 2,60 m² · Renovação integral', side: 'R', y: 0.10, style: 'marble' },
    { room: 'lav', title: 'Lavandaria', sub: '2,98 m² · Lavar e secar roupa', side: 'R', y: 0.36, style: 'wood' },
    { room: 'coz', title: 'Cozinha', sub: '13,35 m² · Chave-na-mão, 100% equipada', side: 'R', y: 0.62, style: 'wood' }
  ];

  const W = 1400, H = 570, S = 1.25, C = Math.cos(Math.PI / 6), SN = 0.5;
  const OX = 622, OY = 66;
  const prj = (x, y, z = 0) => [OX + (x - y) * C * S, OY + (x + y - 200) * SN * S - z];
  const pts = a => a.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ');
  const centroid = poly => {
    let a = 0, cx = 0, cy = 0;
    poly.forEach((p, i) => {
      const q = poly[(i + 1) % poly.length], f = p[0] * q[1] - q[0] * p[1];
      a += f; cx += (p[0] + q[0]) * f; cy += (p[1] + q[1]) * f;
    });
    return [cx / (3 * a), cy / (3 * a)];
  };
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  function render(svg, opts = {}) {
    const NS = 'http://www.w3.org/2000/svg';
    const faces = [];
    // edges of the raised rooms: a neighbour's low wall on the same line would cover them
    const hiEdges = [];
    ROOMS.filter(r => r.zone).forEach(r => r.pts.forEach((p, i) => hiEdges.push([p, r.pts[(i + 1) % r.pts.length]])));
    const onHiEdge = (p, q) => hiEdges.some(([a, b]) => {
      const k = a[0] === b[0] ? 0 : a[1] === b[1] ? 1 : -1;
      if (k < 0 || p[k] !== q[k] || p[k] !== a[k]) return false;
      const j = 1 - k, lo = Math.min(a[j], b[j]), hi = Math.max(a[j], b[j]);
      return Math.min(p[j], q[j]) < hi && Math.max(p[j], q[j]) > lo;
    });
    ROOMS.forEach(r => {
      const hi = !!r.zone, h = r.core ? 16 : hi ? 34 : 20;
      r.pts.forEach((p, i) => {
        const q = r.pts[(i + 1) % r.pts.length];
        if (!hi && onHiEdge(p, q)) return;
        const along = Math.abs(q[0] - p[0]) > Math.abs(q[1] - p[1]);
        faces.push({ r, hi, d: (p[0] + q[0] + p[1] + q[1]) / 2, along,
          poly: [prj(p[0], p[1]), prj(q[0], q[1]), prj(q[0], q[1], h), prj(p[0], p[1], h)] });
      });
    });
    faces.sort((a, b) => a.d - b.d);

    let out = `<defs>
      <marker id="p3arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="#5d6c7b"/></marker>
      <linearGradient id="p3marble" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#eef0f2"/><stop offset="1" stop-color="#f8f8f8"/></linearGradient>
      <linearGradient id="p3wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c8a679"/><stop offset=".5" stop-color="#b8925f"/><stop offset="1" stop-color="#caa87b"/></linearGradient>
      <linearGradient id="p3steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e3e5e7"/><stop offset=".5" stop-color="#a9adb1"/><stop offset="1" stop-color="#d9dbdd"/></linearGradient>
    </defs>`;
    // floors
    ROOMS.forEach(r => {
      const fill = r.core ? '#e6e1d6' : r.zone ? '#13294b' : '#fbf8f1';
      out += `<polygon class="p3-floor${r.zone ? ' p3-hi' : ''}" data-room="${r.id}"${r.zone ? ` data-zone="${r.zone}"` : ''}
        points="${pts(r.pts.map(p => prj(p[0], p[1])))}" fill="${fill}" stroke="${r.zone ? '#0c1d38' : '#b7b0a2'}" stroke-width="1"/>`;
      if (r.core) {
        for (let k = 0; k < 7; k++) {
          const y = 52 + k * 7;
          out += `<polyline points="${pts([prj(285, y), prj(330, y)])}" stroke="#b7b0a2" stroke-width=".8" fill="none"/>`;
        }
      }
    });
    // walls (painter's order)
    faces.forEach(f => {
      const fill = f.hi ? (f.along ? '#1d3a66' : '#0f2242') : f.r.core ? '#d8d2c4' : (f.along ? '#ffffff' : '#f1ede4');
      const stroke = f.hi ? '#0b1a33' : '#a9a293';
      out += `<polygon class="p3-wall${f.hi ? ' p3-hi' : ''}" data-room="${f.r.id}"${f.r.zone ? ` data-zone="${f.r.zone}"` : ''}
        points="${pts(f.poly)}" fill="${fill}" fill-opacity="${f.hi ? 0.94 : 0.82}" stroke="${stroke}" stroke-width=".8"/>`;
    });
    // room labels
    ROOMS.forEach(r => {
      if (r.core) return;
      const [cx, cy] = centroid(r.pts), [x, y] = prj(cx, cy, r.zone ? 2 : 1);
      const col = r.zone ? '#ffffff' : '#7a7468';
      const small = (r.pts.length && (Math.max(...r.pts.map(p => p[0])) - Math.min(...r.pts.map(p => p[0]))) < 70);
      out += `<g class="p3-label" pointer-events="none" font-family="Inter, system-ui, sans-serif" text-anchor="middle" fill="${col}">
        <text x="${x.toFixed(1)}" y="${(y - 1).toFixed(1)}" font-size="${small ? 8.5 : 11}" font-weight="${r.zone ? 600 : 500}">${esc(r.name)}</text>
        <text x="${x.toFixed(1)}" y="${(y + (small ? 9 : 12)).toFixed(1)}" font-size="${small ? 7.5 : 9.5}" opacity=".85">${r.area} m²</text></g>`;
    });
    // callouts
    const BW = 250, BH = 54, MX = 10;
    CALLOUTS.forEach((c, i) => {
      const r = ROOMS.find(o => o.id === c.room);
      const [cx, cy] = centroid(r.pts), [ax, ay] = prj(cx, cy, 18);
      const bx = c.side === 'L' ? MX : W - MX - BW, by = 30 + c.y * (H - 60 - BH);
      const sx = c.side === 'L' ? bx + BW : bx, sy = by + BH / 2;
      const midx = c.side === 'L' ? sx + 40 : sx - 40;
      const frame = c.style === 'wood' ? 'url(#p3wood)' : c.style === 'steel' ? 'url(#p3steel)' : 'url(#p3marble)';
      out += `<g class="p3-callout" data-zone="${r.zone}" data-room="${r.id}" tabindex="0" role="button" aria-label="${esc(c.title)}">
        <polyline points="${pts([[sx, sy], [midx, sy], [ax, ay]])}" fill="none" stroke="#5d6c7b" stroke-width="1.4" marker-end="url(#p3arrow)"/>
        <circle cx="${sx}" cy="${sy}" r="3.2" fill="#5d6c7b"/>
        <rect x="${bx}" y="${by}" width="${BW}" height="${BH}" rx="3" fill="${frame}" stroke="#8d949b" stroke-width="1"/>
        <rect class="p3-card" x="${bx + 5}" y="${by + 5}" width="${BW - 10}" height="${BH - 10}" fill="#fbfaf6" stroke="#5d6c7b" stroke-width="1"/>
        <text x="${bx + BW / 2}" y="${by + 25}" text-anchor="middle" font-family="Inter Tight, Inter, sans-serif" font-size="14" font-weight="700" fill="#13294b">${i + 1}. ${esc(c.title)}</text>
        <text x="${bx + BW / 2}" y="${by + 41}" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" fill="#414c58">${esc(c.sub)}</text>
      </g>`;
    });
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('xmlns', NS);
    svg.innerHTML = out;
  }

  window.Plan3D = { render, ROOMS, CALLOUTS };
})();
