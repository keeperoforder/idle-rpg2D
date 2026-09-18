import Phaser from "phaser";
import type { HeroDefinition, HeroId } from "../types";

export class HeroCard extends Phaser.GameObjects.Container {
  private readonly cardWidth = 292;
  private readonly cardHeight = 328;
  private readonly accentColor: number;
  private readonly background: Phaser.GameObjects.Rectangle;
  private readonly frame: Phaser.GameObjects.Rectangle;
  private readonly glow: Phaser.GameObjects.Rectangle;
  private readonly title: Phaser.GameObjects.Text;
  private readonly description: Phaser.GameObjects.Text;
  private readonly role: Phaser.GameObjects.Text;
  private readonly heroArt: Phaser.GameObjects.Graphics;
  private readonly selectionMark: Phaser.GameObjects.Text;
  private readonly baseY: number;
  private isSelected = false;
  private isHovered = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    hero: HeroDefinition,
    onSelect: (heroId: HeroId) => void,
  ) {
    super(scene, x, y);

    this.baseY = y;
    this.accentColor = this.getAccentColor(hero.id);

    this.glow = scene.add
      .rectangle(0, 0, this.cardWidth + 20, this.cardHeight + 20, this.accentColor, 0)
      .setOrigin(0.5);

    this.background = scene.add
      .rectangle(0, 0, this.cardWidth, this.cardHeight, 0x11161b, 0.98)
      .setOrigin(0.5);

    this.frame = scene.add
      .rectangle(0, 0, this.cardWidth, this.cardHeight, 0x000000, 0)
      .setOrigin(0.5)
      .setStrokeStyle(1.5, 0x3d444c, 0.95);

    this.heroArt = scene.add.graphics();
    this.drawHeroArt(hero.id);

    this.title = scene.add
      .text(0, 103, hero.name.toUpperCase(), {
        fontFamily: "monospace",
        fontSize: 24,
        fontStyle: "bold",
        color: "#efe7d4",
        letterSpacing: 3,
      })
      .setOrigin(0.5);

    this.role = scene.add
      .text(0, 132, hero.role.toUpperCase(), {
        fontFamily: "monospace",
        fontSize: 10,
        color: this.getAccentHex(hero.id),
        letterSpacing: 2,
      })
      .setOrigin(0.5);

    this.description = scene.add
      .text(0, 175, hero.description, {
        fontFamily: "monospace",
        fontSize: 12,
        color: "#8d949c",
        align: "center",
        wordWrap: { width: 248 },
        lineSpacing: 5,
      })
      .setOrigin(0.5);

    this.selectionMark = scene.add
      .text(0, -137, "SELECTED", {
        fontFamily: "monospace",
        fontSize: 10,
        fontStyle: "bold",
        color: this.getAccentHex(hero.id),
        letterSpacing: 2,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.add([
      this.glow,
      this.background,
      this.frame,
      this.heroArt,
      this.title,
      this.role,
      this.description,
      this.selectionMark,
    ]);

    this.setSize(this.cardWidth, this.cardHeight);
    this.setInteractive({
      useHandCursor: true,
      hitArea: new Phaser.Geom.Rectangle(
        -this.cardWidth / 2,
        -this.cardHeight / 2,
        this.cardWidth,
        this.cardHeight,
      ),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    });

    this.on("pointerover", this.handlePointerOver, this);
    this.on("pointerout", this.handlePointerOut, this);
    this.on("pointerdown", this.handlePointerDown, this);
    this.on("pointerdown", () => onSelect(hero.id));

    scene.add.existing(this);
  }

  public setSelected(selected: boolean): void {
    this.isSelected = selected;
    this.applyVisualState();
  }

  public animateIn(delay: number): void {
    this.alpha = 0;
    this.y = this.baseY + 22;
    this.scaleX = 0.97;
    this.scaleY = 0.97;

    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      y: this.baseY,
      scaleX: 1,
      scaleY: 1,
      duration: 520,
      delay,
      ease: "Cubic.Out",
    });
  }

  private handlePointerOver(): void {
    this.isHovered = true;

    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.add({
      targets: this,
      y: this.baseY - 6,
      scaleX: this.isSelected ? 1.025 : 1.015,
      scaleY: this.isSelected ? 1.025 : 1.015,
      duration: 190,
      ease: "Cubic.Out",
    });

    this.scene.tweens.add({
      targets: this.glow,
      alpha: this.isSelected ? 0.15 : 0.07,
      duration: 200,
      ease: "Sine.Out",
    });

    this.scene.tweens.add({
      targets: this.background,
      fillColor: this.isSelected ? 0x20272e : 0x1a2026,
      duration: 200,
      ease: "Sine.Out",
    });

    this.frame.setStrokeStyle(1.5, this.accentColor, this.isSelected ? 1 : 0.8);
  }

  private handlePointerOut(): void {
    this.isHovered = false;
    this.applyVisualState();
  }

  private handlePointerDown(): void {
    this.scene.tweens.add({
      targets: this,
      scaleX: this.isSelected ? 1.01 : 0.985,
      scaleY: this.isSelected ? 1.01 : 0.985,
      y: this.isSelected ? this.baseY - 4 : this.baseY + 2,
      duration: 85,
      yoyo: true,
      ease: "Quad.Out",
    });
  }

  private applyVisualState(): void {
    this.scene.tweens.killTweensOf(this);

    this.scene.tweens.add({
      targets: this,
      y: this.isHovered ? this.baseY - 6 : this.baseY,
      scaleX: this.isHovered ? (this.isSelected ? 1.025 : 1.015) : 1,
      scaleY: this.isHovered ? (this.isSelected ? 1.025 : 1.015) : 1,
      duration: 210,
      ease: "Cubic.Out",
    });

    this.scene.tweens.add({
      targets: this.glow,
      alpha: this.isSelected ? 0.14 : this.isHovered ? 0.07 : 0,
      duration: 220,
      ease: "Sine.Out",
    });

    this.scene.tweens.add({
      targets: this.background,
      fillColor: this.isSelected ? 0x20272e : this.isHovered ? 0x1a2026 : 0x11161b,
      duration: 220,
      ease: "Sine.Out",
    });

    this.frame.setStrokeStyle(
      this.isSelected ? 2 : 1.5,
      this.isSelected ? this.accentColor : 0x3d444c,
      this.isSelected ? 1 : 0.95,
    );

    this.selectionMark.setAlpha(this.isSelected ? 1 : 0);
  }

  private drawHeroArt(heroId: HeroId): void {
    const body = 0x303843;
    const dark = 0x151a20;
    const skin = 0xcab89c;
    const cloak = 0x242b33;
    const accent = this.accentColor;

    this.heroArt.clear();

    this.heroArt.fillStyle(dark, 0.58);
    this.heroArt.fillEllipse(0, 55, 158, 24);

    if (heroId === "warrior") {
      this.heroArt.fillStyle(body, 1);
      this.heroArt.fillRect(-31, -24, 62, 76);
      this.heroArt.fillRect(-45, -10, 18, 60);
      this.heroArt.fillRect(27, -10, 18, 60);

      this.heroArt.fillStyle(skin, 1);
      this.heroArt.fillCircle(0, -52, 21);

      this.heroArt.fillStyle(dark, 1);
      this.heroArt.fillRect(-22, -77, 44, 12);
      this.heroArt.fillRect(-28, -69, 56, 8);

      this.heroArt.fillStyle(accent, 0.72);
      this.heroArt.fillRect(-31, -20, 62, 5);

      this.heroArt.lineStyle(8, 0xc9c1b0, 0.9);
      this.heroArt.lineBetween(40, 44, 79, -13);
      this.heroArt.lineStyle(4, accent, 0.9);
      this.heroArt.lineBetween(28, 36, 66, -20);
    }

    if (heroId === "archer") {
      this.heroArt.fillStyle(cloak, 1);
      this.heroArt.fillTriangle(0, -4, -48, 58, 48, 58);
      this.heroArt.fillStyle(skin, 1);
      this.heroArt.fillCircle(0, -56, 20);

      this.heroArt.fillStyle(0x1a2026, 1);
      this.heroArt.fillTriangle(0, -84, -30, -48, 30, -48);

      this.heroArt.lineStyle(8, 0x3f4a55, 1);
      this.heroArt.lineBetween(-21, -25, -50, 30);
      this.heroArt.lineStyle(3, accent, 0.9);
      this.heroArt.lineBetween(21, -20, 70, -61);

      this.heroArt.lineStyle(2, 0xbab4a8, 0.9);
      this.heroArt.arc(67, -26, 35, Phaser.Math.DegToRad(88), Phaser.Math.DegToRad(272));
      this.heroArt.lineBetween(72, -59, 72, -5);

      this.heroArt.lineStyle(2, accent, 0.8);
      this.heroArt.lineBetween(45, -52, 89, -52);
    }

    if (heroId === "mage") {
      this.heroArt.fillStyle(0x1e242c, 1);
      this.heroArt.fillTriangle(0, -26, -46, 58, 46, 58);

      this.heroArt.fillStyle(skin, 1);
      this.heroArt.fillCircle(0, -55, 19);

      this.heroArt.fillStyle(0x131820, 1);
      this.heroArt.fillTriangle(0, -92, -35, -43, 35, -43);
      this.heroArt.fillRect(-42, -46, 84, 8);

      this.heroArt.lineStyle(6, 0x4a535e, 1);
      this.heroArt.lineBetween(36, -5, 68, 58);

      this.heroArt.fillStyle(accent, 0.84);
      this.heroArt.fillCircle(68, 58, 9);
      this.heroArt.fillStyle(0xe8dfc8, 0.85);
      this.heroArt.fillCircle(68, 58, 4);

      this.heroArt.fillStyle(accent, 0.16);
      this.heroArt.fillCircle(68, 58, 20);
      this.heroArt.fillTriangle(68, 32, 62, 47, 74, 47);
    }
  }

  private getAccentColor(heroId: HeroId): number {
    switch (heroId) {
      case "warrior":
        return 0xc4a36a;
      case "archer":
        return 0x8fa878;
      case "mage":
        return 0x8b79b5;
    }
  }

  private getAccentHex(heroId: HeroId): string {
    switch (heroId) {
      case "warrior":
        return "#c4a36a";
      case "archer":
        return "#9bae8a";
      case "mage":
        return "#a28dbf";
    }
  }
}
