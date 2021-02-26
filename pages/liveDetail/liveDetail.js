// pages/liveDetail/liveDetail.js
var common = require("../../utils/util.js");
var WxParse = require("../../wxParse/wxParse.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
      detail:{},
      indicatorDots: true,
      isIos: false,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      collect_status: '',
      dc_id: '',
      member_discount: '',
      show:false,
      sharebtn: false,
      share_image:'',
      share_message:'',
      member_status: true,
      order_no:'',
      buy_prompt: ''
  },
    canvideo:function () {
        wx.navigateTo({
            url:'../coursesList/coursesList?order=' + this.data.order_no + '&nowprice=' + this.data.detail.dc_now_price + '&dc_id=' + this.data.dc_id
        })
    },
    cancelmember: function () {
        this.setData({
            member_status:true
        })
        // console.log(this.data.member_status)
    },
    next_two: function () {
        this.setData({
            member_status:true
        })
        wx.navigateTo({
            url:'../myVip/myVip'
        })
    },
    shareSta: function () {
        this.setData({
            sharebtn:false
        })
    },
    shareGroup: function () {
        var that = this
        common.ajax({
            url: 'Community/shareCommunity',
            data: {
                dc_id:that.data.dc_id
            },
            userinfo:true,
            loading: '加载中...',
            success: function (res) {
                that.setData({
                    sharebtn: false
                })
                common.info(res.result.msg)
            }
        })
    },
    share: function () {
       this.setData({
           sharebtn:true
       })
    },
    collect: function () {
      var that = this
        common.ajax({
            url: 'DanceCourse/collect',
            data: {
                dc_id:that.data.dc_id
            },
            userinfo:true,
            loading: '加载中...',
            success: function (res) {
                that.setData({
                    show: true
                })
                if (res.status != 'SUCCESS') {
                    common.info(res.result.msg)
                } else {
                    common.info(res.result.msg)
                    if (res.result.msg == '收藏成功') {
                        that.setData({
                            collect_status: true
                        })
                    } else {
                        that.setData({
                            collect_status: false
                        })
                    }

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
          title: '详情'
      });
    wx.getSystemInfo({
      success(res) {
        console.log(res.platform)
        if (res.platform == "ios") {
          that.setData({
            isIos: true
          })
        }
      }
    })
      // console.log(options.dc_id)
      this.setData({
          dc_id: options.dc_id
      })
      var that = this
      common.ajax({
          url:'Index/getShareMessage',
          loading: '加载中...',
          success: function (res) {
              that.setData({
                  share_image:res.result.share_image,
                  share_message:res.result.share_message
              })
          }
      })
    common.ajax({
      url: 'Index/getBuyPrompt',
      loading: '加载中...',
      success: function (res) {
        that.setData({
          buy_prompt: res.result.buy_prompt
        })
      }
    })
      common.ajax({
          url: 'DanceCourse/getDetail',
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
                  common.info(res.result.msg)
              } else {
                 that.setData({
                     member_status: res.result.member_status,
                     detail: res.result.detail,
                     member_discount: res.result.member_discount,
                     collect_status: res.result.collect_status,
                     order_no:res.result.order_no
                 })
                  WxParse.wxParse('article', 'html', that.data.detail.dc_detail, that,5);
              }
          }
      })
  },
    menu: function () {
        wx.navigateTo({
            url:'../classdetail/classdetail?dc_id=' + this.data.dc_id
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
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: this.data.share_message,
            path: '/pages/liveDetail/liveDetail?dc_id=' + this.data.dc_id,
            // imageUrl:this.data.share_image
            imageUrl: ''
        }
    }
})