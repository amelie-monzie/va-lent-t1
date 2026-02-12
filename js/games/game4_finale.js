export const game4_finale = {
  render(root) {
    root.innerHTML = `
      <div class="wrap">
        <section class="card" style="padding:24px; text-align:center; position:relative; overflow:hidden;">
          
          <!-- Rideaux -->
          <div class="curtain curtain-left"></div>
          <div class="curtain curtain-right"></div>

          <h1 style="margin:0 0 8px;">Est-ce que tu veux recevoir ta récompense?</h1>
          <p style="margin:0 0 18px; color:var(--muted);">
            Après je sais pas si tu le mérites
          </p>

          <div class="reward-stage">
            <button id="yesBtn" class="btn yes-trap" type="button">Oui</button>
            <button id="noBtn" class="btn no-btn" type="button">Non</button>
          </div>

          <p id="hint" style="margin-top:14px; min-height:22px; color:var(--muted); font-size:13px;"></p>

          <!-- Écran MEME -->
          <div id="memeScreen" class="meme-screen" aria-hidden="true">
            <div class="meme-card">
              <img
                id="memeImg"
                src="assets/img/memes/meme1.jpg"
                alt="meme"
                loading="eager"
                decoding="async"
              />
              <p style="margin:12px 0 0; font-weight:800;">
                APRES C'EST PAS UNE COMPÈTE HEIN ! 
              </p>
              <p style="margin:6px 0 0; color:var(--muted); font-size:13px;">
                (j'ai quand même un petit quelque chose pour toi, cliques sur le singe)
              </p>
            </div>
          </div>

        </section>
      </div>
    `;
  },

  mount({ onSuccess }) {
    const laughSound = new Audio("assets/sfx/laugh.mp3");
laughSound.volume = 0.9;

    const yes = document.getElementById("yesBtn");
    const no = document.getElementById("noBtn");
    const hint = document.getElementById("hint");
    const memeScreen = document.getElementById("memeScreen");

    let finished = false;
    let attempts = 0;

    // Rideau : s’ouvre automatiquement
    // NOUVEAU CODE (avec petit délai de 800ms)
setTimeout(() => {
  document.querySelector(".curtain-left")?.classList.add("open");
  document.querySelector(".curtain-right")?.classList.add("open");
}, 800);

    // Place initiale du OUI (petit)
    // On le met en "position: absolute" dans reward-stage (CSS)
    function moveYesRandom() {
      const stage = document.querySelector(".reward-stage");
      if (!stage) return;

      const rect = stage.getBoundingClientRect();
      // On limite pour rester dans la zone visible
      const padding = 8;

      // Taille actuelle du bouton
      const bw = yes.offsetWidth;
      const bh = yes.offsetHeight;

      const maxX = Math.max(padding, rect.width - bw - padding);
      const maxY = Math.max(padding, rect.height - bh - padding);

      const x = Math.floor(Math.random() * maxX);
      const y = Math.floor(Math.random() * maxY);

      yes.style.left = `${x}px`;
      yes.style.top = `${y}px`;
    }

    function growYes() {
      // Grandit progressivement, jusqu’à un max
      const base = 0.72;              // départ petit
      const add = Math.min(0.22, attempts * 0.04); // +4% par tentative, capped
      const scale = Math.min(1.15, base + add);
      yes.style.transform = `scale(${scale})`;
    }

    function taunt() {
      const lines = [
        "Tu as vraiment essayé 😭",
        "Le bouton OUI est timide…",
        "Presque… (non)",
        "Tu veux la récompense hein 👀",
        "OK j’avoue c’est drôle.",
        "En vrai garde la force",
        "Après c'est pas une compète hein"
      ];
      hint.textContent = lines[Math.min(lines.length - 1, attempts)];
    }

    // Rend le bouton Oui “incli­quable” : il fuit dès qu’on approche / touche
    function dodge() {
      if (finished) return;
      attempts += 1;
      taunt();
      growYes();
      moveYesRandom();
    }

    // Important mobile: pointerdown capte avant click
    yes.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      dodge();
    });

    // Aussi si souris passe dessus (desktop)
    yes.addEventListener("mouseenter", dodge);

    // NO : déclenche la “punition meme”
    
    no.addEventListener("click", () => {
  if (finished) return;
  finished = true;

  // 🔊 Joue le son UNE FOIS
  laughSound.currentTime = 0;
  laughSound.play().catch(() => {});

  document.querySelector(".reward-stage")?.classList.add("fade-out");
  hint.textContent = "";

  memeScreen.classList.add("show");
  memeScreen.setAttribute("aria-hidden", "false");

  startLaughRain();
  const memeImg = document.getElementById("memeImg");
      // On indique que c'est cliquable
      memeImg.style.cursor = "pointer"; 
      
      // Quand on clique sur le singe
      memeImg.addEventListener('click', () => {
          // On coupe le rire s'il tourne encore
          laughSound.pause();
          
          // On cache l'écran mème
          memeScreen.classList.remove("show");
          
          // IMPORTANT : On passe au jeu suivant (Game 5)
          // On suppose que ton système utilise onSuccess pour changer de jeu
          setTimeout(() => {
               onSuccess(); 
          }, 300);
      }, { once: true }); // {once:true} pour s'assurer qu'on ne clique qu'une fois

      // ----------------------------------
    });



    // Position initiale du oui
    // On attend un tick pour que le layout soit calculé
    setTimeout(() => {
      moveYesRandom();
      growYes();
    }, 50);

    // --- Laugh effects ---
    function startLaughRain() {
      const emojis = ["HAHA", "🤣", "😂", "mdr", "PTDR", "💀", "AHAHA"];
      const container = memeScreen;

      let count = 0;
      const max = 40; // densité

      const interval = setInterval(() => {
        if (count >= max) {
          clearInterval(interval);
          return;
        }
        count++;

        const el = document.createElement("div");
        el.className = "laugh-float";
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        // random start
        el.style.left = `${Math.floor(Math.random() * 90) + 5}%`;
        el.style.top = `${Math.floor(Math.random() * 80) + 10}%`;
        el.style.animationDuration = `${2.4 + Math.random() * 1.8}s`;
        el.style.transform = `rotate(${Math.floor(Math.random()*20 - 10)}deg)`;

        container.appendChild(el);

        // remove later
        setTimeout(() => el.remove(), 4500);
      }, 90);
    }
  },

  unmount() {}
};
