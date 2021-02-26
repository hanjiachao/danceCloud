// pages/aboutUs/aboutUs.js
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      cityid: '',
      list:[],
      show: false,
      provice: '',
      citye: '',
      county: '',
      provicename: '',
      cityename: '',
      countyname: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
      var that = this
      wx.setNavigationBarTitle({
          title: '所在地区'
      });
      that.cityAjax();
  },
  cityAjax: function () {
      var that = this
      common.ajax({
          url: 'User/getCity',
          data: {
              id: that.data.cityid
          },
          loading: '加载中...',
          success: function (res) {
              if (res.status != 'SUCCESS') {
                  wx.showToast({
                      title: res.result.msg,
                      icon: 'none'
                  })
              } else {
                  that.setData({
                      list: res.result.list,
                      show: true
                  })
                  console.log(that.data.list)
              }
          }
      })
  },
  selectCity: function (e) {
      var that = this
      if (e.currentTarget.dataset.level == 1) {
          that.setData({
              provicename: e.currentTarget.dataset.name,
              provice: e.currentTarget.dataset.id
          })
      }
      if (e.currentTarget.dataset.level == 2) {
          that.setData({
              cityname: e.currentTarget.dataset.name,
              city: e.currentTarget.dataset.id
          })
      }
      if (e.currentTarget.dataset.level == 3) {
          that.setData({
              countyname: e.currentTarget.dataset.name,
              county: e.currentTarget.dataset.id
          })
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          var province = 'info.province'
          var city = 'info.city'
          var county = 'info.county'
          prevPage.setData({
              phoname: that.data.provicename + that.data.cityname + that.data.countyname,
              [province]: that.data.provice,
              [city]: that.data.city,
              [county]: that.data.county,

              cityDetail: that.data.provicename + that.data.cityname + that.data.countyname,
              provinceId: that.data.provice,
              cityId: that.data.city,
              countyId: that.data.county,
          });
          wx.navigateBack({})
      } else {
          that.setData({
              cityid: e.currentTarget.dataset.id,
              list: []
          })
          that.cityAjax();
      }
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