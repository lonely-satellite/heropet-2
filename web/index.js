// @flow strict
import { App } from "./app/App";
import { h } from '@lukekaalim/act';
import { render } from '@lukekaalim/act-web';


export const main = () => {
  render(h(App), (document.body/*: any*/));
};

main();