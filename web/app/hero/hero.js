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

export const calcHeroPower = (hero/*: Hero*/)/*: number*/ => {
  return hero.loot.reduce((a, c) => a + c.heroPower, 0)
}