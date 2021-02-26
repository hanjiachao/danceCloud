// pages/my-class/my-class.js
var common = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navList: ['全部','待付款','已付款','已取消'],
        navIndex: 0,
        start: 0,
        limit: 6,
        refresh: true,
        isShow: false,
        showCancel: false,
        showDel: false,
        order: '',
        index: '',
        show:false,
        ajaxshoping:true
    },

    lessonVideo: function (e) {
        var id = e.target.dataset.id
        var order = e.target.dataset.order
        // wx.navigateTo({
        //     url: '../lessonVideo/lessonVideo?id=' + id
        // })
        wx.navigateTo({
            url: '../coursesList/coursesList?order=' + order
        })
    },
    detail: function (e) {
        var order = e.currentTarget.dataset.order
        wx.navigateTo({
            url: '../class-detail/class-detail?order=' + order
        })
    },
    pay: function (e) {
        var order = e.target.dataset.order
        wx.navigateTo({
            url: '../payLesson/payLesson?order=' + order
        })
    },
    hideDel: function () {
        this.setData({
            showDel: false
        })
    },
    showDel: function (e) {
        var order = e.target.dataset.order
        var index = e.target.dataset.index
        this.setData({
            showDel: true,
            order: order,
            index: index
        })
    },
    del: function () {
        var list = this.data.list
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
                    list.splice(that.data.index,1)
                    that.setData({
                        list: list,
                        showDel: false
                    })
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
    showCancel: function (e) {
        var order = e.target.dataset.order
        var index = e.target.dataset.index
        this.setData({
            showCancel: true,
            order: order,
            index: index
        })
    },
    cancel: function () {
        var item = 'list['+this.data.index+'].status'
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
                        showCancel: false,
                        [item]: '已取消'
                    })
                } else {
                    common.info(res.result.msg)
                }
            }
        })
    },
    changeNav: function (e) {
        var index = e.target.dataset.index
        this.setData({
            navIndex: index
        })
        this.reload()
    },
    reload: function () {
        this.setData({
            start: 0,
            refresh: true
        })
        this.getList()
    },
    getList: function () {
        var that = this;
        if (!that.data.ajaxshoping) {
            return false
        }
        that.setData({
            ajaxshoping:false
        })
        common.ajax({
            url: 'User/getMyDanceCourse',
            data: {
                start: that.data.start,
                limit: that.data.limit,
                type: that.data.navList[that.data.navIndex]
            },
            // loading: '加载中...',
            userinfo: true,
            success: function (res) {
                console.log(res)
                that.setData({
                    ajaxshoping:true
                })
                if (res.status == 'SUCCESS') {
                    if (that.data.start == 0) {
                        that.setData({
                            list: res.result.list,
                            start: res.result.list.length,
                            isShow: true
                        })
                    } else {
                        if (res.result.list.length > 0) {
                            var list = that.data.list
                            for (var i = 0; i < res.result.list.length; i++) {
                                list.push(res.result.list[i])
                            }
                            that.setData({
                                list: list,
                                start: that.data.start + res.result.list.length
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
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        this.reload()
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
        this.reload()
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.refresh) {
            this.getList()
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})