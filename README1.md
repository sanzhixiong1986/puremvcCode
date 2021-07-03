源码查看



#### PureMVC 模块的划分

- Proxy:他是负责数据的模型
- Mediator：是视图模型
- Command：Command可以获取Proxy对象并与交互，发送Notification，执行Commoand



#### 进入场景并且初始化

初始化pureMVC

1.知识点：单利模式

2.框架进行启动的初始化

```typescript
var facade:puremvc.IFacade = puremvc.Facade.getInstance('FacadeTestKey2');
```

然后进入到Facade的类当中看看，首先是单利

```typescript
static instanceMap:Object = {};//单利列表的哈希表对象
static getInstance( key:string ):IFacade
{
  if( !Facade.instanceMap[ key ] )
    Facade.instanceMap[ key ] = new Facade( key );

  return Facade.instanceMap[ key ];
}
```

在创建对象的时候

```typescript
//构造函数
constructor( key )
{
  //判断是否在列表中存在
  if( Facade.instanceMap[ key ] )
    throw Error( Facade.MULTITON_MSG );

  this.initializeNotifier( key );
  Facade.instanceMap[ key ] = this; //把对象绑定
  this.initializeFacade();					//初始化操作
}

//把当前的key值存储起来
initializeNotifier( key:string ):void
{
  this.multitonKey = key;
}

//初始化操作
initializeFacade():void
{
  this.initializeModel();
	this.initializeController();
	this.initializeView();
}
```

然后初始化对应的操作

```javascript
//初始化模型
initializeModel():void
{
  if( !this.model )
  	this.model = Model.getInstance( this.multitonKey );
}

//初始化控制器
initializeController():void
{
  if( !this.controller )
    this.controller = Controller.getInstance( this.multitonKey );
}

//初始化view层
initializeView():void
{
  if( !this.view )
    this.view = View.getInstance( this.multitonKey );
}
```

从这里面的源码可以看出来，开始初始化绑定FMVC每一个都绑定在一起。

这个类它继承于IFacade

查看IFacade类

```javascript
export interface IFacade extends INotifier
{
  //注册Command,第二参数是返回函数
  registerCommand( notificationName:string, commandClassRef:Function ):void;

  //删除对应的command
  removeCommand( notificationName:string ): void;

  //判断这个command是否哦存在
  hasCommand( notificationName:string ):boolean;

  //注册数据类
  registerProxy( proxy:IProxy ):void;

  //获得数据对象
  retrieveProxy( proxyName:string ):IProxy;

  //删除数据对象
  removeProxy( proxyName:string ):IProxy;

  //是否有数据对象
  hasProxy( proxyName:string ):boolean;

  //注册试图对象
  registerMediator( mediator:IMediator ):void;

  //获得试图对象
  retrieveMediator( mediatorName:string ):IMediator;

  //删除试图对象
  removeMediator( mediatorName:string ):IMediator;

  //是否存在试图对象
  hasMediator( mediatorName:string ):boolean;

  //数据对象
  notifyObservers( notification:INotification ):void;
}
```

从这个接口可以看出来，主要是注册，绑定MVC三个模块，然后删除，获得对应的对象等等操作，然后这个接口也是继承 INotifier 这个接口

```javascript
module puremvc
{
	export interface INotifier
	{
		sendNotification( name:string, body?:any, type?:string ):void;
    //记录当前的key数据
		initializeNotifier( key:string ):void;
	}
}
```

下面是注册Command

```javascript
facade.registerCommand( 'FacadeTestNote', FacadeTestCommand );
```

然后进入到FacadeTestCommand类中

```typescript
module test
{
	"use strict";
	export class FacadeTestCommand extends puremvc.SimpleCommand implements puremvc.ICommand
	{
    //发送对应的数据
		execute( notification:puremvc.INotification )
		{
			var vo:FacadeTestVO = <FacadeTestVO> notification.getBody();

			// Fabricate a result
			vo.result = 2 * vo.input;
		}
	}
}
```

FacadeTestVO类

```typescript
typescript

module test
{
	"use strict";

	//这个类很简单就是传入一个数据
	export class FacadeTestVO
	{
		constructor( input:number )
		{
			this.input = input;
		}

		input:number = null;
		result:number = null;
	}
}
```

代码

```typescript
typescript

facade.sendNotification( 'FacadeTestNote', vo );
```

然后在 FacadeTestCommand 里面进行数据操作，这里是注册Command的操作

FacadeTestCommand类继承于SimpleCommand类和ICommand接口

SimpleCommand类

```typescript
typescript

export class SimpleCommand
		extends Notifier
		implements ICommand, INotifier
	{
		//只有一个方法，这个方法就是发送过来对应的数据
		execute( notification:INotification ):void
		{

		}
	}
```

Notifier 类

```typescript
typescript

module puremvc
{
	"use strict";
	export class Notifier implements INotifier
	{
    //这个是INotifier接口的方法和
		multitonKey:string = null;
		 initializeNotifier( key )
		{
			this.multitonKey = key;
		}
    //end

    //发送数据
		sendNotification( name:string, body:any=null, type:string=null ):void
		{
			if( this.facade() ) 
				this.facade().sendNotification( name, body, type );
		}

    //通过key获取对应的对象
		facade():IFacade
		{
			if( this.multitonKey === null )
					throw Error( Notifier.MULTITON_MSG );

			return Facade.getInstance( this.multitonKey );
		}

		static MULTITON_MSG:string = "multitonKey for this Notifier not yet initialized!";
	}
}
```

ICommand接口

```typescript
module puremvc
{
	export interface ICommand extends INotifier
	{
		//监听到对应的notification方法
		execute( notification:INotification ):void;
	}
}
```

#### 总结

1.使用Facade类对mvc进行初始化

2.初始化完成以后可以通过注册完成对mvc的绑定

3.通过SimpleCommand类的execute方法进行数据获取