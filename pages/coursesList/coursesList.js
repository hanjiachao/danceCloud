// pages/aboutUs/aboutUs.js
var common = require("../../utils/util.js");
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:[],
      order: '',
      nowprice: '',
      url: 'Index/getVid',
      dc_id: ''
  },
    videoLook:function (e) {
        var vid = e.currentTarget.dataset.vid
        var userid = e.currentTarget.dataset.userid
        var room_id = e.currentTarget.dataset.room_id
        var cc_id = e.currentTarget.dataset.cc_id
        if (vid != '') {
            wx.navigateTo({
              url: '../lessonVideo/lessonVideo?id=' + vid + '&cc_id=' + cc_id
            })
        } else {
            wx.navigateTo({
                url: '../live/live?uid=' + userid + '&vid=' + room_id
            })
        }

    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      that.setData({
        order: options.order
      })
      that.setData({
          nowprice: options.nowprice,
          dc_id: options.dc_id
      })
      console.log(that.data.nowprice)
      if (that.data.nowprice == 0){
        that.setData({
            url: 'Index/getVidById'
        })
        var data = {
            dc_id: that.data.dc_id
        }
      } else {
          var data = {
            order_no:options.order
          }
      }
      common.ajax({
          url: that.data.url,
          data: data,
          loading: '加载中...',
          userinfo: true,
          success: function (res) {
            console.log(res)
              if (res.status == 'SUCCESS') {
                  that.setData({
                      list: res.result.list
                  })
              } else {
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
    let that = this
    return {
      title: '课程列表',
      path: "/pages/coursesList/coursesList?order=" + that.data.order
    }
  }
})