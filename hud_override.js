(function(){
  function formatDate(d){
    const yyyy=d.getFullYear();
    const mm=String(d.getMonth()+1).padStart(2,'0');
    const dd=String(d.getDate()).padStart(2,'0');
    const hh=String(d.getHours()).padStart(2,'0');
    const mi=String(d.getMinutes()).padStart(2,'0');
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
  }

  // Ensure HUD exists
  function ensureHud(){
    let hud=document.getElementById("top-status-wrap");
    if(!hud){
      hud=document.createElement("div");
      hud.id="top-status-wrap";
      hud.innerHTML=`
        <div>Today: <span id="todayDate">—</span></div>
        <div>Last Updated: <span id="lastUpdated">—</span></div>
        <div>Countdown: <span id="countdownLive">—</span></div>
      `;
      document.body.insertBefore(hud, document.body.firstChild);
    }
    return hud;
  }

  // Set Today + Updated
  function setDates(){
    const t=document.getElementById("todayDate");
    if(t) t.textContent=formatDate(new Date());

    const lm=(document.lastModified && document.lastModified!=="0") ? new Date(document.lastModified) : new Date();
    const u=document.getElementById("lastUpdated");
    if(u) u.textContent=formatDate(lm);
  }

  // Countdown
  const TARGET="2026-12-01T00:00:00-08:00";
  function tick(){
    const el=document.getElementById("countdownLive");
    if(!el) return;
    let diff=new Date(TARGET)-new Date();
    if(diff<=0){ el.textContent="00d 00h 00m 00s"; return; }
    const s=Math.floor(diff/1000);
    const d=Math.floor(s/86400);
    const h=Math.floor((s%86400)/3600);
    const m=Math.floor((s%3600)/60);
    const sec=s%60;
    el.textContent=
      String(d).padStart(2,'0')+"d "+
      String(h).padStart(2,'0')+"h "+
      String(m).padStart(2,'0')+"m "+
      String(sec).padStart(2,'0')+"s";
  }

  // Fix layout: HUD at top, credits below HUD, nav below credits
  function fixLayout(){
    const hud=ensureHud();
    const credits=document.getElementById("creditsBar") || document.querySelector(".credits-bar");
    const nav=document.querySelector(".nav");

    const hudH=hud ? hud.offsetHeight : 40;
    const creditsH=credits ? credits.offsetHeight : 0;
    const navH=nav ? nav.offsetHeight : 56;

    // set CSS variables for override css
    document.documentElement.style.setProperty("--hudH", hudH+"px");
    document.documentElement.style.setProperty("--creditsH", creditsH+"px");
    document.documentElement.style.setProperty("--navH", navH+"px");

    // Position credits bar directly under HUD (if it exists)
    if(credits){
      credits.style.position="fixed";
      credits.style.top=hudH+"px";
      credits.style.zIndex="18000";
      credits.style.left="0";
      credits.style.right="0";
    }

    // Position nav under HUD + credits
    if(nav){
      nav.style.position="fixed";
      nav.style.top=(hudH+creditsH)+"px";
      nav.style.zIndex="15000";
      nav.style.left="0";
      nav.style.right="0";
    }

    // Push body below HUD + credits + nav so hero headings are never clipped
    document.body.style.paddingTop=(hudH+creditsH+navH+12)+"px";
  }

  function boot(){
    ensureHud();
    setDates();
    tick();
    fixLayout();
    setInterval(tick,1000);
    // reflow after fonts/canvas settle
    setTimeout(fixLayout,250);
    setTimeout(fixLayout,1200);
    window.addEventListener("resize",fixLayout);
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot);
  else boot();
})();
