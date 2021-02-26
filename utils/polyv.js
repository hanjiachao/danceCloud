var CusBase64 = require("base64.js");
var polyvVodPlayer = {
    version: "v1.0.0",
    buidMetaData: 20180521,
    jsonHost: "https://router.polyv.net/secure/",
    isPreviewMode: false,
    isWx: false,
    token: "",
    seed: 0,
    state: "end",
    timeStamp: 0,
    time: 0,
    currentTime: 0,
    detailTime: 0,
    videoId: "",
    pid: "",
    uid: "",
    flow: 0,
    pd: 0,
    sd: 0,
    cts: 0,
    duration: 0,
    pn: "",
    pv: "",
    sign: "",
    sessionId: "",
    param1: "",
    param2: "",
    param3: "",
    param4: "",
    param5: "",
    getVideo: function (e) {
        this.loadJson(e)
    },
    getPreviewVideo: function (e) {
        this.isPreviewMode = true;
        this.loadJson(e)
    },
    loadJson: function (e) {
        var r = this.version;
        var t = {version: r, timeoutflow: false, outflow: false};
        if (e.vid == "") {
            t = {version: r, error: "vid不能为空"};
            e.callback(t);
            return
        }
        var a = (new Date).getTime();
        var i = Math.floor(Math.random() * 1e6 + 1e6);
        var s = a + "X" + i;
        var n = e.vid.substr(0, 10);
        var o = this;
        o.videoId = e.vid;
        o.ts = e.ts;
        o.sign = e.sign;
        o.uid = n;
        o.pid = s;
        o.version = t.version;
        if (e.params) {
            if (e.params.param1) {
                o.param1 = e.params.param1
            }
            if (e.params.param2) {
                o.param2 = e.params.param2
            }
            if (e.params.param3) {
                o.param3 = e.params.param3
            }
            if (e.params.param4) {
                o.param4 = e.params.param4
            }
            if (e.params.param5) {
                o.param5 = e.params.param5
            }
        }
        if (e.sid) {
            o.sessionId = e.sid
        }
        wx.request({
            url: o.jsonHost + e.vid + ".js", method: "GET", success: function (r) {
                if (r.data.timeoutflow == "true") {
                    t.timeoutflow = true
                } else if (r.data.outflow == "true") {
                    t.outflow = true
                } else {
                    t.poster = r.data.first_image;
                    t.title = r.data.title;
                    t.teaser_url = r.data.teaser_url;
                    t.catatree = r.data.catatree;
                    t.adMatter = r.data.adMatter;
                    t.ratio = r.data.ratio;
                    t.duration = r.data.duration;
                    t.poster = o.proxy(t.poster);
                    t.teaser_url = o.proxy(t.teaser_url);
                    t.adMatter = o.proxy(t.adMatter, "matterurl");
                    o.seed = r.data.seed;
                    if (r.data.seed == 1) {
                        t.src = o.proxy(r.data.hls)
                    } else {
                        t.src = o.proxy(r.data.mp4)
                    }
                    o.duration = r.data.duration
                }
                if (o.seed === 1 && e.wxApp && e.wxApp.isWx) {
                    o.isWx = true;
                    o.getWxToken(e, function (a) {
                        o.token = a;
                        for (var i = 0; i < r.data.hls.length; i++) {
                            if (e.hlstest) {
                                t.src[i] = o.resetUrl(r.data.hls[i]).replace("hls.", "hlstest.")
                            } else {
                                t.src[i] = o.resetUrl(r.data.hls[i])
                            }
                        }
                        e.callback(t)
                    }, function () {
                        t = {error: "播放token获取失败"};
                        e.callback(t)
                    })
                } else {
                    e.callback(t)
                }
                if (o.countInterval) {
                    clearInterval(o.countInterval)
                }
                o.countInterval = setInterval(function () {
                    o.countWholeTime()
                }, 1e3)
            }, fail: function (r) {
                console.log(r)
                t = {error: "视频数据获取失败"};
                e.callback(t)
            }
        })
    },
    getWxToken: function (e, r) {
        var t = e.wxApp.wxAppUrl;
        let a = (new Date).getTime();
        let i = CModule.ccall("getsign", "string", ["string", "string", "string"], [e.wxApp.wxUserId, e.vid, a.toString()]);
        var s = e.wxApp;
        s.iswxa = 1;
        s.vid = e.vid;
        s.ts = a;
        s.sign = i;
        wx.request({
            url: t, method: "GET", data: s, success: function (e) {
                let t = CModule.ccall("loadtoken", "string", ["string"], [e.data]);
                r(JSON.parse(t).data.token)
            }, fail: function () {
            }
        })
    },
    timeUpdate: function (e) {
        if (e && e.detail && e.detail.currentTime) {
            this.detailTime = e.detail.currentTime
        }
    },
    updateState: function () {
        if (this.currentTime == this.detailTime) {
            this.state = "end"
        } else {
            this.state = "played";
            this.currentTime = this.detailTime
        }
    },
    countWholeTime: function () {
        var e = this;
        var r = (new Date).getTime();
        e.updateState();
        if (this.state == "played") {
            e.time += 1
        }
        if (r - e.timeStamp > 9 * 1e3) {
            e.timeStamp = r;
            e.sendState()
        }
    },
    sendState: function () {
        var e = this;
        var r = 0;
        var t = 0;
        t = Math.floor(this.currentTime);
        r = e.time;
        if (r > 0 && e.state == "played") {
            var a = (new Date).getTime();
            var i = "rtas.net" + e.pid + e.videoId + e.flow + r + t;
            var s = MD5(i);
            var n = e.sessionId;
            if (e.param1 || e.param2 || e.param3 || e.param4 || e.param5) {
                var o = {
                    pid: e.pid,
                    uid: e.uid,
                    vid: e.videoId,
                    flow: 0,
                    pd: r,
                    sd: r,
                    cts: t,
                    duration: e.duration,
                    pn: "webapp_vod",
                    pv: e.version,
                    sign: s,
                    sid: CusBase64.CusBASE64.encoder(n),
                    param1: CusBase64.CusBASE64.encoder(e.param1),
                    param2: CusBase64.CusBASE64.encoder(e.param2),
                    param3: CusBase64.CusBASE64.encoder(e.param3),
                    param4: CusBase64.CusBASE64.encoder(e.param4),
                    param5: CusBase64.CusBASE64.encoder(e.param5)
                }
            } else if (n) {
                var o = {
                    pid: e.pid,
                    uid: e.uid,
                    vid: e.videoId,
                    flow: 0,
                    pd: r,
                    sd: r,
                    cts: t,
                    duration: e.duration,
                    pn: "webapp_vod",
                    pv: e.version,
                    sign: s,
                    sid: CusBase64.CusBASE64.encoder(n)
                }
            } else {
                var o = {
                    pid: e.pid,
                    uid: e.uid,
                    vid: e.videoId,
                    flow: 0,
                    pd: r,
                    sd: r,
                    cts: t,
                    duration: e.duration,
                    pn: "webapp_vod",
                    pv: e.version,
                    sign: s
                }
            }
            wx.request({url: "https://prtas.videocc.net/v1/view", data: o})
        }
    },
    proxy: function (e, r) {
        var t = this;
        if (typeof e == "undefined" || e.length == 0) {
            return ""
        }
        if (typeof e == "string") {
            e = this.resetUrl(e);
            return this.proxyUrl(e)
        } else {
            if (arguments[1]) {
                for (var a = 0, i = e.length; a < i; a++) {
                    for (var s in e[a]) {
                        if (s == r) {
                            e[a][s] = this.proxyUrl(e[a][s])
                        }
                    }
                }
            } else {
                for (var a = 0, i = e.length; a < i; a++) {
                    if (this.isPreviewMode) {
                        var n = this.videoId.substring(0, 32);
                        e[a] = e[a].replace(n, "p_" + n)
                    }
                    if (t.ts && t.sign) {
                        if (e[a].indexOf("?") > -1) {
                            e[a] = e[a] + "&ts=" + t.ts + "&sign=" + t.sign
                        } else {
                            e[a] = e[a] + "?ts=" + t.ts + "&sign=" + t.sign
                        }
                    }
                    e[a] = this.proxyUrl(e[a])
                }
            }
            return e
        }
        return ""
    },
    proxyUrl: function (e) {
        if (e == "") {
            return e
        }
        e = e.replace(/.*?:\/\//g, "");
        return "https://router.polyv.net/proxy/" + e
    },
    resetUrl: function (e) {
        var r = this;
        if (this.isPreviewMode && r.seed == 1) {
            var t = this.videoId.substring(0, 32);
            e = e.replace(t, "p_" + t)
        }
        if (r.ts && r.sign) {
            if (e.indexOf("?") > -1) {
                e = e + "&ts=" + r.ts + "&sign=" + r.sign
            } else {
                e = e + "?ts=" + r.ts + "&sign=" + r.sign
            }
        }
        if (r.isWx) {
            if (e.indexOf("?") > -1) {
                e = e + "&token=" + r.token + "&iswxa=1" + "&pid=" + r.pid
            } else {
                e = e + "?token=" + r.token + "&iswxa=1" + "&pid=" + r.pid
            }
        }
        return e
    }
};
var MD5 = function (e) {
    function r(e, r) {
        return e << r | e >>> 32 - r
    }

    function t(e, r) {
        var t, a, i, s, n;
        i = e & 2147483648;
        s = r & 2147483648;
        t = e & 1073741824;
        a = r & 1073741824;
        n = (e & 1073741823) + (r & 1073741823);
        if (t & a) {
            return n ^ 2147483648 ^ i ^ s
        }
        if (t | a) {
            if (n & 1073741824) {
                return n ^ 3221225472 ^ i ^ s
            } else {
                return n ^ 1073741824 ^ i ^ s
            }
        } else {
            return n ^ i ^ s
        }
    }

    function a(e, r, t) {
        return e & r | ~e & t
    }

    function i(e, r, t) {
        return e & t | r & ~t
    }

    function s(e, r, t) {
        return e ^ r ^ t
    }

    function n(e, r, t) {
        return r ^ (e | ~t)
    }

    function o(e, i, s, n, o, d, u) {
        e = t(e, t(t(a(i, s, n), o), u));
        return t(r(e, d), i)
    }

    function d(e, a, s, n, o, d, u) {
        e = t(e, t(t(i(a, s, n), o), u));
        return t(r(e, d), a)
    }

    function u(e, a, i, n, o, d, u) {
        e = t(e, t(t(s(a, i, n), o), u));
        return t(r(e, d), a)
    }

    function p(e, a, i, s, o, d, u) {
        e = t(e, t(t(n(a, i, s), o), u));
        return t(r(e, d), a)
    }

    function l(e) {
        var r;
        var t = e.length;
        var a = t + 8;
        var i = (a - a % 64) / 64;
        var s = (i + 1) * 16;
        var n = Array(s - 1);
        var o = 0;
        var d = 0;
        while (d < t) {
            r = (d - d % 4) / 4;
            o = d % 4 * 8;
            n[r] = n[r] | e.charCodeAt(d) << o;
            d++
        }
        r = (d - d % 4) / 4;
        o = d % 4 * 8;
        n[r] = n[r] | 128 << o;
        n[s - 2] = t << 3;
        n[s - 1] = t >>> 29;
        return n
    }

    function v(e) {
        var r = "", t = "", a, i;
        for (i = 0; i <= 3; i++) {
            a = e >>> i * 8 & 255;
            t = "0" + a.toString(16);
            r = r + t.substr(t.length - 2, 2)
        }
        return r
    }

    function f(e) {
        e = e.replace(/\r\n/g, "\n");
        var r = "";
        for (var t = 0; t < e.length; t++) {
            var a = e.charCodeAt(t);
            if (a < 128) {
                r += String.fromCharCode(a)
            } else if (a > 127 && a < 2048) {
                r += String.fromCharCode(a >> 6 | 192);
                r += String.fromCharCode(a & 63 | 128)
            } else {
                r += String.fromCharCode(a >> 12 | 224);
                r += String.fromCharCode(a >> 6 & 63 | 128);
                r += String.fromCharCode(a & 63 | 128)
            }
        }
        return r
    }

    var c = Array();
    var m, g, h, w, x, C, y, S, T;
    var A = 7, I = 12, M = 17, V = 22;
    var k = 5, B = 9, U = 14, b = 20;
    var P = 4, _ = 11, E = 16, W = 23;
    var D = 6, j = 10, q = 15, J = 21;
    e = f(e);
    c = l(e);
    C = 1732584193;
    y = 4023233417;
    S = 2562383102;
    T = 271733878;
    for (m = 0; m < c.length; m += 16) {
        g = C;
        h = y;
        w = S;
        x = T;
        C = o(C, y, S, T, c[m + 0], A, 3614090360);
        T = o(T, C, y, S, c[m + 1], I, 3905402710);
        S = o(S, T, C, y, c[m + 2], M, 606105819);
        y = o(y, S, T, C, c[m + 3], V, 3250441966);
        C = o(C, y, S, T, c[m + 4], A, 4118548399);
        T = o(T, C, y, S, c[m + 5], I, 1200080426);
        S = o(S, T, C, y, c[m + 6], M, 2821735955);
        y = o(y, S, T, C, c[m + 7], V, 4249261313);
        C = o(C, y, S, T, c[m + 8], A, 1770035416);
        T = o(T, C, y, S, c[m + 9], I, 2336552879);
        S = o(S, T, C, y, c[m + 10], M, 4294925233);
        y = o(y, S, T, C, c[m + 11], V, 2304563134);
        C = o(C, y, S, T, c[m + 12], A, 1804603682);
        T = o(T, C, y, S, c[m + 13], I, 4254626195);
        S = o(S, T, C, y, c[m + 14], M, 2792965006);
        y = o(y, S, T, C, c[m + 15], V, 1236535329);
        C = d(C, y, S, T, c[m + 1], k, 4129170786);
        T = d(T, C, y, S, c[m + 6], B, 3225465664);
        S = d(S, T, C, y, c[m + 11], U, 643717713);
        y = d(y, S, T, C, c[m + 0], b, 3921069994);
        C = d(C, y, S, T, c[m + 5], k, 3593408605);
        T = d(T, C, y, S, c[m + 10], B, 38016083);
        S = d(S, T, C, y, c[m + 15], U, 3634488961);
        y = d(y, S, T, C, c[m + 4], b, 3889429448);
        C = d(C, y, S, T, c[m + 9], k, 568446438);
        T = d(T, C, y, S, c[m + 14], B, 3275163606);
        S = d(S, T, C, y, c[m + 3], U, 4107603335);
        y = d(y, S, T, C, c[m + 8], b, 1163531501);
        C = d(C, y, S, T, c[m + 13], k, 2850285829);
        T = d(T, C, y, S, c[m + 2], B, 4243563512);
        S = d(S, T, C, y, c[m + 7], U, 1735328473);
        y = d(y, S, T, C, c[m + 12], b, 2368359562);
        C = u(C, y, S, T, c[m + 5], P, 4294588738);
        T = u(T, C, y, S, c[m + 8], _, 2272392833);
        S = u(S, T, C, y, c[m + 11], E, 1839030562);
        y = u(y, S, T, C, c[m + 14], W, 4259657740);
        C = u(C, y, S, T, c[m + 1], P, 2763975236);
        T = u(T, C, y, S, c[m + 4], _, 1272893353);
        S = u(S, T, C, y, c[m + 7], E, 4139469664);
        y = u(y, S, T, C, c[m + 10], W, 3200236656);
        C = u(C, y, S, T, c[m + 13], P, 681279174);
        T = u(T, C, y, S, c[m + 0], _, 3936430074);
        S = u(S, T, C, y, c[m + 3], E, 3572445317);
        y = u(y, S, T, C, c[m + 6], W, 76029189);
        C = u(C, y, S, T, c[m + 9], P, 3654602809);
        T = u(T, C, y, S, c[m + 12], _, 3873151461);
        S = u(S, T, C, y, c[m + 15], E, 530742520);
        y = u(y, S, T, C, c[m + 2], W, 3299628645);
        C = p(C, y, S, T, c[m + 0], D, 4096336452);
        T = p(T, C, y, S, c[m + 7], j, 1126891415);
        S = p(S, T, C, y, c[m + 14], q, 2878612391);
        y = p(y, S, T, C, c[m + 5], J, 4237533241);
        C = p(C, y, S, T, c[m + 12], D, 1700485571);
        T = p(T, C, y, S, c[m + 3], j, 2399980690);
        S = p(S, T, C, y, c[m + 10], q, 4293915773);
        y = p(y, S, T, C, c[m + 1], J, 2240044497);
        C = p(C, y, S, T, c[m + 8], D, 1873313359);
        T = p(T, C, y, S, c[m + 15], j, 4264355552);
        S = p(S, T, C, y, c[m + 6], q, 2734768916);
        y = p(y, S, T, C, c[m + 13], J, 1309151649);
        C = p(C, y, S, T, c[m + 4], D, 4149444226);
        T = p(T, C, y, S, c[m + 11], j, 3174756917);
        S = p(S, T, C, y, c[m + 2], q, 718787259);
        y = p(y, S, T, C, c[m + 9], J, 3951481745);
        C = t(C, g);
        y = t(y, h);
        S = t(S, w);
        T = t(T, x)
    }
    var O = v(C) + v(y) + v(S) + v(T);
    return O.toLowerCase()
};

function getVideo(e) {
    polyvVodPlayer.getVideo(e)
}

function getPreviewVideo(e) {
    polyvVodPlayer.getPreviewVideo(e)
}

function timeUpdate(e) {
    polyvVodPlayer.timeUpdate(e)
}

function getVersion() {
    return polyvVodPlayer.version
}

module.exports = {getVideo: getVideo, getPreviewVideo: getPreviewVideo, timeUpdate: timeUpdate, version: getVersion};