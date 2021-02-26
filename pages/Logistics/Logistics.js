// pages/Logistics/Logistics.js
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      order_no:'',
      show:false,
      list:[],
      image:'',
      express:'',
      express_no: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      that.setData({
          order_no: options.order_no
      })
      console.log(2222)
      common.ajax({
          url: 'Goods/checkOrderStream',
          data: {
              order_no: options.order_no
          },
          loading: '加载中',
          userinfo: true,
          success: function (res) {
              that.setData({
                  show: true
              })
              if (res.status == 'SUCCESS') {
                that.setData({
                    image: res.result.image,
                    list:res.result.list,
                    express_no:res.result.express_no,
                    express:res.result.express
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
  
  }
})