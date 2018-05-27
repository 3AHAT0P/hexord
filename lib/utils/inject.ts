export default <T>(name: string|symbol): T => {
  return (window as any)[Symbol.for('app')].services.get(name);
};
