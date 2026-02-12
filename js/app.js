import { game0_robot } from "./games/game0_robot.js";
import { game1_captcha } from "./games/game1_captcha.js";
import { game2_puzzle } from "./games/game2_puzzle.js";
import { game3_qcm } from "./games/game3_qcm.js";
import { game4_finale } from "./games/game4_finale.js";
import { game5_signature } from "./games/game5_signature.js";
import { game6_finale_bouquet} from "./games/game6_final_bouquet.js";



const app = document.getElementById("app");

const FLOW = [game0_robot, game1_captcha, game2_puzzle, game3_qcm, game4_finale, game5_signature, game6_finale_bouquet];

let current = null;
let step = 0;

function loadStep(i){
  if (i < 0) i = 0;
  if (i >= FLOW.length) i = FLOW.length - 1;

  step = i;
  console.log("ROUTER -> step", step, FLOW[step]?.name || FLOW[step]);

  if(current?.unmount) current.unmount();
  app.innerHTML = "";

  const nextGame = FLOW[step];
  if(!nextGame){
    app.innerHTML = `<div class="wrap"><section class="card"><h1>Erreur</h1><p>FLOW[${step}] est undefined</p></section></div>`;
    return;
  }

  current = nextGame;
  current.render(app);

  current.mount({
    onSuccess: () => loadStep(step + 1),
    onFail: () => loadStep(0),
  });
}

loadStep(0);
