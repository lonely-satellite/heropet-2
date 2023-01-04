// @flow strict
/*::
import type { GameTimeMs } from "../App";
import type { GameState } from "../state/game";
import type { Loot } from "./generator";
*/

import {
  calculateAdventureEmbarkResults,
} from "../adventures/embark";
import { getCurrentEvents, isFinishedAdventure } from "../adventures/event";
import { useEffect, useState } from "@lukekaalim/act";

export const calculateCurrentLoot = (game/*: GameState*/, now/*: GameTimeMs*/)/*: Loot[]*/ => {
  const { currentEmbark } = game;
  if (!currentEmbark)
    return game.hero.loot;
  const results = calculateAdventureEmbarkResults(currentEmbark, game);
  const currentEvents = getCurrentEvents(results.events, now);
  if (isFinishedAdventure(currentEvents))
    return [...new Map([...game.hero.loot, ...results.loot].map(l => [l.id, l])).values()]
  return game.hero.loot;
};

export const useCurrentLoot = (game/*: GameState*/)/*: Loot[]*/ => {
  const [loot, setLoot] = useState([]);
  const events = [];

  useEffect(() => {
    const now = Date.now();
    setLoot(calculateCurrentLoot(game, now));
    const ids = events
      .filter(e => e.timestamp > now)
      .map(e => {
        const loot = calculateCurrentLoot(game, e.timestamp);
        const time = e.timestamp - now;
        setTimeout(() => setLoot(loot), time)
      });
    return () => {
      ids.map(clearTimeout);
    }
  }, [game])

  return loot;
};