function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
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

async function main() {
  enableMenu();

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

  document.getElementById("navName").textContent = hero.name || "Portfolio";
  document.getElementById("heroName").textContent = hero.name || "Your Name";
  document.getElementById("heroRole").textContent = hero.role || "Role";
  document.getElementById("heroMeta").textContent = hero.location || "";
  document.getElementById("heroTagline").textContent = hero.tagline || "";
  document.getElementById("availabilityBadge").textContent = hero.availability || "";

  const primaryCta = document.getElementById("primaryCta");
  primaryCta.textContent = hero.primaryCta?.label || "View Projects";
  primaryCta.href = hero.primaryCta?.href || "#projects";

  const secondaryCta = document.getElementById("secondaryCta");
  secondaryCta.textContent = hero.secondaryCta?.label || "Contact";
  secondaryCta.href = hero.secondaryCta?.href || "#contact";

  document.getElementById("posterSig").textContent = hero.name || "Your Name";
  document.getElementById("footerName").textContent = hero.name || "Your Name";
  document.getElementById("footerRole").textContent = hero.role || "Role";

  renderLinks(document.getElementById("heroLinks"), content.links || {});
  renderStats(document.getElementById("statsRow"), content.stats || []);
  renderHighlights(document.getElementById("highlightsGrid"), content.highlights || []);
  renderProjects(document.getElementById("projectsGrid"), content.projects || []);
  renderExperience(document.getElementById("experienceTimeline"), content.experience || []);
  renderEducation(document.getElementById("educationTimeline"), content.education || []);
  renderSkills(document.getElementById("skillsGrid"), content.skills || []);

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

  enableCopyEmail(email);
  enableReveal();
}

main().catch(() => {
  // If content.json is missing/invalid, keep the static fallback UI visible.
});
