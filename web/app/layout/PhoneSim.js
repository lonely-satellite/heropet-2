// @flow strict
/*::
import type { Component } from "@lukekaalim/act/component";
*/

import { h } from "@lukekaalim/act";
import styles from './PhoneSim.module.css';

/*::

*/

export const PhoneSim/*: Component<>*/ = ({ children }) => {
  return h('div', { className: styles.phoneSim }, [
    h('div', { className: styles.phoneSimScreen }, [
      children
    ])
  ]);
};