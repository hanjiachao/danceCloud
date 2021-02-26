// pages/ordersure/ordersure.js
var common = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      show: false,
      list:{},
      address: {},
      is_member: '',
      integral: '',
      detail:{},
      membersta: false,
      nousermoney: '',
      membershow: false,
      fullpricesta:true,
      integralsta: false,
      money: '',
      info: {
          remark: '',
          order_no: '',
          ua_id: '',
          pay_price: 0.01,
          is_integral: '',
          uc_id: ''
      },
      confirmshow: false,
      coupon_status: '',
      plusmoney: ''
  },
    voucher: function () {
        if (!this.data.coupon_status) {
            return false
        }
        if (this.data.money == 0) {
            return false
        }
        wx.navigateTo({
            url:'../coupon/coupon?price=' + this.data.list.price
        })
    },
    moneynum: function (coupon_status,integralsta,fullpricesta,membersta) {
      console.log(coupon_status)
      console.log(integralsta)
      console.log(fullpricesta)
      console.log(membersta)
      var money = ''
      var menbernum = parseFloat(this.data.list.price)* parseFloat(this.data.list.gor_member_discount)
        // console.log(menbernum)
        if (membersta) {
            if (integralsta) {
                money = (menbernum - parseFloat(this.data.list.gor_integral_price)).toFixed(2)
                if (fullpricesta) {
                    money = (parseFloat(money) - parseFloat(this.data.list.gor_full_price)).toFixed(2)
                    if (this.data.plusmoney != '' && coupon_status) {
                        money = (parseFloat(money) - this.data.plusmoney).toFixed(2)
                    }
                    if (money < 0) {
                        return 0
                    } else {
                        return money
                    }
                } else {
                    if (this.data.plusmoney != '' && coupon_status) {
                        money = (parseFloat(money) - this.data.plusmoney).toFixed(2)
                    }
                    if (money < 0) {
                        return 0
                    } else {
                        return money
                    }
                }
            } else {
                money = (menbernum).toFixed(2)
                if (fullpricesta) {
                    money = (parseFloat(money) - parseFloat(this.data.list.gor_full_price)).toFixed(2)
                    if (this.data.plusmoney != '' && coupon_status) {
                        money = (parseFloat(money) - this.data.plusmoney).toFixed(2)
                    }
                    if (money < 0) {
                        return 0
                    } else {
                        return money
                    }
                } else {
                    if (this.data.plusmoney != '' && coupon_status) {
                        money = (parseFloat(money) - this.data.plusmoney).toFixed(2)
                    }
                    if (money < 0) {
                        return 0
                    } else {
                        return money
                    }
                }
            }
        } else {
            if (integralsta) {
                money = (parseFloat(this.data.list.price) - parseFloat(this.data.list.gor_integral_price)).toFixed(2)
                if (fullpricesta) {
                    money = (parseFloat(money) - parseFloat(this.data.list.gor_full_price)).toFixed(2)
                    if (this.data.plusmoney != '' && coupon_status) {
                        money = (parseFloat(money) - this.data.plusmoney).toFixed(2)
                    }
                    if (money < 0) {
                        return 0
                    } else {
                        return money
                    }
                } else {
                    if (this.data.plusmoney != '' && coupon_status) {
                        money = (parseFloat(money) - this.data.plusmoney).toFixed(2)
                    }
                    if (money < 0) {
                        return 0
                    } else {
                        return money
                    }
                }
            } else {
                money = parseFloat(this.data.list.price)
                if (fullpricesta) {
                    money = (parseFloat(money) - parseFloat(this.data.list.gor_full_price)).toFixed(2)
                    if (this.data.plusmoney != '' && coupon_status) {
                        money = (parseFloat(money) - this.data.plusmoney).toFixed(2)
                    }
                    if (money < 0) {
                        return 0
                    } else {
                        return money
                    }
                } else {
                    if (this.data.plusmoney != '' && coupon_status) {
                        money = (parseFloat(money) - this.data.plusmoney).toFixed(2)
                    }
                    if (money < 0) {
                        return 0
                    } else {
                        return money
                    }
                }
            }
        }
    },
    remark: function (e) {
        var remark = 'info.remark'
        this.setData({
            [remark]: e.detail.value
        })
    },
    surepay: function () {
        var that = this
        var ua_id = 'info.ua_id'
        var pay_price = 'info.pay_price'
        var is_integral = 'info.is_integral'
        var isinter = ''
        that.setData({
            [ua_id]:that.data.address.ua_id,
            [pay_price]: that.data.money,
            [is_integral]:isinter
        })
        if (that.data.integralsta){
            isinter = '是'
        } else {
            isinter = '否'
        }
        console.log(that.data.info.ua_id)
        if (typeof that.data.info.ua_id === 'undefined' || that.data.info.ua_id == '') {
            wx.showToast({
                title: '请填写地址信息',
                icon: 'none'
            })
            that.setData({
                confirmshow: false
            })
            return false
        }
        common.ajax({
            url: 'Goods/Pay',
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
                    var type= ''
                    if (that.data.list.gor_goods_type == '拼团') {
                        type='商品拼团'
                    } else {
                        type='商品'
                    }
                    if (res.result.order_status == '待支付') {
                        var integral = res.result.integral
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
                                        url:'../ordersuccess/ordersuccess?integral=' + integral + '&type=' + type
                                    })
                                },
                                'fail':function(res){
                                },
                                'complete':function(res){
                                }
                            })
                    } else {
                        wx.redirectTo({
                            url:'../ordersuccess/ordersuccess?integral=' + res.result.integral + '&type=' + type
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
    confirm: function () {
        this.setData({
            confirmshow: true
        })
    },
    openintegral: function () {
      if (this.data.money == 0) {
          wx.showToast({
              title: '当前支付金额已经为0',
              icon: 'none'
          })
          return false
      }
      if (parseFloat(this.data.integral) < parseFloat(this.data.list.gor_integral)) {
          wx.showToast({
              title: '你当前积分不足' + this.data.list.gor_integral,
              icon: 'none'
          })
          return false
      }
      var money = this.moneynum(this.data.coupon_status,true,this.data.fullpricesta,this.data.membersta)
      this.setData({
          integralsta: true,
          money: money
      })
    },
    closeintegral: function () {
        var money = this.moneynum(this.data.coupon_status,false,this.data.fullpricesta,this.data.membersta)
        this.setData({
            integralsta: false,
            money: money
        })
    },
    closeprice: function () {
        var money = this.moneynum(this.data.coupon_status,this.data.integralsta,false,this.data.membersta)
        this.setData({
            fullpricesta: false,
            money:money
        })
    },
    openprice: function () {
        if (this.data.money == 0) {
            wx.showToast({
                title: '当前支付金额已经为0',
                icon: 'none'
            })
            return false
        }
        var money = this.moneynum(this.data.coupon_status,this.data.integralsta,true,this.data.membersta)
        this.setData({
            fullpricesta: true,
            money: money
        })
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
  /**
   * 生命周期函数--监听页面加载
   */
    openser: function () {
      if (this.data.money == 0) {
          wx.showToast({
              title: '当前价格已经为0',
              icon: 'none'
          })
          return false
      }
      if (this.data.is_member == 0) {
          this.setData({
              membershow: true
          })
          return false
      }
      var money = this.moneynum(this.data.coupon_status,this.data.integralsta,this.data.fullpricesta,true)
      this.setData({
          membersta: true,
          money: money
      })
    },
    closeuser: function () {
        if (this.data.is_member == 1) {
            return false
        }
        var money = this.moneynum(this.data.coupon_status,this.data.integralsta,this.data.fullpricesta,false)
        this.setData({
            membersta: false,
            money: money
        })
    },
  onLoad: function (options) {
      var that = this
      var order_no = 'info.order_no'
      that.setData({
          [order_no]:options.order_no
      })
      console.log(options.order_no)
      common.ajax({
          url: 'Goods/getGoodsOrderDetail',
          data: {
              order_no:options.order_no
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
              if (res.result.is_member == 1) {
                  var money = (parseFloat(res.result.list.price) * parseFloat(res.result.list.gor_member_discount)).toFixed(2)
                  that.setData({
                      membersta: true,
                      money:money
                  })
              } else {
                  that.setData({
                      money:res.result.list.price
                  })
              }
              var nummoney = (parseFloat(that.data.money) - parseFloat(res.result.list.gor_full_price)).toFixed(2)
                  if (nummoney < 0) {
                      nummoney = 0
                  }
              that.setData({
                  money:nummoney
              })
                that.setData({
                    list:res.result.list,
                    address: res.result.address,
                    is_member: res.result.is_member,
                    integral: res.result.integral,
                    detail: res.result.list.detail,
                    coupon_status: res.result.coupon_status
                })
              }
          }
      })
  },
    addressmanger: function () {
        wx.navigateTo({
            url:'../addressBook/addressBook'
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