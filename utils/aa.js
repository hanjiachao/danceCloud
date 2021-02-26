var polyvLivePlayer = {
  version: 20180118,
  jsonHost: "https://router.polyv.net/proxy/",
  currentTime: 0,
  state: "end",
  apiState: "end",
  wholeTime: 0,
  time: 0,
  detailTime: 0,
  stateEverLive: false,
  streamName: "",
  timeStamp: 0,
  uid: "",
  cid: "",
  pid: "",
  apiUrl: "",
  stateMode: 0,
  param1: "",
  param2: "",
  param3: "",
  param4: "",
  param5: "webapp",
  getVersion: function () {
    return this.version
  },
  getVideo: function (e) {
    this.options = e;
    var t = this;
    var a = {};
    if (e.uid == "" || e.vid == "") {
      a = { code: 0, error: "lack of uid/vid" };
      this.showError(a);
      return
    }
    t.videoContext = e.videoContext;
    t.uid = e.uid;
    t.cid = e.vid;
    t.pid = t.pid == "" ? t.getPlayId() : t.pid;
    if (e.params) {
      if (e.params.param1) {
        t.param1 = e.params.param1
      }
      if (e.params.param2) {
        t.param2 = e.params.param2
      }
      if (e.params.param3) {
        t.param3 = e.params.param3
      }
      if (e.params.param4) {
        t.param4 = e.params.param4
      }
      if (e.params.param5) {
        t.param5 = e.params.param5
      }
    }
    wx.request({
      url: "https://player.polyv.net/service/v1/channel_" + t.uid + "_" + t.cid + ".json?ran=" + Math.floor(Math.random() * 9999999),
      method: "GET",
      success: function (e) {
        a.title = e.data.name;
        a.src = e.data.m3u8Url;
        a.poster = t.proxyUrl(e.data.coverImage);
        a.waitImage = t.proxyUrl(e.data.waitImage);
        a.logoImage = t.proxyUrl(e.data.logoImage);
        a.logoHref = t.proxyUrl(e.data.logoHref);
        a.logoOpacity = e.data.logoOpacity;
        a.logoPosition = e.data.logoPosition;
        if (e.data.isOnlyAudio == "Y") {
          if (src.indexOf("?") > -1) {
            a.src = a.src + "&only-audio=1"
          } else {
            a.src = a.src + "?only-audio=1"
          }
        }
        a.flvSrc = e.data.url + e.data.stream + ".flv";
        if (e.data.isNgbEnabled == "Y") {
          a.flvSrc = e.data.ngbUrl + e.data.stream + ".flv"
        } else if (e.data.isUrlProtected == "Y") {
          a.flvSrc = e.data.bakUrl + e.data.stream + ".flv"
        }
        if (e.data.isUrlProtected == "Y") {
          a.flvSrc = a.flvSrc + "?wsSecret=" + e.data.streamSign + "&wsTime=" + e.data.currentTimeSecs
        }
        if (t.options.success) {
          t.options.success(a)
        }
        // t.streamName = e.data.stream;
        // t.apiUrl = "https://api.polyv.net/live/live_status/query?stream=" + t.streamName;
        // t.render();
        // if (t.countInterval) {
        //   clearInterval(t.countInterval)
        // }
        // t.countInterval = setInterval(function () {
        //   t.countWholeTime()
        // }, 1e3)
      },
      fail: function (e) {
        a = { code: 1, error: "load json fail" };
        showError(a)
      }
    })
  },
  timeUpdate: function (e) {
    if (e && e.detail && e.detail.currentTime) {
      this.detailTime = e.detail.currentTime
    }
  },
  play: function () {
  },
  pause: function () {
  },
  ended: function () {
  },
  render: function () {
    var e = this;
    if (e.state == "end" && !e.stateEverLive) {
      console.log(e.stateEverLive);
      console.log(e.state);

      // e.videoContext.pause()
    }
    setTimeout(function () {
      e.render()
    }, 5e3)
  },
  countWholeTime: function () {
    var e = this;
    var t = (new Date).getTime();
    e.updateState();
    if (t - e.timeStamp > 6 * 1e3) {
      e.timeStamp = t;
      e.updateApiState();
      e.sendState()
    }
    if (e.apiState == "live") {
      e.wholeTime++
    }
    if (e.state == "live") {
      e.time++
    }
  },
  updateState: function () {
    if (this.currentTime == this.detailTime) {
      this.state = "end"
    } else {
      this.stateMode = 1;
      this.stateEverLive = true;
      this.state = "live";
      this.currentTime = this.detailTime
    }
  },
  updateApiState: function () {
    var e = this;
    if (e.streamName != "") {
      wx.request({
        url: e.apiUrl, dataType: "jsonp", success: function (t) {
          e.apiState = t.data.indexOf("live") > -1 ? "live" : "end";
          if (e.options.onApiStatus) {
            e.options.onApiStatus(e.apiState)
          }
        }
      })
    }
  },
  sendState: function () {
    var e = this;
    var t = 0;
    if (e.stateMode == 0) {
      t = e.wholeTime
    } else {
      t = e.time
    }
    if (t > 0 && e.state == "live") {
      var a = (new Date).getTime();
      var r = "rtas.net" + e.pid + e.cid + "0" + t;
      var i = MD5(r) + "";
      var n = {
        pid: e.pid,
        uid: e.uid,
        cid: e.cid,
        pd: t,
        sd: t,
        sign: i,
        flow: 0,
        ts: a,
        param1: e.param1,
        param2: e.param2,
        param3: e.param3,
        param4: e.param4,
        param5: e.param5
      };
      wx.request({ url: "https://rtas.videocc.net/v1/view", data: n })
    }
  },
  getPlayId: function () {
    var e = (new Date).getTime() + "";
    var t = parseInt(Math.random() * 1e6 + 1e6) + "";
    return e + "X" + t
  },
  proxyUrl: function (e) {
    e = e.replace(/.*?:\/\//g, "");
    if (e == "") {
      return e
    }
    return "https://router.polyv.net/proxy/" + e
  },
  showError: function (e) {
    if (this.options.error) {
      this.options.error(e)
    }
  }
};
var MD5 = function (e) {
  function t(e, t) {
    return e << t | e >>> 32 - t
  }

  function a(e, t) {
    var a, r, i, n, o;
    i = e & 2147483648;
    n = t & 2147483648;
    a = e & 1073741824;
    r = t & 1073741824;
    o = (e & 1073741823) + (t & 1073741823);
    if (a & r) {
      return o ^ 2147483648 ^ i ^ n
    }
    if (a | r) {
      if (o & 1073741824) {
        return o ^ 3221225472 ^ i ^ n
      } else {
        return o ^ 1073741824 ^ i ^ n
      }
    } else {
      return o ^ i ^ n
    }
  }

  function r(e, t, a) {
    return e & t | ~e & a
  }

  function i(e, t, a) {
    return e & a | t & ~a
  }

  function n(e, t, a) {
    return e ^ t ^ a
  }

  function o(e, t, a) {
    return t ^ (e | ~a)
  }

  function s(e, i, n, o, s, p, d) {
    e = a(e, a(a(r(i, n, o), s), d));
    return a(t(e, p), i)
  }

  function p(e, r, n, o, s, p, d) {
    e = a(e, a(a(i(r, n, o), s), d));
    return a(t(e, p), r)
  }

  function d(e, r, i, o, s, p, d) {
    e = a(e, a(a(n(r, i, o), s), d));
    return a(t(e, p), r)
  }

  function u(e, r, i, n, s, p, d) {
    e = a(e, a(a(o(r, i, n), s), d));
    return a(t(e, p), r)
  }

  function l(e) {
    var t;
    var a = e.length;
    var r = a + 8;
    var i = (r - r % 64) / 64;
    var n = (i + 1) * 16;
    var o = Array(n - 1);
    var s = 0;
    var p = 0;
    while (p < a) {
      t = (p - p % 4) / 4;
      s = p % 4 * 8;
      o[t] = o[t] | e.charCodeAt(p) << s;
      p++
    }
    t = (p - p % 4) / 4;
    s = p % 4 * 8;
    o[t] = o[t] | 128 << s;
    o[n - 2] = a << 3;
    o[n - 1] = a >>> 29;
    return o
  }

  function m(e) {
    var t = "", a = "", r, i;
    for (i = 0; i <= 3; i++) {
      r = e >>> i * 8 & 255;
      a = "0" + r.toString(16);
      t = t + a.substr(a.length - 2, 2)
    }
    return t
  }

  function f(e) {
    e = e.replace(/\r\n/g, "\n");
    var t = "";
    for (var a = 0; a < e.length; a++) {
      var r = e.charCodeAt(a);
      if (r < 128) {
        t += String.fromCharCode(r)
      } else if (r > 127 && r < 2048) {
        t += String.fromCharCode(r >> 6 | 192);
        t += String.fromCharCode(r & 63 | 128)
      } else {
        t += String.fromCharCode(r >> 12 | 224);
        t += String.fromCharCode(r >> 6 & 63 | 128);
        t += String.fromCharCode(r & 63 | 128)
      }
    }
    return t
  }

  var v = Array();
  var c, h, g, y, S, T, w, C, U;
  var x = 7, I = 12, P = 17, L = 22;
  var V = 5, A = 9, E = 14, M = 20;
  var b = 4, D = 11, N = 16, O = 23;
  var j = 6, q = 10, Y = 15, H = 21;
  e = f(e);
  v = l(e);
  T = 1732584193;
  w = 4023233417;
  C = 2562383102;
  U = 271733878;
  for (c = 0; c < v.length; c += 16) {
    h = T;
    g = w;
    y = C;
    S = U;
    T = s(T, w, C, U, v[c + 0], x, 3614090360);
    U = s(U, T, w, C, v[c + 1], I, 3905402710);
    C = s(C, U, T, w, v[c + 2], P, 606105819);
    w = s(w, C, U, T, v[c + 3], L, 3250441966);
    T = s(T, w, C, U, v[c + 4], x, 4118548399);
    U = s(U, T, w, C, v[c + 5], I, 1200080426);
    C = s(C, U, T, w, v[c + 6], P, 2821735955);
    w = s(w, C, U, T, v[c + 7], L, 4249261313);
    T = s(T, w, C, U, v[c + 8], x, 1770035416);
    U = s(U, T, w, C, v[c + 9], I, 2336552879);
    C = s(C, U, T, w, v[c + 10], P, 4294925233);
    w = s(w, C, U, T, v[c + 11], L, 2304563134);
    T = s(T, w, C, U, v[c + 12], x, 1804603682);
    U = s(U, T, w, C, v[c + 13], I, 4254626195);
    C = s(C, U, T, w, v[c + 14], P, 2792965006);
    w = s(w, C, U, T, v[c + 15], L, 1236535329);
    T = p(T, w, C, U, v[c + 1], V, 4129170786);
    U = p(U, T, w, C, v[c + 6], A, 3225465664);
    C = p(C, U, T, w, v[c + 11], E, 643717713);
    w = p(w, C, U, T, v[c + 0], M, 3921069994);
    T = p(T, w, C, U, v[c + 5], V, 3593408605);
    U = p(U, T, w, C, v[c + 10], A, 38016083);
    C = p(C, U, T, w, v[c + 15], E, 3634488961);
    w = p(w, C, U, T, v[c + 4], M, 3889429448);
    T = p(T, w, C, U, v[c + 9], V, 568446438);
    U = p(U, T, w, C, v[c + 14], A, 3275163606);
    C = p(C, U, T, w, v[c + 3], E, 4107603335);
    w = p(w, C, U, T, v[c + 8], M, 1163531501);
    T = p(T, w, C, U, v[c + 13], V, 2850285829);
    U = p(U, T, w, C, v[c + 2], A, 4243563512);
    C = p(C, U, T, w, v[c + 7], E, 1735328473);
    w = p(w, C, U, T, v[c + 12], M, 2368359562);
    T = d(T, w, C, U, v[c + 5], b, 4294588738);
    U = d(U, T, w, C, v[c + 8], D, 2272392833);
    C = d(C, U, T, w, v[c + 11], N, 1839030562);
    w = d(w, C, U, T, v[c + 14], O, 4259657740);
    T = d(T, w, C, U, v[c + 1], b, 2763975236);
    U = d(U, T, w, C, v[c + 4], D, 1272893353);
    C = d(C, U, T, w, v[c + 7], N, 4139469664);
    w = d(w, C, U, T, v[c + 10], O, 3200236656);
    T = d(T, w, C, U, v[c + 13], b, 681279174);
    U = d(U, T, w, C, v[c + 0], D, 3936430074);
    C = d(C, U, T, w, v[c + 3], N, 3572445317);
    w = d(w, C, U, T, v[c + 6], O, 76029189);
    T = d(T, w, C, U, v[c + 9], b, 3654602809);
    U = d(U, T, w, C, v[c + 12], D, 3873151461);
    C = d(C, U, T, w, v[c + 15], N, 530742520);
    w = d(w, C, U, T, v[c + 2], O, 3299628645);
    T = u(T, w, C, U, v[c + 0], j, 4096336452);
    U = u(U, T, w, C, v[c + 7], q, 1126891415);
    C = u(C, U, T, w, v[c + 14], Y, 2878612391);
    w = u(w, C, U, T, v[c + 5], H, 4237533241);
    T = u(T, w, C, U, v[c + 12], j, 1700485571);
    U = u(U, T, w, C, v[c + 3], q, 2399980690);
    C = u(C, U, T, w, v[c + 10], Y, 4293915773);
    w = u(w, C, U, T, v[c + 1], H, 2240044497);
    T = u(T, w, C, U, v[c + 8], j, 1873313359);
    U = u(U, T, w, C, v[c + 15], q, 4264355552);
    C = u(C, U, T, w, v[c + 6], Y, 2734768916);
    w = u(w, C, U, T, v[c + 13], H, 1309151649);
    T = u(T, w, C, U, v[c + 4], j, 4149444226);
    U = u(U, T, w, C, v[c + 11], q, 3174756917);
    C = u(C, U, T, w, v[c + 2], Y, 718787259);
    w = u(w, C, U, T, v[c + 9], H, 3951481745);
    T = a(T, h);
    w = a(w, g);
    C = a(C, y);
    U = a(U, S)
  }
  var _ = m(T) + m(w) + m(C) + m(U);
  return _.toLowerCase()
};

function getVideo(e) {
  polyvLivePlayer.getVideo(e)
}

function timeUpdate(e) {
  polyvLivePlayer.timeUpdate(e)
}

function play() {
  polyvLivePlayer.play()
}

function pause() {
  polyvLivePlayer.pause()
}

function ended() {
  polyvLivePlayer.ended()
}

function getVersion() {
  return polyvLivePlayer.getVersion()
}

module.exports = {
  getVersion: getVersion,
  getVideo: getVideo,
  timeUpdate: timeUpdate,
  play: play,
  pause: pause,
  ended: ended
};