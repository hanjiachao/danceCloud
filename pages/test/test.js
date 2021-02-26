var common = require("../../utils/util.js");
// var polyvLive = require('../../utils/polyvlive.js');

var page = undefined;
Page({
  data: {
    src: '',
    video: {
      src: '',
      poster: ''
    }
  },
  onReady:function () {
    setTimeout(()=>{
      this.setData({
        src: 'https://pull-c1.videocc.net/recordf/517d5a380420191122140836405.flv?wsSecret=&auth_key=1575461981-0-0-dad1b7e75308f16d4e456d7a65594251&wsTime=1575461981'
      })
    },3000)
    setInterval(()=>{
      this.getBarrageList()
    },5000)
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
        room_id: 1,
        last_id: 2
      },
      success: function (res) {
        console.log(res)
      }
    })
  },
  error:function (e) {
    console.log(e)
  }
})