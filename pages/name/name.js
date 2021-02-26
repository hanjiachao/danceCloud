// pages/name/name.js
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    nickname: '',
    information_nickname:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //新ajax
    var that = this
    common.ajax({
      url: 'User/getUserData',
      loading: '',
      userinfo: true,
      success: function (res) {
        if (res.status != 'SUCCESS') {
          wx.showToast({
            title: res.result.msg,
            icon: 'none'
          })
        } else {
          
          that.setData({
            information_nickname: res.result.nickname,
           
          })
          
        }
      }
    })
    //新ajax
  },
  nickname: function (e) {
    this.setData({
      information_nickname: e.detail.value

    })
  },
  submit: function () {
    var that = this
    if (that.data.information_nickname == '' || that.data.information_nickname == null) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
//新ajax
    var that = this
    common.ajax({
      url: 'User/editUserData',
      data: {
          nickname: that.data.information_nickname
      },
      loading: '',
      userinfo: true,
      success: function (res) {
        if (res.status != 'SUCCESS') {
          wx.showToast({
            title: res.result.msg,
            icon: 'none'
          })
        } else {
          console.log(res.result.info)
          wx.showToast({
            title: res.result.msg,
            duration: 2000
          });
          wx.navigateBack({
            url: '../information/information',
          })
        }
      }
    })
    //新ajax
 
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