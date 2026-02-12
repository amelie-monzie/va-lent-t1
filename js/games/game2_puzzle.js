function shuffle(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

// ⚠️ Mets TON image ici (doit exister)
// Exemple: "assets/img/puzzle/heart.png"
const IMAGE = "assets/img/puzzle/puzzle.png";

const SIZE = 3;              // 3x3
const N = SIZE * SIZE;       // 9

function idxToRC(i){ return [Math.floor(i / SIZE), i % SIZE]; }
function rcToIdx(r,c){ return r*SIZE + c; }

function isAdjacent(i, j){
  const [r1,c1] = idxToRC(i);
  const [r2,c2] = idxToRC(j);
  const dr = Math.abs(r1-r2);
  const dc = Math.abs(c1-c2);
  return (dr + dc) === 1;
}

function isSolved(board){
  // board = [0..7, null] en ordre
  for(let i=0;i<N-1;i++){
    if(board[i] !== i) return false;
  }
  return board[N-1] === null;
}

// Inversions pour tester solvabilité (taquin 3x3 : solvable si inversions paires)
function inversionCount(board){
  const arr = board.filter(v => v !== null);
  let inv = 0;
  for(let i=0;i<arr.length;i++){
    for(let j=i+1;j<arr.length;j++){
      if(arr[i] > arr[j]) inv++;
    }
  }
  return inv;
}

function randomSolvableBoard(){
  // pièces 0..7 + null
  while(true){
    const base = [...Array(N-1).keys(), null]; // [0..7,null]
    const b = shuffle(base);

    // évite l’état déjà résolu direct
    if(isSolved(b)) continue;

    // 3x3 => solvable <=> inversions paires
    if(inversionCount(b) % 2 === 0) return b;
  }
}

export const game2_puzzle = {
  render(root){
    root.innerHTML = `
      <div class="wrap">
        <section class="card" style="padding:28px;">
          <h1 style="margin-bottom:6px;">Reconstitue mon cœur 🧩</h1>
          <p style="opacity:.8; margin-top:0;">Fais glisser les pièces dans le vide.</p>

          <div class="sliding-wrap">
            <div class="sliding-grid" id="puzzle"></div>
          </div>

          <div style="display:flex; gap:12px; justify-content:center; margin-top:18px; flex-wrap:wrap;">
            <button class="btn secondary" id="shuffleBtn" type="button">Remélanger</button>
          </div>

          <p style="margin-top:14px; color:var(--muted); font-size:13px; text-align:center;">
            Indice : ce n’est pas un swap 😈
          </p>
        </section>
      </div>
    `;
  },

  mount({ onSuccess }){
    const grid = document.getElementById("puzzle");
    const shuffleBtn = document.getElementById("shuffleBtn");

    let finished = false;
    let board = randomSolvableBoard(); // longueur 9, avec null = case vide

    function render(){
      grid.innerHTML = "";

      const tileSize = 100; // utilisé seulement pour background-size (CSS gère le reste)
      // On construit 9 cases
      for(let pos=0; pos<N; pos++){
        const val = board[pos]; // 0..7 ou null

        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "sliding-cell";
        cell.setAttribute("aria-label", val === null ? "vide" : `pièce ${val+1}`);

        if(val === null){
          cell.classList.add("empty");
          cell.disabled = true;
        } else {
          // place l'image en background, avec crop par tuile
          const [r, c] = idxToRC(val); // IMPORTANT : val donne la "bonne" position de l'image
          cell.style.backgroundImage = `url(${IMAGE})`;
          cell.style.backgroundSize = `${SIZE*100}% ${SIZE*100}%`;
          cell.style.backgroundPosition = `${(c/(SIZE-1))*100}% ${(r/(SIZE-1))*100}%`;

          cell.addEventListener("click", () => {
            if(finished) return;

            const emptyPos = board.indexOf(null);
            if(!isAdjacent(pos, emptyPos)) return;

            // swap avec vide (glisse)
            [board[pos], board[emptyPos]] = [board[emptyPos], board[pos]];
            render();

            if (isSolved(board) && !finished) {
  finished = true;
  setTimeout(() => onSuccess(), 450);
}
          });
        }

        grid.appendChild(cell);
      }
    }

    shuffleBtn.addEventListener("click", () => {
      if(finished) return;
      board = randomSolvableBoard();
      render();
    });

    render();
  },

  unmount(){}
};
