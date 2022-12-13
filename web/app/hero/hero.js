// @flow strict
/*::
import type { Loot } from "../loot/generator";
*/
import { nanoid } from "nanoid";

/*::

export type HeroID = string;
export type Hero = {
  id: HeroID,

  loot: Loot[]
}
*/

export const createHero = ()/*: Hero*/ => ({
  id: nanoid(),

  loot: [],
})