// pages/class-detail/class-detail.js
var common = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detail:{},
        showDel: false,
        showCancel: false,
        order: '',
        show:false
    },

    pay: function (e) {
        var order = e.target.dataset.order
        wx.navigateTo({
            url: '../payLesson/payLesson?order=' + order
        })
    },
    lessonVideo: function (e) {
        var order = e.target.dataset.order
        wx.navigateTo({
            // url: '../lessonVideo/lessonVideo?id=' + this.data.detail.vid
            url: '../coursesList/coursesList?order=' + order
        })
    },
    hideDel: function () {
        this.setData({
            showDel: false
        })
    },
    showDel: function () {
        this.setData({
            showDel: true
        })
    },
    del: function () {
        var that = this;
        common.ajax({
            url: 'User/delDanceOrder',
            data: {
                order_no: that.data.order
            },
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    common.info(res.result.msg)
                    that.setData({
                        showDel: false
                    })
                    setTimeout(function () {
                        wx.navigateBack()
                    },1500)
                } else {
                    common.info(res.result.msg)
                }
            }
        })
    },
    hideCancel: function () {
        this.setData({
            showCancel: false
        })
    },
    showCancel: function () {
        this.setData({
            showCancel: true
        })
    },
    cancel: function () {
        var that = this;
        common.ajax({
            url: 'User/cancelDanceOrder',
            data: {
                order_no: that.data.order
            },
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                if (res.status == 'SUCCESS') {
                    common.info(res.result.msg)
                    that.setData({
                        showCancel: false
                    })
                    setTimeout(function () {
                        wx.navigateBack()
                    },1500)
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
        var order = options.order
        var that = this;
        common.ajax({
            url: 'User/getDanceCourseDetail',
            data: {
                order_no: order
            },
            loading: '加载中...',
            userinfo: true,
            success: function (res) {
                that.setData({
                    show:true
                })
                if (res.status == 'SUCCESS') {
                    that.setData({
                        detail: res.result.detail,
                        order: order
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