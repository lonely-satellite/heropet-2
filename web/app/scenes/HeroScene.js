// @flow strict
/*::
import type { Component } from "@lukekaalim/act";
*/

import { calcHeroPower } from "../hero/hero";
import { calculateCurrentLoot, useCurrentLoot } from "../loot/loot";
import { useGameState } from "../state";
import { h, useState } from "@lukekaalim/act";

import styles from './HeroScene.module.css';

export const HeroScene/*: Component<>*/ = () => {
  const [game, dispatch] = useGameState();
  const loot = useCurrentLoot(game);

  const [selectedLoot, setSelectedLoot] = useState(null);

  const onClickLoot = (loot) => () => {
    setSelectedLoot(loot.id);
  }
  const onPlaceLoot = (x, y) => () => {
    if (!selectedLoot)
      return;
    dispatch({ type: 'place-decoration', loot: selectedLoot, place: { x, y } })
    setSelectedLoot(null);
  }
  const lootByLocation = new Map([...game.roomDecorations.entries()]
    .map(([lootId, location]) => {
      if (!location)
        return null;
      return [[location.x, location.y].join(':'), lootId]
    })
    .filter(Boolean)
  );
  

  return [
    h('div', { class: styles.heroSceneRoomContainer }, [
      h('div', { class: styles.heroSceneRoomGrid }, [
        Array.from({ length: 5 }).map((_, y) =>
          h('div', { class: styles.heroSceneRoomRow },
            Array.from({ length: 5 }).map((_, x) => {
              const lootId = lootByLocation.get([x, y].join(':'))
              const lootInPlace = !!lootId && loot.find(l => l.id === lootId) || null;
              return h('div', { class: styles.heroSceneRoomCell },
                h('button', { class: styles.heroSceneRoomButton, onClick: onPlaceLoot(x, y) }, lootInPlace ? lootInPlace.name : ' '))
            })))
      ])
    ]),
    h('div', { style: { position: 'relative' } }, [
      'Hero Scene',
      h('div', {}, calcHeroPower(game.hero)),
      h('ul', {}, loot.map(l => h('li', {}, h('button', { onClick: onClickLoot(l), disabled: selectedLoot === l.id }, l.name)))),
    ])
  ];
};