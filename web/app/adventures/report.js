// @flow strict
/*::
import type { Loot } from "../loot/generator";
import type { Monster } from "../monsters/monster";
import type { Adventure } from "./generator";
*/

import {
  generateNegativeResolution,
  generatePositiveResolution,
} from "../monsters/monster";

/*::
export type AdventureReport = {
  adventure: Adventure,
  successList: {
    monster: Monster,
    reason: string,
    loot: ?Loot
  }[],

  failure: ?{ monster: Monster, reason: string }
}
*/

export const generateAdventureReport = (adventure/*: Adventure*/, hero/*: number*/)/*: AdventureReport*/ => {
  const failedStageIndex = adventure.stages.findIndex(s => s.difficulty > hero);
  const succeededStages = adventure.stages.slice(0, failedStageIndex === -1 ? adventure.stages.length : failedStageIndex);
  const failedStage = adventure.stages[failedStageIndex];
  
  console.log(failedStageIndex, succeededStages);

  return {
    adventure,
    successList: succeededStages.map(stage => {
      return {
        monster: stage.guardianMonster,
        reason: generatePositiveResolution(stage.guardianMonster),
        loot: stage.loot,
      }
    }),
    failure: failedStage && {
      monster: failedStage.guardianMonster,
      reason: generateNegativeResolution(failedStage.guardianMonster)
    }
  }
}