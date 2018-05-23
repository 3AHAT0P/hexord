declare global {
  interface IHash {
    [key: string]: any;
  }
  abstract class Hash {
    [key: string]: any;
  }
}

export { };