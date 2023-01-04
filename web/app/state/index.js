// @flow strict

/*md State
Rules for state:

1. No recursion. References should be perfectly serializable.
If you need to reference something in multiple places,
define and use a consistent id. UUID's are a great choice.
*/

/*::
import type {
  GameAction,
  GameState,
} from "./game";
import type { Context, SetValue } from "@lukekaalim/act";
*/

import { reduceGameState } from "./game";
import { createContext, useContext } from "@lukekaalim/act";

export * from './app';
export * from './game';

export const gameStateContext/*: Context<?[GameState, SetValue<GameState>]>*/ = createContext(null);
export const useGameState = ()/*: [GameState, GameAction => void]*/ => {
  const gameStatePair = useContext(gameStateContext);
  if (!gameStatePair)
    throw new Error();
  
  const [state, setState] = gameStatePair;
  const dispatch = (action) => {
    setState(state => reduceGameState(state, action));
  }
  return [state, dispatch];
};