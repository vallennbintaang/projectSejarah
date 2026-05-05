/* =========================================================
   Password Strength Checker
   ========================================================= */

(function () {
  "use strict";

  function init() {
    const input = document.querySelector("[data-testid='password-input']");
    if (!input) return;

    const bar = document.querySelector("[data-testid='password-bar-fill']");
    const label = document.querySelector("[data-testid='password-strength-label']");
    const entropy = document.querySelector("[data-testid='password-entropy']");
    const toggle = document.querySelector("[data-testid='password-toggle-visibility']");
    const checks = {
      length: document.querySelector("[data-check='length']"),
      upper: document.querySelector("[data-check='upper']"),
      lower: document.querySelector("[data-check='lower']"),
      number: document.querySelector("[data-check='number']"),
      symbol: document.querySelector("[data-check='symbol']"),
      common: document.querySelector("[data-check='common']"),
    };

    const commonList = [
      "123456",
      "password",
      "qwerty",
      "111111",
      "123123",
      "abc123",
      "admin",
      "letmein",
      "iloveyou",
      "welcome",
      "monkey",
      "dragon",
      "pass1234",
      "password1",
      "qwerty123",
      "12345678",
    ];

    const levels = [
      { label: "Sangat Lemah", color: "#f87171", pct: 10 },
      { label: "Lemah", color: "#fb923c", pct: 30 },
      { label: "Sedang", color: "#fbbf24", pct: 55 },
      { label: "Kuat", color: "#84cc16", pct: 80 },
      { label: "Sangat Kuat", color: "#4ade80", pct: 100 },
    ];

    function entropyBits(pw) {
      let pool = 0;
      if (/[a-z]/.test(pw)) pool += 26;
      if (/[A-Z]/.test(pw)) pool += 26;
      if (/[0-9]/.test(pw)) pool += 10;
      if (/[^A-Za-z0-9]/.test(pw)) pool += 32;
      if (pool === 0) return 0;
      return pw.length * Math.log2(pool);
    }

    function evaluate(pw) {
      const results = {
        length: pw.length >= 12,
        upper: /[A-Z]/.test(pw),
        lower: /[a-z]/.test(pw),
        number: /[0-9]/.test(pw),
        symbol: /[^A-Za-z0-9]/.test(pw),
        common: pw.length > 0 && !commonList.includes(pw.toLowerCase()),
      };
      const score = Object.values(results).filter(Boolean).length;
      let level;
      if (pw.length === 0) level = { label: "-", color: "#3a453a", pct: 0 };
      else if (score <= 1) level = levels[0];
      else if (score === 2) level = levels[1];
      else if (score === 3) level = levels[2];
      else if (score === 4) level = levels[3];
      else level = levels[4];
      return { results, level, bits: entropyBits(pw) };
    }

    function render() {
      const pw = input.value;
      const { results, level, bits } = evaluate(pw);

      bar.style.width = level.pct + "%";
      bar.style.background = level.color;
      label.textContent = level.label;
      label.style.color = level.color;
      entropy.textContent = pw.length
        ? `${bits.toFixed(0)} bit entropy`
        : "0 bit entropy";

      Object.entries(results).forEach(([k, v]) => {
        if (checks[k]) checks[k].classList.toggle("pass", v);
      });
    }

    input.addEventListener("input", render);

    toggle.addEventListener("click", () => {
      const isPw = input.type === "password";
      input.type = isPw ? "text" : "password";
      toggle.setAttribute("aria-label", isPw ? "Sembunyikan password" : "Tampilkan password");
      toggle.innerHTML = isPw
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    });

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
