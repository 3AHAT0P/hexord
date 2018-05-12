export default function inject(name: string|symbol): any {
  return (window as any)[Symbol.for("app")].services.get(name);
}
