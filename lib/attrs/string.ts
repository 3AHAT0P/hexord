import { attribute } from "./";

const toString = (value: any = null): string => {
  if (value == null) return null;
  return String(value);
};

export default () => {
  return attribute(toString, String.valueOf);
};
