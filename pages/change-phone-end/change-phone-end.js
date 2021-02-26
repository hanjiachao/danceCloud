// pages/change-phone-end/change-phone-end.js
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      mobile:'',
      code:'',
      time:0,
      type:''
  },

    inputChange: function(e){
        var field = e.target.dataset.field,temp_data={};
        temp_data[field]=e.detail.value;
        this.setData(temp_data)
    },
    submit: function () {
        if(this.data.mobile == ''){
            common.info('请输入手机号码')
            return false
        }
        if(this.data.type == '国内'){
            if(!common.is_mobile(this.data.mobile)){
                common.info('手机号码格式错误')
                return false
            }
            if(this.data.code == ''){
                common.info('请输入验证码')
                return false
            }
        }
        var that = this
        common.ajax({
            url: 'Login/changeMobile',
            data: {
                mobile: that.data.mobile,
                code: that.data.code
            },
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    common.info(res.result.msg)
                    setTimeout(function() {
                        wx.navigateBack({
                            delta:3
                        })
                    },1500)
                }else{
                    common.info(res.result.msg)
                }
            }
        })
    },
    sendCode: function () {
        if (this.data.time > 0) {
            return false
        }
        var that = this
        common.ajax({
            url: 'Login/sendRegisterCode',
            data: {
                mobile: that.data.mobile
            },
            loading: '发送中...',
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    that.setData({
                        time: 60
                    })
                    getApp().globalData.timer = setInterval(function () {
                        that.data.time--
                        if (that.data.time == 0) {
                            clearInterval(getApp().globalData.timer)
                        }
                        that.setData({
                            time: that.data.time
                        })
                    }, 1000)
                } else {
                    common.info(res.result.msg)
                }
            },
            fail: function () {
                common.info('发送失败，请重试')
            }
        })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          type:options.type
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