// @flow strict

import { calcHeroPower } from "../hero/hero";
import { calculateAdventureEmbarkResults } from "../adventures/embark";

/*::
import type { Adventure, AdventureID } from "../adventures/generator";
import type { AdventureReport } from "../adventures/report";
import type { Hero } from "../hero/hero";
import type { LootID } from "../loot/generator";
import type { AdventureEmbark } from "../adventures/embark";

export type GameTimeMs = number;

export type GameState = {|
  hero: Hero,
  adventures: Map<AdventureID, Adventure>,

  pastEmbarks: AdventureEmbark[],
  currentEmbark: ?AdventureEmbark,

  roomDecorations: Map<LootID, null | { x: number, y: number}>,
|};
export type GameAction =
  | { type: 'embark', adventureId: AdventureID, departure: GameTimeMs }
  | { type: 'place-decoration', loot: LootID, place: null | { x: number, y: number } }
*/

export const reduceGameState = (state/*: GameState*/, action/*: GameAction*/)/*: GameState*/ => {
  switch (action.type) {
    case 'place-decoration':
      return {
        ...state,
        roomDecorations: new Map([
          ...state.roomDecorations,
          [action.loot, action.place]
        ])
      };
    case 'embark':
      const adventure = state.adventures.get(action.adventureId);
      if (!adventure)
        throw new Error();
      const heroPower = calcHeroPower(state.hero);
      const results = state.currentEmbark && calculateAdventureEmbarkResults(state.currentEmbark, state);
      const newLoot = results && results.loot || [];

      return {
        ...state,
        hero: {
          ...state.hero,
          loot: [...new Map([...state.hero.loot, ...newLoot].map(l => [l.id, l])).values()],
        },
        currentEmbark: {
          adventureId: adventure.id, 
          embarkStartTime: action.departure, 
          embarkedPower: heroPower
        },
        pastEmbarks: [...state.pastEmbarks, state.currentEmbark].filter(Boolean)
      }
    default:
      return state;
  }
}
