typescript-serializer
=====================

Typescript does not provide a native way of Serializing Objects/Classes so I have developed a mechanism to allow it.
[GitHub: typescript-serializer](https://github.com/xperiments/typescript-serializer)


## Serializable Classes

Imagine a User Class like this:

```javascript
class User
{
	name:string;
	surname:string;
	street:string;
	number:number;
}
```

And we want to serialize only the *name*, *street* and *number* properties of the object.


### Initializing Serializable Classes

To do this we need to make User class extend **Serializable** and **annotate** it adding a property named **"@serializable"**.

Extending the class as Serializable will add 4 new methods to our class:

* writeObject();
* readObject(obj:ISerializableObject);
* stringify();
* parse(jsonstring);

We will see the usage of these methods later, for now our User class will change to this:

```javascript
class User extends extends Serializable
{
    "@serializable":string;
    name:string;
    surname:string;
    street:string;
    number:number;
}
```

### Defining Serializable properties

Now that we have our User class **Annotated** as serializable, we need to provide info about what properties must be serialized.
To acomplain this, create a new class named UserSerializer that implements ISerializerDefinition and define which properties from User to serialize, by declaring it as a properties of the new Class.

> It's important **REMEMBER** to initialize all props to null, if not it won't work :-(

```javascript
class UserSerializer implements ISerializerDefinition
{
	"@serializer":string = null;
    name:string = null; // we need to init to null to this work
    street:string = null;
    number:number = null;
}
```

### Registering Serializable Classes

Is time to Register our Serializble class with our ISerializerDefinition using the static registerClassMethod. 

	Serializer.registerClass( classContext:()=>any, SerializerDataClass:typeof SerializerDefinition ):void

It takes 2 arguments:

* **classContext** // a funciton that returns the Main class to Serialize
* **SerializerDataClass:any** // The SerializableData Class that defines how & what elements to serialize.


```javascript
// register here the MainClass and SerializerClass
Serializer.registerClass( ()=>User, UserSerializer );
```


## Usage

```javascript
// create a new User (source) instance:
var sourceInstance:User = new User();
    sourceInstance.name = "John";
    sourceInstance.street = "Some Street Address";
    sourceInstance.number = 67;
```

To serialize the instance we will use the writeObject method inherited from Serializable as:

```javascript
var serializedObject:any = sourceInstance.writeObject();
console.log( serializedObject );
```

The writeObject method will serialize the instance to a plain js-object:

```javascript
{
    "@serializable": "User",
    "name": "John",
    "street": "Some Street Address",
    "number": 67
}
```

To rehydrate another User instance:

```javascript
var serializedObjectClone:any = new User();
console.log( serializedObjectClone ); // outputs an Empty User instance

serializedObjectClone.readObject( serializedObject );
console.log( serializedObjectClone ); // outputs a rehydrated User instance
```

## Working with nested Serializables

For now we have only serialized a simple Object but we can serialize nested Classes inside other Classes.

For this example we will using this 2 Classes:
```typescript
class User extends extends Serializable
{
    "@serializable":string;
    name:string;
    surname:string;
    addresses:UserAddress[];
}
class UserSerializer
{
    name:string = null; // we need to init to null to this work
    surname:string = null;
    addresses:UserAddress[] = null;
}

// register serializer
Serializer.registerClass( ()=>User, UserSerializer );

class UserAddress extends extends Serializable
{
    "@serializable":string;
    address:string;
    number:number;
}

class UserAddressSerializer extends extends Serializable
{
    name:string = null; // we need to init to null to this work
    surname:string = null;
    addresses:UserAddress[] = null;
}

// register serializer
Serializer.registerClass( ()=>UserAddress, UserAddressSerializer );

```


## Custom Serialization

Custom serialization lets you specify how a value is writed/readed.
To specify we need to create 2 methods in the 

```typescript
class UserSerializer
{
    name:string = null; // we need to init to null to this work
    surname:string = null;
    addresses:UserAddress[] = null;
}
```
