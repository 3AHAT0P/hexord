export default <T>(BaseClass = Object) => {
  abstract class CreatableMixin extends BaseClass {
    public static async create() {
      const Class: any = this;
      const instance = new Class();
      await instance._init();
      return instance as T;
    }

    protected abstract _init(): any;
  }
  return CreatableMixin;
};
