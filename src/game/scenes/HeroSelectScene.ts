import Phaser from "phaser";
import { HEROES } from "../data/heroes";
import { gameState } from "../state/GameState";
import type { HeroId } from "../types";
import { HeroCard } from "../ui/HeroCard";
import { MenuButton } from "../ui/MenuButton";

export class HeroSelectScene extends Phaser.Scene {
  private readonly accent = 0xc4a36a;
  private readonly parchment = "#d9c79b";
  private heroCards: HeroCard[] = [];
  private selectedHeroId: HeroId | null = null;
  private confirmButton!: MenuButton;
  private selectionText!: Phaser.GameObjects.Text;

  constructor() {
    super("HeroSelectScene");
  }

  create(): void {
    const { width, height } = this.scale;

    this.selectedHeroId = gameState.getCurrentHeroId();

    this.createBackground(width, height);
    this.createHeader(width, height);
    this.createCards(width, height);
    this.createControls(width, height);
    this.playIntro();
  }

  private createBackground(width: number, height: number): void {
    this.add.rectangle(0, 0, width, height, 0x090b0f).setOrigin(0);

    this.add.ellipse(
      width * 0.5,
      height * 0.52,
      width * 0.7,
      height * 0.64,
      this.accent,
      0.018,
    );

    const moon = this.add.circle(
      width * 0.84,
      height * 0.16,
      Math.min(width, height) * 0.09,
      0xe7e0ca,
      0.08,
    );

    this.tweens.add({
      targets: moon,
      alpha: { from: 0.06, to: 0.12 },
      scale: { from: 0.96, to: 1.03 },
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });

    for (let i = 0; i < 20; i += 1) {
      const particle = this.add.circle(
        Phaser.Math.Between(18, width - 18),
        Phaser.Math.Between(44, height - 130),
        Phaser.Math.Between(1, 2),
        this.accent,
        Phaser.Math.FloatBetween(0.08, 0.26),
      );

      this.tweens.add({
        targets: particle,
        alpha: { from: particle.alpha, to: 0.02 },
        y: particle.y + Phaser.Math.Between(-8, 8),
        duration: Phaser.Math.Between(1800, 3400),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 1200),
        ease: "Sine.InOut",
      });
    }

    const mist = this.add.rectangle(
      width * 0.5,
      height * 0.82,
      width * 1.15,
      52,
      0xbdb5a1,
      0.012,
    );

    this.tweens.add({
      targets: mist,
      x: "+=60",
      alpha: { from: 0.01, to: 0.022 },
      duration: 8500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut",
    });
  }

  private createHeader(width: number, height: number): void {
    this.add
      .text(width / 2, 72, "CHOOSE YOUR HERO", {
        fontFamily: "monospace",
        fontSize: 34,
        fontStyle: "bold",
        color: "#efe7d4",
        letterSpacing: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 108, "THE PATH YOU CHOOSE WILL SHAPE YOUR JOURNEY", {
        fontFamily: "monospace",
        fontSize: 11,
        color: "#777f88",
        letterSpacing: 2,
      })
      .setOrigin(0.5);

    const divider = this.add.graphics();
    divider.lineStyle(1, this.accent, 0.42);
    divider.lineBetween(width / 2 - 260, 134, width / 2 - 22, 134);
    divider.lineBetween(width / 2 + 22, 134, width / 2 + 260, 134);
    divider.fillStyle(this.accent, 0.7);
    divider.fillCircle(width / 2, 134, 3);

    void height;
  }

  private createCards(width: number, height: number): void {
    const gap = 24;
    const cardWidth = 292;
    const totalWidth = cardWidth * 3 + gap * 2;
    const startX = width / 2 - totalWidth / 2 + cardWidth / 2;
    const y = height * 0.49;

    HEROES.forEach((hero, index) => {
      const card = new HeroCard(
        this,
        startX + index * (cardWidth + gap),
        y,
        hero,
        (heroId) => this.selectHero(heroId),
      );

      card.setSelected(this.selectedHeroId === hero.id);
      this.heroCards.push(card);
    });
  }

  private createControls(width: number, height: number): void {
    this.selectionText = this.add
      .text(width / 2, height - 108, "NO HERO SELECTED", {
        fontFamily: "monospace",
        fontSize: 12,
        color: "#666d75",
        letterSpacing: 2,
      })
      .setOrigin(0.5);

    this.confirmButton = new MenuButton(
      this,
      width / 2 + 135,
      height - 52,
      "CONFIRM HERO",
      () => this.confirmHero(),
      {
        width: 270,
        height: 50,
        accentColor: this.accent,
        accentHex: this.parchment,
      },
    );

    this.confirmButton.setDisabled(this.selectedHeroId === null);

    const backButton = new MenuButton(
      this,
      width / 2 - 135,
      height - 52,
      "BACK",
      () => this.scene.start("MainMenuScene"),
      {
        width: 180,
        height: 50,
        accentColor: 0x7d858d,
        accentHex: "#b8bdc1",
      },
    );

    this.selectionText.setDepth(5);
    this.confirmButton.setDepth(5);
    backButton.setDepth(5);

    this.updateSelectionText();
  }

  private selectHero(heroId: HeroId): void {
    this.selectedHeroId = heroId;

    this.heroCards.forEach((card, index) => {
      card.setSelected(HEROES[index].id === heroId);
    });

    this.confirmButton.setDisabled(false);
    this.updateSelectionText();
  }

  private confirmHero(): void {
    if (!this.selectedHeroId) {
      return;
    }

    gameState.setCurrentHero(this.selectedHeroId);

    this.cameras.main.fadeOut(420, 9, 11, 15);

    this.time.delayedCall(430, () => {
      this.scene.start("MainScene");
    });
  }

  private updateSelectionText(): void {
    if (!this.selectedHeroId) {
      this.selectionText.setText("NO HERO SELECTED");
      this.selectionText.setColor("#666d75");
      return;
    }

    const hero = HEROES.find((item) => item.id === this.selectedHeroId);

    if (!hero) {
      return;
    }

    this.selectionText.setText(`SELECTED  •  ${hero.name.toUpperCase()}`);
    this.selectionText.setColor("#9a8b69");
  }

  private playIntro(): void {
    this.selectionText.alpha = 0;

    this.tweens.add({
      targets: this.selectionText,
      alpha: 1,
      duration: 420,
      delay: 420,
      ease: "Sine.Out",
    });

    this.heroCards.forEach((card, index) => {
      card.animateIn(180 + index * 90);
    });
  }
}
