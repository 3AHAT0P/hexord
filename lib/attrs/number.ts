import { attribute } from "./";

const toNumber = (value: any = null): number => {
  if (value == null) return null;
  const result = Number(value);
  if (isNaN(result)) return null;
  return result;
};

export default () => {
  return attribute(toNumber, Number.valueOf);
};
