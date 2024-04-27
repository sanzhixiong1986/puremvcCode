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
        const cmds = msgpack.decode(new Uint8Array(cmd));
        console.log("解析的数据为", cmds);
        return cmds
    }
}
