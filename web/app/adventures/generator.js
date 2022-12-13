// @flow strict
import { nanoid } from "nanoid";
import adventureData from './data.json5';
import { randomElement } from "../utils";

/*::
export type AdventureID = string;
export type Adventure = {
  id: AdventureID,
  name: string,
  durationSeconds: number,

  adjective: string,
};
*/

export const createRandomAdventure = ()/*: Adventure*/ => {
  const adjective = randomElement(adventureData.adjectives);
  const location = randomElement(adventureData.locations);

  return {
    id: nanoid(),
    name: `${adjective} ${location}`,
    durationSeconds: Math.round(Math.random() * 10) + 2,

    adjective,
  };
}