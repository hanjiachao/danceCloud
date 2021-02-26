// pages/myVip/myVip.js
var common = require("../../utils/util.js");
var WxParse = require('../../wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        levelList: [],
        level: '',
        vipTime: '',
        score: '',
        content: '',
        btnText: '',
        total: '',
        percent: '',
        levelImgList: ['../../images/a_121.png','../../images/a_123.png','../../images/a_125.png','../../images/a_127.png'],
        imgIndex: 0,
        isShow: false,
        background: ''
    },

    pay: function () {
        var that = this;
        common.ajax({
            url: 'Member/memberPay',
            data: {},
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    var msg = res.result.msg
                    wx.requestPayment({
                        'timeStamp': res.result.wxpay_data.timeStamp.toString(),
                        'nonceStr': res.result.wxpay_data.nonceStr,
                        'package': res.result.wxpay_data.package,
                        'signType': res.result.wxpay_data.signType,
                        'paySign': res.result.wxpay_data.paySign,
                        'success':function(res){
                            common.info(msg)
                            that.onLoad()
                            var pages = getCurrentPages();
                            var prevPage = pages[pages.length - 2];
                            if (prevPage.route == 'pages/ordersure/ordersure') {
                                var money = prevPage.moneynum(prevPage.data.coupon_status,prevPage.data.integralsta,prevPage.data.fullpricesta,true)
                                prevPage.setData({
                                    is_member: 1,
                                    money:money,
                                    membersta:true
                                });
                                wx.navigateBack({})
                            }
                            if (prevPage.route == 'pages/collagedetail/collagedetail' || prevPage.route == 'pages/classdetail/classdetail') {
                                var money = prevPage.moneynum(prevPage.data.coupon_status,prevPage.data.integral,true)
                                prevPage.setData({
                                    member: true,
                                    money: money,
                                    member_status: true
                                });
                                wx.navigateBack({})
                            }
                        },
                        'fail':function(res){},
                        'complete':function(res){
                            that.onLoad()
                        }
                    })
                } else {
                    common.info(res.result.msg)
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        common.ajax({
            url: 'Member/index',
            data: {},
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    if(res.result.member_grade == '小白'){
                        var btnText = '开通'
                    }else{
                        var btnText = '续费'
                    }
                    if(res.result.member_score < 1000){
                        var total = 1000
                        var index = 0
                    }else if(res.result.member_score < 2000){
                        var total = 2000
                        var index = 1
                    }else{
                        var total = 3000
                        if(res.result.member_score < 3000){
                            var index = 2
                        }else{
                            var index = 3
                        }
                    }
                    var percent = res.result.member_score / total * 100
                    if(percent > 100){
                        percent = 100
                    }
                    that.setData({
                        background: res.result.member_background,
                        levelList: res.result.member_list,
                        level: res.result.member_grade,
                        vipTime: res.result.member_end_time,
                        score: res.result.member_score,
                        content: WxParse.wxParse('content', 'html', res.result.message, that, 5),
                        btnText: btnText,
                        total: total,
                        percent: percent,
                        imgIndex: index,
                        isShow: true
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