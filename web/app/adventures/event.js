// @flow strict

import { useEffect, useState } from "@lukekaalim/act";
import { calculateAdventureEmbarkResults } from "./embark";

/*::
import type { GameTimeMs } from "../App";
import type { Loot } from "../loot/generator";
import type { GameState } from "../state/game";
import type { AdventureStage, AdventureStageID } from "./stage";

export type AdventureEvent = {
  ...(
    | { type: 'depart' }
    | { type: 'advance', stageId: AdventureStageID }
    | { type: 'finish', success: boolean }
  ),
  id: AdventureEventID,
  timestamp: GameTimeMs,
}

export type AdventureEventID = string;
*/

export const getCurrentEvents = (events/*: AdventureEvent[]*/, now/*: GameTimeMs*/)/*: AdventureEvent[]*/ => {
  return events.filter(e => e.timestamp <= now);
};

export const isFinishedAdventure = (events/*: AdventureEvent[]*/)/*: boolean*/ => {
  const departed = events.reduce((acc, curr) => {
    switch (curr.type) {
      case 'depart':
        return false;
      case 'finish':
        return true;
      default:
        return acc;
    }
  }, true);
  return departed;
}

export const useCurrentEvents = (game/*: GameState*/)/*: AdventureEvent[]*/ => {
  const [currentEvents, setCurrentEvents] = useState/*:: <AdventureEvent[]>*/([]);

  useEffect(() => {
    const { currentEmbark } = game;
    if (!currentEmbark) {
      setCurrentEvents([]);
    } else {
      const results = calculateAdventureEmbarkResults(currentEmbark, game);
      const startTime = Date.now();
      const startingEvents = getCurrentEvents(results.events, startTime);
      setCurrentEvents(startingEvents);
      
      const timeoutIds = results.events
        .filter(e => e.timestamp >= startTime)
        .map(e => {
          const events = getCurrentEvents(results.events, e.timestamp);
          const time = e.timestamp - startTime;
          return setTimeout(() => {
            setCurrentEvents(events)
          }, time);
        });
      return () => timeoutIds.map(clearTimeout);
    }
  }, [game]);

  return currentEvents;
}