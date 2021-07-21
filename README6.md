源码查看

#### PureMVC Mediator运用

### 查看测试用例

```typescript
module test
{
	"use strict";
	export class ViewTestMediator2 extends puremvc.Mediator implements puremvc.IMediator
	{
		//构造函数
		constructor( view:any )
		{
			super( ViewTestMediator2.NAME, view );
		}

		getViewTest():any
		{
			return this.viewComponent;
		}
		
    //观察者监听
		listNotificationInterests():string[]
		{
			return [ ViewTest.NOTE1,  ViewTest.NOTE2 ];
		}

    //执行函数
		handleNotification( notification:puremvc.INotification )
		{
			this.getViewTest().lastNotification = notification.getName();
		}
    
		public static NAME:string = 'ViewTestMediator2';
	}
}
```

### 进行实际测试

```typescript
var view:puremvc.IView = puremvc.View.getInstance('ViewTestKey9');//获得一个显示对象
//把它装入到显示对象中
view.registerMediator( new ViewTestMediator2( this ) );
//装入数据监听
view.notifyObservers( new puremvc.Notification(ViewTest.NOTE2) );
//随后我们在ViewTestMediator2类下的listNotificationInterests 方法可以监听到对应的操作 handleNotification
//对后数据进行检测
this.lastNotification//获得改变的数据
```

------

### 总结

- ViewTestMediator2相当于一个封装的view层，而view是puremvc.IView的产物，这个地方就相当于游戏的场景层，或者游戏的界面
- proxy实际上就是model的操作
- 最后在网上找了一个as3的连连看代码作为最后的操作实例

代码例子

[Cocos](https://github.com/sanzhixiong1986/puremvcCode/tree/main/pruemvc%202/demo1) 

[As3](https://github.com/sanzhixiong1986/puremvcCode/tree/main/linkupGame-master)
