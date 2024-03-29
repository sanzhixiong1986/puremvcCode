// @ts-nocheck

export default class EventManager {
    private static instance: EventManager = new EventManager();

    /** 最大消息数量  */
    processCPF:number = 10000;
    /** 消息队列    */
    eventHandler:{[key:string]:any} = {};
    /** 分发队列    */
    eventQueue:Array<any> = [];
    /** 添加消息爹列列表    */
    addEventList:Array<any> = [];

    public static getInstance(): EventManager {
        return this.instance;
    }

        /**
     * 添加消息监听
     * @param nEventID
     * @param pHandler
     */
    public registerHandler(nEventID:string, pHandler:any) {
        let eventList:Array<string> = this.eventHandler[nEventID];
        if (eventList) {
            for (let i = 0; i < eventList.length; ++i) {
                if (eventList[i] == pHandler) {
                    return;
                }
            }
            eventList.push(pHandler);
        }
        else {
            eventList = [];
            eventList.push(pHandler);
            this.eventHandler[nEventID] = eventList;
        }
    };

    /**
     * 移除消息监听
     * @param nEventID
     * @param pHandler
     */
    public removeHandler(nEventID:string, pHandler:any) {
        let eventList:Array<string> = this.eventHandler[nEventID];
        if (eventList != null) {
            for (let i = 0; i < eventList.length; ++i) {
                if (eventList[i] == pHandler) {
                    eventList.splice(i, 1);
                    if (eventList.length == 0) {
                        delete this.eventHandler[nEventID];
                    }
                    return;
                }
            }
        }
    }

    /**
     * 根据handler移除所有消息
     * @param handler
     */
    public removeAllEventByHandler(handler:any){
        for(let eventId in this.eventHandler){
            let eventList = this.eventHandler[eventId];
            if (eventList != null) {
                for (let i = 0; i < eventList.length; ++i) {
                    if (eventList[i] == handler) {
                        eventList.splice(i, 1);
                    }
                }
                if(!eventList.length) delete this.eventHandler[eventId];
            }
        }
    }

    /**
     * 移除所有消息
     */
    public removeAllHandler() {
        this.eventHandler = {};
    }
    /**                     //暂时废弃
     * 设置消息数量上限
     * @param nCPF
     */
    public setProcessCPF(nCPF:number) {
        this.processCPF = nCPF;
    }

    /**
     * 分发消息
     * @param pEvent
     */
    public dispenseEvent(pEvent:{ [key:string]:any }){
        let eventId = pEvent['msg_id'];
        let handlerList = this.eventHandler[eventId] || [];
        for(let i = 0; i < handlerList.length; i++){
            handlerList[i].processEvent(pEvent);
        }
    }

    /**                 //暂时废弃
     * 添加消息到队列
     * @param pEvent
     */
    public pushEvent(pEvent:{ [key:string]:any }) {
        this.addEventList.push(pEvent);
    }

    /**                 //暂时废弃
     * 分发消息
     *
     * 监听必须写processEvent才能接收消息
     */
    public processEvent() {
        this.AddEventToQueue();
        let nIndex:number = 0;
        while (this.eventQueue.length != 0) {
            let pEvent:object = this.eventQueue.shift();
            if (pEvent) {
                let eventID:string = pEvent['msg_id'];
                let eventList:Array<any> = this.eventHandler[eventID];
                if (eventList) {
                    for (let i = 0; i < eventList.length; ++i) {
                        eventList[i].processEvent(pEvent);
                    }
                    pEvent = null;
                }
                else
                {
                    this.pushEvent(pEvent);
                }

                ++nIndex;
                if (nIndex == this.processCPF) {
                    break;
                }
            }
        }
    }


    /**                     //暂时废弃
     * 装填消息分发队列
     * @constructor
     */
    public AddEventToQueue() {
        if (this.addEventList.length <= 0) {
            return;
        }
        for (let i = 0; i < this.addEventList.length; ++i) {
            this.eventQueue.push(this.addEventList[i]);
        }
        this.addEventList = [];
    }

};