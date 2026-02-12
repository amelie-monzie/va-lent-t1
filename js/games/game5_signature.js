export const game5_signature = {
  render(root) {
    root.innerHTML = `
      <div class="wrap">
        <section class="card">
          <h1>Dernière étape !</h1>
          <p>Veuillez signer ci-dessous comme preuve de dépôt du colis.</p>

          <div class="signature-pad-wrap">
            <canvas id="sig-canvas" width="500" height="200"></canvas>
          </div>

          <p id="sigError" class="sig-error"></p>

          <button id="validateSigBtn" class="btn btn-primary" style="width:100%; margin-top:10px;">
            Valider la réception
          </button>
        </section>
      </div>
    `;
  },

  mount({ onSuccess }) {
    const canvas = document.getElementById('sig-canvas');
    const ctx = canvas.getContext('2d');
    const validateBtn = document.getElementById('validateSigBtn');
    const errorMsg = document.getElementById('sigError');

    let isDrawing = false;
    let attempts = 0;
    let hasDrawnSomething = false;

    // Configuration du style du trait
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1a0b03';

    // --- Fonctions de dessin (compatibles Souris & Tactile) ---

    // Fonction pour obtenir les coordonnées correctes (souris ou doigt)
    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      // Si c'est du tactile (touches), on prend le premier doigt, sinon c'est la souris
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      // On calcule la position relative au canvas et on met à l'échelle si le CSS l'a redimensionné
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    }

    function startDrawing(e) {
      if (e.touches && e.touches.length > 1) return; // Ignore le multi-touch
      isDrawing = true;
      hasDrawnSomething = true;
      const coords = getCoords(e);
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      // Empêche le scroll sur mobile
      e.preventDefault(); 
    }

    function draw(e) {
      if (!isDrawing) return;
      const coords = getCoords(e);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
      e.preventDefault();
    }

    function stopDrawing() {
      isDrawing = false;
      ctx.closePath();
    }

    // Listeners Souris
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Listeners Tactile (Mobile)
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);


    // --- Validation avec troll ---
    validateBtn.addEventListener('click', () => {
      if (!hasDrawnSomething) {
        errorMsg.textContent = "Il faut signer avant de valider !";
        errorMsg.style.color = "var(--primary)";
        return;
      }

      attempts++;

      if (attempts === 1) {
        // Premier essai : on se moque
        errorMsg.textContent = "Veuillez faire un effort, la réception par un enfant mineur n'est pas autorisée.";
        errorMsg.style.color = "#d32f2f";
        
        // Optionnel : effacer le canvas pour forcer à recommencer
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hasDrawnSomething = false;
        validateBtn.textContent = "Réessayer (sérieusement)";
      } else {
        // Deuxième essai : c'est gagné
        validateBtn.disabled = true;
        validateBtn.textContent = "Validation en cours...";
        errorMsg.textContent = "";
        
        setTimeout(() => {
           onSuccess(); // Passe à Game 6
        }, 800);
      }
    });
  },

  unmount() {}
};