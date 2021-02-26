// pages/ordersuccess/ordersuccess.js
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      integral: '',
      type: '',
      vid:'',
      show: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  backmenu: function () {
      wx.switchTab({
          url: '../personalCenter/personalCenter'
      })
  },
    canvideo: function () {
        // wx.navigateTo({
        //     url: '../lessonVideo/lessonVideo?id=' + this.data.vid
        // })
        wx.navigateTo({
            url: '../coursesList/coursesList?order=' + this.data.order_no
        })
    },
  onLoad: function (options) {
      wx.setNavigationBarTitle({
          title: '支付成功'
      });
      this.setData({
          type: options.type,
          order_no:options.order_no
      })
      var that = this
      console.log(options.type)
      console.log(options.order_no)
      if (options.type == '直播' || options.type == '拼团') {
          common.ajax({
              url: 'Index/getVidByOrderNo',
              data: {
                  order_no:options.order_no
              },
              userinfo:true,
              loading: '加载中...',
              success: function (res) {
                  that.setData({
                      show:true
                  })
                  if (res.status != 'SUCCESS') {

                  } else {
                      that.setData({
                          vid:res.result.vid
                      })
                  }
              }
          })
      } else {
          that.setData({
              show:true
          })
      }
      if (options.integral != 0) {
         var inter = '已获得' + options.integral + '积分,'
          this.setData({
              integral: inter
          })
      } else {
          this.setData({
              integral: ''
          })
      }
  },
    backindex: function () {
        wx.switchTab({
            url: '../index/index'
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
  
  }
})