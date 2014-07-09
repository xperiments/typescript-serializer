declare module io.xperiments.utils.serialize {
    interface ISerializerHelper {
        "@serializer": string;
    }
    interface ISerializable {
        writeObject(): any;
        readObject(obj: ISerializable): void;
        stringify(): string;
        parse(string: string): void;
    }
    interface ISerializableRegister {
        keys: string[];
        serializerData: typeof SerializerHelper;
    }
    interface ISerializableRegisters {
        [key: string]: ISerializableRegister;
    }
    class SerializerHelper implements ISerializerHelper {
        public "@serializer": string;
    }
    class Serializable implements ISerializable {
        public writeObject(): ISerializable;
        public readObject(obj: ISerializable): ISerializable;
        public stringify(pretty?: boolean): string;
        public parse(string: string): void;
    }
    class Serializer {
        private static serializableRegisters;
        static registerClass(classContext: () => any, SerializerDataClass: typeof SerializerHelper): void;
        static writeObject(instance: ISerializable): ISerializable;
        static readObject(instance: ISerializable, obj: ISerializable): ISerializable;
        private static writeArray(array);
        private static writeAny(obj, key, value, SerializerDataClass?, fromArray?);
        private static readArray(array);
        private static readAny(element, key, target, SerializerDataClass);
        private static getMixedNames(SerializerDataClass);
        private static isExternalizable(instance);
        private static getClassFromPath(name, context?);
        private static getClass(name, context?);
        private static getSerializableRegister(instance);
        private static getSerializableRegisterData(instance);
        private static isNumeric(n);
    }
}
