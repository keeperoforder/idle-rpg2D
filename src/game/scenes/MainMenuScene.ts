import Phaser from "phaser";
import { MenuButton } from "../ui/MenuButton";

export class MainMenuScene extends Phaser.Scene {
  private readonly accent = 0xc4a36a;
  private readonly parchment = "#d9c79b";
  private statusText!: Phaser.GameObjects.Text;

  constructor() {
    super("MainMenuScene");
  }

  create(): void {
    const { width, height } = this.scale;

    this.createBackground(width, height);
    this.createLogo(width, height);
    this.createMenu(width, height);
    this.createFooter(width, height);
  }

  private createBackground(width: number, height: number): void {
    this.add.rectangle(0, 0, width, height, 0x090b0f).setOrigin(0);

    const moon = this.add.circle(980, 145, 78, 0xd6d1bc, 0.1);
    this.add.circle(980, 145, 58, 0xe3dec7, 0.11);
    this.add.circle(980, 145, 40, 0xf0e9d2, 0.12);

    this.tweens.add({
      targets: moon,
      alpha: { from: 0.07, to: 0.16 },
      scale: { from: 0.96, to: 1.04 },
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });

    // Distant mountains.
    this.add.triangle(170, 610, 0, 230, 250, 230, 125, 20, 0x1c222a, 0.9);
    this.add.triangle(410, 610, 0, 210, 290, 210, 145, 20, 0x171c22, 0.95);
    this.add.triangle(670, 610, 0, 250, 330, 250, 165, 26, 0x1a2027, 0.92);
    this.add.triangle(980, 610, 0, 220, 310, 220, 155, 22, 0x161b22, 0.94);
    this.add.triangle(1190, 610, 0, 240, 260, 240, 130, 18, 0x1a2026, 0.92);

    // Near ground silhouettes.
    this.add
      .rectangle(0, height - 95, width, 95, 0x07090d, 0.96)
      .setOrigin(0);

    for (let i = 0; i < 28; i += 1) {
      const x = Phaser.Math.Between(20, width - 20);
      const y = Phaser.Math.Between(60, 430);
      const radius = Phaser.Math.Between(1, 2);
      const star = this.add.circle(x, y, radius, this.accent, Phaser.Math.FloatBetween(0.12, 0.42));

      this.tweens.add({
        targets: star,
        alpha: { from: star.alpha, to: 0.03 },
        duration: Phaser.Math.Between(1400, 2800),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 1400),
        ease: "Sine.InOut",
      });
    }

    // Slow drifting mist.
    const mist = this.add.rectangle(width / 2, height - 145, width + 100, 80, 0x7c858b, 0.025);
    this.tweens.add({
      targets: mist,
      x: "+=55",
      duration: 7000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });
  }

  private createLogo(width: number, height: number): void {
    const logoY = 112;

    const crest = this.add.graphics();
    crest.lineStyle(3, this.accent, 0.75);
    crest.strokeCircle(width / 2, logoY, 44);
    crest.lineStyle(1, this.accent, 0.35);
    crest.strokeCircle(width / 2, logoY, 54);

    crest.fillStyle(0x15181d, 0.92);
    crest.beginPath();
    crest.moveTo(width / 2, logoY - 29);
    crest.lineTo(width / 2 + 20, logoY - 8);
    crest.lineTo(width / 2 + 14, logoY + 27);
    crest.lineTo(width / 2, logoY + 38);
    crest.lineTo(width / 2 - 14, logoY + 27);
    crest.lineTo(width / 2 - 20, logoY - 8);
    crest.closePath();
    crest.fillPath();

    this.add
      .text(width / 2, logoY - 3, "✦", {
        fontFamily: "Georgia",
        fontSize: "42px",
        color: this.parchment,
      })
      .setOrigin(0.5);

    const title = this.add
      .text(width / 2, logoY + 66, "IDLE REALMS", {
        fontFamily: "monospace",
        fontSize: "48px",
        fontStyle: "bold",
        color: "#efe7d4",
        letterSpacing: 5,
        shadow: {
          offsetX: 0,
          offsetY: 4,
          color: "#000000",
          blur: 8,
          stroke: true,
          fill: true,
        },
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, logoY + 105, "A DARK FANTASY IDLE RPG", {
        fontFamily: "monospace",
        fontSize: "13px",
        color: "#858b93",
        letterSpacing: 3,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: title,
      alpha: { from: 0.92, to: 1 },
      duration: 2400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });

    const divider = this.add.graphics();
    divider.lineStyle(1, this.accent, 0.5);
    divider.lineBetween(width / 2 - 215, logoY + 126, width / 2 - 26, logoY + 126);
    divider.lineBetween(width / 2 + 26, logoY + 126, width / 2 + 215, logoY + 126);
    divider.fillStyle(this.accent, 0.65);
    divider.fillCircle(width / 2, logoY + 126, 3);
  }

  private createMenu(width: number, height: number): void {
    const menuX = width / 2;
    const startY = height / 2 - 58;
    const gap = 72;

    this.createButton(menuX, startY, "START GAME", () => {
      this.showStatus("Start Game is ready for the future gameplay scene.");
    });

    this.createButton(menuX, startY + gap, "CHOOSE HERO", () => {
      this.showStatus("Hero selection will be connected in the next system.");
    });

    this.createButton(menuX, startY + gap * 2, "SETTINGS", () => {
      this.showStatus("Settings panel is a placeholder for now.");
    });

    this.createButton(menuX, startY + gap * 3, "EXIT", () => {
      this.showStatus("Exit is disabled in the browser prototype.");
    });
  }

  private createButton(x: number, y: number, label: string, onClick: () => void): void {
    new MenuButton(this, x, y, label, onClick, {
      width: 420,
      height: 58,
      accentColor: this.accent,
      accentHex: this.parchment,
    });
  }

  private createFooter(width: number, height: number): void {
    this.statusText = this.add
      .text(width / 2, height - 58, "BUILD 0.1  •  WEB PROTOTYPE", {
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#555b64",
        letterSpacing: 2,
      })
      .setOrigin(0.5);

    this.statusText.setAlpha(0.9);
  }

  private showStatus(message: string): void {
    this.statusText.setText(message);
    this.statusText.setColor("#9a8b69");

    this.tweens.killTweensOf(this.statusText);
    this.tweens.add({
      targets: this.statusText,
      alpha: { from: 1, to: 0.45 },
      duration: 1500,
      yoyo: true,
      ease: "Sine.InOut",
    });
  }
}
