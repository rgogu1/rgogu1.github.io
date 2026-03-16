function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function safeUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url, window.location.href);
    if (parsed.protocol === "http:" || parsed.protocol === "https:" || parsed.protocol === "mailto:") return parsed.href;
  } catch {
    // ignore
  }
  return null;
}

function setMeta({ title, description, ogImage }) {
  if (title) document.title = title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc && description) desc.setAttribute("content", description);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && title) ogTitle.setAttribute("content", title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && description) ogDesc.setAttribute("content", description);

  const ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg && ogImage) ogImg.setAttribute("content", ogImage);
}

function renderLinks(container, links) {
  container.innerHTML = "";

  const items = [
    { key: "email", label: "Email", href: links?.email ? `mailto:${links.email}` : null, hint: links?.email },
    { key: "github", label: "GitHub", href: links?.github, hint: "github.com" },
    { key: "linkedin", label: "LinkedIn", href: links?.linkedin, hint: "linkedin.com" },
    { key: "resume", label: "Resume", href: links?.resume, hint: "PDF" }
  ];

  for (const item of items) {
    const href = safeUrl(item.href);
    if (!href) continue;
    const a = el("a", "hero__link");
    a.href = href;
    if (href.startsWith("http")) a.rel = "noreferrer";
    a.textContent = item.label;
    if (item.hint) {
      const code = el("code");
      code.textContent = item.hint;
      a.appendChild(code);
    }
    container.appendChild(a);
  }
}

function renderHighlights(container, highlights) {
  container.innerHTML = "";
  for (const h of highlights || []) {
    const card = el("div", "mini reveal");
    const kicker = el("div", "mini__kicker");
    kicker.textContent = h.kicker || "";
    const title = el("div", "mini__title");
    title.textContent = h.title || "";
    const body = el("div", "mini__body");
    body.textContent = h.body || "";
    card.append(kicker, title, body);
    container.appendChild(card);
  }
}

function renderStats(container, stats) {
  if (!container) return;
  container.innerHTML = "";
  for (const s of stats || []) {
    const item = el("div", "stat reveal");
    const value = el("div", "stat__value");
    value.textContent = s.value || "";
    const label = el("div", "stat__label");
    label.textContent = s.label || "";
    item.append(value, label);
    container.appendChild(item);
  }
}

function renderProjects(container, projects) {
  container.innerHTML = "";
  if (!Array.isArray(projects) || projects.length === 0) {
    const card = el("article", "project reveal");
    const inner = el("div", "project__inner");
    const name = el("div", "project__name");
    name.textContent = "Work Samples";
    const summary = el("div", "project__summary");
    summary.textContent =
      "I’m actively curating a set of public project write-ups. For now, the best place to see what I’m building is my GitHub profile.";

    const links = el("div", "project__links");
    const github = safeUrl(window.__portfolioLinks?.github);
    if (github) {
      const a = el("a");
      a.href = github;
      a.rel = "noreferrer";
      a.textContent = "GitHub Profile";
      links.appendChild(a);
    }

    inner.append(name, summary);
    if (links.childElementCount) inner.appendChild(links);
    card.appendChild(inner);
    container.appendChild(card);
    return;
  }
  for (const p of projects || []) {
    const card = el("article", "project reveal");
    const inner = el("div", "project__inner");
    const name = el("div", "project__name");
    name.textContent = p.name || "";
    const summary = el("div", "project__summary");
    summary.textContent = p.summary || "";

    const tags = el("div", "project__tags");
    for (const t of p.tags || []) {
      const tag = el("span", "tag");
      tag.textContent = t;
      tags.appendChild(tag);
    }

    const links = el("div", "project__links");
    for (const l of p.links || []) {
      const href = safeUrl(l.href);
      if (!href) continue;
      const a = el("a");
      a.href = href;
      a.textContent = l.label || "Link";
      if (href.startsWith("http")) a.rel = "noreferrer";
      links.appendChild(a);
    }

    inner.append(name, summary);
    if ((p.tags || []).length) inner.appendChild(tags);
    if ((p.links || []).length) inner.appendChild(links);
    card.appendChild(inner);
    container.appendChild(card);
  }
}

function renderExperience(container, roles) {
  container.innerHTML = "";
  for (const r of roles || []) {
    const card = el("article", "role reveal");

    const top = el("div", "role__top");
    const left = el("div");
    const company = el("div", "role__company");
    company.textContent = r.company || "";
    const title = el("div", "role__title");
    title.textContent = r.title || "";
    left.append(company, title);

    const time = el("div", "role__time");
    time.textContent = r.time || "";
    top.append(left, time);

    const ul = el("ul", "role__list");
    for (const d of r.details || []) {
      const li = document.createElement("li");
      li.textContent = d;
      ul.appendChild(li);
    }

    card.append(top);
    if ((r.details || []).length) card.appendChild(ul);
    container.appendChild(card);
  }
}

function renderEducation(container, items) {
  container.innerHTML = "";
  for (const e of items || []) {
    const card = el("article", "role reveal");

    const top = el("div", "role__top");
    const left = el("div");
    const school = el("div", "role__company");
    school.textContent = e.school || "";
    const degree = el("div", "role__title");
    const parts = [e.degree, e.field].filter(Boolean);
    degree.textContent = parts.join(", ");
    left.append(school, degree);

    const time = el("div", "role__time");
    time.textContent = e.time || "";
    top.append(left, time);

    card.append(top);
    container.appendChild(card);
  }
}

function renderSkills(container, skills) {
  container.innerHTML = "";
  for (const s of skills || []) {
    const chip = el("span", "skill reveal");
    chip.textContent = s;
    container.appendChild(chip);
  }
}

function enableMenu() {
  const btn = document.getElementById("menuBtn");
  const panel = document.getElementById("menuPanel");
  if (!btn || !panel) return;

  function close() {
    btn.setAttribute("aria-expanded", "false");
    panel.hidden = true;
  }

  btn.addEventListener("click", () => {
    const next = btn.getAttribute("aria-expanded") !== "true";
    btn.setAttribute("aria-expanded", String(next));
    panel.hidden = !next;
  });

  panel.addEventListener("click", (e) => {
    const a = e.target?.closest?.("a");
    if (a) close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  window.addEventListener("click", (e) => {
    if (!panel.hidden && e.target !== btn && !panel.contains(e.target) && !btn.contains(e.target)) close();
  });
}

function enableSpyNav() {
  const links = Array.from(document.querySelectorAll('[data-spy^="#"]'));
  if (!links.length) return;

  const targets = links
    .map((a) => document.querySelector(a.getAttribute("data-spy")))
    .filter(Boolean);
  if (!targets.length) return;

  const setActive = (id) => {
    for (const a of links) {
      const on = a.getAttribute("data-spy") === `#${id}`;
      a.classList.toggle("is-active", on);
    }
  };

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      const top = visible[0]?.target;
      if (top?.id) setActive(top.id);
    },
    { root: null, threshold: [0.14, 0.22, 0.34, 0.5] }
  );

  for (const t of targets) io.observe(t);
}

function enableReveal() {
  const nodes = Array.from(document.querySelectorAll(".reveal"));
  if (!nodes.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { root: null, threshold: 0.12 }
  );

  for (const node of nodes) io.observe(node);
}

function enableCopyEmail(email) {
  const btn = document.getElementById("copyEmailBtn");
  if (!btn || !email) return;
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      const prev = btn.textContent;
      btn.textContent = "Copied";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = prev;
        btn.disabled = false;
      }, 900);
    } catch {
      // Clipboard can be blocked by browser policies; fall back to mailto.
      window.location.href = `mailto:${email}`;
    }
  });
}

function enableScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  const rail = document.getElementById("railMeter");
  if (!bar) return;

  let ticking = false;
  function update() {
    ticking = false;
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, window.scrollY / max));
    bar.style.width = `${Math.round(p * 1000) / 10}%`;
    if (rail) rail.style.height = `${Math.round(p * 1000) / 10}%`;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
}

function enableThemeToggle() {
  const storageKey = "portfolio.theme";
  const btn = document.getElementById("themeBtn");
  if (!btn) return;

  const media = window.matchMedia?.("(prefers-color-scheme: dark)");
  const systemTheme = () => (media && media.matches ? "dark" : "light");
  const getSaved = () => {
    const v = String(window.localStorage.getItem(storageKey) || "");
    return v === "light" || v === "dark" || v === "system" ? v : "system";
  };

  let mode = getSaved();

  function apply(next) {
    mode = next;
    if (mode === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", mode);
    window.localStorage.setItem(storageKey, mode);
    const resolved = mode === "system" ? systemTheme() : mode;
    btn.setAttribute("aria-label", `Theme: ${resolved}. Click to change.`);
  }

  function cycle() {
    if (mode === "system") return apply(systemTheme() === "dark" ? "light" : "dark");
    if (mode === "dark") return apply("light");
    return apply("system");
  }

  btn.addEventListener("click", cycle);
  window.addEventListener("keydown", (e) => {
    if ((e.key || "").toLowerCase() === "t" && (e.metaKey || e.ctrlKey)) cycle();
  });

  if (media && typeof media.addEventListener === "function") {
    media.addEventListener("change", () => {
      if (mode === "system") apply("system");
    });
  }

  apply(mode);
}

function enableCommandPalette(getItems) {
  const palette = document.getElementById("palette");
  const backdrop = document.getElementById("paletteBackdrop");
  const input = document.getElementById("paletteInput");
  const list = document.getElementById("paletteList");
  const openBtn = document.getElementById("cmdkBtn");
  if (!palette || !backdrop || !input || !list) return;

  let items = [];
  let filtered = [];
  let selectedIndex = 0;

  function isOpen() {
    return !palette.hidden;
  }

  function setSelected(i) {
    selectedIndex = Math.max(0, Math.min(filtered.length - 1, i));
    const nodes = Array.from(list.querySelectorAll(".palette__item"));
    nodes.forEach((n, idx) => n.setAttribute("aria-selected", idx === selectedIndex ? "true" : "false"));
    const active = nodes[selectedIndex];
    if (active) active.scrollIntoView({ block: "nearest" });
  }

  function render() {
    list.innerHTML = "";
    if (!filtered.length) {
      const empty = el("div", "palette__empty");
      empty.textContent = "No results. Try: atlas, contact, github, linkedin.";
      list.appendChild(empty);
      return;
    }
    for (const [idx, it] of filtered.entries()) {
      if (!it || typeof it !== "object") continue;
      const a = document.createElement("a");
      a.className = "palette__item";
      a.href = it.href || "#";
      a.rel = it.href && it.href.startsWith("http") ? "noreferrer" : "";
      a.setAttribute("role", "option");
      a.setAttribute("aria-selected", idx === selectedIndex ? "true" : "false");

      const main = el("div", "palette__itemMain");
      const title = el("div", "palette__itemTitle");
      title.textContent = it.title || "";
      const meta = el("div", "palette__itemMeta");
      meta.textContent = it.meta || "";
      main.append(title);
      if (it.meta) main.append(meta);

      const hint = el("div", "palette__itemMeta");
      hint.textContent = it.hint || "";

      a.append(main, hint);
      a.addEventListener("click", () => close());
      a.addEventListener("mousemove", () => setSelected(idx));
      list.appendChild(a);
    }
  }

  function applyFilter() {
    const q = String(input.value || "").trim().toLowerCase();
    filtered = !q
      ? items.slice()
      : items.filter((it) => {
          if (!it || typeof it !== "object") return false;
          const hay = `${it.title || ""} ${it.meta || ""} ${it.hint || ""} ${it.href || ""}`.toLowerCase();
          return hay.includes(q);
        });
    selectedIndex = 0;
    render();
    setSelected(0);
  }

  function open() {
    if (isOpen()) return;
    palette.hidden = false;
    const next = typeof getItems === "function" ? getItems() : [];
    items = Array.isArray(next) ? next.filter(Boolean) : [];
    applyFilter();
    setTimeout(() => input.focus(), 0);
  }

  function close() {
    if (!isOpen()) return;
    palette.hidden = true;
    input.value = "";
  }

  function openSelected() {
    const it = filtered[selectedIndex];
    if (!it || !it.href) return;
    window.location.href = it.href;
    close();
  }

  if (openBtn) openBtn.addEventListener("click", open);
  backdrop.addEventListener("click", close);
  input.addEventListener("input", applyFilter);

  window.addEventListener("keydown", (e) => {
    const key = (e.key || "").toLowerCase();
    const inField = /^(input|textarea|select)$/i.test(document.activeElement?.tagName || "");

    if ((e.metaKey || e.ctrlKey) && key === "k") {
      e.preventDefault();
      open();
      return;
    }

    if (!isOpen()) return;
    if (key === "escape") return close();

    if (key === "arrowdown") {
      e.preventDefault();
      return setSelected(selectedIndex + 1);
    }
    if (key === "arrowup") {
      e.preventDefault();
      return setSelected(selectedIndex - 1);
    }
    if (key === "enter" && !inField) return openSelected();
    if (key === "enter" && document.activeElement === input) {
      e.preventDefault();
      return openSelected();
    }
  });
}

function setText(id, text, fallback = "") {
  const el = document.getElementById(id);
  if (el) el.textContent = text || fallback;
}

function renderPrinciples(container, principles) {
  if (!container) return;
  const list = Array.isArray(principles) && principles.length ? principles : null;
  if (!list) return;
  container.innerHTML = "";
  for (const p of list) {
    const li = document.createElement("li");
    li.textContent = p;
    container.appendChild(li);
  }
}

function renderCaseStudies(listEl, detailEl, cases) {
  if (!listEl || !detailEl) return;
  const items = Array.isArray(cases) ? cases : [];
  listEl.innerHTML = "";

  function select(id) {
    const c = items.find((x) => x.id === id) || items[0];
    if (!c) return;

    for (const a of Array.from(listEl.querySelectorAll("a"))) {
      a.classList.toggle("is-active", a.getAttribute("data-id") === c.id);
    }

    detailEl.innerHTML = "";

    const head = el("div", "caseHead");
    const title = el("div", "caseHead__title");
    title.textContent = c.title || "";
    const sub = el("div", "caseHead__sub");
    sub.textContent = c.subtitle || "";
    const ctx = el("p", "caseHead__ctx");
    ctx.textContent = c.context || "";
    head.append(title, sub, ctx);

    const tags = el("div", "caseTags");
    for (const t of c.tags || []) {
      const chip = el("span", "tag");
      chip.textContent = t;
      tags.appendChild(chip);
    }

    const body = el("div", "caseBody");
    for (const s of c.sections || []) {
      const card = el("section", "caseCard reveal");
      const kicker = el("div", "caseCard__kicker");
      kicker.textContent = s.kicker || "";
      const st = el("div", "caseCard__title");
      st.textContent = s.title || "";
      const p = el("div", "caseCard__body");
      p.textContent = s.body || "";
      card.append(kicker, st, p);
      body.appendChild(card);
    }

    detailEl.append(head);
    if (tags.childElementCount) detailEl.appendChild(tags);
    detailEl.appendChild(body);
    enableReveal();
  }

  if (!items.length) {
    listEl.innerHTML = `<div class="cases__note">Add items to <code>content.json</code> → <code>caseStudies</code>.</div>`;
    return;
  }

  for (const c of items) {
    const a = document.createElement("a");
    a.className = "caseLink";
    a.href = `#case-studies`;
    a.setAttribute("data-id", c.id);

    const t = el("div", "caseLink__title");
    t.textContent = c.title || "";
    const s = el("div", "caseLink__sub");
    s.textContent = c.subtitle || "";
    const meta = el("div", "caseLink__meta");
    meta.textContent = (c.tags || []).slice(0, 3).join(" · ");
    a.append(t, s, meta);

    a.addEventListener("click", (e) => {
      e.preventDefault();
      select(c.id);
    });

    listEl.appendChild(a);
  }

  select(items[0].id);
}

function hashTo01(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

function categorizeSkill(s) {
  const v = String(s || "").toLowerCase();
  if (v.includes("certified") || v.includes("certification")) return "certifications";
  if (v.includes("kubernetes") || v.includes("openshift") || v.includes("docker") || v.includes("helm")) return "containers";
  if (v.includes("terraform") || v.includes("cloudformation") || v.includes("iac") || v.includes("ansible") || v.includes("chef"))
    return "automation";
  if (v.includes("azure") || v.includes("aws") || v.includes("gcp")) return "cloud";
  if (v.includes("cicd") || v.includes("ci/cd") || v.includes("jenkins") || v.includes("github") || v.includes("gitlab") || v.includes("azure devops"))
    return "delivery";
  if (v.includes("vault") || v.includes("secrets") || v.includes("security") || v.includes("scan")) return "security";
  if (v.includes("python") || v.includes("java") || v.includes("bash") || v.includes("powershell")) return "languages";
  if (v.includes("linux")) return "systems";
  return "other";
}

function categoryLabel(key) {
  const map = {
    cloud: "Cloud",
    containers: "Containers",
    delivery: "Delivery",
    automation: "Automation",
    security: "Security",
    systems: "Systems",
    languages: "Languages",
    certifications: "Certifications",
    other: "Other"
  };
  return map[key] || key;
}

function buildAtlas(skills) {
  const categories = new Map();
  for (const s of skills || []) {
    const key = categorizeSkill(s);
    if (!categories.has(key)) categories.set(key, []);
    categories.get(key).push(String(s));
  }
  const keys = Array.from(categories.keys()).sort((a, b) => categoryLabel(a).localeCompare(categoryLabel(b)));
  return { keys, categories };
}

function createAtlasController(canvas, tooltipEl, atlas, state) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { resize: () => {}, render: () => {} };

  let w = 0;
  let h = 0;
  let nodes = [];
  let catNodes = [];

  const palette = {
    cloud: "#7aa2ff",
    containers: "#3ae6c7",
    delivery: "#ff4d6d",
    automation: "#ffd166",
    security: "#a78bfa",
    systems: "#94a3b8",
    languages: "#60a5fa",
    certifications: "#f59e0b",
    other: "#cbd5e1"
  };

  const bg = () => {
    const t = document.documentElement.getAttribute("data-theme");
    return t === "dark" ? "rgba(8,10,16,0.15)" : "rgba(255,255,255,0.18)";
  };

  function computeLayout() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const rect = canvas.getBoundingClientRect();
    w = Math.max(320, Math.floor(rect.width));
    h = Math.max(320, Math.floor(rect.height));
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const center = { x: w / 2, y: h / 2 };
    const radius = Math.min(w, h) * 0.34;
    const keyCount = Math.max(1, atlas.keys.length);

    nodes = [];
    catNodes = atlas.keys.map((k, i) => {
      const a = (i / keyCount) * Math.PI * 2 - Math.PI / 2;
      const x = center.x + Math.cos(a) * radius;
      const y = center.y + Math.sin(a) * radius;
      return { type: "cat", key: k, label: categoryLabel(k), x, y, r: 14 };
    });

    for (const c of catNodes) nodes.push(c);
    for (const k of atlas.keys) {
      const list = atlas.categories.get(k) || [];
      const cat = catNodes.find((n) => n.key === k);
      const local = Math.max(1, list.length);
      for (const [idx, s] of list.entries()) {
        const t = (idx / local) * Math.PI * 2;
        const r = 44 + (hashTo01(`${s}:${state.seed}`) * 1.0) * 74;
        const jitter = (hashTo01(`${state.seed}:${idx}:${s}`) - 0.5) * 10;
        const x = cat.x + Math.cos(t) * r + jitter;
        const y = cat.y + Math.sin(t) * r - jitter;
        nodes.push({ type: "skill", key: k, label: s, x, y, r: 5.2 });
      }
    }
  }

  function render() {
    if (!w || !h) computeLayout();
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = bg();
    ctx.fillRect(0, 0, w, h);

    const activeKey = state.activeCategory;
    const activeSkill = state.activeSkill;

    ctx.lineWidth = 1;
    for (const n of nodes) {
      if (n.type !== "skill") continue;
      const cat = catNodes.find((c) => c.key === n.key);
      const dim = activeKey && n.key !== activeKey;
      ctx.strokeStyle = dim ? "rgba(148,163,184,0.16)" : "rgba(148,163,184,0.24)";
      ctx.beginPath();
      ctx.moveTo(cat.x, cat.y);
      ctx.lineTo(n.x, n.y);
      ctx.stroke();
    }

    for (const n of nodes) {
      const color = palette[n.key] || palette.other;
      const dim = activeKey && n.key !== activeKey;
      const isActiveSkill = activeSkill && n.type === "skill" && n.label === activeSkill;

      if (n.type === "cat") {
        ctx.fillStyle = dim ? "rgba(148,163,184,0.25)" : color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = dim ? "rgba(148,163,184,0.6)" : "rgba(245,246,250,0.92)";
        if (document.documentElement.getAttribute("data-theme") !== "dark") ctx.fillStyle = dim ? "rgba(20,20,20,0.58)" : "rgba(20,20,20,0.86)";
        ctx.font = "700 12px ui-monospace, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n.label.toUpperCase(), n.x, n.y - 22);
        continue;
      }

      ctx.fillStyle = dim ? "rgba(148,163,184,0.32)" : color;
      const rr = isActiveSkill ? n.r * 1.7 : n.r;
      ctx.beginPath();
      ctx.arc(n.x, n.y, rr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function hitTest(x, y) {
    let best = null;
    for (const n of nodes) {
      const dx = n.x - x;
      const dy = n.y - y;
      const d = Math.sqrt(dx * dx + dy * dy);
      const r = n.type === "cat" ? n.r + 6 : n.r + 7;
      if (d <= r) {
        best = n;
        if (n.type === "skill") break;
      }
    }
    return best;
  }

  function setTooltip(text, x, y) {
    if (!tooltipEl) return;
    if (!text) {
      tooltipEl.hidden = true;
      return;
    }
    tooltipEl.textContent = text;
    tooltipEl.style.left = `${Math.round(x)}px`;
    tooltipEl.style.top = `${Math.round(y)}px`;
    tooltipEl.hidden = false;
  }

  function attach() {
    function pos(ev) {
      const r = canvas.getBoundingClientRect();
      return { x: ev.clientX - r.left, y: ev.clientY - r.top };
    }

    canvas.addEventListener("mousemove", (ev) => {
      const p = pos(ev);
      const hit = hitTest(p.x, p.y);
      canvas.style.cursor = hit ? "pointer" : "default";
      if (!hit) return setTooltip("", 0, 0);
      const label = hit.type === "cat" ? `${hit.label}` : `${hit.label}`;
      setTooltip(label, p.x + 12, p.y + 10);
    });

    canvas.addEventListener("mouseleave", () => setTooltip("", 0, 0));

    canvas.addEventListener("click", (ev) => {
      const p = pos(ev);
      const hit = hitTest(p.x, p.y);
      if (!hit) return;
      if (hit.type === "cat") {
        state.activeCategory = state.activeCategory === hit.key ? "" : hit.key;
        state.activeSkill = "";
        state.onChange?.();
        render();
      } else if (hit.type === "skill") {
        state.activeCategory = hit.key;
        state.activeSkill = hit.label;
        state.onChange?.();
        render();
      }
    });
  }

  attach();
  computeLayout();
  render();

  return {
    resize() {
      computeLayout();
      render();
    },
    render() {
      render();
    }
  };
}

function renderAtlasSidebar({ atlas, state, content }) {
  const filtersEl = document.getElementById("atlasFilters");
  const resultsEl = document.getElementById("atlasResults");
  const searchEl = document.getElementById("atlasSearch");
  if (!filtersEl || !resultsEl || !searchEl) return;

  const experience = content.experience || [];

  function setActiveCategory(key) {
    state.activeCategory = key;
    state.activeSkill = "";
    state.onChange?.();
    update();
  }

  filtersEl.innerHTML = "";
  const allBtn = document.createElement("button");
  allBtn.className = "filter";
  allBtn.type = "button";
  allBtn.textContent = "All";
  allBtn.addEventListener("click", () => setActiveCategory(""));
  filtersEl.appendChild(allBtn);

  for (const k of atlas.keys) {
    const b = document.createElement("button");
    b.className = "filter";
    b.type = "button";
    b.textContent = categoryLabel(k);
    b.addEventListener("click", () => setActiveCategory(state.activeCategory === k ? "" : k));
    filtersEl.appendChild(b);
  }

  function matchesExperience(skill) {
    const out = [];
    const q = String(skill).toLowerCase();
    for (const r of experience) {
      const lines = (r.details || []).filter((d) => String(d).toLowerCase().includes(q));
      if (lines.length) out.push({ role: `${r.company} — ${r.title}`, lines });
    }
    return out;
  }

  function update() {
    const q = String(searchEl.value || "").trim().toLowerCase();
    const active = state.activeCategory;

    for (const b of Array.from(filtersEl.querySelectorAll(".filter"))) {
      const t = b.textContent;
      const on = (t === "All" && !active) || (t !== "All" && categoryLabel(active) === t);
      b.classList.toggle("is-active", on);
    }
    allBtn.classList.toggle("is-active", !active);

    const allSkills = [];
    for (const k of atlas.keys) {
      if (active && k !== active) continue;
      for (const s of atlas.categories.get(k) || []) allSkills.push({ key: k, label: s });
    }

    const filtered = !q ? allSkills : allSkills.filter((x) => x.label.toLowerCase().includes(q));

    resultsEl.innerHTML = "";

    if (!filtered.length) {
      resultsEl.innerHTML = `<div class="atlas__empty">No matches.</div>`;
      return;
    }

    for (const item of filtered.slice(0, 42)) {
      const row = el("div", "atlasRow");
      const left = el("div", "atlasRow__left");
      const title = el("div", "atlasRow__title");
      title.textContent = item.label;
      const meta = el("div", "atlasRow__meta");
      meta.textContent = categoryLabel(item.key);
      left.append(title, meta);

      const btn = document.createElement("button");
      btn.className = "atlasRow__btn";
      btn.type = "button";
      btn.textContent = "Show";
      btn.addEventListener("click", () => {
        state.activeCategory = item.key;
        state.activeSkill = item.label;
        state.onChange?.();
        update();
      });

      row.append(left, btn);

      if (state.activeSkill === item.label) {
        const hits = matchesExperience(item.label);
        const panel = el("div", "atlasRow__panel");
        if (!hits.length) panel.textContent = "No direct mentions in experience bullets (add specifics in content.json).";
        else {
          for (const h of hits.slice(0, 3)) {
            const r = el("div", "atlasHit");
            const rt = el("div", "atlasHit__role");
            rt.textContent = h.role;
            const ul = document.createElement("ul");
            ul.className = "atlasHit__list";
            for (const ln of h.lines.slice(0, 2)) {
              const li = document.createElement("li");
              li.textContent = ln;
              ul.appendChild(li);
            }
            r.append(rt, ul);
            panel.appendChild(r);
          }
        }
        row.appendChild(panel);
      }

      resultsEl.appendChild(row);
    }
  }

  searchEl.addEventListener("input", update);
  update();

  return { update };
}

async function main() {
  enableMenu();
  enableScrollProgress();
  enableThemeToggle();
  enableSpyNav();

  const res = await fetch("content.json", { cache: "no-store" });
  const content = await res.json();
  window.__portfolioLinks = content.links || {};

  setMeta(content.meta || {});

  const hero = content.hero || {};
  const initials =
    hero.initials ||
    String(hero.name || "")
      .split(/\\s+/)
      .filter(Boolean)
      .slice(0, 3)
      .map((p) => p[0]?.toUpperCase())
      .join("");
  const brandMark = document.getElementById("brandMark");
  if (brandMark) brandMark.textContent = initials || "GRK";

  setText("navName", hero.name, "Portfolio");
  setText("heroName", hero.name, "Your Name");
  setText("heroRole", hero.role, "Role");
  setText("heroMeta", hero.location, "");
  setText("heroTagline", hero.tagline, "");
  setText("availabilityBadge", hero.availability, "");

  const primaryCta = document.getElementById("primaryCta");
  primaryCta.textContent = hero.primaryCta?.label || "Read Case Studies";
  primaryCta.href = hero.primaryCta?.href || "#case-studies";

  const secondaryCta = document.getElementById("secondaryCta");
  secondaryCta.textContent = hero.secondaryCta?.label || "Contact";
  secondaryCta.href = hero.secondaryCta?.href || "#contact";

  setText("posterSig", hero.name, "Your Name");
  setText("footerName", hero.name, "Your Name");
  setText("footerRole", hero.role, "Role");

  renderLinks(document.getElementById("heroLinks"), content.links || {});
  renderStats(document.getElementById("statsRow"), content.stats || []);
  renderHighlights(document.getElementById("highlightsGrid"), content.highlights || []);
  renderExperience(document.getElementById("experienceTimeline"), content.experience || []);
  renderEducation(document.getElementById("educationTimeline"), content.education || []);
  renderSkills(document.getElementById("skillsGrid"), content.skills || []);
  renderPrinciples(document.getElementById("principlesList"), content.principles || []);
  renderCaseStudies(document.getElementById("caseList"), document.getElementById("caseDetail"), content.caseStudies || []);

  const email = content.links?.email || "";
  const emailLink = document.getElementById("emailLink");
  const emailCta = document.getElementById("emailCta");
  if (emailLink) {
    emailLink.textContent = email || "you@example.com";
    emailLink.href = email ? `mailto:${email}` : "mailto:you@example.com";
  }
  if (emailCta) emailCta.href = email ? `mailto:${email}` : "mailto:you@example.com";

  const linkedin = safeUrl(content.links?.linkedin);
  const github = safeUrl(content.links?.github);
  const resume = content.links?.resume ? content.links.resume : null;

  const linkedinLink = document.getElementById("linkedinLink");
  if (linkedinLink) {
    linkedinLink.href = linkedin || "#";
    linkedinLink.textContent = linkedin ? content.links.linkedin : "Add your URL";
    if (linkedin) linkedinLink.rel = "noreferrer";
  }

  const githubLink = document.getElementById("githubLink");
  if (githubLink) {
    githubLink.href = github || "#";
    githubLink.textContent = github ? content.links.github : "Add your URL";
    if (github) githubLink.rel = "noreferrer";
  }

  const resumeLink = document.getElementById("resumeLink");
  if (resumeLink) {
    resumeLink.href = resume || "#";
    resumeLink.textContent = resume || "assets/resume.pdf";
  }

  document.getElementById("footerNote").textContent = content.footerNote || "";

  const sectionCommands = () => [
    { title: "Intro", meta: "Chapter", href: "#top", hint: "01" },
    { title: "Atlas", meta: "Chapter", href: "#map", hint: "02" },
    { title: "Case Studies", meta: "Chapter", href: "#case-studies", hint: "03" },
    { title: "Experience", meta: "Chapter", href: "#experience", hint: "04" },
    { title: "Education", meta: "Chapter", href: "#education", hint: "05" },
    { title: "Skills", meta: "Chapter", href: "#skills", hint: "06" },
    { title: "Contact", meta: "Chapter", href: "#contact", hint: "07" }
  ];

  const linkCommands = () => {
    const out = [];
    const email = content.links?.email ? `mailto:${content.links.email}` : null;
    const github = safeUrl(content.links?.github);
    const linkedin = safeUrl(content.links?.linkedin);
    const resume = content.links?.resume || null;
    if (email) out.push({ title: "Email", meta: "Link", href: email, hint: content.links.email });
    if (github) out.push({ title: "GitHub", meta: "Link", href: github, hint: "github.com" });
    if (linkedin) out.push({ title: "LinkedIn", meta: "Link", href: linkedin, hint: "linkedin.com" });
    if (resume) out.push({ title: "Resume", meta: "Link", href: resume, hint: "PDF" });
    return out;
  };

  const projectCommands = () => {
    const out = [];
    for (const p of content.projects || []) {
      const href = safeUrl(p?.links?.[0]?.href);
      if (!href) continue;
      out.push({ title: p.name || "Project", meta: "Project", href, hint: (p.tags || []).slice(0, 3).join(" · ") });
    }
    return out;
  };

  const caseCommands = () => {
    const out = [];
    for (const c of content.caseStudies || []) {
      out.push({ title: c.title || "Case study", meta: "Case Study", href: "#case-studies", hint: (c.tags || []).slice(0, 3).join(" · ") });
    }
    return out;
  };

  enableCommandPalette(() => [...sectionCommands(), ...linkCommands(), ...caseCommands(), ...projectCommands()]);

  const canvas = document.getElementById("atlasCanvas");
  const tooltip = document.getElementById("atlasTooltip");
  const shuffleBtn = document.getElementById("atlasShuffleBtn");
  const resetBtn = document.getElementById("atlasResetBtn");
  if (canvas) {
    const atlas = buildAtlas(content.skills || []);
    const state = { seed: Math.round(Math.random() * 1e9), activeCategory: "", activeSkill: "", onChange: null };
    const sidebar = renderAtlasSidebar({
      atlas,
      state,
      content
    });

    const controller = createAtlasController(canvas, tooltip, atlas, state);

    state.onChange = () => {
      sidebar?.update?.();
      controller.render();
    };

    window.addEventListener("resize", () => controller.resize());

    if (shuffleBtn) {
      shuffleBtn.addEventListener("click", () => {
        state.seed = Math.round(Math.random() * 1e9);
        controller.resize();
        sidebar?.update?.();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        state.activeCategory = "";
        state.activeSkill = "";
        const s = document.getElementById("atlasSearch");
        if (s) s.value = "";
        controller.render();
        sidebar?.update?.();
      });
    }
  }

  enableCopyEmail(email);
  enableReveal();
}

main().catch(() => {
  // If content.json is missing/invalid, keep the static fallback UI visible.
});
