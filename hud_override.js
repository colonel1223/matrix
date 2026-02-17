(function(){
  // Create HUD if missing
  function ensureHud(){
    let hud = document.getElementById("top-status-wrap");
    if(!hud){
      hud = document.createElement("div");
      hud.id = "top-status-wrap";
      hud.innerHTML = `
        <div>Today: <span id="todayDate">—</span></div>
        <div>Last Updated: <span id="lastUpdated">—</span></div>
        <div>Countdown: <span id="countdownLive">—</span></div>
      `;
      document.body.insertBefore(hud, document.body.firstChild);
    }
    return hud;
  }

  function formatDate(d){
    const yyyy=d.getFullYear();
    const mm=String(d.getMonth()+1).padStart(2,'0');
    const dd=String(d.getDate()).padStart(2,'0');
    const hh=String(d.getHours()).padStart(2,'0');
    const mi=String(d.getMinutes()).padStart(2,'0');
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
  }

  // Set Today + Last Updated
  function setDates(){
    const todayEl = document.getElementById("todayDate");
    if(todayEl) todayEl.textContent = formatDate(new Date());

    // Best default: browser-reported last modified of index.html
    const last = (document.lastModified && document.lastModified !== "0")
      ? new Date(document.lastModified)
      : new Date();

    const updEl = document.getElementById("lastUpdated");
    if(updEl) updEl.textContent = formatDate(last);
  }

  // Countdown
  const TARGET = "2026-12-01T00:00:00-08:00";
  function tick(){
    const el = document.getElementById("countdownLive");
    if(!el) return;

    const diff = new Date(TARGET) - new Date();
    if(diff <= 0){ el.textContent = "00d 00h 00m 00s"; return; }

    const s = Math.floor(diff/1000);
    const d = Math.floor(s/86400);
    const h = Math.floor((s%86400)/3600);
    const m = Math.floor((s%3600)/60);
    const sec = s%60;

    el.textContent =
      String(d).padStart(2,'0')+"d "+
      String(h).padStart(2,'0')+"h "+
      String(m).padStart(2,'0')+"m "+
      String(sec).padStart(2,'0')+"s";
  }

  // Measure heights and fix clipping
  function fixLayout(){
    const hud = ensureHud();
    const nav = document.querySelector(".nav");

    const hudH = hud ? hud.offsetHeight : 40;
    const navH = nav ? nav.offsetHeight : 56;

    document.documentElement.style.setProperty("--hudH", hudH+"px");
    document.documentElement.style.setProperty("--navH", navH+"px");

    if(nav) nav.style.top = hudH+"px";
    document.body.style.paddingTop = (hudH + navH + 10) + "px";
  }

  function boot(){
    ensureHud();
    setDates();
    tick();
    fixLayout();
    setInterval(tick, 1000);
    // Recalc after fonts/canvas settle
    setTimeout(fixLayout, 250);
    setTimeout(fixLayout, 1200);
    window.addEventListener("resize", fixLayout);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
