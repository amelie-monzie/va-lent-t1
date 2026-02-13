export const game4_finale = {
  render(root) {
    // MODIFICATION ICI : On ferme la section et le wrap AVANT de déclarer le memeScreen
    root.innerHTML = `
      <div class="wrap">
        <section class="card" style="padding:24px; text-align:center; position:relative; overflow:hidden;">
          
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

        </section> </div> <div id="memeScreen" class="meme-screen" aria-hidden="true">
        <div class="meme-card">
          <img
            id="memeImg"
            src="assets/img/memes/meme1.jpg"
            alt="meme"
            loading="eager"
            decoding="async"
            width="300"
            height="300"
          />
          <p style="margin:12px 0 0; font-weight:800; color: white !important; font-size: 1.2rem; text-shadow: 0 2px 4px black;">
            APRES C'EST PAS UNE COMPÈTE HEIN ! 
          </p>
          <p style="margin:6px 0 0; font-size:13px; color: #ddd !important; text-shadow: 0 1px 2px black;">
            (j'ai quand même un petit quelque chose pour toi, cliques sur le singe)
          </p>
        </div>
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

    // Rideau : s’ouvre automatiquement avec délai
    setTimeout(() => {
      document.querySelector(".curtain-left")?.classList.add("open");
      document.querySelector(".curtain-right")?.classList.add("open");
    }, 800);

    // Place initiale du OUI
    function moveYesRandom() {
      const stage = document.querySelector(".reward-stage");
      if (!stage) return;

      const rect = stage.getBoundingClientRect();
      const padding = 8;

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
      const base = 0.72;
      const add = Math.min(0.22, attempts * 0.04);
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

    function dodge() {
      if (finished) return;
      attempts += 1;
      taunt();
      growYes();
      moveYesRandom();
    }

    yes.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      dodge();
    });

    yes.addEventListener("mouseenter", dodge);

    // Clic sur NON
    no.addEventListener("click", () => {
      if (finished) return;
      finished = true;

      // Son
      laughSound.currentTime = 0;
      laughSound.play().catch(() => {});

      // Fade out du jeu
      document.querySelector(".reward-stage")?.classList.add("fade-out");
      hint.textContent = "";

      // Affichage du Meme
      memeScreen.classList.add("show");
      memeScreen.setAttribute("aria-hidden", "false");

      startLaughRain();

      // Gestion du clic sur le singe pour passer à la suite
      const memeImg = document.getElementById("memeImg");
      memeImg.style.cursor = "pointer";

      memeImg.addEventListener('click', () => {
        laughSound.pause();
        memeScreen.classList.remove("show");
        
        // Passage au jeu suivant
        setTimeout(() => {
          onSuccess();
        }, 300);
      }, { once: true });
    });

    // Init positions
    setTimeout(() => {
      moveYesRandom();
      growYes();
    }, 50);

    // Pluie de rires
    function startLaughRain() {
      const emojis = ["HAHA", "🤣", "😂", "mdr", "PTDR", "💀", "AHAHA"];
      const container = memeScreen;

      let count = 0;
      const max = 40;

      const interval = setInterval(() => {
        if (count >= max) {
          clearInterval(interval);
          return;
        }
        count++;

        const el = document.createElement("div");
        el.className = "laugh-float";
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        el.style.left = `${Math.floor(Math.random() * 90) + 5}%`;
        el.style.top = `${Math.floor(Math.random() * 80) + 10}%`;
        el.style.animationDuration = `${2.4 + Math.random() * 1.8}s`;
        el.style.transform = `rotate(${Math.floor(Math.random() * 20 - 10)}deg)`;

        container.appendChild(el);

        setTimeout(() => el.remove(), 4500);
      }, 90);
    }
  },

  unmount() {}
};