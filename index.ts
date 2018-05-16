import "reflect-metadata";

// import { Application } from './app';
// import { inject } from './lib/utils';

// (async () => {
//   const app = new Application();

//   await app.ready;

//   const actionStore = inject('ActionStore');
//   const turnStore = inject('TurnStore');
//   const subjectStore = inject('SubjectStore');

//   await subjectStore.createOne({
//     id: '1',
//     name: 'MyPerson',
//     strength: 10,
//     constitution: 10,
//     dexterity: 10,
//     intelligence: 10,
//     perception: 10,
//     luck: 10,
//   });

//   window.playerId = '1';

//   // await actionStore.createOne({id: '1', turnId: '1', subjectId: '1'});
//   // await actionStore.createOne({id: '2', turnId: '1', subjectId: '1'});
//   //
//   // const turn = await turnStore.createOne({id: '1'});
//   //
//   // console.log(turn, await turn.actions);
// })();