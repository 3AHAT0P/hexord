export default async (cb: () => any) => {
  await new Promise((resolve) => setTimeout(resolve));
  await cb();
};
