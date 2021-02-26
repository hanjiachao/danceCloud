// pages/playing/playing.js
var common = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: '',
    musicList: [],
    playStatus: false,
    min: 0, //slider最小值
    max: 0, //slider最大值:音频时长
    value: 0, //slider当前进度
    now: '00:00', //播放条当前时间
    long: '00:00', //音频总时长
    speed: false,
    rate: '',
    collectStatus: false
  },

  //获取视频时间
  timeupdate(e) {
    var that = this
    wx.hideLoading()
    let duration = e.detail.duration
    let currentTime = e.detail.currentTime
    if (currentTime > 0 && currentTime != app.globalData.currentTime) {
      app.globalData.currentTime = currentTime;
      let now = that.formatS2M(currentTime);
      app.globalData.currentTime = currentTime;
      that.setData({
        value: currentTime,
        now: now
      })
    }
    if (duration != that.data.max) {
      let long = that.formatS2M(duration);
      app.globalData.duration = duration;
      that.setData({
        max: duration,
        long: long
      })
    }
  },

  /**
   * 播放新的音频
   */
  setAudio() {
    var that = this;
    that.videoContext.stop()
    that.setData({
      max: 100,
      value: 0,
      now: 0,
      index: app.globalData.playIndex
    })
    app.globalData.currentTime = 0;
    app.globalData.duration = 0;
    this.getCollectStatus()
    that.videoContext.play()
    this.videoContext.seek(0);
  },

  /**
   * 播放下一首
   */
  playNext() {
    var that = this;
    wx.showLoading({
      title: '加载中......',
    })
    let playIndex = 0;
    if (app.globalData.playIndex < (app.globalData.songInfo.length - 1)) {
      playIndex = app.globalData.playIndex + 1;
    }
    app.globalData.playIndex = playIndex;
    that.setAudio();
  },
  /**
   * 播放上一首
   */
  playPrev() {
    var that = this;
    wx.showLoading({
      title: '加载中......',
    })
    var playIndex = app.globalData.songInfo.length - 1;
    if (app.globalData.playIndex > 0) {
      playIndex = app.globalData.playIndex - 1;
    }
    app.globalData.playIndex = playIndex;
    that.setAudio();
  },

  /**
   * 播放 暂停
   */
  bindPlaySong: function () {
    if (this.data.playStatus === true) {
      this.videoContext.play()
      this.setData({
        playStatus: false
      });
    } else {
      this.videoContext.pause()
      this.setData({
        playStatus: true
      });
    }
  },

  /**
   * videoEnd
   */
  videoEnd(e) {
    var that = this;
    wx.showLoading({
      title: '加载中......',
    })
    let playIndex = 0;
    if (app.globalData.playIndex < (app.globalData.songInfo.length - 1)) {
      playIndex = app.globalData.playIndex + 1;
    }
    app.globalData.playIndex = playIndex;
    that.setAudio();
  },

  /**
   * 滑动
   */
  seek(e) {
    var that = this;
    var value = e.detail.value;
    this.videoContext.seek(value);
  },
  /**
   * 滑动中
   */
  seeking(e) {
    var that = this;
    var value = e.detail.value;
    var now = that.formatS2M(value);
    // 显示当前滑动的时间
    that.setData({
      now: now
    })
  },

  /**
   * 设置倍速播放
   */
  speed() {
    if(this.data.speed){
      this.setData({
        speed: false
      })
    }else{
      this.setData({
        speed: true
      })
    }
  },
  backRate(e) {
    let rate = Number(e.currentTarget.dataset.num)
    this.setData({
      rate: rate,
      speed: false
    })
    this.videoContext.playbackRate(rate)
  },

  /**
   * 获取收藏状态
   */
  getCollectStatus() {
    var _this = this
    common.ajax({
      url: 'Music/checkCollectStatus',
      type: 'get',
      data: {
        mu_id: this.data.musicList[this.data.index].mu_id
      },
      userinfo: true,
      success: function (res) {
        
      }
    })
  },

  /**
  * /Music/collect
  */
  collect() { 
    var _this = this
    common.ajax({
      url: '/Music/collect',
      data: {
        mu_id: this.data.musicList[this.data.index].mu_id
      },
      userinfo: true,
      success: function (res) {
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.videoContext = wx.createVideoContext('myVideo')
    wx.showLoading({
      title: '加载中......',
    })
    this.setData({
      index: app.globalData.playIndex,
      musicList: app.globalData.songInfo
    })
    this.videoContext.play()
    this.getCollectStatus()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 将秒格式化为如 02:05
   */
  formatS2M(seconds) {
    var durationMinute = parseInt(seconds / 60);
    var durationSecond = parseInt(seconds % 60);
    if (durationSecond < 10) {
      durationSecond = '0' + durationSecond;
    }
    if (durationMinute < 10) {
      durationMinute = '0' + durationMinute;
    }
    return (durationMinute + ':' + durationSecond)
  }
})