import Phaser from "phaser";

export class MainScene extends Phaser.Scene {
  private statusText!: Phaser.GameObjects.Text;

  constructor() {
    super("MainScene");
  }

  create(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, 90, "IDLE RPG 2D", {
        fontFamily: "Arial",
        fontSize: "44px",
        color: "#f8fafc",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 145, "Web prototype • Phaser + TypeScript", {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#94a3b8",
      })
      .setOrigin(0.5);

    const panel = this.add.rectangle(
      width / 2,
      height / 2 + 40,
      900,
      360,
      0x1e293b,
      0.96,
    );

    panel.setStrokeStyle(2, 0x334155);

    this.add
      .text(width / 2, height / 2 - 80, "Game structure is ready", {
        fontFamily: "Arial",
        fontSize: "30px",
        color: "#e2e8f0",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(
        width / 2,
        height / 2 - 25,
        "Next modules can be added here:\n\n• Hero & stats\n• Enemies & waves\n• Idle combat\n• Rooms & progression\n• Inventory & equipment\n• Save/load",
        {
          fontFamily: "Arial",
          fontSize: "20px",
          color: "#cbd5e1",
          align: "left",
          lineSpacing: 10,
        },
      )
      .setOrigin(0.5);

    this.statusText = this.add
      .text(width / 2, height - 60, "Prototype initialized", {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#64748b",
      })
      .setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.statusText.setText("Input system is working");
    });
  }
}
