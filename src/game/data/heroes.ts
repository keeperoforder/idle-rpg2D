import type { HeroDefinition, HeroId } from "../types";

export const HEROES: readonly HeroDefinition[] = [
  {
    id: "warrior",
    name: "Warrior",
    description: "A relentless frontline fighter built to endure the darkest battles.",
    role: "Frontline",
  },
  {
    id: "archer",
    name: "Archer",
    description: "A precise ranged hunter who strikes from the shadows before danger closes in.",
    role: "Ranged",
  },
  {
    id: "mage",
    name: "Mage",
    description: "A master of ancient arcane forces who turns forbidden magic into power.",
    role: "Arcane",
  },
];

export function getHeroById(id: HeroId | null): HeroDefinition | null {
  if (!id) {
    return null;
  }

  return HEROES.find((hero) => hero.id === id) ?? null;
}
