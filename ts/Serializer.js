var io;
(function (io) {
    (function (xperiments) {
        (function (utils) {
            (function (serialize) {
                

                

                

                

                /**
                * The interface any ClassSerializer extends
                */
                var SerializerHelper = (function () {
                    function SerializerHelper() {
                    }
                    return SerializerHelper;
                })();
                serialize.SerializerHelper = SerializerHelper;

                /**
                *	The base class all serializable classes must extend
                */
                var Serializable = (function () {
                    function Serializable() {
                    }
                    /**
                    * Serializes the current instance & returns a transportable object
                    * @returns {ISerializable}
                    */
                    Serializable.prototype.writeObject = function () {
                        return Serializer.writeObject(this);
                    };

                    /**
                    * Rehidrates the current instance with the values provided by the passed object
                    * @param obj
                    */
                    Serializable.prototype.readObject = function (obj) {
                        return Serializer.readObject(this, obj);
                    };

                    /**
                    * Serializes the current instance & returns a JSON string representation
                    * @param pretty
                    * @returns {string}
                    */
                    Serializable.prototype.stringify = function (pretty) {
                        if (typeof pretty === "undefined") { pretty = false; }
                        return JSON.stringify(Serializer.writeObject(this), null, pretty ? 4 : 0);
                    };

                    /**
                    * Rehidrates the current instance with the values provided by the passed JSON string
                    * @param string
                    */
                    Serializable.prototype.parse = function (string) {
                        Serializer.readObject(this, JSON.parse(string));
                    };
                    return Serializable;
                })();
                serialize.Serializable = Serializable;

                /**
                *
                */
                var Serializer = (function () {
                    function Serializer() {
                    }
                    /**
                    * Registers a class in the serializable class register
                    * @param classContext
                    * @param SerializerDataClass {typeof SerializerDefinition}
                    */
                    Serializer.registerClass = function (classContext, SerializerDataClass) {
                        // determine class global path by parsing the body of the classContext Function
                        var classPath = /return ([A-Za-z0-9_$.]*)/g.exec(classContext.toString())[1];

                        // Check if class has been processed
                        if (Serializer.serializableRegisters[classPath]) {
                            throw new Error('Class ' + classPath + ' already registered');
                        }

                        Serializer.getClassFromPath(classPath).prototype['@serializable'] = classPath;

                        Serializer.serializableRegisters[classPath] = {
                            keys: Serializer.getMixedNames(SerializerDataClass),
                            serializerData: SerializerDataClass
                        };
                    };

                    /**
                    * Serializes the passed instance & returns a transportable object
                    * @param instance
                    * @returns {any}
                    */
                    Serializer.writeObject = function (instance) {
                        var obj = {};
                        var register = Serializer.getSerializableRegister(instance);
                        register.keys.forEach(function (key) {
                            var value = instance[key];
                            if (!value && !Serializer.isNumeric(value))
                                return;
                            Serializer.writeAny(obj, key, value, register.serializerData);
                        });
                        return obj;
                    };

                    /**
                    * Rehidrates the instance with the values provided by the passed object
                    * @param instance
                    * @param obj
                    */
                    Serializer.readObject = function (instance, obj) {
                        var register = Serializer.getSerializableRegister(instance);
                        Serializer.getSerializableRegister(instance).keys.forEach(function (key) {
                            return Serializer.readAny(obj[key], key, instance, register.serializerData);
                        });
                        return instance;
                    };

                    // Private Methods
                    /**
                    *
                    * @param array
                    * @returns {any[]}
                    */
                    Serializer.writeArray = function (array) {
                        var dummyObjectArray = { array: [] };
                        array.forEach(function (value, i) {
                            return Serializer.writeAny(dummyObjectArray.array, i, value, Serializer.getSerializableRegisterData(value));
                        });
                        return dummyObjectArray.array;
                    };

                    /**
                    *
                    * @param value
                    * @param key
                    * @param obj
                    * @param SerializerDataClass
                    */
                    Serializer.writeAny = function (obj, key, value, SerializerDataClass, fromArray) {
                        if (typeof SerializerDataClass === "undefined") { SerializerDataClass = null; }
                        if (typeof fromArray === "undefined") { fromArray = false; }
                        if (SerializerDataClass && typeof SerializerDataClass.prototype["set_" + key] == "function") {
                            obj[key] = SerializerDataClass.prototype["set_" + key](value);
                            return;
                        }

                        var elementType = typeof value;

                        switch (true) {
                            case elementType == "boolean":
                            case elementType == "string":
                            case elementType == "number":
                                obj[key] = value;
                                break;
                            case Array.isArray(value):
                                obj[key] = Serializer.writeArray(value);
                                break;
                            case elementType == "object" && !Array.isArray(value):
                                obj[key] = Serializer.isExternalizable(value) ? Serializer.writeObject(value) : JSON.parse(JSON.stringify(value));
                                break;
                        }
                    };

                    /**
                    *
                    * @param array
                    * @returns {any[]}
                    */
                    Serializer.readArray = function (array) {
                        var resultArray = [];

                        array.forEach(function (element, i) {
                            Serializer.readAny(element, i, resultArray, Serializer.getSerializableRegisterData(element));
                        });
                        return resultArray;
                    };

                    /**
                    * @param element
                    * @param key
                    * @param target
                    * @param SerializerDataClass
                    */
                    Serializer.readAny = function (element, key, target, SerializerDataClass) {
                        if (SerializerDataClass && typeof SerializerDataClass.prototype["@get:" + key] == "function") {
                            target[key] = SerializerDataClass.prototype["get_" + key](element);
                            return;
                        }

                        var type = typeof element;
                        switch (true) {
                            case type == "boolean":
                            case type == "string":
                            case type == "number":
                                target[key] = element;
                                break;
                            case Array.isArray(element):
                                target[key] = Serializer.readArray(element);
                                break;
                            case type == "object" && !Array.isArray(element):
                                if (element.hasOwnProperty('@serializable')) {
                                    var moduleParts = element['@serializable'].split('.');
                                    var classPath = moduleParts.join('.');
                                    if (!target[key])
                                        target[key] = Serializer.getClass(classPath);
                                    target[key].readObject(element);
                                } else {
                                    target[key] = element;
                                }
                                break;
                        }
                    };

                    /* Helper Methods */
                    /**
                    * @param SerializerDataClass
                    * @returns {string[]}
                    */
                    Serializer.getMixedNames = function (SerializerDataClass) {
                        return Object.getOwnPropertyNames(new SerializerDataClass()).concat("@serializable");
                    };

                    /**
                    * @param instance
                    * @returns {boolean}
                    */
                    Serializer.isExternalizable = function (instance) {
                        return '@serializable' in instance && typeof instance.writeObject == "function" && typeof instance.readObject == "function";
                    };

                    /**
                    * @param name
                    * @param context
                    * @returns {any}
                    */
                    Serializer.getClassFromPath = function (name, context) {
                        if (typeof context === "undefined") { context = window; }
                        name.split('.').forEach(function (ctx) {
                            return context = context[ctx];
                        });
                        return context;
                    };

                    /**
                    * @param name
                    * @param context
                    * @returns {any}
                    */
                    Serializer.getClass = function (name, context) {
                        if (typeof context === "undefined") { context = window; }
                        name.split('.').forEach(function (ctx) {
                            return context = context[ctx];
                        });
                        return new context;
                    };

                    /**
                    
                    * @param instance
                    * @returns {ISerializableRegister}
                    */
                    Serializer.getSerializableRegister = function (instance) {
                        var props = Serializer.serializableRegisters[instance['@serializable']] || null;
                        return props;
                    };

                    /**
                    *
                    * @param instance
                    * @returns {ISerializableRegister}
                    */
                    Serializer.getSerializableRegisterData = function (instance) {
                        var register = Serializer.getSerializableRegister(instance);
                        return register ? register.serializerData : null;
                    };

                    Serializer.isNumeric = function (n) {
                        return !isNaN(parseFloat(n)) && isFinite(n);
                    };
                    Serializer.serializableRegisters = {};
                    return Serializer;
                })();
                serialize.Serializer = Serializer;
            })(utils.serialize || (utils.serialize = {}));
            var serialize = utils.serialize;
        })(xperiments.utils || (xperiments.utils = {}));
        var utils = xperiments.utils;
    })(io.xperiments || (io.xperiments = {}));
    var xperiments = io.xperiments;
})(io || (io = {}));
//# sourceMappingURL=Serializer.js.map
