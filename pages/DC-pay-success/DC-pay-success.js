// pages/DC-pay-success/DC-pay-success.js
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      isForward:false,
      price: 0,
      info: {},
      list: [],
      start: 0,
      limit: 10,
      refresh: true,
      isShow: false,
      withdraw_status:false,
      isshare: false,
      isfriend: false,
      is: '',
      share_image: ''
  },
    sure: function () {
        this.setData({
            isshare: false,
            isfriend: false
        })
    },
    hiddenshare: function () {
        this.setData({
            isshare: false,
            is: ''
        })
    },
    share: function (e) {
      var is =  e.target.dataset.is
      this.setData({
          isshare: true,
          is: is
      })
    },
    DClevel: function(){
        wx.navigateTo({
            url: '../DClevel/DClevel'
        })
    },
    hideWithdraw: function () {
        this.setData({
            isForward: false
        })
    },
    sharefriends: function () {
        var that = this
        wx.showLoading({
          title: 'loading',
        })
        wx.downloadFile({
            url: that.data.share_image,     //仅为示例，并非真实的资源
            success: function (res) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode === 200) {
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: function (res) {
                          wx.hideLoading()
                            that.setData({
                                isfriend: true
                            })
                        },
                        fail: function (res) {
                          wx.hideLoading()
                        }
                    })
                }
            }
        })

    },
    submit: function () {
        var that = this
        common.ajax({
            url: 'User/depositWithdraw',
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    that.setData({
                        isForward: false
                    })
                    common.info(res.result.msg)
                } else {
                    that.setData({
                        isForward: false
                    })
                    common.info(res.result.msg)
                }
            }
        })
    },
    DCforward:function () {
        this.setData({
            isForward:true,
            price: 0
        })
    },
    inputChange: function(e){
        var field = e.target.dataset.field,temp_data={};
        temp_data[field]=e.detail.value;
        this.setData(temp_data)
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      common.ajax({
          url: 'User/spokesmanData',
          data: {
              start: that.data.start,
              limit: that.data.limit
          },
          userinfo: true,
          success: function (res) {
              if (res.status == 'SUCCESS') {
                  if (that.data.start == 0) {
                      var now = 'info.now_achievement'
                      var total = 'info.need_achievement'
                      that.setData({
                          withdraw_status:res.result.userinfo.withdraw_status,
                          info: res.result.userinfo,
                          list: res.result.list,
                          start: res.result.list.length,
                          [now]: parseFloat(res.result.userinfo.now_achievement),
                          [total]: parseFloat(res.result.userinfo.need_achievement),
                          isShow: true
                      })
                  } else {
                      if (res.result.list.length > 0) {
                          var list = that.data.list
                          for (var i = 0; i < res.result.list.length; i++) {
                              list.push(res.result.list[i])
                          }
                          that.setData({
                              list: list,
                              start: that.data.start + res.result.list.length
                          })
                      }
                  }
                  if (res.result.list.length < that.data.limit) {
                      that.setData({
                          refresh: false
                      })
                  }
              } else {
                  common.info(res.result.msg)
              }
          }
      })
    common.ajax({
      url: 'User/getShareImage',
      loading: '加载中...',
      userinfo: true,
      success: function (res) {
        if (res.status == 'SUCCESS') {
           that.setData({
             share_image: res.result.share_image
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
      this.setData({
          refresh: true,
          start: 0
      });
      this.onLoad()
      wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      if (this.data.refresh) {
          this.onLoad()
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      console.log(this.data.is)
      if (this.data.is == ''){
          return false
      }
      return {
          title: this.data.info.share_title,
          path: '/pages/loading/loading?share_code=' + this.data.info.share_code,
          imageUrl:this.data.info.share_image
      }
  }
})