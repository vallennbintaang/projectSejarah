/* =========================================================
   Quiz — "Seberapa aman kamu?"
   ========================================================= */

(function () {
  "use strict";

  const questions = [
    {
      q: "Kamu dapat email dari bank yang minta verifikasi password lewat link. Apa yang kamu lakukan?",
      opts: [
        "Klik link dan masukkan password",
        "Abaikan/hapus email, konfirmasi langsung ke bank lewat aplikasi resmi",
        "Balas email dengan password untuk konfirmasi",
        "Forward ke teman dulu biar dicek",
      ],
      correct: 1,
      why: "Bank resmi tidak pernah meminta password lewat email/link. Ini ciri klasik phishing — verifikasi selalu lewat aplikasi/cabang resmi.",
    },
    {
      q: "Mana password paling aman?",
      opts: [
        "qwerty123",
        "TanggalLahirku1995",
        "k0p!Hitam-Senin@2025",
        "password1!",
      ],
      correct: 2,
      why: "Password kuat = panjang, kombinasi huruf besar/kecil + angka + simbol, dan bukan kata/tanggal yang mudah ditebak.",
    },
    {
      q: "2FA (Two-Factor Authentication) itu gunanya apa?",
      opts: [
        "Bikin login lebih lama dan ribet saja",
        "Menggandakan password",
        "Lapisan keamanan tambahan lewat kode di HP/app authenticator",
        "Menyembunyikan alamat email",
      ],
      correct: 2,
      why: "2FA memastikan walau hacker tahu password, mereka tetap butuh HP/aplikasi authenticator kamu untuk bisa masuk.",
    },
    {
      q: "Lagi di kafe, WiFi gratis tanpa password. Kamu butuh cek saldo m-banking. Sebaiknya?",
      opts: [
        "Langsung buka m-banking, cepat-cepat",
        "Pakai data seluler (hotspot HP), bukan WiFi publik",
        "WiFi publik aman kok asal HTTPS",
        "Minta password WiFi ke kasir",
      ],
      correct: 1,
      why: "WiFi publik rawan Man-in-the-Middle attack. Untuk transaksi penting, selalu pakai koneksi pribadi (data seluler) atau VPN tepercaya.",
    },
    {
      q: "Komputermu tiba-tiba menampilkan pesan 'File Anda terenkripsi, bayar 0.1 BTC untuk membuka'. Apa yang kamu lakukan pertama?",
      opts: [
        "Bayar tebusan biar file balik",
        "Biarkan saja, lanjut kerja",
        "Langsung putuskan koneksi internet, isolasi perangkat, jangan bayar",
        "Restart terus-menerus sampai hilang",
      ],
      correct: 2,
      why: "Itu Ransomware. Langkah 1: isolasi (cabut WiFi/LAN) agar tidak menyebar. JANGAN bayar — tidak ada jaminan file dikembalikan.",
    },
    {
      q: "Notifikasi update sistem muncul, tapi kamu lagi sibuk. Yang terbaik?",
      opts: [
        "Tunda terus sampai lupa",
        "Klik 'jangan pernah ingatkan saya'",
        "Instal secepatnya — update berisi patch keamanan penting",
        "Instal hanya kalau ada fitur baru yang keren",
      ],
      correct: 2,
      why: "Update berisi 'patch' untuk menutup celah keamanan yang sudah diketahui hacker. Menunda = memberi waktu untuk diserang.",
    },
    {
      q: "Akun Instagram teman kamu kirim DM minta pinjam uang mendadak. Reaksi?",
      opts: [
        "Langsung transfer, kasihan temen",
        "Konfirmasi via telpon/chat lain dulu, bisa jadi akunnya diretas",
        "Balas di DM yang sama menanyakan detail",
        "Posting di story untuk tanya",
      ],
      correct: 1,
      why: "Akun teman mungkin sudah dibajak. Selalu konfirmasi lewat jalur komunikasi berbeda (telepon/WA lain) sebelum mengirim apapun.",
    },
  ];

  let idx = 0;
  let score = 0;
  let answered = false;

  function $(sel) {
    return document.querySelector(sel);
  }

  function render() {
    const quiz = $("[data-testid='quiz']");
    if (idx >= questions.length) return renderResult();

    const q = questions[idx];
    const pct = ((idx / questions.length) * 100).toFixed(0);

    quiz.innerHTML = `
      <div class="quiz-progress">
        <span>Pertanyaan ${idx + 1} / ${questions.length}</span>
        <span>Skor: <b class="text-accent">${score}</b></span>
      </div>
      <div class="quiz-bar"><div class="quiz-bar-fill" style="width:${pct}%"></div></div>
      <div class="quiz-question">${q.q}</div>
      <div class="quiz-options" data-testid="quiz-options">
        ${q.opts
          .map(
            (o, i) => `
          <button class="quiz-option" data-idx="${i}" data-testid="quiz-option-${i}">
            <span class="key">${String.fromCharCode(65 + i)}</span>
            <span>${o}</span>
          </button>`
          )
          .join("")}
      </div>
      <div class="quiz-explain" data-testid="quiz-explain"></div>
      <div class="quiz-nav">
        <button class="btn btn-primary" data-testid="quiz-next-btn" style="display:none">
          ${idx === questions.length - 1 ? "Lihat Hasil" : "Selanjutnya"}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </button>
      </div>
    `;
    answered = false;
    quiz.querySelectorAll(".quiz-option").forEach((btn) =>
      btn.addEventListener("click", () => choose(parseInt(btn.dataset.idx, 10)))
    );
    $("[data-testid='quiz-next-btn']").addEventListener("click", () => {
      idx++;
      render();
    });
  }

  function choose(i) {
    if (answered) return;
    answered = true;
    const q = questions[idx];
    const buttons = document.querySelectorAll(".quiz-option");
    buttons.forEach((b, bi) => {
      b.disabled = true;
      if (bi === q.correct) b.classList.add("correct");
      else if (bi === i) b.classList.add("wrong");
    });
    if (i === q.correct) score++;
    const exp = $("[data-testid='quiz-explain']");
    exp.classList.add("show");
    exp.innerHTML = `<b>${i === q.correct ? "Benar!" : "Penjelasan"}</b>${q.why}`;
    $("[data-testid='quiz-next-btn']").style.display = "inline-flex";
  }

  function renderResult() {
    const pct = Math.round((score / questions.length) * 100);
    let badge, title, msg;
    if (pct >= 85) {
      badge = "Cyber Guardian";
      title = "Kamu sangat aman!";
      msg = "Kamu punya kebiasaan digital yang kuat. Bagi pengetahuan ini ke orang-orang di sekitarmu.";
    } else if (pct >= 60) {
      badge = "Cukup Waspada";
      title = "Aman, tapi bisa lebih baik";
      msg = "Kamu sudah paham dasar-dasarnya. Pertajam lagi di bagian password & mengenali phishing.";
    } else if (pct >= 35) {
      badge = "Perlu Ditingkatkan";
      title = "Hati-hati, ada celah";
      msg = "Beberapa kebiasaan masih berisiko. Baca ulang halaman Pencegahan & Penanganan untuk amankan dirimu.";
    } else {
      badge = "Rentan";
      title = "Waktunya serius upgrade keamanan";
      msg = "Akunmu rentan. Mulai dari basics: password kuat + 2FA + update rutin + hati-hati klik link.";
    }

    const quiz = $("[data-testid='quiz']");
    quiz.innerHTML = `
      <div class="quiz-result">
        <div class="quiz-score-ring" style="--pct:${pct}">
          <div class="num">${pct}<small>%</small></div>
        </div>
        <span class="badge">${badge}</span>
        <h3>${title}</h3>
        <p>${msg}</p>
        <p class="mono text-muted">Skor: ${score} / ${questions.length}</p>
        <button class="btn btn-ghost mt-3" data-testid="quiz-restart-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>
          Ulangi Kuis
        </button>
      </div>
    `;
    $("[data-testid='quiz-restart-btn']").addEventListener("click", () => {
      idx = 0;
      score = 0;
      render();
    });
  }

  function init() {
    if (!document.querySelector("[data-testid='quiz']")) return;
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
