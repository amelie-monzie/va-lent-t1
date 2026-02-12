export const game6_finale_bouquet = {
  render(root) {
    root.innerHTML = `
      <div class="wrap" style="overflow:hidden;"> <section class="card final-stage" style="border:none; background:transparent; box-shadow:none;">
          
          <h1 style="font-size:36px; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">
            Joyeuse Saint-Valentin <3
          </h1>

          <h2 style="font-size:24px; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">
            (si tu veux bien être mon Valentin ofc :)
          </h2>

          <img
            src="assets/img/bouquet.png"
            alt="Gros bouquet de fleurs"
            class="bouquet-img"
          />

          <p style="margin-top:24px; font-weight:800; font-size:18px; color:white;">
            (des bisous et passe une belle journée)
          </p>

        </section>
      </div>
    `;
  },

  mount() {
    // 1. Son
    const fireworksSound = new Audio("assets/sfx/fireworks.mp3");
    fireworksSound.volume = 0.8;
    // On attend un tout petit peu que l'image apparaisse avant de lancer le son
    setTimeout(() => {
        fireworksSound.play().catch(() => {});
        launchFireworks();
    }, 500);

    // 2. Animation Feux d'artifice
    function launchFireworks() {
      const container = document.querySelector('.wrap');
      const colors = ['#ff0000', '#ffd700', '#ff69b4', '#00ff00', '#00ffff'];

      // On crée 15 explosions
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          createExplosion(container, colors);
        }, i * 300); // Une explosion toutes les 300ms
      }
    }

    function createExplosion(container, colors) {
      // Position aléatoire sur l'écran
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * (window.innerHeight / 1.5); // Plutôt vers le haut
      const color = colors[Math.floor(Math.random() * colors.length)];

      // On crée quelques particules pour une explosion
      for (let j = 0; j < 12; j++) {
        const particle = document.createElement('div');
        particle.className = 'firework';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.backgroundColor = color;
        // Direction aléatoire pour chaque particule
        particle.style.transform = `rotate(${Math.random() * 360}deg)`;
        container.appendChild(particle);

        // Nettoyage
        setTimeout(() => particle.remove(), 1100);
      }
    }
  },

  unmount() {}
};