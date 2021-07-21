源码查看



#### PureMVC Model基础

### 查看测试用例

1.首先获得对象

```typescript
var model:puremvc.IModel = puremvc.Model.getInstance('ModelTestKey1')；
```

2.注册

```typescript
model.registerProxy( new puremvc.Proxy( 'colors', ['red', 'green', 'blue'] ) );
```

3.接受到相关的数据

```typescript
var proxy:puremvc.IProxy = model.retrieveProxy('colors');
var data:string[] = <string[]> /*</>*/ proxy.getData();
//使用
data[1] //获取
```

------

### 核心 IModel接口

```typescript
module puremvc
{
	export interface IModel
	{
		registerProxy( proxy:IProxy ):void;
		removeProxy( proxyName:string ):IProxy;
		retrieveProxy( proxyName:string ):IProxy;
		hasProxy( proxyName:string ):boolean;
	}
}
//从这个接口可以看出来，继承这个接口都会和IProxy有关系，实际操作的还是IProxy
```

实现类

```typescript
module puremvc
{
	"use strict";
	export class Model implements IModel
	{
		proxyMap:Object = null;
		multitonKey:string = null;
    
		constructor( key:string )
		{
			if( Model.instanceMap[ key ] )
				throw Error( Model.MULTITON_MSG );

			Model.instanceMap[ key ] = this;
			this.multitonKey = key;
			this.proxyMap = {};	

			this.initializeModel();
		}
		
		initializeModel():void
		{

		}

		registerProxy( proxy:IProxy ):void
		{
			proxy.initializeNotifier( this.multitonKey );
			this.proxyMap[ proxy.getProxyName() ] = proxy;
			proxy.onRegister();
		}

		removeProxy( proxyName:string ):IProxy
		{
			var proxy:IProxy = this.proxyMap[ proxyName ];
			if( proxy ){
				delete this.proxyMap[ proxyName ];
				proxy.onRemove();
			}
			return proxy;
		}

		retrieveProxy( proxyName:string ):IProxy
		{
				//Return a strict null when the proxy doesn't exist
				return this.proxyMap[proxyName] || null;
		}

		hasProxy( proxyName:string ):boolean{
			return this.proxyMap[ proxyName ] != null;
		}

		static MULTITON_MSG:string = "Model instance for this multiton key already constructed!";
		static instanceMap:Object = {};
		static getInstance( key ):IModel
		{
			if( !Model.instanceMap[ key ] )
				Model.instanceMap[key] = new Model( key );

			return Model.instanceMap[ key ];
		}
    
		static removeModel( key ):void
		{
			delete Model.instanceMap[ key ];
		}
	}
}
```

测试类

```typescript
var model:puremvc.IModel = puremvc.Model.getInstance('ModelTestKey2');
model.registerProxy( new puremvc.Proxy( 'colors', ['red', 'green', 'blue'] ) );

var proxy:puremvc.IProxy = model.retrieveProxy('colors');
var data:string[] = <string[]> /*</>*/ proxy.getData();
```

