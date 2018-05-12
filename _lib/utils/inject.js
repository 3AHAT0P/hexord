export default function inject(name) {
  return window[Symbol.for('app')].services.get(name);
}
