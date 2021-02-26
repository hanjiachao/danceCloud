// pages/Shopping/Shopping.js
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {
        last_id: 0,
        limit: 8,
        type: '商品',
        skey: ''
    },
    banner_list:[],
    list:[],
    typename: '商品',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
      refreash: true,
      show:false,
      ajaxshoping:true
  },
    searchShoop: function () {
        wx.navigateTo({
            url:'../search/search'
        })
    },
   shoppingAjax: function (slience) {
       var that = this
       if (!that.data.ajaxshoping) {
           return false
       }
       that.setData({
           ajaxshoping:false
       })
       common.ajax({
           url: 'Goods/getGoodsList',
           data: that.data.info,
           loading: slience,
           success: function (res) {
               that.setData({
                   show:true,
                   ajaxshoping:true
               })
               if (slience == ''){
                   wx.stopPullDownRefresh()
               }
               if (res.status != 'SUCCESS') {
                   wx.showToast({
                       title: res.result.msg,
                       icon: 'none'
                   })
               } else {
                   if (that.data.info.last_id == 0){
                       var bannerimg = []
                       for (var i=0;i<res.result.banner.length;i++) {
                           bannerimg[i] = res.result.banner[i].ba_image
                       }
                       that.setData({
                           banner_list:bannerimg,
                       })
                   }
                   if (res.result.list.length < that.data.info.limit) {
                       that.setData({
                           refreash: false
                       })
                   }
                   that.data.list = that.data.list.concat(res.result.list)
                   var last_id = 'info.last_id'
                   that.setData({
                       list:that.data.list,
                       [last_id]: that.data.list.length
                   })
               }
           }
       })
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      wx.setNavigationBarTitle({
          title: '商城'
      });
      that.shoppingAjax('加载中...');
  },
    shoopdetail: function (e) {
        wx.navigateTo({
            url:'../shoppingDetail/shoppingDetail?go_id=' + e.currentTarget.dataset.id
        })
    },
    shoppingClick: function (e) {
        var that = this
        var type = 'info.type'
        var last_id ='info.last_id'
        that.setData({
           typename: e.currentTarget.dataset.name,
           [type]: e.currentTarget.dataset.name,
           list: [],
            [last_id]: 0,
            refreash: true
       })
        that.shoppingAjax('加载中...');
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
      var that = this
      var last_id ='info.last_id'
      that.setData({
          list: [],
          [last_id]: 0,
          refreash: true
      })
      that.shoppingAjax('')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
     var that = this;
     if (that.data.refreash) {
         that.shoppingAjax('加载中...');
     }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})