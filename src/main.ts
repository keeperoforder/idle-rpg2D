import Phaser from "phaser";
import "./styles.css";
import { BootScene } from "./game/scenes/BootScene";
import { MainMenuScene } from "./game/scenes/MainMenuScene";
import { HeroSelectScene } from "./game/scenes/HeroSelectScene";
import { MainScene } from "./game/scenes/MainScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  width: 1280,
  height: 720,
  backgroundColor: "#090b0f",
  pixelArt: false,
  resolution: Math.min(window.devicePixelRatio || 1, 2),
  render: {
    antialias: true,
    roundPixels: true,
    powerPreference: "high-performance",
  },
  scene: [BootScene, MainMenuScene, HeroSelectScene, MainScene],
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
