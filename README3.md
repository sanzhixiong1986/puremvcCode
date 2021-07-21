源码查看



#### PureMVC Proxy基础

### 使用

1.首先获得对象

```typescript
var facade:puremvc.IFacade = puremvc.Facade.getInstance('FacadeTestKey2');
```

2.注册

```typescript
facade.registerProxy( new puremvc.Proxy( 'colors', ['red', 'green', 'blue'] ) );
```

3.接受到相关的数据

```typescript
var proxy:puremvc.IProxy = facade.retrieveProxy( 'colors' );
//获得数据
var data:Array<any> = proxy.getData();
//使用
data[1] //获取
```

------

### 核心 IProxy接口

```typescript
module puremvc
{
	export interface IProxy extends INotifier
	{
		getProxyName():string;
    //设置数据
		setData( data:any ):void;
    //获得数据
		getData():any;
		//注册
		onRegister( ):void;
		//人数
		onRemove( ):void;
	}
}
```

实现类

```typescript
module puremvc
{
	"use strict";
	export class Proxy extends Notifier implements IProxy, INotifier
	{
		//对应的名字
		proxyName:string = null;
		//对应的数据
		data:any = null;
		//构造函数
		constructor( proxyName:string=null, data:any=null )
		{
			super();
			this.proxyName = (proxyName != null) ? proxyName : Proxy.NAME;
			if( data != null )
				this.setData(data);
		}
		//获得这个唯一的名字
		getProxyName():string
		{
			return this.proxyName;
		}		

		setData( data:any ):void
		{
			this.data = data;
		}

		getData():any
		{
			return this.data;
		}

		onRegister():void
		{

		}

		onRemove():void
		{

		}
		
		 static NAME:string = "Proxy";
	}
}
```

