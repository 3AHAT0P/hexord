import { Application } from './app';
import { inject } from './lib/utils';

(async () => {
  const app = new Application();

  await app.ready;

  const actionStore = inject('ActionStore');
  const turnStore = inject('TurnStore');

  await actionStore.createOne({id: '1', turnId: '1'});
  await actionStore.createOne({id: '2', turnId: '1'});

  const turn = await turnStore.createOne({id: '1'});

  console.log(turn, await turn.actions);
})();
