
"use strict";

const ADMIN_WA = "628818238236";

const categories = [
  {
    id: "sewa1",
    name: "SEWA BOT 1",
    subtitle: "MURAH",
    image: "catagorysewabot1.jpg",
    description: "Paket sewa bot ekonomis.",
    type: "daily",
    monthly: 15000
  },
  {
    id: "sewa2",
    name: "SEWA BOT 2",
    subtitle: "BIASA",
    image: "catagorysewabot2.jpg",
    description: "Paket sewa bot reguler.",
    type: "daily",
    monthly: 25000
  },
  {
    id: "sewa3",
    name: "SEWA BOT 3",
    subtitle: "VIP",
    image: "catagorysewabot3.jpg",
    description: "Paket sewa bot VIP.",
    type: "daily",
    monthly: 35000
  },
  {
    id: "premium",
    name: "USER PREMIUM",
    subtitle: "AKSES PREMIUM",
    image: "catagoryuserpremium.jpg",
    description: "Akses fitur premium yang tidak tersedia untuk user biasa.",
    type: "fixed",
    packages: [
      { label: "1 Bulan", price: 50000 },
      { label: "2 Bulan", price: 95000 },
      { label: "3 Bulan", price: 140000 },
      { label: "Permanen", price: 300000 }
    ]
  },
  {
    id: "reseller",
    name: "RESELLER / OWNER",
    subtitle: "AKSES PENUH",
    image: "catagoryresellerowner.jpg",
    description: "Jual kembali layanan bot dan dapatkan keuntungan dari penjualan.",
    type: "fixed",
    packages: [
      { label: "1 Bulan", price: 100000 },
      { label: "2 Bulan", price: 290000 },
      { label: "3 Bulan", price: 350000 },
      { label: "Permanen", price: 500000 }
    ]
  }
];

const $ = id => document.getElementById(id);

const homePage = $("homePage");
const hargaPage = $("hargaPage");
const checkoutPage = $("checkoutPage");
const paymentPage = $("paymentPage");
const durationInput = $("duration");
const music = $("backgroundMusic");

let selected = null;
let order = null;

function rupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Math.round(number));
}

function showPage(page) {
  [homePage, hargaPage, checkoutPage, paymentPage].forEach(section => {
    section.classList.add("hidden");
  });

  page.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCategories() {
  const grid = $("categoryGrid");
  grid.replaceChildren();

  categories.forEach(category => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "category-card";

    const imageBox = document.createElement("span");
    imageBox.className = "category-image";

    const img = document.createElement("img");
    img.src = category.image;
    img.alt = category.name;
    img.loading = "lazy";

    img.onerror = () => {
      imageBox.replaceChildren();
      const fallback = document.createElement("span");
      fallback.className = "category-hint";
      fallback.textContent = "Gambar tidak ditemukan";
      imageBox.appendChild(fallback);
    };

    imageBox.appendChild(img);

    const name = document.createElement("span");
    name.className = "category-name";
    name.textContent = category.name;

    const subtitle = document.createElement("span");
    subtitle.className = "category-subtitle";
    subtitle.textContent = category.subtitle;

    const desc = document.createElement("span");
    desc.className = "category-hint";
    desc.textContent = category.description;

    const arrow = document.createElement("span");
    arrow.className = "card-arrow";
    arrow.textContent = "↗";

    card.append(imageBox, name, subtitle, desc, arrow);
    card.addEventListener("click", () => openCategory(category));
    grid.appendChild(card);
  });
}

function openCategory(category) {
  selected = null;
  order = null;

  $("priceTitle").textContent = category.name;
  $("priceDescription").textContent = category.description;

  const list = $("priceList");
  list.replaceChildren();

  if (category.type === "daily") {
    addPriceCard(
      "Pilih durasi sewa",
      "Mulai 3 hari",
      "Tarif dihitung per hari. Kamu bisa mengatur jumlah hari sendiri.",
      () => openCheckout({
        category,
        label: "3 hari",
        days: 3,
        price: dailyPrice(category, 3)
      })
    );
  } else {
    category.packages.forEach(item => {
      addPriceCard(
        item.label,
        rupiah(item.price),
        "Paket " + category.name,
        () => openCheckout({
          category,
          label: item.label,
          days: null,
          price: item.price
        })
      );
    });
  }

  showPage(hargaPage);
}

function addPriceCard(title, price, description, onChoose) {
  const card = document.createElement("article");
  card.className = "price-card";

  const details = document.createElement("div");
  const heading = document.createElement("h3");
  heading.textContent = title;

  const desc = document.createElement("p");
  desc.textContent = description;

  details.append(heading, desc);

  const actions = document.createElement("div");
  const amount = document.createElement("div");
  amount.className = "price-amount";
  amount.textContent = price;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "choose-button";
  button.textContent = "PILIH";
  button.addEventListener("click", onChoose);

  actions.append(amount, button);
  card.append(details, actions);
  $("priceList").appendChild(card);
}

function dailyPrice(category, days) {
  return Math.round(category.monthly * days / 30);
}

function openCheckout(item) {
  selected = item;
  order = null;

  $("selectedProduct").textContent =
    item.category.name + " — " + item.label;

  $("selectedDescription").textContent = item.category.description;

  $("durationGroup").classList.toggle(
    "hidden",
    item.category.type !== "daily"
  );

  if (item.category.type === "daily") {
    durationInput.value = item.days || 3;
    updateDailyPrice();
  } else {
    $("selectedPrice").textContent = rupiah(item.price);
  }

  showPage(checkoutPage);
}

function updateDailyPrice() {
  if (!selected || selected.category.type !== "daily") return;

  let days = Number.parseInt(durationInput.value, 10);
  if (!Number.isFinite(days)) days = 3;

  days = Math.max(1, Math.min(3650, days));
  durationInput.value = days;

  selected.days = days;
  selected.label = days + " hari";
  selected.price = dailyPrice(selected.category, days);

  $("selectedProduct").textContent =
    selected.category.name + " — " + days + " hari";

  $("selectedPrice").textContent = rupiah(selected.price);
}

$("minusDay").addEventListener("click", () => {
  durationInput.value = Math.max(
    1,
    (Number(durationInput.value) || 3) - 1
  );
  updateDailyPrice();
});

$("plusDay").addEventListener("click", () => {
  durationInput.value = Math.min(
    3650,
    (Number(durationInput.value) || 3) + 1
  );
  updateDailyPrice();
});

durationInput.addEventListener("input", updateDailyPrice);
durationInput.addEventListener("change", updateDailyPrice);

$("backCategories").addEventListener("click", () => showPage(homePage));
$("backPrices").addEventListener("click", () => showPage(hargaPage));
$("backCheckout").addEventListener("click", () => showPage(checkoutPage));

$("orderForm").addEventListener("submit", event => {
  event.preventDefault();

  if (!selected) {
    alert("Pilih paket terlebih dahulu.");
    return;
  }

  if (selected.category.type === "daily") updateDailyPrice();

  const name = $("customerName").value.trim();
  const phone = $("customerPhone").value.trim();
  const digits = phone.replace(/\D/g, "");

  if (name.length < 2) {
    alert("Masukkan nama kamu.");
    return;
  }

  if (digits.length < 9 || digits.length > 15) {
    alert("Periksa nomor WhatsApp kamu.");
    return;
  }

  order = {
    id: "LX-" + Date.now().toString(36).toUpperCase(),
    name,
    phone,
    note: $("customerNote").value.trim(),
    category: selected.category.name,
    package: selected.label,
    days: selected.days,
    price: selected.price
  };

  $("paymentPrice").textContent = rupiah(order.price);
  showPage(paymentPage);
});

$("confirmWhatsApp").addEventListener("click", () => {
  if (!order) {
    alert("Silakan buat pesanan terlebih dahulu.");
    return;
  }

  const message = [
    "Halo Min LIXERA BOT, saya ingin konfirmasi pesanan.",
    "",
    "ID Pesanan: " + order.id,
    "Nama: " + order.name,
    "Nomor WhatsApp: " + order.phone,
    "Kategori: " + order.category,
    "Paket: " + order.package,
    ...(order.days ? ["Durasi: " + order.days + " hari"] : []),
    "Total harga: " + rupiah(order.price),
    "Catatan: " + (order.note || "-"),
    "",
    "Saya sudah membayar melalui QRIS. Mohon cek pembayaran dan konfirmasi pesanan saya.",
    "Terima kasih, Min."
  ].join("\n");

  const url = "https://wa.me/" + ADMIN_WA +
    "?text=" + encodeURIComponent(message);

  window.open(url, "_blank");
});

// Musik: coba autoplay; browser Android mungkin tetap meminta interaksi.
async function startMusic() {
  try {
    await music.play();
    $("musicButton").textContent = "♫ MUSIK ON";
  } catch {
    $("musicButton").textContent = "♫ SENTUH UNTUK MUSIK";
  }
}

$("musicButton").addEventListener("click", async () => {
  if (music.paused) {
    await startMusic();
  } else {
    music.pause();
    $("musicButton").textContent = "♫ MUSIK OFF";
  }
});

// Coba lagi setelah interaksi pertama jika autoplay diblokir.
function firstInteraction() {
  if (music.paused) startMusic();
  document.removeEventListener("pointerdown", firstInteraction);
  document.removeEventListener("keydown", firstInteraction);
}

document.addEventListener("pointerdown", firstInteraction);
document.addEventListener("keydown", firstInteraction);

$("year").textContent = new Date().getFullYear();

renderCategories();
startMusic();
                     
