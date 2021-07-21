源码查看



#### PureMVC Mediator基础

### 查看测试用例

1.首先获得对象

```typescript
//显示对象
var view:Object = new Object(); //这个地方在view的对象
//吧显示对象放入到Mediator
var mediator:puremvc.IMediator = new puremvc.Mediator( puremvc.Mediator.NAME, view );
```

------

### 核心 IMediator接口

```typescript
module puremvc
{
	export interface IMediator extends INotifier
	{
		getMediatorName():string;
		getViewComponent():any;
    //设置显示对象
		setViewComponent( viewComponent:any ):void;
		listNotificationInterests( ):string[];
		handleNotification( notification:INotification ):void;
		onRegister():void;
		onRemove():void;
	}
}
```

实现类

```typescript
module puremvc
{
	"use strict";
	export class Mediator extends Notifier implements IMediator, INotifier
	{
		//名字
		mediatorName:string = null;
		//显示对象
		viewComponent:any = null;
		constructor( mediatorName:string=null, viewComponent:any=null )
		{
			super();
			this.mediatorName = (mediatorName != null) ? mediatorName : Mediator.NAME;
      if(!viewComponent)
        this.viewComponent = viewComponent;	
		}
	
		getMediatorName():string
		{	
			return this.mediatorName;
		}
    
		getViewComponent():any
		{	
			return this.viewComponent;
		}

		setViewComponent( viewComponent:any ):void
		{
			this.viewComponent = viewComponent;
		}

		listNotificationInterests():string[]
		{
			return new Array<string>();
		}

		handleNotification( notification:INotification ):void
		{

		}

		onRegister():void
		{

		}

		onRemove():void
		{

		}

		static NAME:string = 'Mediator';
	}
}
```

