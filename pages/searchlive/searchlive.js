// pages/search/search.js
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      info: {
          start: 0,
          limit: 3,
          type: '课程',
          skey: ''
      },
      list:[],
      typename: '课程',
      refreash: true,
      livesta: true,
      isreplaceSearch:true,
      ajaxshoping:true
  },
    collagedetail: function (e) {
        wx.navigateTo({
            url:'../collagedetail/collagedetail?dg_id=' + e.currentTarget.dataset.id
        })
    },
    shoopdetail: function (e) {
      if (e.currentTarget.dataset.type == '课程') {
          wx.navigateTo({
              url:'../liveDetail/liveDetail?dc_id=' + e.currentTarget.dataset.id
          })
      } else {
          if (e.currentTarget.dataset.dg_status == '已参团'){
              wx.navigateTo({
                  url:'../coll-detail/coll-detail?order=' + e.currentTarget.dataset.order_no
              })
          } else {
              wx.navigateTo({
                  url:'../groupDetail/groupDetail?dg_id=' + e.currentTarget.dataset.id
              })
          }
      }
    },
    shoppingClick: function (e) {
        var that = this
        var type = 'info.type'
        var start ='info.start'
        that.setData({
            typename: e.currentTarget.dataset.name,
            [type]: e.currentTarget.dataset.name,
            list: [],
            [start]: 0,
            refreash: true,
            livesta: true
        })
        that.shoppingAjax('加载中....','');
    },
  /**
   * 生命周期函数--监听页面加载
   */
  shoppingAjax: function (slience,search) {
      var that = this
      if (search == '') {
         if(!that.data.isreplaceSearch){
             return false
         }
      } else {
          that.setData({
              isreplaceSearch:false
          })
      }
      if (!that.data.ajaxshoping) {
          return false
      }
      that.setData({
          ajaxshoping:false
      })
      common.ajax({
          url: 'DanceCourse/searchDance',
          data: that.data.info,
          loading: slience,
          userinfo:true,
          success: function (res) {
              that.setData({
                  ajaxshoping:true
              })
              if (slience == ''){
                  wx.stopPullDownRefresh()
              }
              if (search != '') {
                  that.setData({
                      isreplaceSearch:true
                  })
              }
              if (res.status != 'SUCCESS') {
                  wx.showToast({
                      title: res.result.msg,
                      icon: 'none'
                  })
              } else {
                  if (res.result.dance_list.length == 0 && that.data.info.start == 0) {
                      that.setData({
                          livesta: false,
                          refreash: false
                      })
                  }
                  if (res.result.dance_list.length < that.data.info.limit) {
                      that.setData({
                          refreash: false
                      })
                  }
                  that.data.list = that.data.list.concat(res.result.dance_list)
                  var start = 'info.start'
                  that.setData({
                      list:that.data.list,
                      [start]: that.data.list.length
                  })
              }
          }
      })
  },
  onLoad: function (options) {
      var that = this
      wx.setNavigationBarTitle({
          title: '搜索'
      });
      that.shoppingAjax('加载中...','');
  },
    cancelSearch: function () {
        var skey = 'info.skey'
        var start = 'info.start'
        this.setData({
            [skey]:'',
            [start]:0,
            refreash: true,
            list:[],
            livesta: true
        })
        this.shoppingAjax('加载中...','');
    },
    shoopinginput: function (e) {
      console.log(e.detail.value)
        var skey = 'info.skey'
        var start = 'info.start'
        this.setData({
            [skey]:e.detail.value,
            [start]:0,
            refreash: true,
            list:[],
            livesta: true
        })
        this.shoppingAjax('加载中...','search');
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
      var start = 'info.start'
      this.setData({
          [start]:0,
          refreash: true,
          list:[],
          livesta: true
      })
      this.shoppingAjax('','');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      var that = this;
      if (that.data.refreash) {
          that.shoppingAjax('加载中','');
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
