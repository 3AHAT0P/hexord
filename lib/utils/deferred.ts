interface IDeferred<T> extends Promise<T> {
  resolve: () => any;
  reject: () => any;
}

export default <T>() => {
  const handlers: any = {};
  const deferred = new Promise<T>((resolve, reject) => {
    handlers.resolve = resolve;
    handlers.reject = reject;
  }) as IDeferred<T>;
  deferred.resolve = handlers.resolve;
  deferred.reject = handlers.reject;
  return deferred;
};
