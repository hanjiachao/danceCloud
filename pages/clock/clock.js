// pages/clock/clock.js
var common = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow: false,
        width: 0,
        background: '',
        list: [],
        success: false,
        score:''
    },

    close: function () {
        this.setData({
            success: false
        })
    },
    clock: function (e) {
        var index = e.currentTarget.dataset.i
        var today = e.currentTarget.dataset.today
        var status = e.currentTarget.dataset.status
        var item = 'list[' + index + '].status'
        if(today && !status){
            var that = this
            common.ajax({
                url: 'Community/sign',
                data: {},
                loading: '加载中...',
                userinfo: true,
                success: function (res) {
                    if (res.status == 'SUCCESS') {
                        that.setData({
                            success: true,
                            score:res.result.score,
                            [item]: true
                        })
                    } else {
                        common.info(res.result.msg)
                    }
                }
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        common.ajax({
            url: 'Community/signIndex',
            data: {},
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    that.setData({
                        background: res.result.background_image,
                        list: res.result.list
                    })
                    wx.getSystemInfo({
                        success: function (res) {
                            var width = (res.windowWidth - 30) / 6 - 10
                            that.setData({
                                width: width,
                                isShow: true
                            })
                        }
                    })
                } else {
                    common.info(res.result.msg)
                }
            }
        })
    },
  getImg: function () {
    let that = this
    common.ajax({
      url: 'Clock/getClockShareData',
      userinfo: true,
      loading: '加载中...',
      success: function (res) {
        console.log(res.result.share_image)
        setTimeout(function () {
          wx.showLoading({
            title: '保存中...',
          })
        }, 50)
        wx.downloadFile({
          url: res.result.share_image,
          success: function (res) {
            if (res.statusCode === 200) {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function (res) {
                  wx.hideLoading()
                  that.setData({
                    success: false
                  })
                  wx.showModal({
                    title: '保存成功',
                    content: '请在朋友圈的在手机相册上传图片',
                    showCancel: false
                  })
                },
                fail: function () {
                  wx.hideLoading()
                  wx.showToast({
                    title: '保存失败',
                    duration: 1000
                  })
                }
              })
            }
          },
          fail: function () {
            wx.hideLoading()
            wx.showToast({
              title: '保存失败',
              duration: 1000
            })
          }
        })
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