// pages/setting/setting.js
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      version: '1.0.0'
  },

    feedback: function () {
        wx.navigateTo({
            url: '../feedback/feedback'
        })
    },
    clear: function () {
        setTimeout(function() {
            common.info('清除成功')
        },500)
    },
    aboutUs: function () {
        wx.navigateTo({
            url: '../aboutUs/aboutUs'
        })
    },
    exit: function () {
        wx.showModal({
            title: '提示',
            content: '确定要退出登录',
            success: function(res) {
                if (res.confirm) {
                    common.set_userinfo('')
                    wx.reLaunch({
                        url: '../loading/loading'
                    })
                } else if (res.cancel) {

                }
            }
        })

    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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