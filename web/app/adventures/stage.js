// @flow strict
/*::
import type { GameTimeMs } from "../App";
import type { Loot } from "../loot/generator";
import type { Monster } from "../monsters/monster";
import type { AdventureID } from "./generator";
*/
import { generateLoot } from "../loot/generator";
import { generateMonster } from "../monsters/monster";
import { randomInclusiveRange } from "../utils/random";

import { nanoid } from "nanoid";

/*::
export type AdventureStageID = string;
export type AdventureStage = {
  id: AdventureStageID,

  difficulty: number,
  duration: GameTimeMs,
  guardianMonster: Monster,

  loot: null | Loot,
};
*/

export const generateAdventureStage = (
  adventureId/*: AdventureID*/,
  adventureAdjective/*: string*/,
  baseDifficulty/*: number*/
)/*: AdventureStage*/ => {
  const localDifficulty = randomInclusiveRange(-5, 5);
  const difficulty = Math.floor(baseDifficulty + localDifficulty);
  const loot = localDifficulty > 1 && generateLoot(adventureAdjective, adventureId) || null;

  return {
    id: nanoid(),
    difficulty,
    duration: (localDifficulty + 5) * 1000,
    guardianMonster: generateMonster(),
    loot,
  }
}

export const generateBossAdventureStage = (
  adventureId/*: AdventureID*/,
  adventureAdjective/*: string*/,
  baseDifficulty/*: number*/
)/*: AdventureStage*/ => {
  const localDifficulty = randomInclusiveRange(0, 10);
  const difficulty = Math.floor(baseDifficulty + localDifficulty);
  const loot = generateLoot(adventureAdjective, adventureId);

  return {
    id: nanoid(),
    difficulty,
    duration: localDifficulty * 1000,
    guardianMonster: generateMonster(),
    loot,
  }
}

/**
 * Calculate the time (relative to the start of an adventure) that a particular stage would
 * "finish" at.
 */
export const calculateStageFinishTimes = (stages/*: AdventureStage[]*/)/*: GameTimeMs[]*/ => {
  const finishTimes = [];
  let currentLength = 0;
  for (const stage of stages) {
    currentLength += stage.duration;
    finishTimes.push(currentLength);
  }
  return finishTimes;
};