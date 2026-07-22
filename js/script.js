// ---------- Starfield background (runs on every page) ----------
function buildStars(){
  const container = document.querySelector(".stars");
  if(!container) return;
  const count = window.innerWidth < 500 ? 40 : 70;
  for(let i=0;i<count;i++){
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random()*100 + "vw";
    star.style.top = Math.random()*100 + "vh";
    star.style.animationDelay = (Math.random()*4) + "s";
    star.style.width = star.style.height = (Math.random()*2+1) + "px";
    container.appendChild(star);
  }
}
buildStars();

// ---------- Smooth link transition ----------
function goTo(url){
  document.body.classList.add("fade-out");
  setTimeout(()=>{ window.location.href = url; }, 450);
}
document.querySelectorAll("[data-nav]").forEach(el=>{
  el.addEventListener("click", ()=> goTo(el.getAttribute("data-nav")));
});

// ---------- Index page: Yes / No ----------
const yesBtn = document.querySelector(".yesBtn");
const noBtn = document.querySelector(".noBtn");
if(yesBtn){
  yesBtn.addEventListener("click", ()=> goTo("balloons.html"));
}
if(noBtn){
  noBtn.addEventListener("mouseover", ()=>{
    const x = Math.random()*220 - 110;
    const y = Math.random()*140 - 70;
    noBtn.style.transform = `translate(${x}px,${y}px)`;
  });
  noBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    noBtn.textContent = "You have to click YES 😄";
  });
}

// ---------- Balloons page ----------
const balloons = document.querySelectorAll(".balloon");
if(balloons.length){
  let popped = 0;
  const statusEl = document.getElementById("status");
  balloons.forEach(b=>{
    b.addEventListener("click", ()=>{
      if(b.classList.contains("popped")) return;
      b.classList.add("popped");
      popped++;
      if(statusEl) statusEl.textContent = `Balloons popped: ${popped} / 4`;
      if(popped === balloons.length){
        if(statusEl) statusEl.textContent = "You're so special 💗";
        setTimeout(()=> goTo("cake.html"), 1200);
      }
    });
  });
}

// ---------- Cake page ----------
const blowBtn = document.getElementById("blowBtn");
const flame = document.getElementById("flame");
const smoke = document.getElementById("smoke");
if(blowBtn){
  blowBtn.addEventListener("click", ()=>{
    blowBtn.disabled = true;
    if(flame) flame.style.display = "none";
    if(smoke) smoke.style.display = "block";
    setTimeout(()=> goTo("wish.html"), 1800);
  });
}

// ---------- Wish page (countdown) ----------
const countdownEl = document.getElementById("countdown");
if(countdownEl){
  let count = 3;
  const interval = setInterval(()=>{
    count--;
    if(count > 0){
      countdownEl.textContent = count;
    } else {
      countdownEl.textContent = "❤";
      clearInterval(interval);
      setTimeout(()=> goTo("roses.html"), 900);
    }
  }, 1000);
}

// ---------- Roses page: falling petals ----------
const roseStage = document.querySelector(".rose-page");
if(roseStage){
  for(let i=0;i<18;i++){
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.textContent = "🌸";
    petal.style.left = Math.random()*100 + "vw";
    petal.style.animationDuration = (5+Math.random()*5) + "s";
    petal.style.animationDelay = (Math.random()*4) + "s";
    document.body.appendChild(petal);
  }
}

// ---------- Memories page: swipeable cards ----------
const cards = document.querySelectorAll(".photo-card");
if(cards.length){
  let current = 0;
  const hint = document.getElementById("swipeHint");
  function showCard(){
    cards.forEach((c,i)=>{
      c.style.display = i === current ? "flex" : "none";
      c.style.transform = "translateX(0) rotate(0)";
      c.style.opacity = "1";
    });
  }
  function advance(){
    current++;
    if(current < cards.length){
      showCard();
    } else {
      goTo("letter.html");
    }
  }
  showCard();

  let startX = 0, dragging = false;
  const stack = document.querySelector(".card-stack");

  function dragStart(x){ startX = x; dragging = true; }
  function dragMove(x){
    if(!dragging) return;
    const dx = x - startX;
    const active = cards[current];
    if(active){
      active.style.transform = `translateX(${dx}px) rotate(${dx/18}deg)`;
      active.style.opacity = String(1 - Math.min(Math.abs(dx)/280, .6));
    }
  }
  function dragEnd(x){
    if(!dragging) return;
    dragging = false;
    const dx = x - startX;
    if(Math.abs(dx) > 70){
      advance();
    } else {
      const active = cards[current];
      if(active){
        active.style.transform = "translateX(0) rotate(0)";
        active.style.opacity = "1";
      }
    }
  }

  if(stack){
    stack.addEventListener("touchstart", e=> dragStart(e.touches[0].clientX));
    stack.addEventListener("touchmove", e=> dragMove(e.touches[0].clientX));
    stack.addEventListener("touchend", e=> dragEnd(e.changedTouches[0].clientX));
    stack.addEventListener("mousedown", e=> dragStart(e.clientX));
    stack.addEventListener("mousemove", e=> dragMove(e.clientX));
    stack.addEventListener("mouseup", e=> dragEnd(e.clientX));
    stack.addEventListener("mouseleave", e=>{ if(dragging) dragEnd(e.clientX); });
  }
  document.addEventListener("keydown", e=>{
    if(e.key === "ArrowRight" || e.key === "ArrowLeft") advance();
  });
  if(hint){
    setTimeout(()=>{ hint.style.opacity = "0"; }, 4000);
  }
}

// ---------- Letter page: typewriter ----------
const typingEl = document.getElementById("typing");
if(typingEl){
  const message = (typingEl.getAttribute("data-message") || "").replace(/\\n/g, "\n");
  let i = 0;
  function type(){
    if(i < message.length){
      typingEl.textContent += message.charAt(i);
      i++;
      setTimeout(type, 28);
    }
  }
  type();
}

// ---------- Final page: hearts + fireworks + reveal ----------
const heartLayer = document.getElementById("heartLayer");
if(heartLayer){
  setInterval(()=>{
    const heart = document.createElement("div");
    heart.className = "heart-float";
    heart.textContent = "❤";
    heart.style.left = Math.random()*100 + "vw";
    heart.style.animationDuration = (5+Math.random()*4) + "s";
    heart.style.fontSize = (16+Math.random()*22) + "px";
    heartLayer.appendChild(heart);
    setTimeout(()=> heart.remove(), 10000);
  }, 400);
}

function launchFirework(){
  const colors = ["#ff5d8f","#f4c869","#b7a3d1","#ffffff"];
  const x = Math.random()*100, y = Math.random()*50 + 10;
  for(let i=0;i<16;i++){
    const p = document.createElement("div");
    p.className = "firework";
    p.style.left = x + "vw";
    p.style.top = y + "vh";
    p.style.background = colors[Math.floor(Math.random()*colors.length)];
    document.body.appendChild(p);
    const angle = (Math.PI*2*i)/16;
    const dist = 60 + Math.random()*40;
    p.animate([
      { transform: "translate(0,0)", opacity: 1 },
      { transform: `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px)`, opacity: 0 }
    ], { duration: 900, easing: "ease-out" });
    setTimeout(()=> p.remove(), 900);
  }
}
const fireworksStage = document.getElementById("fireworksStage");
if(fireworksStage){
  setInterval(launchFirework, 900);
}

const heartBtn = document.getElementById("heartBtn");
const popup = document.getElementById("popup");
if(heartBtn && popup){
  heartBtn.addEventListener("click", ()=>{
    popup.style.display = "flex";
  });
  popup.addEventListener("click", (e)=>{
    if(e.target === popup) popup.style.display = "none";
  });
}
