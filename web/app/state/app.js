// @flow strict

/*md AppState
App state is dedicated to describing
how the "application", like the UI bits,
input bits and controls for the application
is structured.

For details on the "game state", like your
hero stats and loot, take a look at
[Game State](/state/game)
*/
/*::
export type AppState = {
  roomFocus: 'hero' | 'tavern'
};

export type AppAction =
  | { type: 'room-focus', focus: AppState["roomFocus"] }
*/

export const reduceAppState = (state/*: AppState*/, action/*: AppAction*/)/*: AppState*/ => {
  switch (action.type) {
    case 'room-focus':
      return { ...state, roomFocus: action.focus }
    default:
      return state;
  }
}
