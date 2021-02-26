// pages/myMusic/myMusic.js
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classifyList: []
  },

  //获取专辑列表
  getClassify: function () {
    var _this = this
    common.ajax({
      url: 'Music/getClassify',
      type: 'get',
      success: function (res) {
        _this.setData({
          classifyList: res.result.data
        })
      }
    })
  },
  
  //前往音乐列表
  goMusicList(e) {
    let al_id = e.currentTarget.dataset.al_id
    wx.navigateTo({
      url: '../musicList/musicList?al_id=' + al_id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getClassify()
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