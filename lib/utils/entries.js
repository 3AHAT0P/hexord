export default function* (obj) {
  let source = obj;
  const prototypes = [source];
  while (true) {
    const proto = Reflect.getPrototypeOf(source);
    if (proto.hasOwnProperty('constructor')) break;
    prototypes.push(proto);
    source = proto;
  }

  while (prototypes.length > 0) {
    const proto = prototypes.pop();
    yield* Object.entries(proto);
  }
}
