
export default class proto_man {

    /**
     * 加密
     * @param str_of_buf 
     */
    private static encrypt_cmd(str_of_buf) {
        return str_of_buf;
    }

    /**
     * 解密
     */
    private static decrypt_cmd(str_of_buf) {
        return str_of_buf;
    }

    /**
     * 结构对象得数据
     * @param stype 主机
     * @param ctype 型号
     * @param body  具体得数据
     */
    public static encode_cmd(stype: number, ctype: number, body: any) {
        let buf = null;
        buf = this._json_encode(stype, ctype, body);
        if (buf) {
            buf = this.encrypt_cmd(buf);
        }
        return buf;
    }

    /**
     * 
     * @param stype 
     * @param ctype 
     * @param body 
     * @returns 
     */
    private static _json_encode(stype: number, ctype: number, body: any) {
        let cmd = {};
        cmd[0] = stype;
        cmd[1] = ctype;
        cmd[2] = body;
        let str = JSON.stringify(cmd);
        console.log("send Msg =" + str);
        return str;
    }

    /**
     * 发送数据
     * @param str_of_buf 
     * @returns 
     */
    public static decode_cmd(str_of_buf) {
        str_of_buf = this.decrypt_cmd(str_of_buf);
        return this.json_decode(str_of_buf);
    }

    private static json_decode(str_of_buf) {
        let cmd = JSON.parse(str_of_buf);
        if (!cmd ||
            typeof (cmd[0]) == "undefined" ||
            typeof (cmd[1]) == "undefined" ||
            typeof (cmd[2]) == "undefined") {
            return null;
        }
        return cmd;
    }
}
