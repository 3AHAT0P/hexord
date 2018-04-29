export default () => {
  const handlers = {};
  const promise = new Promise((resolve, reject) => {
    handlers.resolve = resolve;
    handlers.reject = reject;
  });
  promise.resolve = handlers.resolve;
  promise.reject = handlers.reject;
  return promise;
};
