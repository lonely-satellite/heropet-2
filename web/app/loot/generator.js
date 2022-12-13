// @flow strict
/*::
import type { Adventure } from "../adventures";
import type { AdventureID } from "../adventures/generator";
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

  aquiredFrom: AdventureID,
};
*/

export const generateLoot = (
  externalAdjective/*: string*/,
  aquiredFrom/*: AdventureID*/,
)/*: Loot*/ => {
  const object = randomElement(lootData.object);
  const objectAdjective = randomElement([...lootData.adjectives, ...adventureData.adjectives]);
  const power = randomElement(lootData.power);
  const reason = randomElement(lootData.reasons);

  const heroPower = Math.floor(Math.random() * 4) + 1;

  return {
    id: nanoid(),
    name: `${externalAdjective}, ${objectAdjective}, ${object} of ${power}`,

    heroPowerReason: reason,
    heroPower,

    aquiredFrom,
  }
}