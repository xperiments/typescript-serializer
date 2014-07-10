typescript-serializer
=====================

Lately I've been thinking it would be interesting to have a data serialization system to be used in some client-side developments in which I am working.

But first, for those that don't know what is data serialization: ( wikipedia )

> In computer science, in the context of data storage, **serialization** is the process of translating data structures or object state into a format that can be stored (for example, in a file or memory buffer, or transmitted across a network connection link) and reconstructed later in the same or another computer environment.[1] When the resulting series of bits is reread according to the serialization format, it can be used to create a semantically identical clone of the original object


I have used these systems before in Java and Actionscript, an missed not being able to have a similar system in Typescript so I have developed a fairly simple one named typescript-serializer.

I took concepts from Java and Actionscript, adapting them to the requirements and limitations of Typescript.

You can find it at [GitHub](https://github.com/xperiments/typescript-serializer).


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

### Make it "Serializable" by extending Serializable

This methods are inherited when extending from Serializable:

* writeObject();
* readObject(obj:ISerializableObject);
* stringify();
* parse(jsonstring);


### Defining Serializable properties

We will make the definition of what properties and how these properties should be serialized by creating a "serializer" class that must implement ISerializerHelper. 

```javascript
class UserSerializer implements ISerializerHelper
{
	/* REMEMBER we need to init to null all props to this work */
	"@serializer":string = null; 
    name:string = null;
    surname:string = null;
	street:string = null;
    number:number = null; 
}
```

As we see in this example, we have defined the properties we want to serialize from the "User" class by declaring it in the new class an initializing it to **NULL ( this is IMPORTANT )** .


### Registering Serializable Classes

So far the only thing we have done is to define which classes are serializable and how they should be serialized, but for this to work we need to register them together using the method **registerClass** of the class Serializer.

	Serializer.registerClass( classContext:()=>any, SerializerDataClass:typeof SerializerDefinition ):void

It takes 2 arguments:

* **classContext** // a function that returns the Main class to Serialize
* **SerializerDataClass:any** // The SerializableData Class that defines how & what elements to serialize.


```javascript
// register here the User and UserSerializer
Serializer.registerClass( ()=>User, UserSerializer );
```

We must be careful in how we define "class Context." It must be a function that just returns the serialized class and nothing else. This function is used later to determine his name.

## Usage

Now that we have everything in place, we will create a new "User" and see how serialize and deserialize it:

```javascript
// create a new User (source) instance:
var sourceInstance:User = new User();
    sourceInstance.name = "John";
    sourceInstance.surname = "Smith";
    sourceInstance.street = "Some Street Address";
    sourceInstance.number = 67;
```

### Serializing


The writeObject method inherited from Serializable lets us serialize the object to another "transportable" object.

```javascript
var serializedObject:any = sourceInstance.writeObject();
```
Tracing out the object in the console, will be something similar to this:

```javascript
{
    "@serializable": "User",
    "name": "John",
    "surname": "Smith",
    "street": "Some Street Address",
    "number": 67
}
```

We may also use the stringify () method that will return a much more transportable JSON representation.

```javascript
var serializedJSONRepresentationt:string = sourceInstance.stringify();
```

### Deserializing

To reconstruct the serialized object/s, we can use the inherited methods "readObject" or "parse" of our User class.

```javascript
// create a new User (source) instance:
var sourceInstance:User = new User();
    sourceInstance.name = "John";
    sourceInstance.surname = "Smith";
    sourceInstance.street = "Some Street Address";
    sourceInstance.number = 67;

// Serialize the instance
var serializedObject:any = sourceInstance.writeObject();

// create a new instance of User
var serializedObjectClone:any = new User();

// reconstruct it from the serializedObject we have created 
serializedObjectClone.readObject( serializedObject );

```

We may also use the parse( json:string ) method that will reconstruct the object from a JSON string.

## Custom serialization of properties

In addition to specifying which properties are to be serialized, we can also specify how they should be serialized. 

For example we will use our class User adding a "Date" property. Later want it to be serialized as YYYY / MM / DD.

```javascript
class User
{
	...
	date:Date;
    ...
}

```

To define how to process this property "date", we will create two new methods in our UserSerializer class. 

These methods must be named with the following format:

```javascript
set_propertyName( property:PropertyType ):string
get_propertyName( property:string ):Type
```

Applying it to our class "User" would be:

```javascript

class User extends Serializable
{
	name:string;
	surname:string;
	street:string;
	number:number;
	date:Date;
}

class UserSerializer implements ISerializerHelper
{
	"@serializer":string = null;
    date:Date = null;
    set_date(date:Date):string
    {
        return [ date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');
    }
	get_date(dateString:string):Date
	{
		var dateParts:string[] = dateString.split('/');
		var date = new Date();
		date.setFullYear( parseInt(dateParts[0],10));
		date.setMonth( parseInt(dateParts[1],10)-1);
		date.setDate( parseInt(dateParts[2],10));
		return date;
	}
}

```

## Demo

Here is the full code example. You can play with it at the Typescript Playground by clicking on the TSPlay button at bottom.

```typescript
module io.xperiments.utils.serialize
{
	/**
	 * The interface any ClassSerializer class must implement
	 */
	export interface ISerializerHelper
	{
		"@serializer":string;
	}

	/**
	 * The interface any Serializable class must implement
	 */
	export interface ISerializable
	{
		writeObject():any;
		readObject( obj:ISerializable ):void;
		stringify():string;
		parse( string:string ):void;
	}

	/**
	 *	Holds information about the class serializer & keys of a Type
	 */
	export interface ISerializableRegister
	{
		keys:string[];
		serializerData:typeof SerializerHelper;
	}

	/**
	 *	Holds a dictionary of ISerializableRegister
	 */
	export interface ISerializableRegisters
	{
		[key:string]:ISerializableRegister;
	}

	/**
	 * The interface any ClassSerializer extends
	 */
	export class SerializerHelper implements ISerializerHelper
	{
		"@serializer":string;
	}

	/**
	 *	The base class all serializable classes must extend
	 */
	export class Serializable implements ISerializable
	{
		/**
		 * Serializes the current instance & returns a transportable object
		 * @returns {ISerializable}
		 */
		public writeObject():ISerializable
		{

			return Serializer.writeObject( this );
		}

		/**
		 * Rehidrates the current instance with the values provided by the passed object
		 * @param obj
		 */
		public readObject(obj:ISerializable):ISerializable
		{
			return Serializer.readObject(this, obj);
		}

		/**
		 * Serializes the current instance & returns a JSON string representation
		 * @param pretty
		 * @returns {string}
		 */
		public stringify( pretty:boolean = false ):string
		{
			return JSON.stringify( Serializer.writeObject( this ), null, pretty? 4:0 );
		}

		/**
		 * Rehidrates the current instance with the values provided by the passed JSON string
		 * @param string
		 */
		public parse( string:string ):void
		{
			Serializer.readObject(this, JSON.parse( string ));
		}

	}

	/**
	 *
	 */
	export class Serializer
	{
		private static serializableRegisters:ISerializableRegisters = {};

		/**
		 * Registers a class in the serializable class register
		 * @param classContext
		 * @param SerializerDataClass {typeof SerializerDefinition}
		 */
		public static registerClass( classContext:()=>any, SerializerDataClass:typeof SerializerHelper ):void
		{

			// determine class global path by parsing the body of the classContext Function
			var classPath:string = /return ([A-Za-z0-9_$.]*)/g.exec(classContext.toString())[1];

			// Check if class has been processed
			if( Serializer.serializableRegisters[ classPath ] )
			{
				throw new Error('Class '+classPath+' already registered');
			}

			Serializer.getClassFromPath( classPath ).prototype['@serializable'] = classPath;

			Serializer.serializableRegisters[classPath] =
			{
				keys:Serializer.getMixedNames( SerializerDataClass ),
				serializerData:SerializerDataClass
			};
		}

		/**
		 * Serializes the passed instance & returns a transportable object
		 * @param instance
		 * @returns {any}
		 */
		public static writeObject( instance:ISerializable ):ISerializable
		{
			var obj:any = <ISerializable>{};
			var register:ISerializableRegister = Serializer.getSerializableRegister( instance );
			register.keys.forEach(( key:string )=>
			{
				var value:any = instance[key];
				if( !value && !Serializer.isNumeric( value )) return; // don't getSerializableProperties void/empty/undefined
				Serializer.writeAny( obj, key, value, register.serializerData );
			});
			return obj;
		}

		/**
		 * Rehidrates the instance with the values provided by the passed object
		 * @param instance
		 * @param obj
		 */
		public static readObject( instance:ISerializable, obj:ISerializable ):ISerializable
		{
			var register:ISerializableRegister = Serializer.getSerializableRegister( instance );
			Serializer.getSerializableRegister( instance ).keys
				.forEach( ( key:string )=> Serializer.readAny( obj[key], key, instance, register.serializerData ) );
			return instance;
		}



		// Private Methods
		/**
		 *
		 * @param array
		 * @returns {any[]}
		 */
		private static writeArray( array:any[] ):any[]
		{
			var dummyObjectArray:{array:any[]} = { array:[] };
			array.forEach( ( value , i )=> Serializer.writeAny( dummyObjectArray.array, i, value , Serializer.getSerializableRegisterData( value )  ) );
			return dummyObjectArray.array;
		}

		/**
		 *
		 * @param value
		 * @param key
		 * @param obj
		 * @param SerializerDataClass
		 */
		private static writeAny( obj:any,key:any,value:any, SerializerDataClass:any = null , fromArray:boolean = false )
		{

			if( SerializerDataClass && typeof SerializerDataClass.prototype["set_"+key] == "function" )
			{
				obj[key] = SerializerDataClass.prototype["set_"+key]( value );
				return;
			}

			var elementType = typeof value;

			switch( true )
			{
				case elementType=="boolean":
				case elementType=="string":
				case elementType=="number":
					obj[key] = value;
					break;
				case Array.isArray( value ):
					obj[key] = Serializer.writeArray( value );
					break;
				case elementType=="object" && !Array.isArray( value ):
					obj[key] = Serializer.isExternalizable( value ) ? Serializer.writeObject( value ):JSON.parse(JSON.stringify( value ));
					break;
			}

		}

		/**
		 * @param array
		 * @returns {any[]}
		 */
		private static readArray( array:any[] ):any[]
		{
			var resultArray:any[] = [];

			array.forEach( ( element, i )=>{
				Serializer.readAny( element, i, resultArray, Serializer.getSerializableRegisterData( element ) );
			});
			return resultArray;
		}

		/**
		 ** @param element
		 * @param key
		 * @param target
		 * @param SerializerDataClass
		 */
		private static readAny( element:any, key:any, target:any, SerializerDataClass:any )
		{

			if( SerializerDataClass && typeof SerializerDataClass.prototype["get_"+key] == "function" )
			{
				target[key] = SerializerDataClass.prototype["get_"+key]( element );
				return;
			}

			var type:string = typeof element;
			switch( true )
			{
				case type=="boolean":
				case type=="string":
				case type=="number":
					target[key] = element;
					break;
				case Array.isArray( element ):
					target[key] = Serializer.readArray( element );
					break;
				case type=="object" && !Array.isArray( element ):
					if( element.hasOwnProperty('@serializable') )
					{
						var moduleParts:string[] = element['@serializable'].split('.');
						var classPath:string = moduleParts.join('.');
						if( !target[key] ) target[key] = Serializer.getClass(classPath);
						target[key].readObject( element );
			 		}
					else
					{
						target[key] = element;
					}
					break;
			}

		}

		/* Helper Methods */

		/**

		 ** @param SerializerDataClass
		 * @returns {string[]}
		 */
		private static getMixedNames( SerializerDataClass:any ):string[]
		{
			return Object.getOwnPropertyNames( new SerializerDataClass() ).concat("@serializable");
		}


		/**

		 ** @param instance
		 * @returns {boolean}
		 */
		private static isExternalizable( instance ):boolean
		{
			return '@serializable' in instance && typeof instance.writeObject == "function" && typeof instance.readObject == "function";
		}

		/**

		 ** @param name
		 * @param context
		 * @returns {any}
		 */
		private static getClassFromPath( name:string , context:any = window ):any
		{
			name.split('.').forEach( ctx=>context = context[ ctx ] );
			return context;
		}

		/**

		 ** @param name
		 * @param context
		 * @returns {any}
		 */
		private static getClass( name:string , context:any = window ):any
		{
			name.split('.').forEach( ctx=>context = context[ ctx ] );
			return new context;
		}

		/**

		 		 ** @param instance
		 * @returns {ISerializableRegister}
		 */
		private static getSerializableRegister( instance:ISerializable ):ISerializableRegister
		{
			var props:ISerializableRegister = Serializer.serializableRegisters[ instance['@serializable'] ] || null;
			return props;
		}

		/**
		 *
		 * @param instance
		 * @returns {ISerializableRegister}
		 */
		private static getSerializableRegisterData( instance:ISerializable ):typeof SerializerHelper
		{

			var register = Serializer.getSerializableRegister( instance );
			return register ? register.serializerData:null;
		}

		private static isNumeric(n:any):boolean
		{
			return !isNaN(parseFloat(n)) && isFinite(n);
		}
	}
}

/* DEMO CODE */


import ISerializable = io.xperiments.utils.serialize.ISerializable;
import Serializable = io.xperiments.utils.serialize.Serializable;

import ISerializerHelper = io.xperiments.utils.serialize.ISerializerHelper;
import Serializer = io.xperiments.utils.serialize.Serializer;

class User extends Serializable
{
	name:string;
	surname:string;
	street:string;
	number:number;
	date:Date;
}

class UserSerializer implements ISerializerHelper
{
	"@serializer":string = null;
    date:Date = null;
	name:string  = null;
	surname:string  = null;
	street:string  = null;
	number:number  = null;
    set_date(date:Date):string
    {
        return [ date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');
    }
	get_date(dateString:string):Date
	{
		var dateParts:string[] = dateString.split('/');
		var date = new Date();
		date.setFullYear( parseInt(dateParts[0],10));
		date.setMonth( parseInt(dateParts[1],10)-1);
		date.setDate( parseInt(dateParts[2],10));
		return date;
	}
}

// Registration
Serializer.registerClass(()=>{ return User },UserSerializer);


// Creane new user instance and populate it with some values
var sourceInstance:User = new User();
    sourceInstance.name = "John";
    sourceInstance.surname = "Smith";
    sourceInstance.street = "Some Street Address";
    sourceInstance.number = 67;
	sourceInstance.date = new Date();

// Serialize it and store it somewhere	
var serializedObject:ISerializable = sourceInstance.writeObject();

// later to recompose it from data saved to disk
var cloneUserInstance:User = new User();
cloneUserInstance.readObject( serializedObject );

console.log( sourceInstance, cloneUserInstance )	
```	

