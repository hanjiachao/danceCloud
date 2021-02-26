// pages/liveDetail/liveDetail.js
var common = require("../../utils/util.js");
var WxParse = require("../../wxParse/wxParse.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
      show: false,
      detail:{},
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      dg_id: '',
      member_status: true,
      member_discount: '',
      status: '',
      isShare:false,
      share_image:'',
      share_message:'',
      buy_prompt: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  shareSta: function () {
      this.setData({
          isShare:false
      })
  },
    shareGroup: function () {
        var that = this
        common.ajax({
            url: 'Community/shareCommunity',
            data: {
                dg_id:that.data.dg_id
            },
            userinfo:true,
            loading: '加载中...',
            success: function (res) {
                that.setData({
                    isShare: false
                })
                common.info(res.result.msg)
            }
        })
    },
  share:function () {
     this.setData({
       isShare:true
     })
  },
  next_two: function () {
      this.setData({
          member_status:true
      })
      wx.navigateTo({
          url:'../myVip/myVip'
      })
  },
    collagedetail: function () {
        wx.navigateTo({
            url:'../collagedetail/collagedetail?dg_id=' + this.data.dg_id
        })
    },
    cancelmember: function () {
        this.setData({
            member_status:true
        })
        console.log(this.data.member_status)
    },
  onLoad: function (options) {
      wx.setNavigationBarTitle({
          title: '详情'
      });
      this.setData({
          dg_id: options.dg_id
      })
      console.log(options.dg_id)
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
          url: 'DanceGroup/getDetail',
          data: {
              dg_id:options.dg_id
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
                     detail: res.result.detail,
                     member_discount:res.result.member_discount,
                     member_status: res.result.member_status,
                     status:res.result.status
                 })
                  WxParse.wxParse('article', 'html', that.data.detail.dg_detail, that,5);
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
      return {
          title: this.data.share_message,
          path: '/pages/groupDetail/groupDetail?dg_id=' + this.data.dg_id,
          imageUrl:this.data.share_image
      }
  }
})