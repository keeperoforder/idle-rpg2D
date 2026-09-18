import Phaser from "phaser";
import { MenuButton } from "../ui/MenuButton";

interface ParallaxLayer {
  object: Phaser.GameObjects.GameObject & { x: number; y: number };
  baseX: number;
  baseY: number;
  strengthX: number;
  strengthY: number;
}

export class MainMenuScene extends Phaser.Scene {
  private readonly accent = 0xc4a36a;
  private readonly parchment = "#d9c79b";
  private statusText!: Phaser.GameObjects.Text;
  private logoGroup!: Phaser.GameObjects.Container;
  private menuButtons: MenuButton[] = [];
  private parallaxLayers: ParallaxLayer[] = [];
  private pointerParallaxX = 0;
  private pointerParallaxY = 0;

  constructor() {
    super("MainMenuScene");
  }

  create(): void {
    const { width, height } = this.scale;

    this.createBackground(width, height);
    this.createCentralGlow(width, height);
    this.createLogo(width, height);
    this.createMenu(width, height);
    this.createFooter(width, height);
    this.createMenuFrame(width, height);
    this.playIntro();

    this.input.on("pointermove", this.handlePointerMove, this);
  }

  update(): void {
    for (const layer of this.parallaxLayers) {
      const targetX = layer.baseX + this.pointerParallaxX * layer.strengthX;
      const targetY = layer.baseY + this.pointerParallaxY * layer.strengthY;

      layer.object.x = Phaser.Math.Linear(layer.object.x, targetX, 0.035);
      layer.object.y = Phaser.Math.Linear(layer.object.y, targetY, 0.035);
    }
  }

  private createBackground(width: number, height: number): void {
    this.add.rectangle(0, 0, width, height, 0x090b0f).setOrigin(0);

    const moon = this.add.circle(
      width * 0.77,
      height * 0.2,
      Math.min(width, height) * 0.11,
      0xd6d1bc,
      0.1,
    );

    this.add.circle(
      width * 0.77,
      height * 0.2,
      Math.min(width, height) * 0.082,
      0xe3dec7,
      0.1,
    );

    this.add.circle(
      width * 0.77,
      height * 0.2,
      Math.min(width, height) * 0.056,
      0xf0e9d2,
      0.12,
    );

    this.tweens.add({
      targets: moon,
      alpha: { from: 0.07, to: 0.16 },
      scale: { from: 0.96, to: 1.04 },
      duration: 2800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });

    const distantMountains = this.add.container(0, 0);
    distantMountains.add([
      this.add.triangle(width * 0.13, height * 0.84, 0, height * 0.32, width * 0.2, height * 0.32, width * 0.1, height * 0.03, 0x1c222a, 0.9),
      this.add.triangle(width * 0.32, height * 0.84, 0, height * 0.29, width * 0.23, height * 0.29, width * 0.115, height * 0.025, 0x171c22, 0.95),
      this.add.triangle(width * 0.54, height * 0.84, 0, height * 0.35, width * 0.26, height * 0.35, width * 0.13, height * 0.03, 0x1a2027, 0.92),
      this.add.triangle(width * 0.77, height * 0.84, 0, height * 0.31, width * 0.24, height * 0.31, width * 0.12, height * 0.027, 0x161b22, 0.94),
      this.add.triangle(width * 0.95, height * 0.84, 0, height * 0.34, width * 0.2, height * 0.34, width * 0.1, height * 0.025, 0x1a2026, 0.92),
    ]);

    this.parallaxLayers.push({
      object: distantMountains,
      baseX: 0,
      baseY: 0,
      strengthX: 3,
      strengthY: 3,
    });

    this.add
      .rectangle(0, height - height * 0.13, width, height * 0.13, 0x07090d, 0.96)
      .setOrigin(0);

    for (let i = 0; i < 24; i += 1) {
      const x = Phaser.Math.Between(24, Math.max(25, width - 24));
      const y = Phaser.Math.Between(height * 0.08, height * 0.61);
      const radius = Phaser.Math.Between(1, 2);
      const particle = this.add.circle(
        x,
        y,
        radius,
        this.accent,
        Phaser.Math.FloatBetween(0.1, 0.34),
      );

      const drift = Phaser.Math.Between(-8, 8);

      this.tweens.add({
        targets: particle,
        alpha: { from: particle.alpha, to: 0.025 },
        y: particle.y + drift,
        duration: Phaser.Math.Between(1800, 3600),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 1600),
        ease: "Sine.InOut",
      });
    }

    const mistBack = this.add.rectangle(
      width * 0.48,
      height * 0.73,
      width * 1.12,
      height * 0.09,
      0x96a0a6,
      0.018,
    );

    const mistFront = this.add.rectangle(
      width * 0.52,
      height * 0.8,
      width * 1.08,
      height * 0.065,
      0xd2c7a9,
      0.014,
    );

    this.tweens.add({
      targets: mistBack,
      x: "+=62",
      alpha: { from: 0.014, to: 0.026 },
      duration: 9000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });

    this.tweens.add({
      targets: mistFront,
      x: "-=48",
      alpha: { from: 0.012, to: 0.022 },
      duration: 7500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });

    this.parallaxLayers.push({
      object: mistBack,
      baseX: mistBack.x,
      baseY: mistBack.y,
      strengthX: 1.6,
      strengthY: 1.6,
    });

    this.parallaxLayers.push({
      object: mistFront,
      baseX: mistFront.x,
      baseY: mistFront.y,
      strengthX: 2.2,
      strengthY: 2.2,
    });
  }

  private createCentralGlow(width: number, height: number): void {
    const outerGlow = this.add.ellipse(
      width / 2,
      height * 0.53,
      width * 0.58,
      height * 0.64,
      this.accent,
      0.018,
    );

    const innerGlow = this.add.ellipse(
      width / 2,
      height * 0.52,
      width * 0.4,
      height * 0.46,
      0xd7c08f,
      0.02,
    );

    this.tweens.add({
      targets: outerGlow,
      alpha: { from: 0.014, to: 0.028 },
      scaleX: 1.035,
      scaleY: 1.02,
      duration: 4200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });

    this.tweens.add({
      targets: innerGlow,
      alpha: { from: 0.016, to: 0.032 },
      scaleX: 1.025,
      scaleY: 1.025,
      duration: 3200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });
  }

  private createLogo(width: number, height: number): void {
    const logoY = height * 0.16;
    this.logoGroup = this.add.container(width / 2, logoY);

    const crest = this.add.graphics();
    crest.lineStyle(3, this.accent, 0.78);
    crest.strokeCircle(0, 0, Math.min(width, height) * 0.061);
    crest.lineStyle(1, this.accent, 0.34);
    crest.strokeCircle(0, 0, Math.min(width, height) * 0.074);

    crest.fillStyle(0x15181d, 0.94);
    crest.beginPath();
    crest.moveTo(0, -29);
    crest.lineTo(20, -8);
    crest.lineTo(14, 27);
    crest.lineTo(0, 38);
    crest.lineTo(-14, 27);
    crest.lineTo(-20, -8);
    crest.closePath();
    crest.fillPath();

    const rune = this.add
      .text(0, -3, "✦", {
        fontFamily: "Georgia",
        fontSize: "42px",
        color: this.parchment,
        shadow: {
          offsetX: 0,
          offsetY: 2,
          color: "#000000",
          blur: 4,
          stroke: true,
          fill: true,
        },
      })
      .setOrigin(0.5);

    const title = this.add
      .text(0, 66, "IDLE REALMS", {
        fontFamily: "monospace",
        fontSize: 48,
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

    const subtitle = this.add
      .text(0, 105, "A DARK FANTASY IDLE RPG", {
        fontFamily: "monospace",
        fontSize: 13,
        color: "#858b93",
        letterSpacing: 3,
      })
      .setOrigin(0.5);

    const divider = this.add.graphics();
    divider.lineStyle(1, this.accent, 0.5);
    divider.lineBetween(-215, 126, -26, 126);
    divider.lineBetween(26, 126, 215, 126);
    divider.fillStyle(this.accent, 0.65);
    divider.fillCircle(0, 126, 3);

    this.logoGroup.add([crest, rune, title, subtitle, divider]);

    this.parallaxLayers.push({
      object: this.logoGroup,
      baseX: width / 2,
      baseY: logoY,
      strengthX: 1.15,
      strengthY: 0,
    });

    this.logoGroup.alpha = 0;
    this.logoGroup.scaleX = 0.985;
    this.logoGroup.scaleY = 0.985;

    this.tweens.add({
      targets: this.logoGroup,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 700,
      ease: "Cubic.Out",
    });

    this.tweens.add({
      targets: this.logoGroup,
      y: logoY - 2,
      duration: 2600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });

    this.tweens.add({
      targets: [rune, title],
      alpha: { from: 0.92, to: 1 },
      duration: 2400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });
  }

  private createMenu(width: number, height: number): void {
    const menuX = width / 2;
    const startY = height * 0.5 - 58;
    const gap = 72;

    this.createButton(menuX, startY, "START GAME", () => {
      this.startGame();
    });

    this.createButton(menuX, startY + gap, "CHOOSE HERO", () => {
      this.scene.start("HeroSelectScene");
    });

    this.createButton(menuX, startY + gap * 2, "SETTINGS", () => {
      this.scene.start("SettingsScene");
    });

    this.createButton(menuX, startY + gap * 3, "EXIT", () => {
      this.exitGame();
    });
  }


  private startGame(): void {
    this.scene.start("MainScene");
  }

  private exitGame(): void {
    window.close();

    this.time.delayedCall(120, () => {
      this.showStatus("The browser blocked automatic closing. You can close this tab.");
    });
  }

  private createButton(x: number, y: number, label: string, onClick: () => void): void {
    const button = new MenuButton(this, x, y, label, onClick, {
      width: 420,
      height: 58,
      accentColor: this.accent,
      accentHex: this.parchment,
    });

    this.menuButtons.push(button);
  }

  private createMenuFrame(width: number, height: number): void {
    const frame = this.add.graphics();
    const left = width / 2 - 232;
    const right = width / 2 + 232;
    const top = height * 0.5 - 101;
    const bottom = height * 0.5 + 233;

    frame.lineStyle(1, this.accent, 0.16);
    frame.lineBetween(left, top, left + 38, top);
    frame.lineBetween(left, top, left, top + 28);
    frame.lineBetween(right - 38, top, right, top);
    frame.lineBetween(right, top, right, top + 28);
    frame.lineBetween(left, bottom, left + 38, bottom);
    frame.lineBetween(left, bottom - 28, left, bottom);
    frame.lineBetween(right - 38, bottom, right, bottom);
    frame.lineBetween(right, bottom - 28, right, bottom);

    frame.fillStyle(this.accent, 0.42);
    frame.fillCircle(left, top, 2);
    frame.fillCircle(right, top, 2);
    frame.fillCircle(left, bottom, 2);
    frame.fillCircle(right, bottom, 2);

    frame.alpha = 0;

    this.tweens.add({
      targets: frame,
      alpha: { from: 0, to: 1 },
      duration: 800,
      delay: 240,
      ease: "Sine.Out",
    });
  }

  private createFooter(width: number, height: number): void {
    this.statusText = this.add
      .text(width / 2, height - 58, "BUILD 0.1  •  WEB PROTOTYPE", {
        fontFamily: "monospace",
        fontSize: 12,
        color: "#555b64",
        letterSpacing: 2,
        shadow: {
          offsetX: 0,
          offsetY: 1,
          color: "#000000",
          blur: 2,
          stroke: true,
          fill: true,
        },
      })
      .setOrigin(0.5);

    this.statusText.setAlpha(0.9);
  }

  private playIntro(): void {
    this.menuButtons.forEach((button, index) => {
      button.animateIn(160 + index * 75);
    });

    const footerTarget = this.statusText;
    footerTarget.alpha = 0;

    this.tweens.add({
      targets: footerTarget,
      alpha: 0.9,
      duration: 500,
      delay: 480,
      ease: "Sine.Out",
    });
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    const { width, height } = this.scale;
    const normalizedX = Phaser.Math.Clamp(pointer.x / width - 0.5, -0.5, 0.5);
    const normalizedY = Phaser.Math.Clamp(pointer.y / height - 0.5, -0.5, 0.5);

    this.pointerParallaxX = normalizedX * 20;
    this.pointerParallaxY = normalizedY * 12;
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
