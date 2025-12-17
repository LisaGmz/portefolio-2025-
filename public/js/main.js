document.addEventListener("DOMContentLoaded", () => {
  // ===== GSAP =====
  gsap.registerPlugin(ScrollTrigger);

  // ===== Navbar : verre flouté au scroll =====
  const navbar = document.querySelector(".navbar");
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // ===== HERO : parallax & entrée douce =====
  const hero    = document.querySelector(".hero");
  const heroImg = document.querySelector(".hero .color-layer");
  const bwLayer = document.querySelector(".hero .bw-layer");

  gsap.from(".hero .container > *", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: "power3.out"
  });

  if (hero && heroImg) {
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;

      gsap.to(heroImg, { x: x * 20, y: y * 20, scale: 1.05, duration: 0.8, ease: "power3.out" });
      if (bwLayer) gsap.to(bwLayer, { x: x * 10, y: y * 10, duration: 0.8, ease: "power3.out" });
    });

    hero.addEventListener("mouseleave", () => {
      gsap.to([heroImg, bwLayer], { x: 0, y: 0, scale: 1, duration: 1, ease: "power3.out" });
    });
  }

  if (bwLayer && hero) {
    const base = 8;
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      const norm = (e.clientX - r.left) / r.width - 0.5;
      const speed = gsap.utils.mapRange(0, 0.5, base * 1.2, base * 0.4, Math.abs(norm));
      bwLayer.style.animationDuration = `${speed.toFixed(2)}s`;
      bwLayer.style.animationDirection = norm < 0 ? "reverse" : "normal";
    });

    hero.addEventListener("mouseleave", () => {
      bwLayer.style.animationDuration = `${base}s`;
      bwLayer.style.animationDirection = "normal";
    });
  }

  // ===== Accordéon Projets =====
const galleries = Array.from(document.querySelectorAll(".accordion-gallery"));

function getSizes() {
  if (window.innerWidth <= 600)  return { collapsed: 90,  expanded: 300 };
  if (window.innerWidth <= 992)  return { collapsed: 100, expanded: 360 };
  return { collapsed: 140, expanded: 440 };
}

galleries.forEach((gallery) => {
  const panels = Array.from(gallery.querySelectorAll(".panel"));
  if (!panels.length) return;

  function expandPanel(target) {
    const { collapsed, expanded } = getSizes();

    panels.forEach((p) => {
      const active = p === target;
      p.classList.toggle("active", active);
      p.setAttribute("aria-expanded", active ? "true" : "false");

      gsap.to(p, {
        duration: 0.7,
        ease: "elastic.out(1, 0.6)",
        "--w": (active ? expanded : collapsed) + "px"
      });

      const info = p.querySelector(".panel-info");
      if (!info) return;

      gsap.to(info, {
        duration: active ? 0.35 : 0.25,
        opacity: active ? 1 : 0,
        y: active ? 0 : 10,
        ease: "power2.out",
        delay: active ? 0.05 : 0
      });

      info.setAttribute("aria-hidden", active ? "false" : "true");
    });
  }


  expandPanel(panels[0]);

 
  panels.forEach((p) => {
    p.addEventListener("click", () => expandPanel(p));
    p.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        expandPanel(p);
      }
    });
  });


  let resizeTO;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTO);
    resizeTO = setTimeout(() => {
      const active = gallery.querySelector(".panel.active") || panels[0];
      expandPanel(active);
    }, 120);
  });


  gsap.from(panels, {
    opacity: 0,
    y: 30,
    duration: 0.7,
    stagger: 0.12,
    ease: "power2.out",
    scrollTrigger: {
      trigger: gallery,
      start: "top 85%"
    }
  });
});


  // ===== Onglets internes (À propos / Compétences / Formations) =====
  const menuItems   = document.querySelectorAll(".about-menu li");
  const aboutPanels = document.querySelectorAll(".about-panel");
  const aboutPhoto  = document.querySelector(".about-photo");

  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      menuItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      const target = item.dataset.target;
      aboutPanels.forEach(panel => {
        panel.classList.toggle("active", panel.id === target);
      });

      if (target === "about-content") {
        aboutPhoto?.classList.remove("hidden");
      } else {
        aboutPhoto?.classList.add("hidden");
      }
    });
  });

// ===== Animation photo =====
(function () {
  const aboutSection = document.querySelector("#about");
  if (!aboutSection) return;

  const photo = aboutSection.querySelector(".photo.fade-trigger");
  const paragraphs = gsap.utils.toArray("#about .about-text p");

  if (!photo || paragraphs.length === 0) return;


  gsap.set(photo, { opacity: 0, y: 20 });
  gsap.set(paragraphs, { opacity: 0, y: 20 });

  gsap.timeline({
    scrollTrigger: {
      trigger: aboutSection.querySelector(".about-text"),
      start: "top 75%",
      toggleActions: "play none none none",
      once: true
    }
  })
    .to(photo, {
      opacity: 1,
      y: 0,
      duration: 0.6,        
      ease: "power2.out"    
    })
    .to(paragraphs, {
      opacity: 1,
      y: 0,
      duration: 0.6,        
      stagger: 0.18,        
      ease: "power2.out"
    }, "-=0.3");             
})();



// ===== COMPÉTENCES =====
(function () {
  const section = document.querySelector('#skills-content');
  if (!section) return;

  const cards = Array.from(section.querySelectorAll('.skill-card'));

 
  function openCard(card) {
    const content = card.querySelector('.skill-content');
    if (!content) return;

    if (card.classList.contains('active')) return;

    content.style.height = content.scrollHeight + 'px';
    card.classList.add('active');

    const onEnd = (ev) => {
      if (ev.propertyName === 'height') {
        content.style.height = 'auto';
        content.removeEventListener('transitionend', onEnd);
      }
    };
    content.addEventListener('transitionend', onEnd);
  }


  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
        
          cards.forEach((card, index) => {
            setTimeout(() => {
              openCard(card);
            }, index * 150); 
          });

          
          observer.disconnect();
        }
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(section);
})();


 // ===== Light Lashes =====
document.querySelectorAll('#lightlashes-board .ll-card').forEach(card => {
  const img = card.querySelector('img');
  if (!img) return;
  const absUrl = img.currentSrc || img.src;   // ← URL absolue
  card.style.setProperty('--bg', `url("${absUrl}")`);
});


// ===== Mairie =====
document.querySelectorAll('.mairie-collage .collage-item').forEach(card => {
  const img = card.querySelector('img');
  if (!img) return;
  const absUrl = img.currentSrc || img.src; 
  card.style.setProperty('--bg', `url("${absUrl}")`);
});



// ----- Switcher -----
(function(){
  document.querySelectorAll('.phone-showcase').forEach(section => {
    const buttons = section.querySelectorAll('.phone-switcher .switcher-btn');
    if (!buttons.length) return;


    const curVariant = section.getAttribute('data-variant') || 'turquoise';
    buttons.forEach(b => {
      const active = b.dataset.variant === curVariant;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });

   
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const variant = btn.dataset.variant;
        if (!variant) return;

        section.setAttribute('data-variant', variant);

        buttons.forEach(b => {
          const isActive = (b === btn);
          b.classList.toggle('is-active', isActive);
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        section.querySelectorAll('.phone-set').forEach(set => {
          const isTarget = set.dataset.variant === variant;
          const video = set.querySelector('.inlei-video');
          const vc    = set.querySelector('.video-container');
          const play  = set.querySelector('.video-play-btn');
          if (!isTarget && video) {
            if (!video.paused) video.pause();
            vc?.classList.remove('playing');
            if (play) { play.classList.remove('hidden'); play.style.opacity=''; play.style.pointerEvents=''; }
          }
        });
      });
    });
  });
})();

// ===== VIDÉOS : =====
(function(){
  document.querySelectorAll('.video-container').forEach(container => {
  
    if (container.dataset.bound === '1') return;
    container.dataset.bound = '1';

    const video = container.querySelector('video');
    if (!video) return;

  
    let btn = container.querySelector('.video-play-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'video-play-btn';
      btn.setAttribute('aria-label', 'Lire la vidéo');
      btn.textContent = '▶';
      container.appendChild(btn);
    }

    // helpers UI
    function showBtn(){
      container.classList.remove('playing');
      btn.classList.remove('hidden');
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    }
    function hideBtn(){
      container.classList.add('playing');
      btn.classList.add('hidden');
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
    }

    // --- NEW helpers robustes ---
    function ensureMetadata(v){
      return new Promise(resolve => {
        if (v.readyState >= 1 && Number.isFinite(v.duration)) return resolve();
        v.addEventListener('loadedmetadata', resolve, { once:true });
      });
    }
    function resetToStart(v){
      return new Promise(async resolve => {
        try { v.pause(); } catch(e){}
        await ensureMetadata(v);
        try {
          v.currentTime = 0;                 
          if (v.seeking) v.addEventListener('seeked', resolve, { once:true });
          else requestAnimationFrame(resolve);
        } catch(e) {
          try { v.load(); } catch(_) {}      
          requestAnimationFrame(resolve);
        }
      });
    }
    function isEnded(v){
      return v.ended || (Number.isFinite(v.duration) && v.currentTime >= v.duration - 0.03);
    }

    async function tryPlay(){
      try{
        await ensureMetadata(video);
        if (isEnded(video)) {
          await resetToStart(video);         
        }
        video.muted = true;                   
        video.removeAttribute('controls');    
        await video.play();
        hideBtn();
      }catch(err){
        video.setAttribute('controls','controls'); 
        showBtn();
      }
    }

    // interactions
    btn.addEventListener('click', tryPlay);
    video.addEventListener('click', () => {
      if (video.paused) tryPlay();
      else { video.pause(); showBtn(); }
    });

   
    video.addEventListener('playing', hideBtn);
    video.addEventListener('pause',   showBtn);

  
    video.addEventListener('ended', async () => {
      await resetToStart(video);
      video.removeAttribute('controls');
      showBtn();
    });
  });
})();

// Switch Recto/Verso
document.querySelectorAll('.flyer-scope .flyer-card').forEach(card => {
  const sw = card.querySelector('.flyer-switch');
  if (!sw) return;

  const setFace = (toBack) => {
    sw.setAttribute('aria-checked', toBack ? 'true' : 'false');
    card.dataset.face = toBack ? 'back' : 'front';
  };

  sw.addEventListener('click', () => {
    const on = sw.getAttribute('aria-checked') === 'true';
    setFace(!on);
  });

  sw.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); sw.click(); }
  });
});



// === FLYERS — initialise
document.querySelectorAll('.flyer-scope .flyer-card').forEach(card => {
  const front = card.querySelector('.flyer-img.front');
  const back  = card.querySelector('.flyer-img.back');


  const f = front ? (front.currentSrc || front.src) : null;
  const b = back  ? (back.currentSrc  || back.src)  : null;

  if (f) card.style.setProperty('--bg-front', `url("${f}")`);

  card.style.setProperty('--bg-back', b ? `url("${b}")` : `url("${f}")`);
});
















// ===== SIDE NAV : état actif au clic =====





/* =========================
   SIDE NAV - ScrollSpy
   ========================= */
(() => {
  const navLinks = Array.from(document.querySelectorAll('.side-nav-fixed a.side-nav-link'));
  if (!navLinks.length) return;

  function resolveObservedElement(hash) {
    const el = document.querySelector(hash);
    if (!el) return null;

    // Si l'ancre est minuscule (ex: <div id="project-1"></div>), observer le bloc suivant
    const r = el.getBoundingClientRect();
    if (r.height < 8) return el.nextElementSibling || el.closest('section') || el;

    return el;
  }

  const targets = navLinks
    .map(a => {
      const hash = a.getAttribute('href')?.trim();
      if (!hash || !hash.startsWith('#')) return null;
      const observed = resolveObservedElement(hash);
      return observed ? { hash, observed } : null;
    })
    .filter(Boolean);

  const setActive = (hash) => {
    navLinks.forEach(a => {
      const active = a.getAttribute('href') === hash;
      a.classList.toggle('is-active', active);
      a.classList.toggle('side-nav-item--primary', active);
      if (active) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  };

 
  setActive('#about');

 
  navLinks.forEach(a => {
    a.addEventListener('click', () => {
      const hash = a.getAttribute('href');
      if (hash?.startsWith('#')) setActive(hash);
    });
  });

  
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    const match = targets.find(t => t.observed === visible.target);
    if (match) setActive(match.hash);
  }, {
    threshold: [0.2, 0.35, 0.5, 0.65],
    rootMargin: '-30% 0px -55% 0px',
  });

  targets.forEach(t => observer.observe(t.observed));
})();










    // ===== VIDÉOS PROJETS PERSO=====
(function () {
  const videos = document.querySelectorAll(".auto-hide-controls");
  if (!videos.length) return;

  videos.forEach((video) => {
    const frame = video.closest(".video-frame") || video.parentElement;
    if (!frame) return;

  
    if (getComputedStyle(frame).position === "static") {
      frame.style.position = "relative";
    }

  
    video.volume = 0;
    video.muted  = true;

    video.addEventListener("play", () => {
      if (video.muted) {
        video.muted  = false;
        video.volume = 0.005;
      }
    }, { once: true });


    const btn = document.createElement("button");
    btn.className = "speed-btn";
    btn.textContent = "x1";
    frame.appendChild(btn);

    const speeds = [1, 2, 5, 10];
    let index = 0;

    btn.addEventListener("click", (e) => {
      e.stopPropagation(); 
      e.preventDefault();

      index = (index + 1) % speeds.length;
      const rate = speeds[index];
      video.playbackRate = rate;
      btn.textContent = "x" + rate;
    });

    // ----- Affichage(controles + bouton) -----

    function showUI() {
      if (!video.paused) {
        video.setAttribute("controls", "");
        btn.style.opacity = "1";
        btn.style.pointerEvents = "auto";
      }
    }

    function hideUI() {
      video.removeAttribute("controls");
      btn.style.opacity = "0";
      btn.style.pointerEvents = "none";
    }

 
    hideUI();

 
    frame.addEventListener("mouseenter", () => {
      showUI();
    });

    frame.addEventListener("mouseleave", () => {
      hideUI();
    });

    video.addEventListener("play", () => {
      if (frame.matches(":hover")) {
        showUI();
      }
    });

 
    video.addEventListener("pause", () => {
      hideUI();
    });

    video.addEventListener("ended", () => {
      video.currentTime = 0;
      hideUI();
    });

    video.style.cursor = "pointer";
    video.addEventListener("click", (e) => {
   
      e.preventDefault();
      e.stopPropagation();

      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  });
})();







  document.querySelectorAll(".auto-hide-controls").forEach(video => {
    video.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  });




function desiredPPVolume() {
  const w = window.innerWidth;
  return (w >= 900 && w <= 1599) ? 0.8 : 0.4;
}

function applyPPVolume(video) {
 
  if (video.muted) return;

  const target = desiredPPVolume();


  if (video.dataset.userVolume === "1") return;

  video.volume = target;
}

function wirePersonalProjectsVideos() {
  const videos = document.querySelectorAll("#personal-projects video");

  videos.forEach(video => {
    
    applyPPVolume(video);

    
    video.addEventListener("loadedmetadata", () => applyPPVolume(video));

    video.addEventListener("play", () => applyPPVolume(video));

   
    video.addEventListener("volumechange", () => {
     
      const target = desiredPPVolume();
      if (Math.abs(video.volume - target) > 0.02) {
        video.dataset.userVolume = "1";
      }
    });
  });
}


let ppResizeTimer = null;
function onPPResize() {
  clearTimeout(ppResizeTimer);
  ppResizeTimer = setTimeout(() => {
    document.querySelectorAll("#personal-projects video").forEach(v => applyPPVolume(v));
  }, 150);
}

window.addEventListener("load", wirePersonalProjectsVideos);
window.addEventListener("resize", onPPResize);


window.addEventListener("pointerdown", () => {
  document.querySelectorAll("#personal-projects video").forEach(v => applyPPVolume(v));
}, { once: true });















document.querySelectorAll('#personal-projects video').forEach(video => {
  const frame = video.closest('.video-frame');
  if (!frame) return;

  video.addEventListener('play', () => {
    frame.classList.add('is-playing');
  });

  video.addEventListener('pause', () => {
    frame.classList.remove('is-playing');
  });

  video.addEventListener('ended', () => {
    frame.classList.remove('is-playing');
  });
});













 

















});
