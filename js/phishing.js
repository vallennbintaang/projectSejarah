/* =========================================================
   Phishing Email Simulator
   ========================================================= */

(function () {
  "use strict";

  const emails = [
    {
      phish: true,
      from: "support@inst4gram-security.com",
      to: "kamu@email.com",
      subject: "Peringatan! Akun Anda akan dinonaktifkan dalam 24 jam",
      preview: "Segera verifikasi sekarang untuk menghindari pemblokiran.",
      body: `Pelanggan Yth,\n\nKami mendeteksi aktivitas mencurigakan pada akun Anda. Untuk menghindari penonaktifan permanen, verifikasi identitas Anda segera dengan mengklik link berikut:\n\n<a class="fake-link" href="#">http://instagram-verify-login.co/ver1fy-account</a>\n\nJika tidak dilakukan dalam 24 jam, akun Anda akan dihapus selamanya.\n\nHormat kami,\nTim Keamanan Instagram`,
      clues: [
        "Domain pengirim palsu: `inst4gram-security.com` (huruf '4' menggantikan 'a').",
        "URL link tidak cocok dengan domain resmi instagram.com.",
        "Menggunakan taktik urgensi & ancaman ('24 jam', 'dihapus selamanya').",
        "Salam generik 'Pelanggan Yth' tanpa nama Anda.",
      ],
    },
    {
      phish: false,
      from: "noreply@github.com",
      to: "kamu@email.com",
      subject: "[GitHub] Sign-in berhasil dari perangkat baru",
      preview: "Anda baru saja masuk ke akun GitHub dari Chrome di Windows.",
      body: `Halo,\n\nAnda baru saja login ke GitHub menggunakan perangkat baru:\n\nBrowser: Chrome 128\nLokasi: Jakarta, Indonesia\nWaktu: ${new Date().toLocaleString("id-ID")}\n\nJika ini adalah Anda, tidak perlu tindakan apapun. Jika bukan, segera amankan akun Anda di pengaturan keamanan.\n\n— GitHub`,
      clues: [
        "Domain pengirim resmi: github.com (tanpa salah eja).",
        "Tidak ada link mencurigakan yang meminta login/password.",
        "Memberi informasi spesifik (perangkat, waktu, lokasi) untuk verifikasi pengguna.",
        "Tidak menggunakan bahasa ancaman atau urgensi palsu.",
      ],
    },
    {
      phish: true,
      from: "bank.mandiri@secure-livemandiri.xyz",
      to: "kamu@email.com",
      subject: "Hadiah saldo Rp 2.500.000 menunggu Anda — klaim sekarang",
      preview: "Selamat! Nasabah terpilih bulan ini.",
      body: `SELAMAT!!\n\nAnda adalah 1 dari 100 nasabah terpilih yang berhak mendapatkan SALDO GRATIS senilai Rp 2.500.000,-\n\nKlaim sekarang juga sebelum kuota habis:\n<a class="fake-link" href="#">https://klaim-hadiah-mandiri.xyz/login</a>\n\nMasukkan nomor kartu + PIN ATM Anda untuk verifikasi.\n\nPenawaran berlaku hanya hari ini.`,
      clues: [
        "Domain aneh `.xyz` yang tidak pernah digunakan bank resmi.",
        "Bank TIDAK PERNAH meminta nomor kartu + PIN melalui email.",
        "Iming-iming hadiah besar (social engineering klasik).",
        "Tata bahasa tidak profesional (huruf kapital berlebihan, kalimat seru).",
      ],
    },
    {
      phish: false,
      from: "tokopedia@tokopedia.com",
      to: "kamu@email.com",
      subject: "Pesanan INV/2024/10/05 berhasil dikirim",
      preview: "Paket Anda sedang dalam perjalanan.",
      body: `Halo Andi,\n\nTerima kasih telah berbelanja di Tokopedia!\n\nPesanan Anda dengan nomor INV/2024/10/05 telah diambil kurir dan sedang dalam perjalanan.\n\nLacak paket Anda langsung di aplikasi Tokopedia atau di tokopedia.com/order.\n\nSalam,\nTim Tokopedia`,
      clues: [
        "Domain resmi `tokopedia.com` tanpa modifikasi.",
        "Menyebutkan nama asli pembeli dan nomor invoice spesifik.",
        "Mengarahkan ke aplikasi/website resmi, bukan link mencurigakan.",
        "Tidak meminta data sensitif atau login ulang.",
      ],
    },
    {
      phish: true,
      from: "hr.department@company-payr0ll.net",
      to: "kamu@email.com",
      subject: "URGENT: Update data rekening sebelum gajian",
      preview: "Slip gaji bulan ini hanya bisa diterima setelah update.",
      body: `Kepada karyawan,\n\nSistem payroll kami telah diperbarui. Agar gaji bulan ini tidak tertunda, mohon update data rekening Anda melalui form berikut paling lambat besok:\n\n<a class="fake-link" href="#">http://hr-payroll-update.company-payr0ll.net/form</a>\n\nAbaikan email ini akan menyebabkan penundaan transfer gaji.\n\nTerima kasih,\nHRD`,
      clues: [
        "Domain palsu dengan angka: `payr0ll` menggantikan 'payroll'.",
        "Tekanan waktu (deadline besok) untuk memaksa tindakan cepat.",
        "Link mengarah ke domain eksternal, bukan portal HR internal.",
        "Salam generik 'Kepada karyawan' tanpa nama spesifik.",
      ],
    },
  ];

  let idx = 0;
  let score = 0;
  let answered = false;
  let total = emails.length;

  function $(sel) {
    return document.querySelector(sel);
  }

  function renderEmail() {
    if (idx >= emails.length) return renderDone();
    const e = emails[idx];
    $("[data-testid='phish-counter']").innerHTML =
      `Email <b>${idx + 1}</b> / ${total} • skor: <b>${score}</b>`;
    $("[data-testid='phish-progress']").style.width =
      ((idx / total) * 100).toFixed(0) + "%";
    $("[data-testid='phish-from']").textContent = e.from;
    $("[data-testid='phish-to']").textContent = e.to;
    $("[data-testid='phish-subject']").textContent = e.subject;
    $("[data-testid='phish-body']").innerHTML = e.body.replace(/\n/g, "<br>");
    $("[data-testid='phish-feedback']").className = "phish-feedback";
    $("[data-testid='phish-feedback']").innerHTML =
      `<div class="empty">Analisa email di sebelah. Putuskan: ini <b class="text-accent">AMAN</b> atau <b style="color:var(--danger)">PHISHING</b>?</div>`;
    $("[data-testid='phish-safe-btn']").disabled = false;
    $("[data-testid='phish-phish-btn']").disabled = false;
    $("[data-testid='phish-next-btn']").style.display = "none";
    answered = false;
  }

  function answer(userSaysPhish) {
    if (answered) return;
    answered = true;
    const e = emails[idx];
    const correct = userSaysPhish === e.phish;
    if (correct) score++;

    const fb = $("[data-testid='phish-feedback']");
    fb.classList.add(correct ? "correct" : "wrong");
    const heading = correct
      ? `<h4 class="ok">✓ Benar! Ini ${e.phish ? "Phishing" : "Email Aman"}.</h4>`
      : `<h4 class="no">✗ Kurang tepat. Ini sebenarnya ${e.phish ? "Phishing" : "email aman"}.</h4>`;
    fb.innerHTML = `${heading}<ul>${e.clues.map((c) => `<li>${c}</li>`).join("")}</ul>`;

    $("[data-testid='phish-safe-btn']").disabled = true;
    $("[data-testid='phish-phish-btn']").disabled = true;
    $("[data-testid='phish-next-btn']").style.display = "inline-flex";
    $("[data-testid='phish-counter']").innerHTML =
      `Email <b>${idx + 1}</b> / ${total} • skor: <b>${score}</b>`;
  }

  function renderDone() {
    const pct = Math.round((score / total) * 100);
    let verdict = "Butuh latihan lagi";
    if (pct >= 80) verdict = "Detektif Phishing Handal";
    else if (pct >= 60) verdict = "Cukup Waspada";
    const container = $("[data-testid='phish-simulator']");
    container.innerHTML = `
      <div class="tool" style="text-align:center">
        <span class="chip">SIMULASI SELESAI</span>
        <h3 style="margin-top:1rem">${verdict}</h3>
        <p class="lead" style="margin: 0.75rem auto 0; max-width:50ch">
          Kamu benar <b class="text-accent">${score}</b> dari <b class="text-accent">${total}</b> email (${pct}%).
          Kunci utama: periksa domain pengirim, hindari link mencurigakan, dan waspada pada iming-iming atau ancaman.
        </p>
        <button class="btn btn-primary mt-3" data-testid="phish-restart-btn">Ulangi Simulasi</button>
      </div>
    `;
    $("[data-testid='phish-restart-btn']").addEventListener("click", () => {
      idx = 0;
      score = 0;
      location.reload();
    });
  }

  function next() {
    idx++;
    renderEmail();
  }

  function init() {
    if (!document.querySelector("[data-testid='phish-simulator']")) return;
    renderEmail();
    $("[data-testid='phish-safe-btn']").addEventListener("click", () => answer(false));
    $("[data-testid='phish-phish-btn']").addEventListener("click", () => answer(true));
    $("[data-testid='phish-next-btn']").addEventListener("click", next);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
