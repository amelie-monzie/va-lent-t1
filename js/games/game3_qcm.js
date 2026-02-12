export const game3_qcm = {

  render(root){
    root.innerHTML = `
      <div class="wrap">
        <section class="card" style="padding:24px; text-align:center;">
          
          <h2 style="margin-bottom:8px;">C'est l'heure du quizzzz</h2>
          
          <p id="step-counter" style="font-size:12px; color:#666; margin-bottom:10px;"></p>
          
          <p id="question" style="margin-bottom:20px; font-weight:bold; font-size:18px;"></p>

          <div id="answers" style="
            display:grid;
            gap:12px;
            max-width:420px;
            margin:0 auto 20px;
          "></div>

          <p id="feedback" style="min-height:20px; font-size:14px; font-weight:bold;"></p>

        </section>
      </div>
    `;
  },

  mount({ onSuccess }){

    // Les questions dans l'ordre
    const QUESTIONS = [
      {
        q: "Quelle est ma musique préférée entre ces 4 sons de la playlist 1Jours2Sons ?",
        answers: ["Sundance", "CIEL", "Sheikah", "aaa"],
        correct: 1 // Correspond à "Sheikah" (0, 1, 2)
      },
      {
        q: "Ma date d'anniversaire ? (désolé mais faut que ça rentre)",
        answers: ["13 mars", "15 mars", "19 mars", "21 mars"],
        correct: 2 // Correspond à "21 mars"
      },
      {
        q: "Mon film favoris pour le moment",
        answers: ["Porco Rosso", "Princesse Mononoke", "Château dans le ciel", "Celui ou t'as dormi"],
        correct: 3 // Correspond à "Celui ou t'as dormi"
      },
      {
        q: "La saveur des bretz qu'on avait acheté à la soirée couché de soleil à Pech David ?",
        answers: ["Sauce curry", "Pesto Mozza", "Poulet rôti", "Chêvre Piment d'Espelette"],
        correct: 0 // Correspond à "Pesto Mozza"
      },
      {
        q: "L'heure de notre premiere photo ensemble ? (sans compter la semaine d'inté parce que j'ai pas la photo)",
        answers: ["04:58", "03:27", "02:15", "01:42"],
        correct: 0 // Correspond à "03:27"
      },
      {
        q: "J'ai combien de dents ? ",
        answers: ["z'en ai 4", "32", "31", "28"],
        correct: 2 // Correspond à "28"
      },
      {
        q: "Mon moment favori avec toi ?",
        answers: ["soirée sous les étoiles", "ciné sur le tarmac", "date chez le lunetier", "shopping, marché de nöel, suzanno et ghibli ?", "injection dans l'épaule + bacelets", "pour de vrai je peux pas choisir"],
        correct: 5 // Correspond à "ciné sur le tarmac"
      }
    ];

    const questionEl = document.getElementById("question");
    const answersEl = document.getElementById("answers");
    const feedbackEl = document.getElementById("feedback");
    const counterEl = document.getElementById("step-counter");

    let currentStep = 0; // On commence à la question 0
    let isLocked = false; // Pour empêcher de cliquer partout quand on a validé

    // Fonction pour afficher la question actuelle
    const showQuestion = () => {
      // Si on a dépassé la dernière question, c'est fini !
      if (currentStep >= QUESTIONS.length) {
        onSuccess();
        return;
      }

      const data = QUESTIONS[currentStep];
      isLocked = false; // On déverrouille pour la nouvelle question
      
      // Mise à jour du texte
      counterEl.textContent = `Question ${currentStep + 1} / ${QUESTIONS.length}`;
      questionEl.textContent = data.q;
      feedbackEl.textContent = "";
      
      // On vide les anciens boutons
      answersEl.innerHTML = "";

      // On crée les nouveaux boutons
      data.answers.forEach((text, index) => {
        const btn = document.createElement("button");
        btn.textContent = text;

        // Styles des boutons
        btn.style.padding = "12px";
        btn.style.borderRadius = "10px";
        btn.style.border = "none";
        btn.style.cursor = "pointer";
        btn.style.fontWeight = "600";
        btn.style.background = "#f2f2f2";
        btn.style.transition = "background 0.2s";

        btn.addEventListener("click", () => {
          if (isLocked) return; // Si déjà validé, on ne fait rien

          if (index === data.correct) {
            // C'est GAGNÉ pour cette question
            isLocked = true;
            btn.style.background = "#4CAF50"; // Vert
            btn.style.color = "white";
            feedbackEl.textContent = "Bien ouej 😎";
            
            // On attend un peu avant de passer à la suivante
            setTimeout(() => {
              currentStep++; // On passe à la suivante
              showQuestion(); // On ré-affiche
            }, 1000);

          } else {
            // C'est PERDU, on reste sur la même question
            btn.style.background = "#e74c3c"; // Rouge
            btn.style.color = "white";
            feedbackEl.textContent = "Et c'est pas ok";
          }
        });

        answersEl.appendChild(btn);
      });
    };

    // Lancer la première question
    showQuestion();
  },

  unmount(){}
};