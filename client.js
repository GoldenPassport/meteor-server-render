import { ClientSink } from './client-sink';

let promise = new Promise(Meteor.startup);
const sink = new ClientSink();

export const { updateHeadElementByTag } = sink;

export const { updateBodyElementById } = sink;

export const onPageLoad = (pCallback) => {
  try {
    promise = promise.then(() => pCallback(sink));
  } catch (pError) {
    throw new Meteor.Error('Client/OnPageLoad', pError.stack);
  }
};

export default onPageLoad;
