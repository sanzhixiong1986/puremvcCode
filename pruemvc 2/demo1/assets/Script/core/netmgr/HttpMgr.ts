/**
 * http的相关操作
 */
export default class HttpMgr {
    /**
    * post的方式
    * @param url       post的url 
    * @param param     json对象
    * @param callback  返回函数
    * @returns 
    */
    public static POST(url, param: object = {}, callback) {
        // url = HttpUtil.baseUrl + url;
        var xhr = cc.loader.getXMLHttpRequest();
        let dataStr = '';
        Object.keys(param).forEach(key => {
            dataStr += key + '=' + encodeURIComponent(param[key]) + '&';
        })
        if (dataStr !== '') {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
        }
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let response = xhr.responseText;
                if (xhr.status >= 200 && xhr.status < 300) {
                    let httpStatus = xhr.statusText;
                    // callback(true, JSON.parse(response));
                    callback(true, response);

                } else {
                    callback(false, response);
                }
            }
        };
        xhr.send(JSON.stringify(param));
        return xhr;
    }

    /**
     * get的方式
     * @param url           请求地址 
     * @param callback      返回的函数
     */
    public static sendHttpGet(url: string, callback: (statusCode: number, resp: string, respText: string) => any) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                let resp: string = xhr.responseText;
                callback && callback(xhr.status, resp, xhr.responseText);
            }
        };
        xhr.onerror = function (err) {
            callback && callback(-1, "", "Network error");
        };
        xhr.send();
    }
}
