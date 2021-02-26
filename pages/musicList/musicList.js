// pages/musicList/musicList.js
var common = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    al_id: '',
    start: 0,
    info: {},
    musicList: []
  },

  //获取音乐列表
  getList () {
    var _this = this
    common.ajax({
      url: 'Music/getList',
      type: 'get',
      data: {
        album_id: _this.data.al_id,
        start: _this.data.start
      },
      success: function (res) {
        _this.setData({
          info: res.result.data.album_info,
          musicList: res.result.data.music_list
        })
      }
    })
  },

  //播放音乐
  playMusic(e) {
    let index = e.currentTarget.dataset.index
    app.globalData.songInfo = this.data.musicList
    app.globalData.playIndex = index
    wx.navigateTo({
      url: '../playing/playing',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      al_id: options.al_id
    })
    this.getList()
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

  }
})