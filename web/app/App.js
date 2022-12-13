// @flow strict
/*::
import type { Component } from '@lukekaalim/act';
import type { Adventure, AdventureID } from "./adventures/generator";
import type { Hero } from "./hero";
import type { Loot } from "./loot";
*/

import { h, useEffect, useMemo, useRef, useState } from "@lukekaalim/act"
import { repeat } from "./utils"
import { createRandomAdventure } from "./adventures/generator";
import { GameOverlay, PhoneSim } from "./layout";
import { generateLoot } from "./loot/generator";

const generateAdventures = () => {
  return repeat(createRandomAdventure, Math.random() * 10)
}

/*::
export type GameTimeMs = number;

export type AppState = {
  hero: Hero,
  adventures: $ReadOnlyArray<Adventure>,
  embark: null | { id: AdventureID, departed: GameTimeMs };
};
export type AppAction =
  | { type: 'embark', adventureId: AdventureID, departure: GameTimeMs }
  | { type: '' }
*/

export const App/*: Component<>*/ = () => {
  const [loot, setLoot] = useState/*:: <Loot[]>*/([]);
  const [adventures, setAdventures] = useState/*:: <$ReadOnlyArray<Adventure>>*/(generateAdventures);
  const adventureMap = new Map(adventures.map(a => [a.id, a]));
  const [embark, setEmbark] = useState/*:: <?{ id: AdventureID, departed: number }>*/(null);

  const onClickAdventureEmbark = (adventure) => () => {
    setEmbark({
      id: adventure.id,
      departed: Date.now(),
    })
  };
  const embarkedAdventure = embark && adventureMap.get(embark.id);

  useEffect(() => {
    if (!embark)
      return;
    if (!embarkedAdventure)
      return;

    const timeUntilReturn = embark.departed + (embarkedAdventure.durationSeconds * 1000) - Date.now();
    const id = setTimeout(() => {
      setEmbark(null);
      setAdventures(generateAdventures())
      setLoot(l => [...l, generateLoot(embarkedAdventure)])
    }, timeUntilReturn);

    return () => {
      clearTimeout(id);
    }
  }, [embark, embarkedAdventure])

  const totalPower = loot.reduce((p, l) => l.heroPower + p, 0);

  return [
    h(PhoneSim, {}, [
      h(VibratingCat, { totalPower }),
      'girl we making game\'s???',
      h(GameOverlay, {}, [
        h('div', { style: { overflowY: 'auto' } }, [
          h('hr'),
          h('div', {}, [
            !!embark && !!embarkedAdventure && [
              h('h4', {}, 'Status'),
              h(EmbarkCountdown, { embark, adventure: embarkedAdventure }),
              h('div', { style: { fontWeight: 'bold' } }, `On an Adventure to ${embarkedAdventure.name}`),
              h('hr'),
            ]
          ]),
          h('h4', {}, 'Adventures'),
          h('ul', {}, [
            [...adventures.values()].map(adventure => h('li', { key: adventure.id }, [
              adventure.name,
              ' ',
              h('span', {}, `(${Math.ceil(adventure.durationSeconds)} seconds.)`),
              ' ',
              h('button', { onClick: onClickAdventureEmbark(adventure), disabled: !!embark }, 'Embark!')
            ]))
          ]),
          h('hr'),
          h('h4', {}, 'Loot'),
          h('ul', {}, [
            loot.map(loot => h('li', {}, [
              `The +${loot.heroPower} ${loot.name}`,
              h('div', {}, `Looted because ${loot.heroPowerReason}`)
            ]))
          ]),
          h('hr'),
          h('h4', {}, `Power`),
          `Total power: ${totalPower}`
        ]),
            
      ])
    ]),
  ]
}

const VibratingCat = ({ totalPower }) => {
  const ref = useRef/*:: <?HTMLImageElement>*/();

  useEffect(() => {
    const vibrateAmount = Math.floor(totalPower / 4);

    const { current: image } = ref;
    if (!image)
      return; 

    const animate = () => {
      const x = (Math.random() * (vibrateAmount)) - (vibrateAmount/2);
      const y = (Math.random() * (vibrateAmount)) - (vibrateAmount/2);
      image.style.transform = `translate(${x}px, ${y}px)`
      id = requestAnimationFrame(animate);
    };
    let id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [totalPower])

  return h('img', { ref, src: './assets/catbard.png' });
}

const EmbarkCountdown = ({ embark, adventure }) => {
  const ref = useRef/*:: <?HTMLElement>*/();
  const progressRef = useRef/*:: <?HTMLProgressElement>*/();
  useEffect(() => {
    const { current: dateElement } = ref;
    const { current: progressElement } = progressRef;
    if (!dateElement || !progressElement)
      return;
    
    const id = setInterval(() => {
      const timeUntilReturn = embark.departed + (adventure.durationSeconds * 1000) - Date.now();
      const secondsUntilReturn = Math.floor(timeUntilReturn / 1000);

      const progress = (Date.now() - embark.departed) / (adventure.durationSeconds * 1000);

      progressElement.value =  Math.min(100, Math.max(0, progress * 100));
      dateElement.textContent = secondsUntilReturn.toString();
    }, 100);
    return () => {
      clearInterval(id);
    }
  }, []);

  return [
    h('date', { ref }),
    h('progress', { ref: progressRef, min: '0', max: '100', value: 0 }),
  ]
}