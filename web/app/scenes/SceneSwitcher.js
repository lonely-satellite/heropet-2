// @flow strict

/*::
import type { Component } from "@lukekaalim/act";
*/

import { h } from "@lukekaalim/act";
import { HeroScene } from "./HeroScene";
import { TavernScene } from "./TavernScene";

/*::
type SceneSwitcherProps = {
  scene: 'hero' | 'tavern'
}
*/

export const SceneSwitcher/*: Component<SceneSwitcherProps>*/ = ({ scene }) => {
  switch (scene) {
    case 'hero':
      return h(HeroScene);
    default:
      return 'How did you get here?';
    case 'tavern':
      return h(TavernScene)
  }
};