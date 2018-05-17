interface IDeferred<T> {
  resolve: () => any;
  reject: () => any;
  promise: Promise<T>;
}

export default <T>() => {
  const deferred: any = {};
  deferred.promise = new Promise<T>((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred as IDeferred<T>;
};
