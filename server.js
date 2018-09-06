/* eslint-disable import/no-cycle */
import './server-register';

const startupPromise = new Promise(Meteor.startup);
const pageLoadCallbacks = new Set();

export const onPageLoad = (pCallback) => {
  try {
    if (typeof pCallback === 'function') {
      pageLoadCallbacks.add(pCallback);
    }

    // Return the pCallback so that it can be more easily removed later.
    return pCallback;
  } catch (pError) {
    throw new Meteor.Error('Server/OnPageLoad', pError.stack);
  }
};

onPageLoad.remove = (pCallback) => pageLoadCallbacks.delete(pCallback);

onPageLoad.clear = () => pageLoadCallbacks.clear();

onPageLoad.chain = (pHandler) =>
  startupPromise.then(() => {
    let promise = Promise.resolve();
    pageLoadCallbacks.forEach((pCallback) => {
      promise = promise.then(() => pHandler(pCallback));
    });
    return promise;
  });

export default onPageLoad;
