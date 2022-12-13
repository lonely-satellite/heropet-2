// @flow strict
/*::
import type { Component } from "@lukekaalim/act";
*/
import { h } from "@lukekaalim/act"
import styles from './GameOverlay.module.css';

export const GameOverlay/*: Component<>*/ = ({ children }) => {
  return h('div', { className: styles.gameOverlay }, [
    h('div', { className: styles.status }, [
      h('button', { style: { padding: '16px' } }, 'Burger'),
      h('button', { className: styles.statusLogRoll }, [
        'Status Log',
      ]),
      h('button', { style: { padding: '16px' } }, 'Weather'),
    ]),

    h('div', { style: { flex: 1 }}, children),

    h('div', { className: styles.gameOverlayBar }, [
      h(BarButton, { text: 'Hero' }),
      h(BarButton, { text: 'Feed' }),
      h(BarButton, { text: 'Equip' }),
      h(BarButton, { text: 'Room' }),
    ])
  ]);
}

const BarButton = ({ text }) => {
  return h('button', { className: styles.barButton }, text)
}