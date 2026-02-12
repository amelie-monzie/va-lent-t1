function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ⚠️ Assure-toi que ton image de puzzle est bien ici
const IMAGE = "assets/img/puzzle/puzzle.png";

const SIZE = 3; // 3x3
const N = SIZE * SIZE; // 9

function idxToRC(i) {
  return [Math.floor(i / SIZE), i % SIZE];
}

function rcToIdx(r, c) {
  return r * SIZE + c;
}

function isAdjacent(i, j) {
  const [r1, c1] = idxToRC(i);
  const [r2, c2] = idxToRC(j);
  const dr = Math.abs(r1 - r2);
  const dc = Math.abs(c1 - c2);
  return (dr + dc) === 1;
}

function isSolved(board) {
  // board = [0..7, null] en ordre
  for (let i = 0; i < N - 1; i++) {
    if (board[i] !== i) return false;
  }
  return board[N - 1] === null;
}

// Inversions pour tester solvabilité
function inversionCount(board) {
  const arr = board.filter((v) => v !== null);
  let inv = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) inv++;
    }
  }
  return inv;
}

function randomSolvableBoard() {
  while (true) {
    const base = [...Array(N - 1).keys(), null]; // [0..7,null]
    const b = shuffle(base);

    if (isSolved(b)) continue;

    if (inversionCount(b) % 2 === 0) return b;
  }
}

export const game2_puzzle = {
  render(root) {
    root.innerHTML = `
      <div class="wrap">
        <section class="card" style="padding:28px;">
          <h1 style="margin-bottom:6px;">🧩</h1>
          <p style="opacity:.8; margin-top:0;">Fais glisser les pièces dans le vide.</p>

          <div class="sliding-wrap">
            <div class="sliding-grid" id="puzzle"></div>
          </div>

          <div style="display:flex; gap:12px; justify-content:center; align-items:center; margin-top:18px; flex-wrap:wrap;">
            
            <button class="btn secondary" id="shuffleBtn" type="button">On mélange on mélange</button>
            
            <img 
              src="assets/img/memes/kaaris.png" 
              alt="Meme Kaaris" 
              style="height: 50px; width: auto; border-radius: 6px; transform: rotate(8deg); box-shadow: 0 4px 10px rgba(0,0,0,0.3);"
            />

          </div>

          <p style="margin-top:14px; color:var(--muted); font-size:13px; text-align:center;">
            Mon meilleur: 18s (après c'est pas une compète)
          </p>
        </section>
      </div>
    `;
  },

  mount({ onSuccess }) {
    const grid = document.getElementById("puzzle");
    const shuffleBtn = document.getElementById("shuffleBtn");

    let finished = false;
    let board = randomSolvableBoard();

    function render() {
      grid.innerHTML = "";

      for (let pos = 0; pos < N; pos++) {
        const val = board[pos];

        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "sliding-cell";
        cell.setAttribute("aria-label", val === null ? "vide" : `pièce ${val + 1}`);

        if (val === null) {
          cell.classList.add("empty");
          cell.disabled = true;
        } else {
          const [r, c] = idxToRC(val);
          // ⚠️ Assure-toi que "IMAGE" pointe vers ton image de puzzle
          cell.style.backgroundImage = `url(${IMAGE})`;
          cell.style.backgroundSize = `${SIZE * 100}% ${SIZE * 100}%`;
          cell.style.backgroundPosition = `${(c / (SIZE - 1)) * 100}% ${(r / (SIZE - 1)) * 100}%`;

          cell.addEventListener("click", () => {
            if (finished) return;

            const emptyPos = board.indexOf(null);
            if (!isAdjacent(pos, emptyPos)) return;

            [board[pos], board[emptyPos]] = [board[emptyPos], board[pos]];
            render(); // Correction ici : il manquait l'appel à render() dans ton snippet original pour rafraîchir

            // Vérification victoire
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
      if (finished) return;
      board = randomSolvableBoard();
      render();
    });

    render();
  },

  unmount() {}
};