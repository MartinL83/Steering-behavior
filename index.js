import * as PIXI from "pixi.js";
import Victor from "victor";
import { makeAgent } from "./js/agent";
import "./js/utils/victor";

const WORLD_WIDTH = window.innerWidth;
const WORLD_HEIGHT = window.innerHeight;

const renderer = new PIXI.autoDetectRenderer(
  WORLD_WIDTH * 0.75,
  WORLD_HEIGHT * 0.75
);
const world = new PIXI.Container();

document.body.appendChild(renderer.view);

const agent = makeAgent();
world.addChild(agent.polygon);

animate();

function animate() {
  renderer.render(world);

  const x = renderer.plugins.interaction.mouse.global.x;
  const y = renderer.plugins.interaction.mouse.global.y;

  agent.steer(new Victor(x, y));
  agent.update();
  agent.render();

  requestAnimationFrame(animate);
}
