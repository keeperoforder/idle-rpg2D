import Phaser from "phaser";
import { MenuButton } from "../ui/MenuButton";

export class SettingsScene extends Phaser.Scene {
  private readonly accent = 0xc4a36a;
  private readonly parchment = "#d9c79b";
  private fullscreenText!: Phaser.GameObjects.Text;
  private fullscreenButton!: MenuButton;

  constructor() {
    super("SettingsScene");
  }

  create(): void {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x090b0f).setOrigin(0);

    this.add
      .text(width / 2, 88, "SETTINGS", {
        fontFamily: "monospace",
        fontSize: 38,
        fontStyle: "bold",
        color: "#efe7d4",
        letterSpacing: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 128, "DISPLAY SETTINGS", {
        fontFamily: "monospace",
        fontSize: 11,
        color: "#777f88",
        letterSpacing: 2,
      })
      .setOrigin(0.5);

    const panel = this.add.rectangle(
      width / 2,
      height / 2,
      560,
      230,
      0x11161b,
      0.98,
    );
    panel.setStrokeStyle(1.5, 0x3d444c, 0.95);

    this.add
      .text(width / 2, height / 2 - 62, "FULLSCREEN", {
        fontFamily: "monospace",
        fontSize: 18,
        color: "#d9d0bd",
        letterSpacing: 2,
      })
      .setOrigin(0.5);

    this.fullscreenText = this.add
      .text(width / 2, height / 2 - 28, "", {
        fontFamily: "monospace",
        fontSize: 12,
        color: "#8f979f",
        letterSpacing: 2,
      })
      .setOrigin(0.5);

    this.fullscreenButton = new MenuButton(
      this,
      width / 2,
      height / 2 + 34,
      "TOGGLE FULLSCREEN",
      () => this.toggleFullscreen(),
      {
        width: 300,
        height: 50,
        accentColor: this.accent,
        accentHex: this.parchment,
      },
    );

    new MenuButton(
      this,
      width / 2,
      height - 58,
      "BACK",
      () => this.scene.start("MainMenuScene"),
      {
        width: 220,
        height: 50,
        accentColor: 0x7d858d,
        accentHex: "#b8bdc1",
      },
    );

    this.input.on("fullscreenchange", this.updateFullscreenState, this);
    this.updateFullscreenState();
  }

  private toggleFullscreen(): void {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }

    void document.documentElement.requestFullscreen().catch(() => {
      this.fullscreenText.setText("FULLSCREEN WAS BLOCKED BY THE BROWSER");
    });
  }

  private updateFullscreenState(): void {
    const enabled = Boolean(document.fullscreenElement);
    this.fullscreenText.setText(enabled ? "STATUS  •  ON" : "STATUS  •  OFF");
    this.fullscreenButton.setDisabled(false);
  }

  shutdown(): void {
    this.input.off("fullscreenchange", this.updateFullscreenState, this);
  }
}
