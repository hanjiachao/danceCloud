// pages/DC-pay/DC-pay.js
var common = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        choice: 0
    },

    pay: function () {
        var id = this.data.list[this.data.choice].ds_id
        var that = this;
        common.ajax({
            url: 'Member/dcPay',
            data: {
                ds_id: id
            },
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    wx.requestPayment({
                        'timeStamp': res.result.wxpay_data.timeStamp.toString(),
                        'nonceStr': res.result.wxpay_data.nonceStr,
                        'package': res.result.wxpay_data.package,
                        'signType': res.result.wxpay_data.signType,
                        'paySign': res.result.wxpay_data.paySign,
                        'success':function(res){
                            wx.redirectTo({
                                url: '../DC-pay-success/DC-pay-success'
                            })
                        },
                        'fail':function(res){},
                        'complete':function(res){}
                    })
                } else {
                    common.info(res.result.msg)
                }
            }
        })
    },
    choice: function (e) {
        var index = e.currentTarget.dataset.i
        this.setData({
            choice: index
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        common.ajax({
            url: 'Member/getDcSpokesmanlist',
            data: {},
            loading: '加载中...',
            userinfo: false,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    that.setData({
                        list: res.result.list
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