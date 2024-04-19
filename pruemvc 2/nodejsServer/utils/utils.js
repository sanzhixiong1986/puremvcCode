var utils = {

    random_string: function (len) {
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';

        var maxPos = $chars.length;
        var str = '';
        for (var i = 0; i < len; i++) {
            str += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return str;
    },

    random_int_str: function (len) {
        var $chars = '0123456789';

        var maxPos = $chars.length;
        var str = '';
        for (var i = 0; i < len; i++) {
            str += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return str;
    },

    // 随机的生成[begin, end] 范围内的数据
    random_int: function (begin, end) {
        var num = begin + Math.random() * (end - begin + 1);
        num = Math.floor(num);
        if (num > end) {
            num = end;
        }
        return num;
    },

    //返回当前的时间戳
    timestamp: function () {
        let date = new Date();
        let time = Date.parse(date);
        time = time / 1000;
        return time;
    },

    // 时间戳是秒，Date是毫秒
    timestamp2date: function (time) {
        var date = new Date();
        date.setTime(time * 1000); // 
        return [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
    },

    //date2timestamp
    date2timestamp: function (strtime) {
        var date = new Date(strtime.replace(/-/g, '/'));
        var time = Date.parse(date);
        return (time / 1000);
    },

    //timestamp_today
    timestamp_today: function () {
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);

        var time = Date.parse(date); // 1970到现在过去的毫秒数
        time = time / 1000;
        return time;
    },

    //timestamp_yesterday
    timestamp_yesterday: function () {
        var time = this.timestamp_today();
        return (time - 24 * 60 * 60)
    },
};

module.exports = utils
