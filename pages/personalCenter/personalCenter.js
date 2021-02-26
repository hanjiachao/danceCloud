// pages/personalCenter/personalCenter.js
var common = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name:'',
        head:'',
        mobile:'',
        showMobile:'',
        DC: false,
        isShow:false,
        isshare:true
    },
    setting: function () {
        wx.navigateTo({
            url: '../setting/setting'
        })
    },
    personalInfo: function () {
        wx.navigateTo({
            url: '../personalInfo/personalInfo?mobile=' + this.data.mobile + '&showMobile=' + this.data.showMobile + '&nickname=' + this.data.name + '&headimg=' + this.data.head
        })
    },
    myCourse: function () {
        wx.navigateTo({
            url: '../my-class/my-class'
        })
    },
    myOrder: function () {
        wx.navigateTo({
            url: '../my-order/my-order'
        })
    },
    myGroup: function () {
        wx.navigateTo({
            url: '../my-collage/my-collage'
        })
    },
    myMessage: function () {
        wx.navigateTo({
            // url: '../my-new/my-new'
            url: '../messageCenter/messageCenter'
        })
    },
    myVip: function () {
        wx.navigateTo({
            url: '../myVip/myVip'
        })
    },
    myPurse: function () {
        wx.navigateTo({
            url: '../myPurse/myPurse'
        })
    },
    myCollect: function () {
        wx.navigateTo({
            url: '../my-collection/my-collection'
        })
    },
    myCoupon: function () {
        wx.navigateTo({
            url: '../coupon/coupon'
        })
    },
  myStep: function () {
    wx.navigateTo({
      url: '../myStep/myStep'
    })
  },
    DC: function () {
        if(!this.data.DC){
            wx.navigateTo({
                url: '../DCspokesperson/DCspokesperson'
            })
        }else{
            wx.navigateTo({
                url: '../DC-pay-success/DC-pay-success'
            })
        }
    },
    share: function () {
        wx.navigateTo({
            url: '../share/share'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        common.ajax({
            url: 'User/getUserData',
            data: {},
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    that.setData({
                        name: res.result.nickname,
                        head: res.result.headimg,
                        mobile: res.result.mobile,
                        showMobile: res.result.mobile_show,
                        DC: res.result.spokesman
                    })
                    if (!res.result.spokesman && !res.result.member) {
                      that.setData({
                          isshare:false
                      })
                    }
                    that.setData({
                        isShow:true
                    })
                } else {
                    that.setData({
                        isShow:true
                    })
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
        this.onLoad()
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
      console.log(8888888888)
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