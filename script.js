
"use strict";

const ADMIN_WA = "628818238236";

const categories = [
  {
    id: "sewa1",
    name: "SEWA BOT 1",
    subtitle: "MURAH",
    image: "catagorysewabot1.jpg",
    description: "Paket sewa bot dengan harga ekonomis.",
    type: "daily",
    monthly: 15000
  },
  {
    id: "sewa2",
    name: "SEWA BOT 2",
    subtitle: "BIASA",
    image: "catagorysewabot2.jpg",
    description: "Paket sewa bot untuk penggunaan reguler.",
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
    description: "Akses fitur premium yang tidak tersedia bagi user biasa.",
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
    description: "Bisa menjual kembali layanan bot dan memperoleh keuntungan dari penjualan.",
    type: "fixed",
    packages: [
      { label: "1 Bulan", price: 100000 },
      { label: "2 Bulan", price: 290000 },
      { label: "3 Bulan", price: 350000 },
      { label: "Permanen", price: 500000 }
    ]
  }
];

const $ = (id) => document.getElementById(id);

const categoryGrid = $("categoryGrid");
const priceSection = $("harga");
const checkoutSection = $("checkout");
const paymentSection = $("payment");
const priceList = $("priceList");
const priceTitle = $("priceTitle");
const priceDescription = $("priceDescription");
const durationGroup = $("durationGroup");
const durationInput = $("duration");
const music = $("backgroundMusic");

let currentCategory = null;
let selectedPackage = null;
let currentOrder = null;

function rupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Math.round(value));
}

function showSection(section) {
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideOrderSections() {
  checkoutSection.classList.add("hidden");
  paymentSection.classList.add("hidden");
}

function renderCategories() {
  categoryGrid.replaceChildren();

  categories.forEach((category) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "category-card";
    card.setAttribute("aria-label", "Lihat kategori " + category.name);

    const imageBox = document.createElement("span");
    imageBox.className = "category-image";

    const image = document.createElement("img");
    image.src = category.image;
    image.alt = category.name;
    image.loading = "lazy";
    image.onerror = () => {
      imageBox.innerHTML = "";
      const fallback = document.createElement("span");
      fallback.className = "category-hint";
      fallback.textContent = "Gambar tidak ditemukan";
      imageBox.appendChild(fallback);
    };
    imageBox.appendChild(image);

    const name = document.createElement("span");
    name.className = "category-name";
    name.textContent = category.name;

    const subtitle = document.createElement("span");
    subtitle.className = "category-hint";
    subtitle.textContent = category.subtitle;

    const description = document.createElement("span");
    description.className = "category-hint";
    description.textContent = category.description;

    const arrow = document.createElement("span");
    arrow.className = "card-arrow";
    arrow.textContent = "↗";

    card.append(imageBox, name, subtitle, description, arrow);
    card.addEventListener("click", () => openCategory(category));
    categoryGrid.appendChild(card);
  });
}

function openCategory(category) {
  currentCategory = category;
  selectedPackage = null;
  currentOrder = null;
  hideOrderSections();

  priceTitle.textContent = category.name;
  priceDescription.textContent = category.description;
  priceList.replaceChildren();

  if (category.type === "daily") {
    const perDay = category.monthly / 30;

    const options = [
      { label: "7 Hari", days: 7 },
      { label: "14 Hari", days: 14 },
      { label: "30 Hari", days: 30 }
    ];

    options.forEach((option) => {
      const total = Math.round(perDay * option.days);
      const card = createPriceCard(
        option.label,
        rupiah(total),
        rupiah(category.monthly) + " untuk 30 hari",
        () => selectPackage({
          category,
          label: option.label,
          days: option.days,
          price: total
        })
      );
      priceList.appendChild(card);
    });

    const customCard = createPriceCard(
      "Atur Durasi Sendiri",
      rupiah(perDay) + "/hari",
      "Pilih jumlah hari sendiri di formulir pesanan.",
      () => selectPackage({
        category,
        label: "Durasi khusus",
        days: 7,
        price: Math.round(perDay * 7)
      })
    );
    priceList.appendChild(customCard);
  } else {
    category.packages.forEach((item) => {
      const card = createPriceCard(
        item.label,
        rupiah(item.price),
        "Paket " + category.name,
        () => selectPackage({
          category,
          label: item.label,
          days: null,
          price: item.price
        })
      );
      priceList.appendChild(card);
    });
  }

  priceSection.classList.remove("hidden");
  showSection(priceSection);
}

function createPriceCard(name, price, description, onChoose) {
  const card = document.createElement("article");
  card.className = "price-card";

  const details = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = name;

  const desc = document.createElement("p");
  desc.textContent = description;

  details.append(title, desc);

  const actions = document.createElement("div");
  actions.style.textAlign = "right";

  const amount = document.createElement("div");
  amount.className = "price-amount";
  amount.textContent = price;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "choose-button";
  button.textContent = "PILIH PAKET";
  button.addEventListener("click", onChoose);

  actions.append(amount, button);
  card.append(details, actions);
  return card;
}

function selectPackage(item) {
  selectedPackage = item;
  currentOrder = null;

  $("selectedProduct").textContent =
    item.category.name + " — " + item.label;

  $("selectedDescription").textContent =
    item.category.description;

  durationGroup.classList.toggle("hidden", item.category.type !== "daily");

  if (item.category.type === "daily") {
    durationInput.value = item.days || 7;
    updateDailyPrice();
  } else {
    $("selectedPrice").textContent = rupiah(item.price);
  }

  paymentSection.classList.add("hidden");
  checkoutSection.classList.remove("hidden");
  showSection(checkoutSection);
}

function updateDailyPrice() {
  if (!selectedPackage || selectedPackage.category.type !== "daily") return;

  let days = Number.parseInt(durationInput.value, 10);
  if (!Number.isFinite(days)) days = 1;

  days = Math.max(1, Math.min(3650, days));
  durationInput.value = days;

  const perDay = selectedPackage.category.monthly / 30;
  selectedPackage.days = days;
  selectedPackage.label = days + " hari";
  selectedPackage.price = Math.round(perDay * days);

  $("selectedProduct").textContent =
    selectedPackage.category.name + " — " + days + " hari";

  $("selectedPrice").textContent = rupiah(selectedPackage.price);
}

$("minusDay").addEventListener("click", () => {
  durationInput.value = Math.max(1, (Number(durationInput.value) || 1) - 1);
  updateDailyPrice();
});

$("plusDay").addEventListener("click", () => {
  durationInput.value = Math.min(3650, (Number(durationInput.value) || 1) + 1);
  updateDailyPrice();
});

durationInput.addEventListener("input", updateDailyPrice);
durationInput.addEventListener("change", updateDailyPrice);

document.querySelectorAll("[data-days]").forEach((button) => {
  button.addEventListener("click", () => {
    durationInput.value = button.dataset.days;
    updateDailyPrice();
  });
});

$("backCategories").addEventListener("click", () => {
  priceSection.classList.add("hidden");
  hideOrderSections();
  showSection($("kategori"));
});

$("orderForm").addEventListener("submit", (event) => {
  event.preventDefault();

  if (!selectedPackage) {
    alert("Silakan pilih paket terlebih dahulu.");
    return;
  }

  const name = $("customerName").value.trim();
  const phone = $("customerPhone").value.trim();
  const note = $("customerNote").value.trim();

  if (name.length < 2) {
    alert("Masukkan nama yang benar.");
    return;
  }

  const digits = phone.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 15) {
    alert("Periksa kembali nomor WhatsApp kamu.");
    return;
  }

  if (selectedPackage.category.type === "daily") {
    updateDailyPrice();
  }

  currentOrder = {
    id: "LX-" + Date.now().toString(36).toUpperCase(),
    name,
    phone,
    note,
    category: selectedPackage.category.name,
    packageName: selectedPackage.label,
    days: selectedPackage.days,
    price: selectedPackage.price
  };

  $("paymentPrice").textContent = rupiah(currentOrder.price);
  paymentSection.classList.remove("hidden");
  showSection(paymentSection);
});

$("confirmWhatsApp").addEventListener("click", () => {
  if (!currentOrder) {
    alert("Silakan isi formulir pesanan terlebih dahulu.");
    return;
  }

  const order = currentOrder;

  const message = [
    "Halo Min LIXERA BOT, saya ingin konfirmasi pesanan.",
    "",
    "ID Pesanan: " + order.id,
    "Nama: " + order.name,
    "Nomor WhatsApp: " + order.phone,
    "Kategori: " + order.category,
    "Paket: " + order.packageName,
    ...(order.days ? ["Durasi: " + order.days + " hari"] : []),
    "Total harga: " + rupiah(order.price),
    "Catatan: " + (order.note || "-"),
    "",
    "Saya sudah melakukan pembayaran melalui QRIS. Mohon periksa pembayaran saya dan konfirmasi pesanan ini.",
    "",
    "Terima kasih, Min."
  ].join("\n");

  const url = "https://wa.me/" + ADMIN_WA + "?text=" + encodeURIComponent(message);
  window.open(url, "_blank", "noopener,noreferrer");
});

$("musicButton").addEventListener("click", async () => {
  try {
    if (music.paused) {
      await music.play();
      $("musicText").textContent = "MATIKAN MUSIK";
      $("musicButton").classList.add("playing");
    } else {
      music.pause();
      $("musicText").textContent = "PUTAR MUSIK";
      $("musicButton").classList.remove("playing");
    }
  } catch (error) {
    alert("Musik belum bisa diputar. Periksa file musicbotlixera.mp3 di GitHub.");
  }
});

music.addEventListener("ended", () => {
  $("musicText").textContent = "PUTAR MUSIK";
  $("musicButton").classList.remove("playing");
});

$("year").textContent = new Date().getFullYear();

renderCategories();
        
