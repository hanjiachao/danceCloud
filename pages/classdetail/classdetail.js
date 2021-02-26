// pages/ordersure/ordersure.js
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      dance_detail: {},
      coupon_status: '',
      can_use_integral: '',
      proportionprice: '',
      member_status: '',
      member: false,
      integral: false,
      show: false,
      member_discount: '',
      membershow: false,
      nousermoney: '',
      nouserintegral:'',
      usermoney: '',
      userintegral:'',
      info: {
          dc_id: '',
          integral: '',
          coupon_id: '',
          remark: '',
          user_address: '',
          user_name: '',
          user_mobile: ''
      },
      confirmshow: false,
      plusmoney: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  voucher: function () {
      if (!this.data.coupon_status) {
          return false
      }
      if (this.data.money == 0) {
          return false
      }
      wx.navigateTo({
          url:'../coupon/coupon?price=' + this.data.dance_detail.dc_now_price
      })
  },
  moneynum: function (coupon_status,integral,member) {
      var money = ''
      var menbernum = parseFloat(this.data.dance_detail.dc_now_price) * parseFloat(this.data.member_discount)
      if (member) {
          if (integral) {
              money = (menbernum - parseFloat(this.data.proportionprice)).toFixed(2)
              if (this.data.plusmoney != '' && coupon_status) {
                  money = (parseFloat(money) - this.data.plusmoney).toFixed(2)
              }
              if (money < 0) {
                  return 0
              } else {
                  return money
              }
          } else {
              money = (menbernum).toFixed(2)
              if (this.data.plusmoney != ''  && coupon_status) {
                  money = (parseFloat(money) - this.data.plusmoney).toFixed(2)
              }
              if (money < 0) {
                  return 0
              } else {
                  return money
              }
          }
      } else {
          if (integral) {
              money = (parseFloat(this.data.dance_detail.dc_now_price) - parseFloat(this.data.proportionprice)).toFixed(2)
              if (this.data.plusmoney != ''  && coupon_status) {
                  money = (parseFloat(money) - this.data.plusmoney).toFixed(2)
              }
              if (money < 0) {
                  return 0
              } else {
                  return money
              }
          } else {
              money = parseFloat(this.data.dance_detail.dc_now_price)
              if (this.data.plusmoney != ''  && coupon_status) {
                  money = (parseFloat(money) - this.data.plusmoney).toFixed(2)
              }
              if (money < 0) {
                  return 0
              } else {
                  return money
              }
          }
      }
  },
  next_two: function () {
      this.setData({
          membershow:false
      })
      wx.navigateTo({
          url:'../myVip/myVip'
      })
  },
    cancelmember: function () {
        this.setData({
            membershow:false
        })
    },
    closeintegral: function () {
        var money = this.moneynum(this.data.coupon_status,false,this.data.member)
        console.log(money)
        var integral = 'info.integral'
        this.setData({
            integral: false,
            [integral]: 0,
            money: money
        })
  },
    closeuser: function () {
        if (this.data.member_status) {
            return false
        }
        var money = this.moneynum(this.data.coupon_status,this.data.integral,false)
        this.setData({
            member: false,
            money: money
        })
    },
    openser:function () {
        if (this.data.money == 0) {
            wx.showToast({
                title: '当前价格已经为0',
                icon: 'none'
            })
            return false
        }
        if (!this.data.member_status) {
            this.setData({
                membershow: true
            })
            return false
        }
        var money = this.moneynum(this.data.coupon_status,this.data.integral,true)
        this.setData({
            member: true,
            money: money
        })
    },
    username: function (e) {
        var username = 'info.user_name'
        this.setData({
            [username]: e.detail.value
        })
    },
    usermobile: function (e) {
        var usermobile = 'info.user_mobile'
        this.setData({
            [usermobile]: e.detail.value
        })
    },
    useraddress: function (e) {
        var useraddress = 'info.user_address'
        this.setData({
            [useraddress]: e.detail.value
        })
    },
    remark: function (e) {
      var remark = 'info.remark'
        this.setData({
            [remark]: e.detail.value
        })
    },
  openintergral: function () {
      if (this.data.money == 0) {
          wx.showToast({
              title: '当前价格已经为0',
              icon: 'none'
          })
          return false
      }
      if (parseFloat(this.data.proportionprice) > parseFloat(this.data.money)) {
          this.setData({
              money: '0.00'
          })
      } else {
          var money = this.moneynum(this.data.coupon_status,true,this.data.member)
          this.setData({
              money: money
          })
      }
      var integral = 'info.integral'
      this.setData({
          integral: true,
          [integral]: this.data.can_use_integral
      })
  },
    confirm: function () {
        if(this.data.info.user_name == ''){
            wx.showToast({
                title: '请输入收货人姓名',
                icon: 'none'
            })
            return false
        }
        if(this.data.info.user_mobile == ''){
            wx.showToast({
                title: '请输入联系方式',
                icon: 'none'
            })
            return false
        }
        if(!common.is_mobile(this.data.info.user_mobile)){
            wx.showToast({
                title: '请输入正确的联系方式',
                icon: 'none'
            })
            return false
        }
        if(this.data.info.user_address == ''){
            wx.showToast({
                title: '请输入收货地址',
                icon: 'none'
            })
            return false
        }
       this.setData({
           confirmshow: true
       })
    },
    surepay: function () {
        var that = this
        common.ajax({
            url: 'DanceCourse/pay',
            data: that.data.info,
            userinfo:true,
            loading: '加载中...',
            success: function (res) {
                if (res.status != 'SUCCESS') {
                    wx.showToast({
                        title: res.result.msg,
                        icon: 'none'
                    })
                } else {
                    that.setData({
                        confirmshow: false
                    })
                    if (res.result.order_status == '已支付') {
                        wx.redirectTo({
                            url:'../ordersuccess/ordersuccess?integral=' + res.result.can_get_integral + '&type=' + '直播' + '&order_no=' + res.result.order_no
                        })
                    } else {
                        var can_get_integral = res.result.can_get_integral
                        var order_no = res.result.order_no
                        wx.requestPayment(
                            {
                                'timeStamp': '' + res.result.wxpay_data.timeStamp,
                                'nonceStr': res.result.wxpay_data.nonceStr,
                                'package': res.result.wxpay_data.package,
                                'signType': 'MD5',
                                'paySign': res.result.wxpay_data.paySign,
                                'success':function(res){
                                    wx.redirectTo({
                                        url:'../ordersuccess/ordersuccess?integral=' + can_get_integral + '&type=' + '直播' + '&order_no=' + order_no
                                    })
                                },
                                'fail':function(res){},
                                'complete':function(res){}
                            })
                    }
                }
            }
        })
    },
    cancelpay: function () {
        this.setData({
            confirmshow: false
        })
    },
  onLoad: function (options) {
      wx.setNavigationBarTitle({
          title: '确认订单'
      });
      var dc_id = 'info.dc_id'
      this.setData({
          [dc_id]: options.dc_id
      })
      var that = this
      common.ajax({
          url: 'DanceCourse/confirmOrder',
          data: {
              dc_id:options.dc_id
          },
          userinfo:true,
          loading: '加载中...',
          success: function (res) {
              that.setData({
                  show: true
              })
              if (res.status != 'SUCCESS') {
                  wx.showToast({
                      title: res.result.msg,
                      icon: 'none'
                  })
              } else {
                  if (res.result.member_status) {
                      var money = (parseFloat(res.result.dance_detail.dc_now_price) * parseFloat(res.result.member_discount)).toFixed(2)
                      that.setData({
                          member: true,
                          money: money
                      })
                  }else {
                      that.setData({
                          money: res.result.dance_detail.dc_now_price
                      })
                  }
                  var usermobile = 'info.user_mobile'
                  var useraddress = 'info.user_address'
                  var username = 'info.user_name'
                  that.setData({
                      dance_detail: res.result.dance_detail,
                      coupon_status: res.result.coupon_status,
                      can_use_integral: res.result.can_use_integral,
                      proportionprice: res.result.proportion_price,
                      member_status: res.result.member_status,
                      member_discount: res.result.member_discount,
                    [usermobile]: res.result.user_mobile,
                    [useraddress]: res.result.user_address,
                    [username]: res.result.user_name,
                  })
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