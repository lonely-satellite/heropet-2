// @flow strict
import { nanoid } from "nanoid";
import { randomElement } from "../utils";
import data from './data.json5'; 

/*::
export type MonsterID = string;
export type Monster = {
  id: MonsterID,
  name: string,
};
*/

export const generateMonster = ()/*: Monster*/ => {
  const adjective = randomElement(data.beastadjective);
  const beast = randomElement(data.beast);

  return {
    id: nanoid(),
    name: `${adjective} ${beast}`,
  }
}

export const generatePositiveResolution = (monster/*: Monster*/)/*: string*/ => {
  const resolution = randomElement(data.posresolution);
  return `You have ${resolution} the ${monster.name}`
}

export const generateNegativeResolution = (monster/*: Monster*/)/*: string*/ => {
  const resolution = randomElement(data.negresolution);
  return `You have ${resolution} the ${monster.name}`
}