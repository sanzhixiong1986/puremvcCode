import EventManager from "../../../event/EventManager";

/**
 * 世界排行榜的操作
 */
export default class WorldRankInfoHandler {

    handle(oMsgBody: any) {
        console.log("排行榜获得数据" + oMsgBody);
        if(oMsgBody[0] == 1){
            EventManager.getInstance().dispenseEvent({ msg_id: "worldRank", data: oMsgBody });
        }
    }
}
