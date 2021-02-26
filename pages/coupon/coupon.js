// pages/coupon/coupon.js
var common = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        start: 0,
        limit: '',
        list: [],
        refresh: true,
        isShow: false,
        price: ''
    },
    couponClick: function (e) {
        console.log(e)
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        if (prevPage.route == 'pages/collagedetail/collagedetail' || prevPage.route == 'pages/classdetail/classdetail') {
            var coupon_id = 'info.coupon_id'
            prevPage.setData({
                plusmoney: e.currentTarget.dataset.name
            })
            var money = prevPage.moneynum(true,prevPage.data.integral,prevPage.data.member)
            // var money = (parseFloat(plusmoney) - parseFloat(e.currentTarget.dataset.name)).toFixed(2)
            if (money < 0) {
                money = 0
            }
            prevPage.setData({
                [coupon_id]: e.currentTarget.dataset.id,
                 money:money
            });
            wx.navigateBack({})
        }
        if (prevPage.route == 'pages/ordersure/ordersure') {
            var uc_id = 'info.uc_id'
            var plusmoney = prevPage.moneynum(false,prevPage.data.integralsta,prevPage.data.fullpricesta,prevPage.data.membersta)
            var money = (parseFloat(plusmoney) - parseFloat(e.currentTarget.dataset.name)).toFixed(2)
            if (money < 0) {
                money = 0
            }
            prevPage.setData({
                [uc_id]: e.currentTarget.dataset.id,
                plusmoney: e.currentTarget.dataset.name,
                money:money
            });
            wx.navigateBack({})
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        var price = ''
        console.log(options.price)
        if (options.price == '' || options.price == undefined) {
            price = ''
        } else {
            price = options.price
        }
        common.ajax({
            url: 'User/getUserCoupon',
            data: {
                start: that.data.start,
                limit: that.data.limit,
                price: price
            },
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    if (that.data.start == 0) {
                        if (res.result.list.length > 0) {
                            that.setData({
                                start: res.result.list.length
                            })
                        }
                        that.setData({
                            list: res.result.list,
                            isShow: true
                        })
                    } else {
                        if (res.result.list.length > 0) {
                            that.setData({
                                start: res.result.list.length
                            })
                            var list = that.data.list
                            for (var i = 0; i < res.result.list.length; i++) {
                                list.push(res.result.list[i])
                            }
                            that.setData({
                                list: list
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})