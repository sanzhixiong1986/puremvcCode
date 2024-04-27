import * as msgpack from "msgpack-lite";
export default class ProtoMan {

    /**
     * 编码
     * @param stype 
     * @param ctype 
     * @param body 
     */
    public static encode(stype, ctype, body) {
        let cmd = {
            0: stype,
            1: ctype,
            2: body,
        }
        console.log("编译数据", cmd);
        const temp = msgpack.encode(cmd);
        return temp;
    }

    /**
     * 解码
     * @param cmd 
     * @returns 
     */
    public static decode(cmd) {
        if (!cmd[0] || !cmd[1]) {
            console.log("解析数据有问题", cmd[0], cmd[1]);
            return;
        }
        const cmds = msgpack.decode(cmd);
        console.log("解析的数据为", cmds);
        return cmds
    }
}