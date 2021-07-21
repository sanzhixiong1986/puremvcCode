源码查看



#### PureMVC 初始化Command

1.首先获得对象

```typescript
var facade:puremvc.IFacade = puremvc.Facade.getInstance('FacadeTestKey2');
```

2.注册

```typescript
facade.registerCommand( 'FacadeTestNote', FacadeTestCommand );
```

3.发送数据

```typescript
module test
{
	"use strict";
	export class FacadeTestVO
	{
		constructor( input:number ){
			this.input = input;
		}
		input:number = null;
		result:number = null;
	}
}
```

```typescript
facade.sendNotification( 'FacadeTestNote', vo );
//其中vo是一个数值对象
```

4.接受对应的数据

```typescript
module test
{
	"use strict";
	export class FacadeTestCommand extends puremvc.SimpleCommand implements puremvc.ICommand
	{
		execute( notification:puremvc.INotification )
		{
			var vo:FacadeTestVO = <FacadeTestVO> notification.getBody();
			vo.result = 2 * vo.input;
		}
	}
}
```

以上是注册一个到发送数据接受数据的一个流程。

