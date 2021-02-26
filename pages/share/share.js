var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      info:{},
      isshow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      common.ajax({
          url: 'User/getUserShareMessage',
          data: {},
          loading: '加载中...',
          userinfo: true,
          success: function (res) {
              if (res.status == 'SUCCESS') {
                 that.setData({
                     isshow:true,
                     info:res.result
                 })
                console.log(that.data.info)
              } else {
                  that.setData({
                      isshow:true
                  })
                  common.info(res.result.msg)
              }
          }
      })
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
      return {
          title: this.data.info.share_title,
          path: '/pages/loading/loading?share_code=' + this.data.info.share_code,
          imageUrl:this.data.info.share_image
      }
  }
})