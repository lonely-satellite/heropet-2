// @flow strict
/*::
import type { Component } from '@lukekaalim/act';
import type { Adventure, AdventureID } from "./adventures/generator";
import type { Hero } from "./hero";
import type { Loot } from "./loot";
import type { AdventureReport } from "./adventures/report";
*/

import { h, useEffect, useMemo, useRef, useState } from "@lukekaalim/act"
import { repeat } from "./utils"
import {
  calcAdventureDuration,
  createRandomAdventure,
} from "./adventures/generator";
import { GameOverlay, PhoneSim } from "./layout";
import { generateLoot } from "./loot/generator";
import { generateAdventureReport } from "./adventures/report";

const generateAdventures = () => {
  return [
    repeat(i => createRandomAdventure(0), Math.random() * 10),
    repeat(i => createRandomAdventure(5), Math.random() * 5),
    repeat(i => createRandomAdventure(10), Math.random() * 2),
  ].flat(1);
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
  const [loot, setLoot] = useState/*:: <Loot[]>*/([
    generateLoot("Simple", "0"),
    generateLoot("Simple", "0"),
    generateLoot("Simple", "0"),
  ]);
  const [adventures, setAdventures] = useState/*:: <$ReadOnlyArray<Adventure>>*/(generateAdventures);
  const adventureMap = new Map(adventures.map(a => [a.id, a]));
  const [embark, setEmbark] = useState/*:: <?{ id: AdventureID, departed: number }>*/(null);
  const [report, setReport] = useState/*:: <?AdventureReport>*/(null)

  const onClickAdventureEmbark = (adventure) => () => {
    setEmbark({
      id: adventure.id,
      departed: Date.now(),
    })
  };
  const embarkedAdventure = embark && adventureMap.get(embark.id);
  const totalPower = loot.reduce((p, l) => l.heroPower + p, 0);

  useEffect(() => {
    if (!embark)
      return;
    if (!embarkedAdventure)
      return;

    const timeUntilReturn = embark.departed + (calcAdventureDuration(embarkedAdventure)) - Date.now();

    const report = generateAdventureReport(embarkedAdventure, totalPower);

    const completedStages = [];
    for (const stage of embarkedAdventure.stages) {
      if (stage.difficulty <= totalPower)
        completedStages.push(stage)
    }
    
    const id = setTimeout(() => {
      setEmbark(null);
      setAdventures(generateAdventures())
      setReport(report);
      setLoot(l => [
        ...l,
        ...completedStages.map(s => s.loot).filter(Boolean)
      ])
    }, timeUntilReturn);

    return () => {
      clearTimeout(id);
    }
  }, [embark, embarkedAdventure, totalPower])

  

  return [
    h(PhoneSim, {}, [
      h(VibratingCat, { totalPower }),
      'girl we making game\'s???',
      h(GameOverlay, {}, [
        h('div', { style: { overflowY: 'auto' } }, [
          h('hr'),
          h('div', {}, [
            !!report && [
              h('h4', {}, 'Last Adventure'),
              h('div', { style: { fontWeight: 'bold' } }, `Went on an Adventure to ${report.adventure.name}`),
              h('ol', {}, [
                report.successList.map(s => {
                  const loot = s.loot;
                  return h('li', {}, [
                    s.reason,
                    !!loot && [
                      ` and found the `,
                      h('span', { style: { fontWeight: 'bold' } }, loot.name),
                      ` because `,
                      h('span', { style: { fontStyle: 'italic' } }, loot.heroPowerReason),
                    ]
                  ]);
                }),
              ]),
              !!report.failure && h('div', { style: { backgroundColor: 'red' } }, [
                report.failure.reason
              ]),
              h('hr'),
            ]
          ]),
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
              h('span', {}, `(${Math.ceil(calcAdventureDuration(adventure) / 1000)} seconds, difficulty: ${adventure.difficulty})`),
              ' ',
              h('button', { onClick: onClickAdventureEmbark(adventure), disabled: !!embark }, 'Embark!')
            ]))
          ]),
          h('hr'),
          h('h4', {}, 'Loot'),
          h('ul', {}, [
            loot.map(loot => h('li', {}, [
              `The +${loot.heroPower} ${loot.name}`,
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
      const rotation = totalPower > 20 ? (performance.now() / 1000) * totalPower : 0;

      image.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
      if (totalPower > 10)
        image.style.filter = `hue-rotate(${performance.now() / 500 * totalPower}deg)`
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
      const duration = calcAdventureDuration(adventure);
      const timeUntilReturn = embark.departed + (duration) - Date.now();
      const secondsUntilReturn = Math.floor(timeUntilReturn / 1000);

      const progress = (Date.now() - embark.departed) / duration;

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