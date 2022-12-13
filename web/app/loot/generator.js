// @flow strict
/*::
import type { Adventure } from "../adventures";
*/

import { nanoid } from "nanoid";
import { randomElement } from "../utils";

import lootData from './data.json5';
import { adventureData } from "../adventures";


/*::
export type LootID = string;
export type Loot = {
  id: LootID,
  name: string,
  
  heroPowerReason: string,
  heroPower: number,

  aquiredFrom: Adventure,
};
*/

export const generateLoot = (from/*: Adventure*/)/*: Loot*/ => {

  const object = randomElement(lootData.object);
  const objectAdjective = randomElement([...lootData.adjectives, ...adventureData.adjectives]);
  const power = randomElement(lootData.power);
  const reason = randomElement(lootData.reasons);

  const heroPower = Math.floor(Math.random() * 5);

  return {
    id: nanoid(),
    name: `${from.adjective}, ${objectAdjective}, ${object} of ${power}`,

    heroPowerReason: reason,
    heroPower,

    aquiredFrom: from,
  }
}