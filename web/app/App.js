// @flow strict
/*::
import type { Component } from '@lukekaalim/act';
import type { Adventure, AdventureID } from "./adventures/generator";
*/

import { h, useEffect, useMemo, useRef, useState } from "@lukekaalim/act"
import { repeat } from "./utils"
import { createRandomAdventure } from "./adventures/generator";

const generateAdventures = () => {
  return repeat(createRandomAdventure, Math.random() * 10)
}

export const App/*: Component<>*/ = () => {
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
    }, timeUntilReturn);

    return () => {
      clearTimeout(id);
    }
  }, [embark, embarkedAdventure])

  return [
    'girl we making game\'s???',
    h('div', {}, [
      !!embark && !!embarkedAdventure && [
        h(EmbarkCountdown, { embark, adventure: embarkedAdventure }),
        h('span', { style: { fontWeight: 'bold' } }, `On an Adventure to ${embarkedAdventure.name}`),
      ]
    ]),
    h('ul', {}, [
      [...adventures.values()].map(adventure => h('li', { key: adventure.id }, [
        adventure.name,
        ' ',
        h('button', { onClick: onClickAdventureEmbark(adventure), disabled: !!embark }, 'Embark!')
      ]))
    ]),
    h('img', { src: './assets/catbard.png' }),
  ]
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