// @flow strict
/*::
import type { AdventureStage } from "./stage";
import type { GameTimeMs } from "../App";
*/
import { nanoid } from "nanoid";
import adventureData from './data.json5';
import { randomElement, randomInclusiveRange, repeat } from "../utils";
import { generateAdventureStage, generateBossAdventureStage } from "./stage";

/*::
export type AdventureID = string;
export type Adventure = {
  id: AdventureID,
  name: string,
  
  stages: AdventureStage[],

  adjective: string,
  difficulty: number,
};
*/

export const createRandomAdventure = (difficulty/*: number*/)/*: Adventure*/ => {
  const id = nanoid();
  const adjective = randomElement(adventureData.adjectives);
  const location = randomElement(adventureData.locations);

  const stages = [
    ...repeat(() => generateAdventureStage(id, adjective, difficulty), randomInclusiveRange(1, 4)),
    generateBossAdventureStage(id, adjective, difficulty),
  ];

  return {
    id: nanoid(),
    name: `${adjective} ${location}`,

    adjective,
    stages,
    difficulty,
  };
}

export const calcAdventureDuration = (adventure/*: Adventure*/)/*: GameTimeMs*/ => {
  return adventure.stages.reduce((acc, curr) => acc + curr.duration, 0);
}