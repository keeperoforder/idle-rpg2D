import Phaser from "phaser";

export interface MenuButtonOptions {
  width?: number;
  height?: number;
  accentColor?: number;
  accentHex?: string;
}

export class MenuButton extends Phaser.GameObjects.Container {
  private readonly background: Phaser.GameObjects.Rectangle;
  private readonly border: Phaser.GameObjects.Rectangle;
  private readonly label: Phaser.GameObjects.Text;
  private readonly glow: Phaser.GameObjects.Rectangle;
  private readonly baseY: number;
  private readonly accentHex: string;
  private readonly accentColor: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    onClick: () => void,
    options: MenuButtonOptions = {},
  ) {
    super(scene, x, y);

    this.baseY = y;
    this.accentColor = options.accentColor ?? 0xc4a36a;
    this.accentHex = options.accentHex ?? "#c4a36a";

    const width = options.width ?? 420;
    const height = options.height ?? 58;

    this.glow = scene.add
      .rectangle(0, 0, width + 14, height + 12, this.accentColor, 0)
      .setOrigin(0.5);

    this.background = scene.add
      .rectangle(0, 0, width, height, 0x14171c, 0.94)
      .setOrigin(0.5);

    this.border = scene.add
      .rectangle(0, 0, width, height, 0x000000, 0)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0x3b4048, 0.95);

    this.label = scene.add
      .text(0, -1, text, {
        fontFamily: "monospace",
        fontSize: "22px",
        fontStyle: "bold",
        color: "#e7e0cf",
        letterSpacing: 2,
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

    this.add([this.glow, this.background, this.border, this.label]);

    this.setSize(width, height);
    this.setInteractive({
      useHandCursor: true,
      hitArea: new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    });

    this.on("pointerover", this.handlePointerOver, this);
    this.on("pointerout", this.handlePointerOut, this);
    this.on("pointerdown", this.handlePointerDown, this);
    this.on("pointerup", this.handlePointerUp, this);
    this.on("pointerdown", onClick);

    scene.add.existing(this);
  }

  private handlePointerOver(): void {
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.killTweensOf(this.glow);
    this.scene.tweens.killTweensOf(this.background);
    this.scene.tweens.killTweensOf(this.label);

    this.scene.tweens.add({
      targets: this,
      x: this.x + 6,
      duration: 130,
      ease: "Quad.Out",
    });

    this.scene.tweens.add({
      targets: this.glow,
      alpha: { from: 0, to: 0.16 },
      duration: 180,
      ease: "Sine.Out",
    });

    this.scene.tweens.add({
      targets: this.background,
      fillColor: this.accentColor,
      fillAlpha: { from: 0.94, to: 1 },
      duration: 180,
      ease: "Sine.Out",
    });

    this.scene.tweens.add({
      targets: this.label,
      color: this.accentHex,
      scaleX: 1.02,
      scaleY: 1.02,
      duration: 180,
      ease: "Sine.Out",
    });

    this.border.setStrokeStyle(2, this.accentColor, 0.95);
  }

  private handlePointerOut(): void {
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.killTweensOf(this.glow);
    this.scene.tweens.killTweensOf(this.background);
    this.scene.tweens.killTweensOf(this.label);

    this.scene.tweens.add({
      targets: this,
      x: this.baseX,
      duration: 160,
      ease: "Quad.Out",
    });

    this.scene.tweens.add({
      targets: this.glow,
      alpha: 0,
      duration: 160,
      ease: "Sine.Out",
    });

    this.scene.tweens.add({
      targets: this.background,
      fillColor: 0x14171c,
      fillAlpha: 0.94,
      duration: 160,
      ease: "Sine.Out",
    });

    this.scene.tweens.add({
      targets: this.label,
      color: "#e7e0cf",
      scaleX: 1,
      scaleY: 1,
      duration: 160,
      ease: "Sine.Out",
    });

    this.border.setStrokeStyle(2, 0x3b4048, 0.95);
  }

  private handlePointerDown(): void {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0.97,
      scaleY: 0.97,
      duration: 70,
      yoyo: true,
      ease: "Quad.Out",
    });
  }
}
