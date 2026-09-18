import Phaser from "phaser";

export interface MenuButtonOptions {
  width?: number;
  height?: number;
  accentColor?: number;
  accentHex?: string;
}

export class MenuButton extends Phaser.GameObjects.Container {
  private readonly background: Phaser.GameObjects.Rectangle;
  private readonly innerPanel: Phaser.GameObjects.Rectangle;
  private readonly border: Phaser.GameObjects.Rectangle;
  private readonly topHighlight: Phaser.GameObjects.Rectangle;
  private readonly accentLine: Phaser.GameObjects.Rectangle;
  private readonly label: Phaser.GameObjects.Text;
  private readonly glow: Phaser.GameObjects.Rectangle;
  private readonly shadow: Phaser.GameObjects.Rectangle;
  private readonly baseX: number;
  private readonly baseY: number;
  private readonly accentHex: string;
  private readonly accentColor: number;
  private hoverTimer: Phaser.Time.TimerEvent | null = null;
  private isHovered = false;
  private isDisabled = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    onClick: () => void,
    options: MenuButtonOptions = {},
  ) {
    super(scene, x, y);

    this.baseX = x;
    this.baseY = y;
    this.accentColor = options.accentColor ?? 0xc4a36a;
    this.accentHex = options.accentHex ?? "#c4a36a";

    const width = options.width ?? 420;
    const height = options.height ?? 58;

    this.shadow = scene.add
      .rectangle(0, 6, width + 4, height + 4, 0x000000, 0.52)
      .setOrigin(0.5);

    this.glow = scene.add
      .rectangle(0, 0, width + 18, height + 16, this.accentColor, 0)
      .setOrigin(0.5);

    this.background = scene.add
      .rectangle(0, 0, width, height, 0x11151a, 0.98)
      .setOrigin(0.5);

    this.innerPanel = scene.add
      .rectangle(0, 0, width - 8, height - 8, 0x171c21, 0.92)
      .setOrigin(0.5);

    this.border = scene.add
      .rectangle(0, 0, width, height, 0x000000, 0)
      .setOrigin(0.5)
      .setStrokeStyle(1.5, 0x3e454e, 0.95);

    this.topHighlight = scene.add
      .rectangle(0, -height / 2 + 2.5, width - 10, 2, 0xd6c59d, 0.16)
      .setOrigin(0.5);

    this.accentLine = scene.add
      .rectangle(0, height / 2 - 2.5, 76, 2, this.accentColor, 0.28)
      .setOrigin(0.5);

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

    this.add([
      this.shadow,
      this.glow,
      this.background,
      this.innerPanel,
      this.border,
      this.topHighlight,
      this.accentLine,
      this.label,
    ]);

    this.setSize(width, height);
    this.setInteractive({
      useHandCursor: true,
      hitArea: new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    });

    this.on("pointerover", this.handlePointerOver, this);
    this.on("pointerout", this.handlePointerOut, this);
    this.on("pointerdown", this.handlePointerDown, this);
    this.on("pointerdown", onClick);

    scene.add.existing(this);
  }

  public setDisabled(disabled: boolean): void {
    if (this.isDisabled === disabled) {
      return;
    }

    this.isDisabled = disabled;
    this.clearHoverTimer();
    this.isHovered = false;

    if (disabled) {
      this.disableInteractive();
      this.scene.tweens.killTweensOf(this);
      this.scene.tweens.add({
        targets: this,
        alpha: 0.42,
        duration: 180,
        ease: "Sine.Out",
      });
      this.border.setStrokeStyle(1.5, 0x33383f, 0.75);
      return;
    }

    this.setInteractive({
      useHandCursor: true,
      hitArea: new Phaser.Geom.Rectangle(
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height,
      ),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    });

    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 180,
      ease: "Sine.Out",
    });

    this.border.setStrokeStyle(1.5, 0x3e454e, 0.95);
  }

  public animateIn(delay: number): void {
    this.alpha = 0;
    this.y = this.baseY + 12;
    this.scaleX = 0.98;
    this.scaleY = 0.98;

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
    if (this.isDisabled) {
      return;
    }

    this.clearHoverTimer();

    this.hoverTimer = this.scene.time.delayedCall(150, () => {
      if (!this.active || this.isDisabled) {
        return;
      }

      this.isHovered = true;
      this.hoverTimer = null;
      this.applyHover();
    });
  }

  private handlePointerOut(): void {
    if (this.isDisabled) {
      return;
    }

    this.clearHoverTimer();

    if (!this.isHovered) {
      return;
    }

    this.isHovered = false;
    this.applyDefault();
  }

  private clearHoverTimer(): void {
    if (this.hoverTimer) {
      this.hoverTimer.remove(false);
      this.hoverTimer = null;
    }
  }

  private applyHover(): void {
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.killTweensOf(this.glow);
    this.scene.tweens.killTweensOf(this.background);
    this.scene.tweens.killTweensOf(this.innerPanel);
    this.scene.tweens.killTweensOf(this.border);
    this.scene.tweens.killTweensOf(this.accentLine);
    this.scene.tweens.killTweensOf(this.label);
    this.scene.tweens.killTweensOf(this.shadow);

    this.scene.tweens.add({
      targets: this,
      x: this.baseX + 7,
      scaleX: 1.025,
      scaleY: 1.025,
      duration: 220,
      ease: "Cubic.Out",
    });

    this.scene.tweens.add({
      targets: this.glow,
      alpha: 0.12,
      scaleX: 1.02,
      scaleY: 1.02,
      duration: 260,
      ease: "Sine.Out",
    });

    this.scene.tweens.add({
      targets: this.background,
      fillColor: 0x1c2025,
      fillAlpha: 1,
      duration: 220,
      ease: "Sine.Out",
    });

    this.scene.tweens.add({
      targets: this.innerPanel,
      fillColor: 0x20262c,
      duration: 220,
      ease: "Sine.Out",
    });

    this.scene.tweens.add({
      targets: this.label,
      scaleX: 1.015,
      scaleY: 1.015,
      duration: 220,
      ease: "Sine.Out",
    });

    this.scene.tweens.add({
      targets: this.accentLine,
      alpha: 0.82,
      scaleX: 1.32,
      duration: 260,
      ease: "Cubic.Out",
    });

    this.scene.tweens.add({
      targets: this.shadow,
      alpha: 0.34,
      y: 7,
      duration: 220,
      ease: "Sine.Out",
    });

    this.label.setColor(this.accentHex);
    this.border.setStrokeStyle(1.5, this.accentColor, 1);
  }

  private applyDefault(): void {
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.killTweensOf(this.glow);
    this.scene.tweens.killTweensOf(this.background);
    this.scene.tweens.killTweensOf(this.innerPanel);
    this.scene.tweens.killTweensOf(this.border);
    this.scene.tweens.killTweensOf(this.accentLine);
    this.scene.tweens.killTweensOf(this.label);
    this.scene.tweens.killTweensOf(this.shadow);

    this.scene.tweens.add({
      targets: this,
      x: this.baseX,
      scaleX: 1,
      scaleY: 1,
      duration: 240,
      ease: "Cubic.Out",
    });

    this.scene.tweens.add({
      targets: this.glow,
      alpha: 0,
      scaleX: 1,
      scaleY: 1,
      duration: 220,
      ease: "Sine.Out",
    });

    this.scene.tweens.add({
      targets: this.background,
      fillColor: 0x11151a,
      fillAlpha: 0.98,
      duration: 220,
      ease: "Sine.Out",
    });

    this.scene.tweens.add({
      targets: this.innerPanel,
      fillColor: 0x171c21,
      duration: 220,
      ease: "Sine.Out",
    });

    this.scene.tweens.add({
      targets: this.label,
      scaleX: 1,
      scaleY: 1,
      duration: 220,
      ease: "Sine.Out",
    });

    this.scene.tweens.add({
      targets: this.accentLine,
      alpha: 0.28,
      scaleX: 1,
      duration: 220,
      ease: "Sine.Out",
    });

    this.scene.tweens.add({
      targets: this.shadow,
      alpha: 0.52,
      y: 6,
      duration: 220,
      ease: "Sine.Out",
    });

    this.label.setColor("#e7e0cf");
    this.border.setStrokeStyle(1.5, 0x3e454e, 0.95);
  }

  private handlePointerDown(): void {
    if (this.isDisabled) {
      return;
    }

    this.scene.tweens.killTweensOf(this);

    this.scene.tweens.add({
      targets: this,
      scaleX: 0.975,
      scaleY: 0.975,
      y: this.baseY + 2,
      duration: 85,
      yoyo: true,
      ease: "Quad.Out",
    });

    this.scene.tweens.add({
      targets: this.glow,
      alpha: 0.18,
      duration: 90,
      yoyo: true,
      ease: "Sine.Out",
    });
  }

  destroy(fromScene?: boolean): void {
    this.clearHoverTimer();
    super.destroy(fromScene);
  }
}
