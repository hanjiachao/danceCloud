var common = require("../../utils/util.js");
const polyv = require('../../utils/polyv.js');
var page = undefined;
Page({
    data: {
        studyTime: 0,
        setStudyInt: '',
        videoSrc: null,
        vid: '',
        cc_id: '',
        title: '',
        flag: true,
      currentTime: 0,
        isShow: false,
        isBarrage: true,
        barrageOrComment: false,
        barrageList: [],
        sendBarrageContent: '',
        barrageLastId: 0,
        commentList: [],
        danmulist: [],
        commentListId: 0,
        sendCommentContent:'',
        refreshComment: true,
        refreshBarrage: true,
        setInter: '',
        commentIpt: false,
        text: "这是一条测试公告，看看效果怎么样，2019年3月23日",
        marqueePace: 1,//滚动速度
        marqueeDistance: 0,//初始滚动距离
        marquee_margin: 30,
        size:14,
        interval: [20,30,40,50,20,10,40] // 时间间
    },
    timeUpdate: function (e) {
        polyv.timeUpdate(e);
        this.setData({
          currentTime: e.detail.currentTime
        })
    },

    //视频播放出错
  errorText: function () {
    wx.showToast({
      title: '播放出错，请稍等！',
      icon: 'none',
      duration: 1000
    })
    this.setData({
      flag: false
    })
    setTimeout(()=>{
      this.setData({
        flag: true
      })
    },100)
  },
    onReady: function () {
        let that = this;
        this.videoContext = wx.createVideoContext('polyvVideo')
        let vid = that.data.vid;
        let video = ''
        let obj = {
            vid: vid,
            callback: function (videoInfo) {
                if (videoInfo.src.length == 1) {
                    video = videoInfo.src[0]
                } else {
                    video = videoInfo.src[1]
                }
                that.startInterval()
                that.getCommentList()
                that.setData({
                    videoSrc: video,
                    title: videoInfo.title,
                    isShow: true,
                    commentIpt: true
                });
                wx.hideLoading()
            }
        };
        common.ajax({
          url: 'CourseComment/checkShareCourse',
          userinfo: true,
          data: {
            cc_id: that.data.cc_id
          },
          success: function (res) {
            if (res.errorCode == 200001) {
              common.redirect_to('../loading/loading')
            } else if (res.errorCode == 100004) {
              wx.showModal({
                content: '分享链接已失效',
                success(res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '../index/index'
                    })
                  } else if (res.cancel) {
                  }
                }
              })
            } else if (res.errorCode == 0) {
              if (res.result.msg == "success") {
                polyv.getVideo(obj);
              } else if (res.result.msg = "error") {
                wx.showModal({
                  content: '您未购买该课程，是否去商城购买',
                  success(ret) {
                    if (ret.confirm) {
                      if (res.result.dc_id) {
                        wx.navigateTo({
                          url: '../liveDetail/liveDetail?dc_id=' + res.result.dc_id
                        })
                      } else if (res.result.dg_id) {
                        wx.navigateTo({
                          url: '../groupDetail/groupDetail?dg_id=' + res.result.dg_id
                        })
                      }
                    } else if (ret.cancel) {
                      wx.switchTab({
                        url: '../index/index'
                      })
                    }
                  }
                })
              }
            }
          }
        })
    },
    onLoad: function (options) {
        var pages = getCurrentPages()
        var currentPage = pages[pages.length - 1]
        this.setData({
            vid: options.id,
            cc_id: options.cc_id
        })
        wx.showLoading({
            title: '加载中...'
        })
        page = this
        let that = this
    },
  onShow: function () {
    let that = this
    this.data.setStudyInt = setInterval(function () {
      let time = that.data.studyTime + 1
      that.setData({
        studyTime: time
      })
    }, 1000)
    this.scrolltxt();
  },
    onHide: function () {
      clearInterval(this.data.setStudyInt)
    },
    onUnload: function () {
      clearInterval(this.data.setStudyInt)
      clearInterval(this.data.setInter)
      let that = this
      let time = that.data.studyTime
      let id = that.data.cc_id
      common.ajax({
        url: 'Clock/recordStudyTime',
        userinfo: true,
        data: {
          cc_id: id,
          study_duration: time
        },
        success: function () {
          console.log(time)
        },
        fail: function () {
          console.log('fail')
        }
      })
    },
    // 拉取弹幕计时器
    startInterval: function () {
      let that = this
      that.data.setInter = setInterval(function () {
        if (that.data.isBarrage) {
          that.getBarrageList()
        }
      }, 5000)
    },
    sendBarrageIpt: function () {
      let that = this
      this.setData({
        barrageOrComment: !that.data.barrageOrComment
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
    changeComment: function (e) {
      this.setData({
        sendCommentContent:e.detail.value
      })
    },
    changeBarrage: function (e) {
      this.setData({
        sendBarrageContent: e.detail.value
      })
    },
    //获取弹幕
    getBarrageList: function () {
      var that = this
      var windowWidth = wx.getSystemInfoSync().windowWidth;
      var cc_id = that.data.cc_id
      var barrageLastId = that.data.barrageLastId
      common.ajax({
        url: 'CourseComment/getList',
        userinfo: true,
        data: {
          type: '弹幕',
          cc_id: that.data.cc_id,
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
      let that = this
      let cc_id = that.data.cc_id
      let commentListId = that.data.commentListId
      common.ajax({
        url: 'CourseComment/getList',
        userinfo: true,
        loading: '加载中...',
        data: {
          type: '评论',
          cc_id: cc_id,
          last_id: commentListId
        },
        success: function (res) {
          let list = that.data.commentList
          let lastId = 0
          if (res.result.list.length == 0) {
            that.setData({
              refreshComment: false,
              commentListId: 1
            })
          } else {
            for (let i = 0; i < res.result.list.length; i++) {
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
      let that = this
      let cc_id = that.data.cc_id
      if (that.data.sendBarrageContent == "") {
        return false
      }
      common.ajax({
        url: 'CourseComment/send',
        userinfo: true,
        data: {
          type: '弹幕',
          cc_id: cc_id,
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
    // 发送评论
    sendComment: function () {
      let that = this
      let cc_id = that.data.cc_id
      if (that.data.sendCommentContent == "") {
        return false
      }
      common.ajax({
        url: 'CourseComment/send',
        userinfo: true,
        data: {
          type: '评论',
          cc_id: cc_id,
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
              let list = that.data.commentList
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
    scrolltxt: function () {
        var that = this;
        var windowWidth = wx.getSystemInfoSync().windowWidth;
        var inter = setInterval(function () {
            if (that.data.danmulist.length == 0){
                return false
            }
            for(var i=0;i<that.data.danmulist.length;i++){
                that.data.danmulist[i].left -=15
                if (that.data.danmulist[i].left < -200){
                    that.data.danmulist.splice(i,1)
                }
            }
            that.setData({
                danmulist:that.data.danmulist
            })
        }, 170);
    },
  
    // 右上角转发
    onShareAppMessage: function () {

    }
}) 
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}  


