// @flow strict

import { useEffect, useState } from "@lukekaalim/act";
import { nanoid } from "nanoid";

import { calculateStageFinishTimes } from "./stage";

/*::
import type { GameTimeMs } from "../App";
import type { GameState } from "../state/game";
import type { AdventureEvent } from "./event";
import type { Adventure, AdventureID } from "./generator";
import type { AdventureStage } from "./stage";
import type { Loot } from "../loot/generator";

export type AdventureEmbark = {
  embarkedPower: number,
  adventureId: AdventureID,

  embarkStartTime: GameTimeMs,
};

export type AdventureEmbarkResults = {
  ...AdventureEmbark,
  adventure: Adventure,
  success: boolean,

  advancedStages: AdventureStage[],
  loot: Loot[],
  events: AdventureEvent[],

  realEndTime: GameTimeMs,
  projectedEndTime: GameTimeMs,
};
*/

export const getEmbarkAdventure = (embark/*: AdventureEmbark*/, state/*: GameState*/)/*: Adventure*/ => {
  const { adventureId } = embark;
  const adventure = state.adventures.get(adventureId);
  if (!adventure)
    throw new Error();
  return adventure;
}

export const calculateAdventureEmbarkResults = (
  embark/*: AdventureEmbark*/,
  state/*: GameState*/
)/*: AdventureEmbarkResults*/ => {
  const { embarkedPower, embarkStartTime } = embark;
  const adventure = getEmbarkAdventure(embark, state);
  const defeatIndex = adventure.stages.findIndex(stage => stage.difficulty > embarkedPower);
  const success = defeatIndex === -1;
  const finishTimes = calculateStageFinishTimes(adventure.stages);

  const finalStageIndex = success ? adventure.stages.length - 1 : defeatIndex;

  const advancedStages = adventure.stages.slice(0, finalStageIndex + 1);
  const loot = advancedStages.map(s => s.loot).filter(Boolean);

  const projectedEndTime = finishTimes[success ? (adventure.stages.length -1) : defeatIndex];
  const realEndTime = success ? projectedEndTime : finishTimes[defeatIndex];

  const events = [
    {
      type: 'depart',
      id: nanoid(),
      timestamp: embarkStartTime,
    },
    ...advancedStages.map((stage, stageIndex) => ({
      type: 'advance',
      id: nanoid(),
      stageId: stage.id,
      timestamp: finishTimes[stageIndex] + embarkStartTime,
    })),
    {
      type: 'finish',
      id: nanoid(),
      success,
      timestamp: realEndTime + embarkStartTime,
    }
  ];

  return {
    ...embark,
    adventure,
    success,
    events,

    advancedStages,
    loot,

    projectedEndTime,
    realEndTime,
  }
}

/**
 * What stage of the adventure were you defeated?
 */
export const calculateEmbarkEndIndex = (embark/*: AdventureEmbark*/, state/*: GameState*/)/*: number*/ => {
  const { embarkedPower } = embark;
  const adventure = getEmbarkAdventure(embark, state);
  const defeatIndex = adventure.stages.findIndex(stage => stage.difficulty > embarkedPower);
  if (defeatIndex === -1)
    return adventure.stages.length - 1;
  return defeatIndex;
}
export const calculateSuccess = (embark/*: AdventureEmbark*/, state/*: GameState*/)/*: boolean*/ => {
  const { embarkedPower } = embark;
  const adventure = getEmbarkAdventure(embark, state);
  return adventure.stages.every(stage => stage.difficulty <= embarkedPower);
}
export const calculateSuccessStages = (embark/*: AdventureEmbark*/, state/*: GameState*/)/*: AdventureStage[]*/ => {
  const { embarkedPower } = embark;
  const adventure = getEmbarkAdventure(embark, state);
  const defeatIndex = adventure.stages.findIndex(stage => stage.difficulty > embarkedPower);
  if (defeatIndex === -1)
    return adventure.stages;
  return adventure.stages.slice(0, defeatIndex);
};

export const useIsEmbarked = (events/*: AdventureEvent[]*/)/*: boolean*/ => {
  const [isEmbarked, setIsEmbarked] = useState/*:: <boolean>*/(false);

  useEffect(() => {
    const now = Date.now();
    const mostRecentDepartOrFinish = [...events].reverse()
      .filter(e => e.timestamp < now)
      .find(e => {
        switch (e.type) {
          default:
            return false;
          case 'depart':
          case 'finish':
            return true;
        }
      });
    const isEmbarked = mostRecentDepartOrFinish && mostRecentDepartOrFinish.type === 'depart';
    setIsEmbarked(!!isEmbarked);

    const timeoutIds = events.map(event => {
      const duration = event.timestamp - now;
      if (duration <= 0)
        return null;
      return setTimeout(() => {
        switch (event.type) {
          case 'finish':
            setIsEmbarked(false);
          case 'depart':
            setIsEmbarked(true);
        }
      }, duration);
    });
    return () => {
      timeoutIds.map(clearTimeout)
    }
  }, [events])

  return isEmbarked;
}

export const getEmbarkEdges = (
  embark/*: AdventureEmbark*/,
  state/*: GameState*/
)/*: { start: GameTimeMs, end: GameTimeMs }*/ => {
  const endIndex = calculateEmbarkEndIndex(embark, state);
  const adventure = getEmbarkAdventure(embark, state);
  const finishTimes = calculateStageFinishTimes(adventure.stages);

  const endTime = finishTimes[endIndex];

  return {
    start: embark.embarkStartTime,
    end: embark.embarkStartTime + endTime
  };
}
export const getExpectedEmbarkEdges = (
  embark/*: AdventureEmbark*/,
  state/*: GameState*/
)/*: { start: GameTimeMs, end: GameTimeMs }*/ => {
  const adventure = getEmbarkAdventure(embark, state);
  const finishTimes = calculateStageFinishTimes(adventure.stages);

  const endTime = finishTimes[adventure.stages.length - 1];

  return {
    start: embark.embarkStartTime,
    end: embark.embarkStartTime + endTime
  };
}