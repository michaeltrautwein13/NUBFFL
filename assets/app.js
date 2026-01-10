async function loadJSON(path){
  const res = await fetch(path, { cache: "no-store" });
  if(!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
}

function setActiveNav(){
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".link").forEach(a=>{
    const target = a.getAttribute("href");
    if(target === here) a.classList.add("active");
  });
}

function esc(str){
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================
   HOMEPAGE: DEFENDING CHAMPION CARD
========================= */
async function renderHomepageChampion(){
  const wrap = document.getElementById("championSpotlight");
  if(!wrap) return;

  const h = await loadJSON("data/history.json");
  const champs = Array.isArray(h.champions) ? h.champions : [];
  if(champs.length === 0) return;

  // Always pick most recent by year (not array order)
  const c = champs.slice().sort((a,b) => Number(a.year) - Number(b.year)).pop();

  // Compact layout that fits above hero nicely
  wrap.innerHTML = `
    <section class="champ-card" style="margin-top:14px; padding:14px;">
      <div class="champ-top">
        <div>
          <div class="champ-title">Defending Champion</div>
          <div class="champ-name" style="font-size:20px;">${esc(c.champion || "—")}</div>
          <div class="champ-sub" style="font-size:13px;">
            ${esc(c.year || "—")}
            ${c.runner_up ? ` • Runner-up: <b>${esc(c.runner_up)}</b>` : ""}
          </div>
          ${c.note ? `<div class="muted" style="margin-top:6px;font-size:13px;line-height:1.35;">${esc(c.note)}</div>` : ""}
        </div>
        <div class="trophy" style="width:42px;height:42px;border-radius:12px;font-size:20px;">🏆</div>
      </div>
    </section>
  `;
}

function chipDelta(delta){
  const span = document.createElement("span");
  span.className = "chip delta " + (delta > 0 ? "up" : delta < 0 ? "down" : "flat");
  span.textContent = delta > 0 ? `▲ ${delta}` : delta < 0 ? `▼ ${Math.abs(delta)}` : "— 0";
  return span;
}

/* =========================
   POWER RANKINGS
========================= */
async function renderPower(){
  const pr = await loadJSON("data/power_rankings.json");
  document.getElementById("prWeek").textContent = pr.week ? `Week ${pr.week}` : "";
  document.getElementById("prUpdated").textContent = pr.last_updated || "—";

  const wrap = document.getElementById("prList");
  wrap.innerHTML = "";

  (pr.rankings || []).forEach(r=>{
    const row = document.createElement("div");
    row.className = "rank-row";

    const top = document.createElement("div");
    top.className = "rank-top";

    const name = document.createElement("div");
    name.classNam
