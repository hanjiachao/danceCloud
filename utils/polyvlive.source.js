

var polyvLivePlayer = {
	version:20180118,
	jsonHost:"https://router.polyv.net/proxy/",
	currentTime:0,
	state:"end",
	apiState:"end",
	wholeTime:0,
  time:0,
  detailTime:0,
  stateEverLive:false,
	streamName:"",
	timeStamp:0,
  uid:"",
  cid:"",
  pid:"",
	apiUrl:"",
  stateMode:0,
  param1:"",
  param2: "",
  param3: "",
  param4: "",
  param5: "webapp",
  /**获取播放sdk版本 */
  getVersion:function(){
    return this.version;
  },
	/*获取videojson数据*/
    getVideo:function(options){

        this.options = options;
        
		var that = this;

        var data = {};

        if(options.uid=="" || options.vid==""){
            data = {
              code:0,
              error: "lack of uid/vid"
            };
            this.showError(data);
            return;
        }

		that.videoContext = options.videoContext;
        that.uid = options.uid;
        that.cid = options.vid;
        that.pid = that.pid==""?that.getPlayId():that.pid;

        if(options.params){
          if (options.params.param1){
            that.param1 = options.params.param1;
          }
          if (options.params.param2) {
            that.param2 = options.params.param2;
          }
          if (options.params.param3) {
            that.param3 = options.params.param3;
          }
          if (options.params.param4) {
            that.param4 = options.params.param4;
          }
          if (options.params.param5) {
            that.param5 = options.params.param5;
          }
        }

		wx.request({
      url: "https://player.polyv.net/service/v1/channel_" + that.uid + "_" + that.cid + ".json?ran=" + Math.floor(Math.random() * 9999999) ,
			method: 'GET',
			success: function(res) {
				data.title = res.data.name;
				data.src = res.data.m3u8Url;
				data.poster = that.proxyUrl(res.data.coverImage);
				data.waitImage = that.proxyUrl(res.data.waitImage);
				data.logoImage = that.proxyUrl(res.data.logoImage);
				data.logoHref = that.proxyUrl(res.data.logoHref);
				data.logoOpacity = res.data.logoOpacity;
				data.logoPosition = res.data.logoPosition;
				//data.advertType = res.data.advertType;
				//data.advertDuration = res.data.advertDuration;
				//data.advertImage = that.proxyUrl(res.data.advertImage);
				//data.advertFlvUrl = that.proxyUrl(res.data.advertFlvUrl);
				//data.advertHref = that.proxyUrl(res.data.advertHref);
        //data.ngbMode = res.data.isUrlProtected=="Y"?true:false;

        //音频模式
				if(res.data.isOnlyAudio == "Y"){
					if(src.indexOf("?")>-1){
						data.src = data.src + "&only-audio=1"
					}else{
						data.src = data.src + "?only-audio=1";
					}
				}

        data.flvSrc = res.data.url + res.data.stream + ".flv";
        
        //flv拉流地址
        if (res.data.isNgbEnabled=="Y"){
          data.flvSrc = res.data.ngbUrl + res.data.stream + ".flv";
        } else if (res.data.isUrlProtected == "Y"){
          data.flvSrc = res.data.bakUrl + res.data.stream + ".flv";
        }

        //添加时间戳
        if(res.data.isUrlProtected == "Y"){
          data.flvSrc = data.flvSrc + "?wsSecret=" + res.data.streamSign + "&wsTime=" + res.data.currentTimeSecs;
        }

        if (that.options.success) {
          that.options.success(data);
        }
        
				that.streamName = res.data.stream;
				that.apiUrl = "https://api.polyv.net/live/live_status/query?stream=" + that.streamName;

				/*监测是否已开始直播*/
				that.render();

        if(that.countInterval){
            clearInterval(that.countInterval);
        }
				that.countInterval = setInterval(function(){that.countWholeTime()},1e3);

			},
			fail:function(res){
				data = {
          code:1,
          error:"load json fail"
        };
        showError(data);
			}

		});

	},
	timeUpdate:function(e){
		if(e && e.detail && e.detail.currentTime){
        this.detailTime = e.detail.currentTime;
		}
		
		//递增
		//console.log(this.detailTime);
	},
	play:function(){
		//console.log("playing");
	},
	pause:function(){
		//console.log("pauseing");
	},
	ended:function(){
		//console.log("ended");
	},
	render:function(){
		var that = this;
		
		if(that.state == "end" && !that.stateEverLive){
			that.videoContext.pause();
		}

		setTimeout(function(){
			that.render();
		},5e3);
        
	},
	countWholeTime:function(){
		var that = this;
		var time = new Date().getTime();
		
    that.updateState();

		if(time - that.timeStamp > 6*1000){
			that.timeStamp = time;
			that.updateApiState();
			that.sendState();
		}

		if(that.apiState == "live"){
			that.wholeTime++;
		}

    if(that.state == "live"){
            that.time++;
     }

	},
    updateState:function(){
        
        if(this.currentTime == this.detailTime){
            this.state = "end";
        }else{
            this.stateMode = 1;
            this.stateEverLive = true;
            this.state = "live";
            this.currentTime = this.detailTime;
        }

    },
	updateApiState:function(){
		var that = this;
		//请求api 并且发送观看计时
		if(that.streamName!=""){
			wx.request({
				url: that.apiUrl,
				dataType: 'jsonp',
				success: function(res){
					that.apiState = res.data.indexOf("live")>-1?"live":"end";
                    if(that.options.onApiStatus){
                        that.options.onApiStatus(that.apiState);
                    }
				}

			});
		}
	},
	sendState:function(){
        var that = this;

        var time = 0;
        
        if(that.stateMode == 0){
            time = that.wholeTime;
        }else{
            time = that.time;
        }

        if (time > 0 && that.state=="live"){
            var ts = new Date().getTime();
            var plain = "rtas.net" + that.pid + that.cid + "0" + time;
            var sign = MD5(plain) + "";
            
            var statsObject = {
                pid:that.pid,
                uid:that.uid,
                cid:that.cid,
                pd:time,
                sd:time,
                sign:sign,
                flow:0,
                ts:ts,
                param1:that.param1,
                param2: that.param2,
                param3: that.param3,
                param4: that.param4,
                param5: that.param5,
            }

            wx.request({
                url: "https://rtas.videocc.net/v1/view",
                data: statsObject
            });

		}
	},
    getPlayId:function(){
        var ts = new Date().getTime() + "";
        var random =parseInt(Math.random()*1000000+1000000)+"";

        return (ts+"X"+random);
    },
	proxyUrl:function(url){
		
		url = url.replace(/.*?:\/\//g,"");

		if(url == ""){
			return url;
		}

  		return "https://router.polyv.net/proxy/"+url;

	},
    showError:function(data){
        if(this.options.error){
            this.options.error(data);
        }
    }

}

var MD5 = function (string) {
  
    function RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }
  
    function AddUnsigned(lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }
  
    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }
  
    function FF(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
  
    function GG(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
  
    function HH(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
  
    function II(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
  
    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };
  
    function WordToHex(lValue) {
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };
  
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
  
        for (var n = 0; n < string.length; n++) {
  
            var c = string.charCodeAt(n);
  
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
  
        }
  
        return utftext;
    };
  
    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;
  
    string = Utf8Encode(string);
  
    x = ConvertToWordArray(string);
  
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
  
    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=AddUnsigned(a,AA);
        b=AddUnsigned(b,BB);
        c=AddUnsigned(c,CC);
        d=AddUnsigned(d,DD);
    }
  
    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
  
    return temp.toLowerCase();
}

function getVideo(options){
	polyvLivePlayer.getVideo(options);
}

function timeUpdate(e){
	polyvLivePlayer.timeUpdate(e);
}

function play(){
	polyvLivePlayer.play();
}

function pause(){
	polyvLivePlayer.pause();
}

function ended(){
	polyvLivePlayer.ended();
}

function getVersion(){
  return polyvLivePlayer.getVersion();
}

module.exports = {
  getVersion:getVersion,
	getVideo:getVideo,
	timeUpdate:timeUpdate,
	play:play,
	pause:pause,
	ended:ended
}