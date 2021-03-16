//index.js
var common = require("../../utils/util.js");
var polyvLive = require('../../utils/polyvlive.js');
Page({
    data: {
      liveVideoContext: '',
      studyTime: 0,
      setStudyInt: null,
        title:"-.-",
        logo:"https://livestatic.videocc.net/assets/wimages/pc_images/logo-default.png",
        companyName:"天津盘古科技有限公司",
        video:{},
        videos:{},
        uid:'',
        vid:'',
        content:'',
        isShow: false,
        noLive: false,
        cc_id: '',
      flag: true,
      currentTime: 0,
      nowTime: 0,
        isBarrage: true,
        sendCommentContent:'',
        barrageOrComment: false,
        commentList: [],
        commentListId: 0,
        refreshComment: true,
        refreshBarrage: true,
        setInter: '',
        commentIpt: false,
        text: "这是一条测试公告，看看效果怎么样，2019年3月23日",
        marqueePace: 1,//滚动速度
        marqueeDistance: 0,//初始滚动距离
        marquee_margin: 30,
        size:14,
        danmulist: [],
        barrageLastId: 0,
        sendBarrageContent: '',
        autoplay: true,
        interval: [20,30,40,50,20,10,40], // 时间间
		isFullScreen: false
    },
	fullScreen: function(){
		let player = wx.createLivePlayerContext('polyvLiveVideo')
		player.requestFullScreen({
			direction: 90,
			success: res => {
				this.setData({
					isFullScreen: true
				})
			}
		})
	},
	goBack: function(){
		let player = wx.createLivePlayerContext('polyvLiveVideo')
		player.exitFullScreen({
			success: res => {
				this.setData({
					isFullScreen: false
				})
			}
		})
	},
    // 是否开启弹幕
    isSendBarrage: function () {
        var that = this
        this.setData({
            isBarrage:!that.data.isBarrage
        })
        if (!that.data.isBarrage) {
            this.setData({
                barrageOrComment: false
            })
        }
    },
    changeBarrage: function (e) {
        this.setData({
            sendBarrageContent: e.detail.value
        })
    },
    sendBarrageIpt: function () {
        var that = this
        this.setData({
            barrageOrComment: !that.data.barrageOrComment
        })
    },
    //获取弹幕
    getBarrageList: function () {
        var that = this
        var windowWidth = wx.getSystemInfoSync().windowWidth;
        var barrageLastId = that.data.barrageLastId
        common.ajax({
            url: 'CourseComment/getList',
            userinfo: true,
            data: {
                type: '弹幕',
                room_id: that.data.vid,
                last_id: barrageLastId
            },
            success: function (res) {
                if (res.result.list.length != 0) {
                    for(var i=0;i<res.result.list.length;i++){
                        var temp = res.result.list[i]
                        temp.left = windowWidth
                        temp.top =i%5
                        temp.color = getRandomColor()
                        that.addto(temp,i)
                    }
                    that.setData({
                        barrageLastId: res.result.list[res.result.list.length - 1].id
                    })
                }
            }
        })
    },
    addto: function (temp,i) {
        var that = this
        setTimeout(function () {
            var danmu = that.data.danmulist
            danmu.push(temp)
            that.setData({
                danmulist: danmu
            })
        },Math.random()*1000*i + 300)
    },
    // 获取评论
    getCommentList: function () {
        var that = this
        var vid = that.data.vid
        var commentListId = that.data.commentListId
        common.ajax({
            url: 'CourseComment/getList',
            userinfo: true,
            // loading: '加载中...',
            data: {
                type: '评论',
                room_id: vid,
                last_id: commentListId
            },
            success: function (res) {
                var list = that.data.commentList
                var lastId = 0
                if (res.result.list.length == 0) {
                    that.setData({
                        refreshComment: false,
                        commentListId: 1
                    })
                } else {
                    for (var i = 0; i < res.result.list.length; i++) {
                        list.push(res.result.list[i])
                    }
                    lastId = list[list.length - 1].id
                    that.setData({
                        commentList: list,
                        commentListId: lastId
                    })
                }
            }
        })
    },
    scrolltxt: function () {
        var that = this;
        var windowWidth = wx.getSystemInfoSync().windowWidth;
        var inter = setInterval(function () {
            if (that.data.danmulist.length == 0){
                return false
            }
            for(var i=0;i<that.data.danmulist.length;i++){
                that.data.danmulist[i].left -=1
                if (that.data.danmulist[i].left < -200){
                    that.data.danmulist.splice(i,1)
                }
            }
            that.setData({
                danmulist:that.data.danmulist
            })
        }, 40);
    },
    changeComment: function (e) {
        this.setData({
            sendCommentContent:e.detail.value
        })
    },
    // 上拉加载更多评论
    onReachBottom: function () {
        let that = this
        if (that.data.refreshComment) {
            that.getCommentList()
        }
    },
    // 发送弹幕
    sendDanmu: function () {
        this.videoContext.sendDanmu({
            text: 111222,
            color: getRandomColor()
        })
    },
    sendBarrage: function () {
        var that = this
        var vid = that.data.vid
        if (that.data.sendBarrageContent == "") {
            return false
        }
        common.ajax({
            url: 'CourseComment/send',
            userinfo: true,
            data: {
                type: '弹幕',
                room_id: vid,
                content: that.data.sendBarrageContent
            },
            success: function (res) {
                that.setData({
                    sendBarrageContent: '',
                    barrageOrComment: false
                })
            }
        })
    },
    bindvideo: function () {
        var that = this
      setInterval(function () {
        that.videoContext.play()
      }, 2000)
      
    },

    // 发送评论
    sendComment: function () {
        var that = this
        var vid = that.data.vid
        if (that.data.sendCommentContent == "") {
            return false
        }
        common.ajax({
            url: 'CourseComment/send',
            userinfo: true,
            data: {
                type: '评论',
                room_id: vid,
                content: that.data.sendCommentContent
            },
            success: function (res) {
                wx.showToast({
                    icon: "none",
                    title: '评论成功',
                    duration: 888
                })
                wx.getUserInfo({
                    success: ret => {
                    let date = new Date()
                    var month = date.getMonth() + 1
                    var day = date.getDate()
                    var hours = date.getHours()
                    var minutes = date.getMinutes()
                    var seconds = date.getSeconds()
                    if (month < 10) {
                    month = "0" + month
                }
                if (day < 10) {
                    day = "0" + day
                }
                if (hours < 10) {
                    hours = "0" + hours
                }
                if (minutes < 10) {
                    minutes = "0" + minutes
                }
                if (seconds < 10) {
                    seconds = "0" + seconds
                }
                var myDate = [date.getFullYear(),month, day]
                var myTime = [hours, minutes, seconds]
                var list = that.data.commentList
                list.splice(0,0,{
                    us_headimg: ret.userInfo.avatarUrl,
                    us_nickname: ret.userInfo.nickName,
                    content: that.data.sendCommentContent,
                    add_time: myDate.join('-') + ' ' + myTime.join(":")
                })
                that.setData({
                    commentList: list,
                    sendCommentContent: ''
                })
            }
            })
            }
        })
    },
    timeUpdate: function(e) {
        var that = this
        this.setData({
          nowTime: e.detail.currentTime
        })
        polyvLive.timeUpdate(e);
    },
    videoError: function (res) {
      console.log(res + 'wyy')
      // wx.showToast({
      //   title: '播放出错，请稍等！',
      //   icon: 'none',
      //   duration: 1000
      // })
      // this.setData({
      //   flag: false
      // })
      // setTimeout(() => {
      //   this.setData({
      //     flag: true
      //   })
      //   this.setData({
      //     currentTime:this.data.nowTime
      //   })
      // }, 100)
    },
  play: function() {
    console.log(111)
  },
  pause: function() {
    this.data.liveVideoContext.play()
  },
    onLoad: function (options) {
        this.setData({
            uid: options.uid,
            vid: options.vid
        })
        wx.showLoading({
            title: '加载中...'
        })
    },
    onShow: function () {
       this.scrolltxt();
      let that = this
      if (that.data.isShow) {
        that.data.setStudyInt = setInterval(function () {
          let time = that.data.studyTime + 1
          that.setData({
            studyTime: time
          })
        }, 1000)
      }
    },
    onHide: function () {
      clearInterval(this.data.setStudyInt)
    },
  onUnload: function () {
    clearInterval(this.data.setStudyInt)
    clearInterval(this.data.setInter)
    let that = this
    let time = that.data.studyTime
    let id = that.data.vid
    common.ajax({
      url: 'Clock/recordStudyTime',
      userinfo: true,
      data: {
        room_id: id,
        study_duration: time
      }
    })
  },
    // 拉取弹幕计时器 
    startInterval: function () {
        var that = this
        that.data.setInter = setInterval(function () {
            if (that.data.isBarrage) {
                that.getBarrageList()
            }
        }, 5000)
    },
    setNewPlayerSrc: function ()  {
        polyvLive.getNewVideo((videoInfo)=>{
            this.setPlayerSrc(videoInfo);
        });
    },
    setPlayerSrc:function(videoInfo) {
      console.log(videoInfo)
        this.setData({
            video: {
                src: videoInfo.flvSrc,
                poster: videoInfo.poster
            }
        });
        console.log(this.data.video)
    },
    onReady: function () {
        var that = this;
        // var liveUid = "517d5a3804";
        // var liveVid = "213598";
        var liveUid = that.data.uid;
        var liveVid = that.data.vid;
        var liveVideoContext = wx.createVideoContext('polyvLiveVideo');
        this.setData({
          liveVideoContext: liveVideoContext
        })
        polyvLive.getVideo({
            uid: liveUid,
            vid: liveVid,
            videoContext: liveVideoContext,
            success: (videoInfo) => {
              console.log(videoInfo)
              // set video src and poster
              this.setPlayerSrc(videoInfo);
            },
            error:function(res){  
              console.log(res)
              wx.showToast({
                title: '播放出错，请稍等！',
                icon: 'none',
                duration: 1000
              })
              this.setData({
                flag: false
              })
              setTimeout(() => {
                this.setData({
                  flag: true
                })
              }, 100)
            },
            onStartLive: () => {
              // set latest video src
              this.setNewPlayerSrc();
            },
            onApiStatus:function (status) {
                if(status == 'end'){
                    that.setData({
                        noLive: true
                    })
                }else{
                    that.setData({
                        isShow: true
                    })
                  that.data.setStudyInt = setInterval(function () {
                    let time = that.data.studyTime + 1
                    that.setData({
                      studyTime: time
                    })
                  }, 1000)
                }
              wx.hideLoading()
            }
        });
        that.startInterval()
        that.getCommentList()
    }
})
function getRandomColor() {
    var rgb = []
    for (var i = 0; i < 3; ++i) {
        var color = Math.floor(Math.random() * 256).toString(16)
        color = color.length == 1 ? '0' + color : color
        rgb.push(color)
    }
    return '#' + rgb.join('')
}
