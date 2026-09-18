import type { HeroId } from "../types";

class GameStateStore {
  private currentHero: HeroId | null = null;

  public getCurrentHeroId(): HeroId | null {
    return this.currentHero;
  }

  public setCurrentHero(heroId: HeroId): void {
    this.currentHero = heroId;
  }
}

export const gameState = new GameStateStore();
