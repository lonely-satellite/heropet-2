// @flow strict
/*::
import type { Component } from '@lukekaalim/act';
import type { Adventure, AdventureID } from "./adventures/generator";
import type { Hero } from "./hero";
import type { Loot } from "./loot";
import type { AdventureReport } from "./adventures/report";
import type { GameState } from "./state/game";
import type { AppState } from "./state/app";
*/

import { h, useEffect, useMemo, useRef, useState } from "@lukekaalim/act"
import { repeat } from "./utils"
import {
  calcAdventureDuration,
  createRandomAdventure,
} from "./adventures/generator";
import { GameOverlay, PhoneSim } from "./layout";
import { generateLoot } from "./loot/generator";
import { calcHeroPower, createHero } from "./hero/hero";
import { gameStateContext } from "./state";
import { SceneSwitcher } from "./scenes";
import { useCurrentEvents } from "./adventures/event";

const generateAdventures = () => {
  return [
    repeat(i => createRandomAdventure(0), Math.random() * 10),
    repeat(i => createRandomAdventure(5), Math.random() * 5),
    repeat(i => createRandomAdventure(10), Math.random() * 2),
  ].flat(1);
}

/*::
export type GameTimeMs = number;
*/

export const App/*: Component<>*/ = () => {
  const [gameState, setGameState] = useState/*:: <GameState>*/(() => ({
    hero: { 
      ...createHero(),
      loot: [generateLoot('Starting', '')]
    },
    adventures: new Map([
      ...generateAdventures()
        .map(a => [a.id, a])
    ]),
  
    pastEmbarks: [],
    currentEmbark: null,
  
    roomDecorations: new Map(),
  }));
  const [appState, setAppState] = useState/*:: <AppState>*/(() => ({
    roomFocus: 'tavern'
  }))


  const heroPower = calcHeroPower(gameState.hero);
  const onRoomClick = () => {
    const nextFocus = appState.roomFocus === 'hero' ? 'tavern' : 'hero';
    setAppState({
      roomFocus: nextFocus,
    });
  };

  return [
    h(PhoneSim, {}, [
      h(gameStateContext.Provider, { value: [gameState, setGameState] }, [
        h(VibratingCat, { totalPower: heroPower }),
        'girl we making game\'s???',
        h(GameOverlay, { onRoomClick }, [
          h(SceneSwitcher, { scene: appState.roomFocus })
        ])
      ]),
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