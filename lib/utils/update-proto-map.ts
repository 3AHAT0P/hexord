interface IAnyConstructor {
  new: () => any;
}

interface IWithProtoMapConstructor extends IAnyConstructor {
  _protoMap: Map<string, boolean>;
}

export default (BaseClass: IWithProtoMapConstructor, className: string): boolean => {
  // console.log(BaseClass._protoMap, BaseClass._protoMap.has(className))
  if (!BaseClass.hasOwnProperty("_protoMap")) {
    const ProtoBaseClass = Reflect.getPrototypeOf(BaseClass) as IWithProtoMapConstructor;
    if (ProtoBaseClass.hasOwnProperty("_protoMap"))
      BaseClass._protoMap = new Map(ProtoBaseClass._protoMap);
    else
      BaseClass._protoMap = new Map();
    BaseClass._protoMap.set(className, true);
    return true;
  } else if (!BaseClass._protoMap.has(className)) {
    BaseClass._protoMap.set(className, true);
    return true;
  } else {
    return false;
  }
};
