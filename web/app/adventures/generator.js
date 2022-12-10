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
};
*/

const createRandomAdventureName = () => {
  const adjective = randomElement(adventureData.adjectives)
  const location = randomElement(adventureData.locations);

  return `${adjective} ${location}`;
};

export const createRandomAdventure = ()/*: Adventure*/ => {
  return {
    id: nanoid(),
    name: createRandomAdventureName(),
    durationSeconds: Math.round(Math.random() * 5) + 10
  };
}