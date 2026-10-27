const spots = [
  {
    name: "蔵造りの町並み",
    cat: "歴史",
    text: "川越大火のあとに商人が競って店蔵を再建。国の重要伝統的建造物群保存地区に選定されています。",
    place: "一番街"
  },
  {
    name: "大沢家住宅",
    cat: "歴史",
    text: "寛政4年（1792年）建設。川越の一番街に現存する最古の蔵造りで、国の重要文化財です。",
    place: "川越市元町1-15-2"
  },
  {
    name: "時の鐘",
    cat: "歴史",
    text: "高さ約16mの3層構造。現在の建物は1894年再建の4代目で、1日4回鐘が鳴ります。",
    place: "蔵造りの町並み付近"
  },
  {
    name: "菓子屋横丁",
    cat: "食べ歩き",
    text: "石畳の細い路地に、飴・せんべい・カルメ焼き・お団子など約30軒の菓子店が並びます。",
    place: "川越市元町"
  },
  {
    name: "おさつチップ",
    cat: "食べ歩き",
    text: "極薄スライスのパリパリ食感と、芋の濃い甘みが人気の定番品です。",
    place: "一番街ほか"
  },
  {
    name: "大学いもパフェ",
    cat: "食べ歩き",
    text: "さつまいもをたっぷり使った、川越らしい芋スイーツです。",
    place: "一番街ほか"
  },
  {
    name: "いも恋",
    cat: "食べ歩き",
    text: "さつまいもと粒餡を、もちもちの生地で包んだ蒸し饅頭の伝統和菓子です。",
    place: "一番街ほか"
  },
  {
    name: "おせんべい焼き体験",
    cat: "体験",
    text: "説明と体験で10分ほど。焼いたせんべいは持ち帰りも食べ歩きもできます。",
    place: "十人十色（元町2-3-17）"
  }
];

const cats = ["すべて", ...new Set(spots.map((s) => s.cat))];
const grid = document.getElementById("grid");
const filters = document.getElementById("filters");
const count = document.getElementById("count");
let current = "すべて";

function render() {
  const list = spots.filter((s) => current === "すべて" || s.cat === current);
  grid.innerHTML = "";

  list.forEach((s) => {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.cat = s.cat;

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = s.cat;

    const title = document.createElement("h3");
    title.textContent = s.name;

    const text = document.createElement("p");
    text.textContent = s.text;

    const place = document.createElement("p");
    place.className = "addr";
    place.textContent = "場所：" + s.place;

    card.append(tag, title, text, place);
    grid.appendChild(card);
  });

  count.textContent = list.length + "件を表示中";
  filters.querySelectorAll("button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.textContent === current));
  });
}

cats.forEach((cat) => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = cat;
  button.addEventListener("click", () => {
    current = cat;
    render();
  });
  filters.appendChild(button);
});

render();

const bellEl = document.getElementById("bell-next");
const hours = [6, 12, 15, 18];

function tick() {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  let next = null;

  for (const hour of hours) {
    const target = new Date(now);
    target.setHours(hour, 0, 0, 0);
    if (target > now) {
      next = target;
      break;
    }
  }

  if (!next) {
    next = new Date(now);
    next.setDate(next.getDate() + 1);
    next.setHours(hours[0], 0, 0, 0);
  }

  const remaining = Math.floor((next - now) / 1000);
  const pad = (value) => String(value).padStart(2, "0");
  bellEl.textContent = pad(Math.floor(remaining / 3600)) + ":" + pad(Math.floor((remaining % 3600) / 60)) + ":" + pad(remaining % 60) + " 後";
}

tick();
setInterval(tick, 1000);

const root = document.documentElement;

try {
  const saved = localStorage.getItem("kawagoe-theme");
  if (saved) {
    root.dataset.theme = saved;
  }
} catch (error) {
  console.warn("テーマの保存に失敗しました。", error);
}

document.getElementById("theme").addEventListener("click", () => {
  const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";

  try {
    localStorage.setItem("kawagoe-theme", root.dataset.theme);
  } catch (error) {
    console.warn("テーマの保存に失敗しました。", error);
  }
});
