export const game0_robot = {
  render(root){
    root.innerHTML = `
      <div class="wrap">
        <section class="card">
          <h1>Bienvenu au jeu de la St-Valentin :)</h1>
          <p>Avant de commencer je dois m'assurer que tu n'es pas réel</p>
<div class="robot-wrap">
  <div class="robot-layer">
    <div class="robot-glow" aria-hidden="true"></div>
    <img class="robot-hero"
         src="assets/img/robot/robot.png"
         alt="Robot"
         loading="eager"
         decoding="async">
  </div>
</div>

          <div class="captcha" id="fakeCaptcha" role="button" tabindex="0" aria-label="Je suis un robot">
            <div class="captcha-left">
              <div class="cbox" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#0b1020" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="captcha-label">Je suis un robot</div>
            </div>

            <div class="captcha-right">
              <div class="captcha-badge">
                <span class="dot"></span>
                <span>HumanCheck</span>
              </div>
              <div class="captcha-meta">Confidentialité · Conditions</div>
            </div>
          </div>

        </section>
      </div>
    `;
  },

  mount({ onSuccess }){
    const cap = document.getElementById("fakeCaptcha");

    function runCaptcha(){
      if (cap.classList.contains("checked") || cap.classList.contains("loading")) return;

      cap.classList.add("loading");
      setTimeout(() => {
        cap.classList.remove("loading");
        cap.classList.add("checked");
        setTimeout(() => onSuccess(), 550);
      }, 900);
    }

    cap.addEventListener("click", runCaptcha);
    cap.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); runCaptcha(); }
    });
  },

  unmount(){}
};
