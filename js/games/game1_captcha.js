function shuffle(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

// chemins images (PNG OK)
const YOU = [
  "assets/img/you/you1.png",
  "assets/img/you/you2.png",
  "assets/img/you/you3.png",
  "assets/img/you/you4.png",
];

const DECOYS = [
  "assets/img/decoys/no1.png",
  "assets/img/decoys/no2.png",
  "assets/img/decoys/no3.png",
  "assets/img/decoys/no4.png",
  "assets/img/decoys/no5.png",
];

// stickers
const STICKER_GOOD = "assets/img/stickers/check.png";
const STICKER_BAD  = "assets/img/stickers/poop.png";

export const game1_captcha = {
  render(root){
    root.innerHTML = `
      <div class="wrap">
        <section class="card" style="padding:18px;">
          <div class="captcha-panel">
            <div class="captcha-header">
              <div class="small">Nous devons nous débarasser des gens réels, élimine les</div>
              <div class="title">PAS IA</div>
              <div class="hint">Coche les bonnes réponses pour passer au jeu suivant</div>
            </div>

            <div class="captcha-grid" id="grid"></div>

            <div class="captcha-footer">
              <div class="footer-icons">
                <div class="iconbtn" id="refreshBtn" title="refresh">↻</div>
                <div class="iconbtn" title="audio">🔊</div>
                <div class="iconbtn" title="info">i</div>
              </div>

              <div id="status" style="font-size:12px; opacity:.75;"></div>

              <button class="verify" id="verifyBtn" disabled type="button">VERIFY</button>
            </div>
          </div>

          <p style="margin-top:14px; color:var(--muted); font-size:13px;">
            un peu mégalo sorry...
          </p>
        </section>
      </div>
    `;
  },

  mount({ onSuccess }){
    const grid = document.getElementById("grid");
    const verifyBtn = document.getElementById("verifyBtn");
    const status = document.getElementById("status");
    const refreshBtn = document.getElementById("refreshBtn");

    let finished = false;

    // Grille 3x3 : 4 YOU + 5 DECOYS (fixe)
    const picksYou = shuffle(YOU).slice(0, 4);
    const picksDecoys = shuffle(DECOYS).slice(0, 5);

    const tiles = shuffle([
      ...picksYou.map(src => ({ src, isYou:true })),
      ...picksDecoys.map(src => ({ src, isYou:false })),
    ]);

    // état par tile : "neutral" | "good" | "bad"
    const state = new Array(tiles.length).fill("neutral");

    const requiredYouIdx = tiles
      .map((t, i) => t.isYou ? i : null)
      .filter(i => i !== null);

    function getProgress(){
      const goodCount = requiredYouIdx.filter(i => state[i] === "good").length;
      const hasAnyBad = tiles.some((t, i) => !t.isYou && state[i] === "bad");
      return { goodCount, total: requiredYouIdx.length, hasAnyBad };
    }

    function isSolved(){
      const { goodCount, total, hasAnyBad } = getProgress();
      return goodCount === total && !hasAnyBad;
    }

    function updateUI(){
      const { goodCount, total, hasAnyBad } = getProgress();
      status.textContent = hasAnyBad
        ? `⚠️ ${goodCount}/${total} (enlève les 💩)`
        : `${goodCount}/${total}`;

      verifyBtn.disabled = !isSolved() || finished;
    }

    function finishSuccess(){
        console.log("CAPTCHA SOLVED -> calling onSuccess()");
      if (finished) return;
      finished = true;

      // bloque les clics
      grid.querySelectorAll("button.tile").forEach(b => (b.disabled = true));

      verifyBtn.disabled = true;
      verifyBtn.textContent = "OK ✅";

      setTimeout(() => onSuccess(), 450);
    }

    // build UI tiles (une seule fois)
    tiles.forEach((t, idx) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "tile";
      el.innerHTML = `
        <img src="${t.src}" alt="tile ${idx+1}" loading="lazy" decoding="async">
        <img class="sticker good" src="${STICKER_GOOD}" alt="" aria-hidden="true">
        <img class="sticker bad"  src="${STICKER_BAD}"  alt="" aria-hidden="true">
      `;

      el.addEventListener("click", () => {
        if (finished) return;

        // toggle : neutral <-> good/bad
        if(state[idx] === "neutral"){
          state[idx] = t.isYou ? "good" : "bad";
        } else {
          state[idx] = "neutral";
        }

        el.classList.remove("good", "bad");
        if(state[idx] === "good") el.classList.add("good");
        if(state[idx] === "bad")  el.classList.add("bad");

        updateUI();

        // OPTION A (recommandé) : passage automatique dès que c'est bon
        if (isSolved()) finishSuccess();

        // OPTION B : si tu préfères passer seulement en cliquant VERIFY,
        // commente la ligne ci-dessus et laisse uniquement le bouton VERIFY déclencher finishSuccess()
      });

      grid.appendChild(el);
    });

    // VERIFY : déclenche la fin si solved
    verifyBtn.addEventListener("click", () => {
      if (finished) return;
      if (isSolved()) finishSuccess();
    });

    // Refresh: on bloque (sinon ça donne l’impression de “reset”)
    // Si tu veux le garder, on peut faire un vrai reset volontaire, mais là tu avais dit 1 seule page.
    refreshBtn.addEventListener("click", () => {
      // on ne fait rien exprès (anti confusion)
    });

    updateUI();
  },

  unmount(){}
};
