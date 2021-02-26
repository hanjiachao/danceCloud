// pages/aboutUs/aboutUs.js
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      show:false,
      go_id:'',
      last_id: '',
      limit:4,
      list:[],
      refresh:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  evaAjax: function () {
      var that = this;
      common.ajax({
          url: 'Goods/getOrderEvaluation',
          data: {
              go_id:that.data.go_id,
              last_id:that.data.last_id,
              limit:that.data.limit
          },
          loading: '加载中...',
          userinfo: false,
          success: function (res) {
              that.setData({
                  show:true
              })
              if (res.status == 'SUCCESS') {
                  if (res.result.list.length < that.data.limit) {
                      that.setData({
                          refresh:false
                      })
                  }
                  that.data.list = that.data.list.concat(res.result.list)
                  if (that.data.list.length > 0){
                      that.data.last_id = that.data.list[that.data.list.length - 1].gor_id
                  }
                  that.setData({
                      list:that.data.list,
                      last_id: that.data.last_id
                  })
              } else {
                  common.info(res.result.msg)
              }
          }
      })
  },
  onLoad: function (options) {
      var that = this;
      this.setData({
          go_id:options.go_id
      })
      this.evaAjax();
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
    lookImage: function (e) {
        wx.previewImage({
            current: e.currentTarget.dataset.item, // 当前显示图片的http链接
            urls: e.currentTarget.dataset.src // 需要预览的图片http链接列表
        })
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
     if (this.data.refresh){
         this.evaAjax();
     }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})