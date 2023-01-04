// @flow strict
/*::
import type { Component } from "@lukekaalim/act/component";
*/

import { h, useEffect, useMemo, useRef } from "@lukekaalim/act";
import { useGameState } from "../state";
import {
  calculateAdventureEmbarkResults,
  getEmbarkEdges,
  getExpectedEmbarkEdges,
  useIsEmbarked,
} from "../adventures/embark";
import { calcAdventureDuration } from "../adventures/generator";
import { isFinishedAdventure, useCurrentEvents } from "../adventures/event";

export const TavernScene/*: Component<>*/ = () => {
  const [game, dispatch] = useGameState();
  const adventures = [...game.adventures.values()];

  const onDepartAdventure = (adventure) => {
    dispatch({
      type: 'embark',
      adventureId: adventure.id,
      departure: Date.now()
    })
  }

  const results = useMemo(() => {
    const { currentEmbark } = game;
    if (!currentEmbark)
      return null;

    return calculateAdventureEmbarkResults(currentEmbark, game);
  }, [game]) 
  const events = useCurrentEvents(game);
  const isFinished = isFinishedAdventure(events);


  return [
    'The tavern',
    //h('pre', {}, JSON.stringify({ results }, null, 2)),
    results && h('ol', {}, events.map(event => h('li', {}, h(EventReport, { event, adventure: results.adventure })))),
    h('ul', {}, adventures.map(a => h('li', {}, [
      `${a.name} [${a.difficulty}, ${calcAdventureDuration(a) / 1000}s] `,
      h('button', { onClick: () => onDepartAdventure(a), disabled: !isFinished }, 'Depart')
    ])))
  ]
}

const EventReport = ({ event, adventure }) => {
  switch (event.type) {
    case 'advance':
      const stage = adventure.stages.find(s => s.id === event.stageId);
      if (!stage)
        throw new Error();
      const { loot } = stage;
      if (loot)
        return `${event.type} (defeated ${stage.guardianMonster.name}, gained ${loot.name})`
      return `${event.type} (defeated ${stage.guardianMonster.name})`
    case 'finish':
      if (event.success)
        return `${event.type} (returned victorious)`;
      return `${event.type} (returned defeated)`;
    default:
      return event.type;
  }
}