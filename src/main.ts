import Phaser from "phaser";
import "./styles.css";
import { BootScene } from "./game/scenes/BootScene";
import { MainMenuScene } from "./game/scenes/MainMenuScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  width: 1280,
  height: 720,
  backgroundColor: "#090b0f",
  pixelArt: false,
  antialias: true,
  roundPixels: true,
  resolution: Math.min(window.devicePixelRatio || 1, 2),
  scene: [BootScene, MainMenuScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
  },
};

new Phaser.Game(config);

requestAnimationFrame(() => {
  document.getElementById("boot-screen")?.remove();
});
