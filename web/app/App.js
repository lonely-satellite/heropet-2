// @flow strict
/*::
import type { Component } from '@lukekaalim/act';
*/

import { h } from "@lukekaalim/act"

export const App/*: Component<>*/ = () => {
  return [
    'Welcome to hero pet!',
    h('img', { src: './assets/catbard.png' }),
  ]
}