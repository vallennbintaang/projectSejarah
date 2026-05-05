/* =========================================================
   CyberShield — Global JS
   Nav toggle, active link highlight, expand, reveal, tabs
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Active Nav Link ---------- */
  function highlightNav() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === path) a.classList.add("active");
    });
  }

  /* ---------- Mobile Nav Toggle ---------- */
  function navToggle() {
    const btn = document.querySelector("[data-testid='nav-toggle-button']");
    const menu = document.querySelector(".nav-links");
    if (!btn || !menu) return;
    btn.addEventListener("click", () => {
      menu.classList.toggle("open");
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => menu.classList.remove("open"))
    );
  }

  /* ---------- Expand / Collapse (threat & step cards) ---------- */
  function expandables() {
    document.querySelectorAll("[data-expand]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.closest("[data-expandable]");
        if (!target) return;
        target.classList.toggle("open");
      });
    });
  }

  /* ---------- Scroll Reveal ---------- */
  function scrollReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Card spotlight (mouse follow glow) ---------- */
  function spotlight() {
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      });
    });
  }

  /* ---------- Tabs ---------- */
  function tabs() {
    document.querySelectorAll("[data-tabs]").forEach((group) => {
      const btns = group.querySelectorAll(".tab");
      const panels = document.querySelectorAll(
        "[data-tab-panel][data-group='" + group.dataset.tabs + "']"
      );
      btns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const name = btn.dataset.tab;
          btns.forEach((b) => b.classList.toggle("active", b === btn));
          panels.forEach((p) =>
            p.classList.toggle("active", p.dataset.tabPanel === name)
          );
        });
      });
    });
  }

  /* ---------- Terminal typing (home hero) ---------- */
  function typingTerminal() {
    const body = document.querySelector("[data-terminal]");
    if (!body) return;
    const lines = [
      { t: "whoami", out: "visitor@cybershield", cls: "out" },
      { t: "scan --network home", out: "[OK] 3 ancaman umum ditemukan", cls: "ok" },
      { t: "mitigate --all", out: "pencegahan aktif › password • 2FA • update", cls: "ok" },
      { t: "status", out: "sistem aman › tingkat risiko: rendah", cls: "ok" },
    ];
    let idx = 0;
    body.innerHTML = "";
    function addLine() {
      if (idx >= lines.length) {
        const c = document.createElement("span");
        c.className = "cursor";
        body.appendChild(c);
        return;
      }
      const ln = lines[idx++];
      const row = document.createElement("div");
      row.className = "line";
      row.innerHTML = `<span class="prompt">›</span><span>${ln.t}</span>`;
      body.appendChild(row);
      setTimeout(() => {
        const o = document.createElement("div");
        o.className = "line";
        o.innerHTML = `<span class="${ln.cls}">› ${ln.out}</span>`;
        body.appendChild(o);
        setTimeout(addLine, 650);
      }, 420);
    }
    addLine();
  }

  /* ---------- Counter animation ---------- */
  function counters() {
    document.querySelectorAll("[data-count]").forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const dur = 1400;
      let start = null;
      const init = () => {
        requestAnimationFrame(function step(ts) {
          if (!start) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          const formatted =
            target % 1 === 0 ? Math.floor(val).toLocaleString("id-ID") : val.toFixed(1);
          el.textContent = formatted + suffix;
          if (p < 1) requestAnimationFrame(step);
        });
      };
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            init();
            io.disconnect();
          }
        });
      });
      io.observe(el);
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    highlightNav();
    navToggle();
    expandables();
    scrollReveal();
    spotlight();
    tabs();
    typingTerminal();
    counters();
  });
})();
