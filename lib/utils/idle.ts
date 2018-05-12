export default (cb: () => any) => (window as any).requestIdleCallback(cb);
